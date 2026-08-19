import type { Metadata } from "next";
import { NiuLaiToy } from "./toy";

const copy = {
  zh: {
    title: "牛来一下",
    eyebrow: "一按，牛来",
    headline: "叫一声牛来",
    subline: "点按钮，或者直接点这头牛。声音会来，运气也可以顺路来。",
    button: "叫“牛来”",
    tapCow: "牛也能点",
    calls: "次召唤",
    muted: "已静音",
    soundOn: "声音开",
    langLabel: "EN",
    share: "分享",
    copied: "已复制",
    footer: "适合摸鱼、开会前、发朋友圈前，以及任何需要一点玄学推动的时刻。",
    shareText: "我刚刚召唤了一声牛来，你也试试："
  },
  en: {
    title: "Niu Lai Button",
    eyebrow: "one tap, one call",
    headline: "Call Niu Lai",
    subline: "Tap the button or poke the cow. A tiny soundboard for momentum, luck, and deeply unserious focus.",
    button: "Call “Niu Lai”",
    tapCow: "the cow is clickable",
    calls: "calls",
    muted: "Muted",
    soundOn: "Sound on",
    langLabel: "中文",
    share: "Share",
    copied: "Copied",
    footer: "For breaks, launches, group chats, and any moment that needs a little unreasonable forward motion.",
    shareText: "I just called Niu Lai. Your turn:"
  }
} as const;

type Locale = keyof typeof copy;

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "en" ? "en" : "zh";
  const t = copy[safeLocale];

  return {
    title: t.title,
    description: t.subline,
    alternates: {
      canonical: `/${safeLocale}`,
      languages: {
        zh: "/zh",
        en: "/en"
      }
    }
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "zh";
  return <NiuLaiToy locale={safeLocale} copy={copy[safeLocale]} />;
}
