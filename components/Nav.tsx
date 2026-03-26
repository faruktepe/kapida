"use client";
import Link from "next/link";
import { useState } from "react";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

const NAV_LINKS = [
  { href: "/",              label: "Ana Sayfa" },
  { href: "/hizmetler",     label: "Hizmetler" },
  { href: "/galeri",        label: "Galeri" },
  { href: "/siparis-takip", label: "Takip" },
  { href: "/sss",           label: "SSS" },
];

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b"
        style={{background:`rgba(245,240,232,0.97)`, borderColor: STN}}>

        <Link href="/" className="flex items-center shrink-0 gap-2">
          <img src="/temizgelsinlogo.png?v=1" alt="Temiz Gelsin" style={{height:"48px", width:"auto", objectFit:"contain"}} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 text-sm rounded-lg transition-all"
              style={active === link.href
                ? {color: PRI, fontWeight: 700}
                : {color:`rgba(45,26,46,0.5)`, fontWeight: 500}}>
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 mx-2" style={{background: STN}} />
          <Link href="/siparis"
            className="px-5 py-2 text-sm font-bold rounded-full hover:opacity-90 transition-all"
            style={{background: PRI, color: MUV}}>
            Sipariş Ver →
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <Link href="/siparis"
            className="px-4 py-2 text-xs font-bold rounded-full"
            style={{background: PRI, color: MUV}}>
            Sipariş Ver
          </Link>
          <button onClick={() => setOpen(!open)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{background: open ? `rgba(91,45,110,0.08)` : "transparent"}}>
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} style={{background: DRK}} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} style={{background: DRK}} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} style={{background: DRK}} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute top-[65px] left-0 right-0 border-b shadow-lg" onClick={e => e.stopPropagation()}
            style={{background: BG, borderColor: STN}}>
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm transition-all"
                  style={active === link.href
                    ? {color: PRI, background:`rgba(91,45,110,0.08)`, fontWeight: 700}
                    : {color:`rgba(45,26,46,0.6)`, fontWeight: 500}}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Link href="/siparis" onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 text-sm font-bold rounded-2xl hover:opacity-90 transition-all"
                  style={{background: PRI, color: MUV}}>
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
