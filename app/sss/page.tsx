"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useState } from "react";

const WHATSAPP = "905319623790";

const SSS = [
  { s: "Hangi bölgelere hizmet veriyorsunuz?", c: "Şu an İstanbul Anadolu Yakası'nda hizmet veriyoruz: Ataşehir, Beykoz, Çekmeköy, Kadıköy, Kartal, Maltepe, Pendik, Sancaktepe, Sultanbeyli, Tuzla, Ümraniye ve Üsküdar." },
  { s: "Ayakkabıyı ne zaman teslim alıyorsunuz?", c: "Sipariş verildikten sonra 24 saat içinde kuryemiz kapınıza gelir." },
  { s: "Bakım ne kadar sürer?", c: "Standart temizlik & bakım 1-2 iş günü, onarım gerektiren işlemler 2-3 iş günü sürer." },
  { s: "Fiyatlar nasıl belirleniyor?", c: "Hizmet türü ve ayakkabı durumuna göre fiyat belirlenir. Form doldurduktan sonra tahmini aralık gösterilir. Net fiyat için sizi arayabiliriz." },
  { s: "Ayakkabıma zarar gelirse ne olur?", c: "Her ayakkabı teslim alınırken fotoğraflanır ve kayıt altına alınır. Olası hasarlarda tam karşılık ödenir." },
  { s: "Topuklu ayakkabı hizmetiniz var mı?", c: "Evet, topuklu ayakkabı tamiri için 'Taban Değişimi' veya 'Onarım' seçeneğini seçin. Siparişten önce fotoğraf paylaşmanızı öneririz." },
  { s: "WhatsApp ile sipariş verebilir miyim?", c: "Evet! Sayfanın sağ alt köşesindeki WhatsApp butonuna tıklayarak bizimle iletişime geçebilirsiniz." },
  { s: "Çocuk ayakkabısı da bakıyor musunuz?", c: "Evet, çocuk ayakkabıları için de tüm hizmetlerimiz geçerlidir." },
];

export default function SSSPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-white text-black">
      <Nav active="/sss" />

      <div className="bg-black text-white px-6 md:px-12 pt-32 pb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4">Yardım</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
          Sık sorulan <span style={{ color: "#FF6B35" }}>sorular.</span>
        </h1>
        <p className="text-white/40 text-base max-w-lg">Aklınızdaki soruların cevabını bulamadıysanız WhatsApp'tan yazın.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="space-y-3">
          {SSS.map((item, i) => (
            <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${open === i ? "border-black/20" : "border-black/8"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="font-semibold pr-4 text-base">{item.s}</span>
                <span className={`text-2xl font-light shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} style={{ color: "#FF6B35" }}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-black/6 mb-4" />
                  <p className="text-black/60 text-sm leading-relaxed">{item.c}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl text-white" style={{ background: "#111" }}>
          <h2 className="font-black text-2xl mb-2">Başka sorunuz var mı?</h2>
          <p className="text-white/50 text-sm mb-6">WhatsApp üzerinden 7/24 ulaşabilirsiniz.</p>
          <div className="flex gap-3 flex-wrap">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="px-6 py-3 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all" style={{ background: "#FF6B35" }}>
              WhatsApp ile Yaz →
            </a>
            <Link href="/siparis" className="px-6 py-3 text-sm font-medium border border-white/20 text-white/70 rounded-full hover:border-white hover:text-white transition-all">
              Sipariş Ver
            </Link>
          </div>
        </div>
      </div>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold hover:scale-110 transition-transform" style={{ background: "#FF6B35" }}>💬</a>
    </main>
  );
}
