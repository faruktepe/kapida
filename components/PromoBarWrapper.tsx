"use client";
import React, { useState } from "react";

export default function PromoBarWrapper() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold relative z-[60]"
      style={{ background: "#2D1A2E", color: "#BFA5B8" }}>
      <span className="animate-pulse w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#BFA5B8" }} />
      <span>
        🎉 İlk siparişinde <strong style={{ color: "#fff" }}>%15 indirim!</strong>
        {" "}Kod:{" "}
        <strong style={{ color: "#fff", letterSpacing: "0.05em" }}>TEMİZ100</strong>
        {" "}— Sipariş sayfasında kullan.
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
        style={{ color: "#BFA5B8" }}>✕</button>
    </div>
  );
}
