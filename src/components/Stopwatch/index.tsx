import {
  useRef,
  useEffect,
  useCallback,
  FocusEvent,
  ComponentPropsWithoutRef,
} from "react";

import { useInterval } from "src/hooks/useInterval";
import { useStoredState } from "src/hooks/useStoredState";
import { useUrlId } from "src/hooks/useRoomId";

import style from "./index.module.css";

const S = 1000;
const M = 60 * S;
const H = 60 * M;

function formatTimeUnit(value: number) {
  return String(Math.floor(value)).padStart(2, "0");
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: string;
};

function Button({ children, style, ...props }: ButtonProps) {
  return (
    <button style={{ ...style, width: `${children.length}ch` }} {...props}>
      {children}
    </button>
  );
}

const initialState = {
  playing: false,
  updated: 0,
  elapsed: 0,
};

function useStopwatchState() {
  const stopwatchId = useUrlId();
  const [state, setState] = useStoredState(stopwatchId, initialState);

  useEffect(() => {
    update();
  }, []);

  const update = useCallback(() => {
    setState((state) => {
      const updated = Date.now();

      if (!state.playing) {
        return state;
      }

      return {
        ...state,
        updated,
        elapsed: state.elapsed + (updated - state.updated),
      };
    });
  }, [setState]);

  const increment = useCallback(() => {
    setState((state) => ({
      ...state,
      elapsed: state.elapsed + M,
    }));
  }, [setState]);

  const decrement = useCallback(() => {
    setState((state) => ({
      ...state,
      elapsed: state.elapsed - (state.elapsed > M ? M : state.elapsed),
    }));
  }, [setState]);

  const clear = useCallback(() => {
    setState((state) => ({
      playing: state.playing,
      updated: Date.now(),
      elapsed: 0,
    }));
  }, [setState]);

  const toggle = useCallback(() => {
    setState((state) => ({
      ...state,
      playing: !state.playing,
      updated: Date.now(),
    }));
  }, [setState]);

  return { ...state, increment, decrement, update, toggle, clear };
}

export default function Stopwatch() {
  const { playing, elapsed, increment, decrement, update, toggle, clear } =
    useStopwatchState();

  const handleKeyDown = useCallback((e) => {
    if (e.key === " ") {
      toggle();
    } else if (e.key === "ArrowUp") {
      increment();
    } else if (e.key === "ArrowDown") {
      decrement();
    } else if (e.key === "Backspace") {
      clear();
    } else {
      return;
    }

    e.preventDefault();
  }, []);

  useInterval(() => {
    update();
  }, 1000);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const display =
    (elapsed > H ? formatTimeUnit(elapsed / H) + ":" : "") +
    formatTimeUnit((elapsed % H) / M) +
    ":" +
    formatTimeUnit((elapsed % M) / S);

  return (
    <div className={style.stopwatch}>
      <Button className={style.display}>{display}</Button>
      <div className={style.controls}>
        <Button onClick={() => toggle()}>{playing ? "Stop" : "Play"}</Button>
        <Button onClick={() => clear()}>Clear</Button>
      </div>
    </div>
  );
}
