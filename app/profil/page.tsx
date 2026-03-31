"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace("/auth?redirect=/profil"); return; }
      setUser(data.session.user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single();
      if (prof) { setAd(prof.full_name || ""); setTelefon(prof.phone || ""); }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSuccess("");
    await supabase.from("profiles").upsert({ id: user.id, full_name: ad, phone: telefon });
    setSaving(false); setSuccess("Bilgileriniz kaydedildi!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: `${PRI}40`, borderTopColor: PRI }} />
    </main>
  );

  return (
    <main className="min-h-screen" style={{ background: BG }}>
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 border-b backdrop-blur-md"
        style={{ borderColor: STN, background: `rgba(245,240,232,0.97)` }}>
        <Link href="/"><img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{ height: "44px", width: "auto" }} /></Link>
        <button onClick={handleLogout} className="text-sm font-medium px-4 py-2 rounded-full border-2"
          style={{ borderColor: STN, color: `rgba(45,26,46,0.5)` }}>Çıkış Yap</button>
      </header>
      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: DRK }}>Hesabım</h1>
          <p className="text-sm mt-1" style={{ color: `rgba(45,26,46,0.45)` }}>{user?.email}</p>
        </div>
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#fff", border: `1.5px solid ${STN}` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: `rgba(45,26,46,0.4)` }}>Kişisel Bilgiler</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>Ad Soyad</label>
              <input value={ad} onChange={e => setAd(e.target.value)}
                className="w-full border-2 bg-white px-4 py-3.5 text-sm focus:outline-none rounded-xl"
                placeholder="Ad Soyad" style={{ borderColor: STN, color: DRK }} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>Telefon</label>
              <input value={telefon} onChange={e => setTelefon(e.target.value)}
                className="w-full border-2 bg-white px-4 py-3.5 text-sm focus:outline-none rounded-xl"
                placeholder="05XX XXX XX XX" style={{ borderColor: STN, color: DRK }} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>E-posta</label>
              <input value={user?.email || ""} disabled
                className="w-full border-2 px-4 py-3.5 text-sm rounded-xl"
                style={{ borderColor: STN, color: `rgba(45,26,46,0.4)`, background: `rgba(212,197,176,0.15)` }} />
            </div>
          </div>
          {success && <p className="text-sm mt-4 font-semibold" style={{ color: PRI }}>✓ {success}</p>}
          <button onClick={handleSave} disabled={saving}
            className="w-full mt-5 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: PRI, color: MUV, boxShadow: `0 8px 24px rgba(91,45,110,0.25)` }}>
            {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
          </button>
        </div>
        <Link href="/siparislerim"
          className="flex items-center justify-between w-full p-5 rounded-2xl"
          style={{ background: "#fff", border: `1.5px solid ${STN}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `rgba(91,45,110,0.08)` }}>📦</div>
            <div>
              <p className="font-bold text-sm" style={{ color: DRK }}>Siparişlerim</p>
              <p className="text-xs" style={{ color: `rgba(45,26,46,0.45)` }}>Tüm siparişlerinizi görüntüleyin</p>
            </div>
          </div>
          <span style={{ color: `rgba(45,26,46,0.3)` }}>→</span>
        </Link>
      </div>
    </main>
  );
}
