"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// PANTONE 262 #5B2D6E | PANTONE 5155 #6B2737 | PANTONE 7527 #D4C5B0
const DETAYLAR = ["Buhar ile derin temizlik", "Deri ve süet bakımı", "Bağcık değişimi", "UV sterilizasyon", "Koruyucu kaplama"];
const ADIMLAR = ["Ayakkabınız kapınızdan teslim alınır", "Analiz ve fotoğraflama yapılır", "Buhar temizlik uygulanır", "Cila ve koruma katmanı eklenir", "Paketlenerek kapınıza teslim edilir"];

const MOR = "#5B2D6E";
const KREM = "#D4C5B0";
const KOYU = "#160820";

function HizmetNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b" style={{background:"rgba(245,240,232,0.95)", borderColor:"rgba(212,197,176,0.4)"}}>
      <Link href="/" className="font-black text-xl tracking-tight" style={{color: MOR}}>Kapıda</Link>
      <div className="flex items-center gap-2">
        <Link href="/hizmetler" className="hidden md:block px-3 py-1.5 text-xs transition-colors" style={{color:"rgba(26,10,30,0.4)"}}>← Hizmetler</Link>
        <Link href="/siparis" className="px-5 py-2 text-xs font-bold text-white rounded-full hover:opacity-90 transition-all" style={{background: MOR}}>Sipariş Ver</Link>
      </div>
    </nav>
  );
}

export default function Page() {
  const [galeri, setGaleri] = useState<{id:string;title:string;before_url:string|null;after_url:string|null}[]>([]);
  const [hover, setHover] = useState<string|null>(null);
  useEffect(() => {
    supabase.from("gallery").select("id,title,before_url,after_url").eq("active", true).eq("category", "sneaker").limit(3).then(({ data }) => setGaleri(data ?? []));
  }, []);

  return (
    <main className="min-h-screen text-black" style={{background:"#F5F0E8"}}>
      <HizmetNav />
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-24">
        {/* Başlık */}
        <div className="pb-12 mb-12" style={{borderBottom:"1px solid rgba(212,197,176,0.5)"}}>
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{color:"rgba(26,10,30,0.25)"}}>01 · Hizmet</p>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">Temizlik <span style={{color:MOR}}>&</span> Bakım</h1>
          <p className="text-base max-w-lg leading-relaxed mb-8" style={{color:"rgba(26,10,30,0.5)"}}>Ayakkabınızı fabrika çıkışı gibi yeniliyoruz. Buhar temizlik, derin cila ve UV sterilizasyon ile tertemiz teslim.</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/siparis" className="inline-flex items-center gap-3 text-white px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all" style={{background:MOR}}>
              Hemen Sipariş Ver →
            </Link>
            <div className="flex gap-6">
              <div><p className="text-2xl font-black" style={{color:MOR}}>₺800+</p><p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{color:"rgba(26,10,30,0.3)"}}>Başlangıç</p></div>
              <div><p className="text-2xl font-black" style={{color:"#6B2737"}}>1–2 gün</p><p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{color:"rgba(26,10,30,0.3)"}}>Süre</p></div>
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{color:"rgba(26,10,30,0.25)"}}>Kapsam</p>
            <div className="space-y-3">
              {DETAYLAR.map(d => (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:MOR}} />
                  <p className="text-sm">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{color:"rgba(26,10,30,0.25)"}}>Süreç</p>
            <div className="space-y-4">
              {ADIMLAR.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-[10px] font-mono mt-0.5 shrink-0" style={{color:"rgba(26,10,30,0.2)"}}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm" style={{color:"rgba(0,0,0,0.7)"}}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Galeri */}
        {galeri.length > 0 && (
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{color:"rgba(26,10,30,0.25)"}}>Öncesi / Sonrası</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {galeri.map(item => (
                <div key={item.id} className="rounded-2xl overflow-hidden cursor-pointer border" style={{borderColor:"rgba(212,197,176,0.5)"}} onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}>
                  <div className="relative h-48 overflow-hidden">
                    {item.before_url && <img src={item.before_url} alt="önce" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover === item.id ? "opacity-0" : "opacity-100"}`} />}
                    {item.after_url && <img src={item.after_url} alt="sonra" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover === item.id ? "opacity-100" : "opacity-0"}`} />}
                    <span className="absolute top-3 left-3 text-[9px] px-2 py-1 rounded-full font-medium text-white" style={{background: hover === item.id ? MOR : "rgba(26,10,30,0.5)"}}>{hover === item.id ? "Sonra" : "Önce"}</span>
                  </div>
                  <div className="p-4" style={{background:"#fff", borderTop:"1px solid rgba(212,197,176,0.4)"}}><p className="text-sm font-medium">{item.title}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alt CTA */}
        <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{borderTop:"1px solid rgba(212,197,176,0.5)"}}>
          <div>
            <p className="font-black text-xl tracking-tight">Ayakkabınız için en iyisini yapıyoruz.</p>
            <p className="text-sm mt-1" style={{color:"rgba(26,10,30,0.4)"}}>Kapıdan kapıya — 24 saat içinde teslim alıyoruz.</p>
          </div>
          <Link href="/siparis" className="inline-flex items-center gap-3 text-white px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all" style={{background:"#6B2737"}}>
            Sipariş Ver →
          </Link>
        </div>
      </div>
    </main>
  );
}
