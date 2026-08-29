import { Heart } from 'lucide-react';
import type { Activity } from '../lib/types';
import { isOnline, lengthLabel, money, walkLabel, whyLine } from '../lib/format';
import { isSessionUnit, sessionPrice } from '../lib/pricing';
import { useApp } from '../state';
import { Cover, MetroDot } from './bits';

export function ActivityCardView({
  activity,
  saved,
  why,
  onOpen,
  onSave,
}: {
  activity: Activity;
  saved: boolean;
  why: string;
  onOpen: () => void;
  onSave: () => void;
}) {
  const online = isOnline(activity.delivery);
  const walk = walkLabel(activity);
  const full = activity.availableSeats === 0;
  const tight =
    activity.availableSeats !== undefined &&
    activity.availableSeats > 0 &&
    activity.availableSeats <= 3;
  const session = sessionPrice(activity);
  const showTotal = session !== null && !isSessionUnit(activity.priceUnit);
  const seats =
    activity.availableSeats === undefined
      ? null
      : full
        ? 'Waitlist'
        : `${activity.availableSeats} seat${activity.availableSeats === 1 ? '' : 's'}`;

  return (
    <article className="activity-card group relative min-w-0 overflow-hidden rounded-2xl bg-paper ring-1 ring-hair transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:ring-ink/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink">
      <button
        type="button"
        onClick={onOpen}
        className="activity-card-hit block w-full text-left"
        aria-label={activity.title}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-warm">
          <Cover
            src={activity.coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            {activity.newActivity ? (
              <span className="rounded-full bg-signal px-2 py-1 text-[11px] font-semibold text-signal-ink">
                New
              </span>
            ) : null}
            {full ? (
              <span className="rounded-full bg-ink px-2 py-1 text-[11px] font-semibold text-paper">
                Waitlist
              </span>
            ) : tight ? (
              <span className="rounded-full bg-ink px-2 py-1 text-[11px] font-semibold text-paper">
                {activity.availableSeats} left
              </span>
            ) : null}
          </div>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[13px] leading-none text-quiet">
            {activity.category}
            <span className="mx-1.5 text-hair">·</span>
            {activity.audience === 'Children' ? 'Kids' : activity.audience}
          </p>
          <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[17px] font-semibold leading-snug tracking-tight text-ink sm:text-[18px]">
            {activity.title}
          </h3>
          <p className="mt-2 text-[13px] font-medium text-ink/80">{why}</p>
          <p className="mt-2 flex min-w-0 items-center gap-2 text-[14px] text-ink/75">
            {online ? (
              <span className="truncate">{activity.meetingPlatform} · Moscow time</span>
            ) : (
              <>
                <MetroDot color={activity.metroLineColor ?? '#888'} size={9} />
                <span className="truncate font-medium text-ink">{activity.metroStationName}</span>
                {walk ? <span className="shrink-0">· {walk}</span> : null}
              </>
            )}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-hair pt-3.5">
            <p className="min-w-0 truncate text-[13px] text-quiet">
              {lengthLabel(activity)}
              <span className="mx-1.5 text-hair">·</span>
              {activity.schedule.timeRange}
              {seats ? (
                <>
                  <span className="mx-1.5 text-hair">·</span>
                  {seats}
                </>
              ) : null}
            </p>
            <p className="shrink-0 text-right">
              <span className="block text-[17px] font-semibold tracking-tight text-ink">
                {session === null ? money(activity.price) : money(session)}
                <span className="ml-1 text-[12px] font-normal text-quiet">
                  {session === null ? 'quote' : '/ session'}
                </span>
              </span>
              {showTotal ? (
                <span className="mt-0.5 block text-[11px] text-quiet">
                  {money(activity.price)} {activity.priceUnit}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink shadow-sm transition hover:bg-warm"
        aria-label={saved ? 'Remove from saved' : 'Save'}
        aria-pressed={saved}
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-ink' : ''}`} />
      </button>
    </article>
  );
}

export function ActivityCard({
  activity,
}: {
  activity: Activity;
  featured?: boolean;
  onWaitlist?: (a: Activity) => void;
  className?: string;
}) {
  const { state, save, go } = useApp();
  return (
    <ActivityCardView
      activity={activity}
      saved={state.savedIds.includes(activity.id)}
      why={whyLine(activity, state.preferences, state.filters)}
      onOpen={() => go({ view: 'activity', id: activity.id })}
      onSave={() => save(activity.id)}
    />
  );
}
