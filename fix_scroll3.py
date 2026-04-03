content = open('app/siparis/page.tsx').read()

# scrollTo fonksiyonunu sıfırdan yaz - sadece scrollIntoView kullan
old = '  const scrollTo   = (ref: React.RefObject<any>) => {\n    setTimeout(() => { if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 150; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }, 100);\n  };'

new = '  const scrollTo = (ref: React.RefObject<any>) => {\n    setTimeout(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);\n  };'

result = content.replace(old, new)

# Kart scroll'unu da aynı şekilde düzelt
old2 = 'setTimeout(() => { const el = kartRefs.current[eksikIdx]; if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 150; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }, 100);'
new2 = 'setTimeout(() => { kartRefs.current[eksikIdx]?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);'

result = result.replace(old2, new2)

open('app/siparis/page.tsx', 'w').write(result)
print("OK" if 'scrollIntoView' in result else "HATA")
