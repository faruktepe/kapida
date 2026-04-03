content = open('app/siparis/page.tsx').read()

# 1. AyakkabiKarti'na fieldRef prop ekle
old = '''function AyakkabiKarti({
  idx, data, onChange, onRemove, canRemove, fieldError
}: {
  idx: number;
  data: Ayakkabi;
  onChange: (d: Ayakkabi) => void;
  onRemove: () => void;
  canRemove: boolean;
  fieldError?: string;
}) {'''

new = '''function AyakkabiKarti({
  idx, data, onChange, onRemove, canRemove, fieldError, fieldRef
}: {
  idx: number;
  data: Ayakkabi;
  onChange: (d: Ayakkabi) => void;
  onRemove: () => void;
  canRemove: boolean;
  fieldError?: string;
  fieldRef?: React.RefObject<HTMLDivElement>;
}) {'''

content = content.replace(old, new)

# 2. Marka label'ına ref ekle
old2 = '''        {/* Marka */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Marka</label>'''
new2 = '''        {/* Marka */}
        <div ref={fieldError === "marka" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Marka</label>'''
content = content.replace(old2, new2)

# 3. Renk label'ına ref ekle
old3 = '''        {/* Renk */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Renk</label>'''
new3 = '''        {/* Renk */}
        <div ref={fieldError === "renk" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Renk</label>'''
content = content.replace(old3, new3)

# 4. Tür label'ına ref ekle
old4 = '''        {/* Tür */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Tür</label>'''
new4 = '''        {/* Tür */}
        <div ref={fieldError === "tur" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Tür</label>'''
content = content.replace(old4, new4)

# 5. Hizmetler label'ına ref ekle
old5 = '''        {/* Hizmetler */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Hizmetler</label>'''
new5 = '''        {/* Hizmetler */}
        <div ref={fieldError === "hizmet" ? fieldRef : undefined}>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Hizmetler</label>'''
content = content.replace(old5, new5)

# 6. fieldRef'i state olarak ekle
old6 = '''  const [kartError, setKartError] = useState<{idx: number; field: string} | null>(null);
  const kartRefs = useRef<(HTMLDivElement | null)[]>([]);'''
new6 = '''  const [kartError, setKartError] = useState<{idx: number; field: string} | null>(null);
  const kartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fieldScrollRef = useRef<HTMLDivElement>(null);'''
content = content.replace(old6, new6)

# 7. Kart scroll'unu fieldScrollRef'e çevir
old7 = '''setTimeout(() => { kartRefs.current[eksikIdx]?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);'''
new7 = '''setTimeout(() => { fieldScrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150);'''
content = content.replace(old7, new7)

# 8. AyakkabiKarti render'ına fieldRef ekle
old8 = '''              <AyakkabiKarti
                idx={i}
                data={a}
                onChange={(d) => { updateAyakkabi(i, d); setKartError(null); }}
                onRemove={() => removeAyakkabi(i)}
                canRemove={ayakkabiListesi.length > 1}
                fieldError={kartError?.idx === i ? kartError.field : undefined}
              />'''
new8 = '''              <AyakkabiKarti
                idx={i}
                data={a}
                onChange={(d) => { updateAyakkabi(i, d); setKartError(null); }}
                onRemove={() => removeAyakkabi(i)}
                canRemove={ayakkabiListesi.length > 1}
                fieldError={kartError?.idx === i ? kartError.field : undefined}
                fieldRef={kartError?.idx === i ? fieldScrollRef : undefined}
              />'''
content = content.replace(old8, new8)

# 9. İletişim alanlarına da inline hata ekle - ad
old9 = '''              {loggedInUser ? ('''
new9 = '''              {!loggedInUser && fieldError === "ad" && (
                <p className="text-xs font-bold mb-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Ad Soyad alanı boş bırakılamaz.</p>
              )}
              {loggedInUser ? ('''
content = content.replace(old9, new9)

# 10. İletişim hata state ekle
old10 = '  const scrollTo = (ref: React.RefObject<any>) => {'
new10 = '  const [fieldError2, setFieldError2] = useState("");\n  const scrollTo = (ref: React.RefObject<any>) => {'
content = content.replace(old10, new10)

# 11. handleSubmit'te fieldError2 set et
content = content.replace(
    'if (!iletisim.ad) { setError("Ad Soyad alanı boş bırakılamaz."); scrollTo(adRef); return; }',
    'if (!iletisim.ad) { setError("Ad Soyad alanı boş bırakılamaz."); setFieldError2("ad"); scrollTo(adRef); return; }'
)
content = content.replace(
    'if (!iletisim.telefon) { setError("Telefon numarası boş bırakılamaz."); scrollTo(telefonRef); return; }',
    'if (!iletisim.telefon) { setError("Telefon numarası boş bırakılamaz."); setFieldError2("telefon"); scrollTo(telefonRef); return; }'
)
content = content.replace(
    'if (!iletisim.ilce) { setError("Lütfen ilçenizi seçin."); scrollTo(ilceRef); return; }',
    'if (!iletisim.ilce) { setError("Lütfen ilçenizi seçin."); setFieldError2("ilce"); scrollTo(ilceRef); return; }'
)
content = content.replace(
    'if (!iletisim.adres) { setError("Adres alanı boş bırakılamaz."); scrollTo(adresRef); return; }',
    'if (!iletisim.adres) { setError("Adres alanı boş bırakılamaz."); setFieldError2("adres"); scrollTo(adresRef); return; }'
)
content = content.replace(
    'if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); scrollTo(tercihRef); return; }',
    'if (!iletisim.tercih) { setError("Lütfen sipariş tercihinizi seçin."); setFieldError2("tercih"); scrollTo(tercihRef); return; }'
)

# 12. Ad input altına hata ekle
content = content.replace(
    'ref={adRef} className={inputCls} placeholder="Ad Soyad" style={{borderColor:STN, color:DRK}} />',
    'ref={adRef} className={inputCls} placeholder="Ad Soyad" style={{borderColor: fieldError2==="ad" ? "rgba(107,39,55,0.6)" : STN, color:DRK}} />'
)

# 13. Telefon input altına hata ekle  
content = content.replace(
    'ref={telefonRef} className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor:STN, color:DRK}} />',
    'ref={telefonRef} className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor: fieldError2==="telefon" ? "rgba(107,39,55,0.6)" : STN, color:DRK}} />'
)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
