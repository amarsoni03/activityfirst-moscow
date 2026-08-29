import type { ReactNode } from 'react';
import { Check, Clock } from 'lucide-react';

export function Chip({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'signal' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        tone === 'signal' ? 'bg-signal text-signal-ink' : 'bg-paper text-ink'
      }`}
    >
      {children}
    </span>
  );
}

export function Fact({
  icon: Icon,
  k,
  v,
}: {
  icon: typeof Clock;
  k: string;
  v: string;
}) {
  return (
    <div className="rounded-2xl bg-paper px-3.5 py-3.5">
      <Icon className="h-4 w-4 text-quiet" />
      <dt className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-quiet">{k}</dt>
      <dd className="mt-1 text-sm font-semibold leading-snug tracking-tight">{v}</dd>
    </div>
  );
}

export function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-snug">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
