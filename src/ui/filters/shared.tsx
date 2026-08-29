import { useMemo, useState } from 'react';
import { Check, ChevronDown, MapPin, Search } from 'lucide-react';
import { CATEGORIES } from '../../lib/catalog';
import { isWeekend, isWeekdays, money, todayName } from '../../lib/format';
import { HUBS, LINES, STATIONS } from '../../lib/metro';
import { useApp } from '../../state';
import type { Audience, Delivery, FilterState } from '../../lib/types';
import { DAYS, TIMES } from '../../lib/types';
import { MetroDot } from '../bits';

const PRICE_CAP = 50_000;
const PRICE_PRESETS = [3000, 6000, 12000, 25000];
const WALK_PRESETS = [5, 10, 15];
export const RATING_PRESETS = [4.8, 4.5, 4];

export const AUDIENCES: { id: Audience; label: string }[] = [
  { id: 'Adults', label: 'Adults' },
  { id: 'Children', label: 'Kids' },
  { id: 'Corporate', label: 'Teams' },
];

export const FORMAT_LABEL: Record<Delivery, string> = {
  'In Person': 'In person',
  'Live Online': 'Online',
  Hybrid: 'Hybrid',
  'Self-Paced': 'Self-paced',
};

export function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function isOnlineOnly(f: FilterState) {
  return f.delivery.length > 0 && f.delivery.every((d) => d === 'Live Online' || d === 'Self-Paced');
}

export function metroSummary(f: FilterState) {
  const station = STATIONS.find((s) => s.id === f.metroStationIds[0]);
  const line = LINES.find((l) => l.id === f.metroLineId);
  const parts: string[] = [];
  if (station) parts.push(station.name);
  else if (line) parts.push(line.short);
  if (f.maxWalk !== undefined) parts.push(`${f.maxWalk} min`);
  return parts.join(' · ') || undefined;
}

export function moreSummary(f: FilterState) {
  const parts: string[] = [];
  if (f.audience && f.audience !== 'Adults') {
    parts.push(f.audience === 'Corporate' ? 'Teams' : f.audience === 'Children' ? 'Kids' : f.audience);
  }
  if (!(f.delivery.length === 1 && f.delivery[0] === 'In Person')) {
    parts.push(f.delivery.length ? f.delivery.map((d) => FORMAT_LABEL[d]).join(', ') : 'Any format');
  }
  if (f.level) parts.push(f.level);
  if (f.language) parts.push(f.language);
  if (f.minRating) parts.push(`${f.minRating}+`);
  if (f.goals.length) parts.push(f.goals[0]);
  if (f.category) parts.push(f.category);
  if (f.templates.length) parts.push(f.templates[0]);
  if (f.instantOnly) parts.push('Book now');
  if (f.openSeats) parts.push('Seats left');
  if (f.newOnly) parts.push('New');
  return parts.length ? parts.slice(0, 3).join(' · ') : undefined;
}

export function whenSummary(f: FilterState) {
  const tonight =
    f.days.length === 1 && f.days[0] === todayName() && f.timeOfDay.includes('Evening');
  if (tonight) return 'Tonight';
  if (isWeekdays(f.days) && f.timeOfDay.length === 0) return 'Weekdays';
  if (isWeekend(f.days) && f.timeOfDay.length === 0) return 'Weekend';
  const parts: string[] = [];
  if (f.days.length) parts.push(f.days.map((d) => d.slice(0, 3)).join(', '));
  if (f.timeOfDay.length) parts.push(f.timeOfDay.join(', '));
  return parts.join(' · ') || undefined;
}

