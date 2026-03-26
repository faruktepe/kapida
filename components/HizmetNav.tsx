"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const DRK = "#2D1A2E";

function HizmetNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b"
      style={{background:`rgba(245,240,232,0.97)`, borderColor: STN}}>
      <Link href="/" className="font-black text-lg tracking-tight" style={{color: PRI}}>Temiz Gelsin</Link>
      <div className="flex items-center gap-2">
        <Link href="/hizmetler" className="hidden md:block px-3 py-1.5 text-xs transition-colors" style={{color:`rgba(45,26,46,0.4)`}}>← Hizmetler</Link>
        <Link href="/siparis" className="px-5 py-2 text-xs font-bold rounded-full hover:opacity-90 transition-all" style={{background: PRI, color: MUV}}>Sipariş Ver</Link>
      </div>
    </nav>
  );
}

export { HizmetNav };
export default HizmetNav;
