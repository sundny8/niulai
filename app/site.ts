export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://niulai.kgq.ai").replace(/\/+$/, "");

export const localePaths = ["zh", "en"] as const;

export function localeCode(locale: "zh" | "en") {
  return locale === "zh" ? "zh-CN" : "en-US";
}

export const socialImage = {
  url: "/images/niulai-q.webp",
  width: 760,
  height: 1140,
  alt: "牛来一下，轻松好玩的在线音效按钮"
};
