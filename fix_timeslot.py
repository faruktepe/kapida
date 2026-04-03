content = open('app/siparis/page.tsx').read()

# 1. iletisim state'ine slot ekle
old = 'const [iletisim, setIletisim] = useState({ ad:"", telefon:"", ilce:"", adres:"", tercih:"" as "arasin"|"onayla"|"", referralCode:"" });'
new = 'const [iletisim, setIletisim] = useState({ ad:"", telefon:"", ilce:"", adres:"", tercih:"" as "arasin"|"onayla"|"", referralCode:"" });\n  const [slots, setSlots] = useState<{id:string; date:string; start_time:string; end_time:string; capacity:number; booked:number}[]>([]);\n  const [seciliSlot, setSeciliSlot] = useState<string | null>(null);'
content = content.replace(old, new)

# 2. Slotları çek - useEffect ekle (authChecked'den sonra)
old2 = '  const updateAyakkabi = (idx: number, d: Ayakkabi) => {'
new2 = '''  // Slotları yükle
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("time_slots")
      .select("*")
      .eq("active", true)
      .gte("date", today)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })
      .then(({ data }) => setSlots(data || []));
  }, []);

  const updateAyakkabi = (idx: number, d: Ayakkabi) => {'''
content = content.replace(old2, new2)

# 3. handleSubmit'e slot validasyonu ekle
old3 = '    if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }'
new3 = '    if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }\n    if (!seciliSlot) { setError("Lütfen bir teslim saati seçin."); scrollTo(slotRef); return; }'
content = content.replace(old3, new3)

# 4. slotRef ekle
old4 = '  const tercihRef = useRef<HTMLDivElement>(null);'
new4 = '  const tercihRef = useRef<HTMLDivElement>(null);\n  const slotRef = useRef<HTMLDivElement>(null);'
content = content.replace(old4, new4)

# 5. Sipariş insert'e slot bilgisi ekle
old5 = '      status: iletisim.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",'
new5 = '      status: iletisim.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",\n      slot_id: seciliSlot || null,\n      slot_date: seciliSlot ? slots.find(s => s.id === seciliSlot)?.date : null,\n      slot_time: seciliSlot ? (() => { const s = slots.find(sl => sl.id === seciliSlot); return s ? `${s.start_time.slice(0,5)}-${s.end_time.slice(0,5)}` : null; })() : null,'
content = content.replace(old5, new5)

# 6. Slot seçim UI'ını tercih bölümünün üstüne ekle
old6 = '            {/* Tercih */}\n            <div ref={tercihRef} className="space-y-3 mb-6">'
new6 = '''            {/* Saat Seçimi */}
            <div ref={slotRef} className="mb-6">
              <label className="text-[11px] uppercase tracking-widest mb-3 block font-bold" style={{color:DRK}}>
                Teslim Saati *
              </label>
              {slots.length === 0 ? (
                <div className="p-4 rounded-2xl text-center" style={{background:`rgba(212,197,176,0.2)`, border:`1px solid ${STN}`}}>
                  <p className="text-sm" style={{color:`rgba(45,26,46,0.4)`}}>Şu an uygun saat aralığı bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const gunler: Record<string, typeof slots> = {};
                    slots.forEach(s => {
                      if (!gunler[s.date]) gunler[s.date] = [];
                      gunler[s.date].push(s);
                    });
                    return Object.entries(gunler).map(([tarih, gunSlots]) => {
                      const d = new Date(tarih + "T00:00:00");
                      const bugun = new Date().toISOString().split("T")[0];
                      const yarin = new Date(Date.now() + 86400000).toISOString().split("T")[0];
                      const gunAdi = tarih === bugun ? "Bugün" : tarih === yarin ? "Yarın" :
                        d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
                      return (
                        <div key={tarih}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:`rgba(45,26,46,0.4)`}}>
                            {gunAdi} — {d.toLocaleDateString("tr-TR", { day:"numeric", month:"long" })}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {gunSlots.map(slot => {
                              const dolu = slot.booked >= slot.capacity;
                              const secili = seciliSlot === slot.id;
                              return (
                                <button
                                  key={slot.id}
                                  disabled={dolu}
                                  onClick={() => setSeciliSlot(slot.id)}
                                  className="p-3 rounded-xl border-2 text-left transition-all"
                                  style={
                                    dolu ? {borderColor:STN, background:`rgba(212,197,176,0.1)`, opacity:0.5, cursor:"not-allowed"} :
                                    secili ? {borderColor:PRI, background:`rgba(91,45,110,0.07)`} :
                                    {borderColor:STN, background:"#fff"}
                                  }>
                                  <p className="text-sm font-bold" style={{color: dolu ? `rgba(45,26,46,0.3)` : secili ? PRI : DRK}}>
                                    {slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)}
                                  </p>
                                  <p className="text-[10px] mt-0.5" style={{color: dolu ? `rgba(45,26,46,0.3)` : `rgba(45,26,46,0.4)`}}>
                                    {dolu ? "Dolu" : `${slot.capacity - slot.booked} yer kaldı`}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Tercih */}
            <div ref={tercihRef} className="space-y-3 mb-6">'''
content = content.replace(old6, new6)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
