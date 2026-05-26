import { useState, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);

      if (raw === null) return initialValue;

      const parsed = JSON.parse(raw);

      if (parsed && parsed.version === 1 && Array.isArray(parsed.cards)) {
        return parsed.cards;
      }

      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;

      try {
        window.localStorage.setItem(key, JSON.stringify({ version: 1, cards: resolved }));
      } catch {
        // Silently ignore write errors (e.g. quota exceeded)
      }

      return resolved;
    });
  }, [key]);

  return [value, setStoredValue];
}

export default useLocalStorage;
