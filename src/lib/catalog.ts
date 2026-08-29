import type {
  Activity,
  Audience,
  DayOfWeek,
  Goal,
  Level,
  MetroStation,
  Template,
  TimeOfDay,
} from './types';
import { STATIONS } from './metro';

export const CATEGORIES = [
  'Yoga',
  'Languages',
  'Coding',
  'Dance',
  'Cooking',
  'Tennis',
  'Pottery',
  'Theatre',
  'Fitness',
  'Music',
  'Photography',
  'Chess',
  'Swimming',
  'Pilates',
  'Painting',
  'Public Speaking',
] as const;

export const POPULAR = [
  'Yoga',
  'Languages',
  'Tennis',
  'Pottery',
  'Cooking',
  'Dance',
  'Coding',
  'Swimming',
] as const;

export const GOAL_MAP: Record<string, string[]> = {
  Learn: ['Languages', 'Coding', 'Chess', 'Public Speaking'],
  Exercise: ['Yoga', 'Fitness', 'Tennis', 'Swimming', 'Pilates'],
  Create: ['Pottery', 'Painting', 'Photography', 'Music'],
  Relax: ['Yoga', 'Pilates', 'Painting'],
  'Meet People': ['Dance', 'Cooking', 'Theatre'],
  Career: ['Coding', 'Public Speaking', 'Languages'],
  Kids: ['Chess', 'Swimming', 'Theatre', 'Dance'],
};

function covers(slug: string): string[] {
  return [1, 2, 3, 4].map((n) => `/covers/${slug}-${n}.webp`);
}

export const COVER: Record<string, string[]> = {
  Yoga: covers('yoga'),
  Languages: covers('languages'),
  Coding: covers('coding'),
  Dance: covers('dance'),
  Cooking: covers('cooking'),
  Tennis: covers('tennis'),
  Pottery: covers('pottery'),
  Theatre: covers('theatre'),
  Fitness: covers('fitness'),
  Music: covers('music'),
  Photography: covers('photography'),
  Chess: covers('chess'),
  Swimming: covers('swimming'),
  Pilates: covers('pilates'),
  Painting: covers('painting'),
  'Public Speaking': covers('public-speaking'),
};

export const HERO_MOSCOW = '/covers/moscow-hero.webp';

export function coverForCategory(category: string, n = 0): string {
  const list = COVER[category] ?? COVER['Yoga'] ?? [];
  return list[n % Math.max(list.length, 1)] ?? '/covers/yoga-1.webp';
}

interface Seed {
  category: string;
  title: string;
  blurb: string;
  long: string;
  goals: Goal[];
  template: Template;
  level: Level;
  days: DayOfWeek[];
  time: TimeOfDay;
  start: string;
  end: string;
  freq: string;
  price: number;
  unit: Activity['priceUnit'];
}

