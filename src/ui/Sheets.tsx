import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useLockBody, useMinWidth, useVisualViewport } from '../lib/media';
import { useApp, useActiveBookings } from '../state';
import { money } from '../lib/format';
import { localConcierge } from '../lib/rank';
import type { Activity } from '../lib/types';
import { BookingRow, SavedActivityRow } from './Card';

export function Sheet({
  open,
  onClose,
  title,
  children,
  from = 'auto',
  flush = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  from?: 'auto' | 'bottom';
  flush?: boolean;
}) {
  const wide = useMinWidth(768);
  const side = from === 'bottom' ? false : wide;
  const view = useVisualViewport(open && !side);
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onFocus = (e: FocusEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return;
      window.setTimeout(() => {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 80);
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [open]);

  const keyboardUp = !side && view.inset > 8;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-50 bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            className={`fixed inset-x-0 bottom-0 z-50 flex w-full min-h-0 flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl ${
              flush ? 'h-[75dvh]' : 'h-fit max-h-[75dvh]'
            } ${
              from === 'bottom'
                ? ''
                : 'md:inset-y-0 md:right-0 md:left-auto md:h-auto md:max-h-none md:max-w-md md:rounded-none md:pb-0'
            } ${keyboardUp ? '' : 'pb-[env(safe-area-inset-bottom)]'}`}
            style={
              side
                ? undefined
                : {
                    bottom: view.inset,
                    ...(flush
                      ? {
                          height:
                            view.height > 0
                              ? keyboardUp
                                ? view.height
                                : Math.round(view.height * 0.75)
                              : undefined,
                        }
                      : {}),
                    maxHeight:
                      view.height > 0
                        ? keyboardUp
                          ? view.height
                          : Math.round(view.height * 0.75)
                        : '75dvh',
                  }
            }
            initial={side ? { x: '100%' } : { y: '100%' }}
            animate={{ x: 0, y: 0 }}
            exit={side ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            <div
              className={`mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-hair ${from === 'bottom' ? '' : 'md:hidden'}`}
              aria-hidden
            />
            <div className="flex shrink-0 items-center justify-between border-b border-hair px-4 py-3 sm:px-5 sm:py-4">
              <h2 id="sheet-title" className="font-display min-w-0 truncate text-xl sm:text-2xl">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-canvas"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {flush ? (
              children
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                {children}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function SavedSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, go, find } = useApp();
  const items = state.savedIds.map(find).filter((a): a is Activity => Boolean(a));
  return (
    <Sheet open={open} onClose={onClose} title="Saved">
      {items.length === 0 ? (
        <p className="text-sm text-quiet">Save activities while you browse. They live here.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id}>
              <SavedActivityRow
                activity={a}
                onOpen={() => {
                  onClose();
                  go({ view: 'activity', id: a.id });
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

export function BookingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cancel, go, find } = useApp();
  const bookings = useActiveBookings();
  return (
    <Sheet open={open} onClose={onClose} title="Bookings">
      {bookings.length === 0 ? (
        <p className="text-sm text-quiet">Nothing reserved yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b.id}>
              <BookingRow
                booking={b}
                activity={find(b.activityId)}
                onOpen={() => {
                  onClose();
                  go({ view: 'activity', id: b.activityId, booking: true });
                }}
                onCancel={() => cancel(b.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

export function LegalModal({
  open,
  type,
  onClose,
}: {
  open: boolean;
  type: 'privacy' | 'terms' | 'help' | null;
  onClose: () => void;
}) {
  const copy = {
    privacy: {
      t: 'Privacy',
      b: 'ActivityFirst stores your saved activities, bookings, and free-time preferences on this device. We do not sell personal data. Bookings use the name, email, and phone you enter on the listing.',
    },
    terms: {
      t: 'Terms',
      b: 'This is a product demonstration. Reservations are simulated. Real studios, payments, and attendance are not processed here.',
    },
    help: {
      t: 'Help',
      b: 'Search by what you want to do, a metro station, and when you are free. Mark your week under My Week. Open a listing to read the room, pick a session, and send a booking with your details. Reservations on this demo are simulated.',
    },
  };
  const item = type ? copy[type] : null;
  if (!open || !item) return null;
  return (
    <Sheet open={open} onClose={onClose} title={item.t}>
      <p className="text-sm leading-relaxed text-quiet">{item.b}</p>
    </Sheet>
  );
}

export function WaitlistModal({
  activity,
  onClose,
  onConfirm,
}: {
  activity: Activity | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!activity) return null;
  return (
    <Sheet open={Boolean(activity)} onClose={onClose} title="Waitlist">
      <p className="text-sm leading-relaxed text-quiet">
        {activity.title} is full. Join the waitlist and we’ll hold your place if a seat opens.
      </p>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-6 min-h-11 w-full rounded-full bg-ink font-semibold text-paper"
      >
        Join waitlist
      </button>
    </Sheet>
  );
}

export function Concierge({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, go } = useApp();
  const [text, setText] = useState('');
  const [hits, setHits] = useState<Activity[]>([]);

  return (
    <Sheet open={open} onClose={onClose} title="Describe the evening">
      <p className="text-sm leading-relaxed text-quiet">
        This does not replace search. It reads what you type and points at activities that already exist.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Tuesday evening near Arbatskaya, something quiet, under 5 000 ₽…"
        className="mt-4 w-full rounded-2xl border border-hair bg-canvas/50 p-3 text-sm outline-none focus:border-ink"
      />
      <button
        type="button"
        className="mt-3 min-h-11 w-full rounded-full bg-ink text-sm font-semibold text-paper"
        onClick={() => setHits(localConcierge(text, state.activities))}
      >
        Find matches
      </button>
      <ul className="mt-4 space-y-2">
        {hits.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              className="w-full rounded-xl border border-hair px-3 py-3 text-left hover:bg-canvas"
              onClick={() => {
                onClose();
                go({ view: 'activity', id: a.id });
              }}
            >
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-quiet">
                {a.metroStationName ?? a.delivery} · {money(a.price)}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
