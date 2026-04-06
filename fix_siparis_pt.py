content = open('app/siparis/page.tsx').read()
old = '<div className="max-w-2xl mx-auto px-6 py-10">'
new = '<div className="max-w-2xl mx-auto px-6 pt-20 pb-10">'
result = content.replace(old, new)
open('app/siparis/page.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI")
