import { useState } from 'react';
import { activitySlug, CATEGORIES, coverForCategory } from '../lib/catalog';
import { STATIONS } from '../lib/metro';
import { DAYS, type Activity, type Audience, type DayOfWeek, type TimeOfDay } from '../lib/types';
import { useApp } from '../state';
import { ActivityCard } from '../ui/Card';

export function Publish() {
  const { addActivity, go } = useApp();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Yoga');
  const [audience, setAudience] = useState<Audience>('Adults');
  const [stationId, setStationId] = useState('arbatskaya');
  const [days, setDays] = useState<DayOfWeek[]>(['Tuesday']);
  const [time, setTime] = useState<TimeOfDay>('Evening');
  const [price, setPrice] = useState(4500);
  const [blurb, setBlurb] = useState('');

  const station = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0]!;

  const startTime = time === 'Morning' ? '10:00' : time === 'Afternoon' ? '15:00' : '19:00';
  const endTime = time === 'Morning' ? '11:15' : time === 'Afternoon' ? '16:30' : '20:15';
  const timeRange =
    time === 'Morning' ? '10:00–11:15' : time === 'Afternoon' ? '15:00–16:30' : '19:00–20:15';

  const draft = (): Activity => ({
    id: activitySlug(title || `${category} near ${station.name}`, station.id),
    title: title.trim() || `${category} near ${station.name}`,
    category,
    audience,
    template: audience === 'Corporate' ? 'Corporate' : 'Class',
    startDate: new Date().toISOString().slice(0, 10),
    frequency: 'Weekly',
    weekdays: days.length ? days : ['Tuesday'],
    startTime,
    endTime,
    duration: '75 min',
    schedule: {
      days: days.length ? days : ['Tuesday'],
      timeOfDay: [time],
      timeRange,
    },
    metroLineId: station.lineId,
    metroLineName: station.lineName,
    metroLineColor: station.lineColor,
    metroStationId: station.id,
    metroStationName: station.name,
    walkMinutes: 6,
    address: station.street,
    district: station.district,
    venue: station.venues[0] ?? station.name,
    price,
    priceUnit: 'per session',
    currency: '₽',
    level: 'All Levels',
    language: 'English',
    shortDescription: blurb.trim() || 'A new activity listed from the publish flow.',
    fullDescription: blurb.trim() || 'A new activity listed from the publish flow.',
    tags: [category],
    goals: ['Learn'],
    popularityScore: 40,
    newActivity: true,
    rating: 0,
    reviewCount: 0,
    delivery: 'In Person',
    bookingKind: 'Instant Booking',
    capacity: 12,
    availableSeats: 12,
    teacherName: 'Independent host',
    coverImage: coverForCategory(category),
    cancellationPolicy: 'Free cancellation up to 24 hours before the session.',
    responseTimeText: 'usually within 2 hours',
  });

  const publish = () => {
    addActivity(draft());
    go({ view: 'explore' });
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-quiet">
        Step {step + 1} of 5
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">Post an activity</h1>

      {step === 0 && (
        <label className="mt-8 block text-sm">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-hair px-3"
            placeholder="Thursday wheel · Arbatskaya"
          />
        </label>
      )}
      {step === 1 && (
        <div className="mt-8 grid gap-4">
          <label className="text-sm">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-hair px-3"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Audience
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
              className="mt-2 h-12 w-full rounded-2xl border border-hair px-3"
            >
              <option>Adults</option>
              <option>Children</option>
              <option>Corporate</option>
            </select>
          </label>
        </div>
      )}
      {step === 2 && (
        <label className="mt-8 block text-sm">
          Station
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-hair px-3"
          >
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {step === 3 && (
        <div className="mt-8">
          <p className="text-sm">Days</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  setDays((cur) =>
                    cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
                  )
                }
                className={`h-10 rounded-full px-3 text-sm ${
                  days.includes(d) ? 'bg-ink text-paper' : 'bg-canvas'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(['Morning', 'Afternoon', 'Evening'] as TimeOfDay[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`min-h-11 rounded-xl text-sm ${
                  time === t ? 'bg-signal text-signal-ink' : 'bg-canvas'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="mt-8 grid gap-4">
          <label className="text-sm">
            Price (₽)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-2 h-12 w-full rounded-2xl border border-hair px-3"
            />
          </label>
          <label className="text-sm">
            Short description
            <textarea
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-hair p-3"
            />
          </label>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-quiet">
              How it appears in search
            </p>
            <div className="mt-3">
              <ActivityCard activity={draft()} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="min-h-12 rounded-full border border-hair px-5"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 0 && title.trim().length < 2) return;
              if (step === 3 && days.length === 0) return;
              setStep((s) => s + 1);
            }}
            disabled={(step === 0 && title.trim().length < 2) || (step === 3 && days.length === 0)}
            className="min-h-12 rounded-full bg-ink px-6 font-semibold text-paper"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={publish}
            className="min-h-12 rounded-full bg-ink px-6 font-semibold text-paper"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
}
