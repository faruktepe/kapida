"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const DURUMLAR = [
  "Teklif Bekleniyor",
  "Onaylandı",
  "Kuryede",
  "İşlemde",
  "Tamamlandı",
  "Teslim Edildi",
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({ title, value, subtle }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all",
        subtle
          ? "border-stone-200 bg-white text-black"
          : "border-black bg-black text-white [&_*]:!text-white"
      )}
    >
      <p className="text-3xl font-semibold tracking-tight !text-white">
        {value}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] !text-white/70">
        {title}
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tümü");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data ?? []);
  };

  const filteredOrders =
    filter === "Tümü" ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-black">
      <header className="bg-black px-6 py-4 flex justify-between items-center">
        <h1 className="text-white font-bold">Admin Panel</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Toplam" value={orders.length} />
          <StatCard
            title="İşlemde"
            value={orders.filter((o) => o.status === "İşlemde").length}
            subtle
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["Tümü", ...DURUMLAR].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 text-xs border rounded-full transition",
                filter === s
                  ? "bg-black border-black !text-white"
                  : "border-black/20 text-black"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 p-5 rounded-2xl"
            >
              <p className="font-bold">{order.order_number}</p>
              <p className="text-sm text-black/50">{order.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