const ADULT: Seed[] = [
  { category: 'Yoga', title: 'Evening hatha after the office', blurb: 'Ninety minutes on the mat once the Garden Ring has emptied. Russian and English cues.', long: 'A small-group hatha class for people who sit at desks in the centre. No heat, no playlist that fights the room. Mats are provided. The session is built around hips and the thoracic spine — the two places Moscow commutes punish first.', goals: ['Exercise', 'Relax'], template: 'Class', level: 'All Levels', days: ['Tuesday', 'Thursday'], time: 'Evening', start: '19:15', end: '20:30', freq: 'Twice weekly', price: 8900, unit: 'per month' },
  { category: 'Languages', title: 'Spoken Russian for working residents', blurb: 'Conversation tables with a TRKI-aware teacher. Cases in sentences, not in charts.', long: 'Twice a week in a room that faces the street, not a whiteboard. Groups of eight. You will leave able to handle a clinic, a landlord, and a dinner that ran long. Homework is audio from Echo and Meduza, not a workbook.', goals: ['Learn'], template: 'Program', level: 'Beginner', days: ['Monday', 'Wednesday'], time: 'Evening', start: '19:30', end: '21:00', freq: 'Twice weekly', price: 18600, unit: 'per program' },
  { category: 'Coding', title: 'Python for people who are not engineers', blurb: 'Twelve weeks, Moscow evenings, a script you can actually show a manager.', long: 'For analysts, producers, and operations leads who are tired of waiting on data teams. Pandas, messy Excel, a little SQL. Laptops stay in the room. The final project is a report you already need at work.', goals: ['Learn', 'Career'], template: 'Program', level: 'Beginner', days: ['Monday', 'Thursday'], time: 'Evening', start: '19:00', end: '21:00', freq: 'Twice weekly', price: 42000, unit: 'per program' },
  { category: 'Dance', title: 'Social bachata, no partner required', blurb: 'Friday nights. Lead or follow. Shoes off the Garden Ring mud.', long: 'A drop-in social class that does not assume you arrived as a couple. The first 40 minutes are pattern; the rest is dancing with whoever is in the room. Water and a cloakroom. The neighbourhood bars are an optional second act.', goals: ['Meet People', 'Exercise'], template: 'Drop-in', level: 'Beginner', days: ['Friday'], time: 'Evening', start: '20:00', end: '21:30', freq: 'Weekly', price: 1600, unit: 'per session' },
  { category: 'Cooking', title: 'Georgian table, weeknight timing', blurb: 'Khachapuri, herbs, and a kitchen that has to finish by 21:30 because people have the metro.', long: 'Cook as a group of ten. You eat what you make. Recipes are written in English with Russian names intact. Ingredients come from nearby markets — Danilovsky, Usachyovsky, or the Kievskaya halls depending on the site.', goals: ['Create', 'Meet People'], template: 'Workshop', level: 'All Levels', days: ['Wednesday'], time: 'Evening', start: '18:30', end: '21:00', freq: 'Weekly', price: 4900, unit: 'per session' },
  { category: 'Tennis', title: 'Rally clinic before the courts fill', blurb: 'Outdoor and bubble courts depending on the month. Footwork first.', long: 'A Saturday morning clinic for players who already know a forehand and want it to hold up in a match. Groups of four. Balls and hoppers provided; bring your own racquet. In winter the same coach moves under the bubble.', goals: ['Exercise'], template: 'Class', level: 'Intermediate', days: ['Saturday'], time: 'Morning', start: '09:00', end: '10:30', freq: 'Weekly', price: 4200, unit: 'per session' },
  { category: 'Pottery', title: 'Thursday wheel at the factory floors', blurb: 'Clay, a firing included, and a mug that will not be perfect.', long: 'Hosted in post-industrial rooms around Artplay, Winzavod, and Flacon. One lump of clay, two hours, glaze on a later visit. Aprons on site. The point is to use your hands after a week of screens.', goals: ['Create', 'Relax'], template: 'Class', level: 'Beginner', days: ['Thursday'], time: 'Evening', start: '19:00', end: '21:00', freq: 'Weekly', price: 7800, unit: 'per month' },
  { category: 'Theatre', title: 'Scene study in English', blurb: 'Short contemporary scenes. No parents, no showcase, no ticket sales.', long: 'Sunday afternoon in a black-box room. You work a scene for three weeks, then put it down. The language is English; the room is Moscow. Suitable if you have done student theatre or nothing at all.', goals: ['Meet People', 'Learn'], template: 'Workshop', level: 'All Levels', days: ['Sunday'], time: 'Afternoon', start: '15:00', end: '17:30', freq: 'Weekly', price: 3800, unit: 'per session' },
  { category: 'Fitness', title: 'Strength without the shouting', blurb: 'Barbell, eight people, a coach who watches your left knee.', long: 'Small-group strength in a room that is not a nightclub. Headphones are fine. Programming is posted on Monday. Deload weeks are real. Showers on site at most venues.', goals: ['Exercise'], template: 'Class', level: 'Intermediate', days: ['Tuesday', 'Friday'], time: 'Evening', start: '18:30', end: '19:30', freq: 'Twice weekly', price: 12500, unit: 'per month' },
  { category: 'Music', title: 'Guitar for people with one free evening', blurb: 'Four chords that sound like songs. Nylon or steel.', long: 'Monday evenings. You leave able to accompany yourself on two songs you actually like. Amps stay quiet. The teacher will not make you perform for the group unless you ask.', goals: ['Create', 'Learn'], template: 'Program', level: 'Beginner', days: ['Monday'], time: 'Evening', start: '19:00', end: '20:00', freq: 'Weekly', price: 9600, unit: 'per month' },
  { category: 'Photography', title: 'Golden hour on one boulevard', blurb: 'How to stop taking the same dome. Cameras or a current iPhone.', long: 'A walk that starts at the station and ends when the light dies. One assignment per week: a single street, a single hour. Critique is in the room the following Saturday, not in a WhatsApp dump.', goals: ['Create'], template: 'Workshop', level: 'All Levels', days: ['Saturday'], time: 'Afternoon', start: '16:00', end: '18:30', freq: 'Weekly', price: 3200, unit: 'per session' },
  { category: 'Pilates', title: 'Reformer before the office', blurb: 'Eight machines. A teacher who notices if you hold your breath at Tverskaya pace.', long: 'Morning reformer in a quiet studio. Socks with grips are provided if you forget yours. The work is precise, not performative. Showers where the building has them — asked at booking.', goals: ['Exercise', 'Relax'], template: 'Class', level: 'All Levels', days: ['Wednesday', 'Saturday'], time: 'Morning', start: '07:45', end: '08:40', freq: 'Twice weekly', price: 16800, unit: 'per month' },
];

