import { LINES, stationById } from './metro';
import { money } from './format';
import type { Delivery, FilterState } from './types';

const FORMAT_LABEL: Record<Delivery, string> = {
  'In Person': 'In person',
  'Live Online': 'Live online',
  Hybrid: 'Hybrid',
  'Self-Paced': 'Self-paced',
};

/** Count refinements beyond the default In-person / Adults search. */
export function activeFilterCount(f: FilterState): number {
  const baselineDelivery = f.delivery.length === 1 && f.delivery[0] === 'In Person';
  const baselineAudience = f.audience === 'Adults';
  return (
    [
      f.category,
      !baselineAudience && f.audience,
      f.language,
      f.metroLineId && f.metroStationIds.length === 0,
      f.level,
      f.minRating,
      f.maxPrice,
      f.keyword?.trim(),
      f.instantOnly,
      f.openSeats,
      f.maxWalk,
      f.newOnly,
    ].filter(Boolean).length +
    (baselineDelivery ? 0 : Math.max(1, f.delivery.length)) +
    f.metroStationIds.length +
    f.timeOfDay.length +
    f.days.length +
    f.goals.length +
    f.templates.length
  );
}

export function listActiveFilters(
  f: FilterState,
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void,
): { key: string; label: string; clear: () => void }[] {
  const pills: { key: string; label: string; clear: () => void }[] = [];
  if (f.keyword?.trim()) {
    pills.push({
      key: 'kw',
      label: `“${f.keyword.trim()}”`,
      clear: () => setFilter('keyword', undefined),
    });
  }
  if (f.category) {
    pills.push({
      key: 'cat',
      label: f.category,
      clear: () => setFilter('category', undefined),
    });
  }
  if (f.audience && f.audience !== 'Adults') {
    pills.push({
      key: 'aud',
      label: f.audience === 'Corporate' ? 'Teams' : f.audience,
      clear: () => setFilter('audience', 'Adults'),
    });
  }
  if (!(f.delivery.length === 1 && f.delivery[0] === 'In Person')) {
    pills.push({
      key: 'del',
      label: f.delivery.length ? f.delivery.map((d) => FORMAT_LABEL[d]).join(' · ') : 'Any format',
      clear: () => setFilter('delivery', ['In Person']),
    });
  }
  f.metroStationIds.forEach((id) => {
    pills.push({
      key: `st-${id}`,
      label: stationById(id)?.name ?? id,
      clear: () =>
        setFilter(
          'metroStationIds',
          f.metroStationIds.filter((x) => x !== id),
        ),
    });
  });
  if (f.metroLineId && f.metroStationIds.length === 0) {
    const line = LINES.find((l) => l.id === f.metroLineId);
    pills.push({
      key: 'line',
      label: line?.short ?? 'Metro line',
      clear: () => setFilter('metroLineId', undefined),
    });
  }
  f.timeOfDay.forEach((t) => {
    pills.push({
      key: `tod-${t}`,
      label: t,
      clear: () => setFilter('timeOfDay', f.timeOfDay.filter((x) => x !== t)),
    });
  });
  f.days.forEach((d) => {
    pills.push({
      key: `day-${d}`,
      label: d.slice(0, 3),
      clear: () => setFilter('days', f.days.filter((x) => x !== d)),
    });
  });
  if (f.level) {
    pills.push({
      key: 'lvl',
      label: f.level,
      clear: () => setFilter('level', undefined),
    });
  }
  if (f.language) {
    pills.push({
      key: 'lang',
      label: f.language,
      clear: () => setFilter('language', undefined),
    });
  }
  if (f.minRating) {
    pills.push({
      key: 'rate',
      label: `${f.minRating}+`,
      clear: () => setFilter('minRating', undefined),
    });
  }
  if (f.maxPrice) {
    pills.push({
      key: 'price',
      label: `Up to ${money(f.maxPrice)}`,
      clear: () => setFilter('maxPrice', undefined),
    });
  }
  f.goals.forEach((g) => {
    pills.push({
      key: `goal-${g}`,
      label: g,
      clear: () => setFilter('goals', f.goals.filter((x) => x !== g)),
    });
  });
  f.templates.forEach((t) => {
    pills.push({
      key: `tpl-${t}`,
      label: t,
      clear: () => setFilter('templates', f.templates.filter((x) => x !== t)),
    });
  });
  if (f.instantOnly) {
    pills.push({
      key: 'instant',
      label: 'Book now',
      clear: () => setFilter('instantOnly', undefined),
    });
  }
  if (f.openSeats) {
    pills.push({
      key: 'seats',
      label: 'Seats left',
      clear: () => setFilter('openSeats', undefined),
    });
  }
  if (f.maxWalk !== undefined) {
    pills.push({
      key: 'walk',
      label: `${f.maxWalk} min walk`,
      clear: () => setFilter('maxWalk', undefined),
    });
  }
  if (f.newOnly) {
    pills.push({
      key: 'new',
      label: 'New',
      clear: () => setFilter('newOnly', undefined),
    });
  }
  return pills;
}
