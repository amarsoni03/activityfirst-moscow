import { MOSCOW_CENTER, stationGeo } from './metro';
import type { Activity } from './types';

export function placeSearchText(activity: Activity): string {
  if (activity.address) {
    return activity.venue
      ? `${activity.address}, Moscow, ${activity.venue}`
      : `${activity.address}, Moscow`;
  }
  if (activity.venue) return `${activity.venue}, Moscow`;
  if (activity.metroStationName) return `${activity.metroStationName} metro, Moscow`;
  return 'Moscow';
}

export function placeGeo(activity: Activity): { lat: number; lon: number } {
  return stationGeo(activity.metroStationId) ?? MOSCOW_CENTER;
}

/** One PNG — no Maps JS. Size is capped by the Static API. */
export function yandexStaticSrc(activity: Activity): string {
  const geo = placeGeo(activity);
  const params = new URLSearchParams({
    ll: `${geo.lon},${geo.lat}`,
    size: '650,406',
    z: '15',
    l: 'map',
    pt: `${geo.lon},${geo.lat},pm2rdm`,
    lang: 'en_US',
  });
  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
}

export function yandexMapsHref(activity: Activity): string {
  const params = new URLSearchParams({
    lang: 'en_RU',
    text: placeSearchText(activity),
  });
  return `https://yandex.com/maps/?${params.toString()}`;
}
