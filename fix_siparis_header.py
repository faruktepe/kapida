content = open('app/siparis/page.tsx').read()

# Nav import'unu kaldır
content = content.replace(
    'import Nav from "@/components/Nav";\n',
    ''
)

# Nav ve adım göstergesini eski header ile değiştir
old = '''      {/* Nav */}
      <Nav active="/siparis" />
      {/* Adım göstergesi */}
      <div className="flex items-center justify-center gap-3 py-3 border-b mt-[110px]"
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

new = '''      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b backdrop-blur-md"
        style={{borderColor:STN, background:`rgba(245,240,232,0.97)`}}>
        <Link href="/">
          <img src="/temizgelsin-logo.png?v=1" alt="Temiz Gelsin" style={{height:"44px", width:"auto"}} />
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

result = content.replace(old, new)
open('app/siparis/page.tsx', 'w').write(result)
print("OK" if 'import Nav' not in result else "HATA")
