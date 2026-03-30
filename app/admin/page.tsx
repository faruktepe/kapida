"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DURUMLAR = ["Teklif Bekleniyor","Onaylandı","Kuryede","İşlemde","Tamamlandı","Teslim Edildi"];
const KATEGORILER = [
  { id: "sneaker", label: "Sneaker" },
  { id: "deri", label: "Deri Bot" },
  { id: "suet", label: "Süet" },
  { id: "spor", label: "Spor" },
  { id: "klasik", label: "Klasik" },
  { id: "diger", label: "Diğer" },
];

type ReferralCode = {
  id: string; code: string; discount_percent: number;
  max_uses: number | null; used_count: number; active: boolean; created_at: string;
};

type ReferralCode = {
  id: string; code: string; discount_percent: number;
  max_uses: number | null; used_count: number; active: boolean; created_at: string;
};

type GalleryItem = {
  id: string; title: string; category: string; service: string;
  district: string; before_url: string | null; after_url: string | null;
  active: boolean; created_at: string;
};


function ReferralTab() {
  const [codes, setCodes] = React.useState<ReferralCode[]>([]);
  const [form, setForm] = React.useState({ code: "", discount_percent: "10", max_uses: "" });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const fetchCodes = async () => { setLoading(true); const { data } = await supabase.from("referral_codes").select("*").order("created_at", { ascending: false }); setCodes(data ?? []); setLoading(false); };
  React.useEffect(() => { fetchCodes(); }, []);
  const handleCreate = async () => {
    const code = form.code.toUpperCase().trim();
    if (!code) { setError("Kod zorunlu."); return; }
    const discount = parseInt(form.discount_percent);
    if (!discount || discount < 1 || discount > 100) { setError("\u0130ndirim 1-100 aras\u0131 olmal\u0131."); return; }
    setSaving(true); setError("");
    const { error: dbError } = await supabase.from("referral_codes").insert({ code, discount_percent: discount, max_uses: form.max_uses ? parseInt(form.max_uses) : null, used_count: 0, active: true });
    if (dbError) { setError(dbError.code === "23505" ? "Bu kod zaten mevcut." : "Hata: " + dbError.message); }
    else { setForm({ code: "", discount_percent: "10", max_uses: "" }); fetchCodes(); }
    setSaving(false);
  };
  const toggleActive = async (id: string, current: boolean) => { await supabase.from("referral_codes").update({ active: !current }).eq("id", id); setCodes(c => c.map(r => r.id === id ? { ...r, active: !current } : r)); };
  const deleteCode = async (id: string, code: string) => { if (!confirm(`"${code}" kodunu silmek istedi\u011finizden emin misiniz?`)) return; await supabase.from("referral_codes").delete().eq("id", id); setCodes(c => c.filter(r => r.id !== id)); };
  const inp = "border border-black/15 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors";
  return (
    <div>
      <div className="bg-white border border-stone-200 p-6 mb-8">
        <h2 className="font-bold mb-6">Yeni Referans Kodu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Kod *</label><input value={form.code} onChange={e => setForm(v => ({ ...v, code: e.target.value.toUpperCase() }))} className={`w-full ${inp} font-mono`} placeholder="AHMET10" /></div>
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">\u0130ndirim (%) *</label><input type="number" min="1" max="100" value={form.discount_percent} onChange={e => setForm(v => ({ ...v, discount_percent: e.target.value }))} className={`w-full ${inp}`} /></div>
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Maks. Kullan\u0131m</label><input type="number" min="1" value={form.max_uses} onChange={e => setForm(v => ({ ...v, max_uses: e.target.value }))} className={`w-full ${inp}`} placeholder="S\u0131n\u0131rs\u0131z" /></div>
        </div>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <button onClick={handleCreate} disabled={saving} className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-50">{saving ? "Kaydediliyor..." : "Olu\u015ftur"}</button>
      </div>
      <div>
        <h2 className="font-bold mb-4">Mevcut Kodlar <span className="text-xs font-normal text-black/40">({codes.length})</span></h2>
        {loading ? <p className="text-center text-black/40 py-10">Y\u00fckleniyor...</p> : codes.length === 0 ? <p className="text-black/30 text-sm py-10 text-center">Hen\u00fcz kod olu\u015fturulmad\u0131.</p> : (
          <div className="bg-white border border-stone-200 overflow-hidden"><table className="w-full text-sm">
            <thead><tr className="border-b border-stone-100"><th className="text-left text-[10px] uppercase tracking-wider text-black/40 px-4 py-3 font-normal">Kod</th><th className="text-left text-[10px] uppercase tracking-wider text-black/40 px-4 py-3 font-normal">\u0130ndirim</th><th className="text-left text-[10px] uppercase tracking-wider text-black/40 px-4 py-3 font-normal">Kullan\u0131m</th><th className="text-left text-[10px] uppercase tracking-wider text-black/40 px-4 py-3 font-normal">Durum</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{codes.map((r, i) => (<tr key={r.id} className={`border-b border-stone-100 last:border-0 ${!r.active ? "opacity-40" : ""} ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}><td className="px-4 py-3 font-mono font-bold">{r.code}</td><td className="px-4 py-3">%{r.discount_percent}</td><td className="px-4 py-3"><span className="font-medium">{r.used_count}</span><span className="text-black/30"> / {r.max_uses ?? "\u221e"}</span></td><td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 border ${r.active ? "border-green-200 text-green-700 bg-green-50" : "border-black/10 text-black/30"}`}>{r.active ? "Aktif" : "Pasif"}</span></td><td className="px-4 py-3"><div className="flex gap-2 justify-end"><button onClick={() => toggleActive(r.id, r.active)} className="text-xs px-3 py-1.5 border border-black/20 hover:border-black text-black/50 hover:text-black transition-colors">{r.active ? "Durdur" : "Aktif Et"}</button><button onClick={() => deleteCode(r.id, r.code)} className="text-xs px-3 py-1.5 border border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 transition-colors">Sil</button></div></td></tr>))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}


function ReferralTab() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [form, setForm] = useState({ code: "", discount_percent: "10", max_uses: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fetchCodes = async () => { setLoading(true); const { data } = await supabase.from("referral_codes").select("*").order("created_at", { ascending: false }); setCodes(data ?? []); setLoading(false); };
  useEffect(() => { fetchCodes(); }, []);
  const handleCreate = async () => {
    const code = form.code.toUpperCase().trim();
    if (!code) { setError("Kod zorunlu."); return; }
    const discount = parseInt(form.discount_percent);
    if (!discount || discount < 1 || discount > 100) { setError("Indirim 1-100 olmali."); return; }
    setSaving(true); setError("");
    const { error: dbError } = await supabase.from("referral_codes").insert({ code, discount_percent: discount, max_uses: form.max_uses ? parseInt(form.max_uses) : null, used_count: 0, active: true });
    if (dbError) { setError(dbError.code === "23505" ? "Bu kod zaten mevcut." : "Hata: " + dbError.message); }
    else { setForm({ code: "", discount_percent: "10", max_uses: "" }); fetchCodes(); }
    setSaving(false);
  };
  const toggleActive = async (id: string, current: boolean) => { await supabase.from("referral_codes").update({ active: !current }).eq("id", id); setCodes(c => c.map(r => r.id === id ? { ...r, active: !current } : r)); };
  const deleteCode = async (id: string, code: string) => { if (!confirm(code + " silinsin mi?")) return; await supabase.from("referral_codes").delete().eq("id", id); setCodes(c => c.filter(r => r.id !== id)); };
  const inp = "border border-black/15 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors";
  return (
    <div>
      <div className="bg-white border border-stone-200 p-6 mb-8">
        <h2 className="font-bold mb-6">Yeni Referans Kodu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Kod *</label><input value={form.code} onChange={e => setForm(v => ({ ...v, code: e.target.value.toUpperCase() }))} className={"w-full " + inp + " font-mono"} placeholder="AHMET10" /></div>
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Indirim (%) *</label><input type="number" min="1" max="100" value={form.discount_percent} onChange={e => setForm(v => ({ ...v, discount_percent: e.target.value }))} className={"w-full " + inp} /></div>
          <div><label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Maks. Kullanim</label><input type="number" min="1" value={form.max_uses} onChange={e => setForm(v => ({ ...v, max_uses: e.target.value }))} className={"w-full " + inp} placeholder="Sinirsis" /></div>
        </div>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <button onClick={handleCreate} disabled={saving} className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-50">{saving ? "Kaydediliyor..." : "Olustur"}</button>
      </div>
      <div>
        <h2 className="font-bold mb-4">Mevcut Kodlar ({codes.length})</h2>
        {loading ? <p className="text-center py-10 text-black/40">Yukleniyor...</p> : codes.length === 0 ? <p className="text-center py-10 text-black/30 text-sm">Henuz kod olusturulmadi.</p> : (
          <div className="bg-white border border-stone-200 overflow-hidden"><table className="w-full text-sm">
            <thead><tr className="border-b border-stone-100"><th className="text-left text-[10px] px-4 py-3 font-normal text-black/40">KOD</th><th className="text-left text-[10px] px-4 py-3 font-normal text-black/40">INDIRIM</th><th className="text-left text-[10px] px-4 py-3 font-normal text-black/40">KULLANIM</th><th className="text-left text-[10px] px-4 py-3 font-normal text-black/40">DURUM</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{codes.map((r, i) => (<tr key={r.id} className={"border-b border-stone-100 last:border-0 " + (!r.active ? "opacity-40" : "") + (i % 2 !== 0 ? " bg-stone-50/50" : "")}><td className="px-4 py-3 font-mono font-bold">{r.code}</td><td className="px-4 py-3">%{r.discount_percent}</td><td className="px-4 py-3">{r.used_count} / {r.max_uses ?? "sinirsiz"}</td><td className="px-4 py-3"><span className={"text-xs px-2 py-0.5 border " + (r.active ? "border-green-200 text-green-700 bg-green-50" : "border-black/10 text-black/30")}>{r.active ? "Aktif" : "Pasif"}</span></td><td className="px-4 py-3"><div className="flex gap-2 justify-end"><button onClick={() => toggleActive(r.id, r.active)} className="text-xs px-3 py-1.5 border border-black/20 hover:border-black text-black/50 hover:text-black">{r.active ? "Durdur" : "Aktif Et"}</button><button onClick={() => deleteCode(r.id, r.code)} className="text-xs px-3 py-1.5 border border-red-200 text-red-400 hover:border-red-500 hover:text-red-600">Sil</button></div></td></tr>))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

function GalleryUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ title: "", category: "sneaker", service: "", district: "" });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "before") { setBeforeFile(file); setBeforePreview(preview); }
    else { setAfterFile(file); setAfterPreview(preview); }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage.from("gallery-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.service) { setError("Başlık ve hizmet zorunlu."); return; }
    setLoading(true); setError("");
    try {
      const ts = Date.now();
      let beforeUrl: string | null = null;
      let afterUrl: string | null = null;
      if (beforeFile) beforeUrl = await uploadImage(beforeFile, `before/${ts}_${beforeFile.name}`);
      if (afterFile) afterUrl = await uploadImage(afterFile, `after/${ts}_${afterFile.name}`);
      const { error: dbError } = await supabase.from("gallery").insert({
        title: form.title, category: form.category, service: form.service,
        district: form.district, before_url: beforeUrl, after_url: afterUrl, active: true,
      });
      if (dbError) throw dbError;
      setForm({ title: "", category: "sneaker", service: "", district: "" });
      setBeforeFile(null); setAfterFile(null); setBeforePreview(null); setAfterPreview(null);
      onSuccess();
    } catch (err: unknown) { setError("Hata: " + (err as Error).message); }
    setLoading(false);
  };

  const inp = "w-full border border-black/15 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors";
  return (
    <div className="bg-white border border-stone-200 p-6">
      <h2 className="font-bold mb-6">Yeni Fotoğraf Ekle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Başlık *", key: "title", placeholder: "Nike Air Force 1 — Beyaz" },
          { label: "Hizmet *", key: "service", placeholder: "Temizlik & Bakım" },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">{f.label}</label>
            <input value={form[f.key as "title" | "service"]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} className={inp} placeholder={f.placeholder} />
          </div>
        ))}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">Kategori</label>
          <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))} className={inp}>
            {KATEGORILER.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">İlçe</label>
          <input value={form.district} onChange={e => setForm(v => ({ ...v, district: e.target.value }))} className={inp} placeholder="Kadıköy" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {(["before", "after"] as const).map(type => {
          const preview = type === "before" ? beforePreview : afterPreview;
          const label = type === "before" ? "Önce Fotoğrafı" : "Sonra Fotoğrafı";
          return (
            <div key={type}>
              <label className="text-[10px] uppercase tracking-wider text-black/40 block mb-1.5">{label}</label>
              <label className="block cursor-pointer">
                <div className="border border-dashed border-black/20 h-36 flex items-center justify-center overflow-hidden hover:border-black/40 transition-colors">
                  {preview ? <img src={preview} alt={label} className="w-full h-full object-cover" /> : (
                    <div className="text-center text-black/25"><p className="text-2xl mb-1">+</p><p className="text-[10px] uppercase tracking-wider">Yükle</p></div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, type)} />
              </label>
            </div>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
      <button onClick={handleSubmit} disabled={loading} className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-50 transition-colors">
        {loading ? "Yükleniyor..." : "Kaydet"}
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [giris, setGiris] = useState<boolean | null>(null);
  const [sifre, setSifre] = useState("");
  const [sifreHata, setSifreHata] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Tümü");
  const [tab, setTab] = useState<"siparisler" | "galeri" | "referanslar">("siparisler");

  useEffect(() => {
    fetch("/api/admin/auth")
      .then(r => r.json())
      .then(({ authenticated }) => {
        setGiris(authenticated);
        if (authenticated) { fetchOrders(); fetchGallery(); }
      })
      .catch(() => setGiris(false));
  }, []);

  const handleGiris = async () => {
    setLoginLoading(true);
    setSifreHata(false);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: sifre }),
      });
      if (res.ok) { setGiris(true); fetchOrders(); fetchGallery(); }
      else setSifreHata(true);
    } catch { setSifreHata(true); }
    setLoginLoading(false);
  };

  const handleCikis = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setGiris(false);
    setSifre("");
  };
  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []); setLoading(false);
  };
  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setGallery(data ?? []);
  };
  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(o => o.map(order => order.id === id ? { ...order, status } : order));
  };
  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("gallery").update({ active: !current }).eq("id", id);
    setGallery(g => g.map(item => item.id === id ? { ...item, active: !current } : item));
  };
  const deleteItem = async (id: string) => {
    if (!confirm("Silmek istediğinizden emin misiniz?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    setGallery(g => g.filter(item => item.id !== id));
  };

  const filtered = filter === "Tümü" ? orders : orders.filter(o => o.status === filter);

  if (giris === null) return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </main>
  );

  if (!giris) return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-10 max-w-sm w-full mx-4">
        <h1 className="text-2xl font-bold mb-2">Temiz Gelsin Admin</h1>
        <p className="text-black/40 text-sm mb-6">Yönetici girişi yapın.</p>
        <input type="password" value={sifre} onChange={e => { setSifre(e.target.value); setSifreHata(false); }}
          onKeyDown={e => e.key === "Enter" && handleGiris()}
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black mb-3" placeholder="Şifre" autoFocus />
        {sifreHata && <p className="text-red-500 text-xs mb-3">Hatalı şifre.</p>}
        <button onClick={handleGiris} disabled={loginLoading} className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-black/80 disabled:opacity-50">{loginLoading ? "Kontrol ediliyor..." : "Giriş Yap"}</button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="font-bold">Temiz Gelsin Admin</h1>
          <div className="flex gap-1">
            {(["siparisler", "galeri", "referanslar"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${tab === t ? "bg-white text-black" : "text-white/50 hover:text-white"}`}>
                {t === "siparisler" ? "Siparişler" : t === "galeri" ? "Galeri" : "Referans Kodları"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { fetchOrders(); fetchGallery(); }} className="text-sm text-white/60 hover:text-white">↻ Yenile</button>
          <button onClick={handleCikis} className="text-sm text-white/60 hover:text-white">Çıkış</button>
        </div>
      </header>

      <div className="px-6 py-6">
        {tab === "siparisler" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {["Tümü", "Teklif Bekleniyor", "İşlemde", "Teslim Edildi"].map(s => (
                <div key={s} className="bg-white border border-stone-200 p-4">
                  <p className="text-2xl font-bold">{s === "Tümü" ? orders.length : orders.filter(o => o.status === s).length}</p>
                  <p className="text-xs text-black/40 mt-1">{s}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {["Tümü", ...DURUMLAR].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-4 py-2 text-xs font-medium border transition-colors ${filter === s ? "bg-black text-white border-black" : "border-black/20 hover:border-black"}`}>
                  {s}
                </button>
              ))}
            </div>
            {loading ? <p className="text-center text-black/40 py-20">Yükleniyor...</p>
              : filtered.length === 0 ? <p className="text-center text-black/40 py-20">Sipariş bulunamadı.</p>
              : (
                <div className="space-y-4">
                  {filtered.map(order => {
                    const info = typeof order.customer_info === "object" ? order.customer_info as Record<string, string> : JSON.parse(order.customer_info as string);
                    const hizmetler = Array.isArray(order.services) ? order.services : JSON.parse(order.services as string);
                    const tarih = new Date(order.created_at as string).toLocaleDateString("tr-TR");
                    return (
                      <div key={order.id as string} className="bg-white border border-stone-200 p-6">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <p className="font-mono font-bold text-sm">{order.order_number as string}</p>
                            <p className="text-xs text-black/40 mt-1">{tarih}</p>
                          </div>
                          <select value={order.status as string} onChange={e => updateStatus(order.id as string, e.target.value)}
                            className="border border-black/20 text-xs p-2 focus:outline-none focus:border-black">
                            {DURUMLAR.map(d => <option key={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div><p className="text-xs text-black/40 mb-1">Müşteri</p><p className="font-medium">{info.ad}</p></div>
                          <div><p className="text-xs text-black/40 mb-1">Telefon</p><p>{info.telefon}</p></div>
                          <div><p className="text-xs text-black/40 mb-1">İlçe</p><p>{info.ilce}</p></div>
                          <div><p className="text-xs text-black/40 mb-1">Fiyat</p><p className="font-bold">{order.price as string}</p></div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-black/40 mb-2">Ayakkabı & Hizmetler</p>
                          <p className="text-sm">{order.brand as string}{order.model ? ` — ${order.model}` : ""} · {order.color as string} · {order.shoe_type as string}</p>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {hizmetler.map((h: string) => <span key={h} className="text-xs border border-black/20 px-2 py-1">{h}</span>)}
                          </div>
                        </div>
                        {info.adres && <div className="mt-3 text-xs text-black/40"><span>Adres: </span>{info.adres}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
          </>
        )}

        {tab === "referanslar" && <ReferralTab />}

        {tab === "referanslar" && <ReferralTab />}

        {tab === "galeri" && (
          <>
            <GalleryUploadForm onSuccess={fetchGallery} />
            <div className="mt-8">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                Mevcut Fotoğraflar <span className="text-xs font-normal text-black/40">({gallery.length})</span>
              </h2>
              {gallery.length === 0 ? <p className="text-black/30 text-sm py-10 text-center">Henüz fotoğraf eklenmedi.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className={`bg-white border p-4 ${item.active ? "border-stone-200" : "border-black/5 opacity-50"}`}>
                      <div className="grid grid-cols-2 gap-1 h-24 mb-3">
                        {[item.before_url, item.after_url].map((url, i) => (
                          <div key={i} className="bg-stone-50 overflow-hidden">
                            {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : (
                              <div className="w-full h-full flex items-center justify-center text-black/15 text-xs">{i === 0 ? "Önce" : "Sonra"}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="font-medium text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-black/40 mb-3">{item.service}{item.district ? ` · ${item.district}` : ""}</p>
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(item.id, item.active)}
                          className={`flex-1 text-xs py-1.5 border transition-colors ${item.active ? "border-black/20 hover:border-black text-black/50 hover:text-black" : "border-black bg-black text-white hover:bg-black/80"}`}>
                          {item.active ? "Gizle" : "Yayınla"}
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="px-3 text-xs py-1.5 border border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 transition-colors">Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
