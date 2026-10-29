import { Fragment, type ReactNode } from "react";

/** "The photo booth with a *robot photographer*." -> accent-coloured span. */
export function rich(s: string): ReactNode {
  return s.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 ? <span key={i} className="accent">{part}</span> : <Fragment key={i}>{part}</Fragment>,
  );
}
