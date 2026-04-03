content = open('app/admin/page.tsx').read()

# 1. Order tipine slot alanları ekle
old = '''type Order = {
  id: string;
  created_at: string;
  status: string;
  order_number: string;
  customer_info: unknown;
  services: unknown;
  price: string;
  brand: string;
  model?: string | null;
  color: string;
  shoe_type: string;
};'''

new = '''type Order = {
  id: string;
  created_at: string;
  status: string;
  order_number: string;
  customer_info: unknown;
  services: unknown;
  price: string;
  brand: string;
  model?: string | null;
  color: string;
  shoe_type: string;
  slot_date?: string | null;
  slot_time?: string | null;
};'''

content = content.replace(old, new)

# 2. Sipariş tarihi gösteriminin altına slot bilgisi ekle
old2 = '''                            <p className="mt-2 text-xs text-black/40">
                              {formatDateTimeTR(order.created_at)}
                            </p>'''

new2 = '''                            <p className="mt-2 text-xs text-black/40">
                              {formatDateTimeTR(order.created_at)}
                            </p>
                            {order.slot_date && order.slot_time && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                style={{background:"rgba(91,45,110,0.08)", color:"#5B2D6E"}}>
                                🕐 {new Date(order.slot_date + "T00:00:00").toLocaleDateString("tr-TR", {day:"numeric", month:"long"})} — {order.slot_time}
                              </div>
                            )}'''

content = content.replace(old2, new2)

open('app/admin/page.tsx', 'w').write(content)
print("OK" if 'slot_date' in content else "HATA")
