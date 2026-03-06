import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ClothingItemProps {
  name: string;
  image: string;
}

export function ClothingItem({ name, image }: ClothingItemProps) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 10,
        border: "1px solid #F0EDE8",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          overflow: "hidden",
          background: "#F7F5F2",
          flexShrink: 0,
        }}
      >
        <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <p style={{ fontSize: 14, color: "#1A1A1A", fontWeight: 500, flex: 1 }}>{name}</p>
    </div>
  );
}
