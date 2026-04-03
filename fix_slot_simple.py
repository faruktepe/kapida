content = open('components/SlotSecici.tsx').read()

# Hafta offset state'ini kaldır, gün sayısı state'i ekle
old = '  const [yukleniyor, setYukleniyor] = useState(true);\n  const [haftaOffset, setHaftaOffset] = useState(0);'
new = '  const [yukleniyor, setYukleniyor] = useState(true);\n  const [gunSayisi, setGunSayisi] = useState(3);'
content = content.replace(old, new)

# Hafta filtresi ve UI'ı temiz versiyon ile değiştir
old2 = '''  // Hafta filtresi
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

new2 = '''  // Sadece ilk N günü göster
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
      {gosterilen.map(([tarih, gunSlots]) => {'''

content = content.replace(old2, new2)

# Kapanışa "Daha Fazla" butonu ekle
old3 = '''      })}
    </div>
  );
}'''
new3 = '''      })}

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
}'''
content = content.replace(old3, new3)

open('components/SlotSecici.tsx', 'w').write(content)
print("OK")
