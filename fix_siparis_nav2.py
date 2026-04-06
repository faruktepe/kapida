content = open('app/siparis/page.tsx').read()

# Adım göstergesinin padding-top'unu Nav yüksekliğine göre ayarla
old = '''      {/* Adım göstergesi */}
      <div className="flex items-center justify-center gap-3 py-3 border-b"
        style={{borderColor: STN, background: BG}}>'''

new = '''      {/* Adım göstergesi */}
      <div className="flex items-center justify-center gap-3 py-3 border-b mt-[96px]"
        style={{borderColor: STN, background: BG}}>'''

result = content.replace(old, new)
open('app/siparis/page.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI")
