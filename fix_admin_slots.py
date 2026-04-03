content = open('app/admin/page.tsx').read()

# 1. Tab tipine "slotlar" ekle
old = 'const [tab, setTab] = useState<"siparisler" | "galeri" | "referanslar">("siparisler");'
new = 'const [tab, setTab] = useState<"siparisler" | "galeri" | "referanslar" | "slotlar">("siparisler");'
content = content.replace(old, new)

# 2. Tab listesine "slotlar" ekle
old2 = '{(["siparisler", "galeri", "referanslar"] as const).map((t) => ('
new2 = '{(["siparisler", "galeri", "referanslar", "slotlar"] as const).map((t) => ('
content = content.replace(old2, new2)

# 3. Tab label'ına "slotlar" ekle
old3 = '{t === "siparisler" ? "Siparişler" : t === "galeri" ? "Galeri" : "Referans Kodları"}'
new3 = '{t === "siparisler" ? "Siparişler" : t === "galeri" ? "Galeri" : t === "referanslar" ? "Referans Kodları" : "🕐 Slotlar"}'
content = content.replace(old3, new3)

# 4. SlotTab component'ini ReferralTab'dan önce ekle
old4 = 'function ReferralTab() {'
new4 = '''function SlotTab() {
  const [slots, setSlots] = useState<{id:string; date:string; start_time:string; end_time:string; capacity:number; booked:number; active:boolean}[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniSlot, setYeniSlot] = useState({ date:"", start_time:"", end_time:"", capacity:3 });
  const [kayit, setKayit] = useState("");

  const yukle = async () => {
    setYukleniyor(true);
    const bugun = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("time_slots").select("*").gte("date", bugun).order("date").order("start_time");
    setSlots(data || []);
    setYukleniyor(false);
  };

  useEffect(() => { yukle(); }, []);

  const ekle = async () => {
    if (!yeniSlot.date || !yeniSlot.start_time || !yeniSlot.end_time) { setKayit("Tüm alanları doldurun."); return; }
    await supabase.from("time_slots").insert({ ...yeniSlot, active: true, booked: 0 });
    setKayit("Slot eklendi!");
    setYeniSlot({ date:"", start_time:"", end_time:"", capacity:3 });
    yukle();
    setTimeout(() => setKayit(""), 2000);
  };

  const sil = async (id: string) => {
    await supabase.from("time_slots").delete().eq("id", id);
    yukle();
  };

  const toggleAktif = async (id: string, aktif: boolean) => {
    await supabase.from("time_slots").update({ active: !aktif }).eq("id", id);
    yukle();
  };

  const bugun = new Date().toISOString().split("T")[0];
  const gunler: Record<string, typeof slots> = {};
  slots.forEach(s => {
    if (!gunler[s.date]) gunler[s.date] = [];
    gunler[s.date].push(s);
  });

  return (
    <div className="space-y-6">
      {/* Yeni Slot Ekle */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-black/50">Yeni Slot Ekle</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-black/50 mb-1 block">Tarih</label>
            <input type="date" value={yeniSlot.date} min={bugun}
              onChange={e => setYeniSlot(f => ({...f, date: e.target.value}))}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 mb-1 block">Başlangıç</label>
            <input type="time" value={yeniSlot.start_time}
              onChange={e => setYeniSlot(f => ({...f, start_time: e.target.value}))}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 mb-1 block">Bitiş</label>
            <input type="time" value={yeniSlot.end_time}
              onChange={e => setYeniSlot(f => ({...f, end_time: e.target.value}))}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-black/50 mb-1 block">Kapasite</label>
            <input type="number" min={1} max={20} value={yeniSlot.capacity}
              onChange={e => setYeniSlot(f => ({...f, capacity: parseInt(e.target.value)}))}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={ekle}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-black text-white hover:opacity-80 transition">
            + Slot Ekle
          </button>
          {kayit && <p className="text-sm font-medium text-green-600">{kayit}</p>}
        </div>
      </div>

      {/* Mevcut Slotlar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-black/50">
          Mevcut Slotlar ({slots.length})
        </h3>
        {yukleniyor ? (
          <p className="text-sm text-black/40">Yükleniyor...</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-black/40">Slot bulunamadı.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(gunler).map(([tarih, gunSlots]) => {
              const d = new Date(tarih + "T00:00:00");
              const gunAdi = d.toLocaleDateString("tr-TR", { weekday:"long", day:"numeric", month:"long" });
              const pazar = d.getDay() === 0;
              return (
                <div key={tarih}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{color: pazar ? "#ef4444" : "rgba(0,0,0,0.4)"}}>
                    {gunAdi} {pazar && "🚫 PAZAR"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {gunSlots.map(slot => (
                      <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl border"
                        style={{borderColor: slot.active ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.05)", background: slot.active ? "#fff" : "rgba(0,0,0,0.02)", opacity: slot.active ? 1 : 0.6}}>
                        <div>
                          <p className="text-sm font-bold">
                            {slot.start_time.slice(0,5)}–{slot.end_time.slice(0,5)}
                          </p>
                          <p className="text-xs text-black/40">
                            {slot.booked}/{slot.capacity} dolu
                            {slot.booked >= slot.capacity && " 🔴 DOLU"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleAktif(slot.id, slot.active)}
                            className="text-xs px-2.5 py-1 rounded-full border font-medium transition"
                            style={{borderColor: slot.active ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.1)", color: slot.active ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)"}}>
                            {slot.active ? "Kapat" : "Aç"}
                          </button>
                          <button onClick={() => sil(slot.id)}
                            className="text-xs px-2.5 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50 transition">
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ReferralTab() {'''

content = content.replace(old4, new4)

# 5. Tab render'ına slotlar ekle
old5 = '{tab === "referanslar" ? <ReferralTab /> : null}'
new5 = '{tab === "referanslar" ? <ReferralTab /> : null}\n        {tab === "slotlar" ? <SlotTab /> : null}'
content = content.replace(old5, new5)

open('app/admin/page.tsx', 'w').write(content)
print("OK")
