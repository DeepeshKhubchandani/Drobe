import React from "react";
import logoImg from "../../../assets/logo.png";

interface SplashScreenProps {
  onNext: (mode: 'signin' | 'signup') => void;
}

export function SplashScreen({ onNext }: SplashScreenProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1a1a1a 0%, #2c2318 60%, #3d2e1a 100%)" }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-[#C9A96E]" />
        <div className="absolute top-32 left-20 w-48 h-48 rounded-full border border-[#C9A96E]" />
        <div className="absolute bottom-40 right-5 w-72 h-72 rounded-full border border-[#C9A96E]" />
      </div>

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 mt-10">
        {/* Logo */}
        <div className="mb-8" style={{ width: 320 }}>
          <img
            src={logoImg}
            alt="Drobe"
            style={{
              width: "100%",
              filter: "brightness(0) invert(1)",
              opacity: 0.95,
            }}
          />
        </div>

        {/* Tagline accent line */}
        <div className="flex items-center gap-3 mb-10">
          <div style={{ height: 1, width: 32, background: "#C9A96E", opacity: 0.6 }} />
          <p
            style={{
              color: "#C9A96E",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 300,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            AI Wardrobe Assistant
          </p>
          <div style={{ height: 1, width: 32, background: "#C9A96E", opacity: 0.6 }} />
        </div>

        {/* Tagline */}
        <p
          className="text-center leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            maxWidth: 240,
          }}
        >
          Get dressed with confidence. Discover outfits hiding in your closet.
        </p>
      </div>

      {/* Bottom section */}
      <div className="w-full px-8 pb-16 flex flex-col gap-4">
        <button
          onClick={() => onNext('signup')}
          className="w-full py-4 rounded-2xl text-[#1a1a1a]"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #e8c98a)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.3px",
          }}
        >
          Get Started
        </button>
        <button
          onClick={() => onNext('signin')}
          className="w-full py-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}