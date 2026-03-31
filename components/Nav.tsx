"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

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

function PromoBar() {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;
  return (
    <div className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold relative"
      style={{ background: "#2D1A2E", color: "#BFA5B8" }}>
      <span className="animate-pulse w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#BFA5B8" }} />
      <span>
        🎉 İlk siparişinde <strong style={{ color: "#fff" }}>%15 indirim!</strong>
        {" "}Kod:{" "}
        <strong style={{ color: "#fff", letterSpacing: "0.05em" }}>TEMİZ100</strong>
        {" "}— Sipariş sayfasında kullan.
      </span>
      <button onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
        style={{ color: "#BFA5B8" }}>✕</button>
    </div>
  );
}

export default function Nav({ active }: { active?: string }) {
  const [open, setOpen]       = useState(false);
  const [user, setUser]       = useState<{ email?: string; full_name?: string } | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mevcut oturumu al
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          email: data.session.user.email,
          full_name: data.session.user.user_metadata?.full_name,
        });
      }
    });
    // Oturum değişimlerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleCikis = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropOpen(false);
    router.replace("/");
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <PromoBar />
      <nav className="flex items-center justify-between px-6 md:px-12 py-3 backdrop-blur-md border-b"
        style={{ background: `rgba(248,244,255,0.97)`, borderColor: `rgba(91,45,110,0.1)` }}>

        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/temizgelsin-logo.png?v=1"
            alt="Temiz Gelsin"
            style={{ height: "44px", width: "auto", objectFit: "contain", maxWidth: "160px" }}
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const isActive = (active ?? pathname) === link.href;
            return (
              <Link key={link.href} href={link.href}
                className="relative px-3 py-1.5 text-sm rounded-lg transition-all group"
                style={isActive
                  ? { color: PRI, fontWeight: 800 }
                  : { color: `rgba(45,26,46,0.65)`, fontWeight: 600 }}>
                {link.label}
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    background: PRI,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                  }} />
              </Link>
            );
          })}
          <div className="w-px h-5 mx-2" style={{ background: STN }} />

          {user ? (
            /* Kullanıcı giriş yapmış */
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border-2 hover:opacity-80 transition-all"
                style={{ borderColor: STN }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ background: PRI, color: MUV }}>
                  {initials}
                </div>
                <span className="text-sm font-semibold" style={{ color: DRK }}>
                  {user.full_name?.split(" ")[0] ?? user.email?.split("@")[0]}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke={`rgba(45,26,46,0.4)`} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl z-50 overflow-hidden"
                  style={{ background: "#fff", border: `1.5px solid ${STN}`, boxShadow: "0 8px 32px rgba(45,26,46,0.12)" }}>
                  {/* Kullanıcı bilgisi */}
                  <div className="px-5 py-4" style={{ background: `rgba(91,45,110,0.04)`, borderBottom: `1px solid ${STN}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                        style={{ background: PRI, color: MUV }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: DRK }}>
                          {user.full_name ?? "Kullanıcı"}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: `rgba(45,26,46,0.4)` }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Menü öğeleri */}
                  <div className="py-2">
                    <Link href="/profil" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all hover:opacity-80 group"
                      style={{ color: DRK }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{ background: `rgba(91,45,110,0.07)` }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: DRK }}>Hesabım</p>
                        <p className="text-[11px]" style={{ color: `rgba(45,26,46,0.4)` }}>Profil ve ayarlar</p>
                      </div>
                    </Link>
                    <Link href="/siparislerim" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all hover:opacity-80 group"
                      style={{ color: DRK }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `rgba(191,165,184,0.2)` }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PRI} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 8h14M5 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 8l1 12h12L19 8"/>
                          <path d="M10 12v4m4-4v4"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: DRK }}>Siparişlerim</p>
                        <p className="text-[11px]" style={{ color: `rgba(45,26,46,0.4)` }}>Geçmiş siparişler</p>
                      </div>
                    </Link>
                  </div>
                  {/* Çıkış */}
                  <div className="px-3 pb-3" style={{ borderTop: `1px solid ${STN}` }}>
                    <button onClick={handleCikis}
                      className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                      style={{ background: `rgba(107,39,55,0.05)`, color: `rgba(107,39,55,0.8)` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `rgba(107,39,55,0.08)` }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(107,39,55,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                      </div>
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Giriş yapılmamış */
            <div className="flex items-center gap-2">
              <Link href="/auth"
                className="px-4 py-2 text-sm font-semibold rounded-full border-2 hover:opacity-80 transition-all"
                style={{ borderColor: STN, color: `rgba(45,26,46,0.7)` }}>
                Giriş Yap
              </Link>
              <Link href="/siparis"
                className="px-5 py-2 text-sm font-bold rounded-full hover:opacity-90 transition-all"
                style={{ background: PRI, color: MUV }}>
                Sipariş Ver →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Link href="/profil"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black"
              style={{ background: PRI, color: MUV }}>
              {initials}
            </Link>
          ) : (
            <Link href="/siparis"
              className="px-4 py-2 text-xs font-bold rounded-full"
              style={{ background: PRI, color: MUV }}>
              Sipariş Ver
            </Link>
          )}
          <button onClick={() => setOpen(!open)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{ background: open ? `rgba(91,45,110,0.08)` : "transparent" }}>
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} style={{ background: DRK }} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} style={{ background: DRK }} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: DRK }} />
          </button>
        </div>
      </nav>
    {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute top-[57px] left-0 right-0 border-b shadow-lg" onClick={e => e.stopPropagation()}
            style={{ background: BG, borderColor: STN }}>
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm transition-all"
                  style={(active ?? pathname) === link.href
                    ? { color: PRI, background: `rgba(91,45,110,0.08)`, fontWeight: 700 }
                    : { color: `rgba(45,26,46,0.6)`, fontWeight: 500 }}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1 space-y-2">
                {user ? (
                  <>
                    <Link href="/profil" onClick={() => setOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 text-sm font-bold rounded-2xl border-2 transition-all"
                      style={{ borderColor: STN, color: DRK }}>
                      👤 Hesabım
                    </Link>
                    <button onClick={() => { handleCikis(); setOpen(false); }}
                      className="flex items-center justify-center w-full py-3.5 text-sm font-bold rounded-2xl border-2 transition-all"
                      style={{ borderColor: `rgba(107,39,55,0.3)`, color: `rgba(107,39,55,0.8)` }}>
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth" onClick={() => setOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 text-sm font-semibold rounded-2xl border-2 transition-all"
                      style={{ borderColor: STN, color: DRK }}>
                      Giriş Yap
                    </Link>
                    <Link href="/siparis" onClick={() => setOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 text-sm font-bold rounded-2xl hover:opacity-90 transition-all"
                      style={{ background: PRI, color: MUV }}>
                      Sipariş Ver →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
