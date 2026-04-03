content = open('app/siparis/page.tsx').read()

content = content.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect, useRef } from "react";'
)

content = content.replace(
    '  const [error, setError] = useState("");',
    '  const [error, setError] = useState("");\n  const adRef = useRef<HTMLInputElement>(null);\n  const telefonRef = useRef<HTMLInputElement>(null);\n  const ilceRef = useRef<HTMLDivElement>(null);\n  const adresRef = useRef<HTMLTextAreaElement>(null);\n  const tercihRef = useRef<HTMLDivElement>(null);\n  const scrollTo = (ref: React.RefObject<any>) => { setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); };'
)

content = content.replace('if (!iletisim.ad) { setError("Ad Soyad alanı boş bırakılamaz."); return; }', 'if (!iletisim.ad) { setError("Ad Soyad alanı boş bırakılamaz."); scrollTo(adRef); return; }')
content = content.replace('if (!iletisim.telefon) { setError("Telefon numarası boş bırakılamaz."); return; }', 'if (!iletisim.telefon) { setError("Telefon numarası boş bırakılamaz."); scrollTo(telefonRef); return; }')
content = content.replace('if (!iletisim.ilce) { setError("Lütfen ilçenizi seçin."); return; }', 'if (!iletisim.ilce) { setError("Lütfen ilçenizi seçin."); scrollTo(ilceRef); return; }')
content = content.replace('if (!iletisim.adres) { setError("Adres alanı boş bırakılamaz."); return; }', 'if (!iletisim.adres) { setError("Adres alanı boş bırakılamaz."); scrollTo(adresRef); return; }')
content = content.replace('if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); return; }', 'if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); scrollTo(tercihRef); return; }')

content = content.replace('className={inputCls} placeholder="Ad Soyad" style={{borderColor:STN, color:DRK}} />', 'ref={adRef} className={inputCls} placeholder="Ad Soyad" style={{borderColor:STN, color:DRK}} />')
content = content.replace('className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor:STN, color:DRK}} />', 'ref={telefonRef} className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor:STN, color:DRK}} />')
content = content.replace('<textarea value={iletisim.adres} onChange={e => setIletisim(f=>({...f,adres:e.target.value}))}\n                  className={inputCls+" h-24 resize-none"} placeholder="Mahalle, sokak, bina no, daire..."\n                  style={{borderColor:STN, color:DRK}} />', '<textarea ref={adresRef} value={iletisim.adres} onChange={e => setIletisim(f=>({...f,adres:e.target.value}))}\n                  className={inputCls+" h-24 resize-none"} placeholder="Mahalle, sokak, bina no, daire..."\n                  style={{borderColor:STN, color:DRK}} />')
content = content.replace('<div className="flex flex-wrap gap-2">\n                  {ILCELER.map(ilce =>', '<div ref={ilceRef} className="flex flex-wrap gap-2">\n                  {ILCELER.map(ilce =>')
content = content.replace('<div className="space-y-3 mb-6">', '<div ref={tercihRef} className="space-y-3 mb-6">')

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
