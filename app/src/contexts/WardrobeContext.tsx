import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WardrobeItem } from '../lib/types';
import { WardrobeService } from '../services/wardrobe';
import { AIService } from '../services/ai';
import { useAuth } from './AuthContext';

interface WardrobeContextType {
  items: WardrobeItem[];
  isLoading: boolean;
  loadingItemIds: Set<string>;
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
  const [loadingItemIds, setLoadingItemIds] = useState<Set<string>>(new Set());

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

    // First, add item without AI analysis
    const { item, error } = await WardrobeService.addWardrobeItem(user.id, file);

    if (error || !item) {
      return { success: false, error };
    }

    // Add to local state immediately with loading indicator
    setItems((prev) => [item, ...prev]);
    setLoadingItemIds((prev) => new Set(prev).add(item.id));

    // Then analyze with AI in background (don't block UI)
    (async () => {
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
          // Update local state with analyzed data
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    category: analysis.category as any,
                    subcategory: analysis.subcategory,
                    colors: analysis.colors,
                    seasons: analysis.seasons,
                    formality: analysis.formality as any,
                    ai_metadata: analysis,
                  }
                : i
            )
          );
        }
      }

      // Remove from loading set
      setLoadingItemIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    })();

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
      value={{ items, isLoading, loadingItemIds, addItem, deleteItem, updateItem, refreshItems }}
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
