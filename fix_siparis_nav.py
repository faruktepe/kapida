content = open('app/siparis/page.tsx').read()

# Nav import ekle
old = 'import { useRouter } from "next/navigation";'
new = 'import { useRouter } from "next/navigation";\nimport Nav from "@/components/Nav";'
content = content.replace(old, new)

# Mevcut custom header'ı Nav ile değiştir
old2 = '''      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b backdrop-blur-md"
        style={{borderColor:`rgba(191,165,184,0.15)`, background:`rgba(45,26,46,0.97)`}}>
        <Link href="/">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{height:"44px", width:"auto", filter:"brightness(0) invert(1)"}}>
          </img>
        </Link>
        <div className="flex items-center gap-2">
          {["Ayakkabılar","İletişim"].map((l,i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                style={step>i+1 ? {background:MUV, color:DRK} : step===i+1 ? {background:PRI, color:MUV} : {background:`rgba(212,197,176,0.3)`, color:`rgba(45,26,46,0.35)`}}>
                {step>i+1 ? "✓" : i+1}
              </div>
              <span className="text-[11px] hidden md:block font-medium"
                style={{color: step===i+1 ? DRK : `rgba(45,26,46,0.3)`}}>{l}</span>
              {i<1 && <div className="w-8 h-px mx-1 hidden md:block" style={{background: step>i+1 ? MUV : STN}} />}
            </div>
          ))}
        </div>
      </header>'''

new2 = '''      {/* Nav */}
      <Nav active="/siparis" />
      {/* Adım göstergesi */}
      <div className="flex items-center justify-center gap-3 py-3 border-b"
        style={{borderColor: STN, background: BG}}>
        {["Ayakkabılar","İletişim"].map((l,i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
              style={step>i+1 ? {background:MUV, color:DRK} : step===i+1 ? {background:PRI, color:MUV} : {background:`rgba(212,197,176,0.3)`, color:`rgba(45,26,46,0.35)`}}>
              {step>i+1 ? "✓" : i+1}
            </div>
            <span className="text-[11px] font-medium"
              style={{color: step===i+1 ? DRK : `rgba(45,26,46,0.3)`}}>{l}</span>
            {i<1 && <div className="w-8 h-px mx-1" style={{background: step>i+1 ? MUV : STN}} />}
          </div>
        ))}
      </div>'''

result = content.replace(old2, new2)

# Eğer bulunamazsa daha basit replace dene
if old2 in content:
    content = result
else:
    # Header'ı bul ve Nav ile değiştir
    import re
    content = re.sub(
        r'\s*\{/\* Nav \*/\}\s*<header.*?</header>',
        '\n      {/* Nav */}\n      <Nav active="/siparis" />',
        content,
        flags=re.DOTALL
    )

open('app/siparis/page.tsx', 'w').write(content)
print("OK" if 'import Nav' in content else "HATA")