export function MetroStationControls() {
  const { state, setFilter } = useApp();
  const f = state.filters;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const selected = STATIONS.find((s) => s.id === f.metroStationIds[0]);

  const stations = useMemo(() => {
    const pool = f.metroLineId ? STATIONS.filter((s) => s.lineId === f.metroLineId) : STATIONS;
    if (!q.trim()) return pool;
    const n = q.toLowerCase();
    return pool.filter(
      (s) =>
        s.name.toLowerCase().includes(n) ||
        s.nameRu.toLowerCase().includes(n) ||
        s.district.toLowerCase().includes(n),
    );
  }, [f.metroLineId, q]);

  const pick = (id?: string) => {
    if (!id) {
      setFilter('metroStationIds', []);
    } else {
      const s = STATIONS.find((x) => x.id === id);
      if (s) {
        setFilter('metroLineId', s.lineId);
        setFilter('metroStationIds', [s.id]);
      }
    }
    setOpen(false);
    setQ('');
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-2xl border px-3 text-left transition ${
          selected ? 'border-ink bg-ink text-paper' : 'border-hair bg-canvas hover:bg-warm'
        }`}
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <MetroDot color={selected.lineColor} size={8} />
                <span className="truncate">{selected.name}</span>
              </span>
              <span className={`mt-0.5 block truncate text-[11px] ${selected ? 'text-paper/70' : 'text-quiet'}`}>
                {selected.district}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-quiet">Choose a station</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 opacity-60 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className="-mx-1 mt-2.5 flex gap-1.5 overflow-x-auto px-1 pb-0.5 no-scrollbar">
        {HUBS.map((id) => {
          const s = STATIONS.find((x) => x.id === id);
          if (!s) return null;
          const on = f.metroStationIds[0] === s.id;
          return (
            <Chip
              key={s.id}
              on={on}
              onClick={() => {
                if (on) {
                  setFilter('metroStationIds', []);
                  setFilter('metroLineId', undefined);
                } else {
                  setFilter('metroLineId', s.lineId);
                  setFilter('metroStationIds', [s.id]);
                  setOpen(false);
                }
              }}
            >
              <MetroDot color={s.lineColor} size={7} />
              {s.name}
            </Chip>
          );
        })}
      </div>

      {open ? (
        <div className="mt-2 overflow-hidden rounded-2xl border border-hair bg-paper">
          <div className="flex gap-1 overflow-x-auto p-2 no-scrollbar">
            <Chip
              on={!f.metroLineId}
              onClick={() => {
                setFilter('metroLineId', undefined);
                setFilter('metroStationIds', []);
              }}
            >
              All lines
            </Chip>
            {LINES.map((l) => (
              <Chip
                key={l.id}
                on={f.metroLineId === l.id}
                onClick={() => {
                  if (f.metroLineId === l.id) setFilter('metroLineId', undefined);
                  else {
                    setFilter('metroLineId', l.id);
                    setFilter('metroStationIds', []);
                  }
                }}
              >
                <MetroDot color={l.color} size={7} />
                {l.short.replace('Line ', '')}
              </Chip>
            ))}
          </div>
          <div className="relative border-t border-hair">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-quiet" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stations…"
              className="h-11 w-full bg-paper pl-9 pr-3 text-sm outline-none"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto border-t border-hair overscroll-contain">
            <li>
              <button
                type="button"
                className="flex min-h-11 w-full items-center px-3 text-left text-sm hover:bg-canvas"
                onClick={() => pick()}
              >
                Any station
              </button>
            </li>
            {stations.map((s) => {
              const on = f.metroStationIds[0] === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`flex min-h-11 w-full items-center gap-2.5 px-3 text-left hover:bg-canvas ${
                      on ? 'bg-warm' : ''
                    }`}
                    onClick={() => pick(s.id)}
                  >
                    <MetroDot color={s.lineColor} size={8} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{s.name}</span>
                      <span className="block truncate text-[11px] text-quiet">{s.district}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-3">
        <p className="mb-1.5 text-[11px] font-medium text-quiet">Walk</p>
        <Seg
          value={f.maxWalk !== undefined ? String(f.maxWalk) : undefined}
          onChange={(id) => setFilter('maxWalk', id ? Number(id) : undefined)}
          options={WALK_PRESETS.map((m) => ({ id: String(m), label: `${m} min` }))}
        />
      </div>
    </div>
  );
}

export function WhenControls() {
  const { state, setFilter, setTab } = useApp();
  const f = state.filters;
  const tonightOn =
    f.days.length === 1 && f.days[0] === todayName() && f.timeOfDay.includes('Evening');
  const weekdaysOn = isWeekdays(f.days);
  const weekendOn = isWeekend(f.days);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        <Chip
          on={tonightOn}
          block
          onClick={() => {
            if (tonightOn) {
              setFilter('days', []);
              setFilter('timeOfDay', []);
              setTab('all');
            } else {
              setTab('tonight');
            }
          }}
        >
          Tonight
        </Chip>
        <Chip
          on={weekdaysOn}
          block
          onClick={() => {
            if (weekdaysOn) {
              setFilter('days', []);
              setTab('all');
            } else {
              setTab('weekdays');
            }
          }}
        >
          Weekdays
        </Chip>
        <Chip
          on={weekendOn}
          block
          onClick={() => {
            if (weekendOn) {
              setFilter('days', []);
              setTab('all');
            } else {
              setTab('weekend');
            }
          }}
        >
          Weekend
        </Chip>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={f.days.includes(d)}
            onClick={() => {
              setTab('all');
              setFilter('days', toggle(f.days, d));
            }}
            className={`flex h-9 items-center justify-center rounded-lg text-[11px] font-semibold ${
              f.days.includes(d) ? 'bg-ink text-paper' : 'bg-canvas text-quiet hover:text-ink'
            }`}
          >
            {d.slice(0, 1)}
          </button>
        ))}
      </div>
      <Seg
        value={undefined}
        multi
        values={f.timeOfDay}
        onToggle={(id) => setFilter('timeOfDay', toggle(f.timeOfDay, id as (typeof TIMES)[number]))}
        options={TIMES.map((t) => ({ id: t, label: t }))}
      />
    </div>
  );
}

export function PriceControls() {
  const { state, setFilter } = useApp();
  const value = state.filters.maxPrice ?? PRICE_CAP;
  const pct = Math.round((value / PRICE_CAP) * 100);

  return (
    <div>
      <p className="text-sm font-semibold tracking-tight">
        {value >= PRICE_CAP ? 'Any budget' : `Up to ${money(value)}`}
      </p>
      <input
        type="range"
        min={0}
        max={PRICE_CAP}
        step={500}
        value={value}
        aria-label="Maximum price"
        className="price-range mt-3 w-full"
        style={{
          background: `linear-gradient(to right, var(--color-ink) ${pct}%, var(--color-hair) ${pct}%)`,
        }}
        onChange={(e) => {
          const n = Number(e.target.value);
          setFilter('maxPrice', n >= PRICE_CAP ? undefined : n);
        }}
      />
      <div className="mt-3 grid grid-cols-5 gap-1">
        <Chip on={!state.filters.maxPrice} block onClick={() => setFilter('maxPrice', undefined)}>
          Any
        </Chip>
        {PRICE_PRESETS.map((p) => (
          <Chip
            key={p}
            on={state.filters.maxPrice === p}
            block
            onClick={() => setFilter('maxPrice', state.filters.maxPrice === p ? undefined : p)}
          >
            {p >= 1000 ? `${p / 1000}k` : money(p)}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function CategoryGrid({
  value,
  onPick,
}: {
  value?: string;
  onPick: (c: string) => void;
}) {
  const [more, setMore] = useState(false);
  const shown = more ? CATEGORIES : CATEGORIES.slice(0, 8);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((c) => (
          <Chip key={c} on={value === c} onClick={() => onPick(c)}>
            {c}
          </Chip>
        ))}
      </div>
      {CATEGORIES.length > 8 && (
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          className="mt-2 text-xs font-semibold text-quiet hover:text-ink"
        >
          {more ? 'Show less' : `All ${CATEGORIES.length}`}
        </button>
      )}
    </div>
  );
}

export function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium text-quiet">{label}</p>
      {children}
    </div>
  );
}

export function Fold({
  title,
  summary,
  active,
  onClear,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary?: string;
  active?: boolean;
  onClear?: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-10 min-w-0 flex-1 items-center gap-2 py-1 text-left"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-quiet transition duration-200 ${open ? '' : '-rotate-90'}`}
          />
          <span className="text-sm font-semibold tracking-tight">{title}</span>
          {active ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" /> : null}
          {!open && summary ? (
            <span className="ml-auto truncate text-xs text-quiet">{summary}</span>
          ) : null}
        </button>
        {active && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 px-1 text-[11px] font-semibold text-quiet hover:text-ink"
          >
            Clear
          </button>
        ) : null}
      </div>
      {open ? <div className="pb-3.5">{children}</div> : null}
    </section>
  );
}

