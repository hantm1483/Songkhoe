import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "@/styles/globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bevietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sổ Tay Tiểu Đường",
  description: "Ứng dụng quản lý sức khỏe tiểu đường - The Compassionate Guardian",
  keywords: ["diabetes", "health", "blood glucose", "vietnamese healthcare"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#006262",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-screen bg-surface antialiased font-body">{children}</body>
    </html>
  );
}