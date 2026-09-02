import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/components/PlayerProvider";
import Player from "@/components/Player";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-body",
  display: "swap"
});

// از همان فونت برای نمایش (تیتر) با وزن سنگین‌تر استفاده می‌شود
const vazirDisplay = Vazirmatn({
  subsets: ["arabic"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap"
});

export const metadata = {
  title: "سایکو | PSYCHO",
  description: "سایت رسمی سایکو — هنرمند هیپ‌هاپ و ترپ فارسی"
};

export const viewport = {
  themeColor: "#08060a"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${vazirDisplay.variable}`}>
      <body className="font-body antialiased">
        <PlayerProvider>
          {children}
          <Player />
        </PlayerProvider>
      </body>
    </html>
  );
}
