import { createReducer } from "react-use";

import { Second } from "src/lib/time";

type State = {
  id: string;
  started: number | false;
  elapsed: number;
  colorScheme: string;
};

type Action =
  | { type: "load"; id: string }
  | { type: "tick" }
  | { type: "increment"; amount: number }
  | { type: "decrement"; amount: number }
  | { type: "clear" }
  | { type: "play" }
  | { type: "stop" }
  | { type: "toggle" }
  | { type: "toggleColorScheme" };

const initialState = {
  id: "",
  started: 0,
  elapsed: 0,
  colorScheme: "auto",
};

const availableColorSchemes = ["auto", "light", "dark"];

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
        started: state.started && now,
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
        // Round down so we don't stop at a fraction of a second.
        // Stopping at a fraction of a second would cause the next second to feel "shorter".
        elapsed: elapsed - (elapsed % Second),
      };
    case "toggle":
      return state.started
        ? reducer(state, { type: "stop" })
        : reducer(state, { type: "play" });
    case "toggleColorScheme":
      return {
        ...state,
        colorScheme:
          availableColorSchemes[
            (availableColorSchemes.indexOf(state.colorScheme) + 1) %
              availableColorSchemes.length
          ],
      };
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

export const useStopwatch = () => {
  return useReducer(reducer, initialState);
};
