"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Nav from "@/components/Nav";

const MARKA_MODELLER: Record<string, string[]> = {
  "Nike": ["Air Force 1", "Air Max 90", "Air Max 95", "Air Max 97", "Air Jordan 1", "Air Jordan 4", "Air Jordan 11", "Dunk Low", "Dunk High", "React", "Pegasus", "Blazer", "Cortez", "Diğer"],
  "Adidas": ["Stan Smith", "Superstar", "Gazelle", "Samba", "NMD R1", "Ultraboost", "Yeezy 350", "Yeezy 500", "Forum Low", "Campus", "Handball Spezial", "Diğer"],
  "New Balance": ["574", "990", "992", "993", "2002R", "550", "327", "Diğer"],
  "Puma": ["Suede", "RS-X", "Clyde", "Future Rider", "Mayze", "Diğer"],
  "Vans": ["Old Skool", "Sk8-Hi", "Authentic", "Era", "Slip-On", "Diğer"],
  "Converse": ["Chuck Taylor All Star", "Chuck 70", "Run Star Hike", "One Star", "Diğer"],
  "Reebok": ["Classic Leather", "Club C", "Freestyle", "Instapump", "Diğer"],
  "Timberland": ["6-Inch Boot", "Euro Hiker", "Diğer"],
  "Dr. Martens": ["1460", "1461", "Jadon", "Diğer"],
  "Jordan": ["Air Jordan 1", "Air Jordan 3", "Air Jordan 4", "Air Jordan 6", "Air Jordan 11", "Diğer"],
  "Asics": ["Gel-Kayano", "Gel-Nimbus", "GT-2000", "Diğer"],
  "Salomon": ["XT-6", "Speedcross", "Diğer"],
  "Diğer": [],
};

const MARKALAR = Object.keys(MARKA_MODELLER);
const RENKLER = ["Siyah","Beyaz","Kahverengi","Lacivert","Gri","Kırmızı","Mavi","Yeşil","Sarı","Pembe","Bej","Diğer"];
const TURLER = ["Sneaker","Klasik Ayakkabı","Bot","Çizme","Spor Ayakkabı","Süet Ayakkabı","Topuklu Ayakkabı","Sandalet","Diğer"];
const ILCELER = ["Ataşehir","Beykoz","Çekmeköy","Kadıköy","Kartal","Maltepe","Pendik","Sancaktepe","Sultanbeyli","Tuzla","Ümraniye","Üsküdar"];
const HIZMETLER = [
  { id: "bakim", label: "Temizlik & Bakım", desc: "Buhar temizlik, cila, bağcık değişimi", fiyat: 800, icon: "✦" },
  { id: "boya", label: "Boya & Restorasyon", desc: "Profesyonel boya ve renk yenileme", fiyat: 1200, icon: "◈" },
  { id: "taban", label: "Taban Değişimi", desc: "Dış taban komple değişimi", fiyat: 600, icon: "◎" },
  { id: "dikiş", label: "Dikiş Tamiri", desc: "Yırtık ve sökük dikişlerin tamiri", fiyat: 400, icon: "◇" },
  { id: "ic_taban", label: "İç Taban Değişimi", desc: "İç taban komple değişimi", fiyat: 400, icon: "▽" },
  { id: "coraplık", label: "Çoraplık Tamiri", desc: "Arka iç kısım onarımı", fiyat: 350, icon: "○" },
  { id: "fort", label: "Fort Tamiri", desc: "Arka dik kısım tamiri", fiyat: 300, icon: "△" },
  { id: "yapıştırma", label: "Yapıştırma", desc: "Taban yapıştırma ve sökük onarımı", fiyat: 250, icon: "□" },
];

