import { supabase } from '../lib/supabase';
import type { WeatherData } from '../lib/types';

export class WeatherService {
  private static cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private static CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Get weather for location
   */
  static async getWeather(location: string): Promise<{
    weather: WeatherData | null;
    error?: string;
  }> {
    try {
      console.log('WeatherService: Fetching weather for location:', location);

      // Check cache
      const cached = this.cache.get(location);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('WeatherService: Returning cached weather');
        return { weather: cached.data };
      }

      // Call edge function
      console.log('WeatherService: Calling get-weather edge function...');
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { location },
      });

      console.log('WeatherService: Response:', { data, error });

      if (error) {
        console.error('WeatherService: Error fetching weather:', error);
        return { weather: null, error: error.message };
      }

      // Cache result
      this.cache.set(location, { data: data.weather, timestamp: Date.now() });

      console.log('WeatherService: Success! Weather:', data.weather);
      return { weather: data.weather };
    } catch (error) {
      console.error('WeatherService: Exception in getWeather:', error);
      return { weather: null, error: 'Failed to fetch weather' };
    }
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
