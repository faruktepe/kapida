import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Temiz Gelsin — Ayakkabı Bakım & Onarım",
  description: "Temiz Gelsin kapıya premium ayakkabı bakım, temizlik ve onarım hizmeti. Temiz Gelsin — bırak biz halledelim.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={dmSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
