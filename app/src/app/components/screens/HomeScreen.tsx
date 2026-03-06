import React, { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const outfitImg = "https://images.unsplash.com/photo-1746458258548-5e5bd7225c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwd29tYW4lMjBvdXRmaXQlMjBuZXV0cmFsJTIwdG9uZXN8ZW58MXx8fHwxNzcyNTU2MTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080";

const outfitPieces = [
  { label: "Top", item: "Ivory Linen Shirt", color: "#EDE8E0" },
  { label: "Bottom", item: "Tailored Trousers", color: "#8B7355" },
  { label: "Shoes", item: "White Leather Sneakers", color: "#F5F5F0" },
  { label: "Layer", item: "Beige Blazer", color: "#C4A882" },
];

const occasions = ["Today", "Work", "Weekend", "Dinner", "Event"];

// Mock weather data
const weather = {
  location: "London, UK",
  temp: 14,
  feelsLike: 11,
  condition: "Partly Cloudy",
  icon: "⛅",
  high: 16,
  low: 9,
  rain: 40,
  wind: 18,
  alerts: [
    { icon: "🌧️", text: "Rain likely after 3pm — pack an umbrella" },
    { icon: "🧥", text: "Cool breeze — your blazer is a smart call" },
  ],
};

function WeatherBar() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="mx-5 mb-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2c2318 0%, #1a1a1a 100%)",
        borderRadius: 20,
        border: "1px solid rgba(201,169,110,0.2)",
      }}
    >
      {/* Main row */}
      <button
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
        style={{ padding: "14px 16px" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 32, lineHeight: 1 }}>{weather.icon}</span>
            <div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: 28, fontWeight: 600, color: "#fff", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                  {weather.temp}°
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                  Feels {weather.feelsLike}°
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1C3.3 1 2 2.3 2 4C2 6 5 9 5 9C5 9 8 6 8 4C8 2.3 6.7 1 5 1ZM5 5C4.4 5 4 4.6 4 4C4 3.4 4.4 3 5 3C5.6 3 6 3.4 6 4C6 4.6 5.6 5 5 5Z" fill="rgba(201,169,110,0.7)" />
                </svg>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{weather.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{weather.condition}</span>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>H:{weather.high}° L:{weather.low}°</span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <path d="M3 5L7 9L11 5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Forecast pills always visible */}
        <div className="flex gap-2 mt-3">
          <div className="flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "4px 10px" }}>
            <span style={{ fontSize: 11 }}>🌧️</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{weather.rain}% rain</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "4px 10px" }}>
            <span style={{ fontSize: 11 }}>💨</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{weather.wind} km/h</span>
          </div>
        </div>
      </button>

      {/* Expanded wardrobe impact */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px 14px" }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#C9A96E", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
            Wardrobe impact
          </p>
          <div className="flex flex-col gap-2">
            {weather.alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a.text}</p>
              </div>
            ))}
            <div className="flex items-start gap-2.5">
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>☀️</span>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>Morning clear — light layers work until noon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [liked, setLiked] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("Today");

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F7F5F2", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Status bar spacer */}
      <div style={{ height: 44 }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <p style={{ fontSize: 12, color: "#A0917E", fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase" }}>
            Tuesday, Mar 3
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginTop: 2 }}>
            Good morning, Ava
          </h1>
        </div>
        <button
          className="rounded-full overflow-hidden"
          style={{ width: 42, height: 42, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ color: "#C9A96E", fontSize: 16, fontWeight: 600 }}>A</span>
        </button>
      </div>

      {/* Weather bar */}
      <WeatherBar />

      {/* Occasion tabs */}
      <div className="px-6 mb-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {occasions.map((o) => (
            <button
              key={o}
              onClick={() => setSelectedOccasion(o)}
              style={{
                padding: "7px 16px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: selectedOccasion === o ? 600 : 400,
                whiteSpace: "nowrap",
                background: selectedOccasion === o ? "#1A1A1A" : "transparent",
                color: selectedOccasion === o ? "#fff" : "#A0917E",
                border: selectedOccasion === o ? "none" : "1px solid #E2DDD7",
                transition: "all 0.2s",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit card */}
      <div className="flex-1 px-5 overflow-y-auto" style={{ paddingBottom: 100 }}>
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 24, background: "#fff" }}
        >
          {/* Outfit image */}
          <div className="relative" style={{ height: 300 }}>
            <ImageWithFallback
              src={outfitImg}
              alt="Today's outfit"
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(26,26,26,0.7) 0%, transparent 50%)" }}
            />

            {/* AI badge */}
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5"
              style={{
                background: "rgba(201,169,110,0.95)",
                borderRadius: 100,
                padding: "5px 12px",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.2 4.8H11L7.9 7.1L9 11L6 8.9L3 11L4.1 7.1L1 4.8H4.8L6 1Z" fill="#1a1a1a" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.5px" }}>AI PICK</span>
            </div>

            {/* Weather badge on image */}
            <div
              className="absolute top-4 right-14 flex items-center gap-1"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 100,
                padding: "5px 10px",
              }}
            >
              <span style={{ fontSize: 11 }}>⛅</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>14°</span>
            </div>

            {/* Like button */}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 100,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={liked ? "#C9A96E" : "none"} stroke={liked ? "#C9A96E" : "white"} strokeWidth="1.5">
                <path d="M8 13.4C8 13.4 1.5 9.5 1.5 5.5C1.5 3.6 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.6 14.5 5.5C14.5 9.5 8 13.4 8 13.4Z" />
              </svg>
            </button>

            {/* Outfit title */}
            <div className="absolute bottom-4 left-4 right-4">
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 400, letterSpacing: "1.5px", textTransform: "uppercase" }}>Outfit of the Day</p>
              <h2 style={{ color: "#fff", fontSize: 20, fontFamily: "'Playfair Display', serif", fontWeight: 400, marginTop: 2 }}>
                Effortless Tuesday
              </h2>
            </div>
          </div>

          {/* AI Reasoning — weather-aware */}
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #F0EDE8" }}>
            <p style={{ fontSize: 13, color: "#6B5E4E", lineHeight: 1.6 }}>
              ✦ Linen meets tailoring for a polished-but-relaxed look. The blazer keeps you warm in today's 14° chill and doubles as rain cover if showers arrive after 3pm.
            </p>
          </div>

          {/* Weather advisory strip */}
          <div
            className="px-5 py-3 flex items-center gap-3"
            style={{ background: "#FDFAF6", borderBottom: "1px solid #F0EDE8" }}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 14 }}>🌧️</span>
                <span style={{ fontSize: 11, color: "#6B5E4E", fontWeight: 500 }}>Rain at 3pm</span>
              </div>
              <div style={{ width: 1, height: 14, background: "#E8E3DC" }} />
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 14 }}>☂️</span>
                <span style={{ fontSize: 11, color: "#6B5E4E", fontWeight: 500 }}>Bring umbrella</span>
              </div>
              <div style={{ width: 1, height: 14, background: "#E8E3DC" }} />
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 14 }}>🧥</span>
                <span style={{ fontSize: 11, color: "#6B5E4E", fontWeight: 500 }}>Layer up</span>
              </div>
            </div>
          </div>

          {/* Pieces */}
          <div className="px-5 pt-4 pb-5">
            <p style={{ fontSize: 11, fontWeight: 600, color: "#A0917E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
              What you're wearing
            </p>
            <div className="flex gap-2 flex-wrap">
              {outfitPieces.map((piece) => (
                <div
                  key={piece.label}
                  className="flex items-center gap-2"
                  style={{
                    background: "#F7F5F2",
                    borderRadius: 12,
                    padding: "8px 12px",
                    border: "1px solid #E8E3DC",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: piece.color, border: "1px solid #D0C8BC", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, color: "#A0917E", fontWeight: 500, letterSpacing: "0.5px" }}>{piece.label.toUpperCase()}</p>
                    <p style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 500, marginTop: 0 }}>{piece.item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={() => onNavigate("ai")}
              className="flex-1 py-3.5 rounded-2xl"
              style={{
                background: "#1A1A1A",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Refresh Outfit
            </button>
            <button
              className="py-3.5 px-4 rounded-2xl"
              style={{
                background: "#F0EDE8",
                color: "#1A1A1A",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Save Look
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Items", value: "47", sub: "in wardrobe" },
            { label: "Outfits", value: "124", sub: "generated" },
            { label: "Worn", value: "89%", sub: "utilization" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ background: "#fff", borderRadius: 16, padding: "14px 12px", textAlign: "center" }}
            >
              <p style={{ fontSize: 22, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: "#A0917E", fontWeight: 500, marginTop: 2 }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}