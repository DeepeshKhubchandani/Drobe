# Drobe MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Figma-generated React code into a fully functional AI-powered wardrobe management PWA

**Architecture:** React + TypeScript + Vite frontend with Supabase backend (database, auth, storage, edge functions). Claude API for vision and outfit suggestions. OpenWeatherMap for weather data. Client-side image processing before upload.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase, Claude API, OpenWeatherMap API

**Starting Point:** Figma Code folder contains UI components and mock data. We'll preserve the UI and connect to real backend.

---

## Phase 1: Foundation & Configuration

### Task 1: Environment Setup

**Files:**
- Create: `.env.local`
- Create: `.env.example`
- Modify: `package.json`

**Step 1: Add Supabase client dependency**

```bash
npm install @supabase/supabase-js
```

Expected: Package installed successfully

**Step 2: Create environment template**

Create `.env.example`:
```
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# APIs (used in Edge Functions, not exposed to client)
# These go in Supabase Edge Function secrets
ANTHROPIC_API_KEY=your_anthropic_key
OPENWEATHER_API_KEY=your_openweather_key
```

**Step 3: Create actual .env.local file**

USER ACTION REQUIRED: Copy `.env.example` to `.env.local` and fill in:
- `VITE_SUPABASE_URL` from Supabase project settings
- `VITE_SUPABASE_ANON_KEY` from Supabase project settings

**Step 4: Update .gitignore**

Add to `.gitignore`:
```
.env.local
.env
```

**Step 5: Verify setup**

Run: `npm run dev`
Expected: Vite dev server starts without errors

---

### Task 2: Supabase Database Schema

**Files:**
- Create: `supabase/migrations/20260305000001_initial_schema.sql`

USER ACTION REQUIRED: Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  location TEXT,
  style_preferences JSONB DEFAULT '{}'::jsonb
);

-- Wardrobe items table
CREATE TABLE wardrobe_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'outerwear', 'shoes', 'accessories')),
  subcategory TEXT,
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  seasons TEXT[] DEFAULT ARRAY[]::TEXT[],
  formality TEXT CHECK (formality IN ('casual', 'smart_casual', 'formal')),
  worn_count INTEGER DEFAULT 0,
  last_worn_date DATE,
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

-- Outfits table
CREATE TABLE outfits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  occasion TEXT,
  item_ids UUID[] NOT NULL,
  ai_reasoning TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  weather_conditions JSONB
);

-- Planned outfits table
CREATE TABLE planned_outfits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  planned_date DATE NOT NULL,
  event_name TEXT,
  event_time TIME
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_outfits ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Wardrobe items policies
CREATE POLICY "Users can view own wardrobe items" ON wardrobe_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items" ON wardrobe_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items" ON wardrobe_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items" ON wardrobe_items
  FOR DELETE USING (auth.uid() = user_id);

-- Outfits policies
CREATE POLICY "Users can view own outfits" ON outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits" ON outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits" ON outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits" ON outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Planned outfits policies
CREATE POLICY "Users can view own planned outfits" ON planned_outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planned outfits" ON planned_outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planned outfits" ON planned_outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own planned outfits" ON planned_outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_outfits_user_id ON outfits(user_id);
CREATE INDEX idx_planned_outfits_user_id ON planned_outfits(user_id);
CREATE INDEX idx_planned_outfits_date ON planned_outfits(planned_date);
```

**Step 2: Create storage bucket**

USER ACTION REQUIRED: In Supabase Dashboard → Storage:
1. Create new bucket named `wardrobe-photos`
2. Set to Public
3. Add policy: "Users can upload own photos"
   ```sql
   CREATE POLICY "Users can upload own photos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
   ```
4. Add policy: "Users can view own photos"
   ```sql
   CREATE POLICY "Users can view own photos"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'wardrobe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
   ```
5. Add policy: "Public can view photos" (for public access)
   ```sql
   CREATE POLICY "Public can view photos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'wardrobe-photos');
   ```

---

## Phase 2: Service Layer

### Task 3: Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/types.ts`

