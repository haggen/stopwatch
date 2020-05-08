import { useEffect } from "react";

export function useInterval(callback, interval) {
  useEffect(() => {
    const id = setInterval(callback, interval);

    return () => {
      clearInterval(id);
    };
  }, [callback, interval]);
}
