"use client";
import React from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import ScratchReveal from "@/components/ScratchReveal";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";
const WHATSAPP = "905319623790";

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const HIZMETLER = [
  { slug: "temizlik-bakim",  no: "01", ad: "Temizlik & Bakım",    aciklama: "Buhar temizlik, derin cila, bağcık değişimi dahil.", fiyat: "₺800+",   sure: "5-7 gün", accent: PRI, detaylar: ["Buhar ile derin temizlik", "Profesyonel cila ve parlatma", "Bağcık değişimi", "Koku giderme"] },
  { slug: "boya-restorasyon",no: "02", ad: "Boya & Restorasyon",  aciklama: "Profesyonel boya ve renk yenileme. Yıpranmışı sıfırlar.", fiyat: "₺1.200+",sure: "7-10 gün", accent: MUV, detaylar: ["Orijinal renk eşleştirme", "Deri yüzey onarımı", "Profesyonel boya uygulaması", "Koruyucu vernik"] },
  { slug: "taban-degisimi",  no: "03", ad: "Taban Değişimi",      aciklama: "Dış taban komple değişimi. Her tür ayakkabı.", fiyat: "₺600+",   sure: "7-10 gün", accent: PRI, detaylar: ["Dış taban komple değişimi", "İç taban yenileme", "Topuk tamiri", "Her marka ve model"] },
  { slug: "dikis-onarim",    no: "04", ad: "Dikiş & Onarım",      aciklama: "Yırtık dikişler, çoraplık ve fort tamiri.", fiyat: "₺250+",   sure: "5-7 gün", accent: MUV, detaylar: ["Yırtık dikiş tamiri", "Çoraplık yenileme", "Fort ve çeki tamiri", "Fermuar değişimi"] },
];

const YORUMLAR = [
  { ad: "A. Koç",    ilce: "Kadıköy",  yorum: "Nike'larımı mahvetmiştim sandım. Tertemiz geldi. İnanılmaz iş." },
  { ad: "S. Tekin",  ilce: "Ataşehir", yorum: "Kurye kapıya geldi, teslim aldı. Fiyat-performans mükemmel." },
  { ad: "M. Doğan",  ilce: "Üsküdar",  yorum: "Beyaz sneaker'lar sararmıştı. Bembeyaz döndüler." },
  { ad: "E. Yılmaz", ilce: "Maltepe",  yorum: "3 hizmet seçtim, %20 indirim geldi. Mantıklı sistem." },
];

const SUREC_IKONLARI = {
  kamera: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  kurye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
      <rect x="9" y="11" width="14" height="10" rx="2"/>
      <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
};

