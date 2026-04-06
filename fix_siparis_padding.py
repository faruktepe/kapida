content = open('app/siparis/page.tsx').read()

# mt-[96px] yerine daha fazla
old = 'className="flex items-center justify-center gap-3 py-3 border-b mt-[96px]"'
new = 'className="flex items-center justify-center gap-3 py-3 border-b mt-[110px]"'
result = content.replace(old, new)

open('app/siparis/page.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI")
