import React from "react";

import { useTimer } from "../../hooks/useTimer";
import { useStoredState } from "../../hooks/useStoredState";
import { useRoomId } from "../../hooks/useRoomId";

import style from "./index.module.css";

function Input({ time, readOnly, setTime }) {
  const value =
    (time > 3600
      ? String((time / 3600).toFixed()).padStart(2, "0") + ":"
      : "") +
    String(((time % 3600) / 60).toFixed()).padStart(2, "0") +
    ":" +
    String(time % 60).padStart(2, "0");

  const handleChange = e => {
    const time = e.target.value.split(":").map(n => parseInt(n, 10));
    setTime(time.pop() + time.pop() * 60 + (time.length ? time[0] * 3600 : 0));
  };

  const handleKeyDown = e => {
    if (e.key === "ArrowUp") {
      setTime(time + 60);
    } else if (e.key === "ArrowDown") {
      setTime(time > 60 ? time - 60 : 0);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
    />
  );
}

export default function Timer() {
  const timerId = useRoomId();
  const [time, setTime] = useStoredState(timerId, 0);
  const [counting, toggle] = useTimer(() => setTime(t => t + 1));

  return (
    <div className={style.timer}>
      <Input time={time} setTime={setTime} />
      <button onClick={e => toggle()}>{counting ? "Stop" : "Play"}</button>
    </div>
  );
}