const KIDS: Seed[] = [
  { category: 'Chess', title: 'Saturday chess club', blurb: 'Slow games, no timers in the first month, tea for parents in the corridor.', long: 'A park or hall club for children 7–12. Boards stay on the table. The coach is FIDE-rated; the room is not a tournament hall until a child asks. One parent waits outside after drop-off.', goals: ['Kids', 'Learn'], template: 'Class', level: 'Beginner', days: ['Saturday'], time: 'Morning', start: '11:00', end: '12:15', freq: 'Weekly', price: 6400, unit: 'per month' },
  { category: 'Swimming', title: 'Small-group swim, four per lane', blurb: 'Warm water, Chaika-style coaching, no races until they want them.', long: 'After-school swim in city pools with a four-child cap per instructor. Caps and goggles can be borrowed once. Parents stay in the gallery, not on the deck.', goals: ['Kids', 'Exercise'], template: 'Program', level: 'Beginner', days: ['Tuesday', 'Thursday'], time: 'Afternoon', start: '16:30', end: '17:20', freq: 'Twice weekly', price: 14800, unit: 'per program' },
  { category: 'Dance', title: 'Contemporary for school-age kids', blurb: 'Floor work and rhythm. The kind of class they ask to repeat.', long: 'Wednesday after school. Bare feet, one water break, no recital costumes in the first term. Ages 8–12. Changing room on site.', goals: ['Kids', 'Create'], template: 'Class', level: 'Beginner', days: ['Wednesday'], time: 'Afternoon', start: '16:00', end: '17:00', freq: 'Weekly', price: 7200, unit: 'per month' },
  { category: 'Theatre', title: 'After-school drama', blurb: 'Improvisation and short plays. One trunk of costumes.', long: 'Friday groups of twelve. Russian and English mixed depending on the site. Parents collect from the corridor at 17:30, not from the stage.', goals: ['Kids', 'Meet People'], template: 'Program', level: 'All Levels', days: ['Friday'], time: 'Afternoon', start: '16:00', end: '17:30', freq: 'Weekly', price: 6900, unit: 'per month' },
  { category: 'Coding', title: 'Scratch to games they invent', blurb: 'Laptops provided. No worksheets.', long: 'Saturday lab for 9–13. They build a game and explain it in two minutes at the end of term. Snacks are not sold in the room.', goals: ['Kids', 'Learn'], template: 'Camp', level: 'Beginner', days: ['Saturday'], time: 'Morning', start: '10:00', end: '12:00', freq: 'Weekly', price: 4500, unit: 'per session' },
  { category: 'Painting', title: 'Gouache for small hands', blurb: 'Big paper, stained aprons, work that goes home wet.', long: 'Sunday morning studio. Ages 6–10. Paint is non-toxic. Parents do not sit in unless a child is new that week.', goals: ['Kids', 'Create'], template: 'Class', level: 'Beginner', days: ['Sunday'], time: 'Morning', start: '11:00', end: '12:30', freq: 'Weekly', price: 5400, unit: 'per month' },
  { category: 'Tennis', title: 'Mini-tennis, red balls', blurb: 'Short courts, plenty of rallies, CSKA and Luzhniki sites in rotation.', long: 'Saturday afternoon for 6–9. Racquets in 21–23 inch if needed. Indoor in winter. One adult stays on the bench.', goals: ['Kids', 'Exercise'], template: 'Class', level: 'Beginner', days: ['Saturday'], time: 'Afternoon', start: '13:00', end: '14:00', freq: 'Weekly', price: 3400, unit: 'per session' },
  { category: 'Music', title: 'Children’s choir', blurb: 'Unison first. Harmony later. Parents wait outside.', long: 'Sunday afternoon choir for 7–12. One concert a year, in December, in the same building. No touring.', goals: ['Kids', 'Create'], template: 'Class', level: 'All Levels', days: ['Sunday'], time: 'Afternoon', start: '14:00', end: '15:00', freq: 'Weekly', price: 6100, unit: 'per month' },
  { category: 'Pottery', title: 'Clay club', blurb: 'Pinch pots and animals. Firing included, pickup the following week.', long: 'Saturday clay for 7–11. Everything is labelled. Glaze is food-safe on cups. Dust is managed; hair ties recommended.', goals: ['Kids', 'Create'], template: 'Workshop', level: 'Beginner', days: ['Saturday'], time: 'Afternoon', start: '15:00', end: '16:30', freq: 'Weekly', price: 2900, unit: 'per session' },
  { category: 'Languages', title: 'English through stories', blurb: 'Picture books and spoken games. No grammar posters.', long: 'Twice weekly after school. Native and bilingual teachers. Max eight children. The room has a cloakroom because Moscow January is real.', goals: ['Kids', 'Learn'], template: 'Program', level: 'Beginner', days: ['Monday', 'Wednesday'], time: 'Afternoon', start: '16:30', end: '17:30', freq: 'Twice weekly', price: 11200, unit: 'per program' },
];

