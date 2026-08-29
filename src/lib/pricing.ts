import type { Activity, PriceUnit } from './types';

function weeklyMeetings(activity: Activity): number {
  return Math.max(1, activity.schedule.days.length);
}

/** Per-session equivalent so cards can be compared. Null = quote / not comparable. */
export function sessionPrice(activity: Activity): number | null {
  if (activity.template === 'Corporate' || activity.audience === 'Corporate') return null;
  const unit: PriceUnit = activity.priceUnit;
  const meets = weeklyMeetings(activity);
  if (unit === 'per session' || unit === 'per class') return activity.price;
  if (unit === 'per month') return Math.round(activity.price / (meets * 4));
  if (unit === 'per program' || unit === 'total program') {
    return Math.round(activity.price / Math.max(4, meets * 8));
  }
  return activity.price;
}

export function isSessionUnit(unit: PriceUnit): boolean {
  return unit === 'per session' || unit === 'per class';
}
