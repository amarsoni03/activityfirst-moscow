import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, MapPin, X } from 'lucide-react';
import { HERO_MOSCOW, POPULAR } from '../lib/catalog';
import { todayName } from '../lib/format';
import { HUBS, LINES, STATIONS } from '../lib/metro';
import { DAYS, TIMES, type Audience } from '../lib/types';
import { useApp } from '../state';
import { Cover, MetroDot } from './bits';

export function Finder({
  matchCount,
  onSearch,
}: {
  matchCount: number;
  onSearch: () => void;
}) {
  const { state, setFilter, setTab } = useApp();
  const f = state.filters;
  const online = f.delivery[0] === 'Live Online';
  const selected = STATIONS.find((s) => s.id === f.metroStationIds[0]);

  return (
    <section className="relative bg-ink text-paper">
      <div className="absolute inset-0 overflow-hidden">
        <Cover
          src={HERO_MOSCOW}
          className="h-full w-full object-cover object-[center_30%] opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/85" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col justify-end px-4 pb-8 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:px-6 sm:pb-10 md:min-h-[58svh] md:pt-24 lg:min-h-[62svh]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
          Moscow · 2026
        </p>
        <h1 className="font-display mt-2 max-w-3xl text-[1.85rem] font-extrabold leading-[1.02] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.35rem] lg:leading-[0.98]">
          An activity that fits the hours you have.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
          In person at a real station, or live online. Adults, children, or teams.
        </p>

        <div className="mt-6 rounded-2xl bg-paper p-3.5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:mt-8 sm:rounded-[28px] sm:p-6">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-canvas p-1">
            <ModeBtn
              on={!online}
              onClick={() => {
                setFilter('delivery', ['In Person']);
              }}
            >
              In person
            </ModeBtn>
            <ModeBtn
              on={online}
              onClick={() => {
                setFilter('delivery', ['Live Online']);
                setFilter('metroLineId', undefined);
                setFilter('metroStationIds', []);
              }}
            >
              Online
            </ModeBtn>
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet sm:mt-5">
            Who
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-2xl bg-canvas p-1">
            {(['Adults', 'Children', 'Corporate'] as Audience[]).map((a) => (
              <ModeBtn
                key={a}
                on={f.audience === a}
                onClick={() => setFilter('audience', f.audience === a ? undefined : a)}
              >
                <span className="sm:hidden">
                  {a === 'Corporate' ? 'Teams' : a === 'Children' ? 'Kids' : 'Adults'}
                </span>
                <span className="hidden sm:inline">{a}</span>
              </ModeBtn>
            ))}
          </div>

          {!online ? (
            <StationField onSearch={onSearch} />
          ) : (
            <p className="mt-4 rounded-2xl bg-canvas px-4 py-4 text-sm leading-relaxed text-quiet sm:mt-5">
              Live on Zoom or Google Meet · Moscow time (MSK). No metro, no walk.
            </p>
          )}

          <div className="mt-4 sm:mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
              When
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <Mini
                on={
                  f.days.length === 1 &&
                  f.days[0] === todayName() &&
                  f.timeOfDay.includes('Evening')
                }
                onClick={() => {
                  const on =
                    f.days.length === 1 &&
                    f.days[0] === todayName() &&
                    f.timeOfDay.includes('Evening');
                  if (on) {
                    setFilter('days', []);
                    setFilter('timeOfDay', []);
                    setTab('all');
                  } else {
                    setTab('tonight');
                  }
                }}
              >
                Tonight
              </Mini>
              <Mini
                on={f.days.includes('Saturday') && f.days.includes('Sunday') && f.days.length === 2}
                onClick={() => {
                  const on =
                    f.days.includes('Saturday') &&
                    f.days.includes('Sunday') &&
                    f.days.length === 2;
                  if (on) {
                    setFilter('days', []);
                    setTab('all');
                  } else {
                    setTab('weekend');
                  }
                }}
              >
                Weekend
              </Mini>
              {TIMES.map((t) => (
                <Mini
                  key={t}
                  on={f.timeOfDay.includes(t)}
                  onClick={() => {
                    setTab('all');
                    setFilter(
                      'timeOfDay',
                      f.timeOfDay.includes(t)
                        ? f.timeOfDay.filter((x) => x !== t)
                        : [...f.timeOfDay, t],
                    );
                  }}
                >
                  {t}
                </Mini>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={f.days.includes(d)}
                  onClick={() => {
                    const next = f.days.includes(d)
                      ? f.days.filter((x) => x !== d)
                      : [...f.days, d];
                    setTab('all');
                    setFilter('days', next);
                  }}
                  className={`h-11 min-w-0 flex-1 rounded-lg text-[10px] font-semibold sm:h-10 sm:text-xs ${
                    f.days.includes(d) ? 'bg-ink text-paper' : 'bg-canvas text-quiet'
                  }`}
                >
                  <span className="md:hidden">{d.slice(0, 1)}</span>
                  <span className="hidden md:inline">{d.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-signal px-4 text-[15px] font-semibold text-signal-ink sm:mt-6 sm:w-auto sm:px-10"
          >
            <span className="truncate">
              {online
                ? `Show ${matchCount.toLocaleString('en-GB')} live activities`
                : selected
                  ? `Show ${matchCount.toLocaleString('en-GB')} · ${selected.name}`
                  : `Show ${matchCount.toLocaleString('en-GB')} activities`}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
          <p className="mt-3 text-xs text-quiet">
            {matchCount.toLocaleString('en-GB')} match this search
          </p>
        </div>
      </div>
    </section>
  );
}

function StationField({ onSearch }: { onSearch: () => void }) {
  const { state, setFilter } = useApp();
  const f = state.filters;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const selected = STATIONS.find((s) => s.id === f.metroStationIds[0]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (window.matchMedia('(min-width: 768px)').matches && !box.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const stations = useMemo(() => {
    const pool = f.metroLineId
      ? STATIONS.filter((s) => s.lineId === f.metroLineId)
      : STATIONS;
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
    onSearch();
  };

  return (
    <div className="relative mt-4 sm:mt-5" ref={box}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
        Metro station
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-hair bg-canvas px-3 text-left sm:min-h-[64px] sm:px-4"
        aria-expanded={open}
      >
        <MapPin className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="flex items-center gap-2 font-semibold">
                <MetroDot color={selected.lineColor} size={10} />
                <span className="truncate">{selected.name}</span>
                <span className="hidden truncate font-normal text-quiet sm:inline">
                  {selected.nameRu}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-quiet">
                {selected.district} · {selected.street}
              </span>
            </>
          ) : (
            <span className="font-medium text-quiet">Which station are you leaving from?</span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-quiet" />
      </button>

      <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 no-scrollbar">
        {HUBS.map((id) => {
          const s = STATIONS.find((x) => x.id === id);
          if (!s) return null;
          const on = f.metroStationIds[0] === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setFilter('metroLineId', s.lineId);
                setFilter('metroStationIds', [s.id]);
              }}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-medium ${
                on ? 'bg-ink text-paper' : 'bg-canvas'
              }`}
            >
              <MetroDot color={s.lineColor} size={8} />
              {s.name}
            </button>
          );
        })}
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close stations"
            className="fixed inset-0 z-[60] bg-ink/40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[85svh] flex-col rounded-t-3xl bg-paper pb-[env(safe-area-inset-bottom)] shadow-2xl md:absolute md:inset-x-0 md:bottom-auto md:top-full md:mt-2 md:max-h-[min(24rem,50vh)] md:rounded-2xl md:border md:border-hair md:pb-0 md:shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 md:hidden">
              <p className="font-display text-lg font-bold">Choose a station</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-hair p-2 no-scrollbar">
              <button
                type="button"
                onClick={() => setFilter('metroLineId', undefined)}
                className={`h-9 shrink-0 rounded-full px-3 text-xs ${
                  !f.metroLineId ? 'bg-ink text-paper' : 'bg-canvas'
                }`}
              >
                All lines
              </button>
              {LINES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setFilter('metroLineId', l.id);
                    setFilter('metroStationIds', []);
                  }}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-canvas px-3 text-xs"
                  style={{ boxShadow: f.metroLineId === l.id ? `inset 0 0 0 2px ${l.color}` : undefined }}
                >
                  <MetroDot color={l.color} size={7} />
                  {l.short}
                </button>
              ))}
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Station, district, or Russian name…"
              className="h-12 w-full border-b border-hair px-4 outline-none"
            />
            <ul className="flex-1 overflow-y-auto overscroll-contain">
              <li>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center px-4 py-3 text-left text-sm hover:bg-canvas"
                  onClick={() => pick()}
                >
                  Any station
                </button>
              </li>
              {stations.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-start gap-3 px-4 py-3 text-left hover:bg-canvas"
                    onClick={() => pick(s.id)}
                  >
                    <MetroDot color={s.lineColor} size={10} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {s.name}{' '}
                        <span className="font-normal text-quiet">{s.nameRu}</span>
                      </span>
                      <span className="block text-xs text-quiet">
                        {s.district} · {s.lineName}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function ModeBtn({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 rounded-xl px-1 text-[13px] font-semibold sm:min-h-12 sm:text-sm ${
        on ? 'bg-ink text-paper shadow-sm' : 'text-quiet hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function Mini({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-10 shrink-0 rounded-full px-3.5 text-sm font-medium ${
        on ? 'bg-ink text-paper' : 'bg-canvas text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export function CategoryRail({ onPick }: { onPick: (cat: string) => void }) {
  const { state } = useApp();
  return (
    <div className="mt-6 sm:mt-8">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {POPULAR.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onPick(cat)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-medium ${
              state.filters.category === cat ? 'bg-ink text-paper' : 'bg-paper ring-1 ring-hair'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
