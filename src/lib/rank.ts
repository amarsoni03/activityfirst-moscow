import { GOAL_MAP } from './catalog';
import { commuteScore } from './metro';
import { fitsTonight, fitsWeekend } from './activity-rules';
import { isOnline } from './format';
import { sessionPrice } from './pricing';
import type {
  Activity,
  Delivery,
  DiscoveryTab,
  FilterState,
  FreeTimeSlot,
  RankedActivity,
  SortOption,
  UserPreferences,
} from './types';
import { DAYS, TIMES } from './types';

const W = {
  search: 35,
  metro: 15,
  schedule: 12,
  soon: 10,
  seats: 8,
  rating: 6,
  reviews: 5,
  popularity: 4,
  featured: 3,
  fresh: 2,
};

function daysUntil(iso: string): number {
  const t = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(t / 86400000));
}

export function scheduleMatch(activity: Activity, prefs?: UserPreferences): number {
  const enabled = prefs?.freeTimeSlots.filter((s) => s.enabled) ?? [];
  if (!enabled.length) return 50;
  let hits = 0;
  for (const slot of enabled) {
    if (
      activity.schedule.days.includes(slot.day) &&
      activity.schedule.timeOfDay.includes(slot.timeOfDay)
    ) {
      hits += 1;
    }
  }
  return Math.round((hits / enabled.length) * 100);
}

function relevance(activity: Activity, query: string): number {
  if (!query.trim()) return 0;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const fields: [string, number][] = [
    [activity.title, 36],
    [activity.category, 24],
    [activity.metroStationName ?? '', 14],
    [activity.shortDescription, 10],
    [activity.tags.join(' '), 8],
  ];
  let score = 0;
  for (const token of tokens) {
    for (const [field, w] of fields) {
      const f = field.toLowerCase();
      if (f === token) score += w * 1.4;
      else if (f.startsWith(token)) score += w * 1.15;
      else if (f.includes(token)) score += w;
    }
  }
  return score;
}

export function enrich(
  activities: Activity[],
  prefs?: UserPreferences,
  keyword?: string,
): RankedActivity[] {
  return activities.map((a) => ({
    ...a,
    scheduleMatchPercentage: scheduleMatch(a, prefs),
    commuteInfo: isOnline(a.delivery)
      ? (a.meetingPlatform ?? 'Online')
      : commuteScore(prefs?.preferredMetroStationId, a.metroStationId, a.walkMinutes) >= 78
        ? 'Very close'
        : commuteScore(prefs?.preferredMetroStationId, a.metroStationId, a.walkMinutes) >= 48
          ? 'A short ride'
          : 'Further',
    searchRelevance: keyword ? relevance(a, keyword) : 0,
  }));
}

function recScore(a: RankedActivity, maxRel: number): number {
  let s = 0;
  s += maxRel > 0 ? (a.searchRelevance / maxRel) * W.search : W.search * 0.5;
  s += (commuteScore(undefined, a.metroStationId, a.walkMinutes) / 100) * W.metro;
  s += (a.scheduleMatchPercentage / 100) * W.schedule;
  const soon = daysUntil(a.startDate);
  s += ((soon <= 7 ? 100 : soon <= 14 ? 70 : soon <= 30 ? 40 : 12) / 100) * W.soon;
  if (a.availableSeats !== undefined && a.capacity) {
    s += (a.availableSeats / a.capacity) * W.seats;
  } else s += W.seats * 0.5;
  s += (a.rating / 5) * W.rating;
  s += Math.min(1, a.reviewCount / 80) * W.reviews;
  s += Math.min(1, a.popularityScore / 100) * W.popularity;
  if (a.featured) s += W.featured;
  if (a.newActivity) s += W.fresh;
  return s;
}

function deliveryOk(mode: Delivery, filters: Delivery[]): boolean {
  if (!filters.length) return true;
  return filters.some((f) => {
    if (f === 'In Person') return mode === 'In Person' || mode === 'Hybrid';
    if (f === 'Live Online') return mode === 'Live Online' || mode === 'Hybrid' || mode === 'Self-Paced';
    return mode === f;
  });
}

