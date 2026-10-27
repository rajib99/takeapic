"use client";
import { useEffect, useRef } from "react";

// Muted looping clip that only downloads/plays while on screen.
export function LazyVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = src;
        v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: "200px" });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={label} className={className} />;
}
