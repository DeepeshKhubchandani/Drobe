import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/types';
import { AuthService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    AuthService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        AuthService.getProfile(currentUser.id).then(setProfile);
      }
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const { data } = AuthService.onAuthStateChange(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newProfile = await AuthService.getProfile(newUser.id);
        setProfile(newProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: newUser, error } = await AuthService.signIn(email, password);
    if (newUser) {
      setUser(newUser);
      const newProfile = await AuthService.getProfile(newUser.id);
      setProfile(newProfile);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { user: newUser, error } = await AuthService.signUp(email, password);
    if (newUser) {
      setUser(newUser);
      const newProfile = await AuthService.getProfile(newUser.id);
      setProfile(newProfile);
    }
    return { error };
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;
    const result = await AuthService.updateProfile(user.id, updates);
    if (result.success && profile) {
      setProfile({ ...profile, ...updates });
    }
    return result.success;
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
