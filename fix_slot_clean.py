content = open('app/siparis/page.tsx').read()

# 1. Import ekle
old = 'import { useRouter } from "next/navigation";'
new = 'import { useRouter } from "next/navigation";\nimport SlotSecici from "@/components/SlotSecici";'
content = content.replace(old, new)

# 2. State ekle
old2 = '  const [error, setError] = useState("");'
new2 = '  const [error, setError] = useState("");\n  const [seciliSlot, setSeciliSlot] = useState<{id:string; tarih:string; saat:string} | null>(null);'
content = content.replace(old2, new2)

# 3. Validasyon ekle
old3 = '    if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }'
new3 = '    if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }\n    if (!seciliSlot) { setError("Lütfen bir teslim saati seçin."); slotRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }'
content = content.replace(old3, new3)

# 4. slotRef ekle
old4 = '  const tercihRef = useRef<HTMLDivElement>(null);'
new4 = '  const tercihRef = useRef<HTMLDivElement>(null);\n  const slotRef = useRef<HTMLDivElement>(null);'
content = content.replace(old4, new4)

# 5. Insert'e slot bilgisi ekle
old5 = '      status: iletisim.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",'
new5 = '      status: iletisim.tercih==="arasin" ? "Teklif Bekleniyor" : "Onaylandı",\n      slot_id: seciliSlot?.id || null,\n      slot_date: seciliSlot?.tarih || null,\n      slot_time: seciliSlot?.saat || null,'
content = content.replace(old5, new5)

# 6. UI ekle - tercih bölümünün üstüne
old6 = '            {/* Tercih */}\n            <div ref={tercihRef} className="space-y-3 mb-6">'
new6 = '''            {/* Saat Seçimi */}
            <div ref={slotRef} className="mb-6">
              <label className="text-[11px] uppercase tracking-widest mb-3 block font-bold" style={{color:DRK}}>
                Teslim Saati *
              </label>
              <SlotSecici
                seciliSlot={seciliSlot?.id || null}
                onSecim={(id, tarih, saat) => setSeciliSlot({ id, tarih, saat })}
              />
              {seciliSlot && (
                <div className="mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2"
                  style={{background:`rgba(91,45,110,0.07)`, border:`1.5px solid ${PRI}`}}>
                  <span style={{color:PRI}}>✓</span>
                  <p className="text-sm font-bold" style={{color:PRI}}>
                    {seciliSlot.tarih === new Date().toISOString().split("T")[0] ? "Bugün" :
                     seciliSlot.tarih === new Date(Date.now()+86400000).toISOString().split("T")[0] ? "Yarın" :
                     new Date(seciliSlot.tarih+"T00:00:00").toLocaleDateString("tr-TR", {day:"numeric",month:"long"})}
                    {" "}{seciliSlot.saat}
                  </p>
                </div>
              )}
            </div>

            {/* Tercih */}
            <div ref={tercihRef} className="space-y-3 mb-6">'''
content = content.replace(old6, new6)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
