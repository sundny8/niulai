"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ToyCopy = {
  title: string;
  eyebrow: string;
  headline: string;
  subline: string;
  button: string;
  tapCow: string;
  calls: string;
  muted: string;
  soundOn: string;
  langLabel: string;
  share: string;
  copied: string;
  footer: string;
  shareText: string;
};

type Props = {
  locale: "zh" | "en";
  copy: ToyCopy;
};

export function NiuLaiToy({ locale, copy }: Props) {
  const [calls, setCalls] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const storageKey = `niulai:calls:${locale}`;
  const otherLocale = locale === "zh" ? "en" : "zh";

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setCalls(Number.parseInt(saved, 10) || 0);
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(calls));
  }, [calls, storageKey]);

  const callLabel = useMemo(() => {
    if (locale === "zh") return calls === 0 ? "还没开始" : `${calls} ${copy.calls}`;
    return calls === 1 ? "1 call" : `${calls} ${copy.calls}`;
  }, [calls, copy.calls, locale]);

  function playNiuLai() {
    if (muted) return;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = audioContext.current ?? new AudioCtor();
    audioContext.current = ctx;

    const now = ctx.currentTime;
    const syllables = [
      { start: 0, freq: 190, end: 156, duration: 0.18 },
      { start: 0.2, freq: 247, end: 210, duration: 0.24 }
    ];

    syllables.forEach((part) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(part.freq, now + part.start);
      oscillator.frequency.exponentialRampToValueAtTime(part.end, now + part.start + part.duration);
      gain.gain.setValueAtTime(0.0001, now + part.start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + part.start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + part.start + part.duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + part.start);
      oscillator.stop(now + part.start + part.duration + 0.04);
    });
  }

  function callCow() {
    setCalls((value) => value + 1);
    setIsCalling(true);
    playNiuLai();
    window.setTimeout(() => setIsCalling(false), 560);
  }

  async function share() {
    const url = window.location.href;
    const text = `${copy.shareText} ${url}`;

    if (navigator.share) {
      await navigator.share({ title: copy.title, text, url }).catch(() => undefined);
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="sheet-shell">
      <section className="sheet" aria-label={copy.title}>
        <header className="topbar">
          <a className="brand" href={`/${locale}`} aria-label={copy.title}>
            <span className="coin">牛</span>
            <span>
              <strong>NIU LAI</strong>
              <small>{copy.eyebrow}</small>
            </span>
          </a>

          <nav className="actions" aria-label="page controls">
            <a className="pill" href={`/${otherLocale}`}>
              {copy.langLabel}
            </a>
            <button className="icon-button" type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? copy.muted : copy.soundOn}>
              {muted ? "×" : "))"}
            </button>
          </nav>
        </header>

        <div className="stage">
          <button className={`cow-card ${isCalling ? "is-calling" : ""}`} type="button" onClick={callCow} aria-label={copy.tapCow}>
            <span className="paper-grain" />
            <span className="cow">
              <span className="horn horn-left" />
              <span className="horn horn-right" />
              <span className="ear ear-left" />
              <span className="ear ear-right" />
              <span className="head">
                <span className="eye eye-left" />
                <span className="eye eye-right" />
                <span className="muzzle">
                  <span className="nostril nostril-left" />
                  <span className="nostril nostril-right" />
                  <span className="mouth" />
                </span>
              </span>
              <span className="body" />
              <span className="arm arm-left" />
              <span className="arm arm-right" />
              <span className="leg leg-left" />
              <span className="leg leg-right" />
              <span className="tail" />
            </span>
          </button>

          <aside className="control-panel">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.headline}</h1>
            <p className="subline">{copy.subline}</p>

            <button className={`call-button ${isCalling ? "is-calling" : ""}`} type="button" onClick={callCow}>
              <span>*</span>
              {copy.button}
            </button>

            <div className="stats">
              <span>{callLabel}</span>
              <span>{muted ? copy.muted : copy.soundOn}</span>
            </div>

            <button className="share-button" type="button" onClick={share}>
              {copied ? copy.copied : copy.share}
            </button>
          </aside>
        </div>

        <footer>{copy.footer}</footer>
      </section>
    </main>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
