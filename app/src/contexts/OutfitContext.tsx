import React, { createContext, useContext, useState, useEffect } from 'react';
import type { OutfitWithItems } from '../lib/types';
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

    const { outfit } = await OutfitService.saveOutfit(
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
