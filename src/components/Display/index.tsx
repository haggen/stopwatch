import { useRaf } from "react-use";

import { Second, Minute, Hour } from "src/lib/time";
import { Button } from "src/components/Button";

import classes from "./style.module.css";

type Props = {
  elapsed: number;
  started: number | false;
};

const formatNumber = (value: number) => {
  return String(Math.floor(value)).padStart(2, "0");
};

const formatDisplay = (elapsed: number) => {
  return (
    (elapsed >= Hour ? formatNumber(elapsed / Hour) + ":" : "") +
    formatNumber((elapsed % Hour) / Minute) +
    ":" +
    formatNumber((elapsed % Minute) / Second)
  );
};

const getTotal = (elapsed: number, started: number | false) => {
  const now = Date.now();
  return elapsed + now - (started || now);
};

export const Display = ({ elapsed, started }: Props) => {
  const total = getTotal(elapsed, started);

  // @todo https://github.com/streamich/react-use/issues/779
  useRaf(2147483646);

  return <Button className={classes.display}>{formatDisplay(total)}</Button>;
};
