"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PRI = "#5B2D6E";
const STN = "#D4C5B0";
const DRK = "#2D1A2E";

type Slot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked: number;
};

export default function SlotSecici({
  seciliSlot,
  onSecim,
}: {
  seciliSlot: string | null;
  onSecim: (id: string, tarih: string, saat: string) => void;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [gunSayisi, setGunSayisi] = useState(3);

  useEffect(() => {
    const simdi = new Date();
    const enErken = new Date(simdi.getTime() + 2 * 60 * 60 * 1000);
    const bugunStr = simdi.toISOString().split("T")[0];

    supabase
      .from("time_slots")
      .select("*")
      .eq("active", true)
      .gte("date", bugunStr)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })
      .then(({ data }) => {
        if (!data) { setYukleniyor(false); return; }
        const filtered = data.filter((slot) => {
          const slotDt = new Date(slot.date + "T" + slot.start_time);
          if (slotDt <= enErken) return false;
          const startHour = parseInt(slot.start_time.split(":")[0]);
          if (startHour >= 21) return false;
          const slotDate = new Date(slot.date + "T00:00:00");
          if (slotDate.getDay() === 0) return false;
          return true;
        });
        setSlots(filtered);
        setYukleniyor(false);
      });
  }, []);

  if (yukleniyor) return (
    <div className="p-4 rounded-2xl text-center" style={{ background: `rgba(212,197,176,0.2)`, border: `1px solid ${STN}` }}>
      <p className="text-sm" style={{ color: `rgba(45,26,46,0.4)` }}>Uygun saatler yükleniyor...</p>
    </div>
  );

  if (slots.length === 0) return (
    <div className="p-4 rounded-2xl text-center" style={{ background: `rgba(212,197,176,0.2)`, border: `1px solid ${STN}` }}>
      <p className="text-sm" style={{ color: `rgba(45,26,46,0.4)` }}>Şu an uygun saat aralığı bulunmuyor.</p>
    </div>
  );

  const bugun = new Date().toISOString().split("T")[0];
  const yarin = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const gunler: Record<string, Slot[]> = {};
  slots.forEach((s) => {
    if (!gunler[s.date]) gunler[s.date] = [];
    gunler[s.date].push(s);
  });

  // Sadece ilk N günü göster
  const gunler2: Record<string, Slot[]> = {};
  slots.forEach(s => {
    if (!gunler2[s.date]) gunler2[s.date] = [];
    gunler2[s.date].push(s);
  });
  const tumGunler = Object.entries(gunler2);
  const gosterilen = tumGunler.slice(0, gunSayisi);
  const dahaFazlaVar = tumGunler.length > gunSayisi;

  return (
    <div className="space-y-4">
      {tumGunler.length === 0 && (
        <div className="p-4 rounded-2xl text-center" style={{ background: "rgba(212,197,176,0.2)", border: "1px solid #D4C5B0" }}>
          <p className="text-sm" style={{ color: "rgba(45,26,46,0.4)" }}>Uygun saat bulunmuyor.</p>
        </div>
      )}
      {gosterilen.map(([tarih, gunSlots]) => {
        const d = new Date(tarih + "T00:00:00");
        const gunAdi =
          tarih === bugun ? "Bugün" :
          tarih === yarin ? "Yarın" :
          d.toLocaleDateString("tr-TR", { weekday: "long" });
        const tarihStr = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

        return (
          <div key={tarih}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: `rgba(45,26,46,0.4)` }}>
              {gunAdi} — {tarihStr}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {gunSlots.map((slot) => {
                const dolu = slot.booked >= slot.capacity;
                const secili = seciliSlot === slot.id;
                const saatStr = `${slot.start_time.slice(0, 5)}–${slot.end_time.slice(0, 5)}`;
                return (
                  <button
                    key={slot.id}
                    disabled={dolu}
                    onClick={() => onSecim(slot.id, tarih, saatStr)}
                    className="p-3 rounded-xl border-2 text-left transition-all"
                    style={
                      dolu
                        ? { borderColor: STN, background: "rgba(212,197,176,0.1)", opacity: 0.5, cursor: "not-allowed" }
                        : secili
                        ? { borderColor: PRI, background: "rgba(91,45,110,0.07)" }
                        : { borderColor: STN, background: "#fff" }
                    }>
                    <p className="text-sm font-bold"
                      style={{ color: dolu ? "rgba(45,26,46,0.3)" : secili ? PRI : DRK }}>
                      {saatStr}
                    </p>
                    <p className="text-[10px] mt-0.5"
                      style={{ color: dolu ? "rgba(45,26,46,0.3)" : "rgba(45,26,46,0.4)" }}>
                      {dolu ? "Dolu" : `${slot.capacity - slot.booked} yer kaldı`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {dahaFazlaVar && (
        <button
          onClick={() => setGunSayisi(g => g + 7)}
          className="w-full py-3 rounded-xl border-2 text-sm font-bold transition-all"
          style={{ borderColor: "#D4C5B0", color: "rgba(45,26,46,0.6)", background: "#fff" }}>
          + Daha Fazla Gün Göster
        </button>
      )}
    </div>
  );
}
