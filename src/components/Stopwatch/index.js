import React, { useRef, useEffect, useCallback, useState } from "react";

import { useInterval } from "../../hooks/useInterval";
import { useStoredState } from "../../hooks/useStoredState";
import { useUrlId } from "../../hooks/useRoomId";

import style from "./index.module.css";

function Input({ elapsed, changeElapsedBy }) {
  const ref = useRef();

  useEffect(() => {
    if (document.activeElement === ref.current) {
      ref.current.setSelectionRange(0, ref.current.value.length);
    }
  });

  const value =
    (elapsed > 3600
      ? String(Math.floor(elapsed / 3600)).padStart(2, "0") + ":"
      : "") +
    String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0") +
    ":" +
    String(elapsed % 60).padStart(2, "0");

  const handleFocus = (e) => {
    e.target.setSelectionRange(0, e.target.value.length);
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onFocus={handleFocus}
      readOnly={true}
      style={{ width: `${value.length}ch` }}
    />
  );
}

const initialState = {
  playing: false,
  elapsed: 0,
  changed: 0,
};

export default function Stopwatch() {
  const stopwatchId = useUrlId();
  const [state, setState] = useStoredState(stopwatchId, initialState);
  const [elapsed, setElapsed] = useState(state.elapsed);

  const updateElapsed = useCallback(() => {
    setElapsed(
      state.elapsed + (state.playing ? Date.now() - state.changed : 0)
    );
  }, [state, setElapsed]);

  const changeElapsedBy = useCallback(
    (delta) => {
      setState((state) => ({
        ...state,
        elapsed: state.elapsed + delta,
      }));
    },
    [setState]
  );

  const reset = () => {
    setState((state) => ({
      ...state,
      elapsed: 0,
      changed: Date.now(),
    }));
  };

  const toggle = useCallback(() => {
    setState((state) => ({
      playing: !state.playing,
      elapsed,
      changed: Date.now(),
    }));
  }, [elapsed, setState]);

  useInterval(() => {
    if (state.playing) {
      updateElapsed();
    }
  }, 1000);

  useEffect(() => {
    updateElapsed();
  }, [state, updateElapsed]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === " ") {
        toggle();
      } else if (e.key === "ArrowUp") {
        changeElapsedBy(60000);
      } else if (e.key === "ArrowDown") {
        changeElapsedBy(elapsed > 60000 ? -60000 : -elapsed);
      } else {
        return;
      }

      e.preventDefault();
    },
    [elapsed, toggle, changeElapsedBy]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={style.stopwatch}>
      <Input elapsed={Math.floor(elapsed / 1000)} />
      <button style={{ width: "4ch" }} onClick={() => toggle()}>
        {state.playing ? "Stop" : "Play"}
      </button>
      <button style={{ width: "5h" }} onClick={() => reset()}>
        Clear
      </button>
    </div>
  );
}
