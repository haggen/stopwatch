import { useEffect } from "react";
import { createReducer, useKey } from "react-use";
import { nanoid } from "nanoid";

import { Second, Minute } from "src/lib/time";
import { useIcon } from "src/hooks/useIcon";

import PlayingIcon from "src/media/playing.svg";
import PausedIcon from "src/media/paused.svg";

import classes from "./style.module.css";
import { Display } from "../Display";
import { Controls } from "../Controls";

type State = {
  id: string;
  started: number | false;
  elapsed: number;
};

type Action =
  | { type: "load"; id: string }
  | { type: "tick" }
  | { type: "increment"; amount: number }
  | { type: "decrement"; amount: number }
  | { type: "clear" }
  | { type: "play" }
  | { type: "stop" }
  | { type: "toggle" };

const initialState = {
  id: "",
  started: 0,
  elapsed: 0,
};

const reducer = (state: State, action: Action): State => {
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
        // Migration due to changed format.
        if ("ticked" in state) {
          state.started = state.ticked;
          delete state.playing;
          delete state.ticked;
        }

        return state;
      }
      return { ...initialState, id: action.id };
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
        elapsed: 0,
      };
    case "play":
      return {
        ...state,
        started: now,
      };
    case "stop":
      const elapsed = state.elapsed + now - (state.started || 0);
      return {
        ...state,
        started: false,
        elapsed: elapsed - (elapsed % Second), // Round down so we don't stop at a fraction of a second.
      };
    case "toggle":
      return state.started
        ? reducer(state, { type: "stop" })
        : reducer(state, { type: "play" });
    default:
      return { ...initialState };
  }
};

const useReducer = createReducer<Action, State>(
  (store) => (next) => (action) => {
    next(action);

    const state = store.getState();
    if (state.id) {
      localStorage.setItem(state.id, JSON.stringify(state));
    }
  }
);

export const Stopwatch = () => {
  const [{ id, started, elapsed }, dispatch] = useReducer(
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

  useIcon({
    href: started ? PlayingIcon : PausedIcon,
  });

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

  return (
    <div className={classes.stopwatch}>
      <Display started={started} elapsed={elapsed} />
      <Controls started={started} onToggle={onToggle} onClear={onClear} />
    </div>
  );
};
