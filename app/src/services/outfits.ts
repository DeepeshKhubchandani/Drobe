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
        .map((id: string) => itemsMap.get(id))
        .filter((item: any) => item !== undefined),
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
