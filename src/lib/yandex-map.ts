import { MOSCOW_CENTER, stationGeo } from './metro';
import type { Activity } from './types';

export const MIN_ZOOM = 13;
export const MAX_ZOOM = 18;
export const DEFAULT_ZOOM = 15;

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

export function clampZoom(z: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

/** One PNG — no Maps JS. Size is capped by the Static API. */
export function yandexStaticSrc(activity: Activity, z = DEFAULT_ZOOM): string {
  const geo = placeGeo(activity);
  const zoom = clampZoom(z);
  const params = new URLSearchParams({
    ll: `${geo.lon},${geo.lat}`,
    size: '650,406',
    z: String(zoom),
    l: 'map',
    pt: `${geo.lon},${geo.lat},pm2rdm`,
    lang: 'en_US',
  });
  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
}

export function yandexWidgetSrc(activity: Activity, z = DEFAULT_ZOOM): string {
  const geo = placeGeo(activity);
  const zoom = clampZoom(z);
  const params = new URLSearchParams({
    lang: 'en_RU',
    scroll: 'true',
    l: 'map',
    z: String(zoom),
    ll: `${geo.lon},${geo.lat}`,
    pt: `${geo.lon},${geo.lat},pm2rdm`,
  });
  return `https://yandex.ru/map-widget/v1/?${params.toString()}`;
}

export function yandexMapsHref(activity: Activity): string {
  const params = new URLSearchParams({
    lang: 'en_RU',
    text: placeSearchText(activity),
  });
  return `https://yandex.com/maps/?${params.toString()}`;
}
