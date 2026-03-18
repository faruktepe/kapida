"use client";
import Link from "next/link";
import { useState } from "react";

// PANTONE 262 #5B2D6E | PANTONE 5155 #6B2737 | PANTONE 7527 #D4C5B0
const PRI = "#5B2D6E";
const SEC = "#6B2737";
const STONE = "#D4C5B0";
const BG = "#F5F0E8";
const DARK = "#160820";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/siparis-takip", label: "Takip" },
  { href: "/sss", label: "SSS" },
];

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{background:`rgba(245,240,232,0.97)`, borderBottom:`1px solid ${STONE}`}}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/logo-clean.png?v=4" alt="Kapıda" style={{height:"48px", width:"auto", objectFit:"contain"}} />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
              style={active === link.href
                ? {color: PRI, fontWeight: 700}
                : {color: "rgba(26,10,30,0.5)"}}>
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 mx-2" style={{background: STONE}} />
          <Link href="/siparis"
            className="px-5 py-2 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all"
            style={{background: PRI}}>
            Sipariş Ver →
          </Link>
        </div>

        {/* Mobil */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/siparis"
            className="px-4 py-2 text-xs font-bold text-white rounded-full"
            style={{background: PRI}}>
            Sipariş Ver
          </Link>
          <button onClick={() => setOpen(!open)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{background: open ? `rgba(91,45,110,0.08)` : "transparent"}}>
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} style={{background: DARK}} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} style={{background: DARK}} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} style={{background: DARK}} />
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute top-[65px] left-0 right-0 shadow-lg border-b" style={{background: BG, borderColor: STONE}} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={active === link.href
                    ? {color: PRI, background: `rgba(91,45,110,0.08)`, fontWeight: 700}
                    : {color: "rgba(26,10,30,0.6)"}}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Link href="/siparis" onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 text-sm font-bold text-white rounded-2xl hover:opacity-90 transition-all"
                  style={{background: PRI}}>
                  Sipariş Ver →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
