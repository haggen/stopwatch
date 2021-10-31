import { useEffect, useRef, useLayoutEffect } from "react";

export function useInterval(callback: () => void, delay: number | null) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) {
      return;
    }

    const id = setInterval(() => callbackRef.current(), delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
