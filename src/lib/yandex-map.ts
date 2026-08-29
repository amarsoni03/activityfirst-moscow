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

export function yandexWidgetSrc(activity: Activity): string {
  const geo = stationGeo(activity.metroStationId) ?? MOSCOW_CENTER;
  const params = new URLSearchParams({
    lang: 'en_RU',
    scroll: 'false',
    l: 'map',
    z: '16',
    ll: `${geo.lon},${geo.lat}`,
  });
  if (activity.address || activity.venue) {
    params.set('mode', 'search');
    params.set('text', placeSearchText(activity));
  } else {
    params.set('pt', `${geo.lon},${geo.lat},pm2rdm`);
  }
  return `https://yandex.ru/map-widget/v1/?${params.toString()}`;
}

export function yandexMapsHref(activity: Activity): string {
  const params = new URLSearchParams({
    lang: 'en_RU',
    text: placeSearchText(activity),
  });
  return `https://yandex.com/maps/?${params.toString()}`;
}
