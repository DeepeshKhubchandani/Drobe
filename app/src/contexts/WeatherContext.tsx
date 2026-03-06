import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WeatherData } from '../lib/types';
import { WeatherService } from '../services/weather';
import { useAuth } from './AuthContext';

interface WeatherContextType {
  weather: WeatherData | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    if (!profile?.location) return;

    setIsLoading(true);
    const { weather: fetchedWeather } = await WeatherService.getWeather(
      profile.location
    );
    setWeather(fetchedWeather);
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile?.location) {
      refresh();
    }
  }, [profile?.location]);

  return (
    <WeatherContext.Provider value={{ weather, isLoading, refresh }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
}
