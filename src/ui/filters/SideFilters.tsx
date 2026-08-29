import { Search, X, Zap, Check, Sparkles } from 'lucide-react';
import { activeFilterCount } from '../../lib/filter-meta';
import { money } from '../../lib/format';
import { STATIONS } from '../../lib/metro';
import { useApp } from '../../state';
import type { Audience, FilterState } from '../../lib/types';
import { DELIVERIES, GOALS, LANGUAGES, LEVELS, TEMPLATES } from '../../lib/types';
import { MetroDot } from '../bits';
import {
  AUDIENCES,
  FORMAT_LABEL,
  Block,
  CategoryGrid,
  CheckRow,
  Chip,
  Fold,
  MetroStationControls,
  PriceControls,
  RATING_PRESETS,
  Seg,
  WhenControls,
  isOnlineOnly,
  metroSummary,
  moreSummary,
  toggle,
  whenSummary,
} from './shared';

export function SideFilters({
  className = '',
  framed = true,
}: {
  className?: string;
  framed?: boolean;
}) {
  const { state, setFilter, clearFilters } = useApp();
  const f = state.filters;
  const count = activeFilterCount(f);
  const onlineOnly = isOnlineOnly(f);
  const station = STATIONS.find((s) => s.id === f.metroStationIds[0]);

  return (
    <aside
      className={`${
        framed
          ? 'rounded-3xl border border-hair bg-paper p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[1.35rem] font-bold leading-none tracking-tight">Filters</p>
          <p className="mt-1.5 text-xs text-quiet">
            {count === 0 ? 'Narrow the week' : `${count} applied`}
          </p>
        </div>
        {count > 0 ? (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold hover:bg-warm"
          >
            Reset
          </button>
        ) : null}
      </div>

      {!framed ? (
        <label className="relative mt-4 block" htmlFor="side-filter-search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-quiet" />
          <input
            id="side-filter-search"
            type="search"
            value={f.keyword ?? ''}
            onChange={(e) => setFilter('keyword', e.target.value || undefined)}
            placeholder="Search title or studio…"
            className="h-11 w-full rounded-xl border border-hair bg-canvas pl-9 pr-9 text-sm outline-none placeholder:text-quiet focus:border-ink"
          />
          {f.keyword ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setFilter('keyword', undefined)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-quiet hover:bg-warm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>
      ) : null}

      <div className="mt-4 divide-y divide-hair border-t border-hair">
        {!onlineOnly ? (
          <Fold
            title="Metro"
            summary={metroSummary(f)}
            active={Boolean(f.metroLineId) || f.metroStationIds.length > 0 || f.maxWalk !== undefined}
            defaultOpen
            onClear={() => {
              setFilter('metroLineId', undefined);
              setFilter('metroStationIds', []);
              setFilter('maxWalk', undefined);
            }}
          >
            <MetroStationControls />
          </Fold>
        ) : null}

        <Fold
          title="When"
          summary={whenSummary(f)}
          active={f.days.length + f.timeOfDay.length > 0}
          defaultOpen
          onClear={() => {
            setFilter('days', []);
            setFilter('timeOfDay', []);
          }}
        >
          <WhenControls />
        </Fold>

        <Fold
          title="Price"
          summary={f.maxPrice ? `Up to ${money(f.maxPrice)}` : undefined}
          active={Boolean(f.maxPrice)}
          defaultOpen
          onClear={() => setFilter('maxPrice', undefined)}
        >
          <PriceControls />
        </Fold>

        <Fold
          title="More filters"
          summary={moreSummary(f)}
          active={Boolean(moreSummary(f))}
          onClear={() => {
            setFilter('audience', 'Adults');
            setFilter('delivery', ['In Person']);
            setFilter('level', undefined);
            setFilter('language', undefined);
            setFilter('minRating', undefined);
            setFilter('goals', []);
            setFilter('category', undefined);
            setFilter('templates', []);
            setFilter('instantOnly', undefined);
            setFilter('openSeats', undefined);
            setFilter('newOnly', undefined);
          }}
        >
          <div className="space-y-4">
            <Block label="Who">
              <Seg
                value={f.audience}
                onChange={(id) => setFilter('audience', (id as Audience | undefined) ?? undefined)}
                options={AUDIENCES}
              />
            </Block>
            <Block label="Format">
              <div className="grid grid-cols-2 gap-1.5">
                {DELIVERIES.map((d) => (
                  <Chip
                    key={d}
                    on={f.delivery.includes(d)}
                    onClick={() => {
                      const next = toggle(f.delivery, d);
                      setFilter('delivery', next);
                      if (next.every((x) => x === 'Live Online' || x === 'Self-Paced')) {
                        setFilter('metroLineId', undefined);
                        setFilter('metroStationIds', []);
                        setFilter('maxWalk', undefined);
                      }
                    }}
                  >
                    {FORMAT_LABEL[d]}
                  </Chip>
                ))}
              </div>
            </Block>
            <Block label="Level">
              <div className="grid grid-cols-2 gap-1.5">
                {LEVELS.map((lvl) => (
                  <Chip
                    key={lvl}
                    on={f.level === lvl}
                    onClick={() => setFilter('level', f.level === lvl ? undefined : lvl)}
                  >
                    {lvl}
                  </Chip>
                ))}
              </div>
            </Block>
            <Block label="Language">
              <Seg
                value={f.language}
                onChange={(id) => setFilter('language', id as FilterState['language'])}
                options={LANGUAGES.map((l) => ({ id: l, label: l }))}
              />
            </Block>
            <Block label="Rating">
              <Seg
                value={f.minRating ? String(f.minRating) : undefined}
                onChange={(id) => setFilter('minRating', id ? Number(id) : undefined)}
                options={RATING_PRESETS.map((r) => ({ id: String(r), label: `${r.toFixed(1)}+` }))}
              />
            </Block>
            <Block label="I want to">
              <div className="flex flex-wrap gap-1.5">
                {GOALS.map((g) => (
                  <Chip key={g} on={f.goals.includes(g)} onClick={() => setFilter('goals', toggle(f.goals, g))}>
                    {g}
                  </Chip>
                ))}
              </div>
            </Block>
            <Block label="Category">
              <CategoryGrid
                value={f.category}
                onPick={(c) => setFilter('category', f.category === c ? undefined : c)}
              />
            </Block>
            <Block label="Type">
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATES.map((t) => (
                  <Chip
                    key={t}
                    on={f.templates.includes(t)}
                    onClick={() => setFilter('templates', toggle(f.templates, t))}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </Block>
            <Block label="Availability">
              <div className="grid gap-0.5">
                <CheckRow
                  on={Boolean(f.instantOnly)}
                  onClick={() => setFilter('instantOnly', f.instantOnly ? undefined : true)}
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label="Book now"
                />
                <CheckRow
                  on={Boolean(f.openSeats)}
                  onClick={() => setFilter('openSeats', f.openSeats ? undefined : true)}
                  icon={<Check className="h-3.5 w-3.5" />}
                  label="Seats left"
                />
                <CheckRow
                  on={Boolean(f.newOnly)}
                  onClick={() => setFilter('newOnly', f.newOnly ? undefined : true)}
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="New this season"
                />
              </div>
            </Block>
          </div>
        </Fold>
      </div>

      {framed && station ? (
        <p className="mt-4 flex items-center gap-2 text-[11px] text-quiet">
          <MetroDot color={station.lineColor} size={7} />
          Showing near {station.name}
        </p>
      ) : null}
    </aside>
  );
}