function BolgeKontrol() {
  const ILCELER = [
    { id: "kadikoy",    label: "Kadıköy",    aktif: true },
    { id: "atasehir",   label: "Ataşehir",   aktif: true },
    { id: "uskudar",    label: "Üsküdar",    aktif: true },
    { id: "maltepe",    label: "Maltepe",    aktif: true },
    { id: "kartal",     label: "Kartal",     aktif: true },
    { id: "pendik",     label: "Pendik",     aktif: true },
    { id: "umraniye",   label: "Ümraniye",   aktif: true },
    { id: "cekmekoy",   label: "Çekmeköy",   aktif: true },
    { id: "tuzla",      label: "Tuzla",      aktif: true },
    { id: "beykoz",     label: "Beykoz",     aktif: true },
    { id: "sancaktepe", label: "Sancaktepe", aktif: true },
    { id: "sultanbeyli",label: "Sultanbeyli",aktif: false },
    { id: "sile",       label: "Şile",       aktif: false },
    { id: "adalar",     label: "Adalar",     aktif: false },
  ];
  const [secili, setSecili] = React.useState<string | null>(null);
  const seciliIlce = ILCELER.find(i => i.id === secili);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-8">
        {ILCELER.map(ilce => (
          <button key={ilce.id} onClick={() => setSecili(ilce.id)}
            className="px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200"
            style={secili === ilce.id
              ? { background: PRI, borderColor: PRI, color: MUV }
              : { borderColor: STN, color: `rgba(45,26,46,0.55)`, background: "#fff" }}>
            {ilce.label}
          </button>
        ))}
      </div>
      {!secili && (
        <div className="p-6 rounded-2xl text-center" style={{background:`rgba(212,197,176,0.2)`, border:`1px solid ${STN}`}}>
          <p className="text-sm" style={{color:`rgba(45,26,46,0.4)`}}>İlçenizi seçin, hizmet verip vermediğimizi öğrenin</p>
        </div>
      )}
      {secili && seciliIlce?.aktif && (
        <div className="p-6 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{borderColor: PRI, background:`rgba(91,45,110,0.05)`}}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{background: PRI}} />
              <p className="font-bold text-base" style={{color: DRK}}>{seciliIlce.label}&apos;e hizmet veriyoruz!</p>
            </div>
            <p className="text-sm" style={{color:`rgba(45,26,46,0.5)`}}>Kapıdan kapıya, profesyonel bakım — kirli gönder, temiz gelsin.</p>
          </div>
          <Link href="/siparis"
            className="shrink-0 px-7 py-3.5 text-sm font-bold rounded-full hover:opacity-90 transition-all whitespace-nowrap"
            style={{background: PRI, color: MUV}}>
            Sipariş Ver →
          </Link>
        </div>
      )}
      {secili && !seciliIlce?.aktif && (
        <div className="p-6 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{borderColor: STN, background:`rgba(212,197,176,0.15)`}}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{background: MUV}} />
              <p className="font-bold text-base" style={{color: DRK}}>{seciliIlce?.label} yakında ekleniyor</p>
            </div>
            <p className="text-sm" style={{color:`rgba(45,26,46,0.5)`}}>Şu an bu bölgede hizmet vermiyoruz ama WhatsApp&apos;tan yazabilirsiniz.</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            className="shrink-0 px-7 py-3.5 text-sm font-bold rounded-full hover:opacity-90 transition-all whitespace-nowrap"
            style={{background: DRK, color: MUV}}>
            WhatsApp&apos;tan Sor →
          </a>
        </div>
      )}
    </div>
  );
}

