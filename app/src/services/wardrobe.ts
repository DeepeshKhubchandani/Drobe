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
