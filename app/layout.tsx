import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { siteUrl, socialImage } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "牛来一下 | Niu Lai Button",
    template: "%s"
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
    type: "website",
    siteName: "牛来一下",
    url: siteUrl,
    images: [socialImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "牛来一下 | Niu Lai Button",
    description: "One tap, one Niu Lai. Tap the cow and make the day move.",
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