export function Seg({
  options,
  value,
  onChange,
  multi,
  values,
  onToggle,
}: {
  options: { id: string; label: string }[];
  value?: string;
  onChange?: (id: string | undefined) => void;
  multi?: boolean;
  values?: string[];
  onToggle?: (id: string) => void;
}) {
  const cols = options.length === 4 || options.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`grid gap-px overflow-hidden rounded-xl border border-hair ${cols}`}>
      {options.map((o) => {
        const pressed = multi ? Boolean(values?.includes(o.id)) : value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => (multi ? onToggle?.(o.id) : onChange?.(pressed ? undefined : o.id))}
            className={
              pressed
                ? 'h-9 bg-ink px-1 text-[12px] font-semibold text-paper'
                : 'h-9 bg-paper px-1 text-[12px] font-semibold text-quiet hover:bg-warm hover:text-ink'
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({
  on,
  onClick,
  children,
  block,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  block?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`${block ? 'flex w-full' : 'inline-flex'} h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[12px] font-medium transition ${
        on
          ? 'border-ink bg-ink text-paper'
          : 'border-hair bg-paper text-ink hover:border-ink/25 hover:bg-warm'
      }`}
    >
      {children}
    </button>
  );
}

export function CheckRow({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="flex h-10 w-full items-center gap-2.5 rounded-xl px-1 text-left text-sm hover:bg-canvas"
    >
      <span className="text-quiet">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
          on ? 'border-ink bg-ink text-paper' : 'border-hair bg-paper'
        }`}
      >
        {on ? <Check className="h-3 w-3" /> : null}
      </span>
    </button>
  );
}
