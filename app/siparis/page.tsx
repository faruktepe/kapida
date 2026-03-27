"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// PANTONE 262C #5B2D6E | PANTONE 5155C #BFA5B8 | PANTONE 7527C #D4C5B0
const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

const MARKA_MODELLER: Record<string, string[]> = {
  "Nike":        ["Air Force 1","Air Max 90","Air Max 95","Air Max 97","Air Jordan 1","Air Jordan 4","Air Jordan 11","Dunk Low","Dunk High","React","Pegasus","Blazer","Cortez","Diğer"],
  "Adidas":      ["Stan Smith","Superstar","Gazelle","Samba","NMD R1","Ultraboost","Yeezy 350","Yeezy 500","Forum Low","Campus","Handball Spezial","Diğer"],
  "New Balance": ["574","990","992","993","2002R","550","327","Diğer"],
  "Puma":        ["Suede","RS-X","Clyde","Future Rider","Mayze","Diğer"],
  "Vans":        ["Old Skool","Sk8-Hi","Authentic","Era","Slip-On","Diğer"],
  "Converse":    ["Chuck Taylor All Star","Chuck 70","Run Star Hike","One Star","Diğer"],
  "Reebok":      ["Classic Leather","Club C","Freestyle","Instapump","Diğer"],
  "Timberland":  ["6-Inch Boot","Euro Hiker","Diğer"],
  "Dr. Martens": ["1460","1461","Jadon","Diğer"],
  "Jordan":      ["Air Jordan 1","Air Jordan 3","Air Jordan 4","Air Jordan 6","Air Jordan 11","Diğer"],
  "Asics":       ["Gel-Kayano","Gel-Nimbus","GT-2000","Diğer"],
  "Salomon":     ["XT-6","Speedcross","Diğer"],
  "Diğer":       [],
};

const MARKALAR = Object.keys(MARKA_MODELLER);
const RENKLER  = ["Siyah","Beyaz","Kahverengi","Lacivert","Gri","Kırmızı","Mavi","Yeşil","Sarı","Pembe","Bej","Diğer"];
const TURLER   = ["Sneaker","Klasik Ayakkabı","Bot","Çizme","Spor Ayakkabı","Süet Ayakkabı","Topuklu Ayakkabı","Sandalet","Diğer"];
const ILCELER  = ["Ataşehir","Beykoz","Çekmeköy","Kadıköy","Kartal","Maltepe","Pendik","Sancaktepe","Sultanbeyli","Tuzla","Ümraniye","Üsküdar"];

const HIZMETLER = [
  { id:"bakim",      label:"Temizlik & Bakım",   desc:"Buhar temizlik, cila, bağcık değişimi",   fiyat:800,  icon:"✦", accent: PRI },
  { id:"boya",       label:"Boya & Restorasyon", desc:"Profesyonel boya ve renk yenileme",       fiyat:1200, icon:"◈", accent: MUV },
  { id:"taban",      label:"Taban Değişimi",      desc:"Dış taban komple değişimi",              fiyat:600,  icon:"◎", accent: PRI },
  { id:"dikiş",      label:"Dikiş Tamiri",        desc:"Yırtık ve sökük dikişlerin tamiri",      fiyat:400,  icon:"◇", accent: MUV },
  { id:"ic_taban",   label:"İç Taban Değişimi",   desc:"İç taban komple değişimi",               fiyat:400,  icon:"▽", accent: PRI },
  { id:"coraplık",   label:"Çoraplık Tamiri",     desc:"Arka iç kısım onarımı",                  fiyat:350,  icon:"○", accent: MUV },
  { id:"fort",       label:"Fort Tamiri",          desc:"Arka dik kısım tamiri",                  fiyat:300,  icon:"△", accent: PRI },
  { id:"yapıştırma", label:"Yapıştırma",           desc:"Taban yapıştırma ve sökük onarımı",     fiyat:250,  icon:"□", accent: MUV },
];

