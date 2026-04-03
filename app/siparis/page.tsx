"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

// ── Standart markalar
const STANDART_MARKALAR: Record<string, string[]> = {
  "Nike":        ["Air Force 1","Air Max 90","Air Max 95","Air Max 97","Air Jordan 1","Air Jordan 4","Air Jordan 11","Dunk Low","Dunk High","Pegasus","Blazer","Cortez","Diğer"],
  "Adidas":      ["Stan Smith","Superstar","Gazelle","Samba","NMD R1","Ultraboost","Yeezy 350","Yeezy 500","Forum Low","Campus","Handball Spezial","Diğer"],
  "New Balance": ["574","990","992","993","2002R","550","327","Diğer"],
  "Puma":        ["Suede","RS-X","Clyde","Future Rider","Mayze","Diğer"],
  "Vans":        ["Old Skool","Sk8-Hi","Authentic","Era","Slip-On","Diğer"],
  "Converse":    ["Chuck Taylor All Star","Chuck 70","Run Star Hike","One Star","Diğer"],
  "Reebok":      ["Classic Leather","Club C","Freestyle","Instapump","Diğer"],
  "Timberland":  ["6-Inch Boot","Euro Hiker","Diğer"],
  "Dr. Martens": ["1460","1461","Jadon","Diğer"],
  "Asics":       ["Gel-Kayano","Gel-Nimbus","GT-2000","Diğer"],
  "Salomon":     ["XT-6","Speedcross","Diğer"],
  "Diğer":       [],
};

// ── Premium markalar
const PREMIUM_MARKALAR: Record<string, string[]> = {
  "Louboutin":        ["Diğer"],
  "Hermès":           ["Diğer"],
  "Balenciaga":       ["Triple S","Speed","Track","Diğer"],
  "Off-White":        ["Out Of Office","Diğer"],
  "Bottega Veneta":   ["Diğer"],
  "Dior":             ["B23","B27","Diğer"],
  "Gucci":            ["Ace","Rhyton","Diğer"],
  "Prada":            ["Diğer"],
  "Common Projects":  ["Achilles","Diğer"],
  "Maison Margiela":  ["Tabi","Replica","Diğer"],
  "Golden Goose":     ["Superstar","Slide","Diğer"],
  "Alexander McQueen":["Oversized Sneaker","Diğer"],
  "Diğer Premium":    [],
};

const RENKLER  = ["Siyah","Beyaz","Kahverengi","Lacivert","Gri","Kırmızı","Mavi","Yeşil","Sarı","Pembe","Bej","Diğer"];
const TURLER   = ["Sneaker","Klasik Ayakkabı","Bot","Çizme","Spor Ayakkabı","Süet Ayakkabı","Topuklu Ayakkabı","Sandalet","Diğer"];
const ILCELER  = ["Kadıköy","Üsküdar","Ataşehir","Ümraniye"];

const HIZMETLER = [
  { id:"bakim",      label:"Temizlik & Bakım",   desc:"Buhar temizlik, cila, bağcık değişimi",  fiyat:800,  accent: PRI },
  { id:"boya",       label:"Boya & Restorasyon", desc:"Profesyonel boya ve renk yenileme",      fiyat:1200, accent: MUV },
  { id:"taban",      label:"Taban Değişimi",      desc:"Dış taban komple değişimi",             fiyat:600,  accent: PRI },
  { id:"dikiş",      label:"Dikiş Tamiri",        desc:"Yırtık ve sökük dikişlerin tamiri",     fiyat:400,  accent: MUV },
  { id:"ic_taban",   label:"İç Taban Değişimi",   desc:"İç taban komple değişimi",              fiyat:400,  accent: PRI },
  { id:"coraplık",   label:"Çoraplık Tamiri",     desc:"Arka iç kısım onarımı",                 fiyat:350,  accent: MUV },
  { id:"fort",       label:"Fort Tamiri",          desc:"Arka dik kısım tamiri",                 fiyat:300,  accent: PRI },
  { id:"yapıştırma", label:"Yapıştırma",           desc:"Taban yapıştırma ve sökük onarımı",    fiyat:250,  accent: MUV },
];