function generateOrderNumber() {
  return "KPD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

export default function SiparisPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    marka: "", model: "", modelCustom: "", renk: "", tur: "",
    hizmetler: [] as string[],
    ad: "", telefon: "", ilce: "", adres: "",
    tercih: "" as "arasin" | "onayla" | "",
    referralCode: "",
  });
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Referral state
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<null | boolean>(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralMsg, setReferralMsg] = useState("");

  const secilenHizmetler = HIZMETLER.filter(h => form.hizmetler.includes(h.id));
  const toplamMin = secilenHizmetler.reduce((a, h) => a + h.fiyat, 0);
  const toplamMax = Math.round(toplamMin * 1.3);
  const kampanya = form.hizmetler.length >= 3;
  const indirimliMin = kampanya ? Math.round(toplamMin * 0.8) : toplamMin;
  const indirimliMax = kampanya ? Math.round(toplamMax * 0.8) : toplamMax;

  // Referans kodu indirimi
  const referralIndirimliMin = referralValid && referralDiscount > 0
    ? Math.round(indirimliMin * (1 - referralDiscount / 100))
    : indirimliMin;
  const referralIndirimliMax = referralValid && referralDiscount > 0
    ? Math.round(indirimliMax * (1 - referralDiscount / 100))
    : indirimliMax;

  const markaModeller = form.marka ? (MARKA_MODELLER[form.marka] || []) : [];

  const checkReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralValid(null); setReferralDiscount(0); setReferralMsg(""); return;
    }
    setReferralLoading(true);
    const { data, error } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("active", true)
      .single();
    if (error || !data) {
      setReferralValid(false); setReferralDiscount(0); setReferralMsg("Geçersiz referans kodu");
    } else if (data.max_uses !== null && data.used_count >= data.max_uses) {
      setReferralValid(false); setReferralDiscount(0); setReferralMsg("Bu kod kullanım limitine ulaşti");
    } else {
      setReferralValid(true); setReferralDiscount(data.discount_percent);
      setReferralMsg("%" + data.discount_percent + " indirim uygulandı!");
    }
    setReferralLoading(false);
  };

  const toggleHizmet = (id: string) => {
    setForm(f => ({ ...f, hizmetler: f.hizmetler.includes(id) ? f.hizmetler.filter(h => h !== id) : [...f.hizmetler, id] }));
  };

  const handleSubmit = async () => {
    if (!form.ad || !form.telefon || !form.ilce || !form.adres || !form.tercih) {
      setError("Lütfen tüm alanları doldurun."); return;
    }
    setLoading(true); setError("");
    const no = generateOrderNumber();
    const model = form.model === "Diğer" ? form.modelCustom : form.model;
    const { error: dbError } = await supabase.from("orders").insert({
      order_number: no, brand: form.marka, model, color: form.renk,
      shoe_type: form.tur, services: form.hizmetler,
      price: referralValid && referralDiscount > 0 ? `₺${referralIndirimliMin} - ₺${referralIndirimliMax}` : `₺${indirimliMin} - ₺${indirimliMax}`,
      price_choice: form.tercih,
      customer_info: { ad: form.ad, telefon: form.telefon, ilce: form.ilce, adres: form.adres },
      status: form.tercih === "arasin" ? "Teklif Bekleniyor" : "Onaylandı",
      referral_code: referralValid && form.referralCode ? form.referralCode.toUpperCase().trim() : null,
      referral_discount: referralValid ? referralDiscount : 0,
    });
    if (dbError) { setError(`Hata: ${dbError.message || "Sipariş gönderilemedi, tekrar deneyin."}`); setLoading(false); return; }
    setOrderNumber(no); setStep(4); setLoading(false);
  };

  const inputCls = "w-full border-2 border-stone-200 bg-white px-4 py-3.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-all rounded-xl appearance-none";

  // Başarı sayfası
  if (step === 4) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{background:"#F0EBF5"}}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-8" style={{background:"#5B2D6E"}}>✓</div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Sipariş Alındı!</h1>
        <p className="text-black/40 mb-2 text-sm">Sipariş numaranız</p>
        <div className="flex items-center gap-2 mb-3">
          <p className="font-mono font-bold text-xl px-6 py-3 bg-white rounded-2xl border border-stone-200">{orderNumber}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(orderNumber);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-3 rounded-2xl border-2 transition-all text-sm font-semibold"
            style={copied ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.08)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.1)", color:"rgba(26,10,30,0.5)"}}
          >
            {copied ? "✓ Kopyalandı" : "Kopyala"}
          </button>
        </div>
        <p className="text-sm text-black/50 mb-10 mt-4">
          {form.tercih === "arasin" ? "En kısa sürede arayarak net teklif vereceğiz." : "Kuryemiz yakında kapınıza gelecek."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/siparis-takip?no=${orderNumber}`} className="px-6 py-3.5 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all" style={{background:"#5B2D6E"}}>
            Siparişi Takip Et
          </Link>
          <Link href="/" className="border-2 border-stone-200 px-6 py-3.5 text-sm font-medium rounded-full hover:border-black/30 transition-all text-black/60">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen" style={{background:"#F5F0E8"}}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <Link href="/" className="flex items-center">
          <img src="/logo-clean.png?v=3" alt="Kapıda" style={{ height: "44px", width: "auto" }} />
        </Link>
        <div className="flex items-center gap-2">
          {["Ayakkabı", "Hizmet", "İletişim"].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${step > i+1 ? "text-white" : step === i+1 ? "text-white" : "bg-black/6 text-black/25"}`}
                style={step >= i+1 ? {background:"#5B2D6E"} : {}}>
                {step > i+1 ? "✓" : i+1}
              </div>
              <span className={`text-[11px] hidden md:block font-medium ${step === i+1 ? "" style={{color:"#1A0A1E"}} : ""}`}>{l}</span>
              {i < 2 && <div className="w-6 h-px bg-black/8 mx-1 hidden md:block" />}
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">

        {/* ADIM 1 */}
        {step === 1 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/25 mb-2">Adım 1 / 3</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">Ayakkabı <span style={{color:"#5B2D6E"}}>bilgileri</span></h1>
            <div className="space-y-5">

              {/* Marka */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Marka *</label>
                <div className="grid grid-cols-3 gap-2">
                  {MARKALAR.filter(m => m !== "Diğer").map(m => (
                    <button key={m} onClick={() => setForm(f => ({...f, marka:m, model:""}))}
                      className="px-4 py-3 text-sm font-semibold rounded-2xl border-2 transition-all text-left hover:border-black/20"
                      style={form.marka === m ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                      {m}
                    </button>
                  ))}
                  <button onClick={() => setForm(f => ({...f, marka:"Diğer", model:""}))}
                    className="px-3 py-2.5 text-xs font-medium rounded-xl border-2 transition-all"
                    style={form.marka === "Diğer" ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                    Diğer
                  </button>
                </div>
              </div>

              {/* Model - sadece marka seçilince */}
              {form.marka && markaModeller.length > 0 && (
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Model</label>
                  <div className="grid grid-cols-2 gap-2">
                    {markaModeller.map(m => (
                      <button key={m} onClick={() => setForm(f => ({...f, model:m}))}
                        className="px-4 py-3 text-sm font-semibold rounded-2xl border-2 transition-all text-left hover:border-black/20"
                        style={form.model === m ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                        {m}
                      </button>
                    ))}
                  </div>
                  {form.model === "Diğer" && (
                    <input value={form.modelCustom} onChange={e => setForm(f=>({...f,modelCustom:e.target.value}))}
                      className={inputCls + " mt-2"} placeholder="Model adını yazın" />
                  )}
                </div>
              )}

              {/* Renk */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Renk *</label>
                <div className="flex flex-wrap gap-2">
                  {RENKLER.map(r => (
                    <button key={r} onClick={() => setForm(f=>({...f,renk:r}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={form.renk === r ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tür */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Ayakkabı türü *</label>
                <div className="flex flex-wrap gap-2">
                  {TURLER.map(t => (
                    <button key={t} onClick={() => setForm(f=>({...f,tur:t}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={form.tur === t ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button onClick={() => {
              if (!form.marka || !form.renk || !form.tur) { setError("Lütfen marka, renk ve tür seçin."); return; }
              setError(""); setStep(2);
            }} className="mt-8 w-full py-5 text-base font-bold text-white rounded-full hover:opacity-90 transition-all shadow-lg" style={{background:"#5B2D6E", boxShadow:"0 8px 24px rgba(91,45,110,0.3)"}}>
              Devam →
            </button>
          </div>
        )}

        {/* ADIM 2 */}
        {step === 2 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/25 mb-2">Adım 2 / 3</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Hizmet <span style={{color:"#5B2D6E"}}>seçin</span></h1>
            <p className="text-sm text-black/40 mb-6">Birden fazla seçebilirsiniz. 3+ seçimde %20 indirim!</p>

            {kampanya && (
              <div className="flex items-center gap-2 text-white text-xs px-4 py-2.5 rounded-full mb-6 w-fit font-bold" style={{background:"#5B2D6E"}}>
                ✦ 3+ hizmet — %20 indirim aktif!
              </div>
            )}

            <div className="space-y-2 mb-8">
              {HIZMETLER.map(h => (
                <button key={h.id} onClick={() => toggleHizmet(h.id)}
                  className="w-full flex items-center gap-4 p-5 border-2 rounded-2xl transition-all text-left"
                  style={form.hizmetler.includes(h.id) ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.04)"} : {borderColor:"rgba(26,10,30,0.08)"}}>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all text-[11px] font-bold"
                    style={form.hizmetler.includes(h.id) ? {borderColor:"#5B2D6E", background:"#5B2D6E", color:"#fff"} : {borderColor:"rgba(26,10,30,0.2)"}}>
                    {form.hizmetler.includes(h.id) ? "✓" : ""}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{h.label}</span>
                      <span className="text-sm font-bold" style={{color: form.hizmetler.includes(h.id) ? "#5B2D6E" : "rgba(26,10,30,0.35)"}}>₺{h.fiyat}+</span>
                    </div>
                    <p className="text-xs text-black/35 mt-0.5">{h.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {secilenHizmetler.length > 0 && (
              <div className="p-5 rounded-2xl mb-6 border-2" style={{borderColor:"#5B2D6E", background:"rgba(91,45,110,0.04)"}}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/50">Tahmini fiyat</span>
                  <span className="text-xl font-black" style={{color:"#5B2D6E"}}>₺{indirimliMin} — ₺{indirimliMax}</span>
                </div>
                {kampanya && <p className="text-xs mt-1" style={{color:"#5B2D6E"}}>%20 indirim uygulandı 🎉</p>}
              </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-black/15 py-4 text-sm font-semibold rounded-full hover:border-black/40 transition-all text-black/60">← Geri</button>
              <button onClick={() => {
                if (!form.hizmetler.length) { setError("En az bir hizmet seçin."); return; }
                setError(""); setStep(3);
              }} className="flex-1 py-4 text-sm font-bold text-white rounded-full hover:opacity-90 transition-all" style={{background:"#5B2D6E"}}>
                Devam →
              </button>
            </div>
          </div>
        )}

        {/* ADIM 3 */}
        {step === 3 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/25 mb-2">Adım 3 / 3</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">İletişim <span style={{color:"#5B2D6E"}}>bilgileri</span></h1>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Ad Soyad *</label>
                <input value={form.ad} onChange={e => setForm(f=>({...f,ad:e.target.value}))} className={inputCls} placeholder="Ad Soyad" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Telefon *</label>
                <input value={form.telefon} onChange={e => setForm(f=>({...f,telefon:e.target.value}))} className={inputCls} placeholder="05XX XXX XX XX" type="tel" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">İlçe *</label>
                <div className="flex flex-wrap gap-2">
                  {ILCELER.map(i => (
                    <button key={i} onClick={() => setForm(f=>({...f,ilce:i}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={form.ilce === i ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.06)", color:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.08)", color:"rgba(0,0,0,0.6)"}}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">Adres *</label>
                <textarea value={form.adres} onChange={e => setForm(f=>({...f,adres:e.target.value}))} className={inputCls + " h-24 resize-none"} placeholder="Mahalle, sokak, bina no, daire..." />
              </div>

              {/* REFERANS KODU */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-black/40 block mb-2">
                  Referans Kodu <span className="normal-case text-black/25">(isteğe bağlı)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      value={form.referralCode}
                      onChange={e => {
                        const val = e.target.value.toUpperCase();
                        setForm(f => ({...f, referralCode: val}));
                        setReferralValid(null); setReferralDiscount(0); setReferralMsg("");
                      }}
                      className={inputCls + " pr-8"}
                      placeholder="Örn: KAPIDA15"
                      style={{
                        borderColor: referralValid === true ? "#22c55e" : referralValid === false ? "#ef4444" : undefined
                      }}
                    />
                    {referralValid === true && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">✓</span>}
                    {referralValid === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm font-bold">✗</span>}
                  </div>
                  <button
                    onClick={() => checkReferralCode(form.referralCode)}
                    disabled={referralLoading || !form.referralCode.trim()}
                    className="px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all disabled:opacity-40"
                    style={{borderColor:"#5B2D6E", color:"#5B2D6E", background:"rgba(91,45,110,0.06)"}}>
                    {referralLoading ? "..." : "Uygula"}
                  </button>
                </div>
                {referralMsg ? (
                  <p className={"text-xs mt-2 font-semibold " + (referralValid ? "text-green-600" : "text-red-500")}>
                    {referralValid ? "🎁 " : "✗ "}{referralMsg}
                  </p>
                ) : (
                  <p className="text-xs mt-1.5 text-black/30">Arkadaşından aldığın referans koduyla indirim kazan</p>
                )}
              </div>
            </div>

            {/* Özet */}
            <div className="border-2 border-stone-200 rounded-2xl p-5 my-6">
              <p className="text-[10px] uppercase tracking-widest text-black/30 mb-3">Sipariş özeti</p>
              {secilenHizmetler.map(h => (
                <div key={h.id} className="flex justify-between text-sm py-1.5 border-b border-black/5 last:border-0">
                  <span className="">{h.label}</span>
                  <span className="text-black/40 font-medium">₺{h.fiyat}+</span>
                </div>
              ))}
              <div className="flex justify-between font-black mt-3 pt-3 border-t-2 border-stone-200 text-base">
                <span>Toplam</span>
                <span style={{color:"#5B2D6E"}}>₺{indirimliMin} — ₺{indirimliMax}</span>
              </div>
            </div>

            {/* Tercih */}
            <div className="space-y-3 mb-8">
              {[
                { val: "onayla", title: "Fiyat uygun — kurye gönder", sub: "Kuryemiz en kısa sürede kapınıza gelir" },
                { val: "arasin", title: "Net fiyat almak istiyorum", sub: "Sizi arayarak kesin fiyat bildireceğiz" },
              ].map(opt => (
                <button key={opt.val} onClick={() => setForm(f=>({...f,tercih:opt.val as "arasin"|"onayla"}))}
                  className="w-full flex gap-4 p-4 border-2 rounded-2xl transition-all text-left"
                  style={form.tercih === opt.val ? {borderColor:"#5B2D6E", background:"rgba(91,45,110,0.04)"} : {borderColor:"rgba(26,10,30,0.08)"}}>
                  <div className="w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0"
                    style={form.tercih === opt.val ? {borderColor:"#5B2D6E", background:"#5B2D6E"} : {borderColor:"rgba(26,10,30,0.2)"}}>
                    {form.tercih === opt.val && <span className="w-2 h-2 bg-white rounded-full block" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{opt.title}</p>
                    <p className="text-xs text-black/40 mt-0.5">{opt.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-black/15 py-4 text-sm font-semibold rounded-full hover:border-black/40 transition-all text-black/60">← Geri</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-5 text-base font-bold text-white rounded-full hover:opacity-90 transition-all disabled:opacity-50" style={{background:"#5B2D6E", boxShadow:"0 8px 24px rgba(91,45,110,0.3)"}}>
                {loading ? "Gönderiliyor..." : "Siparişi Tamamla ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
