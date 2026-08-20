import Link from "next/link";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
  return (
    <main className="info-shell">
      <article className="info-page">
        <header className="info-header">
          <Link className="brand" href="/zh" aria-label="返回牛来一下首页">
            <span className="coin" aria-hidden="true">牛</span>
            <span>
              <strong>牛来</strong>
              <small>一按，牛来</small>
            </span>
          </Link>
          <nav className="info-nav" aria-label="站点导航">
            <Link href="/about">关于</Link>
            <Link href="/contact">联系</Link>
            <Link href="/privacy">隐私</Link>
            <Link href="/terms">条款</Link>
          </nav>
        </header>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="info-intro">{intro}</p>
        <div className="info-content">{children}</div>
        <Link className="call-button info-link" href="/zh">回到首页</Link>
      </article>
    </main>
  );
}