const CORP: Seed[] = [
  { category: 'Public Speaking', title: 'Boardroom voice, closed door', blurb: 'For teams that present too fast and apologise too often.', long: 'A half-day workshop in a room that is not the office. Recorded rounds, then live. Russian or English track booked in advance. NDA on request. Moscow City and Kitay-gorod rooms available.', goals: ['Career'], template: 'Corporate', level: 'All Levels', days: ['Tuesday'], time: 'Morning', start: '10:00', end: '13:00', freq: 'By arrangement', price: 180000, unit: 'total program' },
  { category: 'Cooking', title: 'Team kitchen, one service', blurb: 'Twelve people, one table, a menu that has to land together.', long: 'Offsite cooking in market kitchens and studio kitchens. Dietary constraints collected 72 hours ahead. You eat standing or seated depending on the site. Invoice in RUB, VAT as agreed.', goals: ['Meet People'], template: 'Corporate', level: 'All Levels', days: ['Friday'], time: 'Afternoon', start: '15:00', end: '18:00', freq: 'By arrangement', price: 96000, unit: 'total program' },
  { category: 'Yoga', title: 'Office reset, chairs allowed', blurb: 'Forty minutes. No lycra requirement. Can run in a meeting room.', long: 'Weekly on-site or in a nearby studio. Breath, hips, neck. Suitable for mixed mobility. Mats can be delivered to Moscow City, White Square, and Garden Ring offices.', goals: ['Relax', 'Exercise'], template: 'Corporate', level: 'All Levels', days: ['Wednesday'], time: 'Morning', start: '08:30', end: '09:15', freq: 'Weekly', price: 42000, unit: 'per month' },
  { category: 'Photography', title: 'Neighbourhood brand walk', blurb: 'Images a company can actually use, not stock of the Kremlin.', long: 'A guided walk from the nearest station with a brief: people at work, materials, winter light. Deliverables in a shared folder within five days. Model releases if faces are central.', goals: ['Create', 'Career'], template: 'Corporate', level: 'All Levels', days: ['Thursday'], time: 'Afternoon', start: '14:00', end: '17:00', freq: 'By arrangement', price: 74000, unit: 'total program' },
  { category: 'Theatre', title: 'Improvisation for teams', blurb: 'Listening drills. No trust falls. Taganka and Kamergersky rooms.', long: 'Three hours. Groups of 8–16. The work is status, timing, and saying yes without becoming a comedy club. Facilitators work in English or Russian.', goals: ['Meet People', 'Career'], template: 'Corporate', level: 'All Levels', days: ['Monday'], time: 'Afternoon', start: '15:00', end: '18:00', freq: 'By arrangement', price: 110000, unit: 'total program' },
  { category: 'Coding', title: 'AI workshop for leads', blurb: 'What models can and cannot do, without a vendor deck.', long: 'A full day at Moscow City or Kuznetsky. Hands-on prompts on your own documents. Security and data-residency questions are in the afternoon, not a footnote.', goals: ['Career', 'Learn'], template: 'Corporate', level: 'Intermediate', days: ['Wednesday'], time: 'Morning', start: '10:00', end: '16:00', freq: 'By arrangement', price: 240000, unit: 'total program' },
];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function must<T>(arr: T[], i: number): T {
  const item = arr[i % arr.length];
  if (!item) throw new Error('seed list is empty');
  return item;
}

