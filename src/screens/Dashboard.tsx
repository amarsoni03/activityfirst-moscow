import type { DashTab } from '../lib/routes';
import { useApp, useActiveBookings } from '../state';
import { ActivityCard, BookingRow } from '../ui/Card';
import { DEMO_USER } from '../lib/types';
import { money } from '../lib/format';

const TABS: { id: DashTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'saved', label: 'Saved' },
  { id: 'compare', label: 'Compare' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profile' },
];

export function Dashboard({ tab }: { tab?: DashTab }) {
  const { state, go, find } = useApp();
  const current = tab ?? 'overview';
  const bookings = useActiveBookings();
  const saved = state.savedIds.map(find).filter(Boolean);
  const compare = saved.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Your week, in one place.</h1>
      <div className="mt-6 flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go({ view: 'dashboard', tab: t.id })}
            className={`h-10 shrink-0 rounded-full px-4 text-sm ${
              current === t.id ? 'bg-ink text-paper' : 'text-quiet'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {current === 'overview' && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat n={bookings.length} l="Active bookings" />
            <Stat n={state.savedIds.length} l="Saved" />
            <Stat n={state.conversations.length} l="Conversations" />
          </div>
          {bookings.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {bookings.map((b) => (
                <li key={b.id}>
                  <BookingRow
                    booking={b}
                    activity={find(b.activityId)}
                    onOpen={() => go({ view: 'activity', id: b.activityId })}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      {current === 'upcoming' && (
        <ul className="mt-8 space-y-3">
          {bookings.length === 0 && <p className="text-sm text-quiet">No upcoming reservations.</p>}
          {bookings.map((b) => (
            <li key={b.id}>
              <BookingRow
                booking={b}
                activity={find(b.activityId)}
                onOpen={() => go({ view: 'activity', id: b.activityId })}
              />
            </li>
          ))}
        </ul>
      )}

      {current === 'saved' && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {saved.length === 0 ? (
            <p className="text-sm text-quiet">Save activities while you browse. They live here.</p>
          ) : (
            saved.map((a) => a && <ActivityCard key={a.id} activity={a} />)
          )}
        </div>
      )}

      {current === 'compare' && (
        <div className="mt-8 overflow-x-auto">
          {compare.length < 2 ? (
            <p className="text-sm text-quiet">Save at least two activities to compare them.</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th className="py-2 text-left text-quiet"> </th>
                  {compare.map((a) => (
                    <th key={a!.id} className="max-w-[10rem] px-3 py-2 text-left font-display text-base font-normal sm:text-lg">
                      <span className="line-clamp-2">{a!.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['When', (a: (typeof compare)[0]) => a!.schedule.timeRange],
                    ['Station', (a: (typeof compare)[0]) => a!.metroStationName ?? a!.delivery],
                    ['Price', (a: (typeof compare)[0]) => money(a!.price)],
                    ['Level', (a: (typeof compare)[0]) => a!.level],
                    ['Rating', (a: (typeof compare)[0]) => a!.rating.toFixed(1)],
                  ] as const
                ).map(([label, fn]) => (
                  <tr key={label} className="border-t border-hair">
                    <th className="py-3 text-left text-quiet">{label}</th>
                    {compare.map((a) => (
                      <td key={a!.id} className="px-3 py-3">
                        {fn(a)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {current === 'messages' && (
        <ul className="mt-8 space-y-4">
          {state.conversations.length === 0 && (
            <p className="text-sm text-quiet">No messages yet.</p>
          )}
          {state.conversations.map((c) => (
            <li key={c.id} className="rounded-2xl border border-hair bg-paper p-4">
              <p className="font-medium">{c.activityTitle}</p>
              <p className="mt-2 text-sm text-quiet">{c.messages.at(-1)?.text}</p>
            </li>
          ))}
        </ul>
      )}

      {current === 'profile' && (
        <div className="mt-8 max-w-md rounded-2xl border border-hair bg-paper p-5 text-sm">
          <p className="font-medium">{DEMO_USER.name}</p>
          <p className="text-quiet">{DEMO_USER.email}</p>
          <p className="text-quiet">{DEMO_USER.phone}</p>
        </div>
      )}
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-2xl border border-hair bg-paper p-5">
      <p className="font-display text-4xl">{n}</p>
      <p className="mt-1 text-sm text-quiet">{l}</p>
    </div>
  );
}
