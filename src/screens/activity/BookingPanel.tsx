import { Heart } from 'lucide-react';
import {
  bookingStatusLabel,
  ctaLabel,
  isOnline,
  money,
  placeDetail,
  sessionWhen,
  walkLabel,
} from '../../lib/format';
import { downloadSessionIcs } from '../../lib/calendar';
import type { Activity, Booking } from '../../lib/types';
import { useApp } from '../../state';
import { Cover, MetroDot } from '../../ui/bits';
import type { BookingForm } from './form';

export function BookingPanel({
  activity,
  sessions,
  session,
  onSession,
  form,
  onForm,
  errors,
  enrollment,
  offerTrial,
  quote,
  full,
  maxParty,
  partyLabel,
  booking,
  waitlisted,
  waitPosition,
  onSubmit,
  onCancel,
  plain = false,
}: {
  activity: Activity;
  sessions: string[];
  session: string;
  onSession: (d: string) => void;
  form: BookingForm;
  onForm: (next: BookingForm) => void;
  errors: Partial<Record<keyof BookingForm | 'session', string>>;
  enrollment: Booking['enrollmentType'];
  offerTrial: boolean;
  quote: boolean;
  full: boolean;
  maxParty: number;
  partyLabel: string;
  booking?: Booking;
  waitlisted: boolean;
  waitPosition?: number;
  onSubmit: () => void;
  onCancel: () => void;
  plain?: boolean;
}) {
  const { save, state } = useApp();
  const saved = state.savedIds.includes(activity.id);
  const box = plain
    ? ''
    : 'overflow-hidden rounded-3xl border border-hair bg-paper shadow-[0_18px_50px_rgba(0,0,0,0.08)]';
  const taken =
    activity.capacity && activity.availableSeats !== undefined
      ? activity.capacity - activity.availableSeats
      : 0;
  const fill =
    activity.capacity && activity.capacity > 0 ? Math.min(100, (taken / activity.capacity) * 100) : 0;

  if (booking) {
    const online = isOnline(activity.delivery);
    const walk = walkLabel(activity);
    return (
      <div className={plain ? '' : 'overflow-hidden rounded-3xl border border-hair bg-paper shadow-[0_18px_50px_rgba(0,0,0,0.08)]'}>
        <div className={plain ? 'overflow-hidden rounded-2xl bg-warm' : 'bg-warm'}>
          <Cover
            src={activity.coverImage}
            alt=""
            className="aspect-[16/10] h-auto w-full object-cover"
          />
        </div>
        <div className={plain ? 'pt-5' : 'p-6'}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
            {bookingStatusLabel(booking.status)}
          </p>
          <p className="mt-2 font-display text-2xl font-bold leading-tight">{activity.title}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <Row k="When" v={sessionWhen(activity, booking.sessionDate)} />
            <div className="flex justify-between gap-3">
              <dt className="text-quiet">Where</dt>
              <dd className="max-w-[70%] text-right font-medium">
                {online ? (
                  placeDetail(activity)
                ) : (
                  <span className="inline-flex items-start justify-end gap-1.5">
                    <MetroDot color={activity.metroLineColor ?? '#888'} size={8} />
                    <span>
                      {placeDetail(activity)}
                      {walk ? <span className="mt-0.5 block text-xs font-normal text-quiet">{activity.metroStationName} · {walk}</span> : null}
                    </span>
                  </span>
                )}
              </dd>
            </div>
            <Row k="For" v={`${booking.name}${booking.partySize && booking.partySize > 1 ? ` · ${booking.partySize}` : ''}`} />
            <Row k="Type" v={booking.enrollmentType} />
            <Row k="Price" v={`${money(activity.price)} ${activity.priceUnit}`} />
          </dl>
          <button
            type="button"
            onClick={onCancel}
            className="mt-6 min-h-11 w-full rounded-xl border border-hair text-sm"
          >
            Cancel booking
          </button>
          {booking.status === 'confirmed' && booking.sessionDate ? (
            <button
              type="button"
              onClick={() => downloadSessionIcs(activity, booking.sessionDate!)}
              className="mt-3 min-h-11 w-full rounded-xl bg-ink text-sm font-semibold text-paper"
            >
              Add to calendar
            </button>
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-quiet">{activity.cancellationPolicy}</p>
        </div>
      </div>
    );
  }

  if (waitlisted) {
    return (
      <div className={plain ? '' : 'rounded-3xl border border-hair bg-paper p-6'}>
        <p className="font-display text-2xl font-bold">You’re on the waitlist</p>
        <p className="mt-2 text-sm text-quiet">Position {waitPosition}. We’ll hold the place if a seat opens.</p>
      </div>
    );
  }

  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => onForm({ ...form, [key]: value });

  return (
    <form
      className={box}
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className={`flex items-start justify-between gap-3 ${plain ? 'pb-4' : 'p-6 pb-0'}`}>
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">{money(activity.price)}</p>
          <p className="text-sm text-quiet">{activity.priceUnit}</p>
        </div>
        {!plain && (
          <button
            type="button"
            onClick={() => save(activity.id)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hair"
            aria-pressed={saved}
            aria-label="Save"
          >
            <Heart className={saved ? 'h-4 w-4 fill-ink' : 'h-4 w-4'} />
          </button>
        )}
      </div>
      {activity.availableSeats !== undefined && (
        <div className={plain ? 'pt-2' : 'px-6 pt-4'}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-quiet">
              {full ? 'This session is full' : `${activity.availableSeats} seats left`}
            </span>
            {activity.capacity ? (
              <span className="text-xs text-quiet">{activity.capacity} total</span>
            ) : null}
          </div>
          {activity.capacity ? (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hair">
              <div className="h-full rounded-full bg-ink" style={{ width: `${fill}%` }} />
            </div>
          ) : null}
        </div>
      )}

      <div className={`space-y-5 ${plain ? 'pt-4' : 'p-6'}`}>
        {!full && (
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
              Session
            </legend>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {sessions.map((d) => {
                const date = new Date(`${d}T12:00:00`);
                const on = session === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onSession(d)}
                    className={`flex min-w-[4.6rem] shrink-0 flex-col items-center rounded-2xl px-3 py-2.5 ${
                      on ? 'bg-ink text-paper' : 'bg-canvas hover:bg-warm'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${on ? 'text-white/60' : 'text-quiet'}`}>
                      {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </span>
                    <span className="font-display mt-0.5 text-xl font-bold leading-none">
                      {date.getDate()}
                    </span>
                    <span className={`mt-0.5 text-[10px] ${on ? 'text-white/60' : 'text-quiet'}`}>
                      {date.toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                    <span className={`mt-1.5 text-[10px] font-medium ${on ? 'text-signal' : 'text-ink'}`}>
                      {activity.startTime}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.session && <p className="mt-1 text-xs text-red-700">{errors.session}</p>}
          </fieldset>
        )}

        {!quote && offerTrial && !full && (
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
              How you join
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Choice
                on={enrollment === 'full'}
                onClick={() => set('enrollment', 'full')}
                label="Full place"
                hint={activity.priceUnit}
              />
              <Choice
                on={enrollment === 'trial'}
                onClick={() => set('enrollment', 'trial')}
                label="Trial"
                hint="First session"
              />
            </div>
          </fieldset>
        )}

        {!full && (
          <label className="block text-sm">
            {partyLabel}
            <span className="mt-1.5 flex h-11 items-center justify-between rounded-xl border border-hair bg-canvas/60 px-3">
              <button
                type="button"
                className="h-8 w-8 rounded-full text-lg leading-none disabled:opacity-30"
                disabled={form.party <= 1}
                onClick={() => set('party', Math.max(1, form.party - 1))}
              >
                −
              </button>
              <span className="font-semibold">{Math.min(form.party, maxParty)}</span>
              <button
                type="button"
                className="h-8 w-8 rounded-full text-lg leading-none disabled:opacity-30"
                disabled={form.party >= maxParty}
                onClick={() => set('party', Math.min(maxParty, form.party + 1))}
              >
                +
              </button>
            </span>
          </label>
        )}

        <Field
          label="Name"
          value={form.name}
          error={errors.name}
          autoComplete="off"
          onChange={(v) => set('name', v)}
        />
        <Field
          label="Email"
          value={form.email}
          error={errors.email}
          type="email"
          autoComplete="off"
          onChange={(v) => set('email', v)}
        />
        <Field
          label="Phone"
          value={form.phone}
          error={errors.phone}
          type="tel"
          autoComplete="off"
          onChange={(v) => set('phone', v)}
        />
        <label className="block text-sm">
          Note <span className="text-quiet">(optional)</span>
          <textarea
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            rows={2}
            placeholder={quote ? 'Team size, dates, invoice details…' : 'Level, access, who is coming…'}
            className="mt-1.5 w-full rounded-xl border border-hair bg-canvas/60 p-3 text-sm outline-none focus:border-ink focus:bg-paper"
          />
        </label>

        <button
          type="submit"
          className="min-h-12 w-full rounded-xl bg-signal text-sm font-semibold text-signal-ink"
        >
          {full ? 'Join waitlist' : ctaLabel(activity)}
        </button>
        <p className="text-xs leading-relaxed text-quiet">{activity.cancellationPolicy}</p>
        <p className="text-xs text-quiet">This is a demonstration. No payment is taken.</p>
      </div>
    </form>
  );
}
function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 h-11 w-full rounded-xl border bg-canvas/60 px-3 text-sm outline-none focus:bg-paper ${
          error ? 'border-red-400' : 'border-hair focus:border-ink'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </label>
  );
}

function Choice({
  on,
  onClick,
  label,
  hint,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left ${
        on ? 'border-ink bg-ink text-paper' : 'border-hair bg-canvas'
      }`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className={`block text-xs ${on ? 'text-white/60' : 'text-quiet'}`}>{hint}</span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-quiet">{k}</dt>
      <dd className="text-right font-medium capitalize">{v}</dd>
    </div>
  );
}
