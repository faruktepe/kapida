"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Nav from "@/components/Nav";

const WHATSAPP = "905319623790";
const PRI = "#5B2D6E";
const SEC = "#6B2737";
const STONE = "#D4C5B0";
const BG = "#F5F0E8";
const DARK = "#160820";
const TEXT = "#160820";

const ADIMLAR = ["Teklif Bekleniyor", "Onaylandı", "Kuryede", "İşlemde", "Tamamlandı", "Teslim Edildi"];

const DURUMLAR: Record<string, {label: string; bg: string; color: string; desc: string}> = {
  "Teklif Bekleniyor": {label:"Teklif Bekleniyor", bg:`rgba(107,39,55,0.08)`, color:SEC, desc:"Fiyat teklifinizi hazırlıyoruz."},
  "Onaylandı": {label:"Onaylandı", bg:`rgba(91,45,110,0.08)`, color:PRI, desc:"Siparişiniz onaylandı, kurye yolda."},
  "Kuryede": {label:"Kuryede", bg:`rgba(91,45,110,0.12)`, color:PRI, desc:"Kurye ayakkabınızı teslim almaya geliyor."},
  "İşlemde": {label:"İşlemde", bg:`rgba(107,39,55,0.1)`, color:SEC, desc:"Ayakkabınız bakımda, özenle çalışıyoruz."},
  "Tamamlandı": {label:"Tamamlandı", bg:`rgba(91,45,110,0.08)`, color:PRI, desc:"Bakım tamamlandı, kurye yola çıkıyor."},
  "Teslim Edildi": {label:"Teslim Edildi", bg:DARK, color:STONE, desc:"Ayakkabınız kapınıza teslim edildi."},
};

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

  const durum = order ? (DURUMLAR[order.status as string] ?? {label: order.status as string, bg:`rgba(212,197,176,0.2)`, color:TEXT, desc:""}) : null;
  const hizmetler = order ? (Array.isArray(order.services) ? order.services : JSON.parse(order.services as string)) : [];
  const musteriInfo = order ? (typeof order.customer_info === "object" ? order.customer_info as Record<string, string> : JSON.parse(order.customer_info as string)) : null;
  const aktifAdim = order ? ADIMLAR.indexOf(order.status as string) : -1;

  return (
    <main className="min-h-screen" style={{background: BG, color: TEXT}}>
      <Nav active="/siparis-takip" />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-32 pb-16" style={{background: DARK}}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{color:`rgba(212,197,176,0.5)`}}>Takip</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{color:"#fff"}}>
          Siparişin <span style={{color: STONE}}>nerede?</span>
        </h1>
        <p className="text-base" style={{color:`rgba(212,197,176,0.6)`}}>Sipariş numaranı girerek durumunu öğren.</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16">
        {/* Arama */}
        <div className="flex gap-3 mb-8">
          <input value={no} onChange={e => setNo(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sorgula()}
            className="flex-1 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none transition-colors"
            style={{border:`2px solid ${STONE}`, background:"#fff", color:TEXT}}
            placeholder="KPD-XXXXXXXX" />
          <button onClick={sorgula} disabled={loading}
            className="px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            style={{background: PRI}}>
            {loading ? "..." : "Sorgula"}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm mb-6" style={{background:`rgba(107,39,55,0.08)`, border:`1px solid rgba(107,39,55,0.2)`, color:SEC}}>
            {error}
          </div>
        )}

        {order && durum && (
          <div className="space-y-4">
            {/* Durum kartı */}
            <div className="rounded-2xl p-6 border-2" style={{background: durum.bg, borderColor:`${durum.color}40`}}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm" style={{color:`rgba(26,10,30,0.4)`}}>{order.order_number as string}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{background: durum.color}}>
                  {durum.label}
                </span>
              </div>
              <p className="text-sm font-medium" style={{color: durum.color}}>{durum.desc}</p>
            </div>

            {/* İlerleme */}
            <div className="rounded-2xl p-6" style={{background:"#fff", border:`1px solid ${STONE}`}}>
              <p className="text-[10px] uppercase tracking-widest mb-4" style={{color:`rgba(26,10,30,0.3)`}}>İlerleme</p>
              <div className="flex items-center gap-1">
                {ADIMLAR.map((adim, i) => (
                  <div key={adim} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-3 h-3 rounded-full transition-all"
                        style={{background: i <= aktifAdim ? PRI : STONE}} />
                      <p className="text-[8px] text-center mt-1 hidden md:block leading-tight max-w-[60px]"
                        style={{color:`rgba(26,10,30,0.3)`}}>{adim}</p>
                    </div>
                    {i < ADIMLAR.length - 1 && (
                      <div className="h-0.5 flex-1 mx-1 transition-all"
                        style={{background: i < aktifAdim ? PRI : STONE}} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ayakkabı bilgisi */}
            <div className="rounded-2xl p-6" style={{background:"#fff", border:`1px solid ${STONE}`}}>
              <p className="text-[10px] uppercase tracking-widest mb-4" style={{color:`rgba(26,10,30,0.3)`}}>Ayakkabı</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>Marka</p><p className="font-medium">{order.brand as string}</p></div>
                {order.model && <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>Model</p><p className="font-medium">{order.model as string}</p></div>}
                <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>Renk</p><p className="font-medium">{order.color as string}</p></div>
                <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>Tür</p><p className="font-medium">{order.shoe_type as string}</p></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:`rgba(26,10,30,0.3)`}}>Hizmetler</p>
              <div className="flex flex-wrap gap-2">
                {hizmetler.map((h: string) => (
                  <span key={h} className="text-xs px-3 py-1 rounded-full"
                    style={{border:`1px solid ${STONE}`, color:`rgba(91,45,110,0.7)`}}>{h}</span>
                ))}
              </div>
            </div>

            {/* Fiyat */}
            <div className="rounded-2xl p-6 flex justify-between items-center"
              style={{background:"#fff", border:`1px solid ${STONE}`}}>
              <p className="text-sm" style={{color:`rgba(26,10,30,0.5)`}}>Tahmini Fiyat</p>
              <p className="text-xl font-black" style={{color: PRI}}>{order.price as string}</p>
            </div>

            {musteriInfo && (
              <div className="rounded-2xl p-6" style={{background:"#fff", border:`1px solid ${STONE}`}}>
                <p className="text-[10px] uppercase tracking-widest mb-4" style={{color:`rgba(26,10,30,0.3)`}}>Teslimat</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>Ad</p><p className="font-medium">{musteriInfo.ad}</p></div>
                  <div><p className="text-xs mb-1" style={{color:`rgba(26,10,30,0.4)`}}>İlçe</p><p className="font-medium">{musteriInfo.ilce}</p></div>
                </div>
              </div>
            )}

            {/* WA butonu */}
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
              style={{background: SEC, color:"#fff"}}>
              💬 Sipariş hakkında WhatsApp'tan yaz
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