// Renk swatchları için renkler
const RENK_RENKLER: Record<string, string> = {
  "Siyah":"#1a1a1a","Beyaz":"#f5f5f5","Kahverengi":"#7B4F2E","Lacivert":"#1B2A5E",
  "Gri":"#888888","Kırmızı":"#C0392B","Mavi":"#2471A3","Yeşil":"#1E8449",
  "Sarı":"#D4AC0D","Pembe":"#D98880","Bej":"#C9A87C","Diğer":"linear-gradient(135deg,#5B2D6E,#BFA5B8,#D4C5B0)",
};

function generateOrderNumber() {
  return "KPD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

const btnPri = { background: PRI, color: MUV } as React.CSSProperties;
const btnSel = { borderColor: PRI, background:`rgba(91,45,110,0.06)`, color: PRI } as React.CSSProperties;
const btnDef = { borderColor: STN, color:`rgba(45,26,46,0.6)` } as React.CSSProperties;
const inputCls = `w-full border-2 bg-white px-4 py-3.5 text-sm focus:outline-none transition-all rounded-xl appearance-none`;

export default function SiparisPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    marka:"", model:"", modelCustom:"", renk:"", tur:"",
    hizmetler:[] as string[],
    ad:"", telefon:"", ilce:"", adres:"",
    tercih:"" as "arasin"|"onayla"|"",
    referralCode:"",
  });
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<null|boolean>(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralMsg, setReferralMsg] = useState("");

  const secilenHizmetler = HIZMETLER.filter(h => form.hizmetler.includes(h.id));
  const toplamMin    = secilenHizmetler.reduce((a,h) => a+h.fiyat, 0);
  const toplamMax    = Math.round(toplamMin * 1.3);
  const kampanya     = form.hizmetler.length >= 3;
  const indirimliMin = kampanya ? Math.round(toplamMin * 0.8) : toplamMin;
  const indirimliMax = kampanya ? Math.round(toplamMax * 0.8) : toplamMax;
  const refMin = referralValid && referralDiscount > 0 ? Math.round(indirimliMin*(1-referralDiscount/100)) : indirimliMin;
  const refMax = referralValid && referralDiscount > 0 ? Math.round(indirimliMax*(1-referralDiscount/100)) : indirimliMax;
  const markaModeller = form.marka ? (MARKA_MODELLER[form.marka]||[]) : [];

  const checkReferral = async (code: string) => {
    if (!code.trim()) { setReferralValid(null); setReferralDiscount(0); setReferralMsg(""); return; }
    setReferralLoading(true);
    const { data, error } = await supabase.from("referral_codes").select("*").eq("code",code.toUpperCase().trim()).eq("active",true).single();
    if (error||!data) { setReferralValid(false); setReferralDiscount(0); setReferralMsg("Geçersiz referans kodu"); }
    else if (data.max_uses!==null && data.used_count>=data.max_uses) { setReferralValid(false); setReferralDiscount(0); setReferralMsg("Bu kod kullanım limitine ulaştı"); }
    else { setReferralValid(true); setReferralDiscount(data.discount_percent); setReferralMsg(`%${data.discount_percent} indirim uygulandı!`); }
    setReferralLoading(false);
  };

  const toggleHizmet = (id: string) => setForm(f=>({...f, hizmetler: f.hizmetler.includes(id) ? f.hizmetler.filter(h=>h!==id) : [...f.hizmetler,id]}));

  const handleSubmit = async () => {
    if (!form.ad||!form.telefon||!form.ilce||!form.adres||!form.tercih) { setError("Lütfen tüm alanları doldurun."); return; }
    setLoading(true); setError("");
    const no = generateOrderNumber();
    const model = form.model==="Diğer" ? form.modelCustom : form.model;
    const { error: dbError } = await supabase.from("orders").insert({
      order_number:no, brand:form.marka, model, color:form.renk,
      shoe_type:form.tur, services:form.hizmetler,
      price:`₺${refMin} - ₺${refMax}`,
      price_choice:form.tercih,
      customer_info:{ad:form.ad, telefon:form.telefon, ilce:form.ilce, adres:form.adres},
      status: form.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",
      referral_code: referralValid&&form.referralCode ? form.referralCode.toUpperCase().trim() : null,
      referral_discount: referralValid ? referralDiscount : 0,
    });
    if (dbError) { setError(`Hata: ${dbError.message||"Sipariş gönderilemedi."}`); setLoading(false); return; }
    setOrderNumber(no); setStep(4); setLoading(false);
  };

  // ── BAŞARI ──
  if (step===4) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{background:BG}}>
      <div className="max-w-md w-full text-center">
        {/* Animasyonlu onay ikonu */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 relative" style={{background:PRI}}>
          <span style={{color:MUV}}>✓</span>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{background:PRI}} />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight" style={{color:DRK}}>Sipariş Alındı!</h1>
        <p className="text-sm mb-6" style={{color:`rgba(45,26,46,0.5)`}}>
          {form.tercih==="arasin" ? "En kısa sürede arayarak net teklif vereceğiz." : "Kuryemiz yakında kapınıza gelecek."}
        </p>

        {/* Sipariş numarası kartı */}
        <div className="rounded-2xl p-6 mb-4" style={{background:"#fff", border:`1.5px solid ${STN}`}}>
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{color:`rgba(45,26,46,0.35)`}}>Sipariş Numaranız</p>
          <div className="flex items-center gap-2 justify-center">
            <p className="font-mono font-black text-2xl" style={{color:PRI}}>{orderNumber}</p>
            <button onClick={() => { navigator.clipboard.writeText(orderNumber); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
              className="px-3 py-1.5 rounded-xl border-2 transition-all text-xs font-bold"
              style={copied ? {borderColor:PRI, background:`rgba(91,45,110,0.08)`, color:PRI} : {borderColor:STN, color:`rgba(45,26,46,0.5)`}}>
              {copied ? "✓ Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>

        {referralValid && referralDiscount>0 && (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold mb-4"
            style={{background:`rgba(191,165,184,0.2)`, color:PRI, border:`1px solid ${MUV}`}}>
            🎁 Referans kodu ile %{referralDiscount} indirim uygulandı
          </div>
        )}

        {/* Adımlar */}
        <div className="rounded-2xl p-5 mb-6" style={{background:`rgba(91,45,110,0.05)`, border:`1px solid rgba(91,45,110,0.15)`}}>
          {[
            {icon:"📦", text:"Siparişin sisteme alındı"},
            {icon:"📞", text: form.tercih==="arasin" ? "Seni arayacağız" : "Kurye yola çıkıyor"},
            {icon:"✨", text:"2 gün içinde kapına teslim"},
          ].map((s,i) => (
            <div key={i} className="flex items-center gap-3 py-2" style={{borderBottom: i<2 ? `1px solid rgba(91,45,110,0.1)` : "none"}}>
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-medium" style={{color:DRK}}>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Link href={`/siparis-takip?no=${orderNumber}`}
            className="px-6 py-3.5 text-sm font-bold rounded-full hover:opacity-90 transition-all"
            style={btnPri}>Siparişi Takip Et →</Link>
          <Link href="/"
            className="px-6 py-3.5 text-sm font-medium rounded-full transition-all"
            style={{border:`2px solid ${STN}`, color:`rgba(45,26,46,0.5)`}}>Ana Sayfa</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen" style={{background:BG}}>
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b backdrop-blur-md"
        style={{borderColor:STN, background:`rgba(245,240,232,0.97)`}}>
        <Link href="/" className="flex items-center">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{height:"44px",width:"auto"}} />
        </Link>
        {/* Adım göstergesi */}
        <div className="flex items-center gap-2">
          {["Ayakkabı","Hizmet","İletişim"].map((l,i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                style={step>i+1 ? {background:MUV, color:DRK} : step===i+1 ? {background:PRI, color:MUV} : {background:`rgba(212,197,176,0.3)`, color:`rgba(45,26,46,0.35)`}}>
                {step>i+1 ? "✓" : i+1}
              </div>
              <span className="text-[11px] hidden md:block font-medium"
                style={{color: step===i+1 ? DRK : `rgba(45,26,46,0.3)`}}>{l}</span>
              {i<2 && <div className="w-8 h-px mx-1 hidden md:block" style={{background: step>i+1 ? MUV : STN}} />}
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">

        {/* ── ADIM 1 ── */}
        {step===1 && (
          <div>
            {/* Başlık */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{background:`rgba(91,45,110,0.08)`, color:PRI}}>
                Adım 1 / 3
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{color:DRK}}>
                Ayakkabı <span style={{color:PRI}}>bilgileri</span>
              </h1>
              <p className="text-sm mt-2" style={{color:`rgba(45,26,46,0.45)`}}>Hangi ayakkabını gönderiyorsun?</p>
            </div>

            <div className="space-y-6">
              {/* Marka */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-3 font-bold" style={{color:DRK}}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{background:PRI, color:MUV}}>1</span>
                  Marka seçin
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MARKALAR.filter(m=>m!=="Diğer").map(m => (
                    <button key={m} onClick={()=>setForm(f=>({...f,marka:m,model:""}))}
                      className="px-3 py-3 text-sm font-semibold rounded-2xl border-2 transition-all text-left"
                      style={form.marka===m ? btnSel : btnDef}>
                      {m}
                    </button>
                  ))}
                  <button onClick={()=>setForm(f=>({...f,marka:"Diğer",model:""}))}
                    className="px-3 py-2.5 text-xs font-medium rounded-xl border-2 transition-all"
                    style={form.marka==="Diğer" ? btnSel : btnDef}>
                    Diğer
                  </button>
                </div>
              </div>

              {/* Model */}
              {form.marka && markaModeller.length>0 && (
                <div>
                  <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-3 font-bold" style={{color:DRK}}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{background:MUV, color:DRK}}>2</span>
                    Model
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {markaModeller.map(m => (
                      <button key={m} onClick={()=>setForm(f=>({...f,model:m}))}
                        className="px-4 py-3 text-sm font-semibold rounded-2xl border-2 transition-all text-left"
                        style={form.model===m ? btnSel : btnDef}>
                        {m}
                      </button>
                    ))}
                  </div>
                  {form.model==="Diğer" && (
                    <input value={form.modelCustom} onChange={e=>setForm(f=>({...f,modelCustom:e.target.value}))}
                      className={inputCls+" mt-2"} placeholder="Model adını yazın"
                      style={{borderColor:STN, color:DRK}} />
                  )}
                </div>
              )}

              {/* Renk — renkli swatchlar */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-3 font-bold" style={{color:DRK}}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{background:PRI, color:MUV}}>3</span>
                  Renk seçin
                </label>
                <div className="flex flex-wrap gap-2">
                  {RENKLER.map(r => (
                    <button key={r} onClick={()=>setForm(f=>({...f,renk:r}))}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all text-sm font-semibold"
                      style={form.renk===r
                        ? {borderColor:PRI, background:`rgba(91,45,110,0.06)`, color:PRI}
                        : {borderColor:STN, color:`rgba(45,26,46,0.6)`}}>
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/50"
                        style={{background: RENK_RENKLER[r] || STN}} />
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tür */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-3 font-bold" style={{color:DRK}}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{background:MUV, color:DRK}}>4</span>
                  Ayakkabı türü
                </label>
                <div className="flex flex-wrap gap-2">
                  {TURLER.map(t => (
                    <button key={t} onClick={()=>setForm(f=>({...f,tur:t}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={form.tur===t ? btnSel : btnDef}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="text-sm mt-4 font-medium" style={{color:`rgba(107,39,55,0.9)`}}>{error}</p>}
            <button onClick={()=>{ if(!form.marka||!form.renk||!form.tur){setError("Lütfen marka, renk ve tür seçin.");return;} setError("");setStep(2); }}
              className="mt-8 w-full py-5 text-base font-bold rounded-full hover:opacity-90 transition-all"
              style={{...btnPri, boxShadow:`0 8px 24px rgba(91,45,110,0.3)`}}>
              Devam Et →
            </button>
          </div>
        )}

        {/* ── ADIM 2 ── */}
        {step===2 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{background:`rgba(191,165,184,0.2)`, color:MUV, border:`1px solid ${MUV}`}}>
                Adım 2 / 3
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{color:DRK}}>
                Hizmet <span style={{color:PRI}}>seçin</span>
              </h1>
              <p className="text-sm mt-2" style={{color:`rgba(45,26,46,0.45)`}}>Birden fazla seçebilirsiniz.</p>
            </div>

            {kampanya && (
              <div className="flex items-center gap-2 text-xs px-4 py-3 rounded-2xl mb-5 font-bold"
                style={{background:PRI, color:MUV}}>
                <span className="text-base">🎉</span>
                3+ hizmet — %20 indirim aktif!
              </div>
            )}

            {/* Hizmet kartları — ikon ile */}
            <div className="space-y-2 mb-6">
              {HIZMETLER.map(h => {
                const sel = form.hizmetler.includes(h.id);
                return (
                  <button key={h.id} onClick={()=>toggleHizmet(h.id)}
                    className="w-full flex items-center gap-4 p-4 border-2 rounded-2xl transition-all text-left"
                    style={sel ? {borderColor:h.accent, background:`rgba(${h.accent===PRI?"91,45,110":"191,165,184"},0.06)`} : {borderColor:STN, background:"#fff"}}>
                    {/* İkon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold transition-all"
                      style={sel ? {background:h.accent, color:MUV} : {background:`rgba(212,197,176,0.25)`, color:`rgba(45,26,46,0.4)`}}>
                      {h.icon}
                    </div>
                    {/* İçerik */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm" style={{color:DRK}}>{h.label}</span>
                        <span className="text-sm font-black" style={{color: sel ? h.accent : `rgba(45,26,46,0.35)`}}>₺{h.fiyat}+</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{color:`rgba(45,26,46,0.4)`}}>{h.desc}</p>
                    </div>
                    {/* Checkbox */}
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all text-[10px] font-bold"
                      style={sel ? {borderColor:h.accent, background:h.accent, color:MUV} : {borderColor:STN}}>
                      {sel ? "✓" : ""}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fiyat özeti */}
            {secilenHizmetler.length>0 && (
              <div className="p-5 rounded-2xl mb-5" style={{background:`rgba(91,45,110,0.06)`, border:`2px solid ${PRI}`}}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold" style={{color:`rgba(45,26,46,0.5)`}}>Tahmini fiyat</span>
                  <span className="text-xl font-black" style={{color:PRI}}>₺{indirimliMin} — ₺{indirimliMax}</span>
                </div>
                {kampanya && <p className="text-xs font-semibold" style={{color:MUV}}>%20 indirim uygulandı 🎉</p>}
                <div className="mt-2 pt-2" style={{borderTop:`1px solid rgba(91,45,110,0.1)`}}>
                  {secilenHizmetler.map(h => (
                    <div key={h.id} className="flex justify-between text-xs py-0.5">
                      <span style={{color:`rgba(45,26,46,0.5)`}}>{h.icon} {h.label}</span>
                      <span style={{color:`rgba(45,26,46,0.4)`}}>₺{h.fiyat}+</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm mb-4 font-medium" style={{color:`rgba(107,39,55,0.9)`}}>{error}</p>}
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="flex-1 border-2 py-4 text-sm font-semibold rounded-full transition-all"
                style={{borderColor:STN, color:`rgba(45,26,46,0.5)`}}>← Geri</button>
              <button onClick={()=>{ if(!form.hizmetler.length){setError("En az bir hizmet seçin.");return;} setError("");setStep(3); }}
                className="flex-1 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all"
                style={btnPri}>Devam Et →</button>
            </div>
          </div>
        )}

        {/* ── ADIM 3 ── */}
        {step===3 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{background:`rgba(212,197,176,0.3)`, color:DRK, border:`1px solid ${STN}`}}>
                Adım 3 / 3
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{color:DRK}}>
                İletişim <span style={{color:PRI}}>bilgileri</span>
              </h1>
              <p className="text-sm mt-2" style={{color:`rgba(45,26,46,0.45)`}}>Kuryemiz bu bilgilere göre gelecek.</p>
            </div>

            <div className="space-y-4">
              {/* Ad Soyad */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-2 font-bold" style={{color:DRK}}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{background:PRI}} />
                  Ad Soyad *
                </label>
                <input value={form.ad} onChange={e=>setForm(f=>({...f,ad:e.target.value}))}
                  className={inputCls} placeholder="Ad Soyad" style={{borderColor:STN, color:DRK}} />
              </div>

              {/* Telefon */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-2 font-bold" style={{color:DRK}}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{background:MUV}} />
                  Telefon *
                </label>
                <input value={form.telefon} onChange={e=>setForm(f=>({...f,telefon:e.target.value}))}
                  className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor:STN, color:DRK}} />
              </div>

              {/* İlçe */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-2 font-bold" style={{color:DRK}}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{background:PRI}} />
                  İlçe *
                </label>
                <div className="flex flex-wrap gap-2">
                  {ILCELER.map(ilce => (
                    <button key={ilce} onClick={()=>setForm(f=>({...f,ilce}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={form.ilce===ilce ? btnSel : btnDef}>
                      {ilce}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adres */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-2 font-bold" style={{color:DRK}}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{background:MUV}} />
                  Adres *
                </label>
                <textarea value={form.adres} onChange={e=>setForm(f=>({...f,adres:e.target.value}))}
                  className={inputCls+" h-24 resize-none"} placeholder="Mahalle, sokak, bina no, daire..."
                  style={{borderColor:STN, color:DRK}} />
              </div>

              {/* Referans kodu */}
              <div>
                <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-2 font-bold" style={{color:DRK}}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{background:STN}} />
                  Referans Kodu
                  <span className="normal-case font-normal" style={{color:`rgba(45,26,46,0.3)`}}>(isteğe bağlı)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input value={form.referralCode}
                      onChange={e=>{ const v=e.target.value.toUpperCase(); setForm(f=>({...f,referralCode:v})); setReferralValid(null); setReferralDiscount(0); setReferralMsg(""); }}
                      className={inputCls+" pr-8"} placeholder="Örn: KAPIDA15"
                      style={{borderColor: referralValid===true ? PRI : referralValid===false ? `rgba(107,39,55,0.6)` : STN, color:DRK}} />
                    {referralValid===true  && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black" style={{color:PRI}}>✓</span>}
                    {referralValid===false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black" style={{color:`rgba(107,39,55,0.7)`}}>✗</span>}
                  </div>
                  <button onClick={()=>checkReferral(form.referralCode)} disabled={referralLoading||!form.referralCode.trim()}
                    className="px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all disabled:opacity-40"
                    style={{borderColor:PRI, color:PRI, background:`rgba(91,45,110,0.06)`}}>
                    {referralLoading ? "..." : "Uygula"}
                  </button>
                </div>
                {referralMsg
                  ? <p className="text-xs mt-2 font-semibold" style={{color: referralValid ? PRI : `rgba(107,39,55,0.8)`}}>{referralValid?"🎁 ":"✗ "}{referralMsg}</p>
                  : <p className="text-xs mt-1.5" style={{color:`rgba(45,26,46,0.3)`}}>Arkadaşından aldığın kodla indirim kazan</p>
                }
              </div>
            </div>

            {/* Sipariş özeti */}
            <div className="rounded-2xl p-5 my-6" style={{background:"#fff", border:`1.5px solid ${STN}`}}>
              <p className="text-[10px] uppercase tracking-widest mb-3 font-bold" style={{color:`rgba(45,26,46,0.3)`}}>Sipariş Özeti</p>
              {secilenHizmetler.map(h => (
                <div key={h.id} className="flex justify-between items-center text-sm py-1.5" style={{borderBottom:`1px solid rgba(212,197,176,0.4)`}}>
                  <span className="flex items-center gap-1.5" style={{color:DRK}}>
                    <span style={{color:h.accent}}>{h.icon}</span> {h.label}
                  </span>
                  <span className="font-medium" style={{color:`rgba(45,26,46,0.4)`}}>₺{h.fiyat}+</span>
                </div>
              ))}
              {kampanya && (
                <div className="flex justify-between text-xs py-1.5 font-bold" style={{color:PRI}}>
                  <span>✦ 3+ hizmet indirimi</span><span>-%20</span>
                </div>
              )}
              {referralValid && referralDiscount>0 && (
                <div className="flex justify-between text-xs py-1.5 font-bold" style={{color:MUV}}>
                  <span>🎁 Referans kodu ({form.referralCode})</span><span>-%{referralDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-black mt-3 pt-3 text-base" style={{borderTop:`2px solid ${STN}`}}>
                <span style={{color:DRK}}>Toplam</span>
                <div className="text-right">
                  {referralValid && referralDiscount>0 && indirimliMin!==refMin && (
                    <p className="text-xs line-through font-normal" style={{color:`rgba(45,26,46,0.3)`}}>₺{indirimliMin} — ₺{indirimliMax}</p>
                  )}
                  <span style={{color:PRI}}>₺{refMin} — ₺{refMax}</span>
                </div>
              </div>
            </div>

            {/* Tercih */}
            <div className="space-y-3 mb-6">
              {[
                {val:"onayla", icon:"🚗", title:"Fiyat uygun — kurye gönder", sub:"Kuryemiz en kısa sürede kapınıza gelir"},
                {val:"arasin", icon:"📞", title:"Net fiyat almak istiyorum",  sub:"Sizi arayarak kesin fiyat bildireceğiz"},
              ].map(opt => (
                <button key={opt.val} onClick={()=>setForm(f=>({...f,tercih:opt.val as "arasin"|"onayla"}))}
                  className="w-full flex gap-4 p-4 border-2 rounded-2xl transition-all text-left items-center"
                  style={form.tercih===opt.val ? {borderColor:PRI, background:`rgba(91,45,110,0.05)`} : {borderColor:STN, background:"#fff"}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={form.tercih===opt.val ? {background:PRI, color:MUV} : {background:`rgba(212,197,176,0.25)`}}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{color:DRK}}>{opt.title}</p>
                    <p className="text-xs mt-0.5" style={{color:`rgba(45,26,46,0.45)`}}>{opt.sub}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={form.tercih===opt.val ? {borderColor:PRI, background:PRI} : {borderColor:STN}}>
                    {form.tercih===opt.val && <span className="w-2 h-2 rounded-full block" style={{background:MUV}} />}
                  </div>
                </button>
              ))}
            </div>

            {error && <p className="text-sm mb-4 font-medium" style={{color:`rgba(107,39,55,0.9)`}}>{error}</p>}
            <div className="flex gap-3">
              <button onClick={()=>setStep(2)} className="flex-1 border-2 py-4 text-sm font-semibold rounded-full transition-all"
                style={{borderColor:STN, color:`rgba(45,26,46,0.5)`}}>← Geri</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-5 text-base font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50"
                style={{...btnPri, boxShadow:`0 8px 24px rgba(91,45,110,0.3)`}}>
                {loading ? "Gönderiliyor..." : "Siparişi Tamamla ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
