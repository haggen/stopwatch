import { useState, useEffect } from "react";

export function useStoredState<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key);

  const [value, setValue] = useState<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
