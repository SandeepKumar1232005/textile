import { useState, useEffect } from 'react';

/**
 * Debounce a value — returns the debounced value after `delay` ms of inactivity.
 * Used to prevent firing API queries on every keystroke in search inputs.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
