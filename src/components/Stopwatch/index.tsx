import { useEffect } from "react";
import { createReducer, useKey, useInterval, useFavicon } from "react-use";
import { nanoid } from "nanoid";

import { Button } from "src/components/Button";
import PlayingIcon from "src/media/playing.svg";
import PausedIcon from "src/media/paused.svg";

import classes from "./style.module.css";

type Action =
  | { type: "load"; id: string }
  | { type: "tick" }
  | { type: "increment"; amount: number }
  | { type: "decrement"; amount: number }
  | { type: "clear" }
  | { type: "toggle" };

const Second = 1000;
const Minute = 60 * Second;
const Hour = 60 * Minute;

const formatTimeUnit = (value: number) => {
  return String(Math.floor(value)).padStart(2, "0");
};

const initialState = {
  id: "",
  playing: false,
  ticked: 0,
  elapsed: 0,
};

const reducer = (state: typeof initialState, action: Action) => {
  const now = Date.now();

  switch (action.type) {
    case "load":
      const item = localStorage.getItem(action.id);
      if (item) {
        const state = JSON.parse(item);

        // Migration due to changed format.
        if ("changed" in state) {
          state.id = action.id;
          state.ticked = state.changed;
          delete state.changed;
        }

        return state;
      }
      return { ...initialState, id: action.id };
    case "tick":
      if (!state.playing) {
        return state;
      }
      return {
        ...state,
        ticked: now,
        elapsed: state.elapsed + (now - state.ticked),
      };
    case "increment":
      return {
        ...state,
        elapsed: state.elapsed + action.amount,
      };
    case "decrement":
      return {
        ...state,
        elapsed:
          state.elapsed -
          (state.elapsed > action.amount ? action.amount : state.elapsed),
      };
    case "clear":
      return {
        ...state,
        playing: state.playing,
        ticked: now,
        elapsed: 0,
      };
    case "toggle":
      return {
        ...state,
        playing: !state.playing,
        ticked: now,
      };
  }
};

const useReducer = createReducer<Action, typeof initialState>(
  (store) => (next) => (action) => {
    next(action);

    const state = store.getState();
    if (state.id) {
      localStorage.setItem(state.id, JSON.stringify(state));
    }
  }
);

export const Stopwatch = () => {
  const [{ id, playing, elapsed }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    if (!id) {
      const { pathname } = window.location;
      const id = pathname === "/" ? nanoid(5) : pathname.substring(1);

      dispatch({ type: "load", id });

      window.history.replaceState({}, "", "/" + id);
    }
  }, [id]);

  const onToggle = () => {
    dispatch({ type: "toggle" });
  };

  const onClear = () => {
    dispatch({ type: "clear" });
  };

  useKey(" ", () => {
    dispatch({ type: "toggle" });
  });

  useKey("Backspace", () => {
    dispatch({ type: "clear" });
  });

  useKey("ArrowDown", () => {
    dispatch({ type: "decrement", amount: Minute });
  });

  useKey("ArrowUp", () => {
    dispatch({ type: "increment", amount: Minute });
  });

  useInterval(() => {
    dispatch({ type: "tick" });
  }, 500);

  useFavicon(playing ? PlayingIcon : PausedIcon);

  const display =
    (elapsed >= Hour ? formatTimeUnit(elapsed / Hour) + ":" : "") +
    formatTimeUnit((elapsed % Hour) / Minute) +
    ":" +
    formatTimeUnit((elapsed % Minute) / Second);

  return (
    <div className={classes.stopwatch}>
      <Button className={classes.display}>{display}</Button>
      <div className={classes.controls}>
        <Button onClick={onToggle}>{playing ? "Stop" : "Play"}</Button>
        <Button onClick={onClear}>Clear</Button>
      </div>
    </div>
  );
};
