import { supabase } from '../lib/supabase';
import type { ClothingAnalysis, WardrobeItem, WeatherData } from '../lib/types';

export interface OutfitSuggestion {
  name: string;
  items: WardrobeItem[];
  reasoning: string;
  occasion: string;
}

export class AIService {
  /**
   * Analyze clothing item using Claude Vision
   */
  static async analyzeClothing(
    imageUrl: string
  ): Promise<{ analysis: ClothingAnalysis | null; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { imageUrl },
      });

      if (error) {
        console.error('Error analyzing clothing:', error);
        return { analysis: null, error: error.message };
      }

      return { analysis: data.analysis };
    } catch (error) {
      console.error('Exception in analyzeClothing:', error);
      return { analysis: null, error: 'Failed to analyze clothing' };
    }
  }

  /**
   * Get outfit suggestions based on occasion and weather
   */
  static async suggestOutfits(
    occasion: string,
    weather: WeatherData | null,
    wardrobeItems: WardrobeItem[]
  ): Promise<{ suggestions: OutfitSuggestion[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('suggest-outfits', {
        body: {
          occasion,
          weather,
          wardrobeItems: wardrobeItems.map((item) => ({
            id: item.id,
            category: item.category,
            subcategory: item.subcategory,
            colors: item.colors,
            formality: item.formality,
            photo_url: item.photo_url,
          })),
        },
      });

      if (error) {
        console.error('Error getting outfit suggestions:', error);
        return { suggestions: [], error: error.message };
      }

      return { suggestions: data.suggestions };
    } catch (error) {
      console.error('Exception in suggestOutfits:', error);
      return { suggestions: [], error: 'Failed to get outfit suggestions' };
    }
  }
}
