
"use client";
import React from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import ScratchReveal from "@/components/ScratchReveal";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
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
  { slug: "temizlik-bakim", no: "01", ad: "Temizlik & Bakım", aciklama: "Buhar temizlik, derin cila, bağcık değişimi dahil.", fiyat: "₺800+", sure: "1-2 gün", renk: "#FF6B35", detaylar: ["Buhar ile derin temizlik", "Profesyonel cila ve parlatma", "Bağcık değişimi", "Koku giderme"] },
  { slug: "boya-restorasyon", no: "02", ad: "Boya & Restorasyon", aciklama: "Profesyonel boya ve renk yenileme. Yıpranmışı sıfırlar.", fiyat: "₺1.200+", sure: "2-3 gün", renk: "#FF6B35", detaylar: ["Orijinal renk eşleştirme", "Deri yüzey onarımı", "Profesyonel boya uygulaması", "Koruyucu vernik"] },
  { slug: "taban-degisimi", no: "03", ad: "Taban Değişimi", aciklama: "Dış taban komple değişimi. Her tür ayakkabı.", fiyat: "₺600+", sure: "2-3 gün", renk: "#FF6B35", detaylar: ["Dış taban komple değişimi", "İç taban yenileme", "Topuk tamiri", "Her marka ve model"] },
  { slug: "dikis-onarim", no: "04", ad: "Dikiş & Onarım", aciklama: "Yırtık dikişler, çoraplık ve fort tamiri.", fiyat: "₺250+", sure: "1-2 gün", renk: "#FF6B35", detaylar: ["Yırtık dikiş tamiri", "Çoraplık yenileme", "Fort ve çeki tamiri", "Fermuar değişimi"] },
];

const YORUMLAR = [
  { ad: "A. Koç", ilce: "Kadıköy", yorum: "Nike\'larımı mahvetmiştim sandım. Tertemiz geldi. İnanılmaz iş." },
  { ad: "S. Tekin", ilce: "Ataşehir", yorum: "Kurye kapıya geldi, 2 gün sonra teslim. Fiyat-performans mükemmel." },
  { ad: "M. Doğan", ilce: "Üsküdar", yorum: "Beyaz sneaker\'lar sararmıştı. Bembeyaz döndüler." },
  { ad: "E. Yılmaz", ilce: "Maltepe", yorum: "3 hizmet seçtim, %20 indirim geldi. Mantıklı sistem." },
];


