"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";
const WHATSAPP = "905319623790";

type GalleryItem = { id:string; title:string; category:string; service:string; district:string; before_url:string|null; after_url:string|null; };

const KATEGORILER = [
  { id:"hepsi",   label:"Tümü"     },
  { id:"sneaker", label:"Sneaker"  },
  { id:"deri",    label:"Deri Bot" },
  { id:"suet",    label:"Süet"     },
  { id:"spor",    label:"Spor"     },
  { id:"klasik",  label:"Klasik"   },
  { id:"diger",   label:"Diğer"    },
];

function BeforeAfterCard({ item }: { item: GalleryItem }) {
  const [showAfter, setShowAfter] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      style={{border:`1px solid ${STN}`, background:"#fff"}}
      onClick={() => setShowAfter(v => !v)}>
      <div className="relative h-56 overflow-hidden" style={{background:`rgba(212,197,176,0.15)`}}>
        <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? "opacity-0" : "opacity-100"}`}>
          {item.before_url
            ? <img src={item.before_url} alt="önce" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-4xl opacity-20">👟</span>
                <span className="text-[10px] uppercase tracking-widest" style={{color:`rgba(45,26,46,0.25)`}}>Fotoğraf yükleniyor</span>
              </div>}
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{background:`rgba(45,26,46,0.6)`, color: MUV}}>Önce</span>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? "opacity-100" : "opacity-0"}`}>
          {item.after_url
            ? <img src={item.after_url} alt="sonra" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><span className="text-4xl">✨</span></div>}
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{background: PRI, color: MUV}}>Sonra</span>
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] rounded-full px-2 py-1 font-medium"
          style={{background:`rgba(45,26,46,0.5)`, color:`rgba(212,197,176,0.9)`}}>
          {showAfter ? "← Önce" : "Sonra →"}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm" style={{color: DRK}}>{item.title}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{border:`1px solid ${STN}`, color:`rgba(45,26,46,0.5)`}}>
            {KATEGORILER.find(k => k.id === item.category)?.label ?? item.category}
          </span>
        </div>
        <p className="text-[11px] mt-1 uppercase tracking-wider" style={{color:`rgba(45,26,46,0.35)`}}>
          {item.service}{item.district ? ` · ${item.district}` : ""}
        </p>
      </div>
    </div>
  );
}

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKat, setActiveKat] = useState("hepsi");

  useEffect(() => {
    supabase.from("gallery").select("*").eq("active", true).order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const filtered = activeKat === "hepsi" ? items : items.filter(i => i.category === activeKat);

  return (
    <main className="min-h-screen" style={{background: BG, color: DRK}}>
      <Nav active="/galeri" />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-32 pb-16" style={{background: DRK}}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{color:`rgba(191,165,184,0.4)`}}>Sonuçlar</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{color:"#fff"}}>
          Fark <span style={{color: MUV}}>görünür.</span>
        </h1>
        <p className="text-base" style={{color:`rgba(191,165,184,0.6)`}}>Tıkla — önce/sonra fotoğraflarını gör.</p>
      </div>

      <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto">
        {/* Filtreler */}
        <div className="flex gap-2 flex-wrap mb-10">
          {KATEGORILER.map(k => (
            <button key={k.id} onClick={() => setActiveKat(k.id)}
              className="px-4 py-2 text-xs font-semibold rounded-full transition-all"
              style={activeKat === k.id
                ? {background: PRI, color: MUV}
                : {border:`1px solid ${STN}`, color:`rgba(45,26,46,0.5)`, background:"#fff"}}>
              {k.label}
              {k.id !== "hepsi" && <span className="ml-1.5 opacity-50">{items.filter(i => i.category === k.id).length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl animate-pulse" style={{background:`rgba(212,197,176,0.3)`}} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" style={{color:`rgba(91,45,110,0.3)`}}>
            <p className="text-5xl mb-4">📸</p>
            <p className="text-sm">Bu kategoride henüz fotoğraf yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => <BeforeAfterCard key={item.id} item={item} />)}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-20 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{background: DRK}}>
          <div>
            <p className="font-black text-xl" style={{color:"#fff"}}>Ayakkabınız da burada olabilir.</p>
            <p className="text-sm mt-1" style={{color:`rgba(191,165,184,0.6)`}}>Temiz Gelsinn kapıya — 2 gün içinde teslim.</p>
          </div>
          <Link href="/siparis"
            className="shrink-0 px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all"
            style={{background: PRI, color: MUV}}>
            Hemen Sipariş Ver →
          </Link>
        </div>
      </div>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full font-bold hover:scale-110 transition-transform shadow-xl"
        style={{background: PRI, color: MUV}}>💬</a>
    </main>
  );
}
