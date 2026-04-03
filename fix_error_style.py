content = open('app/siparis/page.tsx').read()

# 1. Hata kutusu stilini belirginleştir - adım 1 ve adım 2
old = '            {error && <p className="text-sm mb-4 font-medium" style={{color:`rgba(107,39,55,0.9)`}}>{error}</p>}'
new = '''            {error && (
              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"
                style={{background:"rgba(107,39,55,0.08)", border:"2px solid rgba(107,39,55,0.4)"}}>
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm font-bold" style={{color:"rgba(107,39,55,1)"}}>{error}</p>
              </div>
            )}'''
content = content.replace(old, new)

# Adım 2'deki hata kutusu da aynı
old2 = '            {error && <p className="text-sm mb-4 font-medium" style={{color:`rgba(107,39,55,0.9)`}}>{error}</p>}\n            <div className="flex gap-3">'
new2 = '''            {error && (
              <div className="mb-4 p-4 rounded-2xl flex items-center gap-3"
                style={{background:"rgba(107,39,55,0.08)", border:"2px solid rgba(107,39,55,0.4)"}}>
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-sm font-bold" style={{color:"rgba(107,39,55,1)"}}>{error}</p>
              </div>
            )}
            <div className="flex gap-3">'''
content = content.replace(old2, new2)

# 2. Inline alan hataları da belirginleştir
content = content.replace(
    '<p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir marka seçin.</p>',
    '<p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir marka seçin.</p>'
)
content = content.replace(
    '<p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir renk seçin.</p>',
    '<p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir renk seçin.</p>'
)
content = content.replace(
    '<p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen bir tür seçin.</p>',
    '<p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen bir tür seçin.</p>'
)
content = content.replace(
    '<p className="text-xs font-semibold mt-1" style={{color:"rgba(107,39,55,0.9)"}}>⚠ Lütfen en az bir hizmet seçin.</p>',
    '<p className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg" style={{color:"rgba(107,39,55,1)", background:"rgba(107,39,55,0.08)", border:"1px solid rgba(107,39,55,0.3)"}}>⚠️ Lütfen en az bir hizmet seçin.</p>'
)

# 3. Scroll'u daha iyi ayarla - scrollIntoView yerine manual scroll
content = content.replace(
    'setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);',
    'setTimeout(() => { if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: "smooth" }); } }, 50);'
)
content = content.replace(
    'setTimeout(() => kartRefs.current[eksikIdx]?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);',
    'setTimeout(() => { const el = kartRefs.current[eksikIdx]; if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: "smooth" }); } }, 50);'
)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
