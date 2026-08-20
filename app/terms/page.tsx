import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = {
  title: "服务条款",
  description: "使用牛来一下网页玩具时适用的简单服务条款。"
};

export default function TermsPage() {
  return (
    <InfoPage eyebrow="服务条款" title="轻松使用，友善分享" intro="牛来一下是一个免费网页玩具。使用本站即表示你理解并接受以下简单约定。">
      <h2>合理使用</h2>
      <p>请以合法、友善的方式使用本站，不要尝试干扰服务、滥用分享功能或上传未经授权的内容。</p>
      <h2>可用性</h2>
      <p>我们会尽力保持服务可用，但不承诺任何时间、任何设备上都不会中断。音频是否能播放也可能受到浏览器权限和设备设置影响。</p>
      <h2>更新</h2>
      <p>本站可能随时调整页面、音效或条款内容；继续使用即表示接受更新后的版本。</p>
    </InfoPage>
  );
}
