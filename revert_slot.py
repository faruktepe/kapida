content = open('app/siparis/page.tsx').read()

# 1. SlotType ve SlotSecici component'ini kaldır
import re
content = re.sub(
    r'\ntype SlotType = \{.*?\n\nfunction bos\(\)',
    '\n\nfunction bos()',
    content,
    flags=re.DOTALL
)

# 2. slot state'lerini kaldır
content = content.replace(
    "\n  const [slots, setSlots] = useState<{id:string; date:string; start_time:string; end_time:string; capacity:number; booked:number}[]>([]);\n  const [seciliSlot, setSeciliSlot] = useState<string | null>(null);",
    ""
)

# 3. slot useEffect'i kaldır
content = re.sub(
    r'  // Slotları yükle\n  useEffect\(\(\) => \{.*?\}, \[\]\);\n\n  const updateAyakkabi',
    '  const updateAyakkabi',
    content,
    flags=re.DOTALL
)

# 4. slotRef kaldır
content = content.replace("\n  const slotRef = useRef<HTMLDivElement>(null);", "")

# 5. slot validasyonu kaldır
content = content.replace("    // slot validasyonu geçici devre dışı\n", "")

# 6. slot insert alanlarını kaldır
content = content.replace(
    "\n      slot_id: seciliSlot || null,\n      slot_date: seciliSlot ? slots.find(s => s.id === seciliSlot)?.date : null,\n      slot_time: seciliSlot ? (() => { const s = slots.find(sl => sl.id === seciliSlot); return s ? `${s.start_time.slice(0,5)}-${s.end_time.slice(0,5)}` : null; })() : null,",
    ""
)

# 7. Slot UI bloğunu kaldır
content = re.sub(
    r'            \{/\* Saat Seçimi \*/\}.*?            \{/\* Tercih \*/\}',
    '            {/* Tercih */}',
    content,
    flags=re.DOTALL
)

open('app/siparis/page.tsx', 'w').write(content)
print("OK")