const RENK_RENKLER: Record<string, string> = {
  "Siyah":"#1a1a1a","Beyaz":"#f5f5f5","Kahverengi":"#7B4F2E","Lacivert":"#1B2A5E",
  "Gri":"#888888","Kırmızı":"#C0392B","Mavi":"#2471A3","Yeşil":"#1E8449",
  "Sarı":"#D4AC0D","Pembe":"#D98880","Bej":"#C9A87C","Diğer":"#BFA5B8",
};

type Ayakkabi = {
  kategori: "standart" | "premium";
  marka: string;
  model: string;
  modelCustom: string;
  renk: string;
  tur: string;
  hizmetler: string[];
  not: string;
};



function bos(): Ayakkabi {
  return { kategori:"standart", marka:"", model:"", modelCustom:"", renk:"", tur:"", hizmetler:[], not:"" };
}

function generateOrderNumber() {
  return "KPD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2,5).toUpperCase();
}

const btnPri = { background: PRI, color: MUV } as React.CSSProperties;
const btnSel = { borderColor: PRI, background:`rgba(91,45,110,0.06)`, color: PRI } as React.CSSProperties;
const btnDef = { borderColor: STN, color:`rgba(45,26,46,0.6)` } as React.CSSProperties;
const inputCls = `w-full border-2 bg-white px-4 py-3.5 text-sm focus:outline-none transition-all rounded-xl appearance-none`;

