content = open('components/ScratchReveal.tsx').read()

# Arka plan rengini koyu morumuza çevir
content = content.replace(
    "bg.style.cssText = `position:fixed;inset:0;z-index:58;background:#2D1A2E;`;",
    "bg.style.cssText = `position:fixed;inset:0;z-index:58;background:#2D1A2E;`;"
)

# Canvas fill rengini #160820'den #2D1A2E'ye çevir (DRK rengimiz)
content = content.replace(
    'ctx.fillStyle = "#160820";',
    'ctx.fillStyle = "#2D1A2E";'
)

# Scratch canvas rengini PRI'dan DRK'ya çevir - daha koyu görünsün
content = content.replace(
    'ctx.fillStyle = "#5B2D6E";',
    'ctx.fillStyle = "#2D1A2E";'
)

open('components/ScratchReveal.tsx', 'w').write(content)
print("OK")
