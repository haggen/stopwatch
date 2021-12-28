import { useRef } from "react";
import { useEffect, useState } from "react";
import { useReplay } from "src/hooks/useReplay";

import classes from "./style.module.css";

type Props = {
  message: string;
  setMessage: (message: string) => void;
};

export const useNotification = () => {
  const [message, setMessage] = useState("");
  const ref = useRef({ message, setMessage });
  ref.current.message = message;
  return ref.current;
};

export const Notification = ({ message, setMessage }: Props) => {
  const elementRef = useReplay<HTMLDivElement>();

  useEffect(() => {
    const id = setTimeout(() => setMessage(""), 2000);
    return () => {
      clearTimeout(id);
    };
  }, [message, setMessage]);

  if (!message) {
    return null;
  }

  return (
    <div role="alert" ref={elementRef} className={classes.notification}>
      {message}
    </div>
  );
};
