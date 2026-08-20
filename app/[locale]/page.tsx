import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NiuLaiToy } from "./toy";
import { localeCode, siteUrl, socialImage } from "../site";

const copy = {
  zh: {
    title: "牛来一下",
    metaTitle: "牛来一下｜在线牛叫音效按钮",
    metaDescription: "牛来一下是一个轻松好玩的在线牛叫音效按钮，点一下就能播放牛叫声，适合摸鱼、解压、开会前和分享给朋友。无需注册，召唤次数只保存在当前浏览器。",
    eyebrow: "一按，牛来",
    headline: "牛来一下：在线牛叫音效",
    subline: "点击按钮或手绘牛，立即播放一声牛来。适合摸鱼、解压、开会前，或把一点玄学分享给朋友。",
    howItWorksTitle: "怎么玩",
    howItWorks: "点击按钮或手绘牛即可播放音效；召唤次数只保存在当前浏览器，不需要注册，也不会上传个人资料。",
    button: "叫“牛来”",
    tapCow: "牛也能点",
    calls: "次召唤",
    muted: "已静音",
    soundOn: "声音开",
    langLabel: "中文",
    share: "分享",
    shareWechat: "微信",
    shareX: "X",
    shareXhs: "小红书",
    copyLink: "复制链接",
    copied: "已复制",
    footer: "适合摸鱼、开会前、发朋友圈前，以及任何需要一点玄学推动的时刻。",
    shareText: "我刚刚召唤了一声牛来，你也试试：",
    about: "关于",
    contact: "联系",
    privacy: "隐私",
    terms: "条款",
    footerNav: "站点信息"
  },
  en: {
    title: "Niu Lai Button",
    metaTitle: "Niu Lai Button | Online Cow Sound Effect",
    metaDescription: "Niu Lai Button is a playful online cow sound effect. Tap the button or cow for an instant moo—no signup, just a tiny boost for breaks, launches, and group chats.",
    eyebrow: "one tap, one call",
    headline: "Niu Lai Button: Cow Sound Effect",
    subline: "Tap the button or the hand-drawn cow for an instant sound. A tiny, no-signup boost for breaks, launches, group chats, and more.",
    howItWorksTitle: "How it works",
    howItWorks: "Tap the button or cow to play a sound. Your call count stays in this browser; no account or personal profile is required.",
    button: "Call “Niu Lai”",
    tapCow: "the cow is clickable",
    calls: "calls",
    muted: "Muted",
    soundOn: "Sound on",
    langLabel: "EN",
    share: "Share",
    shareWechat: "WeChat",
    shareX: "X",
    shareXhs: "RED",
    copyLink: "Copy link",
    copied: "Copied",
    footer: "For breaks, launches, group chats, and any moment that needs a little unreasonable forward motion.",
    shareText: "I just called Niu Lai. Your turn:",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    footerNav: "Site information"
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
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: `/${safeLocale}`,
      languages: {
        zh: "/zh",
        en: "/en"
      }
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      type: "website",
      url: `${siteUrl}/${safeLocale}`,
      locale: localeCode(safeLocale).replace("-", "_"),
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
      images: [socialImage.url]
    }
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "zh" && locale !== "en") notFound();

  const safeLocale: Locale = locale === "en" ? "en" : "zh";
  const t = copy[safeLocale];
  const pageUrl = `${siteUrl}/${safeLocale}`;
  const language = localeCode(safeLocale);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${pageUrl}#website`,
      url: pageUrl,
      name: t.title,
      description: t.metaDescription,
      inLanguage: language,
      publisher: {
        "@type": "Organization",
        name: "牛来一下"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${pageUrl}#application`,
      name: t.title,
      url: pageUrl,
      description: t.metaDescription,
      image: `${siteUrl}${socialImage.url}`,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web",
      inLanguage: language
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <NiuLaiToy locale={safeLocale} copy={t} />
    </>
  );
}
