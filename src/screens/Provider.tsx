import { useApp } from '../state';
import { ActivityCard } from '../ui/Card';

export function Provider() {
  const { state } = useApp();
  const mine = state.activities.filter((a) => a.delivery === 'In Person').slice(0, 6);
  const stations = new Set(state.activities.map((a) => a.metroStationId).filter(Boolean)).size;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-quiet">
        Providers
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl md:text-5xl">
        The activity is the product. You host it.
      </h1>
      <p className="mt-3 max-w-xl text-quiet">
        Listings appear in search as activities, never as a studio directory. This page is secondary on purpose.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Tile n={state.activities.length} l="Live activities in Moscow" />
        <Tile n={state.bookings.length} l="Demo reservations" />
        <Tile n={stations} l="Stations with inventory" />
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {mine.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>
    </div>
  );
}

function Tile({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-2xl border border-hair bg-paper p-5">
      <p className="font-display text-3xl">{n.toLocaleString('en-GB')}</p>
      <p className="mt-1 text-sm text-quiet">{l}</p>
    </div>
  );
}
