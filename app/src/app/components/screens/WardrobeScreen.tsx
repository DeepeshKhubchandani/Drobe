import React, { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ClothingItem } from "../ClothingItem";
import logoImg from "../../../assets/logo.png";
import logoMini from "../../../assets/DrobeLogoMini.png";
import { useWardrobe } from "../../../contexts/WardrobeContext";
import { useOutfits } from "../../../contexts/OutfitContext";
import { useViewportOffset } from "../../../hooks/useViewportOffset";

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"];

interface WardrobeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WardrobeScreen({ onNavigate }: WardrobeScreenProps) {
  const { items, isLoading, loadingItemIds, addItem, deleteItem } = useWardrobe();
  const { outfits, toggleFavorite } = useOutfits();
  const bottomOffset = useViewportOffset();
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory.toLowerCase());

  // Find favorite outfits that contain the selected item
  const getOutfitsWithItem = (itemId: string) => {
    return outfits.filter(
      (outfit) => outfit.is_favorite && outfit.item_ids.includes(itemId)
    );
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Upload all files in parallel
    const uploadPromises = Array.from(files).map(file => addItem(file));
    const results = await Promise.all(uploadPromises);

    // Reset input so same files can be uploaded again
    e.target.value = '';

    // Check for any failures
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      alert(`${failures.length} of ${files.length} uploads failed. Please try again.`);
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

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F7F5F2", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div style={{ height: 44 }} />

      {/* Header */}
      <div className="px-6 py-3">
        <img src={logoImg} alt="Drobe" style={{ height: 58, width: "auto", marginBottom: 12 }} />
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
              My Wardrobe
            </h1>
            <p style={{ fontSize: 13, color: "#A0917E", fontWeight: 400, marginTop: 1 }}>
              {items.length} items · {categories.length - 1} categories
            </p>
          </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            style={{ background: "#fff", border: "1px solid #E8E3DC", borderRadius: 12, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {view === "grid" ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#1A1A1A" />
                <rect x="11" y="1" width="6" height="6" rx="1.5" fill="#1A1A1A" />
                <rect x="1" y="11" width="6" height="6" rx="1.5" fill="#1A1A1A" />
                <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#1A1A1A" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="2" width="16" height="2.5" rx="1.25" fill="#1A1A1A" />
                <rect x="1" y="7.75" width="16" height="2.5" rx="1.25" fill="#1A1A1A" />
                <rect x="1" y="13.5" width="16" height="2.5" rx="1.25" fill="#1A1A1A" />
              </svg>
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhoto}
            style={{ display: "none" }}
            id="add-photos-input"
          />
          <label
            htmlFor="add-photos-input"
            style={{
              background: "#C9A96E",
              borderRadius: 12,
              padding: "8px 16px",
              color: "#1A1A1A",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add
          </label>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mt-1">
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E3DC", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#A0917E" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#A0917E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 14, color: "#C4B8AA" }}>Search items...</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-6 mt-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: "7px 16px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: activeCategory === c ? 600 : 400,
                whiteSpace: "nowrap",
                background: activeCategory === c ? "#1A1A1A" : "#fff",
                color: activeCategory === c ? "#fff" : "#6B5E4E",
                border: activeCategory === c ? "none" : "1px solid #E2DDD7",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-5 mt-4" style={{ paddingBottom: 100 }}>
        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p style={{ color: "#A0917E" }}>Loading wardrobe...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div style={{ width: 80, height: 80, marginBottom: 16 }}>
              <img
                src={logoMini}
                alt="Drobe"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: 0.6
                }}
              />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>No Items Yet</h3>
            <p style={{ fontSize: 14, color: "#A0917E", marginBottom: 20, textAlign: "center", maxWidth: 240 }}>
              Start building your digital wardrobe by adding your first clothing item
            </p>
            <label
              htmlFor="add-photos-input"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                background: "#C9A96E",
                color: "#1A1A1A",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Add First Item
            </label>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => {
              const outfitsWithItem = getOutfitsWithItem(item.id);
              const hasOutfits = outfitsWithItem.length > 0;
              const isLoadingAnalysis = loadingItemIds.has(item.id);

              return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="overflow-hidden text-left"
                style={{ background: "#fff", borderRadius: 18, border: hasOutfits ? "2px solid #C9A96E" : "1px solid #F0EDE8", position: "relative" }}
              >
                <div className="relative" style={{ height: 160 }}>
                  <ImageWithFallback
                    src={item.thumbnail_url}
                    alt={item.subcategory || item.category}
                    className="w-full h-full object-cover"
                  />
                  {isLoadingAnalysis && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(26,26,26,0.75)", backdropFilter: "blur(2px)" }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            border: "3px solid rgba(201,169,110,0.3)",
                            borderTop: "3px solid #C9A96E",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        <p style={{ fontSize: 11, color: "#C9A96E", fontWeight: 600 }}>Analyzing...</p>
                      </div>
                    </div>
                  )}
                  {hasOutfits && (
                    <div
                      className="absolute top-2 right-2"
                      style={{ background: "#C9A96E", borderRadius: 8, padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#fff">
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{outfitsWithItem.length}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p style={{ fontSize: 12, fontWeight: 600, color: isLoadingAnalysis ? "#A0917E" : "#1A1A1A" }}>
                    {isLoadingAnalysis ? "Analyzing..." : (item.subcategory || item.category)}
                  </p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {item.colors.slice(0, 2).map((color) => (
                      <span
                        key={color}
                        style={{ background: "#F7F5F2", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#8B7B6B" }}
                      >
                        {color}
                      </span>
                    ))}
                    {item.formality && (
                      <span style={{ background: "#F7F5F2", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#8B7B6B" }}>
                        {item.formality}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
            })}
            {/* Add item card */}
            <label
              htmlFor="add-photos-input"
              className="flex flex-col items-center justify-center"
              style={{ background: "#fff", borderRadius: 18, border: "2px dashed #DDD8D0", minHeight: 220, cursor: "pointer" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 22, color: "#C9A96E", lineHeight: 1 }}>+</span>
              </div>
              <p style={{ fontSize: 12, color: "#A0917E", fontWeight: 500 }}>Add Item</p>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((item) => {
              const outfitsWithItem = getOutfitsWithItem(item.id);
              const hasOutfits = outfitsWithItem.length > 0;
              const isLoadingAnalysis = loadingItemIds.has(item.id);

              return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-3 text-left w-full"
                style={{ background: "#fff", borderRadius: 16, padding: "12px 14px", border: hasOutfits ? "2px solid #C9A96E" : "1px solid #F0EDE8" }}
              >
                <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                  <ImageWithFallback src={item.thumbnail_url} alt={item.subcategory || item.category} className="w-full h-full object-cover" />
                  {isLoadingAnalysis && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "rgba(26,26,26,0.75)", backdropFilter: "blur(2px)" }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          border: "2px solid rgba(201,169,110,0.3)",
                          borderTop: "2px solid #C9A96E",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </div>
                  )}
                  {hasOutfits && (
                    <div
                      className="absolute top-1 right-1"
                      style={{ background: "#C9A96E", borderRadius: 6, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="#fff">
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 9, color: "#fff", fontWeight: 600 }}>{outfitsWithItem.length}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: isLoadingAnalysis ? "#A0917E" : "#1A1A1A" }}>
                    {isLoadingAnalysis ? "Analyzing..." : (item.subcategory || item.category)}
                  </p>
                  <p style={{ fontSize: 11, color: "#A0917E", marginTop: 2 }}>
                    {item.category}
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {item.colors.slice(0, 2).map((color) => (
                      <span key={color} style={{ background: "#F7F5F2", borderRadius: 6, padding: "2px 7px", fontSize: 10, color: "#8B7B6B" }}>{color}</span>
                    ))}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#C4B8AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
            })}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 50,
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              width: "100%",
              background: "#F7F5F2",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: "24px 20px",
              paddingBottom: `${40 + bottomOffset}px`,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
                <ImageWithFallback src={selectedItem.photo_url} alt={selectedItem.subcategory || selectedItem.category} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
                  {selectedItem.subcategory || selectedItem.category}
                </h2>
                <p style={{ fontSize: 13, color: "#A0917E", marginBottom: 6 }}>
                  {selectedItem.category}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedItem.colors.map((color) => (
                    <span
                      key={color}
                      style={{ background: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#6B5E4E", border: "1px solid #E8E3DC" }}
                    >
                      {color}
                    </span>
                  ))}
                  {selectedItem.seasons.map((season) => (
                    <span
                      key={season}
                      style={{ background: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#6B5E4E", border: "1px solid #E8E3DC" }}
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "#fff",
                  border: "1px solid #E8E3DC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M2 12L12 2" stroke="#6B5E4E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Favorite Outfits Section */}
            {(() => {
              const outfitsWithItem = getOutfitsWithItem(selectedItem.id);

              if (outfitsWithItem.length === 0) {
                return (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "32px 20px",
                      textAlign: "center",
                      border: "2px dashed #E8E3DC",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#F7F5F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>
                      No Favorite Outfits Yet
                    </p>
                    <p style={{ fontSize: 13, color: "#A0917E", lineHeight: 1.5 }}>
                      This item isn't in any of your favorite outfits. Star outfits in Style AI or Planner to see them here!
                    </p>
                  </div>
                );
              }

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>
                      In {outfitsWithItem.length} Favorite Outfit{outfitsWithItem.length !== 1 ? "s" : ""}
                    </h3>
                    <div
                      style={{
                        background: "#FFF9ED",
                        border: "1px solid #C9A96E",
                        borderRadius: 100,
                        padding: "4px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#C9A96E">
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: 11, color: "#8B6A30", fontWeight: 600 }}>{outfitsWithItem.length}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {outfitsWithItem.map((outfit) => (
                      <div
                        key={outfit.id}
                        style={{
                          background: "#fff",
                          borderRadius: 18,
                          padding: 14,
                          border: "2px solid #C9A96E",
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4
                            style={{
                              fontSize: 16,
                              fontFamily: "'Playfair Display', serif",
                              fontWeight: 400,
                              color: "#1A1A1A",
                            }}
                          >
                            {outfit.name}
                          </h4>
                          <button
                            onClick={() => toggleFavorite(outfit.id)}
                            style={{
                              background: "#FFF9ED",
                              border: "1px solid #C9A96E",
                              borderRadius: 10,
                              padding: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#C9A96E">
                              <path
                                d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z"
                                stroke="#C9A96E"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {outfit.items.map((item) => (
                            <ClothingItem
                              key={item.id}
                              name={item.subcategory || item.category}
                              image={item.thumbnail_url}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            {/* Delete Button */}
            <button
              onClick={handleDeleteItem}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                background: "#fff",
                color: "#ff6b6b",
                border: "1px solid #E8E3DC",
                fontSize: 14,
                fontWeight: 600,
                marginTop: 16,
                cursor: "pointer",
              }}
            >
              Delete Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
