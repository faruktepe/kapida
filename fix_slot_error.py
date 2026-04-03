content = open('app/siparis/page.tsx').read()

# Sorunlu IIFE'yi temiz bir yapıya çevir
old = '''              ) : (
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
              )}'''

new = '''              ) : (
                <SlotSecici
                  slots={slots}
                  seciliSlot={seciliSlot}
                  onSecim={setSeciliSlot}
                />
              )}'''

content = content.replace(old, new)

# SlotSecici component'ini dosyanın başına ekle (bos() fonksiyonundan önce)
slot_component = '''
type SlotType = {id:string; date:string; start_time:string; end_time:string; capacity:number; booked:number};

function SlotSecici({ slots, seciliSlot, onSecim }: {
  slots: SlotType[];
  seciliSlot: string | null;
  onSecim: (id: string) => void;
}) {
  const bugun = new Date().toISOString().split("T")[0];
  const yarin = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const gunler: Record<string, SlotType[]> = {};
  slots.forEach(s => {
    if (!gunler[s.date]) gunler[s.date] = [];
    gunler[s.date].push(s);
  });

  return (
    <div className="space-y-4">
      {Object.entries(gunler).map(([tarih, gunSlots]) => {
        const d = new Date(tarih + "T00:00:00");
        const gunAdi = tarih === bugun ? "Bugün" : tarih === yarin ? "Yarın"
          : d.toLocaleDateString("tr-TR", { weekday: "long" });
        const tarihStr = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
        return (
          <div key={tarih}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: `rgba(45,26,46,0.4)` }}>
              {gunAdi} — {tarihStr}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {gunSlots.map(slot => {
                const dolu = slot.booked >= slot.capacity;
                const secili = seciliSlot === slot.id;
                return (
                  <button key={slot.id} disabled={dolu}
                    onClick={() => onSecim(slot.id)}
                    className="p-3 rounded-xl border-2 text-left transition-all"
                    style={
                      dolu
                        ? { borderColor: "#D4C5B0", background: "rgba(212,197,176,0.1)", opacity: 0.5, cursor: "not-allowed" }
                        : secili
                        ? { borderColor: "#5B2D6E", background: "rgba(91,45,110,0.07)" }
                        : { borderColor: "#D4C5B0", background: "#fff" }
                    }>
                    <p className="text-sm font-bold"
                      style={{ color: dolu ? "rgba(45,26,46,0.3)" : secili ? "#5B2D6E" : "#2D1A2E" }}>
                      {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
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
    </div>
  );
}

'''

content = content.replace('function bos(): Ayakkabi {', slot_component + 'function bos(): Ayakkabi {')

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
