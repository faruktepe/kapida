"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, type ReactNode, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";

const DURUMLAR = [
  "Teklif Bekleniyor",
  "Onaylandı",
  "Kuryede",
  "İşlemde",
  "Tamamlandı",
  "Teslim Edildi",
] as const;

const KATEGORILER = [
  { id: "sneaker", label: "Sneaker" },
  { id: "deri", label: "Deri Bot" },
  { id: "suet", label: "Süet" },
  { id: "spor", label: "Spor" },
  { id: "klasik", label: "Klasik" },
  { id: "diger", label: "Diğer" },
] as const;

type ReferralCode = {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  created_at: string;
};

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  service: string;
  district: string;
  before_url: string | null;
  after_url: string | null;
  active: boolean;
  created_at: string;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  order_number: string;
  customer_info: unknown;
  services: unknown;
  price: string;
  brand: string;
  model?: string | null;
  color: string;
  shoe_type: string;
};

type CustomerInfo = {
  ad?: string;
  telefon?: string;
  ilce?: string;
  adres?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function parseJSON<T>(value: unknown, fallback: T): T {
  try {
    if (typeof value === "string") return JSON.parse(value) as T;
    if (typeof value === "object" && value !== null) return value as T;
    return fallback;
  } catch {
    return fallback;
  }
}

function formatDateTR(date: string) {
  try {
    return new Date(date).toLocaleDateString("tr-TR");
  } catch {
    return "-";
  }
}

function StatCard({
  title,
  value,
  subtle,
}: {
  title: string;
  value: number | string;
  subtle?: boolean;
}) {
  if (subtle) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-5 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-3xl font-semibold tracking-tight text-black">{value}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-black/45">{title}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black bg-black p-5 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.18)]">
      <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/70">{title}</p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  right,
  children,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 border-b border-stone-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black">{title}</h2>
          {description ? <p className="mt-1 text-sm text-black/45">{description}</p> : null}
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function ReferralTab() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [form, setForm] = useState({
    code: "",
    discount_percent: "10",
    max_uses: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-black";

  const fetchCodes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("referral_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async () => {
    const code = form.code.toUpperCase().trim();

    if (!code) {
      setError("Kod zorunlu.");
      return;
    }

    const discount = parseInt(form.discount_percent, 10);
    if (!discount || discount < 1 || discount > 100) {
      setError("İndirim 1-100 arasında olmalı.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase.from("referral_codes").insert({
      code,
      discount_percent: discount,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
      used_count: 0,
      active: true,
    });

    if (dbError) {
      setError(dbError.code === "23505" ? "Bu kod zaten mevcut." : `Hata: ${dbError.message}`);
    } else {
      setForm({ code: "", discount_percent: "10", max_uses: "" });
      fetchCodes();
    }

    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("referral_codes").update({ active: !current }).eq("id", id);
    setCodes((prev) => prev.map((item) => (item.id === id ? { ...item, active: !current } : item)));
  };

  const deleteCode = async (id: string, code: string) => {
    if (!confirm(`${code} silinsin mi?`)) return;
    await supabase.from("referral_codes").delete().eq("id", id);
    setCodes((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Yeni Referans Kodu" description="Yeni indirim veya kampanya kodu oluştur.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">Kod</label>
            <input
              value={form.code}
              onChange={(e) => setForm((v) => ({ ...v, code: e.target.value.toUpperCase() }))}
              className={cn(inputClass, "font-mono")}
              placeholder="AHMET10"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">İndirim (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.discount_percent}
              onChange={(e) => setForm((v) => ({ ...v, discount_percent: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">Maks. Kullanım</label>
            <input
              type="number"
              min="1"
              value={form.max_uses}
              onChange={(e) => setForm((v) => ({ ...v, max_uses: e.target.value }))}
              className={inputClass}
              placeholder="Sınırsız"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

        <div className="mt-5">
          <button
            onClick={handleCreate}
            disabled={saving}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kod Oluştur"}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title={`Mevcut Kodlar (${codes.length})`}
        description="Aktif ve pasif referans kodlarını yönet."
      >
        {loading ? (
          <p className="py-10 text-center text-black/45">Yükleniyor...</p>
        ) : codes.length === 0 ? (
          <p className="py-10 text-center text-sm text-black/35">Henüz kod oluşturulmadı.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200">
                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">Kod</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">İndirim</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">Kullanım</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">Durum</th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((r, i) => (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-b border-stone-100 last:border-b-0",
                        i % 2 !== 0 && "bg-stone-50/50",
                        !r.active && "opacity-50"
                      )}
                    >
                      <td className="px-4 py-4 font-mono font-semibold text-black">{r.code}</td>
                      <td className="px-4 py-4 text-black">%{r.discount_percent}</td>
                      <td className="px-4 py-4 text-black">{r.used_count} / {r.max_uses ?? "sınırsız"}</td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                            r.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-stone-200 bg-stone-50 text-stone-500"
                          )}
                        >
                          {r.active ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleActive(r.id, r.active)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs text-black transition hover:border-black"
                          >
                            {r.active ? "Durdur" : "Aktif Et"}
                          </button>
                          <button
                            onClick={() => deleteCode(r.id, r.code)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 transition hover:border-red-400 hover:text-red-600"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function GalleryUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    category: "sneaker",
    service: "",
    district: "",
  });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-black";

  const handleFile = (e: ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "before") {
      setBeforeFile(file);
      setBeforePreview(preview);
    } else {
      setAfterFile(file);
      setAfterPreview(preview);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage.from("gallery-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.service) {
      setError("Başlık ve hizmet zorunlu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ts = Date.now();
      let beforeUrl: string | null = null;
      let afterUrl: string | null = null;

      if (beforeFile) beforeUrl = await uploadImage(beforeFile, `before/${ts}_${beforeFile.name}`);
      if (afterFile) afterUrl = await uploadImage(afterFile, `after/${ts}_${afterFile.name}`);

      const { error: dbError } = await supabase.from("gallery").insert({
        title: form.title,
        category: form.category,
        service: form.service,
        district: form.district,
        before_url: beforeUrl,
        after_url: afterUrl,
        active: true,
      });

      if (dbError) throw dbError;

      setForm({ title: "", category: "sneaker", service: "", district: "" });
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview(null);
      setAfterPreview(null);
      onSuccess();
    } catch (err: unknown) {
      setError(`Hata: ${(err as Error).message}`);
    }

    setLoading(false);
  };

  return (
    <SectionCard title="Yeni Fotoğraf Ekle" description="Galeriye önce/sonra görselleri yükle.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">Başlık</label>
          <input
            value={form.title}
            onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
            className={inputClass}
            placeholder="Nike Air Force 1 — Beyaz"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">Hizmet</label>
          <input
            value={form.service}
            onChange={(e) => setForm((v) => ({ ...v, service: e.target.value }))}
            className={inputClass}
            placeholder="Temizlik & Bakım"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">Kategori</label>
          <select
            value={form.category}
            onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
            className={inputClass}
          >
            {KATEGORILER.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">İlçe</label>
          <input
            value={form.district}
            onChange={(e) => setForm((v) => ({ ...v, district: e.target.value }))}
            className={inputClass}
            placeholder="Kadıköy"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["before", "after"] as const).map((type) => {
          const preview = type === "before" ? beforePreview : afterPreview;
          const label = type === "before" ? "Önce Fotoğrafı" : "Sonra Fotoğrafı";

          return (
            <div key={type}>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-black/45">{label}</label>
              <label className="block cursor-pointer">
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-stone-50 transition hover:border-black/35">
                  {preview ? (
                    <img src={preview} alt={label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-black/25">
                      <p className="mb-1 text-3xl text-black/30">+</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-black/35">Görsel Yükle</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, type)} />
              </label>
            </div>
          );
        })}
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      <div className="mt-5">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50"
        >
          {loading ? "Yükleniyor..." : "Kaydet"}
        </button>
      </div>
    </SectionCard>
  );
}

export default function AdminPage() {
  const [giris, setGiris] = useState<boolean | null>(null);
  const [sifre, setSifre] = useState("");
  const [sifreHata, setSifreHata] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"siparisler" | "galeri" | "referanslar">("siparisler");

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then(({ authenticated }) => {
        setGiris(authenticated);
        if (authenticated) {
          fetchOrders();
          fetchGallery();
        }
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

      if (res.ok) {
        setGiris(true);
        fetchOrders();
        fetchGallery();
      } else {
        setSifreHata(true);
      }
    } catch {
      setSifreHata(true);
    }

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
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setGallery(data ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  const toggleGalleryItem = async (id: string, current: boolean) => {
    await supabase.from("gallery").update({ active: !current }).eq("id", id);
    setGallery((prev) => prev.map((item) => (item.id === id ? { ...item, active: !current } : item)));
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm("Silmek istediğinizden emin misiniz?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredOrders = useMemo(() => {
    const byStatus = filter === "Tümü" ? orders : orders.filter((o) => o.status === filter);
    const q = search.trim().toLowerCase();

    if (!q) return byStatus;

    return byStatus.filter((order) => {
      const info = parseJSON<CustomerInfo>(order.customer_info, {});
      const text = [
        order.order_number,
        order.brand,
        order.model ?? "",
        order.color,
        order.shoe_type,
        order.price,
        order.status,
        info.ad ?? "",
        info.telefon ?? "",
        info.ilce ?? "",
        info.adres ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [orders, filter, search]);

  if (giris === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  if (!giris) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">Temiz Gelsin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">Admin Paneli</h1>
            <p className="mt-2 text-sm text-black/45">Yönetici girişi yaparak panele erişin.</p>
          </div>

          <input
            type="password"
            value={sifre}
            onChange={(e) => {
              setSifre(e.target.value);
              setSifreHata(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleGiris()}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm text-black outline-none transition focus:border-black"
            placeholder="Şifre"
            autoFocus
          />

          {sifreHata ? <p className="mt-3 text-sm text-red-500">Hatalı şifre.</p> : null}

          <button
            onClick={handleGiris}
            disabled={loginLoading}
            className="mt-5 w-full rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50"
          >
            {loginLoading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-black">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">Temiz Gelsin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">Admin Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["siparisler", "galeri", "referanslar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  tab === t
                    ? "bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                    : "bg-black/5 text-black/55 hover:bg-black/10 hover:text-black"
                )}
              >
                {t === "siparisler" ? "Siparişler" : t === "galeri" ? "Galeri" : "Referans Kodları"}
              </button>
            ))}

            <button
              onClick={() => {
                fetchOrders();
                fetchGallery();
              }}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/65 transition hover:border-black hover:text-black"
            >
              Yenile
            </button>

            <button
              onClick={handleCikis}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/65 transition hover:border-black hover:text-black"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {tab === "siparisler" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard title="Toplam Sipariş" value={orders.length} />
              <StatCard
                title="Teklif Bekleniyor"
                value={orders.filter((o) => o.status === "Teklif Bekleniyor").length}
                subtle
              />
              <StatCard title="İşlemde" value={orders.filter((o) => o.status === "İşlemde").length} subtle />
              <StatCard
                title="Teslim Edildi"
                value={orders.filter((o) => o.status === "Teslim Edildi").length}
                subtle
              />
            </div>

            <SectionCard
              title="Sipariş Yönetimi"
              description="Siparişleri filtrele, ara ve durumlarını güncelle."
              right={
                <div className="w-full md:w-72">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Sipariş, müşteri, telefon ara..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-black"
                  />
                </div>
              }
            >
              <div className="mb-6 flex flex-wrap gap-2">
                {["Tümü", ...DURUMLAR].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-medium transition",
                      filter === s
                        ? "border-black bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
                        : "border-black/10 bg-white text-black/65 hover:border-black hover:text-black"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {loading ? (
                <p className="py-20 text-center text-black/45">Yükleniyor...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="py-20 text-center text-black/35">Sipariş bulunamadı.</p>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const info = parseJSON<CustomerInfo>(order.customer_info, {});
                    const hizmetler = parseJSON<string[]>(order.services, []);

                    return (
                      <div
                        key={order.id}
                        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-mono text-sm font-semibold text-black">{order.order_number}</p>
                            <p className="mt-1 text-xs text-black/40">{formatDateTR(order.created_at)}</p>
                          </div>

                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="rounded-xl border border-black/10 px-3 py-2 text-sm text-black outline-none transition focus:border-black"
                          >
                            {DURUMLAR.map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">Müşteri</p>
                            <p className="mt-1 text-sm font-medium text-black">{info.ad || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">Telefon</p>
                            <p className="mt-1 text-sm text-black">{info.telefon || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">İlçe</p>
                            <p className="mt-1 text-sm text-black">{info.ilce || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">Fiyat</p>
                            <p className="mt-1 text-sm font-semibold text-black">{order.price || "-"}</p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">Ayakkabı & Hizmetler</p>
                          <p className="mt-1 text-sm text-black">
                            {order.brand}
                            {order.model ? ` — ${order.model}` : ""}
                            {" · "}
                            {order.color}
                            {" · "}
                            {order.shoe_type}
                          </p>

                          {hizmetler.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {hizmetler.map((h) => (
                                <span
                                  key={h}
                                  className="rounded-full border border-black/10 bg-stone-50 px-3 py-1 text-xs text-black"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        {info.adres ? (
                          <div className="mt-4 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-black/60">
                            <span className="font-medium text-black/75">Adres:</span> {info.adres}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        ) : null}

        {tab === "referanslar" ? <ReferralTab /> : null}

        {tab === "galeri" ? (
          <div className="space-y-6">
            <GalleryUploadForm onSuccess={fetchGallery} />

            <SectionCard
              title={`Mevcut Fotoğraflar (${gallery.length})`}
              description="Yüklü galeri öğelerini yayınla, gizle veya sil."
            >
              {gallery.length === 0 ? (
                <p className="py-10 text-center text-sm text-black/35">Henüz fotoğraf eklenmedi.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "overflow-hidden rounded-3xl border bg-white p-4 transition shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
                        item.active ? "border-stone-200" : "border-black/5 opacity-55"
                      )}
                    >
                      <div className="mb-4 grid h-32 grid-cols-2 gap-2 overflow-hidden rounded-2xl">
                        {[item.before_url, item.after_url].map((url, i) => (
                          <div key={i} className="overflow-hidden rounded-2xl bg-stone-100">
                            {url ? (
                              <img src={url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-black/25">
                                {i === 0 ? "Önce" : "Sonra"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <p className="text-sm font-semibold text-black">{item.title}</p>
                      <p className="mt-1 text-xs text-black/45">
                        {item.service}
                        {item.district ? ` · ${item.district}` : ""}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => toggleGalleryItem(item.id, item.active)}
                          className={cn(
                            "flex-1 rounded-xl px-3 py-2 text-xs font-medium transition",
                            item.active
                              ? "border border-black/10 bg-white text-black/70 hover:border-black hover:text-black"
                              : "bg-black text-white hover:bg-black/85"
                          )}
                        >
                          {item.active ? "Gizle" : "Yayınla"}
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:border-red-400 hover:text-red-600"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        ) : null}
      </div>
    </main>
  );
}
