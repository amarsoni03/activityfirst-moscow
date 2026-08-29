import { useState } from 'react';
import { pickWeekPlan, weekMatches, type WeekPick } from '../lib/rank';
import { STATIONS } from '../lib/metro';
import { useApp, useActiveBookings } from '../state';
import { Cover, MetroDot } from '../ui/bits';
import { FreeTimeEditor } from '../ui/FreeTimeEditor';
import {
  dayHeading,
  hoursPhrase,
  isOnline,
  money,
  walkLabel,
} from '../lib/format';
import { sessionPrice } from '../lib/pricing';

export function MyWeek() {
  const { state, go, setTab } = useApp();
  const bookings = useActiveBookings();
  const home = STATIONS.find((s) => s.id === state.preferences.preferredMetroStationId);
  const hours = hoursPhrase(state.preferences);
  const noHours = !state.preferences.freeTimeSlots.some((s) => s.enabled);
  const [editHours, setEditHours] = useState(noHours);
  const plan = pickWeekPlan(state.activities, state.preferences, bookings, state.savedIds);
  const matchCount = weekMatches(state.activities, state.preferences).length;
  const extra = Math.max(0, matchCount - plan.reduce((n, d) => n + d.items.length, 0));

  const browseFits = () => {
    setTab('fits-free-time');
    go({ view: 'explore' });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-quiet">My Week</p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">Coming up</h1>
      <p className="mt-3 text-sm text-quiet">
        {noHours
          ? 'Mark when you are free. We will put one thing on each of those days.'
          : hours}
      </p>
      {home && !noHours ? (
        <p className="mt-1 text-sm text-quiet">from {home.name}</p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          aria-expanded={editHours}
          onClick={() => setEditHours((v) => !v)}
          className="text-sm font-medium underline decoration-hair underline-offset-4 hover:decoration-ink"
        >
          {editHours ? 'Done with hours' : 'Change hours'}
        </button>
        {editHours ? (
          <div className="mt-4">
            <FreeTimeEditor prefs={state.preferences} />
          </div>
        ) : null}
      </div>

      <div className="mt-10 space-y-8">
        {plan.map((d) => (
          <section key={d.dateIso}>
            <h2 className="font-display text-xl tracking-tight">{dayHeading(d.dateIso)}</h2>
            <ul className="mt-3 space-y-3">
              {d.items.map((item) => (
                <li key={`${d.dateIso}-${item.activity.id}`}>
                  <WeekRow
                    item={item}
                    onOpen={() => go({ view: 'activity', id: item.activity.id })}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {plan.length === 0 && !noHours ? (
          <p className="rounded-2xl bg-paper px-5 py-10 text-center text-sm text-quiet ring-1 ring-hair">
            Nothing nearby in these hours. Widen the grid or pick another station.
          </p>
        ) : null}
      </div>

      {extra > 0 ? (
        <button
          type="button"
          onClick={browseFits}
          className="mt-10 w-full rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-paper"
        >
          {extra} more that fit these hours
        </button>
      ) : matchCount > 0 ? (
        <button
          type="button"
          onClick={browseFits}
          className="mt-10 text-sm font-medium text-quiet underline decoration-hair underline-offset-4 hover:text-ink"
        >
          Browse everything that fits
        </button>
      ) : null}
    </div>
  );
}

function WeekRow({ item, onOpen }: { item: WeekPick; onOpen: () => void }) {
  const { activity, kind, timeOfDay } = item;
  const online = isOnline(activity.delivery);
  const walk = walkLabel(activity);
  const session = sessionPrice(activity);
  const label =
    kind === 'booked' ? 'Reserved' : kind === 'saved' ? 'Saved' : timeOfDay.toLowerCase();

  return (
    <article className="overflow-hidden rounded-2xl bg-paper ring-1 ring-hair transition hover:bg-canvas hover:ring-ink/10">
      <button type="button" onClick={onOpen} className="flex w-full min-w-0 text-left" aria-label={activity.title}>
        <div className="relative min-h-[6.75rem] w-[6.25rem] shrink-0 self-stretch bg-warm sm:w-[7rem]">
          <Cover
            src={activity.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 px-3 py-2.5">
          <p className="text-[12px] leading-none text-quiet">
            {label}
            <span className="mx-1.5 text-hair">·</span>
            {activity.category}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-ink">
            {activity.title}
          </h3>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] text-ink/75">
            {online ? (
              <span className="truncate">{activity.meetingPlatform} · Moscow time</span>
            ) : (
              <>
                <MetroDot color={activity.metroLineColor ?? '#888'} size={8} />
                <span className="truncate">
                  {activity.metroStationName}
                  {walk ? ` · ${walk}` : ''}
                </span>
              </>
            )}
          </p>
          <p className="mt-1.5 flex items-baseline justify-between gap-2 text-[12px]">
            <span className="min-w-0 truncate text-quiet">
              {activity.startTime && activity.endTime
                ? `${activity.startTime}–${activity.endTime}`
                : activity.schedule.timeRange}
            </span>
            {kind !== 'booked' ? (
              <span className="shrink-0 font-semibold text-ink">
                {session === null ? money(activity.price) : money(session)}
              </span>
            ) : null}
          </p>
        </div>
      </button>
    </article>
  );
}
