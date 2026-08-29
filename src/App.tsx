import { useLayoutEffect, useState } from 'react';
import { AppStateProvider, useApp } from './state';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { Footer, Header } from './ui/Chrome';
import { BookingsSheet, LegalModal, SavedSheet } from './ui/Sheets';
import { Toasts } from './ui/Toasts';
import { Explore } from './screens/Explore';
import { ActivityScreen } from './screens/Activity';
import { MyWeek } from './screens/MyWeek';
import { Dashboard } from './screens/Dashboard';
import { Provider } from './screens/Provider';
import { Publish } from './screens/Publish';

function Shell() {
  const { route, rememberScroll, readScroll, find } = useApp();
  const [saved, setSaved] = useState(false);
  const [bookings, setBookings] = useState(false);
  const [legal, setLegal] = useState<'privacy' | 'terms' | 'help' | null>(null);
  const key = route.view === 'activity' ? `activity:${route.id}` : route.view;

  useLayoutEffect(() => {
    history.scrollRestoration = 'manual';
    if (route.view === 'explore') {
      window.scrollTo({ top: readScroll('explore'), left: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [key, readScroll, route.view]);

  useLayoutEffect(() => {
    if (route.view === 'activity') {
      const activity = find(route.id);
      document.title = activity ? `${activity.title} · ActivityFirst` : 'ActivityFirst Moscow';
      return;
    }
    if (route.view === 'my-week') document.title = 'My Week · ActivityFirst';
    else if (route.view === 'post') document.title = 'Post an activity · ActivityFirst';
    else document.title = 'ActivityFirst Moscow';
  }, [find, route]);

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header
        onSaved={() => setSaved(true)}
        onBookings={() => setBookings(true)}
        onLeaveExplore={() => rememberScroll('explore', window.scrollY)}
      />
      <main id="main-content">
        {route.view === 'explore' && <Explore />}
        {route.view === 'activity' && <ActivityScreen key={route.id} id={route.id} />}
        {route.view === 'my-week' && <MyWeek />}
        {route.view === 'dashboard' && <Dashboard tab={route.tab} />}
        {route.view === 'provider' && <Provider />}
        {route.view === 'post' && <Publish />}
      </main>
      <Footer onLegal={setLegal} hidden={route.view === 'post'} lift={route.view === 'activity'} />
      <SavedSheet open={saved} onClose={() => setSaved(false)} />
      <BookingsSheet open={bookings} onClose={() => setBookings(false)} />
      <LegalModal open={legal !== null} type={legal} onClose={() => setLegal(null)} />
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </ErrorBoundary>
  );
}
