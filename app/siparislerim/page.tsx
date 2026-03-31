"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PRI = "#5B2D6E";
const STN = "#D4C5B0";
const BG  = "#F5F0E8";
const DRK = "#2D1A2E";
const MUV = "#BFA5B8";

const DURUM_RENK: Record<string, string> = {
  "Onaylandı": "#1E8449",
  "Teklif Bekleniyor": "#D4AC0D",
  "Hazırlanıyor": "#2471A3",
  "Teslim Edildi": PRI,
  "İptal": "#C0392B",
};

export default function SiparislerimPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace("/auth?redirect=/siparislerim"); return; }
      const { data: ords } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false });
      setOrders(ords || []);
      setLoading(false);
    });
  }, []);

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
        <Link href="/">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{ height: "44px", width: "auto" }} />
        </Link>
        <Link href="/profil" className="text-sm font-medium px-4 py-2 rounded-full border-2 transition-all"
          style={{ borderColor: STN, color: `rgba(45,26,46,0.5)` }}>
          ← Profilim
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: DRK }}>Siparişlerim</h1>
          <p className="text-sm mt-1" style={{ color: `rgba(45,26,46,0.45)` }}>
            {orders.length} sipariş
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👟</div>
            <p className="font-bold text-lg mb-2" style={{ color: DRK }}>Henüz sipariş yok</p>
            <p className="text-sm mb-6" style={{ color: `rgba(45,26,46,0.45)` }}>İlk siparişinizi verin!</p>
            <Link href="/siparis"
              className="px-8 py-4 text-sm font-bold rounded-full hover:opacity-90 transition-all"
              style={{ background: PRI, color: MUV }}>
              Sipariş Ver →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="rounded-2xl p-5" style={{ background: "#fff", border: `1.5px solid ${STN}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono font-black text-sm" style={{ color: PRI }}>{order.order_number}</p>
                    <p className="text-xs mt-0.5" style={{ color: `rgba(45,26,46,0.4)` }}>
                      {new Date(order.created_at).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ background: `${DURUM_RENK[order.status] || PRI}15`, color: DURUM_RENK[order.status] || PRI }}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: DRK }}>
                      {order.brand} — {order.shoes_count} çift
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: `rgba(45,26,46,0.45)` }}>{order.price}</p>
                  </div>
                  <Link href={`/siparis-takip?no=${order.order_number}`}
                    className="text-xs font-bold px-4 py-2 rounded-full border-2 transition-all"
                    style={{ borderColor: PRI, color: PRI }}>
                    Takip Et
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
