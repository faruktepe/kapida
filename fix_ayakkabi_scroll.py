content = open('app/siparis/page.tsx').read()

# 1. AyakkabiKarti'na fieldError prop ekle
old = '''function AyakkabiKarti({
  idx, data, onChange, onRemove, canRemove
}: {
  idx: number;
  data: Ayakkabi;
  onChange: (d: Ayakkabi) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {'''

new = '''function AyakkabiKarti({
  idx, data, onChange, onRemove, canRemove, fieldError
}: {
  idx: number;
  data: Ayakkabi;
  onChange: (d: Ayakkabi) => void;
  onRemove: () => void;
  canRemove: boolean;
  fieldError?: string;
}) {'''

content = content.replace(old, new)

# 2. Marka seçimi altına hata mesajı ekle
old2 = '''        {/* Model */}
        {data.marka && markaModeller.length > 0 && ('''

new2 = '''        {/* Marka hata */}
        {fieldError === "marka" && (
          <p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir marka seçin.</p>
        )}

        {/* Model */}
        {data.marka && markaModeller.length > 0 && ('''

content = content.replace(old2, new2)

# 3. Renk seçimi altına hata mesajı ekle
old3 = '''        {/* Tür */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Tür</label>'''

new3 = '''        {/* Renk hata */}
        {fieldError === "renk" && (
          <p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir renk seçin.</p>
        )}

        {/* Tür */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Tür</label>'''

content = content.replace(old3, new3)

# 4. Tür seçimi altına hata mesajı ekle
old4 = '''        {/* Hizmetler */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Hizmetler</label>'''

new4 = '''        {/* Tür hata */}
        {fieldError === "tur" && (
          <p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir tür seçin.</p>
        )}

        {/* Hizmetler */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>Hizmetler</label>'''

content = content.replace(old4, new4)

# 5. Hizmet seçimi altına hata mesajı ekle
old5 = '''        {/* Not alanı */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>'''

new5 = '''        {/* Hizmet hata */}
        {fieldError === "hizmet" && (
          <p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen en az bir hizmet seçin.</p>
        )}

        {/* Not alanı */}
        <div>
          <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color: DRK}}>'''

content = content.replace(old5, new5)

# 6. AyakkabiKarti render'ına fieldError ve ref ekle
old6 = '''  const [error, setError] = useState("");
  const adRef = useRef<HTMLInputElement>(null);'''

new6 = '''  const [error, setError] = useState("");
  const [kartError, setKartError] = useState<{idx: number; field: string} | null>(null);
  const kartRefs = useRef<(HTMLDivElement | null)[]>([]);
  const adRef = useRef<HTMLInputElement>(null);'''

content = content.replace(old6, new6)

# 7. Adım 1 validasyonunu güncelle - scroll ve alan bazlı hata
old7 = '''              const eksikAlan = ayakkabiListesi.map((a,i) => {
                if (!a.marka) return `Ayakkabı ${i+1}: Marka seçilmedi.`;
                if (!a.renk) return `Ayakkabı ${i+1}: Renk seçilmedi.`;
                if (!a.tur) return `Ayakkabı ${i+1}: Tür seçilmedi.`;
                if (a.hizmetler.length === 0) return `Ayakkabı ${i+1}: En az bir hizmet seçin.`;
                return null;
              }).find(Boolean);
              if (eksikAlan) { setError(eksikAlan); return; }'''

new7 = '''              let eksikIdx = -1;
              let eksikField = "";
              for (let i = 0; i < ayakkabiListesi.length; i++) {
                const a = ayakkabiListesi[i];
                if (!a.marka) { eksikIdx = i; eksikField = "marka"; break; }
                if (!a.renk)  { eksikIdx = i; eksikField = "renk";  break; }
                if (!a.tur)   { eksikIdx = i; eksikField = "tur";   break; }
                if (a.hizmetler.length === 0) { eksikIdx = i; eksikField = "hizmet"; break; }
              }
              if (eksikIdx >= 0) {
                const alan = eksikField === "marka" ? "Marka" : eksikField === "renk" ? "Renk" : eksikField === "tur" ? "Tür" : "Hizmet";
                setError(`Ayakkabı ${eksikIdx+1}: ${alan} seçilmedi.`);
                setKartError({ idx: eksikIdx, field: eksikField });
                setTimeout(() => kartRefs.current[eksikIdx]?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
                return;
              }
              setKartError(null);'''

content = content.replace(old7, new7)

# 8. AyakkabiKarti render'ına fieldError ve ref prop ekle
old8 = '''            <AyakkabiKarti
                key={i}
                idx={i}
                data={a}
                onChange={(d) => updateAyakkabi(i, d)}
                onRemove={() => removeAyakkabi(i)}
                canRemove={ayakkabiListesi.length > 1}
              />'''

new8 = '''            <div key={i} ref={el => { kartRefs.current[i] = el; }}>
              <AyakkabiKarti
                idx={i}
                data={a}
                onChange={(d) => { updateAyakkabi(i, d); setKartError(null); }}
                onRemove={() => removeAyakkabi(i)}
                canRemove={ayakkabiListesi.length > 1}
                fieldError={kartError?.idx === i ? kartError.field : undefined}
              />
            </div>'''

content = content.replace(old8, new8)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
