content = open('components/SlotSecici.tsx').read()

# useState'e hafta filtresi ekle
old = '  const [yukleniyor, setYukleniyor] = useState(true);'
new = '  const [yukleniyor, setYukleniyor] = useState(true);\n  const [haftaOffset, setHaftaOffset] = useState(0);'
content = content.replace(old, new)

# Filtreyi haftaOffset'e göre yap
old2 = '''    supabase
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
          // 2 saat kuralı
          if (slotDt <= enErken) return false;
          // 21:00 sonrası gösterme
          const startHour = parseInt(slot.start_time.split(":")[0]);
          if (startHour >= 21) return false;
          // Pazar günleri hizmet yok (0 = Pazar)
          const slotDate = new Date(slot.date + "T00:00:00");
          if (slotDate.getDay() === 0) return false;
          return true;
        });
        setSlots(filtered);
        setYukleniyor(false);
      });'''

new2 = '''    supabase
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
      });'''
content = content.replace(old2, new2)

# Hafta filtresi uygula ve UI güncelle
old3 = '''  return (
    <div className="space-y-4">
      {Object.entries(gunler).map(([tarih, gunSlots]) => {'''

new3 = '''  // Hafta filtresi
  const bugunDt = new Date();
  bugunDt.setHours(0,0,0,0);
  const haftaBaslangic = new Date(bugunDt.getTime() + haftaOffset * 7 * 24 * 60 * 60 * 1000);
  const haftaBitis = new Date(haftaBaslangic.getTime() + 7 * 24 * 60 * 60 * 1000);
  const filtreliSlots = slots.filter(s => {
    const d = new Date(s.date + "T00:00:00");
    return d >= haftaBaslangic && d < haftaBitis;
  });
  const gosterilecekGunler: Record<string, Slot[]> = {};
  filtreliSlots.forEach(s => {
    if (!gosterilecekGunler[s.date]) gosterilecekGunler[s.date] = [];
    gosterilecekGunler[s.date].push(s);
  });

  return (
    <div className="space-y-4">
      {/* Hafta Seçici */}
      <div className="flex gap-2">
        <button
          onClick={() => setHaftaOffset(0)}
          className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
          style={haftaOffset === 0
            ? { background: "#5B2D6E", borderColor: "#5B2D6E", color: "#BFA5B8" }
            : { borderColor: "#D4C5B0", color: "rgba(45,26,46,0.6)", background: "#fff" }}>
          Bu Hafta
        </button>
        <button
          onClick={() => setHaftaOffset(1)}
          className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
          style={haftaOffset === 1
            ? { background: "#5B2D6E", borderColor: "#5B2D6E", color: "#BFA5B8" }
            : { borderColor: "#D4C5B0", color: "rgba(45,26,46,0.6)", background: "#fff" }}>
          Gelecek Hafta
        </button>
        <button
          onClick={() => setHaftaOffset(2)}
          className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
          style={haftaOffset === 2
            ? { background: "#5B2D6E", borderColor: "#5B2D6E", color: "#BFA5B8" }
            : { borderColor: "#D4C5B0", color: "rgba(45,26,46,0.6)", background: "#fff" }}>
          2 Hafta Sonra
        </button>
      </div>

      {Object.keys(gosterilecekGunler).length === 0 && (
        <div className="p-4 rounded-2xl text-center" style={{ background: "rgba(212,197,176,0.2)", border: "1px solid #D4C5B0" }}>
          <p className="text-sm" style={{ color: "rgba(45,26,46,0.4)" }}>Bu hafta için uygun saat bulunmuyor.</p>
        </div>
      )}

      {Object.entries(gosterilecekGunler).map(([tarih, gunSlots]) => {'''

content = content.replace(old3, new3)

# gunler yerine gosterilecekGunler kullan kapanışta
old4 = '''      })}
    </div>
  );
}'''
new4 = '''      })}
    </div>
  );
}'''
# zaten aynı, değiştirmeye gerek yok

open('components/SlotSecici.tsx', 'w').write(content)
print("OK")
