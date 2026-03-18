"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DETAYLAR = ["Dış taban komple değişimi", "İç taban (astar) değişimi", "Topuk tamiri ve yenileme", "Taban yapıştırma", "Renk uyumlu taban seçimi"];
const ADIMLAR = ["Ayakkabı teslim alınır ve analiz edilir", "Eski taban sökülerek hazırlanır", "Yeni taban yapıştırılır ve preslenir", "Kurutma ve sertleşme süreci", "Kontrol ve teslim"];

export default function Page() {
  const [galeri, setGaleri] = useState<{id:string;title:string;before_url:string|null;after_url:string|null}[]>([]);
  const [hover, setHover] = useState<string|null>(null);
  useEffect(() => {
    supabase.from("gallery").select("id,title,before_url,after_url").eq("active", true).eq("category", "spor").limit(3).then(({ data }) => setGaleri(data ?? []));
  }, []);
  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/95 backdrop-blur-md border-b border-black/8">
        <Link href="/" style={{ background: "linear-gradient(135deg, #111 60%, #5B2D6E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em" }}>Kapıda</Link>
        <div className="flex items-center gap-2">
          <Link href="/hizmetler" className="hidden md:block px-3 py-1.5 text-xs text-black/40 hover:text-black transition-colors">← Hizmetler</Link>
          <Link href="/siparis" className="px-5 py-2 text-xs font-semibold bg-black text-white rounded-full hover:bg-black/80 transition-all">Sipariş Ver</Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-24">
        <div className="border-b border-black/8 pb-12 mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-3">03 · Hizmet</p>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-none mb-6">Taban Değişimi</h1>
          <p className="text-base text-black/50 max-w-lg leading-relaxed mb-8">Aşınmış veya yırtılmış tabanları tamamen yeniliyoruz. Her marka ve model için uygun taban seçeneği.</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/siparis" className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-semibold rounded-full hover:bg-black/80 transition-all">Hemen Sipariş Ver →</Link>
            <div className="flex gap-6">
              <div><p className="text-2xl font-bold">₺600+</p><p className="text-[10px] text-black/30 mt-0.5 uppercase tracking-wider">Başlangıç</p></div>
              <div><p className="text-2xl font-bold">2–3 gün</p><p className="text-[10px] text-black/30 mt-0.5 uppercase tracking-wider">Süre</p></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-6">Kapsam</p>
            <div className="space-y-3">
              {DETAYLAR.map(d => (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#5B2D6E" }} />
                  <p className="text-sm">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-6">Süreç</p>
            <div className="space-y-4">
              {ADIMLAR.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-[10px] font-mono text-black/20 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-black/70">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {galeri.length > 0 && (
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-6">Öncesi / Sonrası</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8">
              {galeri.map(item => (
                <div key={item.id} className="bg-white cursor-pointer overflow-hidden" onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}>
                  <div className="relative h-48 overflow-hidden">
                    {item.before_url && <img src={item.before_url} alt="önce" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover === item.id ? "opacity-0" : "opacity-100"}`} />}
                    {item.after_url && <img src={item.after_url} alt="sonra" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover === item.id ? "opacity-100" : "opacity-0"}`} />}
                    <span className={`absolute top-3 left-3 text-[9px] px-2 py-1 rounded-full font-medium ${hover === item.id ? "text-white" : "bg-black/50 text-white/70"}`} style={hover === item.id ? { background: "#5B2D6E" } : {}}>{hover === item.id ? "Sonra" : "Önce"}</span>
                  </div>
                  <div className="p-4 border-t border-black/8"><p className="text-sm font-medium">{item.title}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="border-t border-black/8 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl tracking-tight">Ayakkabınız için en iyisini yapıyoruz.</p>
            <p className="text-sm text-black/40 mt-1">Kapıdan kapıya — 24 saat içinde teslim alıyoruz.</p>
          </div>
          <Link href="/siparis" className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-semibold rounded-full hover:bg-black/80 transition-all">Sipariş Ver →</Link>
        </div>
      </div>
    </main>
  );
}
