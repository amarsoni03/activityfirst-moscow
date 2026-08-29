import type { Activity, DayOfWeek, Delivery, FilterState, UserPreferences } from './types';
import { DAYS } from './types';

export function money(amount: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}

export function localIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayIso(): string {
  return localIso();
}

export function isOnline(mode: Delivery): boolean {
  return mode === 'Live Online' || mode === 'Self-Paced';
}

export function ctaLabel(activity: Activity): string {
  return activity.template === 'Corporate' ? 'Request quote' : 'Reserve spot';
}

export function placeLabel(activity: Activity): string {
  if (isOnline(activity.delivery)) return activity.meetingPlatform ?? activity.delivery;
  return activity.metroStationName ?? 'Near metro';
}

export function walkLabel(activity: Activity): string | undefined {
  if (isOnline(activity.delivery)) return undefined;
  if (activity.walkMinutes && activity.walkMinutes > 0) {
    return `${activity.walkMinutes} min walk`;
  }
  return 'At the station';
}

export function prettyDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

export function todayName(): DayOfWeek {
  const js = new Date().getDay();
  return DAYS[(js + 6) % 7] ?? 'Monday';
}

function overlapSlots(activity: Activity, prefs?: UserPreferences) {
  const enabled = prefs?.freeTimeSlots.filter((s) => s.enabled) ?? [];
  return enabled.filter(
    (s) =>
      activity.schedule.days.includes(s.day) &&
      activity.schedule.timeOfDay.includes(s.timeOfDay),
  );
}

/** The product's time voice: one short sentence, not a dump of fields. */
export function fitPhrase(
  activity: Activity,
  prefs?: UserPreferences,
  filters?: FilterState,
): string {
  const overlaps = overlapSlots(activity, prefs);
  if (overlaps.length === 1) {
    const slot = overlaps[0];
    return `Fits your ${slot.day} ${slot.timeOfDay.toLowerCase()}`;
  }
  if (overlaps.length > 1) {
    return `Fits ${overlaps.length} of your free windows`;
  }

  if (filters?.days.length === 1 && filters.timeOfDay.length === 1) {
    const day = filters.days[0];
    const time = filters.timeOfDay[0];
    if (
      activity.schedule.days.includes(day) &&
      activity.schedule.timeOfDay.includes(time)
    ) {
      return `Fits ${day} ${time.toLowerCase()}`;
    }
  }

  if (activity.schedule.timeOfDay.includes('Evening') && activity.schedule.days.includes(todayName())) {
    return 'Tonight';
  }
  if (activity.schedule.days.some((d) => d === 'Saturday' || d === 'Sunday')) {
    const weekendDays = activity.schedule.days.filter(
      (d) => d === 'Saturday' || d === 'Sunday',
    );
    if (weekendDays.length) return `This ${weekendDays[0].toLowerCase()}`;
  }

  return `Starts ${prettyDate(activity.startDate)}`;
}

export function whyLine(
  activity: Activity,
  prefs?: UserPreferences,
  filters?: FilterState,
): string {
  const days = activity.schedule.days.map((d) => d.slice(0, 3)).join(' · ');
  const fit = fitPhrase(activity, prefs, filters);
  if (fit.startsWith('Fits') || fit === 'Tonight' || fit.startsWith('This ')) return fit;
  return `${days}  ${activity.schedule.timeRange}`;
}

export function upcomingSessions(activity: Activity, count = 5): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const listing = new Date(`${activity.startDate}T12:00:00`);
  const start = listing > today ? listing : today;
  for (let i = 0; i < 56 && out.length < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const name = DAYS[(d.getDay() + 6) % 7];
    if (name && activity.schedule.days.includes(name)) {
      out.push(localIso(d));
    }
  }
  return out.length ? out : [activity.startDate];
}

export function prettyDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function scheduleLine(activity: Activity): string {
  const days = activity.schedule.days.map((d) => d.slice(0, 3)).join(' · ');
  return `${days}  ${activity.schedule.timeRange}`;
}

