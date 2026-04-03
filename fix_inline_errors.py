content = open('app/siparis/page.tsx').read()

hata = lambda msg: f'\n                <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{{{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}}}>⚠️ {msg}</p>'

# Telefon input'tan sonra hata
old1 = '                      ref={telefonRef} className={inputCls} placeholder="05XX XXX XX XX" type="tel" style={{borderColor: fieldError2==="telefon" ? "rgba(107,39,55,0.6)" : STN, color:DRK}} />'
new1 = old1 + hata("Telefon numarası boş bırakılamaz.")
content = content.replace(old1, new1)

# İlçe butonlarından sonra hata - ilceRef div'inin içine
old2 = '                <div ref={ilceRef} className="flex flex-wrap gap-2">\n                  {ILCELER.map(ilce => ('
new2 = '                <div ref={ilceRef} className="flex flex-wrap gap-2">\n                  {ILCELER.map(ilce => ('
# ilce ref div'inden sonra hata ekle - closing div'i bul
old2b = '                </div>\n              </div>\n              <div>\n                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>Adres *</label>'
new2b = '                </div>\n                {fieldError2==="ilce" && <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen ilçenizi seçin.</p>}\n              </div>\n              <div>\n                <label className="text-[11px] uppercase tracking-widest mb-2 block font-bold" style={{color:DRK}}>Adres *</label>'
content = content.replace(old2b, new2b)

# Adres textarea'dan sonra hata
old3 = '                  style={{borderColor:STN, color:DRK}} />\n              </div>'
new3 = '                  style={{borderColor:STN, color:DRK}} />\n                {fieldError2==="adres" && <p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Adres alanı boş bırakılamaz.</p>}\n              </div>'
content = content.replace(old3, new3, 1)

# Tercih seçimi sonra hata
old4 = '            </div>\n\n            {error && (\n              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"'
new4 = '            </div>\n            {fieldError2==="tercih" && <p className="text-xs font-bold mb-4 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen sipariş tercihinizi seçin.</p>}\n\n            {error && (\n              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"'
content = content.replace(old4, new4)

# input değişince fieldError2 temizle
content = content.replace(
    'onChange={e => setIletisim(f=>({...f,ad:e.target.value}))}',
    'onChange={e => { setIletisim(f=>({...f,ad:e.target.value})); setFieldError2(""); }}'
)
content = content.replace(
    'onChange={e => setIletisim(f=>({...f,telefon:e.target.value}))}',
    'onChange={e => { setIletisim(f=>({...f,telefon:e.target.value})); setFieldError2(""); }}'
)
content = content.replace(
    'onChange={e => setIletisim(f=>({...f,adres:e.target.value}))}',
    'onChange={e => { setIletisim(f=>({...f,adres:e.target.value})); setFieldError2(""); }}'
)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
