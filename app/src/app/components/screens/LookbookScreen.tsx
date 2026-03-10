import React, { useState } from "react";
import logoImg from "../../../assets/logo.png";
import { useViewportOffset } from "../../../hooks/useViewportOffset";

// Placeholder data for look of the day
const lookOfTheDay = {
  id: 1,
  title: "Modern Sophistication",
  description: "Sharp, timeless elegance for the modern professional",
  imageUrl: "https://images.unsplash.com/photo-1760495594970-f2823a1fb194?w=1200&auto=format&fit=crop&q=80",
  sponsor: "brought to you by The Good Trade",
  items: [
    { name: "Navy Button Down", category: "Tops" },
    { name: "Plaid Trousers", category: "Bottoms" },
  ],
  occasion: "Business Casual",
  season: "Year Round",
};

// Featured looks carousel
const featuredLooks = [
  {
    id: 2,
    title: "Weekend Casual",
    imageUrl: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
    sponsor: "Toad&Co",
  },
  {
    id: 3,
    title: "Business Chic",
    imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    sponsor: "Cerci",
  },
  {
    id: 4,
    title: "Evening Elegance",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
    sponsor: "Omnes",
  },
];

interface LookbookScreenProps {
  onNavigate: (screen: string) => void;
}

export function LookbookScreen({ onNavigate }: LookbookScreenProps) {
  const bottomOffset = useViewportOffset();

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F7F5F2", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div style={{ height: 16 }} />

      {/* Header */}
      <div className="px-6 py-3">
        <img src={logoImg} alt="Drobe" style={{ height: 58, width: "auto", marginBottom: 12 }} />
        <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1A1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: 4 }}>
          Look of the Day
        </h1>
        <p style={{ fontSize: 14, color: "#A0917E" }}>Discover today's curated style</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6" style={{ paddingBottom: bottomOffset + 100 }}>
        {/* Featured Look Card - Magazine Style */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
            border: "1px solid #F0EDE8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Main Image */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
            <img
              src={lookOfTheDay.imageUrl}
              alt={lookOfTheDay.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Overlay Gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            />
            {/* Title Overlay */}
            <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 4,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {lookOfTheDay.title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.85)",
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  fontStyle: "italic",
                }}
              >
                {lookOfTheDay.sponsor}
              </p>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: 14 }}>
            {/* Items - inline list */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: "#1A1A1A", marginBottom: 6 }}>
                {lookOfTheDay.items.map((item) => item.name).join(' • ')}
              </p>
            </div>

            {/* CTA */}
            <a
              href="https://www.thegoodtrade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                background: "#1A1A1A",
                borderRadius: 12,
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Shop This Look
            </a>
          </div>
        </div>

        {/* More Looks */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>
            More Inspiration
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {featuredLooks.map((look) => (
              <div
                key={look.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #F0EDE8",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/4" }}>
                  <img
                    src={look.imageUrl}
                    alt={look.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                      padding: "30px 12px 12px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: 4,
                        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {look.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.8)",
                        fontStyle: "italic",
                        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      by {look.sponsor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
