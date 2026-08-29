import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Toast } from '../lib/types';
import { useApp } from '../state';

const DURATION: Record<Toast['type'], number> = {
  success: 3200,
  info: 3800,
  error: 5200,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const remaining = useRef(DURATION[toast.type]);
  const startedAt = useRef(0);
  const timer = useRef<number>(0);

  const arm = () => {
    startedAt.current = Date.now();
    timer.current = window.setTimeout(() => onDismiss(toast.id), remaining.current);
  };

  useEffect(() => {
    arm();
    return () => window.clearTimeout(timer.current);
  }, [toast.id, onDismiss]);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="pointer-events-auto rounded-2xl bg-ink px-4 py-3 text-left text-sm text-paper shadow-lg"
      onClick={() => {
        window.clearTimeout(timer.current);
        onDismiss(toast.id);
      }}
      onMouseEnter={() => {
        window.clearTimeout(timer.current);
        remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
      }}
      onMouseLeave={arm}
    >
      {toast.message}
    </motion.button>
  );
}

export function Toasts() {
  const { state, dropToast } = useApp();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-[70] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:bottom-6 sm:w-80"
    >
      <AnimatePresence>
        {state.toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dropToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
