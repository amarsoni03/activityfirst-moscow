import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Cover({
  src,
  alt = '',
  className = '',
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    setOk(true);
  }, [src]);
  if (!src || !ok) {
    return <div className={`bg-warm ${className}`} aria-hidden />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setOk(false)}
    />
  );
}

export function PhotoStage({
  photos,
  alt = '',
  className = '',
  index,
  onIndex,
  onOpen,
}: {
  photos: string[];
  alt?: string;
  className?: string;
  index?: number;
  onIndex?: (i: number) => void;
  onOpen?: (i: number) => void;
}) {
  const [local, setLocal] = useState(0);
  const i = index ?? local;
  const setI = onIndex ?? setLocal;
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  const count = photos.length;
  const current = photos[i] ?? photos[0];

  const go = (dir: number, e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (count < 2) return;
    setI((i + dir + count) % count);
  };

  return (
    <div
      className={`group/photos relative overflow-hidden bg-warm ${className}`}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        startX.current = e.clientX;
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (dx > 48) {
          swiped.current = true;
          go(-1, e);
        } else if (dx < -48) {
          swiped.current = true;
          go(1, e);
        }
      }}
      onClick={(e) => {
        if (!swiped.current) return;
        e.preventDefault();
        e.stopPropagation();
        swiped.current = false;
      }}
    >
      {photos.map((src, idx) => (
        <Cover
          key={src}
          src={src}
          alt={idx === i ? alt : ''}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            idx === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {onOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-[1]"
          aria-label={alt || 'View photos'}
          onClick={() => onOpen(i)}
        />
      ) : null}
      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/95 text-ink opacity-0 shadow-sm transition hover:bg-paper group-hover/photos:opacity-100 max-md:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/95 text-ink opacity-0 shadow-sm transition hover:bg-paper group-hover/photos:opacity-100 max-md:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2.5 left-1/2 z-[2] flex -translate-x-1/2 gap-1">
            {photos.map((src) => (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all ${
                  src === current ? 'w-4 bg-paper' : 'w-1.5 bg-paper/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function WeekStrip({
  days,
  size = 'sm',
}: {
  days: string[];
  size?: 'sm' | 'md';
}) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dim = size === 'md' ? 'h-6 w-6 text-[10px]' : 'h-4 w-4 text-[9px]';
  return (
    <div className="flex items-center gap-0.5" aria-label={`Meets ${days.join(', ')}`}>
      {names.map((name, i) => {
        const on = days.includes(name);
        return (
          <span
            key={`${name}-${i}`}
            className={`flex items-center justify-center rounded-full font-semibold ${dim} ${
              on ? 'bg-ink text-paper' : 'bg-hair/80 text-quiet'
            }`}
          >
            {labels[i]}
          </span>
        );
      })}
    </div>
  );
}

export function MetroDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
      aria-hidden
    />
  );
}
