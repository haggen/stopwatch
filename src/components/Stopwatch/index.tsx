import { useEffect } from "react";
import { useKey } from "react-use";
import { nanoid } from "nanoid";

import { Hour, Minute } from "src/lib/time";
import { useIcon } from "src/hooks/useIcon";
import { Display } from "src/components/Display";
import { Controls } from "src/components/Controls";
import { Notification, useNotification } from "src/components/Notification";

import PlayingIcon from "src/media/playing.svg";
import PausedIcon from "src/media/paused.svg";

import { useStopwatch } from "./state";

import classes from "./style.module.css";

export const Stopwatch = () => {
  const [{ id, started, elapsed, colorScheme }, dispatch] = useStopwatch();

  const notification = useNotification();

  useEffect(() => {
    if (!id) {
      const { pathname } = window.location;
      const id = pathname === "/" ? nanoid(5) : pathname.substring(1);

      dispatch({ type: "load", id });

      window.history.replaceState({}, "", "/" + id);
    }
  }, [dispatch, id]);

  useIcon({
    href: started ? PlayingIcon : PausedIcon,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
    notification.setMessage(`Color scheme: ${colorScheme}`);
  }, [colorScheme, notification]);

  useKey("l", () => {
    dispatch({ type: "toggleColorScheme" });
  });

  useKey("ArrowDown", (e) => {
    dispatch({ type: "decrement", amount: e.shiftKey ? Hour : Minute });
  });

  useKey("ArrowUp", (e) => {
    dispatch({ type: "increment", amount: e.shiftKey ? Hour : Minute });
  });

  return (
    <>
      <Notification {...notification} />

      <div className={classes.stopwatch}>
        <Display started={started} elapsed={elapsed} />
        <Controls
          onToggle={() => dispatch({ type: "toggle" })}
          onClear={() => dispatch({ type: "clear" })}
          started={started}
        />
      </div>
    </>
  );
};
