export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string | null;
  location: string | null;
  style_preferences: Record<string, any>;
}

export interface WardrobeItem {
  id: string;
  user_id: string;
  created_at: string;
  photo_url: string;
  thumbnail_url: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories';
  subcategory: string | null;
  colors: string[];
  seasons: string[];
  formality: 'casual' | 'smart_casual' | 'formal' | null;
  worn_count: number;
  last_worn_date: string | null;
  ai_metadata: Record<string, any>;
}

export interface Outfit {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  occasion: string | null;
  item_ids: string[];
  ai_reasoning: string | null;
  is_favorite: boolean;
  weather_conditions: Record<string, any> | null;
}

export interface PlannedOutfit {
  id: string;
  user_id: string;
  outfit_id: string;
  planned_date: string;
  event_name: string | null;
  event_time: string | null;
}

export interface OutfitWithItems extends Outfit {
  items: WardrobeItem[];
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  description: string;
  precipitation_probability: number;
  wind_speed: number;
  icon: string;
  location?: string;
}

export interface ClothingAnalysis {
  category: string;
  subcategory: string;
  colors: string[];
  seasons: string[];
  formality: string;
  patterns: string[];
  style_notes: string;
}
