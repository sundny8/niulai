import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "牛来一下如何处理浏览器本地数据与音频播放。"
};

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="隐私政策" title="尽量少收集，打开就能玩" intro="牛来一下不要求注册，也不主动收集姓名、邮箱或其他个人身份信息。">
      <h2>浏览器本地数据</h2>
      <p>召唤次数只保存在你当前浏览器的 localStorage 中，用于保留页面上的次数显示。清除浏览器站点数据后，这个数字会被清除。</p>
      <h2>音频与第三方服务</h2>
      <p>点击按钮时，页面会在你的设备上播放音频。分享功能只会在你主动点击时打开对应的分享地址或写入剪贴板。</p>
      <h2>更新</h2>
      <p>如果隐私处理方式发生变化，我们会在本页更新说明。</p>
    </InfoPage>
  );
}
