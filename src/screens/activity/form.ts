import type { Booking } from '../../lib/types';

export type BookingForm = {
  name: string;
  email: string;
  phone: string;
  note: string;
  party: number;
  enrollment: Booking['enrollmentType'];
};

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
