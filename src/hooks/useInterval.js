import { useEffect, useRef, useLayoutEffect } from "react";

export function useInterval(callback, delay) {
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
