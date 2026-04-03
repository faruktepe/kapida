content = open('app/siparis/page.tsx').read()

old = '              setError(""); setStep(2);'
new = '              setError(""); setStep(2); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);'

result = content.replace(old, new)
open('app/siparis/page.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI")