export function applyFilters(
  list: RankedActivity[],
  filters: FilterState,
  tab: DiscoveryTab,
  prefs?: UserPreferences,
): RankedActivity[] {
  let out = list;

  if (filters.category) out = out.filter((a) => a.category === filters.category);
  if (filters.audience === 'Corporate') {
    out = out.filter((a) => a.audience === 'Corporate' || a.audience === 'All');
  } else if (filters.audience) {
    out = out.filter((a) => a.audience === filters.audience || a.audience === 'All');
  } else {
    out = out.filter((a) => a.audience !== 'Corporate');
  }
  if (filters.delivery.length) out = out.filter((a) => deliveryOk(a.delivery, filters.delivery));
  if (filters.language) out = out.filter((a) => a.language === filters.language);
  if (filters.metroLineId) out = out.filter((a) => a.metroLineId === filters.metroLineId);
  if (filters.metroStationIds.length) {
    out = out.filter((a) => a.metroStationId && filters.metroStationIds.includes(a.metroStationId));
  }
  if (filters.timeOfDay.length) {
    out = out.filter((a) => a.schedule.timeOfDay.some((t) => filters.timeOfDay.includes(t)));
  }
  if (filters.days.length) {
    out = out.filter((a) => a.schedule.days.some((d) => filters.days.includes(d)));
  }
  if (filters.level) {
    out = out.filter((a) => a.level === filters.level || a.level === 'All Levels');
  }
  if (filters.minRating) out = out.filter((a) => a.rating >= filters.minRating!);
  if (filters.maxPrice) out = out.filter((a) => a.price <= filters.maxPrice!);
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    out = out.filter(
      (a) =>
        a.searchRelevance > 0 ||
        a.title.toLowerCase().includes(kw) ||
        a.category.toLowerCase().includes(kw),
    );
  }
  if (filters.goals.length) {
    out = out.filter((a) =>
      filters.goals.some(
        (g) => a.goals.includes(g) || (GOAL_MAP[g]?.includes(a.category) ?? false),
      ),
    );
  }
  if (filters.templates.length) {
    out = out.filter((a) => filters.templates.includes(a.template));
  }
  if (filters.instantOnly) {
    out = out.filter((a) => a.bookingKind === 'Instant Booking' && a.template !== 'Corporate');
  }
  if (filters.openSeats) {
    out = out.filter((a) => a.availableSeats === undefined || a.availableSeats > 0);
  }
  if (filters.maxWalk !== undefined) {
    out = out.filter(
      (a) => isOnline(a.delivery) || (a.walkMinutes !== undefined && a.walkMinutes <= filters.maxWalk!),
    );
  }
  if (filters.newOnly) {
    out = out.filter((a) => a.newActivity);
  }

  switch (tab) {
    case 'fits-free-time':
      out = out.filter((a) => a.scheduleMatchPercentage >= 70);
      if (prefs?.maxBudget) out = out.filter((a) => a.price <= prefs.maxBudget!);
      break;
    case 'tonight':
      out = out.filter(fitsTonight);
      break;
    case 'weekend':
      out = out.filter(fitsWeekend);
      break;
    case 'near-metro':
      out = out.filter((a) => !isOnline(a.delivery) && (a.walkMinutes ?? 99) <= 5);
      break;
    default:
      break;
  }

  return out;
}

export function sortList(
  list: RankedActivity[],
  sort: SortOption,
  preferredStationId?: string,
): RankedActivity[] {
  const next = [...list];
  switch (sort) {
    case 'starts-soon':
      next.sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate));
      break;
    case 'nearest-metro':
      next.sort(
        (a, b) =>
          commuteScore(preferredStationId, b.metroStationId, b.walkMinutes) -
          commuteScore(preferredStationId, a.metroStationId, a.walkMinutes),
      );
      break;
    case 'lowest-price':
      next.sort((a, b) => {
        const pa = sessionPrice(a) ?? Number.POSITIVE_INFINITY;
        const pb = sessionPrice(b) ?? Number.POSITIVE_INFINITY;
        return pa - pb;
      });
      break;
    case 'best-rated':
      next.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      next.sort((a, b) => b.startDate.localeCompare(a.startDate));
      break;
    case 'most-popular':
      next.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
    default: {
      const maxRel = Math.max(...next.map((a) => a.searchRelevance), 1);
      next.sort((a, b) => recScore(b, maxRel) - recScore(a, maxRel));
    }
  }
  return next;
}

export function diversify(list: RankedActivity[]): RankedActivity[] {
  const pool = [...list];
  const out: RankedActivity[] = [];
  let last = '';
  while (pool.length) {
    const i = pool.findIndex((a) => a.category !== last);
    const pick = pool.splice(i >= 0 ? i : 0, 1)[0];
    if (!pick) break;
    out.push(pick);
    last = pick.category;
  }
  return out;
}

export function defaultSlots(): FreeTimeSlot[] {
  const slots: FreeTimeSlot[] = [];
  for (const day of DAYS) {
    for (const timeOfDay of TIMES) {
      const weekday = day !== 'Saturday' && day !== 'Sunday';
      slots.push({
        day,
        timeOfDay,
        enabled:
          (weekday && timeOfDay === 'Evening') ||
          (!weekday && timeOfDay !== 'Evening'),
      });
    }
  }
  return slots;
}

export function defaultPrefs(): UserPreferences {
  return {
    freeTimeSlots: defaultSlots(),
    preferredMetroStationId: 'arbatskaya',
    maxBudget: 15000,
    audience: 'Adults',
    goals: ['Learn', 'Exercise'],
  };
}

export function overlapsFreeTime(activity: Activity, prefs: UserPreferences): boolean {
  return prefs.freeTimeSlots.some(
    (s) =>
      s.enabled &&
      activity.schedule.days.includes(s.day) &&
      activity.schedule.timeOfDay.includes(s.timeOfDay),
  );
}

export function weekMatches(activities: Activity[], prefs: UserPreferences): Activity[] {
  return activities.filter((a) => {
    if (!overlapsFreeTime(a, prefs)) return false;
    if (prefs.maxBudget && a.price > prefs.maxBudget) return false;
    if (prefs.audience && a.audience !== prefs.audience && a.audience !== 'All') return false;
    if (a.audience === 'Corporate' && prefs.audience !== 'Corporate') return false;
    if (
      !isOnline(a.delivery) &&
      prefs.preferredMetroStationId &&
      commuteScore(prefs.preferredMetroStationId, a.metroStationId, a.walkMinutes) < 48
    ) {
      return false;
    }
    return true;
  });
}

export function localConcierge(query: string, activities: Activity[]): Activity[] {
  const q = query.toLowerCase();
  const scored = activities
    .map((a) => ({ a, s: relevance(a, q) + scheduleMatch(a) * 0.2 }))
    .filter((x) => x.s > 8)
    .sort((x, y) => y.s - x.s)
    .slice(0, 6)
    .map((x) => x.a);
  return scored;
}
