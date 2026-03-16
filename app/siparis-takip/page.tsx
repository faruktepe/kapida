"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Nav from "@/components/Nav";

const WHATSAPP = "905319623790";

const DURUMLAR: Record<string, { label: string; bg: string; color: string; desc: string }> = {
  "Teklif Bekleniyor": { label: "Teklif Bekleniyor", bg: "#FFF7ED", color: "#C2410C", desc: "Fiyat teklifinizi hazırlıyoruz." },
  "Onaylandı": { label: "Onaylandı", bg: "#EFF6FF", color: "#1D4ED8", desc: "Siparişiniz onaylandı, kurye yolda." },
  "Kuryede": { label: "Kuryede", bg: "#F5F3FF", color: "#6D28D9", desc: "Kurye ayakkabınızı teslim almaya geliyor." },
  "İşlemde": { label: "İşlemde", bg: "#FFF7ED", color: "#FF6B35", desc: "Ayakkabınız bakımda, özenle çalışıyoruz." },
  "Tamamlandı": { label: "Tamamlandı", bg: "#F0FDF4", color: "#15803D", desc: "Bakım tamamlandı, kurye yola çıkıyor." },
  "Teslim Edildi": { label: "Teslim Edildi", bg: "#111", color: "#fff", desc: "Ayakkabınız kapınıza teslim edildi." },
};

const ADIMLAR = ["Teklif Bekleniyor", "Onaylandı", "Kuryede", "İşlemde", "Tamamlandı", "Teslim Edildi"];

export default function SiparisTakipPage() {
  const [no, setNo] = useState("");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sorgula = async () => {
    if (!no.trim()) { setError("Sipariş numaranızı girin."); return; }
    setLoading(true); setError(""); setOrder(null);
    const { data, error: dbError } = await supabase.from("orders").select("*").eq("order_number", no.trim().toUpperCase()).single();
    if (dbError || !data) { setError("Sipariş bulunamadı. Numarayı kontrol edin."); setLoading(false); return; }
    setOrder(data); setLoading(false);
  };

  const durum = order ? (DURUMLAR[order.status as string] ?? { label: order.status as string, bg: "#f5f5f5", color: "#111", desc: "" }) : null;
  const hizmetler = order ? (Array.isArray(order.services) ? order.services : JSON.parse(order.services as string)) : [];
  const musteriInfo = order ? (typeof order.customer_info === "object" ? order.customer_info as Record<string, string> : JSON.parse(order.customer_info as string)) : null;
  const aktifAdim = order ? ADIMLAR.indexOf(order.status as string) : -1;

  return (
    <main className="min-h-screen bg-white text-black">
      <Nav active="/siparis-takip" />

      <div className="bg-black text-white px-6 md:px-12 pt-32 pb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4">Takip</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
          Siparişin <span style={{ color: "#FF6B35" }}>nerede?</span>
        </h1>
        <p className="text-white/40 text-base">Sipariş numaranı girerek durumunu öğren.</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16">
        {/* Arama */}
        <div className="flex gap-3 mb-8">
          <input
            value={no}
            onChange={e => setNo(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sorgula()}
            className="flex-1 border-2 border-black/10 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:border-black transition-colors"
            placeholder="KPD-XXXXXXXX"
          />
          <button
            onClick={sorgula}
            disabled={loading}
            className="px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: "#FF6B35" }}
          >
            {loading ? "..." : "Sorgula"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">{error}</div>
        )}

        {order && durum && (
          <div className="space-y-4">
            {/* Durum kartı */}
            <div className="rounded-2xl p-6 border-2" style={{ background: durum.bg, borderColor: durum.color + "30" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-black/40">{order.order_number as string}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: durum.color, color: durum.bg === "#111" ? "#fff" : "#fff" }}>{durum.label}</span>
              </div>
              <p className="text-sm" style={{ color: durum.color }}>{durum.desc}</p>
            </div>

            {/* İlerleme çubuğu */}
            <div className="rounded-2xl border border-black/8 p-6">
              <p className="text-[10px] uppercase tracking-widest text-black/30 mb-4">İlerleme</p>
              <div className="flex items-center gap-1">
                {ADIMLAR.map((adim, i) => (
                  <div key={adim} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-3 h-3 rounded-full transition-all ${i <= aktifAdim ? "" : "bg-black/10"}`}
                        style={i <= aktifAdim ? { background: "#FF6B35" } : {}} />
                      <p className="text-[8px] text-center text-black/30 mt-1 hidden md:block leading-tight max-w-[60px]">{adim}</p>
                    </div>
                    {i < ADIMLAR.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 ${i < aktifAdim ? "" : "bg-black/8"}`}
                        style={i < aktifAdim ? { background: "#FF6B35" } : {}} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ayakkabı bilgisi */}
            <div className="rounded-2xl border border-black/8 p-6">
              <p className="text-[10px] uppercase tracking-widest text-black/30 mb-4">Ayakkabı</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-black/40 text-xs mb-1">Marka</p><p className="font-medium">{order.brand as string}</p></div>
                {order.model && <div><p className="text-black/40 text-xs mb-1">Model</p><p className="font-medium">{order.model as string}</p></div>}
                <div><p className="text-black/40 text-xs mb-1">Renk</p><p className="font-medium">{order.color as string}</p></div>
                <div><p className="text-black/40 text-xs mb-1">Tür</p><p className="font-medium">{order.shoe_type as string}</p></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-black/30 mb-2">Hizmetler</p>
              <div className="flex flex-wrap gap-2">
                {hizmetler.map((h: string) => (
                  <span key={h} className="text-xs border border-black/10 px-3 py-1 rounded-full">{h}</span>
                ))}
              </div>
            </div>

            {/* Fiyat */}
            <div className="rounded-2xl border border-black/8 p-6 flex justify-between items-center">
              <p className="text-sm text-black/50">Tahmini Fiyat</p>
              <p className="text-xl font-black">{order.price as string}</p>
            </div>

            {musteriInfo && (
              <div className="rounded-2xl border border-black/8 p-6">
                <p className="text-[10px] uppercase tracking-widest text-black/30 mb-4">Teslimat</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-black/40 text-xs mb-1">Ad</p><p className="font-medium">{musteriInfo.ad}</p></div>
                  <div><p className="text-black/40 text-xs mb-1">İlçe</p><p className="font-medium">{musteriInfo.ilce}</p></div>
                </div>
              </div>
            )}

            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{ background: "#111" }}>
              💬 Sipariş hakkında WhatsApp'tan yaz
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
