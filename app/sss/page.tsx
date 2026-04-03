"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useState } from "react";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";
const WHATSAPP = "905319623790";

const SSS_DATA = [
  { s:"Hangi bölgelere hizmet veriyorsunuz?",    c:"Şu an Kadıköy, Üsküdar, Ataşehir ve Ümraniye'de hizmet veriyoruz. Yakında tüm Anadolu Yakası'na genişliyoruz!" },
  { s:"Ayakkabıyı ne zaman teslim alıyorsunuz?", c:"Sipariş verdikten sonra sizi arayarak uygun bir saat aralığı belirleriz. Belirlenen saat aralığında kuryemiz en geç 2 saat içinde kapınızda olur." },
  { s:"Bakım ne kadar sürer?",                   c:"Tüm işlemlerimiz 7 iş günü içinde tamamlanır. Premium bakım ve onarım gerektiren işlemler bu süre içinde özenle hazırlanır." },
  { s:"Fiyatlar nasıl belirleniyor?",             c:"Hizmet türü ve ayakkabı durumuna göre fiyat belirlenir. Form doldurduktan sonra tahmini aralık gösterilir. Net fiyat için sizi arayabiliriz." },
  { s:"Ayakkabıma zarar gelirse ne olur?",        c:"Her ayakkabı teslim alınırken fotoğraflanır ve kayıt altına alınır. Olası hasarlarda tam karşılık ödenir." },
  { s:"Topuklu ayakkabı hizmetiniz var mı?",      c:"Evet, topuklu ayakkabı tamiri için 'Taban Değişimi' veya 'Onarım' seçeneğini seçin." },
  { s:"WhatsApp ile sipariş verebilir miyim?",    c:"Evet! Sayfanın sağ alt köşesindeki WhatsApp butonuna tıklayarak bizimle iletişime geçebilirsiniz." },
  { s:"Çocuk ayakkabısı da bakıyor musunuz?",     c:"Evet, çocuk ayakkabıları için de tüm hizmetlerimiz geçerlidir." },
];

export default function SSSPage() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <main className="min-h-screen" style={{background: BG, color: DRK}}>
      <Nav active="/sss" />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-32 pb-16" style={{background: DRK}}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{color:`rgba(191,165,184,0.4)`}}>Yardım</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{color:"#fff"}}>
          Aklında soru <span style={{color: MUV}}>mu var?</span>
        </h1>
        <p className="text-base max-w-lg" style={{color:`rgba(191,165,184,0.6)`}}>Bulamadın mı? WhatsApp'tan bir mesaj yeter.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="space-y-3">
          {SSS_DATA.map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden transition-all"
              style={{border: open === i ? `1.5px solid ${PRI}` : `1px solid ${STN}`}}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left transition-colors"
                style={{background: open === i ? `rgba(91,45,110,0.04)` : "#fff"}}>
                <span className="font-semibold pr-4 text-base" style={{color: DRK}}>{item.s}</span>
                <span className={`text-2xl font-light shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                  style={{color: PRI}}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6" style={{background:`rgba(91,45,110,0.02)`}}>
                  <div className="h-px mb-4" style={{background: STN}} />
                  <p className="text-sm leading-relaxed" style={{color:`rgba(45,26,46,0.6)`}}>{item.c}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl" style={{background: PRI}}>
          <h2 className="font-black text-2xl mb-2" style={{color:"#fff"}}>Başka sorunuz var mı?</h2>
          <p className="text-sm mb-6" style={{color:`rgba(191,165,184,0.75)`}}>Kirli ayakkabılar beklemez. Hemen yaz.</p>
          <div className="flex gap-3 flex-wrap">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank"
              className="px-6 py-3 text-sm font-bold rounded-full hover:opacity-90 transition-all"
              style={{background: STN, color: DRK}}>
              WhatsApp ile Yaz →
            </a>
            <Link href="/siparis"
              className="px-6 py-3 text-sm font-medium rounded-full hover:opacity-80 transition-all"
              style={{border:`1.5px solid rgba(191,165,184,0.35)`, color:`rgba(191,165,184,0.75)`}}>
              Sipariş Ver
            </Link>
          </div>
        </div>
      </div>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full font-bold hover:scale-110 transition-transform shadow-xl"
        style={{background: PRI, color: MUV}}>💬</a>
    </main>
  );
}
