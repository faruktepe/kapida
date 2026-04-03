content = open('app/siparis/page.tsx').read()

# seciliSlot validasyonunu kaldır - zorunlu yapma
old = '    if (!seciliSlot) { setError("Lütfen bir teslim saati seçin."); scrollTo(slotRef); return; }'
new = '    // slot validasyonu geçici devre dışı'
content = content.replace(old, new)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
