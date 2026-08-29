import { useEffect, useState } from 'react';

export function useMinWidth(px: number) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(min-width: ${px}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);

  return match;
}

export function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);
}

/** Visible viewport height and keyboard overlap — keeps bottom sheets above the iOS keyboard. */
export function useVisualViewport(active: boolean) {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return { height: 0, inset: 0 };
    const vv = window.visualViewport;
    const height = Math.round(vv?.height ?? window.innerHeight);
    const inset = Math.max(
      0,
      Math.round(window.innerHeight - (vv?.height ?? window.innerHeight) - (vv?.offsetTop ?? 0)),
    );
    return { height, inset };
  });

  useEffect(() => {
    if (!active) return;
    const update = () => {
      const vv = window.visualViewport;
      const height = Math.round(vv?.height ?? window.innerHeight);
      const inset = Math.max(
        0,
        Math.round(window.innerHeight - (vv?.height ?? window.innerHeight) - (vv?.offsetTop ?? 0)),
      );
      setView({ height, inset });
    };
    update();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  return view;
}
