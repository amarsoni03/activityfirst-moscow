import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../state';

export function Toasts() {
  const { state, dropToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[70] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:bottom-6 sm:w-80">
      <AnimatePresence>
        {state.toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto rounded-2xl bg-ink px-4 py-3 text-left text-sm text-paper shadow-lg"
            onClick={() => dropToast(t.id)}
          >
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
