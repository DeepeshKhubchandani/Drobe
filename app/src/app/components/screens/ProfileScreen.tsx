import React from "react";
import logoImg from "../../../assets/logo.png";

const stats = [
  { label: "Items", value: "47" },
  { label: "Outfits", value: "124" },
  { label: "Saved", value: "38" },
];

const stylePrefs = ["Minimal", "Smart Casual", "Neutral Tones", "Structured", "Relaxed Fit"];

const activityData = [
  { day: "M", height: 60 },
  { day: "T", height: 90 },
  { day: "W", height: 45 },
  { day: "T", height: 100 },
  { day: "F", height: 70 },
  { day: "S", height: 30 },
  { day: "S", height: 55 },
];

export function ProfileScreen() {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F7F5F2", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div style={{ height: 44 }} />

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 100 }}>
        {/* Profile header */}
        <div
          className="mx-5 mt-4 overflow-hidden"
          style={{ background: "#1A1A1A", borderRadius: 24 }}
        >
          <div className="relative flex items-center justify-center" style={{ height: 80, background: "linear-gradient(135deg, #2c2318, #3d2e1a)", padding: "0 20px" }}>
            <img src={logoImg} alt="Drobe" style={{ height: 48, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
          </div>
          <div className="flex items-end gap-4 px-5 -mt-8 pb-5">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #C9A96E, #a07840)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #1A1A1A",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>A</span>
            </div>
            <div className="flex-1 pb-1">
              <p style={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>Ava Chen</p>
              <p style={{ color: "#A0917E", fontSize: 12, marginTop: 1 }}>Member since Jan 2025</p>
            </div>
            <button style={{ background: "rgba(201,169,110,0.15)", border: "1px solid #C9A96E", borderRadius: 10, padding: "6px 14px", color: "#C9A96E", fontSize: 12, fontWeight: 600 }}>
              Edit
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 mx-5 mb-5 gap-3">
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 8px" }}>
                <p style={{ color: "#C9A96E", fontSize: 22, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                <p style={{ color: "#6B5E4E", fontSize: 11, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Style Profile */}
        <div className="mx-5 mt-4" style={{ background: "#fff", borderRadius: 20, padding: "18px 16px" }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Style Profile</p>
            <span style={{ fontSize: 11, color: "#C9A96E", fontWeight: 600 }}>Edit preferences</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stylePrefs.map((pref) => (
              <span
                key={pref}
                style={{
                  background: "#F7F5F2",
                  borderRadius: 100,
                  padding: "6px 14px",
                  fontSize: 12,
                  color: "#6B5E4E",
                  border: "1px solid #E8E3DC",
                }}
              >
                {pref}
              </span>
            ))}
            <span
              style={{
                background: "#1A1A1A",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 12,
                color: "#C9A96E",
              }}
            >
              + Add
            </span>
          </div>
        </div>

        {/* Wardrobe activity */}
        <div className="mx-5 mt-4" style={{ background: "#fff", borderRadius: 20, padding: "18px 16px" }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Wear Activity</p>
            <span style={{ fontSize: 11, color: "#A0917E" }}>This week</span>
          </div>
          <div className="flex items-end justify-between gap-1" style={{ height: 80 }}>
            {activityData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  style={{
                    width: "100%",
                    height: `${d.height}%`,
                    background: d.height === 100 ? "linear-gradient(180deg, #C9A96E, #a07840)" : "#F0EDE8",
                    borderRadius: 6,
                    transition: "all 0.3s",
                  }}
                />
                <p style={{ fontSize: 10, color: "#A0917E" }}>{d.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability score */}
        <div
          className="mx-5 mt-4"
          style={{ background: "linear-gradient(135deg, #1A2E1A, #2A3E2A)", borderRadius: 20, padding: "18px 16px" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Sustainability Score</p>
              <p style={{ fontSize: 11, color: "#6B8F6B", marginTop: 2 }}>You're in the top 15% of sustainable dressers</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 600, color: "#7EC87E", fontFamily: "'Playfair Display', serif" }}>89</p>
              <p style={{ fontSize: 10, color: "#6B8F6B" }}>/ 100</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 6, overflow: "hidden" }}>
            <div style={{ width: "89%", height: "100%", background: "linear-gradient(90deg, #4A8F4A, #7EC87E)", borderRadius: 8 }} />
          </div>
          <div className="flex justify-between mt-4 gap-3">
            {[
              { label: "Items reused", value: "92%" },
              { label: "Impulse buys", value: "−67%" },
              { label: "Cost per wear", value: "$2.40" },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: "center", flex: 1 }}>
                <p style={{ color: "#7EC87E", fontSize: 15, fontWeight: 600 }}>{m.value}</p>
                <p style={{ color: "#6B8F6B", fontSize: 10, marginTop: 2 }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mx-5 mt-4 mb-4" style={{ background: "#fff", borderRadius: 20, overflow: "hidden" }}>
          {[
            { icon: "🔔", label: "Notifications", sub: "Daily outfit reminders" },
            { icon: "🔒", label: "Privacy", sub: "Data & account settings" },
            { icon: "🌿", label: "Sustainability Goals", sub: "Set your targets" },
            { icon: "💳", label: "Subscription", sub: "Drobe Pro · Active" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < 3 ? "1px solid #F7F5F2" : "none" }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div className="flex-1">
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#A0917E", marginTop: 1 }}>{item.sub}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="#C4B8AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}