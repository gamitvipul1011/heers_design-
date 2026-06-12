import { useShop } from '../store/useShop';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toasts() {
  const { toasts } = useShop();

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border max-w-xs ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/20 text-emerald-100'
                : toast.type === 'error'
                  ? 'bg-red-950/80 border-red-500/20 text-red-100'
                  : 'bg-navy-light/80 border-gold/20 text-cream'
            }`}
          >
            <span className="text-base">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