function coverFor(category: string, n: number): string {
  const list = COVER[category] ?? COVER['Yoga'] ?? [];
  return must(list, n);
}

const HOSTS = [
  'Irina Sokolova',
  'Dmitry Orlov',
  'Elena Volkova',
  'James Whitaker',
  'Maria Kuznetsova',
  'Pavel Egorov',
  'Sofia Morozova',
  'Alexei Novikov',
  'Nina Belova',
  'Tom Hughes',
  'Olga Smirnova',
  'Andrei Petrov',
];

function isoFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function activitySlug(title: string, stationId?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return stationId ? `${base}-${stationId}` : `live-${base}`;
}

function makeOne(
  seed: Seed,
  station: MetroStation,
  audience: Audience,
  salt: number,
): Activity {
  const rnd = rng(salt + station.name.length * 13);
  const start = isoFromToday(-18 + Math.floor(rnd() * 12));
  const walk = 3 + (salt % 8);
  const seats = 6 + Math.floor(rnd() * 6);
  const taken = Math.min(seats - 1, Math.floor(rnd() * 3));
  const venue = must(station.venues, salt);
  const host = must(HOSTS, salt + station.name.length);

  return {
    id: activitySlug(seed.title, station.id),
    title: seed.title,
    category: seed.category,
    audience,
    template: seed.template,
    startDate: start,
    frequency: seed.freq,
    weekdays: seed.days,
    startTime: seed.start,
    endTime: seed.end,
    duration: `${seed.start}–${seed.end}`,
    schedule: {
      days: seed.days,
      timeOfDay: [seed.time],
      timeRange: `${seed.start}–${seed.end}`,
    },
    metroLineId: station.lineId,
    metroLineName: station.lineName,
    metroLineColor: station.lineColor,
    metroStationId: station.id,
    metroStationName: station.name,
    walkMinutes: walk,
    address: `${venue}, ${station.street}`,
    district: station.district,
    venue,
    price: seed.price,
    priceUnit: seed.unit,
    currency: '₽',
    level: seed.level,
    language: rnd() < 0.55 ? 'English' : rnd() < 0.8 ? 'Bilingual' : 'Russian',
    shortDescription: `${seed.blurb} ${walk} min walk from ${station.name}.`,
    fullDescription: `${seed.long} Held at ${venue} in ${station.district} (${station.street}). Nearest metro: ${station.name} (${station.nameRu}), ${station.lineName} line. ${walk} minutes on foot. Moscow time.`,
    tags: [seed.category, station.name, station.district],
    goals: seed.goals,
    popularityScore: Math.round(45 + rnd() * 40),
    featured: salt % 7 === 0,
    newActivity: true,
    rating: 0,
    reviewCount: 0,
    delivery: 'In Person',
    bookingKind: seed.template === 'Corporate' ? 'Request Spot' : 'Instant Booking',
    capacity: seats,
    availableSeats: Math.max(1, seats - taken),
    teacherName: host,
    teacherBio: `${host} leads this ${seed.category.toLowerCase()} session at ${venue}. Small group, Moscow time.`,
    coverImage: coverFor(seed.category, salt + station.name.length),
    cancellationPolicy: 'Free cancellation up to 24 hours before the session.',
    responseTimeText: 'usually within 2 hours',
  };
}

const ADULT_SITES: [number, string][] = [
  [0, 'arbatskaya'],
  [0, 'park-kultury'],
  [1, 'tverskaya'],
  [1, 'chistye'],
  [2, 'kuznetsky'],
  [2, 'city'],
  [3, 'mayakov'],
  [3, 'pushkin'],
  [4, 'kievskaya'],
  [4, 'dobrynin'],
  [5, 'vorobyovy'],
  [5, 'cska'],
  [6, 'kurskaya'],
  [6, 'savyolov'],
  [7, 'taganskaya'],
  [7, 'teatral'],
  [8, 'pushkin'],
  [8, 'barrikad'],
  [9, 'smolensk'],
  [10, 'park-kultury'],
  [10, 'okhotny'],
  [11, 'tverskaya'],
  [11, 'belorus'],
];

