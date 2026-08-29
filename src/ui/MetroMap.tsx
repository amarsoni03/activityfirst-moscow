import { LINES, STATIONS } from '../lib/metro';
import type { Activity } from '../lib/types';
import { MetroDot } from './bits';

export function MetroMap({
  activities,
  onStation,
}: {
  activities: Activity[];
  onStation: (id: string) => void;
}) {
  const counts = new Map<string, number>();
  for (const a of activities) {
    if (!a.metroStationId) continue;
    counts.set(a.metroStationId, (counts.get(a.metroStationId) ?? 0) + 1);
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-hair bg-paper">
      <div className="flex items-start justify-between gap-3 px-4 py-4 sm:items-center sm:px-5">
        <div className="min-w-0">
          <p className="font-display text-lg sm:text-xl">The city as stations</p>
          <p className="text-sm text-quiet">Tap a node to see what meets nearby.</p>
        </div>
        <div className="-mr-4 flex max-w-[50%] gap-2 overflow-x-auto no-scrollbar sm:mr-0 sm:max-w-none sm:flex">
          {LINES.map((l) => (
            <span key={l.id} className="flex shrink-0 items-center gap-1 text-[11px] text-quiet">
              <MetroDot color={l.color} size={7} />
              {l.short}
            </span>
          ))}
        </div>
      </div>
      <div className="-mx-px overflow-x-auto">
        <div className="relative mx-auto aspect-[4/3] min-w-[320px] max-w-3xl">
        <svg viewBox="0 0 100 80" className="h-full w-full">
          {LINES.map((line) => {
            const pts = STATIONS.filter((s) => s.lineId === line.id);
            if (pts.length < 2) return null;
            const d = pts.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y * 0.8}`).join(' ');
            return (
              <path
                key={line.id}
                d={d}
                fill="none"
                stroke={line.color}
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.85"
              />
            );
          })}
          {STATIONS.map((s) => {
            const n = counts.get(s.id) ?? 0;
            return (
              <g key={s.id} className="cursor-pointer" onClick={() => onStation(s.id)}>
                <circle cx={s.x} cy={s.y * 0.8} r={n > 0 ? 2.1 : 1.35} fill="#fffdf8" stroke={s.lineColor} strokeWidth="0.7" />
                {n > 0 && (
                  <text
                    x={s.x}
                    y={s.y * 0.8 - 3.2}
                    textAnchor="middle"
                    fontSize="2.2"
                    fill="#161411"
                    fontFamily="Figtree, sans-serif"
                  >
                    {n}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        </div>
      </div>
      <ul className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto border-t border-hair p-3 sm:grid-cols-2">
        {STATIONS.filter((s) => (counts.get(s.id) ?? 0) > 0)
          .slice(0, 12)
          .map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onStation(s.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-canvas"
              >
                <MetroDot color={s.lineColor} />
                {s.name}
                <span className="ml-auto text-xs text-quiet">{counts.get(s.id)}</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
