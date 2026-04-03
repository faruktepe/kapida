content = open('components/SlotSecici.tsx').read()

# 2 saat kuralına 21:00 ve pazar kurallarını da ekle
old = '''        const filtered = data.filter((slot) => {
          const slotDt = new Date(slot.date + "T" + slot.start_time);
          return slotDt > enErken;
        });'''

new = '''        const filtered = data.filter((slot) => {
          const slotDt = new Date(slot.date + "T" + slot.start_time);
          // 2 saat kuralı
          if (slotDt <= enErken) return false;
          // 21:00 sonrası gösterme
          const startHour = parseInt(slot.start_time.split(":")[0]);
          if (startHour >= 21) return false;
          // Pazar günleri hizmet yok (0 = Pazar)
          const slotDate = new Date(slot.date + "T00:00:00");
          if (slotDate.getDay() === 0) return false;
          return true;
        });'''

result = content.replace(old, new)
open('components/SlotSecici.tsx', 'w').write(result)
print("OK" if old not in result else "BULUNAMADI")
