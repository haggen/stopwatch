import { useState, useEffect, useRef } from "react";

export function useStopwatch(callback) {
  const [state, setState] = useState(false);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let id;

    if (state) {
      id = setInterval(callbackRef.current, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [state]);

  return [state, () => setState((state) => !state)];
}
