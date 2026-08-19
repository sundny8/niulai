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
  shareWechat: string;
  shareX: string;
  shareXhs: string;
  copyLink: string;
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
  const [shareOpen, setShareOpen] = useState(false);
  const cowAudio = useRef<HTMLAudioElement | null>(null);
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

  useEffect(() => {
    cowAudio.current = new Audio("/sounds/cow-moos-cc0.mp3");
    cowAudio.current.preload = "auto";
    cowAudio.current.volume = 0.9;

    return () => {
      cowAudio.current?.pause();
      cowAudio.current = null;
    };
  }, []);

  function playCowMoo() {
    const audio = cowAudio.current;
    if (!audio) return false;

    audio.pause();
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
    window.setTimeout(() => audio.pause(), 3200);
    return true;
  }

  function playMamaCall() {
    if (!("speechSynthesis" in window)) return false;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(locale === "zh" ? "牛来，牛来，快回来吃饭啦" : "Niu Lai, Niu Lai, come here");
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("zh"));
    if (zhVoice) utterance.voice = zhVoice;
    utterance.lang = locale === "zh" ? "zh-CN" : "en-US";
    utterance.pitch = 1.25;
    utterance.rate = 0.92;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function playFallbackTone() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(128, now);
    oscillator.frequency.exponentialRampToValueAtTime(86, now + 0.42);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.52);
  }

  function playRandomCall() {
    if (muted) return;

    const played = Math.random() < 0.5 ? playCowMoo() : playMamaCall();
    if (!played) playFallbackTone();
  }

  function callCow() {
    setCalls((value) => value + 1);
    setIsCalling(true);
    playRandomCall();
    window.setTimeout(() => setIsCalling(false), 560);
  }

  function sharePayload() {
    const url = window.location.href;
    const text = `${copy.shareText} ${url}`;
    return { url, text };
  }

  async function copyShareText() {
    const { text } = sharePayload();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function shareNative() {
    const { url, text } = sharePayload();

    if (navigator.share) {
      await navigator.share({ title: copy.title, text, url }).catch(() => undefined);
      return;
    }

    setShareOpen((value) => !value);
  }

  function shareToX() {
    const { text } = sharePayload();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="sheet-shell">
      <section className="sheet" aria-label={copy.title}>
        <header className="topbar">
          <a className="brand" href={`/${locale}`} aria-label={copy.title}>
            <span className="coin">牛</span>
            <span>
              <strong>牛来</strong>
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
            <span className="tap-burst">点我</span>
            <img className="cow-art" src="/images/niulai-q.webp" alt={copy.tapCow} />
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

            <div className="share-box">
              <button className="share-button" type="button" onClick={shareNative}>
                {copy.share}
              </button>
              <div className={`share-menu ${shareOpen ? "is-open" : ""}`}>
                <button type="button" onClick={copyShareText}>{copied ? copy.copied : copy.copyLink}</button>
                <button type="button" onClick={copyShareText}>{copy.shareWechat}</button>
                <button type="button" onClick={shareToX}>{copy.shareX}</button>
                <button type="button" onClick={copyShareText}>{copy.shareXhs}</button>
              </div>
            </div>
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
