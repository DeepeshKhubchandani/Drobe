import React, { useState, useEffect } from "react";
import { ClothingItem } from "../ClothingItem";
import logoImg from "../../../assets/logo.png";
import { useWeather } from "../../../contexts/WeatherContext";
import { useWardrobe } from "../../../contexts/WardrobeContext";
import { useOutfits } from "../../../contexts/OutfitContext";
import { AIService, OutfitSuggestion } from "../../../services/ai";

const suggestions = [
  "Friend's wedding this Saturday",
  "Job interview tomorrow",
  "Casual brunch Sunday",
  "Date night outfit",
  "Work from office look",
];

const outfitResults = [
  {
    id: 1,
    title: "Garden Ceremony",
    confidence: 97,
    items: [
      { name: "Black Midi Dress", image: "https://images.unsplash.com/photo-1646178071012-7bf3efe0ddfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1pZGklMjBkcmVzcyUyMGNsb3RoaW5nJTIwaXRlbXxlbnwxfHx8fDE3NzI3MzA0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Beige Blazer", image: "https://images.unsplash.com/photo-1712773663204-9dce38ddae57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGJsYXplciUyMGNsb3RoaW5nJTIwZm9ybWFsfGVufDF8fHx8MTc3MjczMDQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "White Sneakers", image: "https://images.unsplash.com/photo-1680254418556-3980c19d4304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwc2hvZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjYyNTEzNnww&ixlib=rb-4.1.0&q=80&w=1080" },
    ],
    reason: "Elevated but not overdressed for a daytime garden ceremony. The blazer adds formality.",
    weather: { temp: 14, condition: "Partly Cloudy", icon: "⛅", alerts: ["Blazer doubles as warmth for 14° evening", "Rain at 3pm — umbrella recommended"] },
  },
  {
    id: 2,
    title: "Modern Classic",
    confidence: 88,
    items: [
      { name: "Ivory Linen Shirt", image: "https://images.unsplash.com/photo-1642761589121-ec47d4c425ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdm9yeSUyMGxpbmVuJTIwc2hpcnQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI3MzA0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Navy Denim Jeans", image: "https://images.unsplash.com/photo-1732551880627-30e1dd487084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwZGVuaW0lMjBqZWFucyUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MjczMDQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
      { name: "Beige Blazer", image: "https://images.unsplash.com/photo-1712773663204-9dce38ddae57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGJsYXplciUyMGNsb3RoaW5nJTIwZm9ybWFsfGVufDF8fHx8MTc3MjczMDQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080" },
    ],
    reason: "Smart casual that photographs beautifully. Versatile for ceremony and reception.",
    weather: { temp: 14, condition: "Partly Cloudy", icon: "⛅", alerts: ["Linen may feel cool — add a light scarf", "Good for morning when it's dry"] },
  },
];

interface AIScreenProps {
  onNavigate: (screen: string) => void;
}

export function AIScreen({ onNavigate }: AIScreenProps) {
  const { weather } = useWeather();
  const { items } = useWardrobe();
  const { saveOutfit } = useOutfits();

  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<OutfitSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (query: string) => {
    setActiveQuery(query);
    setGenerating(true);
    setError(null);

    // Call the suggest-outfits edge function
    const { suggestions: fetchedSuggestions, error: aiError } = await AIService.suggestOutfits(
      query,
      weather,
      items
    );

    setGenerating(false);

    if (aiError || !fetchedSuggestions || fetchedSuggestions.length === 0) {
      setError(aiError || "No outfit suggestions available. Try adding more items to your wardrobe!");
      // Fall back to mock data for demo purposes
      setAiSuggestions([]);
      setSubmitted(true);
    } else {
      setAiSuggestions(fetchedSuggestions);
      setSubmitted(true);
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
        <div className="flex items-center justify-between mb-3">
          <img src={logoImg} alt="Drobe" style={{ height: 58, width: "auto" }} />
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A96E" }} />
            <p style={{ fontSize: 11, color: "#A0917E", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              AI Stylist
            </p>
          </div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
          Style AI
        </h1>
        <p style={{ fontSize: 14, color: "#A0917E", marginTop: 4 }}>
          What are you dressing for today?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5" style={{ paddingBottom: 100 }}>
        {!submitted && !generating && (
          <>
            {/* Weather context card */}
            {weather && (
              <div
                className="mb-4 flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, #2c2318, #1a1a1a)", borderRadius: 16, padding: "12px 14px", border: "1px solid rgba(201,169,110,0.15)" }}
              >
                <span style={{ fontSize: 28 }}>
                  {weather.icon === '01d' ? '☀️' : weather.icon === '01n' ? '🌙' :
                   weather.icon.startsWith('02') ? '⛅' :
                   weather.icon.startsWith('03') || weather.icon.startsWith('04') ? '☁️' :
                   weather.icon.startsWith('09') || weather.icon.startsWith('10') ? '🌧️' :
                   weather.icon.startsWith('11') ? '⛈️' :
                   weather.icon.startsWith('13') ? '❄️' : '🌫️'}
                </span>
                <div className="flex-1">
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                    {weather.condition} · {weather.temp}°F · {weather.location || 'Evanston, IL'}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                    {weather.description} · {weather.wind_speed} mph wind
                  </p>
                </div>
              </div>
            )}

            {/* Input box */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1.5px solid #E8E3DC",
                padding: "16px 16px",
                marginBottom: 16,
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. I have a friend's wedding tomorrow at a vineyard at 4pm..."
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "#1A1A1A",
                  fontFamily: "'DM Sans', sans-serif",
                  resize: "none",
                  minHeight: 80,
                  lineHeight: 1.6,
                }}
              />
              <div className="flex items-center justify-end mt-2">
                <button
                  onClick={() => handleSubmit(input || "Friend's wedding tomorrow")}
                  style={{
                    background: input ? "#1A1A1A" : "#E8E3DC",
                    borderRadius: 12,
                    padding: "8px 18px",
                    color: input ? "#fff" : "#A0917E",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  Style me
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <p style={{ fontSize: 11, color: "#A0917E", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
              Quick occasions
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="w-full text-left flex items-center justify-between"
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "14px 16px",
                    border: "1px solid #F0EDE8",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F7F5F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 16 }}>
                        {s.includes("wedding") ? "💍" : s.includes("interview") ? "💼" : s.includes("brunch") ? "☕" : s.includes("Date") ? "🌙" : "🏢"}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 400 }}>{s}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="#C4B8AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}

        {generating && (
          <div className="flex flex-col items-center justify-center py-16">
            {/* Animated logo */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #C9A96E, #a07840)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <path d="M18 8C19.1 8 20 7.1 20 6C20 4.9 19.1 4 18 4C16.9 4 16 4.9 16 6C16 7.1 16.9 8 18 8Z" fill="white" />
                <path d="M18 8V11M18 11C18 11 10 15 6 20C4 22.5 6 26 10 26H26C30 26 32 22.5 30 20C26 15 18 11 18 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <p style={{ fontSize: 16, color: "#1A1A1A", fontWeight: 500, fontFamily: "'Playfair Display', serif" }}>
              Styling your look...
            </p>
            <p style={{ fontSize: 13, color: "#A0917E", marginTop: 6 }}>Checking weather · Searching 47 items</p>
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#C9A96E",
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {submitted && (
          <>
            {/* Context */}
            <div
              className="flex items-start gap-3 mb-3"
              style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0EDE8" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #C9A96E, #a07840)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
                  <path d="M18 8C19.1 8 20 7.1 20 6C20 4.9 19.1 4 18 4C16.9 4 16 4.9 16 6C16 7.1 16.9 8 18 8Z" fill="white" />
                  <path d="M18 8V11M18 11C18 11 10 15 6 20C4 22.5 6 26 10 26H26C30 26 32 22.5 30 20C26 15 18 11 18 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500 }}>{activeQuery}</p>
                <p style={{ fontSize: 11, color: "#A0917E", marginTop: 3 }}>
                  {error ? error : `Found ${aiSuggestions.length} great options from your wardrobe`}
                </p>
              </div>
            </div>

            {/* Weather considered banner */}
            {weather && !error && aiSuggestions.length > 0 && (
              <div
                className="flex items-center gap-2 mb-4"
                style={{ background: "linear-gradient(135deg, #2c2318, #1a1a1a)", borderRadius: 14, padding: "10px 14px" }}
              >
                <span style={{ fontSize: 16 }}>
                  {weather.icon === '01d' ? '☀️' : weather.icon === '01n' ? '🌙' :
                   weather.icon.startsWith('02') ? '⛅' :
                   weather.icon.startsWith('03') || weather.icon.startsWith('04') ? '☁️' :
                   weather.icon.startsWith('09') || weather.icon.startsWith('10') ? '🌧️' :
                   weather.icon.startsWith('11') ? '⛈️' :
                   weather.icon.startsWith('13') ? '❄️' : '🌫️'}
                </span>
                <div className="flex-1">
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                    <span style={{ color: "#C9A96E", fontWeight: 600 }}>Weather considered</span> · {weather.temp}°F, {weather.description} · Outfits tailored for conditions
                  </p>
                </div>
              </div>
            )}

            {!error && aiSuggestions.length > 0 && (
              <p style={{ fontSize: 11, color: "#A0917E", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
                Recommended outfits
              </p>
            )}

            {/* Show error or fallback to mock data */}
            {error && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px",
                  textAlign: "center",
                  border: "1px solid #F0EDE8"
                }}
              >
                <p style={{ fontSize: 14, color: "#A0917E", marginBottom: 8 }}>
                  {error}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                  }}
                  style={{
                    background: "#1A1A1A",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: 600,
                    marginTop: 12
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {aiSuggestions.map((outfit, idx) => (
              <div
                key={`outfit-${idx}`}
                className="mb-4 overflow-hidden"
                style={{ background: "#fff", borderRadius: 20, border: idx === 0 ? "2px solid #C9A96E" : "1px solid #F0EDE8", padding: 16 }}
              >
                {/* Header with title, star, and weather badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: "#1A1A1A", marginBottom: 2 }}>{outfit.name}</h3>
                    {idx === 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#C9A96E", letterSpacing: "0.5px" }}>✦ TOP PICK</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        // Save outfit to database
                        const itemIds = outfit.items.map(item => item.id);
                        await saveOutfit(itemIds, outfit.name, outfit.occasion, outfit.reasoning, weather ? {
                          temp: weather.temp,
                          condition: weather.condition
                        } : undefined);
                        toggleFavorite(`ai-${idx}`);
                      }}
                      style={{
                        background: favorites.includes(`ai-${idx}`) ? "#FFF9ED" : "#F7F5F2",
                        border: favorites.includes(`ai-${idx}`) ? "1px solid #C9A96E" : "1px solid #E8E3DC",
                        borderRadius: 10,
                        padding: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill={favorites.includes(`ai-${idx}`) ? "#C9A96E" : "none"}>
                        <path d="M8 2.5L9.5 6.5H13.5L10.5 9L11.5 13L8 10.5L4.5 13L5.5 9L2.5 6.5H6.5L8 2.5Z" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {weather && (
                      <div
                        style={{
                          background: "#F7F5F2",
                          border: "1px solid #E8E3DC",
                          borderRadius: 100,
                          padding: "4px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontSize: 11 }}>
                          {weather.icon === '01d' ? '☀️' : weather.icon === '01n' ? '🌙' :
                           weather.icon.startsWith('02') ? '⛅' :
                           weather.icon.startsWith('03') || weather.icon.startsWith('04') ? '☁️' :
                           weather.icon.startsWith('09') || weather.icon.startsWith('10') ? '🌧️' :
                           weather.icon.startsWith('11') ? '⛈️' :
                           weather.icon.startsWith('13') ? '❄️' : '🌫️'}
                        </span>
                        <span style={{ fontSize: 11, color: "#1A1A1A", fontWeight: 500 }}>{weather.temp}°F</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clothing items */}
                <div className="flex flex-col gap-2 mb-3">
                  {outfit.items.map((item, itemIdx) => (
                    <ClothingItem
                      key={itemIdx}
                      name={`${item.subcategory || item.category} - ${item.colors.join(', ')}`}
                      image={item.thumbnail_url || item.photo_url}
                    />
                  ))}
                </div>

                {/* Reason */}
                <p style={{ fontSize: 13, color: "#6B5E4E", lineHeight: 1.6, marginBottom: 12 }}>
                  ✦ {outfit.reasoning}
                </p>

                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 14,
                    background: idx === 0 ? "#1A1A1A" : "#F7F5F2",
                    color: idx === 0 ? "#fff" : "#1A1A1A",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {idx === 0 ? "Wear This" : "Try This Instead"}
                </button>
              </div>
            ))}

            <button
              onClick={() => { setSubmitted(false); setInput(""); }}
              style={{ width: "100%", padding: "14px", borderRadius: 16, border: "1.5px solid #E8E3DC", background: "transparent", fontSize: 14, color: "#6B5E4E", fontWeight: 500 }}
            >
              Try another occasion
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}