**Step 1: Create TypeScript types**

Create `src/lib/types.ts`:
```typescript
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
```

**Step 2: Create Supabase client**

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3: Verify**

Add to `src/main.tsx` temporarily to test:
```typescript
import { supabase } from './lib/supabase';
console.log('Supabase client initialized:', supabase);
```

Run: `npm run dev`
Expected: No errors, console shows Supabase client object

Remove test code from `src/main.tsx` after verification.

---

### Task 4: Image Processing Service

**Files:**
- Create: `src/services/image.ts`

**Step 1: Create image service**

Create `src/services/image.ts`:
```typescript
export class ImageService {
  /**
   * Resize image to target dimensions while maintaining aspect ratio
   */
  static async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.82
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate thumbnail from image file
   */
  static async generateThumbnail(file: File): Promise<Blob> {
    return this.resizeImage(file, 300, 300, 0.8);
  }

  /**
   * Process image for wardrobe upload (main + thumbnail)
   */
  static async processWardrobeImage(file: File): Promise<{
    main: Blob;
    thumbnail: Blob;
  }> {
    const [main, thumbnail] = await Promise.all([
      this.resizeImage(file, 800, 800, 0.82),
      this.generateThumbnail(file),
    ]);

    return { main, thumbnail };
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload a JPEG, PNG, or WebP image',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image must be smaller than 10MB',
      };
    }

    return { valid: true };
  }
}
```

**Step 2: Test image processing**

Create test file `src/services/__tests__/image.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { ImageService } from '../image';

describe('ImageService', () => {
  it('validates image files correctly', () => {
    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = ImageService.validateImageFile(validFile);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid file types', () => {
    const invalidFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const result = ImageService.validateImageFile(invalidFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JPEG, PNG, or WebP');
  });
});
```

NOTE: For MVP, we'll skip unit tests and do manual testing in the browser.

---

### Task 5: Auth Service

**Files:**
- Create: `src/services/auth.ts`

**Step 1: Create auth service**

Create `src/services/auth.ts`:
```typescript
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/types';

export class AuthService {
  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string): Promise<{
    user: User | null;
    error: Error | null;
  }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: new Error(error.message) };
    }

    return { user: data.user, error: null };
  }

  /**
   * Sign in existing user
   */
  static async signIn(email: string, password: string): Promise<{
    user: User | null;
    error: Error | null;
  }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: new Error(error.message) };
    }

    return { user: data.user, error: null };
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Get current user's profile
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
}
```

---

### Task 6: Wardrobe Service

**Files:**
- Create: `src/services/wardrobe.ts`

**Step 1: Create wardrobe service**