function FiyatHesapla() {
  const FIYATLAR: Record<string, Record<string, number>> = {
    "Temizlik & Bakım":  { sneaker: 800,  deri: 900,  suet: 1000, spor: 750,  klasik: 900  },
    "Boya & Restorasyon":{ sneaker: 1200, deri: 1400, suet: 1500, spor: 1100, klasik: 1300 },
    "Taban Değişimi":    { sneaker: 600,  deri: 700,  suet: 700,  spor: 600,  klasik: 700  },
    "Dikiş & Onarım":   { sneaker: 250,  deri: 300,  suet: 300,  spor: 250,  klasik: 300  },
  };
  const TIPLER = [
    { id: "sneaker", label: "Sneaker" }, { id: "deri", label: "Deri Bot" },
    { id: "suet", label: "Süet" }, { id: "spor", label: "Spor" }, { id: "klasik", label: "Klasik" },
  ];
  const [tip, setTip] = React.useState("sneaker");
  const [secili, setSecili] = React.useState<string[]>([]);
  const toggle = (h: string) => setSecili(p => p.includes(h) ? p.filter(x => x !== h) : [...p, h]);
  const toplam = secili.reduce((s, h) => s + (FIYATLAR[h]?.[tip] ?? 0), 0);
  const indirimli = secili.length >= 3 ? Math.round(toplam * 0.8) : toplam;
  const indirimVar = secili.length >= 3;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-3" style={{color:`rgba(45,26,46,0.35)`}}>Ayakkabı türü</p>
        <div className="flex flex-wrap gap-2">
          {TIPLER.map(t => (
            <button key={t.id} onClick={() => setTip(t.id)}
              className="px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all"
              style={tip === t.id ? {background: PRI, borderColor: PRI, color: MUV} : {borderColor: STN, color:`rgba(45,26,46,0.5)`, background:"#fff"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-3" style={{color:`rgba(45,26,46,0.35)`}}>Hizmet seçin</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(FIYATLAR).map(([hizmet, fiyatlar], idx) => {
            const acc = idx % 2 === 0 ? PRI : MUV;
            const sel = secili.includes(hizmet);
            return (
              <button key={hizmet} onClick={() => toggle(hizmet)}
                className="flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all"
                style={sel ? {borderColor: acc, background:`rgba(${idx%2===0?"91,45,110":"191,165,184"},0.07)`} : {borderColor: STN, background:"#fff"}}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={sel ? {borderColor: acc, background: acc} : {borderColor: STN}}>
                    {sel && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm font-semibold" style={{color: DRK}}>{hizmet}</span>
                </div>
                <span className="text-sm font-bold" style={{color: sel ? acc : `rgba(45,26,46,0.4)`}}>
                  ₺{fiyatlar[tip as keyof typeof fiyatlar].toLocaleString()}+
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-6 rounded-2xl border-2 transition-all"
        style={{borderColor: secili.length > 0 ? PRI : STN, background: secili.length > 0 ? `rgba(91,45,110,0.05)` : `rgba(212,197,176,0.15)`}}>
        {secili.length === 0 ? (
          <p className="text-sm text-center py-2" style={{color:`rgba(45,26,46,0.35)`}}>Hizmet seçerek fiyat görün</p>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{color:`rgba(45,26,46,0.4)`}}>Tahmini tutar</p>
              <div className="flex items-baseline gap-3">
                {indirimVar && <span className="text-lg line-through" style={{color:`rgba(45,26,46,0.3)`}}>₺{toplam.toLocaleString()}</span>}
                <span className="text-3xl font-black" style={{color: PRI}}>₺{indirimli.toLocaleString()}+</span>
              </div>
              {indirimVar && <p className="text-xs mt-1 font-semibold" style={{color: PRI}}>3+ hizmet — %20 indirim uygulandı!</p>}
              {!indirimVar && secili.length > 0 && <p className="text-xs mt-1" style={{color:`rgba(45,26,46,0.35)`}}>3+ hizmet seçin, %20 indirim kazanın</p>}
            </div>
            <Link href="/siparis" className="px-7 py-3.5 text-sm font-bold rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{background: PRI, color: MUV}}>
              Sipariş Ver →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function GaleriOnizleme() {
  const [items, setItems] = React.useState<{id:string;title:string;service:string;before_url:string|null;after_url:string|null}[]>([]);
  const [hover, setHover] = React.useState<string|null>(null);
  React.useEffect(() => {
    import("@/lib/supabase").then(({supabase}) => {
      supabase.from("gallery").select("id,title,service,before_url,after_url").eq("active",true).limit(3).order("created_at",{ascending:false}).then(({data}) => setItems(data??[]));
    });
  },[]);
  const placeholder = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["Beyaz Sneaker","Deri Bot","Spor Ayakkabı"].map(label => (
        <div key={label} className="rounded-2xl overflow-hidden" style={{border:`1px solid ${STN}`}}>
          <div className="h-56 flex flex-col items-center justify-center gap-2" style={{background:`rgba(212,197,176,0.15)`}}>
            <p className="text-[10px] uppercase tracking-widest" style={{color:`rgba(45,26,46,0.25)`}}>Yakında</p>
          </div>
          <div className="p-5" style={{background:"#fff"}}>
            <p className="text-sm font-semibold" style={{color:DRK}}>{label}</p>
            <p className="text-[11px] mt-1 uppercase tracking-wider" style={{color:`rgba(45,26,46,0.35)`}}>Lostra & Bakım</p>
          </div>
        </div>
      ))}
    </div>
  );
  if (items.length === 0) return placeholder;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
          style={{border:`1px solid ${STN}`}}
          onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}>
          <div className="relative h-56 overflow-hidden">
            {item.before_url && <img src={item.before_url} alt="önce" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover===item.id?"opacity-0":"opacity-100"}`}/>}
            {item.after_url && <img src={item.after_url} alt="sonra" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover===item.id?"opacity-100":"opacity-0"}`}/>}
            {!item.before_url&&!item.after_url && <div className="w-full h-full flex items-center justify-center" style={{background:`rgba(212,197,176,0.2)`}} />}
            <span className="absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-full transition-all duration-300"
              style={hover===item.id ? {background: PRI, color: MUV} : {background:`rgba(45,26,46,0.55)`, color:"rgba(212,197,176,0.9)"}}>
              {hover===item.id ? "Sonra" : "Önce"}
            </span>
          </div>
          <div className="p-5" style={{background:"#fff"}}>
            <p className="text-sm font-semibold" style={{color:DRK}}>{item.title}</p>
            <p className="text-[11px] mt-1 uppercase tracking-wider" style={{color:`rgba(45,26,46,0.35)`}}>{item.service}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [heroGallery, setHeroGallery] = useState<{ before_url: string | null; after_url: string | null } | null>(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 50); }, []);

  useEffect(() => {
    const fetchHeroGallery = async () => {
      const { data } = await supabase
        .from("gallery")
        .select("before_url,after_url")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setHeroGallery(data);
    };
    fetchHeroGallery();
  }, []);

  return (
    <ScratchReveal>
    <div className="min-h-screen overflow-x-hidden" style={{background: BG, color: DRK}}>
      <Nav active="/" />

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center px-6 md:px-12 pt-24 pb-10 relative overflow-hidden" style={{background: BG}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.06] rounded-full"
            style={{ background: `radial-gradient(circle, ${PRI} 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.04] rounded-full"
            style={{ background: `radial-gradient(circle, ${MUV} 0%, transparent 70%)`, transform: "translate(-30%,30%)" }} />
        </div>

        <div className="max-w-7xl mx-auto w-full relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border"
                style={{ borderColor: STN, background: `rgba(212,197,176,0.2)` }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PRI }} />
                <span className="text-[11px] uppercase tracking-[0.25em]" style={{ color: `rgba(45,26,46,0.55)` }}>
                  Anadolu Yakası · Kapıdan Kapıya
                </span>
              </div>
            </Reveal>

            <div className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h1 className="font-black tracking-tight mb-6 leading-[0.9]"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: DRK }}>
                <span style={{ display: "block" }}>Kirli gönder,</span>
                <span style={{ display: "block", color: PRI }}>temiz gelsin.</span>
              </h1>
            </div>

            <Reveal delay={120}>
              <p className="text-base md:text-lg max-w-2xl leading-relaxed mb-8" style={{ color: `rgba(45,26,46,0.58)` }}>
                Sneaker, deri, süet ya da klasik fark etmez. Ayakkabını kapından alıyor,
                profesyonel bakımını yapıyor ve sana geri teslim ediyoruz.
                <span style={{display:'block',marginTop:'14px',fontWeight:700}}>Her çift, detaylı bakım sürecinden geçer.</span>
                <span style={{display:'block',marginTop:'8px',opacity:0.72}}>Derin temizlik · renk canlandırma · güvenli paketleme</span>
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all"
                  style={{ background: PRI, color: "#fff", boxShadow: `0 8px 32px rgba(91,45,110,0.3)` }}>
                  Fotoğraf Gönder · Fiyat Al
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <Link href="/siparis"
                  className="inline-flex items-center gap-2.5 text-sm font-medium px-6 py-4 rounded-full border-2 transition-all hover:opacity-80"
                  style={{ borderColor: STN, color: `rgba(45,26,46,0.72)` }}>
                  Sipariş Oluştur
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap gap-10 md:gap-16 pt-8" style={{ borderTop: `1px solid ${STN}` }}>
                {[
                  { val: 150, suffix: "+", label: "Mutlu müşteri" },
                  { val: 7,   suffix: " gün", label: "Ort. teslim" },
                  { val: 100, suffix: "%", label: "Memnuniyet" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl md:text-4xl font-black tabular-nums" style={{ color: PRI }}>
                      <Counter target={s.val} suffix={s.suffix} />
                    </p>
                    <p className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: `rgba(45,26,46,0.35)` }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="lg:pl-6">
            <div className="relative">
              <div className="rounded-[32px] p-4 md:p-5 border shadow-[0_20px_60px_rgba(45,26,46,0.10)]"
                style={{ background: "#fff", borderColor: STN }}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] overflow-hidden border" style={{ borderColor: STN }}>
                    <div className="h-[240px] md:h-[340px] w-full relative" style={{ background: `rgba(212,197,176,0.2)` }}>
                      {heroGallery?.before_url ? (
                        <img src={heroGallery.before_url} alt="Önce" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-medium" style={{ color: `rgba(45,26,46,0.35)` }}>
                          Önce görseli
                        </div>
                      )}
                      <div className="absolute left-0 top-0 right-0 flex items-center justify-between px-5 py-4"
                        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0) 100%)" }}>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: `rgba(45,26,46,0.72)`, color: "#fff" }}>Önce</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: `rgba(45,26,46,0.68)` }}>Orijinal Durum</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[24px] overflow-hidden border" style={{ borderColor: STN }}>
                    <div className="h-[240px] md:h-[340px] w-full relative" style={{ background: `rgba(91,45,110,0.08)` }}>
                      {heroGallery?.after_url ? (
                        <img src={heroGallery.after_url} alt="Sonra" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-medium" style={{ color: `rgba(45,26,46,0.35)` }}>
                          Sonra görseli
                        </div>
                      )}
                      <div className="absolute left-0 top-0 right-0 flex items-center justify-between px-5 py-4"
                        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 100%)" }}>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: PRI, color: "#fff" }}>Sonra</span>
                        <span className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: PRI }}>Temizgelsin Sonucu</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] p-5 border" style={{ borderColor: STN, background: `rgba(245,240,232,0.82)` }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: `rgba(45,26,46,0.35)` }}>Hızlı başlangıç</p>
                      <p className="text-lg font-black" style={{ color: DRK }}>Fotoğraf gönder, fiyatı anında öğren.</p>
                      <p className="text-sm mt-1" style={{ color: `rgba(45,26,46,0.5)` }}>Uygunsa siparişi oluştur, kuryeyi yönlendirelim.</p>
                    </div>
                    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                      style={{ background: PRI, color: "#fff" }}>
                      WhatsApp&apos;tan Başla
                    </a>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["Derin temizlik", "Yüzey bakımı", "Renk canlandırma"].map((item) => (
                      <div key={item} className="rounded-2xl px-3 py-3 text-center text-[11px] font-semibold"
                        style={{ background: "#fff", color: `rgba(45,26,46,0.66)`, border: `1px solid ${STN}` }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 md:left-auto md:-right-6 px-4 py-3 rounded-2xl border shadow-lg"
                style={{ background: "#fff", borderColor: STN }}>
                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: `rgba(45,26,46,0.35)` }}>Günlük avantaj</p>
                <p className="text-sm font-bold mt-1" style={{ color: DRK }}>3+ hizmette %20 indirim</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden py-3" style={{background: DRK}}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, x) => (
            ["Kirli Gönder, Temiz Gelsin","Kapıdan Kapıya","Ücretsiz Fiyat Al","Profesyonel Temizlik","Boya & Restorasyon","Taban Değişimi","Dikiş Tamiri","Memnuniyet Garantisi"].map((item, i) => (
              <span key={`${x}-${i}`} className="text-[11px] uppercase tracking-[0.3em] mx-8 font-semibold" style={{color: MUV}}>
                {item} <span className="mx-3" style={{color:`rgba(191,165,184,0.35)`}}>✦</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── HİZMETLER ── */}
      <section className="px-6 md:px-12 py-20" style={{background: BG}}>
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6" style={{borderBottom:`2px solid ${STN}`}}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color:`rgba(45,26,46,0.3)`}}>Hizmetler</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none" style={{color: DRK}}>
                Ne <span style={{color: PRI}}>yapıyoruz?</span>
              </h2>
            </div>
            <Link href="/hizmetler" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:opacity-80" style={{color: MUV}}>
              Tümünü gör →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HIZMETLER.map((h, i) => (
            <Reveal key={h.no} delay={i * 40}>
              <Link href={`/hizmetler/${h.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full" style={{border:`1px solid ${STN}`, background:"#fff"}}>
                  <div className="h-[3px] w-full" style={{background: h.accent}} />
                  <div className="p-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest" style={{color:`rgba(45,26,46,0.2)`}}>{h.no}</span>
                        <h3 className="text-lg font-bold mt-0.5" style={{color: DRK}}>{h.ad}</h3>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-lg font-black" style={{color: h.accent}}>{h.fiyat}</p>
                        <p className="text-[10px]" style={{color:`rgba(45,26,46,0.3)`}}>{h.sure}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4 leading-relaxed" style={{color:`rgba(45,26,46,0.5)`}}>{h.aciklama}</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {h.detaylar.map(d => (
                        <div key={d} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full shrink-0" style={{background: h.accent}} />
                          <span className="text-xs" style={{color:`rgba(45,26,46,0.5)`}}>{d}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{borderTop:`1px solid ${STN}`}}>
                      <span className="text-[11px] uppercase tracking-wider" style={{color:`rgba(45,26,46,0.3)`}}>Detay ve fiyat</span>
                      <span className="text-sm group-hover:translate-x-1 transition-transform" style={{color: h.accent}}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <div className="mt-5 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 border-2"
            style={{borderColor: PRI, background:`rgba(91,45,110,0.05)`}}>
            <div className="flex-1">
              <p className="font-black text-base" style={{color: DRK}}>
                Kirli ne varsa gönderin — <span style={{color: PRI}}>3+ hizmette %20 indirim</span>
              </p>
              <p className="text-xs mt-0.5" style={{color:`rgba(45,26,46,0.45)`}}>Temizlik, boya, taban — hepsini bir seferde halledelim.</p>
            </div>
            <Link href="/siparis" className="shrink-0 px-5 py-2.5 font-bold text-xs rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{background: PRI, color: MUV}}>
              Sipariş Ver →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── NASIL ÇALIŞIR ── */}
      <section className="px-6 md:px-12 py-20" style={{background: DRK}}>
        <Reveal>
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{color:`rgba(191,165,184,0.4)`}}>Süreç</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3" style={{color:"#fff"}}>
              Bu kadar <span style={{color: MUV}}>basit.</span>
            </h2>
            <p className="text-sm md:text-base max-w-lg" style={{color:`rgba(191,165,184,0.5)`}}>
              Kapından alıyor, bakımını yapıyor ve tertemiz getiriyoruz.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { n:"01", ikon: SUREC_IKONLARI.kamera, t:"Fotoğraf Gönder",  a:"WhatsApp'tan bir fotoğraf at. Anında fiyat verelim, karar senin.", href:`https://wa.me/${WHATSAPP}`, cta:"Fiyat Al", ext:true },
            { n:"02", ikon: SUREC_IKONLARI.kurye,  t:"Kapıda Teslim Et", a:"Kuryemiz kapında. Kirli olanı alır, gider. Sen hiçbir yere gitme.", href:"/siparis", cta:"Sipariş Ver", ext:false },
            { n:"03", ikon: SUREC_IKONLARI.sparkle,t:"Temiz Geri Al",    a:"İşlem tamamlandığında kapına teslim ediyoruz. Paketlenmiş, bakımlı, tertemiz.", href:"/siparis-takip", cta:"Takip Et", ext:false },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="p-7 rounded-2xl border h-full flex flex-col transition-all duration-300 cursor-default"
                style={{borderColor:`rgba(191,165,184,0.12)`, background:`rgba(255,255,255,0.03)`}}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(91,45,110,0.6)`;
                  (e.currentTarget as HTMLDivElement).style.background = `rgba(91,45,110,0.1)`;
                  (e.currentTarget as HTMLDivElement).style.transform = `translateY(-2px)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(191,165,184,0.12)`;
                  (e.currentTarget as HTMLDivElement).style.background = `rgba(255,255,255,0.03)`;
                  (e.currentTarget as HTMLDivElement).style.transform = `translateY(0)`;
                }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{background: PRI, color: MUV}}>{s.n}</div>
                  <div className="flex-1 h-px" style={{background:`rgba(191,165,184,0.08)`}} />
                </div>
                <div className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{background:`rgba(191,165,184,0.1)`, color: MUV}}>
                  <div style={{transform:"scale(1.4)"}}>{s.ikon}</div>
                </div>
                <h3 className="text-base font-bold mb-2.5" style={{color:"#fff"}}>{s.t}</h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{color:`rgba(191,165,184,0.75)`}}>{s.a}</p>
                {s.ext
                  ? <a href={s.href} target="_blank" rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-all"
                      style={{color: MUV}}>
                      {s.cta} <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                    </a>
                  : <Link href={s.href}
                      className="group/btn inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-all"
                      style={{color: MUV}}>
                      {s.cta} <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                    </Link>
                }
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{background:`rgba(91,45,110,0.2)`, border:`1.5px solid rgba(91,45,110,0.45)`}}>
            <div>
              <p className="font-bold text-base mb-1" style={{color:"#fff"}}>Hazırsan ilk fotoğrafı gönder.</p>
              <p className="text-sm" style={{color:`rgba(191,165,184,0.7)`}}>WhatsApp&apos;tan hızlıca fiyat verelim.</p>
            </div>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="group/btn shrink-0 inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-full hover:opacity-90 transition-all whitespace-nowrap"
              style={{background: PRI, color: MUV, boxShadow:`0 4px 20px rgba(91,45,110,0.4)`}}>
              WhatsApp&apos;ta Başla
              <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── BÖLGE ── */}
      <section className="px-6 md:px-12 py-20" style={{background: BG}}>
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6" style={{borderBottom:`1px solid ${STN}`}}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color:`rgba(45,26,46,0.3)`}}>Hizmet bölgesi</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none" style={{color: DRK}}>
                Mahallenize <span style={{color: PRI}}>geliyoruz.</span>
              </h2>
              <p className="text-sm mt-2" style={{color:`rgba(45,26,46,0.45)`}}>Kapıdan kapıya profesyonel bakım. Anadolu Yakası&apos;nın tüm ilçelerine.</p>
            </div>
          </div>
        </Reveal>
        <BolgeKontrol />
      </section>

      {/* ── FİYAT HESAPLA ── */}
      <section className="px-6 md:px-12 py-20" style={{background:`rgba(191,165,184,0.1)`}}>
        <Reveal>
          <div className="flex items-start justify-between mb-10 pb-6" style={{borderBottom:`1px solid ${STN}`}}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color:`rgba(45,26,46,0.3)`}}>Anlık fiyat</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none" style={{color: DRK}}>
                Ne kadar <span style={{color: PRI}}>tutar?</span>
              </h2>
              <p className="text-sm mt-3" style={{color:`rgba(45,26,46,0.45)`}}>Hizmet ve ayakkabı türünü seçin, anlık fiyat görün.</p>
            </div>
            <div className="hidden md:block shrink-0 ml-8 text-right">
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{color:`rgba(45,26,46,0.3)`}}>3+ hizmet</p>
              <p className="text-2xl font-black" style={{color: PRI}}>%20</p>
              <p className="text-[10px] uppercase tracking-widest" style={{color:`rgba(45,26,46,0.3)`}}>indirim</p>
            </div>
          </div>
        </Reveal>
        <FiyatHesapla />
      </section>

      {/* ── GALERİ ── */}
      <section className="px-6 md:px-12 py-20" style={{background: BG}}>
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6" style={{borderBottom:`1px solid ${STN}`}}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color:`rgba(45,26,46,0.3)`}}>Sonuçlar</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{color: DRK}}>
                Fark <span style={{color: PRI}}>gözle görülür.</span>
              </h2>
            </div>
            <Link href="/galeri" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:opacity-80 shrink-0" style={{color: MUV}}>
              Tümünü gör →
            </Link>
          </div>
        </Reveal>
        <GaleriOnizleme />
        <div className="mt-5 flex justify-center md:hidden">
          <Link href="/galeri" className="text-xs uppercase tracking-widest hover:opacity-70 transition-colors" style={{color: MUV}}>Tümünü gör →</Link>
        </div>
      </section>

      {/* ── YORUMLAR ── */}
      <section className="px-6 md:px-12 py-20" style={{background:`rgba(212,197,176,0.15)`}}>
        <Reveal>
          <div className="mb-12 pb-6" style={{borderBottom:`1px solid ${STN}`}}>
            <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{color:`rgba(45,26,46,0.3)`}}>Müşteriler</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none" style={{color: DRK}}>
              Müşteriler <span style={{color: PRI}}>konuşuyor.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {YORUMLAR.map((y, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="relative p-8 rounded-2xl hover:shadow-sm transition-all duration-300"
                style={{background: i % 2 === 0 ? `rgba(212,197,176,0.2)` : "#fff", border:`1px solid ${STN}`}}>
                <span className="absolute top-4 right-6 text-7xl font-black leading-none select-none" style={{color:`rgba(191,165,184,0.2)`}}>&rdquo;</span>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill={PRI}><path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/></svg>
                  ))}
                </div>
                <p className="text-base md:text-lg font-medium leading-relaxed mb-6" style={{color:`rgba(45,26,46,0.8)`}}>&ldquo;{y.yorum}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4" style={{borderTop:`1px solid ${STN}`}}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{background: PRI, color: MUV}}>
                    {y.ad.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{color: DRK}}>{y.ad}</p>
                    <p className="text-xs" style={{color:`rgba(45,26,46,0.4)`}}>{y.ilce}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SON CTA ── */}
      <section className="px-6 md:px-12 py-24 relative overflow-hidden" style={{background: DRK}}>
        <Reveal>
          <div className="max-w-3xl relative">
            <p className="text-[11px] uppercase tracking-[0.4em] mb-6" style={{color:`rgba(191,165,184,0.4)`}}>Ne bekliyorsun?</p>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] mb-10" style={{color:"#fff"}}>
              Kirli gönder,<br />
              <span style={{color: MUV}}>temiz gelsin.</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/siparis"
                className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all"
                style={{background: PRI, color: MUV}}>
                Hemen Sipariş Ver
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-medium rounded-full border-2 transition-colors hover:opacity-80"
                style={{borderColor:`rgba(191,165,184,0.3)`, color:`rgba(191,165,184,0.7)`}}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        style={{background:`rgba(45,26,46,0.95)`, borderTop:`1px solid rgba(191,165,184,0.15)`}}>
        <div className="flex items-center gap-3">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin"
            style={{height:"40px", width:"auto", filter:"brightness(0) invert(1)", opacity:0.85}} />
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{color:`rgba(191,165,184,0.4)`}}>Temiz Gelsin · 2025</span>
        </div>
        <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-widest" style={{color:`rgba(191,165,184,0.5)`}}>
          <Link href="/hizmetler" className="hover:opacity-80 transition-opacity">Hizmetler</Link>
          <Link href="/galeri" className="hover:opacity-80 transition-opacity">Galeri</Link>
          <Link href="/siparis-takip" className="hover:opacity-80 transition-opacity">Takip</Link>
          <Link href="/sss" className="hover:opacity-80 transition-opacity">SSS</Link>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="hover:opacity-80 transition-opacity">WhatsApp</a>
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full font-bold hover:scale-110 active:scale-95 transition-transform shadow-xl"
        style={{background: PRI, color: MUV}}>
        💬
      </a>
    </div>
    </ScratchReveal>
  );
}
