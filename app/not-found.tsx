import Link from "next/link";

export default function NotFound() {
  return (
    <main className="info-shell">
      <article className="info-page">
        <p className="eyebrow">404 / 没找到</p>
        <h1>这头牛走丢了</h1>
        <p>页面不存在，但牛来一下还在。</p>
        <Link className="call-button info-link" href="/zh">回到首页</Link>
      </article>
    </main>
  );
}
