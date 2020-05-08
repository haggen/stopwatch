import React, { useRef, useEffect, useCallback } from "react";

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

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.target.blur();
    } else if (e.key === "ArrowUp") {
      changeElapsedBy(60);
    } else if (e.key === "ArrowDown") {
      changeElapsedBy(elapsed > 60 ? -60 : 0);
    } else {
      return;
    }

    e.preventDefault();
  };

  const handleFocus = (e) => {
    e.target.setSelectionRange(0, e.target.value.length);
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      readOnly={true}
      style={{ width: `${value.length}ch` }}
    />
  );
}

const initialState = {
  playing: false,
  elapsed: 0,
};

export default function Stopwatch() {
  const stopwatchId = useUrlId();
  const [state, setState] = useStoredState(stopwatchId, initialState);

  const changeElapsedBy = (delta) => {
    setState((state) => ({ ...state, elapsed: state.elapsed + delta }));
  };

  const resetElapsed = () => {
    setState((state) => ({ ...state, elapsed: 0 }));
  };

  const toggle = useCallback(() => {
    setState((state) => ({
      ...state,
      playing: !state.playing,
    }));
  }, [setState]);

  useInterval(() => {
    if (state.playing) {
      changeElapsedBy(1);
    }
  }, 1000);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        toggle();
      } else {
        return;
      }

      e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <div className={style.stopwatch}>
      <Input elapsed={state.elapsed} changeElapsedBy={changeElapsedBy} />
      <button style={{ width: "4ch" }} onClick={() => toggle()}>
        {state.playing ? "Stop" : "Play"}
      </button>
      <button style={{ width: "5h" }} onClick={() => resetElapsed()}>
        Clear
      </button>
    </div>
  );
}
