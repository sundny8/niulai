import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { siteUrl, socialImage } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "牛来一下｜在线牛叫音效按钮",
    template: "%s"
  },
  description: "牛来一下是一个轻松好玩的在线牛叫音效按钮，点一下就能播放牛叫声，适合摸鱼、解压、开会前和分享给朋友。无需注册，召唤次数只保存在当前浏览器。",
  alternates: {
    canonical: "/zh",
    languages: {
      zh: "/zh",
      en: "/en"
    }
  },
  openGraph: {
    title: "牛来一下｜在线牛叫音效按钮",
    description: "点一下就能播放牛叫声，适合摸鱼、解压、开会前和分享给朋友。",
    type: "website",
    siteName: "牛来一下",
    url: siteUrl,
    images: [socialImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "牛来一下｜在线牛叫音效按钮",
    description: "点一下就能播放牛叫声，适合摸鱼、解压、开会前和分享给朋友。",
    images: [socialImage.url]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ecd9"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const lang = requestHeaders.get("x-niulai-locale") === "en" ? "en-US" : "zh-CN";

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
