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
  const customAudios = useRef<{ mama: HTMLAudioElement; niulai: HTMLAudioElement } | null>(null);
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
    customAudios.current = {
      mama: new Audio("/sounds/mama.mp3"),
      niulai: new Audio("/sounds/niulai.mp3")
    };
    customAudios.current.mama.preload = "auto";
    customAudios.current.niulai.preload = "auto";
    customAudios.current.mama.volume = 1;
    customAudios.current.niulai.volume = 1;

    return () => {
      cowAudio.current?.pause();
      cowAudio.current = null;
      customAudios.current?.mama.pause();
      customAudios.current?.niulai.pause();
      customAudios.current = null;
    };
  }, []);

  async function playAudio(audio: HTMLAudioElement | null, maxDurationMs: number) {
    if (!audio) return false;

    try {
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
      window.setTimeout(() => audio.pause(), maxDurationMs);
      return true;
    } catch {
      return false;
    }
  }

  function playSpokenCall(kind: "mama" | "niulai") {
    if (!("speechSynthesis" in window)) return false;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      kind === "mama"
        ? locale === "zh"
          ? "妈妈"
          : "mama"
        : locale === "zh"
          ? "牛来"
          : "Niu Lai"
    );
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

  async function playRandomCall() {
    if (muted) return;

    const kind = Math.random() < 0.5 ? "mama" : "niulai";
    const custom = customAudios.current?.[kind] ?? null;
    const customPlayed = await playAudio(custom, 2600);
    if (customPlayed) return;

    const ttsPlayed = playSpokenCall(kind);
    if (ttsPlayed) return;

    const mooPlayed = await playAudio(cowAudio.current, 3200);
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
            <img className="cow-art cow-sketch" src="/images/niulai-sketch.svg" alt={copy.tapCow} />
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
