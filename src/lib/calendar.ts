import type { Activity } from './types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function stamp(date: string, time: string): string {
  const [h = '00', m = '00'] = time.split(':');
  return `${date.replace(/-/g, '')}T${pad(Number(h))}${pad(Number(m))}00`;
}

function icsEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function downloadSessionIcs(activity: Activity, sessionDate: string): void {
  const start = stamp(sessionDate, activity.startTime);
  const end = stamp(sessionDate, activity.endTime);
  const where = activity.venue
    ? `${activity.venue}, ${activity.metroStationName ?? 'Moscow'}`
    : (activity.meetingPlatform ?? 'Moscow · live');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ActivityFirst//Moscow//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${activity.id}-${sessionDate}@activityfirst.moscow`,
    `DTSTART;TZID=Europe/Moscow:${start}`,
    `DTEND;TZID=Europe/Moscow:${end}`,
    `SUMMARY:${icsEscape(activity.title)}`,
    `LOCATION:${icsEscape(where)}`,
    `DESCRIPTION:${icsEscape('Moscow time (MSK). Held as listed — the activity is the booking.')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activity.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
