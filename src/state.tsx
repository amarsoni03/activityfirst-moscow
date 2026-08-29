import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  book as doBook,
  cancelBooking,
  emptyFilters,
  initialState,
  joinWaitlist,
  persistActivities,
  persistUserData,
  publish,
  savePrefs,
  sendNote,
  toggleSave,
  visibleActivities,
  type AppState,
} from './lib/store';
import { parseHash, parsePath, toPath, type Route } from './lib/routes';
import {
  WEEKDAYS,
  type Activity,
  type Booking,
  type DiscoveryTab,
  type FilterState,
  type GuestDetails,
  type NearbyFallback,
  type RankedActivity,
  type SortOption,
  type UserPreferences,
  type ViewMode,
} from './lib/types';
import { todayName } from './lib/format';

interface Ctx {
  state: AppState;
  route: Route;
  go: (route: Route) => void;
  results: RankedActivity[];
  nearbyFallback: NearbyFallback | null;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  setTab: (tab: DiscoveryTab) => void;
  setSort: (sort: SortOption) => void;
  setView: (mode: ViewMode) => void;
  more: () => void;
  save: (id: string) => void;
  reserve: (
    activity: Activity,
    enrollment: Booking['enrollmentType'],
    session?: string,
    guest?: GuestDetails,
  ) => void;
  cancel: (id: string) => void;
  waitlist: (activity: Activity, guest?: GuestDetails) => void;
  setPrefs: (prefs: UserPreferences, silent?: boolean) => void;
  addActivity: (activity: Activity) => void;
  message: (activity: Activity, text: string) => void;
  dropToast: (id: string) => void;
  find: (id: string) => Activity | undefined;
  rememberScroll: (key: string, y: number) => void;
  readScroll: (key: string) => number;
}

const C = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [route, setRoute] = useState<Route>(() =>
    parsePath(window.location.pathname, window.location.hash),
  );
  const userReady = useRef(false);
  const catalogReady = useRef(false);

  useEffect(() => {
    const sync = () => setRoute(parsePath(window.location.pathname, window.location.hash));
    window.addEventListener('popstate', sync);
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && (window.location.pathname === '/' || window.location.pathname === '')) {
      const migrated = parseHash('#' + (hash === 'free-time' ? 'my-week' : hash));
      window.history.replaceState(null, '', toPath(migrated));
      setRoute(migrated);
    }
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    if (!userReady.current) {
      userReady.current = true;
      return;
    }
    persistUserData({
      savedIds: state.savedIds,
      bookings: state.bookings,
      waitlists: state.waitlists,
      conversations: state.conversations,
      preferences: state.preferences,
    });
  }, [state.savedIds, state.bookings, state.waitlists, state.conversations, state.preferences]);

  useEffect(() => {
    if (!catalogReady.current) {
      catalogReady.current = true;
      return;
    }
    persistActivities(state.activities);
  }, [state.activities]);

  const go = useCallback((r: Route) => {
    const current = parsePath(window.location.pathname, window.location.hash);
    if (current.view === 'explore' && r.view !== 'explore') {
      setState((s) => ({ ...s, scroll: { ...s.scroll, explore: window.scrollY } }));
    }
    window.history.pushState(null, '', toPath(r));
    setRoute(r);
  }, []);

  const { results, nearbyFallback } = useMemo(() => visibleActivities(state), [state]);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setState((s) => ({ ...s, filters: { ...s.filters, [key]: value }, limit: 12 }));
  }, []);

  const setFilters = useCallback((filters: FilterState) => {
    setState((s) => ({ ...s, filters, limit: 12 }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((s) => ({ ...s, filters: emptyFilters(), tab: 'all', limit: 12 }));
  }, []);

  const setTab = useCallback((tab: DiscoveryTab) => {
    setState((s) => {
      let { filters } = s;
      if (tab === 'tonight') {
        filters = { ...filters, days: [todayName()], timeOfDay: ['Evening'] };
      } else if (tab === 'weekdays') {
        filters = { ...filters, days: [...WEEKDAYS], timeOfDay: [] };
      } else if (tab === 'weekend') {
        filters = { ...filters, days: ['Saturday', 'Sunday'], timeOfDay: [] };
      }
      return { ...s, tab, filters, limit: 12 };
    });
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setState((s) => ({ ...s, sort }));
  }, []);

  const setView = useCallback((viewMode: ViewMode) => {
    setState((s) => ({ ...s, viewMode }));
  }, []);

  const more = useCallback(() => {
    setState((s) => ({ ...s, limit: s.limit + 12 }));
  }, []);

  const save = useCallback((id: string) => {
    setState((s) => toggleSave(s, id));
  }, []);

  const reserve = useCallback(
    (
      activity: Activity,
      enrollment: Booking['enrollmentType'],
      session?: string,
      guest?: GuestDetails,
    ) => {
      setState((s) => doBook(s, activity, enrollment, session, guest));
    },
    [],
  );

  const cancel = useCallback((id: string) => {
    setState((s) => cancelBooking(s, id));
  }, []);

  const waitlist = useCallback((activity: Activity, guest?: GuestDetails) => {
    setState((s) => joinWaitlist(s, activity, guest));
  }, []);

  const setPrefs = useCallback((prefs: UserPreferences, silent?: boolean) => {
    setState((s) => savePrefs(s, prefs, silent));
  }, []);

  const addActivity = useCallback((activity: Activity) => {
    setState((s) => publish(s, activity));
  }, []);

  const message = useCallback((activity: Activity, text: string) => {
    setState((s) => sendNote(s, activity, text));
  }, []);

  const dropToast = useCallback((id: string) => {
    setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
  }, []);

  const find = useCallback(
    (id: string) => state.activities.find((a) => a.id === id),
    [state.activities],
  );

  const rememberScroll = useCallback((key: string, y: number) => {
    setState((s) => ({ ...s, scroll: { ...s.scroll, [key]: y } }));
  }, []);

  const readScroll = useCallback((key: string) => state.scroll[key] ?? 0, [state.scroll]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      route,
      go,
      results,
      nearbyFallback,
      setFilter,
      setFilters,
      clearFilters,
      setTab,
      setSort,
      setView,
      more,
      save,
      reserve,
      cancel,
      waitlist,
      setPrefs,
      addActivity,
      message,
      dropToast,
      find,
      rememberScroll,
      readScroll,
    }),
    [
      state,
      route,
      go,
      results,
      nearbyFallback,
      setFilter,
      setFilters,
      clearFilters,
      setTab,
      setSort,
      setView,
      more,
      save,
      reserve,
      cancel,
      waitlist,
      setPrefs,
      addActivity,
      message,
      dropToast,
      find,
      rememberScroll,
      readScroll,
    ],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useApp outside provider');
  return ctx;
}

export function useBookingFor(activityId: string): Booking | undefined {
  const { state } = useApp();
  return state.bookings.find((b) => b.activityId === activityId && b.status !== 'cancelled');
}

export function useWaitlistFor(activityId: string) {
  const { state } = useApp();
  return state.waitlists.find((w) => w.activityId === activityId);
}

export function useActiveBookings(): Booking[] {
  const { state } = useApp();
  return state.bookings.filter((b) => b.status !== 'cancelled');
}
