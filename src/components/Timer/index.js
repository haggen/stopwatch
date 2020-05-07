import React, { useRef, useEffect } from "react";

import { useTimer } from "../../hooks/useTimer";
import { useStoredState } from "../../hooks/useStoredState";
import { useRoomId } from "../../hooks/useRoomId";

import style from "./index.module.css";

function Input({ time, setTime }) {
  const ref = useRef();

  useEffect(() => {
    if (document.activeElement === ref.current) {
      ref.current.setSelectionRange(0, ref.current.value.length);
    }
  });

  const value =
    (time > 3600
      ? String((time / 3600).toFixed()).padStart(2, "0") + ":"
      : "") +
    String(((time % 3600) / 60).toFixed()).padStart(2, "0") +
    ":" +
    String(time % 60).padStart(2, "0");

  // const handleChange = (e) => {
  //   const time = e.target.value.split(":").map((n) => parseInt(n, 10));
  //   setTime(time.pop() + time.pop() * 60 + (time.length ? time[0] * 3600 : 0));
  // };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.target.blur();
    } else if (e.key === "ArrowUp") {
      setTime(time + 60);
    } else if (e.key === "ArrowDown") {
      setTime(time > 60 ? time - 60 : 0);
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

export default function Timer() {
  const timerId = useRoomId();
  const [time, setTime] = useStoredState(timerId, 0);
  const [counting, toggle] = useTimer(() => setTime((t) => t + 1));

  return (
    <div className={style.timer}>
      <Input time={time} setTime={setTime} />
      <button style={{ width: "4ch" }} onClick={() => toggle()}>
        {counting ? "Stop" : "Play"}
      </button>
      <button style={{ width: "5h" }} onClick={() => setTime(0)}>
        Clear
      </button>
    </div>
  );
}
