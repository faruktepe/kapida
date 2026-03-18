"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { supabase } from "@/lib/supabase";

const WHATSAPP = "905319623790";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  service: string;
  district: string;
  before_url: string | null;
  after_url: string | null;
};

const KATEGORILER = [
  { id: "hepsi", label: "Tümü" },
  { id: "sneaker", label: "Sneaker" },
  { id: "deri", label: "Deri Bot" },
  { id: "suet", label: "Süet" },
  { id: "spor", label: "Spor" },
  { id: "klasik", label: "Klasik" },
  { id: "diger", label: "Diğer" },
];

function BeforeAfterCard({ item }: { item: GalleryItem }) {
  const [showAfter, setShowAfter] = useState(false);
  return (
    <div className="border border-black/8 rounded-2xl overflow-hidden hover:border-black/20 hover:shadow-md transition-all duration-300 cursor-pointer" onClick={() => setShowAfter(v => !v)}>
      <div className="relative h-56 bg-black/[0.03] overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? "opacity-0" : "opacity-100"}`}>
          {item.before_url ? (
            <img src={item.before_url} alt="önce" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl grayscale opacity-20">👟</span>
              <span className="text-[10px] uppercase tracking-widest text-black/20">Fotoğraf yükleniyor</span>
            </div>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 bg-black/60 text-white/80 rounded-full">Önce</span>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? "opacity-100" : "opacity-0"}`}>
          {item.after_url ? (
            <img src={item.after_url} alt="sonra" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">✨</span>
            </div>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full text-white" style={{ background: "#5B2D6E" }}>Sonra</span>
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-white/70 bg-black/40 px-2 py-1 rounded-full">
          {showAfter ? "← Önce" : "Sonra →"}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm">{item.title}</p>
          <span className="text-[10px] border border-black/10 px-2 py-0.5 rounded-full shrink-0 text-black/40">
            {KATEGORILER.find(k => k.id === item.category)?.label ?? item.category}
          </span>
        </div>
        <p className="text-[11px] text-black/35 mt-1 uppercase tracking-wider">
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
    <main className="min-h-screen bg-white text-black">
      <Nav active="/galeri" />

      <div className="bg-black text-white px-6 md:px-12 pt-32 pb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4">Sonuçlar</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
          Fark <span style={{ color: "#5B2D6E" }}>görünür.</span>
        </h1>
        <p className="text-white/40 text-base">Tıkla — önce/sonra fotoğraflarını gör.</p>
      </div>

      <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto">
        <div className="flex gap-2 flex-wrap mb-10">
          {KATEGORILER.map(k => (
            <button key={k.id} onClick={() => setActiveKat(k.id)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${activeKat === k.id ? "text-white" : "border border-black/12 text-black/50 hover:border-black/30 hover:text-black"}`}
              style={activeKat === k.id ? { background: "#5B2D6E" } : {}}>
              {k.label}
              {k.id !== "hepsi" && <span className="ml-1.5 opacity-50">{items.filter(i => i.category === k.id).length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-black/[0.03] rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-black/30">
            <p className="text-5xl mb-4">📸</p>
            <p className="text-sm">Bu kategoride henüz fotoğraf yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => <BeforeAfterCard key={item.id} item={item} />)}
          </div>
        )}

        <div className="mt-20 p-8 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ background: "#111" }}>
          <div>
            <p className="font-black text-xl">Ayakkabınız da burada olabilir.</p>
            <p className="text-white/50 text-sm mt-1">Kapıdan kapıya — 2 gün içinde teslim.</p>
          </div>
          <Link href="/siparis" className="shrink-0 px-8 py-4 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all" style={{ background: "#5B2D6E" }}>
            Hemen Sipariş Ver →
          </Link>
        </div>
      </div>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold hover:scale-110 transition-transform" style={{ background: "#5B2D6E" }}>💬</a>
    </main>
  );
}
