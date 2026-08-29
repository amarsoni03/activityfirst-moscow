import { useEffect, useId, useState } from 'react';
import { Heart, Menu, Ticket, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLockBody } from '../lib/media';
import { useApp, useActiveBookings } from '../state';

const NAV = [
  { view: 'explore', label: 'Explore' },
  { view: 'my-week', label: 'My Week' },
] as const;

export function Header({
  onSaved,
  onBookings,
  onLeaveExplore,
}: {
  onSaved: () => void;
  onBookings: () => void;
  onLeaveExplore: () => void;
}) {
  const { route, go, state } = useApp();
  const bookings = useActiveBookings();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const overHero = route.view === 'explore';
  const ink = overHero ? 'text-white' : 'text-ink';
  useLockBody(menuOpen);

  const goExplore = () => {
    if (route.view !== 'explore') onLeaveExplore();
    go({ view: 'explore' });
  };

  const visit = (view: (typeof NAV)[number]['view']) => {
    setMenuOpen(false);
    if (view === 'explore') goExplore();
    else go({ view });
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [route.view]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const close = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const link = (active: boolean) =>
    `whitespace-nowrap text-sm ${
      active
        ? 'font-semibold'
        : overHero
          ? 'text-white/70 hover:text-white'
          : 'text-quiet hover:text-ink'
    }`;

  return (
    <>
      <header
        className={
          overHero
            ? 'absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-black/55 to-transparent pt-[env(safe-area-inset-top)]'
            : 'sticky top-0 z-40 border-b border-hair bg-paper/95 pt-[env(safe-area-inset-top)] backdrop-blur-md'
        }
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:h-[4.25rem] sm:px-6">
          <button
            type="button"
            onClick={goExplore}
            className={`flex min-w-0 items-center gap-2.5 ${ink}`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${overHero ? 'bg-signal' : 'bg-ink'}`}
            >
              <span className={`block h-1 w-3.5 rounded-full ${overHero ? 'bg-ink' : 'bg-signal'}`} />
            </span>
            <span className="font-display truncate text-[15px] font-bold tracking-tight sm:text-[17px]">
              ActivityFirst
            </span>
          </button>

          <nav className={`ml-4 hidden min-w-0 items-center gap-6 md:flex ${overHero ? 'text-white' : ''}`} aria-label="Primary">
            {NAV.map((item) => (
              <button
                key={item.view}
                type="button"
                className={link(route.view === item.view)}
                onClick={() => visit(item.view)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className={`ml-auto flex shrink-0 items-center gap-0.5 ${ink}`}>
            <IconBtn label="Saved" onClick={onSaved} count={state.savedIds.length}>
              <Heart className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Bookings" onClick={onBookings} count={bookings.length}>
              <Ticket className="h-4 w-4" />
            </IconBtn>
            <button
              type="button"
              onClick={() => go({ view: 'dashboard' })}
              className={`ml-1 hidden h-10 items-center gap-2 rounded-full px-3 text-sm md:inline-flex ${
                overHero ? 'bg-white/10 text-white' : 'border border-hair bg-paper'
              }`}
              aria-label="You"
            >
              <UserRound className="h-4 w-4" />
              You
            </button>
            <button
              type="button"
              className="ml-0.5 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-50 bg-ink/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${menuId}-title`}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(20.5rem,86vw)] flex-col bg-paper pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] shadow-2xl md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="flex h-14 items-center justify-between gap-3 border-b border-hair px-4 sm:h-[4.25rem]">
                <p id={`${menuId}-title`} className="font-display text-xl font-bold tracking-tight">
                  Menu
                </p>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]" aria-label="Primary">
                {NAV.map((item) => {
                  const active = route.view === item.view;
                  return (
                    <button
                      key={item.view}
                      type="button"
                      onClick={() => visit(item.view)}
                      className={`flex min-h-14 items-center justify-between border-b border-hair text-left font-display text-[1.65rem] font-semibold tracking-tight ${
                        active ? 'text-ink' : 'text-quiet'
                      }`}
                    >
                      {item.label}
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-signal" />}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    go({ view: 'dashboard' });
                  }}
                  className={`mt-auto flex min-h-12 items-center gap-2.5 text-left text-sm ${
                    route.view === 'dashboard' ? 'font-semibold text-ink' : 'text-quiet'
                  }`}
                >
                  <UserRound className="h-4 w-4" />
                  You
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  label,
  onClick,
  count,
  children,
}: {
  label: string;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
    >
      {children}
      {count > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal" />
      )}
    </button>
  );
}

export function Footer({
  onLegal,
  hidden,
  lift,
}: {
  onLegal: (t: 'privacy' | 'terms' | 'help') => void;
  hidden?: boolean;
  lift?: boolean;
}) {
  const { go } = useApp();
  if (hidden) return null;

  const goExplore = () => go({ view: 'explore' });

  return (
    <footer
      className={`site-footer border-t border-white/10 bg-ink text-paper ${
        lift
          ? 'pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-8'
          : 'pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-8'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-10">
        <div>
          <button type="button" onClick={goExplore} className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal">
              <span className="block h-1 w-3 rounded-full bg-ink" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight">ActivityFirst</span>
          </button>
          <p className="mt-2 max-w-sm text-sm text-white/50">
            Activities near a station you can reach, in a window you actually have.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50">
          <FootLink onClick={goExplore}>Explore</FootLink>
          <FootLink onClick={() => go({ view: 'my-week' })}>My Week</FootLink>
          <FootLink onClick={() => go({ view: 'provider' })}>For providers</FootLink>
          <FootLink onClick={() => go({ view: 'post' })}>Post an activity</FootLink>
          <FootLink onClick={() => onLegal('help')}>Help</FootLink>
          <FootLink onClick={() => onLegal('privacy')}>Privacy</FootLink>
          <FootLink onClick={() => onLegal('terms')}>Terms</FootLink>
        </nav>
      </div>
    </footer>
  );
}

function FootLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className="text-left transition hover:text-white">
      {children}
    </button>
  );
}
