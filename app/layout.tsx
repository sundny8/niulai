import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3050";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "牛来一下 | Niu Lai Button",
    template: "%s | 牛来一下"
  },
  description: "点一下，召唤一声牛来。一个轻松、好玩的在线音效按钮。",
  alternates: {
    canonical: "/zh",
    languages: {
      zh: "/zh",
      en: "/en"
    }
  },
  openGraph: {
    title: "牛来一下 | Niu Lai Button",
    description: "One tap, one Niu Lai. Tap the cow and make the day move.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ecd9"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
