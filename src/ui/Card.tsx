import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Activity, Booking, RankedActivity } from '../lib/types';
import {
  bookingStatusLabel,
  isOnline,
  lengthLabel,
  money,
  placeDetail,
  sessionWhen,
  stopsLabel,
  walkLabel,
  whyLine,
} from '../lib/format';
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
  const stops = stopsLabel((activity as RankedActivity).nearbyStops);
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
                {stops ? <span className="shrink-0">· {stops}</span> : null}
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

export function SavedActivityRow({
  activity,
  onOpen,
}: {
  activity: Activity;
  onOpen: () => void;
}) {
  const { state, save } = useApp();
  const online = isOnline(activity.delivery);
  const walk = walkLabel(activity);
  const session = sessionPrice(activity);
  const saved = state.savedIds.includes(activity.id);
  const audience = activity.audience === 'Children' ? 'Kids' : activity.audience;

  return (
    <article className="relative flex overflow-hidden rounded-2xl bg-paper ring-1 ring-hair transition hover:bg-canvas hover:ring-ink/10">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 text-left"
        aria-label={activity.title}
      >
        <div className="relative min-h-[6.75rem] w-[6.25rem] shrink-0 self-stretch bg-warm sm:w-[7rem]">
          <Cover src={activity.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 px-3 py-2.5 pr-10">
          <p className="text-[12px] leading-none text-quiet">
            {activity.category}
            <span className="mx-1 text-hair">·</span>
            {audience}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-ink">
            {activity.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink/70">{activity.shortDescription}</p>
          <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[12px] text-ink/75">
            {online ? (
              <span className="truncate">{activity.meetingPlatform} · Moscow time</span>
            ) : (
              <>
                <MetroDot color={activity.metroLineColor ?? '#888'} size={8} />
                <span className="truncate font-medium text-ink">{activity.metroStationName}</span>
                {walk ? <span className="shrink-0">· {walk}</span> : null}
              </>
            )}
          </p>
          <p className="mt-1.5 flex items-baseline justify-between gap-2 text-[12px]">
            <span className="min-w-0 truncate text-quiet">
              {lengthLabel(activity)}
              <span className="mx-1 text-hair">·</span>
              {activity.schedule.timeRange}
            </span>
            <span className="shrink-0 font-semibold text-ink">
              {session === null ? money(activity.price) : money(session)}
            </span>
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          save(activity.id);
        }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink shadow-sm transition hover:bg-warm"
        aria-label={saved ? 'Remove from saved' : 'Save'}
        aria-pressed={saved}
      >
        <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-ink' : ''}`} />
      </button>
    </article>
  );
}

export function BookingRow({
  activity,
  booking,
  onOpen,
  onCancel,
}: {
  activity?: Activity;
  booking: Booking;
  onOpen: () => void;
  onCancel?: () => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const online = activity ? isOnline(activity.delivery) : false;
  const walk = activity ? walkLabel(activity) : undefined;
  const when = activity
    ? sessionWhen(activity, booking.sessionDate)
    : booking.sessionDate;
  const where = activity ? placeDetail(activity) : undefined;
  const label = [booking.activityTitle, when, where].filter(Boolean).join('. ');

  return (
    <article className="overflow-hidden rounded-2xl bg-paper ring-1 ring-hair">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full min-w-0 text-left transition hover:bg-canvas"
        aria-label={label}
      >
        <div className="relative min-h-[6.75rem] w-[6.25rem] shrink-0 self-stretch bg-warm sm:w-[7rem]">
          <Cover
            src={activity?.coverImage ?? ''}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 px-3 py-2.5 pr-3">
          <p className="text-[12px] leading-none text-quiet">
            {bookingStatusLabel(booking.status)}
            {booking.enrollmentType === 'trial' ? ' · Trial' : ''}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-ink">
            {booking.activityTitle}
          </h3>
          {when ? (
            <p className="mt-1.5 text-[12px] font-medium text-ink/80">{when}</p>
          ) : null}
          {activity && !online ? (
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] text-ink/75">
              <MetroDot color={activity.metroLineColor ?? '#888'} size={8} />
              <span className="truncate">
                {[activity.venue, activity.metroStationName].filter(Boolean).join(' · ')}
                {walk ? ` · ${walk}` : ''}
              </span>
            </p>
          ) : where ? (
            <p className="mt-1 truncate text-[12px] text-ink/75">{where}</p>
          ) : null}
        </div>
      </button>
      <div className="border-t border-hair p-2.5">
        {confirmCancel && onCancel ? (
          <div>
            <p className="px-0.5 pb-2 text-xs text-quiet">Cancel this reservation?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="min-h-11 rounded-xl bg-ink text-sm font-semibold text-paper"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="min-h-11 rounded-xl border border-hair text-sm font-medium"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-2 ${onCancel ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <button
              type="button"
              onClick={onOpen}
              className="min-h-11 rounded-xl bg-ink text-sm font-semibold text-paper"
            >
              Open
            </button>
            {onCancel ? (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="min-h-11 rounded-xl border border-hair text-sm font-medium"
              >
                Cancel
              </button>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
