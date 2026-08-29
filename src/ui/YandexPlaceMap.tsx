import { useState } from 'react';
import { preconnect, preload } from 'react-dom';
import { ExternalLink } from 'lucide-react';
import { yandexMapsHref, yandexStaticSrc } from '../lib/yandex-map';
import type { Activity } from '../lib/types';

export function YandexPlaceMap({ activity }: { activity: Activity }) {
  const [ok, setOk] = useState(true);
  const title = activity.venue ?? activity.address ?? activity.metroStationName ?? 'Moscow';
  const src = yandexStaticSrc(activity);
  const href = yandexMapsHref(activity);

  preconnect('https://static-maps.yandex.ru');
  preload(src, { as: 'image' });

  return (
    <div>
      {ok ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-[16/10] bg-warm sm:aspect-[2/1]"
          aria-label={`Open map of ${title} in Yandex Maps`}
        >
          <img
            src={src}
            alt=""
            width={650}
            height={406}
            className="h-full w-full object-cover"
            decoding="async"
            onError={() => setOk(false)}
          />
        </a>
      ) : null}
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
