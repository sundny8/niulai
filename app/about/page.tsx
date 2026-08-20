import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解牛来一下这个轻量、好玩的在线音效按钮项目。"
};

export default function AboutPage() {
  return (
    <InfoPage eyebrow="关于牛来一下" title="让一点玄学推动今天" intro="牛来一下是一个轻量的网页玩具：点一下按钮，召唤一声牛来，也给忙碌的日常留一个小小的暂停键。">
      <p>本站由独立创作者维护，页面使用手绘牛形象、短音效和本地计数，尽量做到打开即用、不需要注册。</p>
      <p>项目代码与更新记录公开在 <a href="https://github.com/sundny8/niulai">GitHub</a>，欢迎提交建议、问题或有趣的音效想法。</p>
    </InfoPage>
  );
}