// ── Tek ayakkabı kartı ──
function AyakkabiKarti({
  idx, data, onChange, onRemove, canRemove, fieldError, fieldRef
}: {
  idx: number;
  data: Ayakkabi;
  onChange: (d: Ayakkabi) => void;
  onRemove: () => void;
  canRemove: boolean;
  fieldError?: string;
  fieldRef?: React.RefObject<HTMLDivElement>;
}) {
  const isPremium = data.kategori === "premium";
  const markaListesi = isPremium ? PREMIUM_MARKALAR : STANDART_MARKALAR;
  const markaModeller = data.marka ? (markaListesi[data.marka] || []) : [];

  const toggle = (id: string) => onChange({
    ...data,
    hizmetler: data.hizmetler.includes(id)
      ? data.hizmetler.filter(h => h !== id)
      : [...data.hizmetler, id]
  });

  const toplamFiyat = HIZMETLER.filter(h => data.hizmetler.includes(h.id)).reduce((a,h) => a+h.fiyat, 0) * (data.kategori === "premium" ? 1.2 : 1);

  return (
    <div className="rounded-2xl border-2 overflow-hidden mb-4"
      style={{borderColor: isPremium ? `rgba(91,45,110,0.5)` : STN, background:"#fff"}}>

      {/* Kart başlığı */}
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{borderColor: isPremium ? `rgba(91,45,110,0.15)` : STN, background: isPremium ? `rgba(91,45,110,0.04)` : `rgba(212,197,176,0.15)`}}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
            style={{background: PRI, color: MUV}}>
            {idx + 1}
          </div>
          <span className="text-sm font-bold" style={{color: DRK}}>
            {data.marka && data.model
              ? `${data.marka} ${data.model === "Diğer" || data.model === "Diğer Premium" ? data.modelCustom || "Diğer" : data.model}`
              : `Ayakkabı ${idx + 1}`}
          </span>
          {isPremium && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{background:`rgba(91,45,110,0.12)`, color: PRI}}>
              ✦ Premium
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {toplamFiyat > 0 && (
            <span className="text-sm font-black" style={{color: PRI}}>₺{toplamFiyat.toLocaleString()}+</span>
          )}
          {canRemove && (
            <button onClick={onRemove} className="text-xs px-3 py-1 rounded-full border transition-all"
              style={{borderColor:`rgba(45,26,46,0.2)`, color:`rgba(45,26,46,0.4)`}}>
              Kaldır
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Kategori seçimi */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Ayakkabı kategorisi</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onChange({...data, kategori:"standart", marka:"", model:"", modelCustom:""})}
              className="px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left flex items-center gap-2"
              style={!isPremium ? btnSel : btnDef}>
              <span>👟</span>
              <div>
                <p className="font-bold text-sm">Standart</p>
                <p className="text-[11px] opacity-60">Nike, Adidas, vb.</p>
              </div>
            </button>
            <button onClick={() => onChange({...data, kategori:"premium", marka:"", model:"", modelCustom:""})}
              className="px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left flex items-center gap-2"
              style={isPremium ? {borderColor:PRI, background:`rgba(91,45,110,0.06)`, color:PRI} : btnDef}>
              <span>✦</span>
              <div>
                <p className="font-bold text-sm">Premium</p>
                <p className="text-[11px] opacity-60">Louboutin, Hermès, vb.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Premium uyarısı */}
        {isPremium && (
          <div className="p-4 rounded-xl border" style={{borderColor:`rgba(91,45,110,0.2)`, background:`rgba(91,45,110,0.04)`}}>
            <p className="text-sm font-semibold mb-1" style={{color: PRI}}>✦ Premium bakım</p>
            <p className="text-xs leading-relaxed" style={{color:`rgba(45,26,46,0.6)`}}>
              Premium ayakkabılarınız için özel dikkat ve teknikler uyguluyoruz. Lütfen dikkat etmemizi istediğiniz detayları not kısmına ekleyin.
            </p>
          </div>
        )}

        {/* Marka */}
        <div ref={fieldError === "marka" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Marka</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(markaListesi).map(m => (
              <button key={m} onClick={() => onChange({...data, marka:m, model:"", modelCustom:""})}
                className="px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all text-left"
                style={data.marka===m ? (isPremium ? {borderColor:PRI, background:`rgba(91,45,110,0.06)`, color:PRI} : btnSel) : btnDef}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Marka hata */}
        {fieldError === "marka" && (
          <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir marka seçin.</p>
        )}

        {/* Model */}
        {data.marka && markaModeller.length > 0 && (
          <div>
            <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Model</label>
            <div className="grid grid-cols-2 gap-2">
              {markaModeller.map(m => (
                <button key={m} onClick={() => onChange({...data, model:m})}
                  className="px-3 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all text-left"
                  style={data.model===m ? btnSel : btnDef}>{m}</button>
              ))}
            </div>
            {(data.model === "Diğer" || data.model === "Diğer Premium") && (
              <input value={data.modelCustom} onChange={e => onChange({...data, modelCustom:e.target.value})}
                className={inputCls+" mt-2"} placeholder="Model adını yazın" style={{borderColor:STN, color:DRK}} />
            )}
          </div>
        )}

        {/* Renk */}
        <div ref={fieldError === "renk" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Renk</label>
          <div className="flex flex-wrap gap-2">
            {RENKLER.map(r => (
              <button key={r} onClick={() => onChange({...data, renk:r})}
                className="flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all text-sm font-semibold"
                style={data.renk===r ? {borderColor:PRI, background:`rgba(91,45,110,0.06)`, color:PRI} : {borderColor:STN, color:`rgba(45,26,46,0.6)`}}>
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/50" style={{background: RENK_RENKLER[r]}} />
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Renk hata */}
        {fieldError === "renk" && (
          <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir renk seçin.</p>
        )}

        {/* Tür */}
        <div ref={fieldError === "tur" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Tür</label>
          <div className="flex flex-wrap gap-2">
            {TURLER.map(t => (
              <button key={t} onClick={() => onChange({...data, tur:t})}
                className="px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all"
                style={data.tur===t ? btnSel : btnDef}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tür hata */}
        {fieldError === "tur" && (
          <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir tür seçin.</p>
        )}

        {/* Hizmetler */}
        <div ref={fieldError === "hizmet" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Hizmetler</label>
          <div className="space-y-2">
            {HIZMETLER.map(h => {
              const sel = data.hizmetler.includes(h.id);
              return (
                <button key={h.id} onClick={() => toggle(h.id)}
                  className="w-full flex items-center gap-3 p-3 border-2 rounded-xl transition-all text-left"
                  style={sel ? {borderColor:h.accent, background:`rgba(${h.accent===PRI?"91,45,110":"191,165,184"},0.05)`} : {borderColor:STN, background:"#fafafa"}}>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={sel ? {borderColor:h.accent, background:h.accent} : {borderColor:STN}}>
                    {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold" style={{color:DRK}}>{h.label}</span>
                    <span className="text-xs ml-2" style={{color:`rgba(45,26,46,0.4)`}}>{h.desc}</span>
                  </div>
                  <div className="text-right">
                    {isPremium && (
                      <p className="text-xs line-through font-medium" style={{color:`rgba(45,26,46,0.4)`}}>₺{h.fiyat}+</p>
                    )}
                    <span className="text-base font-black shrink-0" style={{color: sel ? h.accent : DRK}}>
                      ₺{isPremium ? Math.round(h.fiyat * 1.2) : h.fiyat}+
                    </span>
                    {isPremium && (
                      <p className="text-[9px] font-bold uppercase tracking-wide mt-0.5" style={{color: PRI}}>Premium</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hizmet hata */}
        {fieldError === "hizmet" && (
          <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen en az bir hizmet seçin.</p>
        )}

        {/* Not alanı */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>
            {isPremium ? "Özel bakım notunuz" : "Not"}{" "}
            <span className="normal-case font-normal" style={{color:`rgba(45,26,46,0.35)`}}>(isteğe bağlı)</span>
          </label>
          <textarea
            value={data.not}
            onChange={e => onChange({...data, not:e.target.value})}
            rows={3}
            className={inputCls + " resize-none"}
            style={{borderColor: isPremium ? `rgba(91,45,110,0.3)` : STN, color:DRK}}
            placeholder={isPremium
              ? "Örn: Sol topuk dışı hasarlı, renk solması var, dikkatli olunmasını istiyorum..."
              : "Örn: Sağ ayakkabının burnu çizik, bağcıkları değişsin..."
            }
          />
        </div>

      </div>
    </div>
  );
}

export default function SiparisPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // ── Auth guard: giriş yapılmamışsa /auth'a yönlendir ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth?redirect=/siparis");
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  const [step, setStep] = useState(1);
  const [ayakkabiListesi, setAyakkabiListesi] = useState<Ayakkabi[]>([bos()]);
  const [iletisim, setIletisim] = useState({ ad:"", telefon:"", ilce:"", adres:"", tercih:"" as "arasin"|"onayla"|"", referralCode:"" });
  const [loggedInUser, setLoggedInUser] = useState<{email:string; ad:string; telefon:string} | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: prof } = await supabase.from("profiles").select("full_name,phone").eq("id", data.session.user.id).single();
        const ad = prof?.full_name || "";
        const telefon = prof?.phone || "";
        setLoggedInUser({ email: data.session.user.email || "", ad, telefon });
        setIletisim(f => ({ ...f, ad, telefon }));
      }
    });
  }, []);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [kartError, setKartError] = useState<{idx: number; field: string} | null>(null);
  const kartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fieldScrollRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLInputElement>(null);
  const telefonRef = useRef<HTMLInputElement>(null);
  const ilceRef = useRef<HTMLDivElement>(null);
  const adresRef = useRef<HTMLTextAreaElement>(null);
  const tercihRef = useRef<HTMLDivElement>(null);
  const [fieldError2, setFieldError2] = useState("");
  const scrollTo = (ref: React.RefObject<any>) => { setTimeout(() => { if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: "smooth" }); } }, 50); };
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<null|boolean>(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralMsg, setReferralMsg] = useState("");

  // Yükleniyorken bekletme ekranı
  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{background: BG}}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{borderColor: `${PRI}40`, borderTopColor: PRI}} />
          <p className="text-sm font-medium" style={{color:`rgba(45,26,46,0.4)`}}>Yükleniyor...</p>
        </div>
      </main>
    );
  }

  const updateAyakkabi = (idx: number, d: Ayakkabi) => {
    const yeni = [...ayakkabiListesi];
    yeni[idx] = d;
    setAyakkabiListesi(yeni);
  };

  const addAyakkabi = () => setAyakkabiListesi(prev => [...prev, bos()]);
  const removeAyakkabi = (idx: number) => setAyakkabiListesi(prev => prev.filter((_,i) => i !== idx));

  const tumHizmetler = ayakkabiListesi.flatMap(a => HIZMETLER.filter(h => a.hizmetler.includes(h.id)));
  const toplamMin = tumHizmetler.reduce((a,h) => a+h.fiyat, 0);
  const toplamMax = Math.round(toplamMin * 1.3);
  const kampanya = tumHizmetler.length >= 3;
  const indirimliMin = kampanya ? Math.round(toplamMin * 0.8) : toplamMin;
  const indirimliMax = kampanya ? Math.round(toplamMax * 0.8) : toplamMax;
  const refMin = referralValid && referralDiscount > 0 ? Math.round(indirimliMin*(1-referralDiscount/100)) : indirimliMin;
  const refMax = referralValid && referralDiscount > 0 ? Math.round(indirimliMax*(1-referralDiscount/100)) : indirimliMax;

  const checkReferral = async (code: string) => {
    if (!code.trim()) { setReferralValid(null); setReferralDiscount(0); setReferralMsg(""); return; }
    setReferralLoading(true);
    const { data, error } = await supabase.from("referral_codes").select("*").eq("code",code.toUpperCase().trim()).eq("active",true).single();
    if (error||!data) { setReferralValid(false); setReferralDiscount(0); setReferralMsg("Geçersiz referans kodu"); }
    else if (data.max_uses!==null && data.used_count>=data.max_uses) { setReferralValid(false); setReferralDiscount(0); setReferralMsg("Bu kod kullanım limitine ulaştı"); }
    else { setReferralValid(true); setReferralDiscount(data.discount_percent); setReferralMsg(`%${data.discount_percent} indirim uygulandı!`); }
    setReferralLoading(false);
  };

  const handleSubmit = async () => {
    if (!iletisim.ad) { setError("Ad Soyad alanı boş bırakılamaz."); setFieldError2("ad"); scrollTo(adRef); return; }
    if (!iletisim.telefon) { setError("Telefon numarası boş bırakılamaz."); setFieldError2("telefon"); scrollTo(telefonRef); return; }
    if (!iletisim.ilce) { setError("Lütfen ilçenizi seçin."); setFieldError2("ilce"); scrollTo(ilceRef); return; }
    if (!iletisim.adres) { setError("Adres alanı boş bırakılamaz."); setFieldError2("adres"); scrollTo(adresRef); return; }
    if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }
    setLoading(true); setError("");
    const no = generateOrderNumber();
    const { data: { session } } = await supabase.auth.getSession();
    const { error: dbError } = await supabase.from("orders").insert({
      order_number: no,
      user_id: session?.user?.id ?? null,
      brand: ayakkabiListesi.map(a => a.marka).join(", "),
      model: ayakkabiListesi.map(a => a.model === "Diğer" || a.model === "Diğer Premium" ? a.modelCustom : a.model).join(", "),
      color: ayakkabiListesi.map(a => a.renk).join(", "),
      shoe_type: ayakkabiListesi.map(a => a.tur).join(", "),
      services: ayakkabiListesi.flatMap(a => a.hizmetler),
      price: `₺${refMin} - ₺${refMax}`,
      price_choice: iletisim.tercih,
      customer_info: { ad:iletisim.ad, telefon:iletisim.telefon, ilce:iletisim.ilce, adres:iletisim.adres },
      status: iletisim.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",
      referral_code: referralValid&&iletisim.referralCode ? iletisim.referralCode.toUpperCase().trim() : null,
      referral_discount: referralValid ? referralDiscount : 0,
      shoes_count: ayakkabiListesi.length,
      shoes_detail: JSON.stringify(ayakkabiListesi),
    });
    if (dbError) { setError(`Hata: ${dbError.message}`); setLoading(false); return; }
    setOrderNumber(no); setStep(3); setLoading(false);
  };

  // ── BAŞARI ──
  if (step === 3) return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{background:BG}}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 relative" style={{background:PRI}}>
          <span style={{color:MUV}}>✓</span>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{background:PRI}} />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight" style={{color:DRK}}>Sipariş Alındı!</h1>
        <p className="text-sm mb-6" style={{color:`rgba(45,26,46,0.5)`}}>
          {iletisim.tercih==="arasin" ? "En kısa sürede arayarak net teklif vereceğiz." : "Kuryemiz yakında kapınıza gelecek."}
        </p>
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
          <p className="text-xs mt-3" style={{color:`rgba(45,26,46,0.4)`}}>
            {ayakkabiListesi.length} çift · {ayakkabiListesi.filter(a=>a.kategori==="premium").length > 0 ? "Premium bakım dahil" : "Standart bakım"}
          </p>
        </div>
        <div className="flex gap-3 justify-center mt-6">
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
      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b backdrop-blur-md"
        style={{borderColor:STN, background:`rgba(245,240,232,0.97)`}}>
        <Link href="/">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{height:"44px", width:"auto"}} />
        </Link>
        <div className="flex items-center gap-2">
          {["Ayakkabılar","İletişim"].map((l,i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                style={step>i+1 ? {background:MUV, color:DRK} : step===i+1 ? {background:PRI, color:MUV} : {background:`rgba(212,197,176,0.3)`, color:`rgba(45,26,46,0.35)`}}>
                {step>i+1 ? "✓" : i+1}
              </div>
              <span className="text-[11px] hidden md:block font-medium"
                style={{color: step===i+1 ? DRK : `rgba(45,26,46,0.3)`}}>{l}</span>
              {i<1 && <div className="w-8 h-px mx-1 hidden md:block" style={{background: step>i+1 ? MUV : STN}} />}
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── ADIM 1: Ayakkabılar ── */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{background:`rgba(91,45,110,0.08)`, color:PRI}}>
                Adım 1 / 2
              </div>
              <h1 className="text-3xl font-black tracking-tight" style={{color:DRK}}>
                Ayakkabı <span style={{color:PRI}}>bilgileri</span>
              </h1>
              <p className="text-sm mt-1" style={{color:`rgba(45,26,46,0.45)`}}>
                Birden fazla çift ekleyebilirsiniz.
              </p>
            </div>

            {ayakkabiListesi.map((a, i) => (
              <div key={i} ref={el => { kartRefs.current[i] = el; }}>
              <AyakkabiKarti
                idx={i}
                data={a}
                onChange={(d) => { updateAyakkabi(i, d); setKartError(null); }}
                onRemove={() => removeAyakkabi(i)}
                canRemove={ayakkabiListesi.length > 1}
                fieldError={kartError?.idx === i ? kartError.field : undefined}
                fieldRef={kartError?.idx === i ? fieldScrollRef : undefined}
              />
            </div>
            ))}

            <button onClick={addAyakkabi}
              className="w-full py-4 rounded-2xl border-2 border-dashed text-sm font-bold transition-all mb-6 flex items-center justify-center gap-2"
              style={{borderColor: MUV, color: PRI, background:`rgba(91,45,110,0.03)`}}>
              <span className="text-lg leading-none">+</span>
              Ayakkabı Ekle
            </button>

            {/* Toplam özet */}
            {toplamMin > 0 && (
              <div className="p-4 rounded-2xl mb-6" style={{background:`rgba(91,45,110,0.06)`, border:`2px solid ${PRI}`}}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold" style={{color:`rgba(45,26,46,0.5)`}}>
                      {ayakkabiListesi.length} çift · {tumHizmetler.length} hizmet
                      {ayakkabiListesi.some(a=>a.kategori==="premium") && " · ✦ Premium"}
                    </p>
                    {kampanya && <p className="text-xs font-bold mt-0.5" style={{color:PRI}}>🎉 3+ hizmet — %20 indirim!</p>}
                  </div>
                  <p className="text-xl font-black" style={{color:PRI}}>₺{indirimliMin.toLocaleString()} — ₺{indirimliMax.toLocaleString()}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"
                style={{background:"rgba(107,39,55,0.08)", border:"2px solid rgba(107,39,55,0.4)"}}>
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm font-bold" style={{color:"rgba(107,39,55,1)"}}>{error}</p>
              </div>
            )}

            <button onClick={() => {
              let eksikIdx = -1;
              let eksikField = "";
              for (let i = 0; i < ayakkabiListesi.length; i++) {
                const a = ayakkabiListesi[i];
                if (!a.marka) { eksikIdx = i; eksikField = "marka"; break; }
                if (!a.renk)  { eksikIdx = i; eksikField = "renk";  break; }
                if (!a.tur)   { eksikIdx = i; eksikField = "tur";   break; }
                if (a.hizmetler.length === 0) { eksikIdx = i; eksikField = "hizmet"; break; }
              }
              if (eksikIdx >= 0) {
                const alan = eksikField === "marka" ? "Marka" : eksikField === "renk" ? "Renk" : eksikField === "tur" ? "Tür" : "Hizmet";
                setError(`Ayakkabı ${eksikIdx+1}: ${alan} seçilmedi.`);
                setKartError({ idx: eksikIdx, field: eksikField });
                setTimeout(() => { fieldScrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150);
                return;
              }
              setKartError(null);
              setError(""); setStep(2); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
            }}
              className="w-full py-5 text-base font-bold rounded-full hover:opacity-90 transition-all"
              style={{...btnPri, boxShadow:`0 8px 24px rgba(91,45,110,0.3)`}}>
              Devam Et →
            </button>
          </div>
        )}

        {/* ── ADIM 2: İletişim ── */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{background:`rgba(212,197,176,0.3)`, color:DRK, border:`1px solid ${STN}`}}>
                Adım 2 / 2
              </div>
              <h1 className="text-3xl font-black tracking-tight" style={{color:DRK}}>
                İletişim <span style={{color:PRI}}>bilgileri</span>
              </h1>
            </div>

            <div className="space-y-4">
              {!loggedInUser && fieldError === "ad" && (
                <p className="text-xs font-bold mb-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Ad Soyad alanı boş bırakılamaz.</p>
              )}
              {loggedInUser ? (
                <div className="p-4 rounded-2xl flex items-center gap-3" style={{background:`rgba(91,45,110,0.06)`, border:`1.5px solid rgba(91,45,110,0.2)`}}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0" style={{background:PRI, color:MUV}}>
                    {loggedInUser.ad ? loggedInUser.ad.charAt(0).toUpperCase() : loggedInUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{color:DRK}}>{loggedInUser.ad || loggedInUser.email}</p>
                    <p className="text-xs" style={{color:`rgba(45,26,46,0.45)`}}>{loggedInUser.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>Ad Soyad *</label>
                    <input value={iletisim.ad} onChange={e => { setIletisim(f=>({...f,ad:e.target.value})); setFieldError2(""); }}
                      ref={adRef} className={inputCls} placeholder="Ad Soyad" style={{borderColor: fieldError2==="ad" ? "rgba(107,39,55,0.6)" : STN, color:DRK}} />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>Telefon *</label>
                    <input value={iletisim.telefon} onChange={e => { setIletisim(f=>({...f,telefon:e.target.value})); setFieldError2(""); }}
                      ref={telefonRef} className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor: fieldError2==="telefon" ? "rgba(107,39,55,0.6)" : STN, color:DRK}} />
                <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Telefon numarası boş bırakılamaz.</p>
                  </div>
                </>
              )}
              <div>
                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>İlçe *</label>
                <div ref={ilceRef} className="flex flex-wrap gap-2">
                  {ILCELER.map(ilce => (
                    <button key={ilce} onClick={() => setIletisim(f=>({...f,ilce}))}
                      className="px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all"
                      style={iletisim.ilce===ilce ? btnSel : btnDef}>{ilce}</button>
                  ))}
                </div>
                {fieldError2==="ilce" && <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen ilçenizi seçin.</p>}
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>Adres *</label>
                <textarea ref={adresRef} value={iletisim.adres} onChange={e => { setIletisim(f=>({...f,adres:e.target.value})); setFieldError2(""); }}
                  className={inputCls+" h-24 resize-none"} placeholder="Mahalle, sokak, bina no, daire..."
                  style={{borderColor:STN, color:DRK}} />
                {fieldError2==="adres" && <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Adres alanı boş bırakılamaz.</p>}
              </div>

              {/* Referans kodu */}
              <div>
                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>
                  Referans Kodu <span className="normal-case font-normal" style={{color:`rgba(45,26,46,0.3)`}}>(isteğe bağlı)</span>
                </label>
                <div className="flex gap-2">
                  <input value={iletisim.referralCode}
                    onChange={e => { const v=e.target.value.toUpperCase(); setIletisim(f=>({...f,referralCode:v})); setReferralValid(null); setReferralDiscount(0); setReferralMsg(""); }}
                    className={inputCls + " flex-1"} placeholder="Örn: KAPIDA15"
                    style={{borderColor: referralValid===true ? PRI : referralValid===false ? `rgba(107,39,55,0.6)` : STN, color:DRK}} />
                  <button onClick={() => checkReferral(iletisim.referralCode)} disabled={referralLoading||!iletisim.referralCode.trim()}
                    className="px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all disabled:opacity-40"
                    style={{borderColor:PRI, color:PRI, background:`rgba(91,45,110,0.06)`}}>
                    {referralLoading ? "..." : "Uygula"}
                  </button>
                </div>
                {referralMsg && <p className="text-xs mt-2 font-semibold" style={{color: referralValid ? PRI : `rgba(107,39,55,0.8)`}}>{referralMsg}</p>}
              </div>
            </div>

            {/* Sipariş özeti */}
            <div className="rounded-2xl p-5 my-6" style={{background:"#fff", border:`1.5px solid ${STN}`}}>
              <p className="text-[10px] uppercase tracking-widest mb-3 font-bold" style={{color:`rgba(45,26,46,0.3)`}}>Sipariş Özeti</p>
              {ayakkabiListesi.map((a, i) => (
                <div key={i} className="mb-3 pb-3" style={{borderBottom: i < ayakkabiListesi.length-1 ? `1px solid ${STN}` : "none"}}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold" style={{color:DRK}}>
                      {i+1}. {a.marka} {a.model === "Diğer" || a.model === "Diğer Premium" ? a.modelCustom : a.model}
                    </p>
                    {a.kategori === "premium" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{background:`rgba(91,45,110,0.1)`, color:PRI}}>✦ Premium</span>
                    )}
                  </div>
                  {HIZMETLER.filter(h => a.hizmetler.includes(h.id)).map(h => (
                    <div key={h.id} className="flex justify-between text-xs py-0.5">
                      <span style={{color:`rgba(45,26,46,0.5)`}}>{h.label}</span>
                      <span style={{color:`rgba(45,26,46,0.4)`}}>₺{h.fiyat}+</span>
                    </div>
                  ))}
                  {a.not && (
                    <p className="text-xs mt-1 italic" style={{color:`rgba(45,26,46,0.45)`}}>Not: {a.not}</p>
                  )}
                </div>
              ))}
              {kampanya && (
                <div className="flex justify-between text-xs py-1 font-bold" style={{color:PRI}}>
                  <span>✦ 3+ hizmet indirimi</span><span>-%20</span>
                </div>
              )}
              {referralValid && referralDiscount > 0 && (
                <div className="flex justify-between text-xs py-1 font-bold" style={{color:MUV}}>
                  <span>🎁 Referans ({iletisim.referralCode})</span><span>-%{referralDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-black mt-3 pt-3 text-base" style={{borderTop:`2px solid ${STN}`}}>
                <span style={{color:DRK}}>Toplam</span>
                <span style={{color:PRI}}>₺{refMin.toLocaleString()} — ₺{refMax.toLocaleString()}</span>
              </div>
            </div>

            {/* Tercih */}
            <div ref={tercihRef} className="space-y-3 mb-6">
              {[
                {val:"onayla", icon:"🚗", title:"Fiyat uygun — kurye gönder", sub:"Kuryemiz en kısa sürede kapınıza gelir"},
                {val:"arasin", icon:"📞", title:"Net fiyat almak istiyorum",  sub:"Sizi arayarak kesin fiyat bildireceğiz"},
              ].map(opt => (
                <button key={opt.val} onClick={() => setIletisim(f=>({...f,tercih:opt.val as "arasin"|"onayla"}))}
                  className="w-full flex gap-4 p-4 border-2 rounded-2xl transition-all text-left items-center"
                  style={iletisim.tercih===opt.val ? {borderColor:PRI, background:`rgba(91,45,110,0.05)`} : {borderColor:STN, background:"#fff"}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={iletisim.tercih===opt.val ? {background:PRI} : {background:`rgba(212,197,176,0.25)`}}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{color:DRK}}>{opt.title}</p>
                    <p className="text-xs mt-0.5" style={{color:`rgba(45,26,46,0.45)`}}>{opt.sub}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={iletisim.tercih===opt.val ? {borderColor:PRI, background:PRI} : {borderColor:STN}}>
                    {iletisim.tercih===opt.val && <span className="w-2 h-2 rounded-full block" style={{background:MUV}} />}
                  </div>
                </button>
              ))}
            </div>
            {fieldError2==="tercih" && <p className="text-xs font-bold mb-4 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen sipariş tercihinizi seçin.</p>}

            {error && (
              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"
                style={{background:"rgba(107,39,55,0.08)", border:"2px solid rgba(107,39,55,0.4)"}}>
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm font-bold" style={{color:"rgba(107,39,55,1)"}}>{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border-2 py-4 text-sm font-semibold rounded-full transition-all"
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