function BolgeKontrol() {
  const ILCELER = [
    { id: "kadikoy", label: "Kadıköy", aktif: true },
    { id: "atasehir", label: "Ataşehir", aktif: true },
    { id: "uskudar", label: "Üsküdar", aktif: true },
    { id: "maltepe", label: "Maltepe", aktif: true },
    { id: "kartal", label: "Kartal", aktif: true },
    { id: "pendik", label: "Pendik", aktif: true },
    { id: "umraniye", label: "Ümraniye", aktif: true },
    { id: "cekmekoy", label: "Çekmeköy", aktif: true },
    { id: "tuzla", label: "Tuzla", aktif: true },
    { id: "beykoz", label: "Beykoz", aktif: true },
    { id: "sancaktepe", label: "Sancaktepe", aktif: true },
    { id: "sultanbeyli", label: "Sultanbeyli", aktif: false },
    { id: "sile", label: "Şile", aktif: false },
    { id: "adalar", label: "Adalar", aktif: false },
  ];

  const [secili, setSecili] = React.useState<string | null>(null);
  const seciliIlce = ILCELER.find(i => i.id === secili);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-8">
        {ILCELER.map(ilce => (
          <button
            key={ilce.id}
            onClick={() => setSecili(ilce.id)}
            className="px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200"
            style={
              secili === ilce.id
                ? { background: ilce.aktif ? "#FF6B35" : "#666", borderColor: ilce.aktif ? "#FF6B35" : "#666", color: "#fff" }
                : { borderColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.5)", background: "#fff" }
            }
          >
            {ilce.label}
          </button>
        ))}
      </div>

      {!secili && (
        <div className="p-6 rounded-2xl bg-black/[0.02] border border-black/8 text-center">
          <p className="text-sm text-black/35">İlçenizi seçin, hizmet verip vermediğimizi öğrenin</p>
        </div>
      )}

      {secili && seciliIlce?.aktif && (
        <div className="p-6 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderColor: "#FF6B35", background: "rgba(255,107,53,0.04)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <p className="font-bold text-base">{seciliIlce.label}&apos;e hizmet veriyoruz!</p>
            </div>
            <p className="text-sm text-black/45">Kapınızdan alıp 2 gün içinde teslim ediyoruz.</p>
          </div>
          <Link href="/siparis" className="shrink-0 px-7 py-3.5 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{ background: "#FF6B35" }}>
            Sipariş Ver →
          </Link>
        </div>
      )}

      {secili && !seciliIlce?.aktif && (
        <div className="p-6 rounded-2xl border-2 border-black/10 bg-black/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <p className="font-bold text-base">{seciliIlce?.label} yakında ekleniyor</p>
            </div>
            <p className="text-sm text-black/45">Şu an bu bölgede hizmet vermiyoruz ama WhatsApp&apos;tan yazabilirsiniz.</p>
          </div>
          <a href="https://wa.me/905319623790" target="_blank" rel="noopener noreferrer" className="shrink-0 px-7 py-3.5 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all whitespace-nowrap bg-black">
            WhatsApp&apos;tan Sor →
          </a>
        </div>
      )}
    </div>
  );
}

