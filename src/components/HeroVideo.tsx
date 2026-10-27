"use client";
import { useRef, useState } from "react";

// Browsers only autoplay muted video, so it starts muted and the guest opts in to sound.
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !muted;
    if (muted) v.play().catch(() => {});
    setMuted(!muted);
  };

  return (
    <div className="hero-video">
      <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-label="Our AI robot photographer at an event" />
      <button type="button" className="unmute" onClick={toggle} aria-pressed={!muted}>
        {muted ? "🔊 Unmute" : "🔇 Mute"}
      </button>
    </div>
  );
}
