import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className="relative mx-auto overflow-hidden bg-[#F7F5F2] shadow-2xl"
      style={{
        width: 390,
        height: 844,
        borderRadius: 52,
        border: "10px solid #1a1a1a",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a1a] z-50"
        style={{ width: 120, height: 34, borderRadius: "0 0 20px 20px" }}
      />
      <div className="w-full h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
