content = open('app/siparis/page.tsx').read()

# scrollTo fonksiyonunu düzelt
old = '  const scrollTo   = (ref: React.RefObject<any>) => {\n    setTimeout(() => { if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: "smooth" }); } }, 50);\n  };'

new = '  const scrollTo   = (ref: React.RefObject<any>) => {\n    setTimeout(() => { if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 150; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }, 100);\n  };'

result = content.replace(old, new)

# Kart scroll'unu da düzelt
old2 = 'setTimeout(() => { const el = kartRefs.current[eksikIdx]; if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top: y, behavior: "smooth" }); } }, 50);'
new2 = 'setTimeout(() => { const el = kartRefs.current[eksikIdx]; if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 150; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }, 100);'

result = result.replace(old2, new2)

open('app/siparis/page.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI - mevcut kodu göster")
