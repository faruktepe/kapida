"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";

const HIZMETLER = [
  {
    slug: "temizlik-bakim",
    no: "01",
    ad: "Temizlik & Bakım",
    kisa: "Buhar temizlik, derin cila, bağcık değişimi dahil.",
    fiyat: "₺800+",
    sure: "1-2 gün",
    renk: "#FF6B35",
    items: ["Buhar temizlik", "Derin cila", "Bağcık değişimi", "UV sterilizasyon"],
    icon: "🧹",
  },
  {
    slug: "boya-restorasyon",
    no: "02",
    ad: "Boya & Restorasyon",
    kisa: "Profesyonel boya ve renk yenileme. Yıpranmışı sıfırlar.",
    fiyat: "₺1.200+",
    sure: "2-3 gün",
    renk: "#111",
    items: ["Renk yenileme", "Çizik tamiri", "Deri boyama", "Koruyucu kaplama"],
    icon: "🎨",
  },
  {
    slug: "taban-degisimi",
    no: "03",
    ad: "Taban Değişimi",
    kisa: "Dış taban komple değişimi. Her tür ayakkabı.",
    fiyat: "₺600+",
    sure: "2-3 gün",
    renk: "#FF6B35",
    items: ["Dış taban", "İç taban", "Topuk tamiri", "Yapıştırma"],
    icon: "👟",
  },
  {
    slug: "dikis-onarim",
    no: "04",
    ad: "Dikiş & Onarım",
    kisa: "Yırtık dikişler, çoraplık ve fort tamiri.",
    fiyat: "₺250+",
    sure: "1-2 gün",
    renk: "#111",
    items: ["Dikiş tamiri", "Çoraplık onarım", "Fort tamiri", "Fermuvar"],
    icon: "🔧",
  },
];

export default function HizmetlerPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAV */}
      <Nav active="/hizmetler" />

      {/* HERO */}
      <div className="bg-black text-white px-6 md:px-12 pt-32 pb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4">Hizmetler</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
          Ne <span style={{ color: "#FF6B35" }}>yapıyoruz?</span>
        </h1>
        <p className="text-white/40 text-base max-w-lg">Kapıdan kapıya ayakkabı bakım ve onarım. Anadolu Yakası genelinde hizmet.</p>
      </div>

      {/* KARTLAR */}
      <div className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HIZMETLER.map((h) => (
            <Link key={h.slug} href={`/hizmetler/${h.slug}`} className="group block">
              <div className="border border-black/10 rounded-2xl overflow-hidden hover:border-black/30 hover:shadow-lg transition-all duration-300">
                {/* Üst renkli bant */}
                <div className="h-2 w-full" style={{ background: h.renk }} />

                <div className="p-8">
                  {/* Başlık satırı */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-black/25 tracking-widest">{h.no}</span>
                      <h2 className="text-2xl font-bold mt-1">{h.ad}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: h.renk }}>{h.fiyat}</p>
                      <p className="text-[11px] text-black/35 mt-0.5">{h.sure}</p>
                    </div>
                  </div>

                  {/* Açıklama */}
                  <p className="text-sm text-black/50 mb-6 leading-relaxed">{h.kisa}</p>

                  {/* İçerik listesi */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {h.items.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: h.renk }} />
                        <span className="text-xs text-black/60">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Alt buton */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/6">
                    <span className="text-xs text-black/35 uppercase tracking-wider">Detayları gör</span>
                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: h.renk }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* İndirim bandı */}
        <div className="mt-8 p-6 rounded-2xl flex items-center gap-4" style={{ background: "#FF6B35" }}>
          <div className="text-white">
            <p className="font-black text-xl">3+ hizmet seçin — %20 indirim</p>
            <p className="text-white/70 text-sm mt-1">Birden fazla hizmet alırsanız otomatik indirim uygulanır.</p>
          </div>
          <Link href="/siparis" className="ml-auto shrink-0 px-6 py-3 bg-white text-black font-bold text-sm rounded-full hover:bg-white/90 transition-all whitespace-nowrap">
            Sipariş Ver →
          </Link>
        </div>
      </div>
    </main>
  );
}
