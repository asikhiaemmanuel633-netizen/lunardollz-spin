import { useState, useEffect } from 'react';

// Persists React state to localStorage under `key`. Re-reads whenever `key`
// changes, so callers can key by wallet address to give each wallet its own
// saved spin count / vault.
export function useLocalState(key, initialValue) {
  const [value, setValue] = useState(() => readKey(key, initialValue));

  useEffect(() => {
    setValue(readKey(key, initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage can fail (private mode, quota) — fine to no-op for this demo
    }
  }, [key, value]);

  return [value, setValue];
}

function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