function FiyatHesapla() {
  const FIYATLAR: Record<string, Record<string, number>> = {
    "Temizlik & Bakım": { sneaker: 800, deri: 900, suet: 1000, spor: 750, klasik: 900 },
    "Boya & Restorasyon": { sneaker: 1200, deri: 1400, suet: 1500, spor: 1100, klasik: 1300 },
    "Taban Değişimi": { sneaker: 600, deri: 700, suet: 700, spor: 600, klasik: 700 },
    "Dikiş & Onarım": { sneaker: 250, deri: 300, suet: 300, spor: 250, klasik: 300 },
  };
  const AYAKKABI_TIPLERI = [
    { id: "sneaker", label: "Sneaker" },
    { id: "deri", label: "Deri Bot" },
    { id: "suet", label: "Süet" },
    { id: "spor", label: "Spor" },
    { id: "klasik", label: "Klasik" },
  ];
  const [tip, setTip] = React.useState("sneaker");
  const [secili, setSecili] = React.useState<string[]>([]);

  const toggle = (h: string) => setSecili(prev =>
    prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
  );

  const toplam = secili.reduce((sum, h) => sum + (FIYATLAR[h]?.[tip] ?? 0), 0);
  const indirimli = secili.length >= 3 ? Math.round(toplam * 0.8) : toplam;
  const indirimVar = secili.length >= 3;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Ayakkabı tipi */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-black/30 mb-3">Ayakkabı türü</p>
        <div className="flex flex-wrap gap-2">
          {AYAKKABI_TIPLERI.map(t => (
            <button key={t.id} onClick={() => setTip(t.id)}
              className="px-4 py-2 text-sm font-medium rounded-full border transition-all"
              style={tip === t.id
                ? { background: "#FF6B35", borderColor: "#FF6B35", color: "#fff" }
                : { borderColor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.5)" }
              }>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hizmetler */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-black/30 mb-3">Hizmet seçin</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(FIYATLAR).map(([hizmet, fiyatlar]) => (
            <button key={hizmet} onClick={() => toggle(hizmet)}
              className="flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all"
              style={secili.includes(hizmet)
                ? { borderColor: "#FF6B35", background: "rgba(255,107,53,0.05)" }
                : { borderColor: "rgba(0,0,0,0.08)", background: "#fff" }
              }>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={secili.includes(hizmet)
                    ? { borderColor: "#FF6B35", background: "#FF6B35" }
                    : { borderColor: "rgba(0,0,0,0.2)" }
                  }>
                  {secili.includes(hizmet) && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-medium">{hizmet}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: secili.includes(hizmet) ? "#FF6B35" : "rgba(0,0,0,0.4)" }}>
                ₺{fiyatlar[tip as keyof typeof fiyatlar].toLocaleString()}+
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sonuç */}
      <div className="p-6 rounded-2xl border-2 transition-all" style={{ borderColor: secili.length > 0 ? "#FF6B35" : "rgba(0,0,0,0.08)", background: secili.length > 0 ? "rgba(255,107,53,0.04)" : "#f9f9f9" }}>
        {secili.length === 0 ? (
          <p className="text-sm text-black/30 text-center py-2">Hizmet seçerek fiyat görün</p>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-black/40 uppercase tracking-widest mb-1">Tahmini tutar</p>
              <div className="flex items-baseline gap-3">
                {indirimVar && <span className="text-lg text-black/30 line-through">₺{toplam.toLocaleString()}</span>}
                <span className="text-3xl font-black" style={{ color: "#FF6B35" }}>₺{indirimli.toLocaleString()}+</span>
              </div>
              {indirimVar && <p className="text-xs mt-1" style={{ color: "#FF6B35" }}>🎉 3+ hizmet — %20 indirim uygulandı!</p>}
              {!indirimVar && secili.length > 0 && <p className="text-xs text-black/30 mt-1">3+ hizmet seçin, %20 indirim kazanın</p>}
            </div>
            <Link href="/siparis" className="px-7 py-3.5 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{ background: "#FF6B35" }}>
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
  if(items.length===0) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["Beyaz Sneaker","Deri Bot","Spor Ayakkabı"].map((label)=>(
        <div key={label} className="border border-black/8 rounded-2xl overflow-hidden">
          <div className="h-56 bg-black/[0.03] flex flex-col items-center justify-center gap-2">
            <p className="text-4xl grayscale opacity-20">👟</p>
            <p className="text-[10px] uppercase tracking-widest text-black/20">Yakında</p>
          </div>
          <div className="p-5"><p className="text-sm font-semibold">{label}</p><p className="text-[11px] text-black/35 mt-1 uppercase tracking-wider">Lostra & Bakım</p></div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item)=>(
        <div key={item.id} className="border border-black/8 rounded-2xl overflow-hidden cursor-pointer hover:border-black/20 hover:shadow-md transition-all" onMouseEnter={()=>setHover(item.id)} onMouseLeave={()=>setHover(null)}>
          <div className="relative h-56 overflow-hidden">
            {item.before_url&&<img src={item.before_url} alt="önce" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover===item.id?"opacity-0":"opacity-100"}`}/>}
            {item.after_url&&<img src={item.after_url} alt="sonra" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hover===item.id?"opacity-100":"opacity-0"}`}/>}
            {!item.before_url&&!item.after_url&&<div className="w-full h-full flex items-center justify-center bg-black/[0.03]"><p className="text-4xl grayscale opacity-20">👟</p></div>}
            <span className={`absolute top-3 left-3 text-[9px] font-medium px-2 py-1 rounded-full transition-all duration-300 ${hover===item.id?"text-white":"bg-black/50 text-white/70"}`} style={hover===item.id?{background:"#FF6B35"}:{}}>{hover===item.id?"Sonra":"Önce"}</span>
          </div>
          <div className="p-5"><p className="text-sm font-semibold">{item.title}</p><p className="text-[11px] text-black/35 mt-1 uppercase tracking-wider">{item.service}</p></div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { setTimeout(() => setHeroVisible(true), 50); }, []);

  return (
    <ScratchReveal>
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Nav active="/" />

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 pb-8 relative overflow-hidden" style={{background:"linear-gradient(135deg, #fff 60%, #fff5f0 100%)"}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.07] rounded-full" style={{background:"radial-gradient(circle, #FF6B35 0%, transparent 70%)", transform:"translate(30%, -30%)"}} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.04] rounded-full" style={{background:"radial-gradient(circle, #FF6B35 0%, transparent 70%)", transform:"translate(-30%, 30%)"}} />
        </div>

        <div className="max-w-5xl relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-black/8 bg-black/[0.02]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-black/45">Kapıdan Kapıya · Anadolu Yakası</span>
            </div>
          </Reveal>

          <div className={`transition-all duration-600 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="font-black leading-[0.88] tracking-tight mb-8" style={{fontSize:"clamp(2.8rem, 8vw, 7.5rem)"}}>
              Ayakkabının özlediği bakım<br />
              <span style={{color:"#FF6B35"}}>Kapıda.</span>
            </h1>
          </div>

          <Reveal delay={150}>
            <p className="text-base md:text-lg text-black/45 max-w-xl leading-relaxed mb-10">
              Kapınızdan alıyoruz, profesyonel bakımdan geçirip <strong className="text-black/70 font-semibold">tertemiz teslim ediyoruz</strong>. Siz hiçbir yere gitmeyin.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="/siparis" className="group inline-flex items-center gap-3 text-white px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all" style={{background:"#FF6B35", boxShadow:"0 8px 32px rgba(255,107,53,0.35)"}}>
                Ücretsiz Fiyat Al
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-sm font-medium px-6 py-4 rounded-full border border-black/10 text-black/50 hover:border-black/25 hover:text-black transition-all">
                <span className="text-base">💬</span> WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="flex flex-wrap gap-10 md:gap-16 pt-8 border-t-2 border-black/10">
              {[
                { val: 150, suffix: "+", label: "Mutlu müşteri" },
                { val: 2, suffix: " gün", label: "Ort. teslim" },
                { val: 100, suffix: "%", label: "Memnuniyet" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-black tabular-nums" style={{color:"#111"}}>
                    <Counter target={s.val} suffix={s.suffix} />
                  </p>
                  <p className="text-[11px] text-black/30 mt-1 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      {/* ── MARQUEE ── */}{/* ── MARQUEE ── */}
      <div className="overflow-hidden py-4 bg-black">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, x) => (
            ["Temizlik","Bakım","Boya","Onarım","Restorasyon","Taban Değişimi","Kadıköy","Ataşehir","Üsküdar","Maltepe","Kartal"].map((item, i) => (
              <span key={`${x}-${i}`} className="text-[11px] uppercase tracking-[0.3em] text-white/60 mx-8 font-medium">
                {item} <span className="text-white/15 mx-3">·</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── HİZMETLER ── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6 border-b-2 border-black/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-2">Hizmetler</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Ne <span style={{color:"#FF6B35"}}>yapıyoruz?</span></h2>
            </div>
            <Link href="/hizmetler" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-black/30 hover:text-black transition-colors">
              Tümünü gör →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HIZMETLER.map((h, i) => (
            <Reveal key={h.no} delay={i * 40}>
              <Link href={`/hizmetler/${h.slug}`} className="group block">
                <div className="border border-black/10 rounded-2xl overflow-hidden hover:border-black/25 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="h-1 w-full" style={{background: h.renk}} />
                  <div className="p-7">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-black/20 tracking-widest">{h.no}</span>
                        <h3 className="text-lg font-bold mt-0.5">{h.ad}</h3>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-lg font-black" style={{color: h.renk}}>{h.fiyat}</p>
                        <p className="text-[10px] text-black/30">{h.sure}</p>
                      </div>
                    </div>
                    <p className="text-sm text-black/45 mb-4 leading-relaxed">{h.aciklama}</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {h.detaylar.map(d => (
                        <div key={d} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full shrink-0" style={{background: h.renk}} />
                          <span className="text-xs text-black/50">{d}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-black/6">
                      <span className="text-[11px] text-black/30 uppercase tracking-wider">Detay ve fiyat</span>
                      <span className="text-sm group-hover:translate-x-1 transition-transform" style={{color: h.renk}}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <div className="mt-5 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 border-2" style={{borderColor:"#FF6B35", background:"rgba(255,107,53,0.04)"}}>
            <div className="flex-1">
              <p className="font-black text-base">3+ hizmet seçin — <span style={{color:"#FF6B35"}}>%20 indirim otomatik</span></p>
              <p className="text-black/40 text-xs mt-0.5">Birden fazla hizmet alırsanız indirim uygulanır.</p>
            </div>
            <Link href="/siparis" className="shrink-0 px-5 py-2.5 text-white font-bold text-xs rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{background:"#FF6B35"}}>
              Sipariş Ver →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── NASIL ÇALIŞIR ── */}
      <section className="px-6 md:px-12 py-20" style={{background:"#1A1A1A", color:"white"}}>
        <Reveal>
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-2">Süreç</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">3 adım, <span style={{color:"#FF6B35"}}>o kadar.</span></h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12">
          {[
            { n:"01", icon:"📱", t:"Fotoğraf Gönder", a:"WhatsApp üzerinden ayakkabı fotoğrafınızı gönderin, hızlıca fiyat verelim.", href:`https://wa.me/${WHATSAPP}`, cta:"Fiyat Al", ext:true },
            { n:"02", icon:"🚗", t:"Kapıdan Teslim", a:"Anlaştığımız gün kuryemiz gelir. Siz hiçbir yere gitmeyin.", href:"/siparis", cta:"Sipariş Ver", ext:false },
            { n:"03", icon:"✨", t:"Tertemiz Teslim", a:"2 gün içinde özenle paketlenmiş, tertemiz kapınıza.", href:"/siparis-takip", cta:"Takip Et", ext:false },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="p-8 border-b md:border-b-0 md:border-r border-white/8 last:border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{background:"#FF6B35"}}>{s.n}</div>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">{s.a}</p>
                {s.ext ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity" style={{color:"#FF6B35"}}>{s.cta} →</a>
                ) : (
                  <Link href={s.href} className="text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity" style={{color:"#FF6B35"}}>{s.cta} →</Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={240}>
          <div className="p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.2)"}}>
            <div>
              <p className="text-white/40 text-xs">Hızlı başlamak ister misiniz?</p>
              <p className="font-bold text-lg mt-0.5">WhatsApp&apos;tan fotoğraf gönderin, fiyat verelim.</p>
            </div>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all whitespace-nowrap" style={{background:"#FF6B35"}}>
              💬 WhatsApp&apos;ta Başla →
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── BÖLGE ── */}
      <section className="px-6 md:px-12 py-20 font-sans">
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6 border-b border-black/8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-2">Hizmet bölgesi</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Bölgenize <span style={{color:"#FF6B35"}}>geliyoruz.</span></h2>
              <p className="text-sm text-black/40 mt-2">Anadolu Yakası'nın tüm ilçelerine kapıdan kapıya hizmet.</p>
            </div>
          </div>
        </Reveal>
        <BolgeKontrol />
      </section>
      {/* ── FİYAT HESAPLA ── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <Reveal>
          <div className="flex items-start justify-between mb-10 pb-6 border-b border-black/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-2">Anlık fiyat</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Ne kadar <span style={{color:"#FF6B35"}}>tutar?</span></h2>
              <p className="text-sm text-black/40 mt-3">Hizmet ve ayakkabı türünü seçin, anlık fiyat görün.</p>
            </div>
            <div className="hidden md:block shrink-0 ml-8 text-right">
              <p className="text-[10px] text-black/25 uppercase tracking-widest mb-1">3+ hizmet</p>
              <p className="text-2xl font-black" style={{color:"#FF6B35"}}>%20</p>
              <p className="text-[10px] text-black/25 uppercase tracking-widest">indirim</p>
            </div>
          </div>
        </Reveal>
        <FiyatHesapla />
      </section>
      {/* ── GALERİ ── */}
      <section className="px-6 md:px-12 py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-6 border-b border-black/8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-2">Sonuçlar</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Fark <span style={{color:"#FF6B35"}}>görünür.</span></h2>
            </div>
            <Link href="/galeri" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-black/30 hover:text-black transition-colors shrink-0">
              Tümünü gör →
            </Link>
          </div>
        </Reveal>
        <GaleriOnizleme />
        <div className="mt-5 flex justify-center md:hidden">
          <Link href="/galeri" className="text-xs uppercase tracking-widest text-black/30 hover:text-black transition-colors">Tümünü gör →</Link>
        </div>
      </section>

            {/* ── YORUMLAR ── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <Reveal>
          <div className="mb-12 pb-6 border-b border-black/8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/25 mb-2">Müşteriler</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Onlar <span style={{color:"#FF6B35"}}>anlatsın.</span></h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {YORUMLAR.map((y, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="relative p-8 rounded-2xl border border-black/8 hover:border-black/15 hover:shadow-sm transition-all duration-300" style={{background: i % 2 === 0 ? "#FAFAF9" : "#fff"}}>
                {/* Büyük tırnak */}
                <span className="absolute top-4 right-6 text-7xl font-black leading-none select-none" style={{color:"rgba(255,107,53,0.08)"}}>&rdquo;</span>
                {/* Yıldızlar */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#FF6B35"><path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/></svg>
                  ))}
                </div>
                {/* Yorum */}
                <p className="text-base md:text-lg font-medium leading-relaxed mb-6 text-black/80">
                  &ldquo;{y.yorum}&rdquo;
                </p>
                {/* Kişi */}
                <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{background:"#FF6B35"}}>
                    {y.ad.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black/80">{y.ad}</p>
                    <p className="text-xs text-black/35">{y.ilce}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      {/* ── SON CTA ── */}{/* ── SON CTA ── */}
      <section className="px-6 md:px-12 py-24 relative overflow-hidden" style={{background:"#F7F4EF"}}>
        <Reveal>
          <div className="max-w-3xl relative">
            <p className="text-[11px] uppercase tracking-[0.4em] text-black/30 mb-6">Hazır mısın?</p>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] mb-10 text-black">
              Ayakkabının özlediği bakım<br />
              <span style={{color:"#FF6B35"}}>Kapıda.</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/siparis" className="group inline-flex items-center gap-3 text-white px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all" style={{background:"#FF6B35"}}>
                Hemen Sipariş Ver
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border-2 border-black/15 px-8 py-4 text-sm font-medium rounded-full hover:border-black/40 transition-colors text-black/50 hover:text-black">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      {/* ── FOOTER ── */}{/* ── FOOTER ── */}
      <footer className="border-t border-black/8 px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo-clean.png" alt="Kapıda" style={{ height: "40px", width: "auto" }} />
          <span className="text-[9px] text-black/25 uppercase tracking-wider">· Lostra & Bakım · 2025</span>
        </div>
        <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-black/30">
          <Link href="/hizmetler" className="hover:text-black transition-colors">Hizmetler</Link>
          <Link href="/galeri" className="hover:text-black transition-colors">Galeri</Link>
          <Link href="/siparis-takip" className="hover:text-black transition-colors">Takip</Link>
          <Link href="/sss" className="hover:text-black transition-colors">SSS</Link>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="hover:text-black transition-colors">WhatsApp</a>
        </div>
      </footer>

      {/* Floating WA */}
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-transform shadow-xl" style={{background:"#FF6B35"}}>
        💬
      </a>
    </div>
    </ScratchReveal>
  );
}
