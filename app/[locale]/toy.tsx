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

const clickSoundPaths = [
  "/sounds/video-call-1.mp3",
  "/sounds/video-call-2.mp3",
  "/sounds/video-call-3.mp3"
] as const;

export function NiuLaiToy({ locale, copy }: Props) {
  const [calls, setCalls] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const clickAudios = useRef<HTMLAudioElement[]>([]);
  const cowAudio = useRef<HTMLAudioElement | null>(null);
  const lastSoundIndex = useRef(-1);
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
    clickAudios.current = clickSoundPaths.map((path) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = 1;
      return audio;
    });

    return () => {
      cowAudio.current?.pause();
      cowAudio.current = null;
      clickAudios.current.forEach((audio) => audio.pause());
      clickAudios.current = [];
    };
  }, []);

  async function playAudio(audio: HTMLAudioElement | null) {
    if (!audio) return false;

    try {
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch {
      return false;
    }
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

  async function playRandomCall() {
    if (muted) return;

    if (clickAudios.current.length > 0) {
      let nextIndex = Math.floor(Math.random() * clickAudios.current.length);
      if (clickAudios.current.length > 1 && nextIndex === lastSoundIndex.current) {
        nextIndex = (nextIndex + 1) % clickAudios.current.length;
      }
      lastSoundIndex.current = nextIndex;
      const clickSoundPlayed = await playAudio(clickAudios.current[nextIndex]);
      if (clickSoundPlayed) return;
    }

    const mooPlayed = await playAudio(cowAudio.current);
    if (!mooPlayed) playFallbackTone();
  }

  function callCow() {
    setCalls((value) => value + 1);
    setIsCalling(true);
    void playRandomCall();
    window.setTimeout(() => setIsCalling(false), 560);
  }

  function sharePayload() {
    const url = window.location.href;
    const text = `${copy.shareText} ${url}`;
    return { url, text };
  }

  async function writeClipboard(value: string) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        return;
      }
    } catch {
      // Fall through to the textarea-based fallback for non-secure contexts.
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function markCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function copyShareLink() {
    const { url } = sharePayload();
    await writeClipboard(url);
    markCopied();
    setShareOpen(true);
  }

  async function copyShareText() {
    const { text } = sharePayload();
    await writeClipboard(text);
    markCopied();
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
            <img className="cow-art cow-sketch" src="/images/niulai-sketch.png" alt={copy.tapCow} />
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
              <button className="share-button" type="button" onClick={copyShareLink}>
                {copied ? copy.copied : copy.share}
              </button>
              <div className={`share-menu ${shareOpen ? "is-open" : ""}`}>
                <button type="button" onClick={copyShareLink}>{copy.copyLink}</button>
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
