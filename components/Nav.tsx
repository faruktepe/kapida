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
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 backdrop-blur-md border-b"
        style={{ background: `rgba(245,240,232,0.97)`, borderColor: STN }}>

        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/temizgelsin-logo.png?v=1"
            alt="Temiz Gelsin"
            style={{ height: "44px", width: "auto", objectFit: "contain", maxWidth: "160px" }}
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 text-sm rounded-lg transition-all"
              style={(active ?? pathname) === link.href
                ? { color: PRI, fontWeight: 700 }
                : { color: `rgba(45,26,46,0.5)`, fontWeight: 500 }}>
              {link.label}
            </Link>
          ))}
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
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-lg py-2 z-50"
                  style={{ background: "#fff", border: `1.5px solid ${STN}` }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: STN }}>
                    <p className="text-xs font-bold" style={{ color: DRK }}>
                      {user.full_name ?? "Kullanıcı"}
                    </p>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: `rgba(45,26,46,0.4)` }}>
                      {user.email}
                    </p>
                  </div>
                  <Link href="/profil" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    style={{ color: DRK }}>
                    👤 Hesabım
                  </Link>
                  <Link href="/siparislerim" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    style={{ color: DRK }}>
                    📦 Siparişlerim
                  </Link>
                  <div className="border-t mt-1 pt-1" style={{ borderColor: STN }}>
                    <button onClick={handleCikis}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-gray-50 transition-colors"
                      style={{ color: `rgba(107,39,55,0.8)` }}>
                      🚪 Çıkış Yap
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
    </>
  );
}