Create `src/services/wardrobe.ts`:
```typescript
import { supabase } from '../lib/supabase';
import type { WardrobeItem } from '../lib/types';
import { ImageService } from './image';

export class WardrobeService {
  /**
   * Get all wardrobe items for user
   */
  static async getWardrobeItems(userId: string): Promise<WardrobeItem[]> {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wardrobe items:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Upload image to Supabase Storage
   */
  private static async uploadImage(
    userId: string,
    blob: Blob,
    filename: string
  ): Promise<string | null> {
    const path = `${userId}/${Date.now()}-${filename}`;

    const { data, error } = await supabase.storage
      .from('wardrobe-photos')
      .upload(path, blob, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wardrobe-photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  /**
   * Add new wardrobe item
   */
  static async addWardrobeItem(
    userId: string,
    imageFile: File,
    metadata?: Partial<WardrobeItem>
  ): Promise<{ item: WardrobeItem | null; error?: string }> {
    try {
      // Validate image
      const validation = ImageService.validateImageFile(imageFile);
      if (!validation.valid) {
        return { item: null, error: validation.error };
      }

      // Process image
      const { main, thumbnail } = await ImageService.processWardrobeImage(imageFile);

      // Upload both versions
      const [photoUrl, thumbnailUrl] = await Promise.all([
        this.uploadImage(userId, main, 'main.webp'),
        this.uploadImage(userId, thumbnail, 'thumb.webp'),
      ]);

      if (!photoUrl || !thumbnailUrl) {
        return { item: null, error: 'Failed to upload images' };
      }

      // Create database record
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
          user_id: userId,
          photo_url: photoUrl,
          thumbnail_url: thumbnailUrl,
          category: metadata?.category || 'tops',
          subcategory: metadata?.subcategory,
          colors: metadata?.colors || [],
          seasons: metadata?.seasons || [],
          formality: metadata?.formality,
          ai_metadata: metadata?.ai_metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating wardrobe item:', error);
        return { item: null, error: error.message };
      }

      return { item: data };
    } catch (error) {
      console.error('Error in addWardrobeItem:', error);
      return { item: null, error: 'Failed to add item' };
    }
  }

  /**
   * Delete wardrobe item
   */
  static async deleteWardrobeItem(itemId: string): Promise<boolean> {
    // TODO: Also delete images from storage
    const { error } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      return false;
    }

    return true;
  }

  /**
   * Update wardrobe item
   */
  static async updateWardrobeItem(
    itemId: string,
    updates: Partial<WardrobeItem>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('wardrobe_items')
      .update(updates)
      .eq('id', itemId);

    if (error) {
      console.error('Error updating item:', error);
      return false;
    }

    return true;
  }

  /**
   * Increment wear count
   */
  static async incrementWearCount(itemId: string): Promise<boolean> {
    const { error } = await supabase.rpc('increment_wear_count', {
      item_id: itemId,
    });

    if (error) {
      // Fallback: fetch current count and update
      const { data: item } = await supabase
        .from('wardrobe_items')
        .select('worn_count')
        .eq('id', itemId)
        .single();

      if (item) {
        return this.updateWardrobeItem(itemId, {
          worn_count: (item.worn_count || 0) + 1,
          last_worn_date: new Date().toISOString().split('T')[0],
        } as Partial<WardrobeItem>);
      }

      return false;
    }

    return true;
  }
}
```

---

### Task 7: Outfit Service

**Files:**
- Create: `src/services/outfits.ts`

**Step 1: Create outfit service**

Create `src/services/outfits.ts`:
```typescript
import { supabase } from '../lib/supabase';
import type { Outfit, OutfitWithItems, PlannedOutfit } from '../lib/types';

export class OutfitService {
  /**
   * Get all outfits for user with items populated
   */
  static async getOutfits(userId: string): Promise<OutfitWithItems[]> {
    const { data: outfits, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }

    if (!outfits || outfits.length === 0) {
      return [];
    }

    // Fetch all wardrobe items for these outfits
    const allItemIds = outfits.flatMap((o) => o.item_ids);
    const uniqueItemIds = [...new Set(allItemIds)];

    const { data: items } = await supabase
      .from('wardrobe_items')
      .select('*')
      .in('id', uniqueItemIds);

    const itemsMap = new Map((items || []).map((item) => [item.id, item]));

    // Populate items for each outfit
    return outfits.map((outfit) => ({
      ...outfit,
      items: outfit.item_ids
        .map((id) => itemsMap.get(id))
        .filter((item) => item !== undefined),
    })) as OutfitWithItems[];
  }

  /**
   * Save new outfit
   */
  static async saveOutfit(
    userId: string,
    itemIds: string[],
    name: string,
    occasion?: string,
    aiReasoning?: string,
    weatherConditions?: Record<string, any>
  ): Promise<{ outfit: Outfit | null; error?: string }> {
    const { data, error } = await supabase
      .from('outfits')
      .insert({
        user_id: userId,
        item_ids: itemIds,
        name,
        occasion,
        ai_reasoning: aiReasoning,
        weather_conditions: weatherConditions,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving outfit:', error);
      return { outfit: null, error: error.message };
    }

    return { outfit: data };
  }

  /**
   * Toggle outfit favorite status
   */
  static async toggleFavorite(outfitId: string): Promise<boolean> {
    // Get current favorite status
    const { data: outfit } = await supabase
      .from('outfits')
      .select('is_favorite')
      .eq('id', outfitId)
      .single();

    if (!outfit) {
      return false;
    }

    const { error } = await supabase
      .from('outfits')
      .update({ is_favorite: !outfit.is_favorite })
      .eq('id', outfitId);

    if (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }

    return true;
  }

  /**
   * Get planned outfits for date range
   */
  static async getPlannedOutfits(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<PlannedOutfit[]> {
    const { data, error } = await supabase
      .from('planned_outfits')
      .select('*')
      .eq('user_id', userId)
      .gte('planned_date', startDate)
      .lte('planned_date', endDate)
      .order('planned_date', { ascending: true });

    if (error) {
      console.error('Error fetching planned outfits:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Plan outfit for specific date
   */
  static async planOutfit(
    userId: string,
    outfitId: string,
    plannedDate: string,
    eventName?: string,
    eventTime?: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('planned_outfits').insert({
      user_id: userId,
      outfit_id: outfitId,
      planned_date: plannedDate,
      event_name: eventName,
      event_time: eventTime,
    });

    if (error) {
      console.error('Error planning outfit:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Delete outfit
   */
  static async deleteOutfit(outfitId: string): Promise<boolean> {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', outfitId);

    if (error) {
      console.error('Error deleting outfit:', error);
      return false;
    }

    return true;
  }
}
```

