import { useRef, useState } from 'react';
import { CalendarDays, List, Map, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Activity, DiscoveryTab, SortOption } from '../lib/types';
import { activeFilterCount, listActiveFilters } from '../lib/filter-meta';
import { useLockBody, useMinWidth } from '../lib/media';
import { useApp } from '../state';
import { ActivityCard } from '../ui/Card';
import { CategoryRail, Finder } from '../ui/Finder';
import { FilterSearch, QuickFilters, SideFilters } from '../ui/Filters';
import { MetroMap } from '../ui/MetroMap';
import { Concierge, WaitlistModal } from '../ui/Sheets';
import { WeekBoard } from '../ui/WeekBoard';
import { STATIONS } from '../lib/metro';

const TABS: { id: DiscoveryTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'fits-free-time', label: 'Fits my time' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'near-metro', label: 'Near metro' },
];

const SORTS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'starts-soon', label: 'Starts soon' },
  { id: 'nearest-metro', label: 'Nearest metro' },
  { id: 'lowest-price', label: 'Lowest price' },
  { id: 'best-rated', label: 'Best rated' },
  { id: 'newest', label: 'Newest' },
  { id: 'most-popular', label: 'Most popular' },
];

export function Explore() {
  const {
    state,
    results,
    setFilter,
    clearFilters,
    setTab,
    setSort,
    setView,
    more,
    waitlist,
  } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [ai, setAi] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wait, setWait] = useState<Activity | null>(null);
  const filterSide = useMinWidth(768);
  useLockBody(filtersOpen);

  const shown = results.slice(0, state.limit);
  const pills = listActiveFilters(state.filters, setFilter);
  const count = activeFilterCount(state.filters);

  const peekTitle = (() => {
    const station = STATIONS.find((s) => s.id === state.filters.metroStationIds[0]);
    if (station) return `Near ${station.name}`;
    if (state.tab === 'tonight') return 'Tonight in Moscow';
    if (state.tab === 'weekend') return 'This weekend';
    return 'In the city this week';
  })();

  const jump = () => ref.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <Finder
        matchCount={results.length}
        onSearch={jump}
      />
      <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        {results.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {peekTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {results.slice(0, 3).map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          </section>
        )}
        <CategoryRail
          onPick={(cat) => {
            setFilter('category', state.filters.category === cat ? undefined : cat);
            jump();
          }}
        />

      <div ref={ref} id="results" className="mt-10 scroll-mt-24 sm:mt-14">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <div className="-mx-4 flex gap-1 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0" role="tablist" aria-label="Discovery">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={state.tab === tab.id}
                onClick={() => setTab(tab.id)}
                className={`h-10 shrink-0 rounded-full px-3.5 text-sm sm:px-4 ${
                  state.tab === tab.id ? 'bg-ink text-paper' : 'text-quiet hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <FilterSearch />
            <select
              aria-label="Sort"
              value={state.sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 min-w-[8.5rem] flex-1 rounded-full border border-hair bg-paper px-3 text-sm md:max-w-none md:flex-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="flex overflow-hidden rounded-full border border-hair">
              {(
                [
                  ['list', List, 'List'],
                  ['map', Map, 'Map'],
                  ['schedule', CalendarDays, 'Schedule'],
                ] as const
              ).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  aria-pressed={state.viewMode === id}
                  onClick={() => setView(id)}
                  className={`flex h-10 w-10 items-center justify-center ${
                    state.viewMode === id ? 'bg-warm' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="relative flex h-10 items-center gap-2 rounded-full border border-ink bg-paper px-3.5 text-sm font-semibold lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-bold text-signal-ink">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setAi(true)}
              className="hidden h-10 shrink-0 px-1 text-sm text-quiet hover:text-ink sm:block"
            >
              Describe an evening
            </button>
          </div>
        </div>

        <QuickFilters />

        {pills.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {pills.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={p.clear}
                className="rounded-full bg-warm px-3 py-1.5 text-xs font-medium hover:bg-hair"
              >
                {p.label} ×
              </button>
            ))}
            <button type="button" onClick={clearFilters} className="text-xs font-semibold underline">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {results.length.toLocaleString('en-GB')}
            <span className="ml-2 text-lg font-medium text-quiet sm:text-xl">
              {results.length === 1 ? 'activity' : 'activities'}
            </span>
          </p>
        </div>

        <div className="mt-5 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(20rem,22rem)_1fr]">
          <SideFilters className="hidden lg:block lg:sticky lg:top-24 lg:self-start" />
          <div>
            {results.length === 0 ? (
              <Empty
                onClear={clearFilters}
                onNear={() => {
                  clearFilters();
                  setTab('near-metro');
                }}
                ideas={state.activities.slice(0, 2)}
              />
            ) : state.viewMode === 'map' ? (
              <MetroMap
                activities={results}
                onStation={(id) => {
                  setFilter('metroStationIds', [id]);
                  setView('list');
                }}
              />
            ) : state.viewMode === 'schedule' ? (
              <WeekBoard activities={results} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                  {shown.map((a) => (
                    <ActivityCard key={a.id} activity={a} onWaitlist={setWait} />
                  ))}
                </div>
                {results.length > shown.length && (
                  <button
                    type="button"
                    onClick={more}
                    className="mt-8 min-h-12 w-full rounded-2xl bg-ink font-medium text-paper"
                  >
                    Show more · {results.length - shown.length} left
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88svh] flex-col rounded-t-3xl bg-paper md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-md md:rounded-none lg:hidden"
              initial={filterSide ? { x: '100%' } : { y: '100%' }}
              animate={{ x: 0, y: 0 }}
              exit={filterSide ? { x: '100%' } : { y: '100%' }}
            >
              <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-hair md:hidden" aria-hidden />
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-2">
                <SideFilters framed={false} />
              </div>
              <div className="shrink-0 border-t border-hair bg-paper p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="min-h-12 w-full rounded-full bg-ink font-semibold text-paper"
                >
                  Show {results.length.toLocaleString('en-GB')} activities
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Concierge open={ai} onClose={() => setAi(false)} />
      <WaitlistModal
        activity={wait}
        onClose={() => setWait(null)}
        onConfirm={() => {
          if (wait) waitlist(wait);
          setWait(null);
        }}
      />
    </div>
  );
}

function Empty({
  onClear,
  onNear,
  ideas,
}: {
  onClear: () => void;
  onNear: () => void;
  ideas: Activity[];
}) {
  return (
    <div className="rounded-[22px] border border-hair bg-paper px-6 py-12 text-center">
      <h3 className="font-display text-2xl">Nothing in that window.</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-quiet">
        Widen the days, pick another station, or look at what’s a five-minute walk from the platform.
      </p>
      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onClear} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
          Clear search
        </button>
        <button type="button" onClick={onNear} className="min-h-11 rounded-full border border-hair px-5 text-sm">
          Near metro
        </button>
      </div>
      {ideas.length > 0 && (
        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 sm:gap-4">
          {ideas.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}
