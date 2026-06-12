import type { StateStorage } from 'zustand/middleware';

/**
 * A localStorage-backed storage for zustand's `persist` middleware that
 * NEVER throws.
 *
 * Why this exists:
 * If `localStorage.setItem` exceeds the browser's storage quota (commonly
 * 5MB), it throws a `QuotaExceededError`. Because zustand's persist
 * middleware writes to storage synchronously inside `set()`, that error
 * propagates straight out of whatever action called `set()` — e.g.
 * `clearCart()` or `addOrder()` inside "Place Order". The rest of the
 * click handler (navigating to the confirmation step, showing the success
 * toast) then never runs, and the button appears to "do nothing".
 *
 * This wrapper catches that error so the in-memory app state still updates
 * correctly even if the persisted copy can't be saved, and logs a clear
 * warning so it's easy to diagnose ("storage full, probably oversized
 * images").
 */
export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch (err) {
      console.warn(`safeLocalStorage: failed to read "${name}"`, err);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (err) {
      console.warn(
        `safeLocalStorage: failed to save "${name}" (likely storage quota exceeded — ` +
          `check for large/unoptimized base64 images in products, cart, or orders).`,
        err
      );
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (err) {
      console.warn(`safeLocalStorage: failed to remove "${name}"`, err);
    }
  },
};
