import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useViewportOffset } from '../../../hooks/useViewportOffset';
import logoImg from '../../../assets/logo.png';

interface AuthScreenProps {
  onSuccess: () => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { signIn, signUp } = useAuth();
  const bottomOffset = useViewportOffset();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password);

    setIsLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #2c2318 60%, #3d2e1a 100%)' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-[#C9A96E]" />
        <div className="absolute top-32 left-20 w-48 h-48 rounded-full border border-[#C9A96E]" />
        <div className="absolute bottom-40 right-5 w-72 h-72 rounded-full border border-[#C9A96E]" />
      </div>

      {/* Top section */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 w-full max-w-sm"
        style={{ paddingBottom: `${bottomOffset + 20}px` }}
      >
        {/* Logo */}
        <div className="mb-8" style={{ width: 280 }}>
          <img
            src={logoImg}
            alt="Drobe"
            style={{
              width: '100%',
              filter: 'brightness(0) invert(1)',
              opacity: 0.95,
            }}
          />
        </div>

        <h2 style={{ color: '#C9A96E', fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 15,
              marginBottom: 12,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 15,
              marginBottom: 20,
            }}
          />

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 12 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #C9A96E, #e8c98a)',
              color: '#1a1a1a',
              fontSize: 16,
              fontWeight: 600,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={{
            marginTop: 16,
            color: '#C9A96E',
            fontSize: 14,
          }}
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
