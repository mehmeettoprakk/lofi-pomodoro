import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lofi Pomodoro: Odaklan & Rahatla",
  description:
    "Lofi müzik eşliğinde Pomodoro tekniği ile verimliliğinizi artırın. Çalışma ve mola sürelerinizi ayarlayarak daha etkili bir şekilde odaklanın.",
  keywords: [
    "pomodoro",
    "lofi",
    "odaklanma",
    "verimlilik",
    "çalışma tekniği",
    "lofi hip hop",
    "ders çalışma",
    "zaman yönetimi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
