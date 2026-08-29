import { assertCatalog, buildCatalog, coverForCategory } from './catalog';
import { defaultPrefs, applyFilters, diversify, enrich, expandToNearbyStations, sortList } from './rank';
import {
  CATALOG_VERSION,
  DEMO_USER,
  KEYS,
  type Activity,
  type Booking,
  type Conversation,
  type GuestDetails,
  type DiscoveryTab,
  type FilterState,
  type NearbyFallback,
  type RankedActivity,
  type SortOption,
  type Toast,
  type UserPreferences,
  type ViewMode,
  type WaitlistEntry,
} from './types';

export type { DashTab, Route } from './routes';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadActivities(): Activity[] {
  const version = localStorage.getItem(KEYS.version);
  const raw = localStorage.getItem(KEYS.activities);
  if (raw && version === CATALOG_VERSION) {
    try {
      const parsed = JSON.parse(raw) as Activity[];
      assertCatalog(parsed);
      return parsed;
    } catch {
      /* rebuild */
    }
  }
  const catalog = buildCatalog();
  if (raw) {
    try {
      const prev = JSON.parse(raw) as Activity[];
      const seedIds = new Set(catalog.map((a) => a.id));
      for (const activity of prev) {
        if (seedIds.has(activity.id)) continue;
        seedIds.add(activity.id);
        catalog.push({
          ...activity,
          coverImage: activity.coverImage.startsWith('/covers/')
            ? activity.coverImage
            : coverForCategory(activity.category),
        });
      }
    } catch {
      /* rebuild seed catalog only */
    }
  }
  assertCatalog(catalog);
  writeJson(KEYS.activities, catalog);
  localStorage.setItem(KEYS.version, CATALOG_VERSION);
  return catalog;
}

export function emptyFilters(): FilterState {
  return {
    delivery: ['In Person'],
    audience: 'Adults',
    metroStationIds: [],
    timeOfDay: [],
    days: [],
    goals: [],
    templates: [],
  };
}

export interface AppState {
  activities: Activity[];
  savedIds: string[];
  bookings: Booking[];
  waitlists: WaitlistEntry[];
  conversations: Conversation[];
  preferences: UserPreferences;
  filters: FilterState;
  tab: DiscoveryTab;
  sort: SortOption;
  viewMode: ViewMode;
  limit: number;
  toasts: Toast[];
  scroll: Record<string, number>;
}

export function initialState(): AppState {
  return {
    activities: loadActivities(),
    savedIds: readJson(KEYS.saved, []),
    bookings: readJson(KEYS.bookings, []),
    waitlists: readJson(KEYS.waitlists, []),
    conversations: readJson(KEYS.conversations, []),
    preferences: readJson(KEYS.preferences, defaultPrefs()),
    filters: emptyFilters(),
    tab: 'all',
    sort: 'recommended',
    viewMode: 'list',
    limit: 12,
    toasts: [],
    scroll: {},
  };
}

export function visibleActivities(state: AppState): {
  results: RankedActivity[];
  nearbyFallback: NearbyFallback | null;
} {
  const originId = state.filters.metroStationIds[0];
  const rankPrefs = originId
    ? { ...state.preferences, preferredMetroStationId: originId }
    : state.preferences;
  const enriched = enrich(state.activities, rankPrefs, state.filters.keyword);
  const exact = applyFilters(enriched, state.filters, state.tab, state.preferences);
  const citywide =
    originId && !exact.length
      ? applyFilters(
          enriched,
          { ...state.filters, metroStationIds: [], metroLineId: undefined },
          state.tab,
          state.preferences,
        )
      : exact;
  const { list, nearby } = expandToNearbyStations(exact, citywide, state.filters.metroStationIds);
  const preferred = originId ?? state.preferences.preferredMetroStationId;
  const sort = nearby && state.sort === 'recommended' ? 'nearest-metro' : state.sort;
  const ordered = sortList(list, sort, preferred);
  return {
    results: nearby ? ordered : diversify(ordered),
    nearbyFallback: nearby,
  };
}

export function persistUserData(
  data: Pick<AppState, 'savedIds' | 'bookings' | 'waitlists' | 'conversations' | 'preferences'>,
) {
  writeJson(KEYS.saved, data.savedIds);
  writeJson(KEYS.bookings, data.bookings);
  writeJson(KEYS.waitlists, data.waitlists);
  writeJson(KEYS.conversations, data.conversations);
  writeJson(KEYS.preferences, data.preferences);
}

function toast(state: AppState, message: string, type: Toast['type'] = 'success'): AppState {
  return {
    ...state,
    toasts: [...state.toasts, { id: `t-${Date.now()}-${Math.random()}`, message, type }],
  };
}

export function persistActivities(list: Activity[]) {
  writeJson(KEYS.activities, list);
  localStorage.setItem(KEYS.version, CATALOG_VERSION);
}

export function toggleSave(state: AppState, id: string): AppState {
  const savedIds = state.savedIds.includes(id)
    ? state.savedIds.filter((x) => x !== id)
    : [...state.savedIds, id];
  return toast(
    { ...state, savedIds },
    savedIds.includes(id) ? 'Saved for later' : 'Removed from saved',
  );
}

