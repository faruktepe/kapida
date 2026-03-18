"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useState } from "react";

const WHATSAPP = "905319623790";
const PRI = "#5B2D6E";
const SEC = "#6B2737";
const STONE = "#D4C5B0";
const BG = "#F5F0E8";
const DARK = "#160820";
const TEXT = "#160820";

const SSS_DATA = [
  { s: "Hangi bölgelere hizmet veriyorsunuz?", c: "Şu an İstanbul Anadolu Yakası'nda hizmet veriyoruz: Ataşehir, Beykoz, Çekmeköy, Kadıköy, Kartal, Maltepe, Pendik, Sancaktepe, Sultanbeyli, Tuzla, Ümraniye ve Üsküdar." },
  { s: "Ayakkabıyı ne zaman teslim alıyorsunuz?", c: "Sipariş verildikten sonra 24 saat içinde kuryemiz kapınıza gelir." },
  { s: "Bakım ne kadar sürer?", c: "Standart temizlik & bakım 1-2 iş günü, onarım gerektiren işlemler 2-3 iş günü sürer." },
  { s: "Fiyatlar nasıl belirleniyor?", c: "Hizmet türü ve ayakkabı durumuna göre fiyat belirlenir. Form doldurduktan sonra tahmini aralık gösterilir. Net fiyat için sizi arayabiliriz." },
  { s: "Ayakkabıma zarar gelirse ne olur?", c: "Her ayakkabı teslim alınırken fotoğraflanır ve kayıt altına alınır. Olası hasarlarda tam karşılık ödenir." },
  { s: "Topuklu ayakkabı hizmetiniz var mı?", c: "Evet, topuklu ayakkabı tamiri için 'Taban Değişimi' veya 'Onarım' seçeneğini seçin." },
  { s: "WhatsApp ile sipariş verebilir miyim?", c: "Evet! Sayfanın sağ alt köşesindeki WhatsApp butonuna tıklayarak bizimle iletişime geçebilirsiniz." },
  { s: "Çocuk ayakkabısı da bakıyor musunuz?", c: "Evet, çocuk ayakkabıları için de tüm hizmetlerimiz geçerlidir." },
];

export default function SSSPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <main className="min-h-screen text-black" style={{background: BG}}>
      <Nav active="/sss" />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-32 pb-16" style={{background: DARK}}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{color:`rgba(212,197,176,0.5)`}}>Yardım</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{color: "#fff"}}>
          Sık sorulan <span style={{color: STONE}}>sorular.</span>
        </h1>
        <p className="text-base max-w-lg" style={{color:`rgba(212,197,176,0.6)`}}>Aklınızdaki soruların cevabını bulamadıysanız WhatsApp'tan yazın.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="space-y-3">
          {SSS_DATA.map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden transition-all"
              style={{border: open === i ? `1.5px solid ${PRI}` : `1px solid ${STONE}`}}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left transition-colors"
                style={{background: open === i ? `rgba(91,45,110,0.04)` : "#fff"}}>
                <span className="font-semibold pr-4 text-base" style={{color: TEXT}}>{item.s}</span>
                <span className={`text-2xl font-light shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                  style={{color: PRI}}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6" style={{background: `rgba(91,45,110,0.02)`}}>
                  <div className="h-px mb-4" style={{background: `rgba(91,45,110,0.1)`}} />
                  <p className="text-sm leading-relaxed" style={{color: `rgba(26,10,30,0.6)`}}>{item.c}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-8 rounded-2xl" style={{background: SEC}}>
          <h2 className="font-black text-2xl mb-2 text-white">Başka sorunuz var mı?</h2>
          <p className="text-sm mb-6" style={{color:`rgba(212,197,176,0.8)`}}>WhatsApp üzerinden 7/24 ulaşabilirsiniz.</p>
          <div className="flex gap-3 flex-wrap">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank"
              className="px-6 py-3 text-sm font-bold rounded-full hover:opacity-90 transition-all"
              style={{background: STONE, color: DARK}}>
              WhatsApp ile Yaz →
            </a>
            <Link href="/siparis"
              className="px-6 py-3 text-sm font-medium rounded-full hover:opacity-80 transition-all"
              style={{border:`1.5px solid rgba(212,197,176,0.4)`, color:`rgba(212,197,176,0.8)`}}>
              Sipariş Ver
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WA */}
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold hover:scale-110 transition-transform shadow-xl"
        style={{background: SEC}}>💬</a>
    </main>
  );
}
