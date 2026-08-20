import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = {
  title: "联系我们",
  description: "通过 GitHub Issues 联系牛来一下项目维护者。"
};

export default function ContactPage() {
  return (
    <InfoPage eyebrow="联系与反馈" title="把想法递给这头牛" intro="如果你发现了问题，或想让牛来一下增加新的声音，欢迎在项目仓库里告诉我们。">
      <p>最直接的方式是在 <a href="https://github.com/sundny8/niulai/issues">GitHub Issues</a> 提交反馈。请尽量写清楚设备、浏览器和复现步骤。</p>
      <p>项目仓库：<a href="https://github.com/sundny8/niulai">github.com/sundny8/niulai</a></p>
    </InfoPage>
  );
}
