import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, MapPin, Search, X } from 'lucide-react';
import { HERO_MOSCOW, POPULAR } from '../lib/catalog';
import { todayName } from '../lib/format';
import { HUBS, LINES, STATIONS } from '../lib/metro';
import { useLockBody, useMinWidth, useVisualViewport } from '../lib/media';
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
            <StationField />
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

function StationField() {
  const { state, setFilter } = useApp();
  const f = state.filters;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wide = useMinWidth(768);
  const view = useVisualViewport(open && !wide);
  const keyboardUp = !wide && view.inset > 8;
  const selected = STATIONS.find((s) => s.id === f.metroStationIds[0]);
  const searching = q.trim().length > 0;

  const close = () => {
    const y = window.scrollY;
    inputRef.current?.blur();
    setOpen(false);
    setQ('');
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    });
  };

  useLockBody(open && !wide);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wide && !box.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
    // close reads latest setState; rebind when the desktop/mobile layout changes.
  }, [wide]);

  useEffect(() => {
    if (!open || !wide) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, wide]);

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
      setFilter('metroLineId', undefined);
      setFilter('metroStationIds', []);
    } else {
      const s = STATIONS.find((x) => x.id === id);
      if (s) {
        setFilter('metroLineId', s.lineId);
        setFilter('metroStationIds', [s.id]);
      }
    }
    close();
  };

  return (
    <div className="relative mt-4 sm:mt-5" ref={box}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
        Metro station
      </p>
      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-hair bg-canvas px-4 text-left sm:min-h-[64px]"
          aria-expanded={open}
        >
          <MapPin className="h-5 w-5 shrink-0" />
          <span className="min-w-0 flex-1">
            {selected ? (
              <>
                <span className="flex min-w-0 items-center gap-2 font-semibold">
                  <MetroDot color={selected.lineColor} size={10} />
                  <span className="truncate">{selected.name}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-quiet">
                  {selected.nameRu} · {selected.district}
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-quiet sm:hidden">Your metro station</span>
                <span className="hidden font-medium text-quiet sm:inline">
                  Which station are you leaving from?
                </span>
              </>
            )}
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-quiet transition ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <>
            <button
              type="button"
              aria-label="Close stations"
              className="fixed inset-0 z-[60] bg-ink/40 md:hidden"
              onClick={close}
            />
            <div
              className={`fixed inset-x-0 bottom-0 z-[61] flex min-h-0 flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl md:absolute md:inset-x-0 md:bottom-auto md:top-full md:mt-2 md:max-h-[min(32rem,70vh)] md:rounded-2xl md:border md:border-hair md:shadow-xl ${
                keyboardUp ? '' : 'pb-[env(safe-area-inset-bottom)] md:pb-0'
              }`}
              style={
                wide
                  ? undefined
                  : {
                      bottom: view.inset,
                      maxHeight:
                        view.height > 0
                          ? keyboardUp
                            ? view.height
                            : Math.round(view.height * 0.85)
                          : '85svh',
                    }
              }
            >
              {keyboardUp ? null : (
                <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3.5 md:hidden">
                  <p className="font-display text-lg font-bold">Choose a station</p>
                  <button
                    type="button"
                    onClick={close}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="shrink-0 space-y-3 px-4 pb-3 pt-3">
                <label htmlFor="hero-station-search" className="relative block">
                  <span className="sr-only">Search metro stations</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-quiet" />
                  <input
                    id="hero-station-search"
                    ref={inputRef}
                    type="text"
                    inputMode="search"
                    value={q}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="search"
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search stations"
                    className="h-12 w-full min-w-0 rounded-xl border border-transparent bg-canvas py-0 pl-12 pr-12 text-[16px] leading-6 placeholder:text-quiet focus-visible:border-ink focus-visible:outline-none!"
                  />
                  {searching ? (
                    <button
                      type="button"
                      aria-label="Clear station search"
                      onClick={() => {
                        setQ('');
                        inputRef.current?.focus();
                      }}
                      className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-quiet hover:bg-warm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </label>

                {searching ? null : (
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setFilter('metroLineId', undefined)}
                      className={`h-9 shrink-0 rounded-full px-3.5 text-xs ${
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
                          if (selected && selected.lineId !== l.id) {
                            setFilter('metroStationIds', []);
                          }
                        }}
                        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-canvas px-3.5 text-xs"
                        style={{
                          boxShadow: f.metroLineId === l.id ? `inset 0 0 0 2px ${l.color}` : undefined,
                        }}
                      >
                        <MetroDot color={l.color} size={7} />
                        {l.short}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-hair">
                <li>
                  <button
                    type="button"
                    aria-pressed={!selected}
                    className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-canvas ${
                      !selected ? 'bg-warm font-semibold' : ''
                    }`}
                    onClick={() => pick()}
                  >
                    Any station
                    {!selected ? <Check className="h-4 w-4 shrink-0" /> : null}
                  </button>
                </li>
                {stations.map((s) => {
                  const on = f.metroStationIds[0] === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        className={`flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left hover:bg-canvas ${
                          on ? 'bg-warm' : ''
                        }`}
                        onClick={() => pick(s.id)}
                      >
                        <MetroDot color={s.lineColor} size={10} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{s.name}</span>
                          <span className="block truncate text-xs text-quiet">
                            {s.nameRu} · {s.district}
                          </span>
                        </span>
                        {on ? <Check className="h-4 w-4 shrink-0" /> : null}
                      </button>
                    </li>
                  );
                })}
                {stations.length === 0 ? (
                  <li className="px-4 py-6 text-sm text-quiet">No stations match that search.</li>
                ) : null}
              </ul>
            </div>
          </>
        ) : null}
      </div>

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
                if (on) {
                  setFilter('metroLineId', undefined);
                  setFilter('metroStationIds', []);
                } else {
                  setFilter('metroLineId', s.lineId);
                  setFilter('metroStationIds', [s.id]);
                }
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
