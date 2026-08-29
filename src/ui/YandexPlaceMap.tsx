import { ExternalLink } from 'lucide-react';
import { yandexMapsHref, yandexWidgetSrc } from '../lib/yandex-map';
import type { Activity } from '../lib/types';

export function YandexPlaceMap({ activity }: { activity: Activity }) {
  const title = activity.venue ?? activity.address ?? activity.metroStationName ?? 'Moscow';
  const src = yandexWidgetSrc(activity);
  const href = yandexMapsHref(activity);

  return (
    <div>
      <div className="relative aspect-[16/10] bg-warm sm:aspect-[2/1]">
        <iframe
          title={`Map of ${title}`}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="border-t border-hair px-5 py-3 sm:px-6">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-hair underline-offset-4 hover:decoration-ink"
        >
          Open in Yandex Maps
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
