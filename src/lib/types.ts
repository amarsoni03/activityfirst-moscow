export type Audience = 'Adults' | 'Children' | 'Corporate' | 'All';
export type Template =
  | 'Program'
  | 'Class'
  | 'Workshop'
  | 'Camp'
  | 'Event'
  | 'Corporate'
  | 'Drop-in';
export type Delivery = 'In Person' | 'Live Online' | 'Self-Paced' | 'Hybrid';
export type BookingKind = 'Instant Booking' | 'Request Spot' | 'Open Enrollment';
export type PriceUnit =
  | 'per session'
  | 'per program'
  | 'per month'
  | 'total program'
  | 'per class';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';
export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type Language = 'English' | 'Russian' | 'Bilingual';
export type Goal =
  | 'Learn'
  | 'Exercise'
  | 'Create'
  | 'Relax'
  | 'Meet People'
  | 'Career'
  | 'Kids';
export type SortOption =
  | 'recommended'
  | 'starts-soon'
  | 'nearest-metro'
  | 'lowest-price'
  | 'best-rated'
  | 'newest'
  | 'most-popular';
export type DiscoveryTab =
  | 'all'
  | 'fits-free-time'
  | 'tonight'
  | 'weekdays'
  | 'weekend'
  | 'near-metro';
export type ViewMode = 'list' | 'map' | 'schedule';
export type BookingStatus = 'confirmed' | 'pending' | 'quote' | 'cancelled';

export interface MetroLine {
  id: string;
  name: string;
  short: string;
  color: string;
}

export interface MetroStation {
  id: string;
  name: string;
  nameRu: string;
  lineId: string;
  lineName: string;
  lineColor: string;
  district: string;
  street: string;
  venues: string[];
  x: number;
  y: number;
}

export interface ActivitySchedule {
  days: DayOfWeek[];
  timeOfDay: TimeOfDay[];
  timeRange: string;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  audience: Audience;
  template: Template;
  startDate: string;
  frequency: string;
  weekdays: DayOfWeek[];
  startTime: string;
  endTime: string;
  duration: string;
  schedule: ActivitySchedule;
  metroLineId?: string;
  metroLineName?: string;
  metroLineColor?: string;
  metroStationId?: string;
  metroStationName?: string;
  walkMinutes?: number;
  address?: string;
  district?: string;
  venue?: string;
  price: number;
  priceUnit: PriceUnit;
  currency: '₽';
  level: Level;
  language: Language;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  goals: Goal[];
  popularityScore: number;
  featured?: boolean;
  newActivity?: boolean;
  rating: number;
  reviewCount: number;
  delivery: Delivery;
  meetingPlatform?: string;
  bookingKind: BookingKind;
  capacity?: number;
  availableSeats?: number;
  studioName?: string;
  teacherName?: string;
  teacherBio?: string;
  coverImage: string;
  cancellationPolicy: string;
  responseTimeText: string;
}

/** Listing row after enrich() — stored Activity plus ranking fields. */
export interface RankedActivity extends Activity {
  scheduleMatchPercentage: number;
  commuteInfo: string;
  searchRelevance: number;
}

export interface FilterState {
  category?: string;
  audience?: Audience;
  delivery: Delivery[];
  language?: Language;
  metroLineId?: string;
  metroStationIds: string[];
  timeOfDay: TimeOfDay[];
  days: DayOfWeek[];
  level?: Level;
  minRating?: number;
  maxPrice?: number;
  keyword?: string;
  goals: Goal[];
  templates: Template[];
  instantOnly?: boolean;
  openSeats?: boolean;
  maxWalk?: number;
  newOnly?: boolean;
}

export interface FreeTimeSlot {
  day: DayOfWeek;
  timeOfDay: TimeOfDay;
  enabled: boolean;
}

export interface UserPreferences {
  freeTimeSlots: FreeTimeSlot[];
  preferredMetroStationId?: string;
  maxBudget?: number;
  audience?: Audience;
  goals: Goal[];
}

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  note?: string;
  partySize?: number;
}

export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  status: BookingStatus;
  sessionDate?: string;
  enrollmentType: 'trial' | 'full' | 'quote';
  name: string;
  email: string;
  phone: string;
  note?: string;
  partySize?: number;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  activityId: string;
  activityTitle: string;
  position: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  activityId: string;
  activityTitle: string;
  providerName: string;
  messages: Message[];
  updatedAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WEEKDAYS: DayOfWeek[] = DAYS.slice(0, 5);

export const TIMES: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

export const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export const LANGUAGES: Language[] = ['English', 'Russian', 'Bilingual'];

export const DELIVERIES: Delivery[] = ['In Person', 'Live Online', 'Hybrid', 'Self-Paced'];

export const GOALS: Goal[] = [
  'Learn',
  'Exercise',
  'Create',
  'Relax',
  'Meet People',
  'Career',
  'Kids',
];

export const TEMPLATES: Template[] = [
  'Class',
  'Workshop',
  'Drop-in',
  'Program',
  'Camp',
  'Event',
  'Corporate',
];

export const DEMO_USER = {
  name: 'Anastasia Lebedeva',
  email: 'anastasia.lebedeva@example.com',
  phone: '+7 999 123-45-67',
};

export const CATALOG_VERSION = '4.0.0';

export const KEYS = {
  activities: 'activityfirst.moscow.activities',
  version: 'activityfirst.moscow.version',
  saved: 'activityfirst.moscow.saved',
  bookings: 'activityfirst.moscow.bookings',
  waitlists: 'activityfirst.moscow.waitlists',
  conversations: 'activityfirst.moscow.conversations',
  preferences: 'activityfirst.moscow.preferences',
} as const;
