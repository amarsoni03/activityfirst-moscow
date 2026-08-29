import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Globe,
  Heart,
  MapPin,
  Star,
  Users,
} from 'lucide-react';
import {
  bookingKindLabel,
  ctaLabel,
  fitPhrase,
  isOnline,
  kit,
  lengthLabel,
  money,
  placeDetail,
  prettyDateLong,
  scheduleLine,
  sessionWhen,
  upcomingSessions,
  walkLabel,
} from '../lib/format';
import { listingPhotos } from '../lib/catalog';
import { DEMO_USER, type Booking, type GuestDetails } from '../lib/types';
import { useApp, useBookingFor, useWaitlistFor } from '../state';
import { Cover, MetroDot, PhotoStage, WeekStrip } from '../ui/bits';
import { ActivityCard } from '../ui/Card';
import { Sheet } from '../ui/Sheets';
import { YandexPlaceMap } from '../ui/YandexPlaceMap';
import { BookingPanel } from './activity/BookingPanel';
import { ListingMosaic, PhotoLightbox } from './activity/Gallery';
import { Checklist, Chip, Fact } from './activity/ListingBits';
import { initials, type BookingForm } from './activity/form';

export function ActivityScreen({ id, openBooking }: { id: string; openBooking?: boolean }) {
  const { find, go, save, reserve, waitlist, cancel, message, state } = useApp();
  const activity = find(id);
  const booking = useBookingFor(id);
  const waitlisted = useWaitlistFor(id);
  const sessions = activity ? upcomingSessions(activity) : [];
  const [session, setSession] = useState(sessions[0] ?? '');
  const [drawer, setDrawer] = useState(false);
  const [note, setNote] = useState('');
  const [peek, setPeek] = useState<number | null>(null);
  const [form, setForm] = useState<BookingForm>(() => ({
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    phone: DEMO_USER.phone,
    note: '',
    party: 1,
    enrollment: 'full',
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm | 'session', string>>>({});

  const similar = useMemo(() => {
    if (!activity) return [];
    const pool = state.activities.filter((a) => {
      if (a.id === activity.id) return false;
      if (a.category !== activity.category) return false;
      if (activity.audience === 'Corporate') return a.audience === 'Corporate';
      return a.audience !== 'Corporate';
    });
    const sameStop = pool.filter((a) => a.metroStationId === activity.metroStationId);
    const rest = pool.filter((a) => a.metroStationId !== activity.metroStationId);
    return [...sameStop, ...rest].slice(0, 3);
  }, [activity, state.activities]);

  if (!activity) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-display text-3xl font-bold">This listing is gone.</p>
        <button type="button" className="mt-6 underline" onClick={() => go({ view: 'explore' })}>
          Back to search
        </button>
      </div>
    );
  }

  const saved = state.savedIds.includes(activity.id);
  const online = isOnline(activity.delivery);
  const full = activity.availableSeats === 0;
  const walk = walkLabel(activity);
  const photos = listingPhotos(activity);
  const { included, bring } = kit(activity);
  const quote = activity.template === 'Corporate';
  const fit = fitPhrase(activity, state.preferences, state.filters);
  const offerTrial =
    !quote &&
    activity.template !== 'Drop-in' &&
    activity.template !== 'Event' &&
    activity.priceUnit !== 'per session';
  const enrollment: Booking['enrollmentType'] = quote
    ? 'quote'
    : form.enrollment === 'trial' && offerTrial
      ? 'trial'
      : 'full';
  const maxParty = Math.max(
    1,
    Math.min(quote ? 16 : 4, full ? 1 : (activity.availableSeats ?? 4)),
  );
  const partyLabel =
    activity.audience === 'Children' ? 'Children' : quote ? 'People' : 'Guests';
  const seatsLabel =
    activity.availableSeats === undefined
      ? `${activity.capacity ?? '—'} seats`
      : full
        ? 'Waitlist'
        : `${activity.availableSeats} of ${activity.capacity ?? activity.availableSeats} open`;

  const submit = () => {
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a phone number';
    if (!full && !session) next.session = 'Pick a session';
    setErrors(next);
    if (Object.keys(next).length) return;

    const guest: GuestDetails = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      note: form.note.trim() || undefined,
      partySize: Math.min(form.party, maxParty),
    };

    if (full) {
      waitlist(activity, guest);
    } else {
      reserve(activity, enrollment, session, guest);
      if (guest.note) message(activity, guest.note);
    }
  };

  const panelProps = {
    activity,
    sessions,
    session,
    onSession: setSession,
    form,
    onForm: setForm,
    errors,
    enrollment,
    offerTrial,
    quote,
    full,
    maxParty,
    partyLabel,
    booking,
    waitlisted: Boolean(waitlisted),
    waitPosition: waitlisted?.position,
    onSubmit: submit,
    onCancel: () => {
      if (booking) cancel(booking.id);
      if (openBooking) go({ view: 'dashboard', tab: 'upcoming' });
    },
  };

  if (openBooking && booking) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => go({ view: 'dashboard', tab: 'upcoming' })}
          className="inline-flex min-h-10 items-center gap-2 text-sm text-quiet hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Bookings
        </button>
        <div className="mt-6">
          <BookingPanel {...panelProps} />
        </div>
        <button
          type="button"
          onClick={() => go({ view: 'activity', id: activity.id })}
          className="mt-5 text-sm text-quiet underline decoration-hair underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          View the listing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-canvas pb-8 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={() => go({ view: 'explore' })}
          className="inline-flex min-h-10 items-center gap-2 text-sm text-quiet hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Search
        </button>

        <div className="mt-4 overflow-hidden rounded-2xl bg-warm sm:rounded-3xl">
          <div className="md:hidden">
            <PhotoStage
              photos={photos}
              alt={activity.title}
              className="aspect-[4/3] min-h-[280px]"
              onOpen={setPeek}
            />
          </div>
          <ListingMosaic photos={photos} title={activity.title} onOpen={setPeek} />
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-12 md:pt-2">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>{activity.category}</Chip>
              <Chip>{activity.audience === 'Children' ? 'Kids' : activity.audience}</Chip>
              <Chip tone="signal">{bookingKindLabel(activity)}</Chip>
              <Chip>{fit}</Chip>
            </div>

            <h1 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              {activity.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {activity.reviewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Star className="h-3.5 w-3.5 fill-signal text-signal" />
                  {activity.rating.toFixed(1)}
                  <span className="font-normal text-quiet">· {activity.reviewCount} reviews</span>
                </span>
              ) : (
                <span className="text-quiet">No reviews yet — the listing is the class.</span>
              )}
              {online ? (
                <span className="text-quiet">{activity.meetingPlatform} · Moscow time</span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <MetroDot color={activity.metroLineColor ?? '#888'} size={9} />
                  {activity.metroStationName}
                  {walk ? <span className="text-quiet">· {walk}</span> : null}
                </span>
              )}
            </div>

            {(activity.teacherName || activity.studioName) && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-signal">
                  {initials(activity.teacherName ?? activity.studioName ?? 'AF')}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold tracking-tight">
                    {activity.teacherName ?? 'Host'}
                  </p>
                  <p className="truncate text-sm text-quiet">
                    Replies {activity.responseTimeText}
                  </p>
                </div>
              </div>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Fact icon={Clock} k="Length" v={lengthLabel(activity)} />
              <Fact icon={Users} k="Room" v={seatsLabel} />
              <Fact
                icon={Globe}
                k="Level"
                v={`${activity.language} · ${activity.level}`}
              />
              <Fact
                icon={MapPin}
                k="Location"
                v={online ? activity.delivery : activity.district ?? 'In person'}
              />
            </dl>

            {activity.shortDescription ? (
              <p className="font-display mt-10 text-xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.7rem] sm:leading-snug">
                {activity.shortDescription}
              </p>
            ) : null}

            <p className="mt-5 text-[17px] leading-relaxed text-ink/75">{activity.fullDescription}</p>

            {activity.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {activity.tags.slice(0, 6).map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            ) : null}

            <div className="mt-10 overflow-hidden rounded-2xl bg-paper">
              <div className="p-5 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
                  Schedule
                </p>
                <p className="font-display mt-2 text-2xl font-bold tracking-tight">
                  {scheduleLine(activity)}
                </p>
                <p className="mt-1 text-sm text-quiet">
                  Starts {prettyDateLong(activity.startDate)} · Moscow time
                </p>
                <div className="mt-5">
                  <WeekStrip days={activity.schedule.days} size="md" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Checklist title="In the room" items={included} />
              <Checklist title="You bring" items={bring} />
            </div>

            {!online && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-paper">
                <div className="flex">
                  <span
                    className="w-1.5 shrink-0"
                    style={{ backgroundColor: activity.metroLineColor ?? '#111' }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="p-5 sm:p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
                        Location
                      </p>
                      <p className="mt-2 flex items-start gap-2 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <span className="block text-lg font-semibold tracking-tight">
                            {activity.venue}
                          </span>
                          <span className="mt-0.5 block text-quiet">{activity.address}</span>
                          <span className="mt-3 inline-flex items-center gap-2">
                            <MetroDot color={activity.metroLineColor ?? '#888'} />
                            {activity.metroStationName} · {activity.metroLineName}
                            {walk ? ` · ${walk}` : ''}
                          </span>
                        </span>
                      </p>
                    </div>
                    <YandexPlaceMap activity={activity} />
                  </div>
                </div>
              </div>
            )}

            {(activity.teacherName || activity.studioName) && activity.teacherBio && (
              <div className="mt-4 flex gap-4 rounded-2xl bg-paper p-5 sm:p-7">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-signal">
                  {initials(activity.teacherName ?? activity.studioName ?? 'AF')}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
                    Host
                  </p>
                  <p className="font-display mt-1 text-2xl font-bold tracking-tight">
                    {activity.teacherName ?? 'Host'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{activity.teacherBio}</p>
                  <p className="mt-2 text-xs text-quiet">Replies {activity.responseTimeText}</p>
                </div>
              </div>
            )}

            <section className="mt-10 rounded-2xl border border-hair bg-paper p-5 sm:p-6">
              <h2 className="font-display text-2xl font-bold">Ask the host</h2>
              <p className="mt-2 text-sm text-quiet">
                A note goes to {activity.teacherName ?? 'the host'}. They reply {activity.responseTimeText}.
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Access, level, kids, invoices…"
                className="mt-4 w-full rounded-2xl border border-hair bg-canvas/50 p-3 text-sm outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={() => {
                  message(activity, note);
                  setNote('');
                }}
                className="mt-3 min-h-11 rounded-xl bg-ink px-5 text-sm font-semibold text-paper disabled:opacity-40"
                disabled={!note.trim()}
              >
                Send message
              </button>
            </section>
          </div>

          <aside className="hidden md:col-span-5 md:block">
            <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pb-2">
              <BookingPanel {...panelProps} />
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto mt-6 max-w-6xl px-4 pb-10 sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            More {activity.category.toLowerCase()} nearby
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        </section>
      )}

      {!drawer && (
        <div className="fixed inset-x-0 bottom-0 z-[35] border-t border-hair bg-paper/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <div className="flex min-w-0 items-center gap-3">
            {booking ? (
              <>
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-warm">
                  <Cover src={activity.coverImage} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {sessionWhen(activity, booking.sessionDate)}
                  </p>
                  <p className="truncate text-xs text-quiet">{placeDetail(activity)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  className="min-h-12 shrink-0 rounded-xl bg-signal px-4 text-sm font-semibold text-signal-ink"
                >
                  Your booking
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => save(activity.id)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hair"
                  aria-pressed={saved}
                  aria-label="Save"
                >
                  <Heart className={saved ? 'h-4 w-4 fill-ink' : 'h-4 w-4'} />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{money(activity.price)}</p>
                  <p className="truncate text-xs text-quiet">{activity.priceUnit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  className="min-h-12 flex-1 rounded-xl bg-signal text-sm font-semibold text-signal-ink"
                >
                  {full ? 'Join waitlist' : ctaLabel(activity)}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Sheet
        open={drawer}
        onClose={() => setDrawer(false)}
        title={booking ? 'Your booking' : full ? 'Waitlist' : 'Reserve'}
        from="bottom"
        flush
      >
        <BookingPanel {...panelProps} plain />
      </Sheet>

      {peek !== null ? (
        <PhotoLightbox
          photos={photos}
          index={peek}
          title={activity.title}
          onIndex={setPeek}
          onClose={() => setPeek(null)}
        />
      ) : null}
    </div>
  );
}