export function lengthLabel(activity: Activity): string {
  const [sh, sm] = activity.startTime.split(':').map(Number);
  const [eh, em] = activity.endTime.split(':').map(Number);
  const mins = (eh ?? 0) * 60 + (em ?? 0) - ((sh ?? 0) * 60 + (sm ?? 0));
  if (!Number.isFinite(mins) || mins <= 0) return activity.duration;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function bookingKindLabel(activity: Activity): string {
  if (activity.template === 'Corporate') return 'Quote on request';
  if (activity.bookingKind === 'Request Spot') return 'Request a spot';
  if (activity.bookingKind === 'Open Enrollment') return 'Open enrollment';
  return 'Instant booking';
}

export function kit(activity: Activity): { included: string[]; bring: string[] } {
  if (isOnline(activity.delivery)) {
    return {
      included: [
        `Live session on ${activity.meetingPlatform ?? 'video'}`,
        'Moscow time (MSK)',
        'A teacher who can see you',
      ],
      bring: ['A quiet room', 'A working camera', 'Whatever the class asks for (mat, notebook, racquet)'],
    };
  }

  const packs: Record<string, { included: string[]; bring: string[] }> = {
    Yoga: {
      included: ['Mats, blocks, and straps', 'Changing space', 'Filtered water'],
      bring: ['Clothes you can move in', 'Grip socks if you prefer'],
    },
    Languages: {
      included: ['Printed notes', 'Audio homework', 'Tea in the break'],
      bring: ['A notebook', 'The will to speak, even badly'],
    },
    Coding: {
      included: ['A desk and power', 'Datasets for the week', 'Code review'],
      bring: ['A laptop that can stay in the room'],
    },
    Dance: {
      included: ['A sprung or marked floor', 'Water', 'A cloakroom'],
      bring: ['Shoes you can dance in', 'Something to change into'],
    },
    Cooking: {
      included: ['Ingredients', 'Aprons', 'The meal you cook'],
      bring: ['Closed-toe shoes', 'Appetite'],
    },
    Tennis: {
      included: ['Balls and hoppers', 'A coach for the group'],
      bring: ['Your racquet', 'Court shoes'],
    },
    Pottery: {
      included: ['Clay', 'A firing', 'Aprons and tools'],
      bring: ['Clothes that can take dust', 'Hair tied back'],
    },
    Theatre: {
      included: ['A black-box room', 'Scripts', 'A little costume trunk'],
      bring: ['Soft shoes', 'Water'],
    },
    Fitness: {
      included: ['Barbells and plates', 'A programme posted Monday', 'Showers where the building has them'],
      bring: ['Training shoes', 'A towel'],
    },
    Music: {
      included: ['A practice amp kept quiet', 'Stands and charts'],
      bring: ['Your instrument, unless arranged'],
    },
    Photography: {
      included: ['A walking route from the station', 'A brief for the hour'],
      bring: ['A camera or a current phone', 'Weather-ready shoes'],
    },
    Chess: {
      included: ['Boards and clocks', 'Tea in the corridor'],
      bring: ['A quiet competitive streak'],
    },
    Swimming: {
      included: ['Lane space', 'A cap you can borrow once'],
      bring: ['Costume', 'Goggles if you have them'],
    },
    Pilates: {
      included: ['Reformer or mat as listed', 'Grip socks if you forget'],
      bring: ['Fitted clothes', 'Hair off the face'],
    },
    Painting: {
      included: ['Paper or canvas', 'Paint that is labelled', 'Aprons'],
      bring: ['Clothes you do not mind staining'],
    },
    'Public Speaking': {
      included: ['A closed room', 'Recorded rounds on request'],
      bring: ['The talk you actually have to give'],
    },
  };

  return (
    packs[activity.category] ?? {
      included: ['Instruction', 'Everything the session needs'],
      bring: ['Yourself, on Moscow time'],
    }
  );
}