const KIDS_SITES: [number, string][] = [
  [0, 'sokolniki'],
  [1, 'park-kultury'],
  [2, 'mayakov'],
  [3, 'taganskaya'],
  [4, 'savyolov'],
  [5, 'chistye'],
  [6, 'cska'],
  [6, 'vorobyovy'],
  [7, 'teatral'],
  [8, 'kurskaya'],
  [9, 'tverskaya'],
  [9, 'belorus'],
];

const CORP_SITES: [number, string][] = [
  [0, 'city'],
  [1, 'dobrynin'],
  [2, 'city'],
  [3, 'kuznetsky'],
  [4, 'taganskaya'],
  [5, 'city'],
];

function stationOrThrow(id: string): MetroStation {
  const s = STATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown station ${id}`);
  return s;
}

const ONLINE: Seed[] = [
  { category: 'Languages', title: 'Live Russian on Zoom, Moscow evenings', blurb: 'Same curriculum as the room classes. Camera on. Moscow time.', long: 'A live online conversation group for people who cannot cross the city twice a week. TRKI-aware teacher. Eight on the call. Homework in a shared folder.', goals: ['Learn'], template: 'Class', level: 'Beginner', days: ['Tuesday', 'Thursday'], time: 'Evening', start: '19:30', end: '21:00', freq: 'Twice weekly', price: 14200, unit: 'per program' },
  { category: 'Yoga', title: 'Morning hatha, live from a Khamovniki studio', blurb: 'Broadcast live. You are not watching a recording.', long: 'A 55-minute live class. The teacher can see you. Space for a mat and a quiet room is enough. Moscow 07:30 start.', goals: ['Exercise', 'Relax'], template: 'Class', level: 'All Levels', days: ['Monday', 'Wednesday', 'Friday'], time: 'Morning', start: '07:30', end: '08:25', freq: 'Three times a week', price: 6200, unit: 'per month' },
  { category: 'Coding', title: 'Python live cohort', blurb: 'Evenings on Google Meet. Same twelve-week arc.', long: 'For people outside the Garden Ring who still want a cohort. Pair work in breakout rooms. Moscow time, no recordings of your screen without consent.', goals: ['Learn', 'Career'], template: 'Program', level: 'Beginner', days: ['Monday', 'Thursday'], time: 'Evening', start: '19:00', end: '21:00', freq: 'Twice weekly', price: 36000, unit: 'per program' },
  { category: 'Public Speaking', title: 'Camera presence for hybrid teams', blurb: 'How to stop presenting to your own thumbnail.', long: 'Four live sessions. You present, you get notes, you present again. Corporate invoices accepted.', goals: ['Career'], template: 'Workshop', level: 'All Levels', days: ['Wednesday'], time: 'Morning', start: '10:00', end: '12:00', freq: 'Weekly', price: 28000, unit: 'per program' },
  { category: 'Pilates', title: 'Live reformer-style mat, MSK mornings', blurb: 'Mat work that follows the reformer sequence. Camera on.', long: 'Tuesday and Thursday 08:00 MSK. Suitable if you have a mat and a quiet floor. English cues.', goals: ['Exercise', 'Relax'], template: 'Class', level: 'All Levels', days: ['Tuesday', 'Thursday'], time: 'Morning', start: '08:00', end: '08:50', freq: 'Twice weekly', price: 5400, unit: 'per month' },
  { category: 'Languages', title: 'Kids’ English stories, live', blurb: 'Picture books on Zoom. Max six children. Moscow afternoons.', long: 'After-school live English for 6–9. A parent stays in the room for the first two sessions. Camera required.', goals: ['Kids', 'Learn'], template: 'Class', level: 'Beginner', days: ['Monday', 'Wednesday'], time: 'Afternoon', start: '16:30', end: '17:20', freq: 'Twice weekly', price: 8900, unit: 'per program' },
  { category: 'Chess', title: 'Online chess club for children', blurb: 'Lichess + a coach. Saturday mornings MSK.', long: 'Boards on the screen, coach in Moscow. Ages 7–12. No open chat with other children.', goals: ['Kids', 'Learn'], template: 'Class', level: 'Beginner', days: ['Saturday'], time: 'Morning', start: '11:00', end: '12:00', freq: 'Weekly', price: 4800, unit: 'per month' },
  { category: 'Fitness', title: 'Strength at home, live coaching', blurb: 'Dumbbells or a backpack. Eight on the call.', long: 'Evening live strength for people who will not cross the city in January. Programming posted on Monday.', goals: ['Exercise'], template: 'Class', level: 'Intermediate', days: ['Tuesday', 'Friday'], time: 'Evening', start: '18:30', end: '19:20', freq: 'Twice weekly', price: 7200, unit: 'per month' },
];

export function buildCatalog(): Activity[] {
  const list: Activity[] = [];

  ADULT_SITES.forEach(([seedIndex, stationId], i) => {
    list.push(makeOne(must(ADULT, seedIndex), stationOrThrow(stationId), 'Adults', i));
  });
  KIDS_SITES.forEach(([seedIndex, stationId], i) => {
    list.push(makeOne(must(KIDS, seedIndex), stationOrThrow(stationId), 'Children', 100 + i));
  });
  CORP_SITES.forEach(([seedIndex, stationId], i) => {
    list.push(makeOne(must(CORP, seedIndex), stationOrThrow(stationId), 'Corporate', 200 + i));
  });

  ONLINE.forEach((seed, i) => {
    list.push({
      id: activitySlug(seed.title),
      title: seed.title,
      category: seed.category,
      audience: seed.goals.includes('Kids') ? 'Children' : i === 3 ? 'Corporate' : 'Adults',
      template: seed.template,
      startDate: isoFromToday(-10 + i),
      frequency: seed.freq,
      weekdays: seed.days,
      startTime: seed.start,
      endTime: seed.end,
      duration: `${seed.start}–${seed.end}`,
      schedule: { days: seed.days, timeOfDay: [seed.time], timeRange: `${seed.start}–${seed.end}` },
      price: seed.price,
      priceUnit: seed.unit,
      currency: '₽',
      level: seed.level,
      language: 'English',
      shortDescription: seed.blurb,
      fullDescription: `${seed.long} Delivered live. Moscow time (MSK). No commute.`,
      tags: [seed.category, 'Online', 'MSK'],
      goals: seed.goals,
      popularityScore: 62 + i,
      newActivity: true,
      rating: 0,
      reviewCount: 0,
      delivery: 'Live Online',
      meetingPlatform: i % 2 === 0 ? 'Zoom' : 'Google Meet',
      bookingKind: i === 3 ? 'Request Spot' : 'Instant Booking',
      capacity: 12,
      availableSeats: 8,
      teacherName: must(HOSTS, i),
      teacherBio: `${must(HOSTS, i)} teaches this live ${seed.category.toLowerCase()} session on Moscow time. Camera on. No commute.`,
      coverImage: coverFor(seed.category, i),
      cancellationPolicy: 'Free cancellation up to 24 hours before the session.',
      responseTimeText: 'usually within 2 hours',
    });
  });

  return list;
}

export function extraPhotos(activity: Activity): string[] {
  const pool = [...new Set(COVER[activity.category] ?? COVER['Yoga'] ?? [])];
  const start = Math.max(0, pool.indexOf(activity.coverImage));
  const extras: string[] = [];
  for (let i = 1; i <= pool.length && extras.length < 3; i++) {
    const url = pool[(start + i) % pool.length];
    if (url && url !== activity.coverImage && !extras.includes(url)) extras.push(url);
  }
  if (extras.length < 3) {
    for (const url of COVER['Yoga'] ?? []) {
      if (url !== activity.coverImage && !extras.includes(url)) extras.push(url);
      if (extras.length === 3) break;
    }
  }
  return extras;
}

export function listingPhotos(activity: Activity): string[] {
  return [activity.coverImage, ...extraPhotos(activity)].filter(
    (url, i, all) => Boolean(url) && all.indexOf(url) === i,
  );
}

export function assertCatalog(list: Activity[]): void {
  if (list.length < 30) throw new Error(`Catalog too small: ${list.length}`);
  const ids = new Set(list.map((a) => a.id));
  if (ids.size !== list.length) throw new Error('Duplicate activity ids');
}
