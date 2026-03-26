"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Nav from "@/components/Nav";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

const HIZMETLER = [
  { slug:"temizlik-bakim",  no:"01", ad:"Temizlik & Bakım",   kisa:"Buhar temizlik, derin cila, bağcık değişimi dahil.", fiyat:"₺800+",   sure:"1-2 gün", accent: PRI, items:["Buhar temizlik","Derin cila","Bağcık değişimi","UV sterilizasyon"] },
  { slug:"boya-restorasyon",no:"02", ad:"Boya & Restorasyon", kisa:"Profesyonel boya ve renk yenileme. Yıpranmışı sıfırlar.", fiyat:"₺1.200+",sure:"2-3 gün", accent: MUV, items:["Renk yenileme","Çizik tamiri","Deri boyama","Koruyucu kaplama"] },
  { slug:"taban-degisimi",  no:"03", ad:"Taban Değişimi",     kisa:"Dış taban komple değişimi. Her tür ayakkabı.", fiyat:"₺600+",   sure:"2-3 gün", accent: PRI, items:["Dış taban","İç taban","Topuk tamiri","Yapıştırma"] },
  { slug:"dikis-onarim",    no:"04", ad:"Dikiş & Onarım",     kisa:"Yırtık dikişler, çoraplık ve fort tamiri.", fiyat:"₺250+",   sure:"1-2 gün", accent: MUV, items:["Dikiş tamiri","Çoraplık onarım","Fort tamiri","Fermuar"] },
];

export default function HizmetlerPage() {
  return (
    <main className="min-h-screen" style={{background: BG}}>
      <Nav active="/hizmetler" />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-32 pb-16" style={{background: DRK}}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{color:`rgba(191,165,184,0.4)`}}>Hizmetler</p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{color:"#fff"}}>
          Ne <span style={{color: MUV}}>yapıyoruz?</span>
        </h1>
        <p className="text-base max-w-lg" style={{color:`rgba(191,165,184,0.6)`}}>Temiz Gelsin kapıya ayakkabı bakım ve onarım. Anadolu Yakası genelinde hizmet.</p>
      </div>

      {/* Kartlar */}
      <div className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HIZMETLER.map(h => (
            <Link key={h.slug} href={`/hizmetler/${h.slug}`} className="group block">
              <div className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{background:"#fff", border:`1px solid ${STN}`}}>
                <div className="h-[3px] w-full" style={{background: h.accent}} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest" style={{color:`rgba(45,26,46,0.2)`}}>{h.no}</span>
                      <h2 className="text-2xl font-bold mt-1" style={{color: DRK}}>{h.ad}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{color: h.accent}}>{h.fiyat}</p>
                      <p className="text-[11px] mt-0.5" style={{color:`rgba(45,26,46,0.35)`}}>{h.sure}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-6 leading-relaxed" style={{color:`rgba(45,26,46,0.5)`}}>{h.kisa}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {h.items.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{background: h.accent}} />
                        <span className="text-xs" style={{color:`rgba(45,26,46,0.6)`}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4" style={{borderTop:`1px solid ${STN}`}}>
                    <span className="text-xs uppercase tracking-wider" style={{color:`rgba(45,26,46,0.3)`}}>Detayları gör</span>
                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform" style={{color: h.accent}}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* İndirim bandı */}
        <div className="mt-8 p-6 rounded-2xl flex items-center gap-4" style={{background: PRI}}>
          <div>
            <p className="font-black text-xl" style={{color:"#fff"}}>3+ hizmet seçin — %20 indirim</p>
            <p className="text-sm mt-1" style={{color:`rgba(191,165,184,0.75)`}}>Birden fazla hizmet alırsanız otomatik indirim uygulanır.</p>
          </div>
          <Link href="/siparis"
            className="ml-auto shrink-0 px-6 py-3 font-bold text-sm rounded-full hover:opacity-90 transition-all whitespace-nowrap"
            style={{background: STN, color: DRK}}>
            Sipariş Ver →
          </Link>
        </div>
      </div>
    </main>
  );
}