export function book(
  state: AppState,
  activity: Activity,
  enrollment: Booking['enrollmentType'],
  sessionDate?: string,
  guest?: GuestDetails,
): AppState {
  if (state.bookings.some((b) => b.activityId === activity.id && b.status !== 'cancelled')) {
    return toast(state, 'You already have a booking for this activity', 'info');
  }
  const party = Math.max(1, guest?.partySize ?? 1);
  if (
    activity.availableSeats !== undefined &&
    activity.availableSeats > 0 &&
    party > activity.availableSeats
  ) {
    return toast(state, `Only ${activity.availableSeats} seats left`, 'error');
  }
  const status: Booking['status'] =
    activity.template === 'Corporate' || enrollment === 'quote'
      ? 'quote'
      : activity.bookingKind === 'Request Spot'
        ? 'pending'
        : 'confirmed';
  const booking: Booking = {
    id: `b-${Date.now()}`,
    activityId: activity.id,
    activityTitle: activity.title,
    status,
    sessionDate: sessionDate ?? activity.startDate,
    enrollmentType: enrollment,
    name: (guest?.name ?? DEMO_USER.name).trim() || DEMO_USER.name,
    email: (guest?.email ?? DEMO_USER.email).trim() || DEMO_USER.email,
    phone: (guest?.phone ?? DEMO_USER.phone).trim() || DEMO_USER.phone,
    note: guest?.note?.trim() || undefined,
    partySize: party,
    createdAt: new Date().toISOString(),
  };
  let activities = state.activities;
  if (status === 'confirmed' && activity.availableSeats !== undefined) {
    activities = activities.map((a) =>
      a.id === activity.id
        ? { ...a, availableSeats: Math.max(0, (a.availableSeats ?? 1) - party) }
        : a,
    );
  }
  return toast(
    { ...state, activities, bookings: [...state.bookings, booking] },
    status === 'confirmed' ? 'Spot reserved' : 'Request sent',
  );
}

export function cancelBooking(state: AppState, id: string): AppState {
  const booking = state.bookings.find((b) => b.id === id);
  if (!booking) return state;
  let activities = state.activities;
  if (booking.status === 'confirmed') {
    const seats = booking.partySize ?? 1;
    activities = activities.map((a) =>
      a.id === booking.activityId && a.availableSeats !== undefined && a.capacity
        ? { ...a, availableSeats: Math.min(a.capacity, a.availableSeats + seats) }
        : a,
    );
  }
  return toast(
    {
      ...state,
      activities,
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b,
      ),
    },
    'Booking cancelled',
  );
}

export function joinWaitlist(
  state: AppState,
  activity: Activity,
  guest?: GuestDetails,
): AppState {
  if (state.waitlists.some((w) => w.activityId === activity.id)) {
    return toast(state, 'You are already on this waitlist', 'info');
  }
  const position = state.waitlists.filter((w) => w.activityId === activity.id).length + 1;
  return toast(
    {
      ...state,
      waitlists: [
        ...state.waitlists,
        {
          id: `w-${Date.now()}`,
          activityId: activity.id,
          activityTitle: activity.title,
          position,
          name: (guest?.name ?? DEMO_USER.name).trim() || DEMO_USER.name,
          email: (guest?.email ?? DEMO_USER.email).trim() || DEMO_USER.email,
          phone: (guest?.phone ?? DEMO_USER.phone).trim() || DEMO_USER.phone,
          createdAt: new Date().toISOString(),
        },
      ],
    },
    `Waitlist · position ${position}`,
  );
}

export function publish(state: AppState, activity: Activity): AppState {
  const activities = [...state.activities, activity];
  return toast({ ...state, activities }, 'Published — it now appears in Explore');
}

export function sendNote(state: AppState, activity: Activity, text: string): AppState {
  const trimmed = text.trim();
  if (!trimmed) return state;
  const now = new Date().toISOString();
  const user = { id: `m-${Date.now()}`, sender: 'user' as const, text: trimmed, createdAt: now };
  const reply = {
    id: `m-${Date.now() + 1}`,
    sender: 'provider' as const,
    text: `Thank you for writing about “${activity.title}”. We’ll reply within ${activity.responseTimeText}.`,
    createdAt: now,
  };
  const existing = state.conversations.find((c) => c.activityId === activity.id);
  const conversations = existing
    ? state.conversations.map((c) =>
        c.activityId === activity.id
          ? { ...c, messages: [...c.messages, user, reply], updatedAt: now }
          : c,
      )
    : [
        ...state.conversations,
        {
          id: `c-${activity.id}`,
          activityId: activity.id,
          activityTitle: activity.title,
          providerName: activity.studioName ?? 'Provider',
          messages: [user, reply],
          updatedAt: now,
        },
      ];
  return toast({ ...state, conversations }, 'Message sent');
}

export function savePrefs(state: AppState, preferences: UserPreferences, silent = false): AppState {
  return silent
    ? { ...state, preferences }
    : toast({ ...state, preferences }, 'Free time saved');
}
