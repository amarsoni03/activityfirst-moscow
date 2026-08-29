import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useLockBody } from '../../lib/media';
import { Cover } from '../../ui/bits';

export function ListingMosaic({
  photos,
  title,
  onOpen,
}: {
  photos: string[];
  title: string;
  onOpen: (i: number) => void;
}) {
  const side = photos.slice(1, 4);
  return (
    <div className="relative hidden h-[min(62vh,560px)] min-h-[380px] md:grid md:grid-cols-5 md:gap-1.5">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="group relative col-span-3 overflow-hidden"
      >
        <Cover
          src={photos[0] ?? ''}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </button>
      <div
        className={`col-span-2 grid gap-1.5 ${
          side.length > 2 ? 'grid-rows-3' : side.length === 2 ? 'grid-rows-2' : ''
        }`}
      >
        {side.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onOpen(i + 1)}
            className="group relative overflow-hidden"
          >
            <Cover
              src={src}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-sm font-semibold shadow-sm"
      >
        <Images className="h-4 w-4" />
        Show all {photos.length}
      </button>
    </div>
  );
}

export function PhotoLightbox({
  photos,
  index,
  title,
  onIndex,
  onClose,
}: {
  photos: string[];
  index: number;
  title: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  useLockBody(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndex((index - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') onIndex((index + 1) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length, onClose, onIndex]);

  const src = photos[index] ?? photos[0];

  return createPortal(
    <div className="fixed inset-0 z-[80] flex flex-col bg-ink">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-sm text-white/70">
          {index + 1} / {photos.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Close photos"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {photos.length > 1 ? (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => onIndex((index - 1 + photos.length) % photos.length)}
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        <Cover
          src={src ?? ''}
          alt={title}
          className="max-h-[calc(100svh-11rem)] max-w-full rounded-xl object-contain"
        />
        {photos.length > 1 ? (
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => onIndex((index + 1) % photos.length)}
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      {photos.length > 1 ? (
        <div className="flex justify-center gap-2 px-4 pb-6">
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => onIndex(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-20 overflow-hidden rounded-lg ${
                i === index ? 'ring-2 ring-signal' : 'opacity-55 hover:opacity-100'
              }`}
            >
              <Cover src={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
