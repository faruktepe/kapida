"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PRI = "#5B2D6E";
const MUV = "#BFA5B8";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";

const inputCls = `w-full border-2 bg-white px-4 py-3.5 text-sm focus:outline-none transition-all rounded-xl appearance-none`;

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/siparis";

  const [mod, setMod] = useState<"giris" | "kayit" | "sifre">("giris");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirect);
    });
  }, []);

  const handleGiris = async () => {
    if (!email || !sifre) { setError("E-posta ve şifre gerekli."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: sifre });
    if (err) { setError(err.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : err.message); setLoading(false); return; }
    router.replace(redirect);
  };

  const handleKayit = async () => {
    if (!ad || !email || !sifre || !telefon) { setError("Tüm alanları doldurun."); return; }
    if (sifre.length < 6) { setError("Şifre en az 6 karakter olmalı."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signUp({
      email,
      password: sifre,
      options: { data: { full_name: ad, phone: telefon } },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess("Hesabınız oluşturuldu! E-postanızı onaylayın ve giriş yapın.");
    setLoading(false);
    setMod("giris");
  };

  const handleSifreSifirla = async () => {
    if (!email) { setError("E-posta adresinizi girin."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex" style={{ background: BG }}>

      {/* ── SOL: Görsel panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/auth-bg.png"
          alt="Temiz Gelsin"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Üstüne hafif gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(45,26,46,0.35) 0%, transparent 60%)" }} />

      </div>

      {/* ── SAĞ: Form paneli ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobilde logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin"
                style={{ height: "44px", width: "auto", margin: "0 auto" }} />
            </Link>
          </div>

          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: DRK }}>
              {mod === "giris" && "Hoşgeldin! 👋"}
              {mod === "kayit" && "Hesap Oluştur"}
              {mod === "sifre" && "Şifremi Unuttum"}
            </h1>
            <p className="text-sm mt-2" style={{ color: `rgba(45,26,46,0.5)` }}>
              {mod === "giris" && "E-posta ve şifrenle güvenli giriş yapabilirsin."}
              {mod === "kayit" && "Saniyeler içinde hesabını oluştur, siparişini ver."}
              {mod === "sifre" && "E-postana sıfırlama bağlantısı göndereceğiz."}
            </p>
          </div>

          {/* Tab: Giriş / Kayıt */}
          {mod !== "sifre" && (
            <div className="flex rounded-xl overflow-hidden mb-6 p-1" style={{ background: `rgba(212,197,176,0.3)` }}>
              {(["giris", "kayit"] as const).map((m) => (
                <button key={m} onClick={() => { setMod(m); setError(""); setSuccess(""); }}
                  className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all"
                  style={mod === m
                    ? { background: PRI, color: MUV, boxShadow: "0 2px 8px rgba(91,45,110,0.25)" }
                    : { color: `rgba(45,26,46,0.45)` }}>
                  {m === "giris" ? "Giriş Yap" : "Kayıt Ol"}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">

            {mod === "kayit" && (
              <>
                <div>
                  <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>Ad Soyad</label>
                  <input value={ad} onChange={e => setAd(e.target.value)}
                    className={inputCls} placeholder="Ad Soyad"
                    style={{ borderColor: STN, color: DRK }} />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>Telefon</label>
                  <input value={telefon} onChange={e => setTelefon(e.target.value)}
                    className={inputCls} placeholder="05XX XXX XX XX" type="tel"
                    style={{ borderColor: STN, color: DRK }} />
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>E-posta</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className={inputCls} placeholder="ornek@email.com" type="email"
                style={{ borderColor: STN, color: DRK }} />
            </div>

            {mod !== "sifre" && (
              <div>
                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{ color: DRK }}>Şifre</label>
                <input value={sifre} onChange={e => setSifre(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && mod === "giris" && handleGiris()}
                  className={inputCls} placeholder={mod === "kayit" ? "En az 6 karakter" : "••••••••"} type="password"
                  style={{ borderColor: STN, color: DRK }} />
                {mod === "giris" && (
                  <button onClick={() => { setMod("sifre"); setError(""); setSuccess(""); }}
                    className="text-xs mt-2 font-medium hover:opacity-70 transition-opacity"
                    style={{ color: PRI }}>
                    Şifremi unuttum →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hata / Başarı */}
          {error && (
            <div className="mt-4 p-3 rounded-xl text-sm font-medium"
              style={{ background: `rgba(107,39,55,0.06)`, border: `1px solid rgba(107,39,55,0.2)`, color: `rgba(107,39,55,0.9)` }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 rounded-xl text-sm font-medium"
              style={{ background: `rgba(91,45,110,0.06)`, border: `1px solid rgba(91,45,110,0.2)`, color: PRI }}>
              {success}
            </div>
          )}

          {/* Ana buton */}
          <button
            onClick={mod === "giris" ? handleGiris : mod === "kayit" ? handleKayit : handleSifreSifirla}
            disabled={loading}
            className="w-full mt-6 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: PRI, color: MUV, boxShadow: "0 8px 24px rgba(91,45,110,0.25)" }}>
            {loading ? "Yükleniyor..." : mod === "giris" ? "Giriş Yap →" : mod === "kayit" ? "Hesap Oluştur →" : "Bağlantı Gönder →"}
          </button>

          {/* Şifre modunda geri butonu */}
          {mod === "sifre" && (
            <button onClick={() => { setMod("giris"); setError(""); setSuccess(""); }}
              className="w-full mt-3 py-3 text-sm font-medium rounded-full transition-all"
              style={{ border: `2px solid ${STN}`, color: `rgba(45,26,46,0.5)` }}>
              ← Giriş sayfasına dön
            </button>
          )}

          {/* Alt bilgi */}
          <p className="text-center text-xs mt-8" style={{ color: `rgba(45,26,46,0.3)` }}>
            Devam ederek{" "}
            <Link href="/sss" className="underline hover:opacity-70">kullanım şartlarını</Link>
            {" "}kabul etmiş olursunuz.
          </p>

          {/* Ana sayfaya dön */}
          <div className="text-center mt-4">
            <Link href="/" className="text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: `rgba(45,26,46,0.4)` }}>
              ← Ana sayfaya dön
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

import { Suspense } from "react";
export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"#F5F0E8"}} />}>
      <AuthContent />
    </Suspense>
  );
}