---

### Task 8: AI Service

**Files:**
- Create: `src/services/ai.ts`

**Step 1: Create AI service (calls Edge Functions)**

Create `src/services/ai.ts`:
```typescript
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
```

NOTE: Edge Functions will be created later in Phase 3.

---

### Task 9: Weather Service

**Files:**
- Create: `src/services/weather.ts`

**Step 1: Create weather service**

Create `src/services/weather.ts`:
```typescript
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
      // Check cache
      const cached = this.cache.get(location);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { weather: cached.data };
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { location },
      });

      if (error) {
        console.error('Error fetching weather:', error);
        return { weather: null, error: error.message };
      }

      // Cache result
      this.cache.set(location, { data: data.weather, timestamp: Date.now() });

      return { weather: data.weather };
    } catch (error) {
      console.error('Exception in getWeather:', error);
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
```

---

## Phase 3: Supabase Edge Functions

USER ACTION REQUIRED: Create Edge Functions in Supabase Dashboard or using Supabase CLI.

### Task 10: Analyze Clothing Edge Function

**Location:** Supabase Dashboard → Edge Functions → New Function

**Function Name:** `analyze-clothing`

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing imageUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Claude Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'url',
                  url: imageUrl,
                },
              },
              {
                type: 'text',
                text: `Analyze this clothing item and return a JSON object with:
- category: one of [tops, bottoms, outerwear, shoes, accessories]
- subcategory: specific type (e.g., "t-shirt", "jeans", "blazer")
- colors: array of color names
- seasons: array from [spring, summer, fall, winter, all-season]
- formality: one of [casual, smart_casual, formal]
- patterns: array of patterns (e.g., "solid", "striped", "floral")
- style_notes: brief description

Return only valid JSON, no markdown.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const analysisText = data.content[0].text;

    // Parse JSON from response
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

**Environment Variables to Set in Supabase:**
- `ANTHROPIC_API_KEY` = your Anthropic API key

---

### Task 11: Suggest Outfits Edge Function

**Function Name:** `suggest-outfits`

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  try {
    const { occasion, weather, wardrobeItems } = await req.json();

    if (!occasion || !wardrobeItems) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build prompt
    const weatherContext = weather
      ? `Weather: ${weather.temp}°C, ${weather.condition}. Consider layering and weather-appropriate items.`
      : '';

    const itemsList = wardrobeItems
      .map(
        (item: any) =>
          `- ${item.subcategory || item.category} (${item.colors.join(', ')}, ${item.formality})`
      )
      .join('\n');

    const prompt = `You are a personal stylist. The user is dressing for: "${occasion}".
${weatherContext}

Their wardrobe contains:
${itemsList}

Suggest 2-3 complete outfit combinations. For each outfit:
- Give it a creative name
- List the specific items to wear (reference by category/subcategory)
- Explain why this combination works (1-2 sentences)

Return JSON array:
[
  {
    "name": "Outfit Name",
    "item_indices": [0, 2, 5],
    "reasoning": "Why this works..."
  }
]

Return only valid JSON.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const suggestionsText = data.content[0].text;
    const parsed = JSON.parse(suggestionsText);

    // Map indices back to actual items
    const suggestions = parsed.map((suggestion: any) => ({
      name: suggestion.name,
      items: suggestion.item_indices.map((idx: number) => wardrobeItems[idx]),
      reasoning: suggestion.reasoning,
      occasion,
    }));

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

### Task 12: Get Weather Edge Function

**Function Name:** `get-weather`

**Code:**
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

serve(async (req) => {
  try {
    const { location } = await req.json();

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Missing location' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format weather data
    const weather = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      precipitation_probability: data.pop || 0,
      wind_speed: data.wind.speed,
      icon: data.weather[0].icon,
    };

    return new Response(
      JSON.stringify({ weather }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

**Environment Variables to Set:**
- `OPENWEATHER_API_KEY` = your OpenWeatherMap API key

---

## Phase 4: State Management (Context Providers)

### Task 13: Auth Context

**Files:**
- Create: `src/contexts/AuthContext.tsx`

**Step 1: Create Auth Context**

Create `src/contexts/AuthContext.tsx`:
```typescript
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
```

---

### Task 14: Wardrobe Context

**Files:**
- Create: `src/contexts/WardrobeContext.tsx`

**Step 1: Create Wardrobe Context**

Create `src/contexts/WardrobeContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WardrobeItem } from '../lib/types';
import { WardrobeService } from '../services/wardrobe';
import { AIService } from '../services/ai';
import { useAuth } from './AuthContext';

interface WardrobeContextType {
  items: WardrobeItem[];
  isLoading: boolean;
  addItem: (file: File) => Promise<{ success: boolean; error?: string }>;
  deleteItem: (itemId: string) => Promise<boolean>;
  updateItem: (itemId: string, updates: Partial<WardrobeItem>) => Promise<boolean>;
  refreshItems: () => Promise<void>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshItems = async () => {
    if (!user) return;
    setIsLoading(true);
    const fetchedItems = await WardrobeService.getWardrobeItems(user.id);
    setItems(fetchedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      refreshItems();
    }
  }, [user]);

  const addItem = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    setIsLoading(true);

    // First, add item without AI analysis
    const { item, error } = await WardrobeService.addWardrobeItem(user.id, file);

    if (error || !item) {
      setIsLoading(false);
      return { success: false, error };
    }

    // Add to local state immediately
    setItems((prev) => [item, ...prev]);

    // Then analyze with AI in background
    const { analysis } = await AIService.analyzeClothing(item.photo_url);

    if (analysis) {
      // Update item with AI metadata
      const success = await WardrobeService.updateWardrobeItem(item.id, {
        category: analysis.category as any,
        subcategory: analysis.subcategory,
        colors: analysis.colors,
        seasons: analysis.seasons,
        formality: analysis.formality as any,
        ai_metadata: analysis,
      } as Partial<WardrobeItem>);

      if (success) {
        // Refresh to get updated item
        await refreshItems();
      }
    }

    setIsLoading(false);
    return { success: true };
  };

  const deleteItem = async (itemId: string): Promise<boolean> => {
    const success = await WardrobeService.deleteWardrobeItem(itemId);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
    return success;
  };

  const updateItem = async (
    itemId: string,
    updates: Partial<WardrobeItem>
  ): Promise<boolean> => {
    const success = await WardrobeService.updateWardrobeItem(itemId, updates);
    if (success) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
      );
    }
    return success;
  };

  return (
    <WardrobeContext.Provider
      value={{ items, isLoading, addItem, deleteItem, updateItem, refreshItems }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within WardrobeProvider');
  }
  return context;
}
```

---

### Task 15: Outfit Context

**Files:**
- Create: `src/contexts/OutfitContext.tsx`

**Step 1: Create Outfit Context**

Create `src/contexts/OutfitContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { OutfitWithItems, PlannedOutfit } from '../lib/types';
import { OutfitService } from '../services/outfits';
import { useAuth } from './AuthContext';

interface OutfitContextType {
  outfits: OutfitWithItems[];
  isLoading: boolean;
  saveOutfit: (
    itemIds: string[],
    name: string,
    occasion?: string,
    aiReasoning?: string,
    weatherConditions?: Record<string, any>
  ) => Promise<boolean>;
  toggleFavorite: (outfitId: string) => Promise<boolean>;
  deleteOutfit: (outfitId: string) => Promise<boolean>;
  refreshOutfits: () => Promise<void>;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

export function OutfitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<OutfitWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOutfits = async () => {
    if (!user) return;
    setIsLoading(true);
    const fetchedOutfits = await OutfitService.getOutfits(user.id);
    setOutfits(fetchedOutfits);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      refreshOutfits();
    }
  }, [user]);

  const saveOutfit = async (
    itemIds: string[],
    name: string,
    occasion?: string,
    aiReasoning?: string,
    weatherConditions?: Record<string, any>
  ): Promise<boolean> => {
    if (!user) return false;

    const { outfit, error } = await OutfitService.saveOutfit(
      user.id,
      itemIds,
      name,
      occasion,
      aiReasoning,
      weatherConditions
    );

    if (outfit) {
      await refreshOutfits();
      return true;
    }

    return false;
  };

  const toggleFavorite = async (outfitId: string): Promise<boolean> => {
    const success = await OutfitService.toggleFavorite(outfitId);
    if (success) {
      setOutfits((prev) =>
        prev.map((outfit) =>
          outfit.id === outfitId
            ? { ...outfit, is_favorite: !outfit.is_favorite }
            : outfit
        )
      );
    }
    return success;
  };

  const deleteOutfit = async (outfitId: string): Promise<boolean> => {
    const success = await OutfitService.deleteOutfit(outfitId);
    if (success) {
      setOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
    }
    return success;
  };

  return (
    <OutfitContext.Provider
      value={{
        outfits,
        isLoading,
        saveOutfit,
        toggleFavorite,
        deleteOutfit,
        refreshOutfits,
      }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const context = useContext(OutfitContext);
  if (!context) {
    throw new Error('useOutfits must be used within OutfitProvider');
  }
  return context;
}
```

---

### Task 16: Weather Context

**Files:**
- Create: `src/contexts/WeatherContext.tsx`

**Step 1: Create Weather Context**

Create `src/contexts/WeatherContext.tsx`:
```typescript
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
```

---

### Task 17: Wire Up Context Providers

**Files:**
- Modify: `src/main.tsx`

**Step 1: Update main.tsx with providers**

Update `src/main.tsx`:
```typescript
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';
import { AuthProvider } from './contexts/AuthContext';
import { WardrobeProvider } from './contexts/WardrobeContext';
import { OutfitProvider } from './contexts/OutfitContext';
import { WeatherProvider } from './contexts/WeatherContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <WardrobeProvider>
      <OutfitProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </OutfitProvider>
    </WardrobeProvider>
  </AuthProvider>
);
```

**Step 2: Verify**

Run: `npm run dev`
Expected: App loads without errors

---

## Phase 5: Update UI Components

### Task 18: Auth Screens

**Files:**
- Create: `src/app/components/screens/AuthScreen.tsx`
- Modify: `src/app/components/screens/SplashScreen.tsx`

**Step 1: Create Auth Screen**

Create `src/app/components/screens/AuthScreen.tsx`:
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import logoImg from 'figma:asset/2e45d34cce7557c7b29f456cbeeaac464dd676f1.png';

interface AuthScreenProps {
  onSuccess: () => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { signIn, signUp } = useAuth();
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
      <div className="flex-1 flex flex-col items-center justify-center px-8 mt-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8" style={{ width: 200 }}>
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
```

**Step 2: Update SplashScreen to navigate to Auth**

Modify `Figma Code/src/app/components/screens/SplashScreen.tsx`:

Change the button onClick handlers:
```typescript
// Line 71-83, replace:
<button
  onClick={onNext}
  // ... other props

// With:
<button
  onClick={() => onNext('signup')}
  // ... other props

// And line 84-97, replace:
<button
  onClick={onNext}
  // ... other props

// With:
<button
  onClick={() => onNext('signin')}
  // ... other props
```

Update interface:
```typescript
interface SplashScreenProps {
  onNext: (mode: 'signin' | 'signup') => void;
}
```

---

### Task 19: Update App.tsx for Auth Flow

**Files:**
- Modify: `Figma Code/src/app/App.tsx`

**Step 1: Update App.tsx**

Replace contents of `Figma Code/src/app/App.tsx`:
```typescript
import { useState, useEffect } from 'react';
import logoImg from 'figma:asset/2e45d34cce7557c7b29f456cbeeaac464dd676f1.png';
import { PhoneFrame } from './components/PhoneFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { WardrobeScreen } from './components/screens/WardrobeScreen';
import { AIScreen } from './components/screens/AIScreen';
import { OutfitPlannerScreen } from './components/screens/OutfitPlannerScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { useAuth } from '../contexts/AuthContext';

export default function App() {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [activeTab, setActiveTab] = useState('ai');

  // Once authenticated, navigate to app
  useEffect(() => {
    if (user && currentScreen !== 'app') {
      setCurrentScreen('app');
      setActiveTab('ai');
    }
  }, [user]);

  const handleNavigate = (screen: string) => {
    if (screen === 'splash') {
      setCurrentScreen('splash');
    } else if (screen === 'auth') {
      setCurrentScreen('auth');
    } else {
      setCurrentScreen('app');
      setActiveTab(screen);
    }
  };

  const handleSplashNext = (mode: 'signin' | 'signup') => {
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('app');
    setActiveTab('ai');
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0ECE4 0%, #E8E2D8 50%, #EDE5D8 100%)',
        }}
      >
        <p style={{ color: '#A0917E' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8"
      style={{
        background: 'linear-gradient(135deg, #F0ECE4 0%, #E8E2D8 50%, #EDE5D8 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Background label */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Drobe" style={{ height: 28, width: 'auto' }} />
          <span
            style={{
              fontSize: 11,
              color: '#A0917E',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginLeft: 6,
            }}
          >
            Design Preview
          </span>
        </div>
      </div>

      {/* Screen selector (shown when in app mode) */}
      {currentScreen === 'app' && (
        <div className="absolute top-6 right-8 flex items-center gap-2">
          {[
            { id: 'ai', label: 'Style AI' },
            { id: 'wardrobe', label: 'Wardrobe' },
            { id: 'planner', label: 'Planner' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? '#1A1A1A' : 'rgba(255,255,255,0.6)',
                color: activeTab === tab.id ? '#fff' : '#6B5E4E',
                border: '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentScreen('splash')}
            style={{
              padding: '6px 14px',
              borderRadius: 100,
              fontSize: 12,
              background: 'rgba(201,169,110,0.2)',
              color: '#8B6A30',
              border: '1px solid rgba(201,169,110,0.3)',
              cursor: 'pointer',
              marginLeft: 4,
            }}
          >
            ← Welcome
          </button>
        </div>
      )}

      <PhoneFrame>
        {currentScreen === 'splash' ? (
          <SplashScreen onNext={handleSplashNext} />
        ) : currentScreen === 'auth' ? (
          <AuthScreen onSuccess={handleAuthSuccess} />
        ) : (
          <div className="relative w-full h-full">
            <div className="w-full h-full overflow-hidden">
              {activeTab === 'ai' && <AIScreen onNavigate={handleNavigate} />}
              {activeTab === 'wardrobe' && <WardrobeScreen onNavigate={handleNavigate} />}
              {activeTab === 'planner' && <OutfitPlannerScreen onNavigate={handleNavigate} />}
              {activeTab === 'profile' && <ProfileScreen />}
            </div>
            <BottomNav active={activeTab} onNavigate={handleNavigate} />
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}
```

---

### Task 20: Update WardrobeScreen to Use Real Data

**Files:**
- Modify: `Figma Code/src/app/components/screens/WardrobeScreen.tsx`

**Step 1: Update WardrobeScreen**

Replace the top imports and state:
```typescript
import React, { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ClothingItem } from '../ClothingItem';
import logoImg from 'figma:asset/2e45d34cce7557c7b29f456cbeeaac464dd676f1.png';
import { useWardrobe } from '../../../contexts/WardrobeContext';
import { useOutfits } from '../../../contexts/OutfitContext';

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];

interface WardrobeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WardrobeScreen({ onNavigate }: WardrobeScreenProps) {
  const { items, isLoading, addItem, deleteItem } = useWardrobe();
  const { outfits, toggleFavorite } = useOutfits();
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((i) => i.category === activeCategory.toLowerCase());

  // Find favorite outfits that contain the selected item
  const getOutfitsWithItem = (itemId: string) => {
    return outfits.filter(
      (outfit) => outfit.is_favorite && outfit.item_ids.includes(itemId)
    );
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { success, error } = await addItem(file);
    setIsUploading(false);
    setShowAddDialog(false);

    if (!success) {
      alert(error || 'Failed to add item');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    const confirmed = confirm('Delete this item from your wardrobe?');
    if (confirmed) {
      await deleteItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  // Rest of the component stays the same but uses `items` from context
  // Update the item count display to use items.length
  // Update grid rendering to use `filtered` array
  // Update the "+ Add" button to open file picker
```

Add file input and add dialog:
```typescript
// Inside the return statement, add after the header:
{showAddDialog && (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'flex-end',
    }}
    onClick={() => setShowAddDialog(false)}
  >
    <div
      style={{
        width: '100%',
        background: '#F7F5F2',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        Add Item
      </h3>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleAddPhoto}
        style={{ display: 'none' }}
        id="camera-input"
      />
      <label
        htmlFor="camera-input"
        style={{
          display: 'block',
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          marginBottom: 12,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Take Photo
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleAddPhoto}
        style={{ display: 'none' }}
        id="gallery-input"
      />
      <label
        htmlFor="gallery-input"
        style={{
          display: 'block',
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Choose from Gallery
      </label>
    </div>
  </div>
)}
```

Update the "+ Add" button onClick:
```typescript
<button
  onClick={() => setShowAddDialog(true)}
  style={{...}}
>
  <span style={{ fontSize: 16 }}>+</span> Add
</button>
```

Update item count display (line 87):
```typescript
<p style={{ fontSize: 13, color: '#A0917E', fontWeight: 400, marginTop: 1 }}>
  {items.length} items · {categories.length - 1} categories
</p>
```

---

**CONTINUATION IN NEXT MESSAGE DUE TO LENGTH**

This implementation plan will continue with:
- Task 21: Update AIScreen
- Task 22: Update ProfileScreen
- Task 23: Update OutfitPlannerScreen
- Task 24: Testing & Polish
- Task 25: Deployment

Would you like me to continue with the rest of the plan, or would you prefer to start implementing these first 20 tasks?
