import { todayIso, todayName } from './format';
import type { Activity } from './types';

export function fitsTonight(activity: Activity): boolean {
  return (
    activity.schedule.timeOfDay.includes('Evening') &&
    activity.schedule.days.includes(todayName()) &&
    activity.startDate <= todayIso()
  );
}

export function fitsWeekend(activity: Activity): boolean {
  return activity.schedule.days.some((d) => d === 'Saturday' || d === 'Sunday');
}
