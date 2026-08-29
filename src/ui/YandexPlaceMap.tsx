import { useState } from 'react';
import { preconnect, preload } from 'react-dom';
import { ExternalLink, Minus, Plus } from 'lucide-react';
import {
  clampZoom,
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  yandexMapsHref,
  yandexStaticSrc,
  yandexWidgetSrc,
} from '../lib/yandex-map';
import type { Activity } from '../lib/types';

export function YandexPlaceMap({ activity }: { activity: Activity }) {
  const [z, setZ] = useState(DEFAULT_ZOOM);
  const [imgOk, setImgOk] = useState(true);
  const [frame, setFrame] = useState(false);
  const [ready, setReady] = useState(false);
  const [liveZ, setLiveZ] = useState(DEFAULT_ZOOM);
  const title = activity.venue ?? activity.address ?? activity.metroStationName ?? 'Moscow';
  const src = yandexStaticSrc(activity, z);
  const href = yandexMapsHref(activity);

  preconnect('https://static-maps.yandex.ru');
  if (frame) preconnect('https://yandex.ru');
  preload(src, { as: 'image' });

  const bump = (delta: number) => {
    setZ((n) => clampZoom(n + delta));
  };

  const enableMove = () => {
    setLiveZ(z);
    setFrame(true);
  };

  return (
    <div>
      <div className="relative aspect-[16/10] bg-warm sm:aspect-[2/1]">
        {imgOk ? (
          <img
            src={src}
            alt=""
            width={650}
            height={406}
            className={`absolute inset-0 h-full w-full object-cover ${ready ? 'opacity-0' : ''}`}
            decoding="async"
            onError={() => setImgOk(false)}
          />
        ) : null}

        {frame ? (
          <iframe
            title={`Map of ${title}`}
            src={yandexWidgetSrc(activity, liveZ)}
            className={`absolute inset-0 h-full w-full border-0 ${ready ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setReady(true)}
          />
        ) : null}

        {!frame ? (
          <button
            type="button"
            onClick={enableMove}
            className="absolute inset-0 z-10"
            aria-label={`Move and pinch-zoom the map of ${title}`}
          />
        ) : null}

        {!frame ? (
          <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-xl border border-hair bg-paper shadow-sm">
            <button
              type="button"
              onClick={() => bump(1)}
              disabled={z >= MAX_ZOOM}
              className="flex h-10 w-10 items-center justify-center hover:bg-warm disabled:opacity-30"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="h-px bg-hair" aria-hidden />
            <button
              type="button"
              onClick={() => bump(-1)}
              disabled={z <= MIN_ZOOM}
              className="flex h-10 w-10 items-center justify-center hover:bg-warm disabled:opacity-30"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ) : null}
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
