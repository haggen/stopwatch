import { useRaf } from "react-use";

import { Second, Minute, Hour } from "src/lib/time";
import { Button } from "src/components/Button";

import classes from "./style.module.css";

type Props = {
  elapsed: number;
  started: number | false;
};

const format = (value: number) => {
  return String(Math.floor(value)).padStart(2, "0");
};

export const Display = ({ elapsed, started }: Props) => {
  const now = Date.now();
  const total = elapsed + now - (started || now);

  const display =
    (total >= Hour ? format(total / Hour) + ":" : "") +
    format((total % Hour) / Minute) +
    ":" +
    format((total % Minute) / Second);

  // @todo https://github.com/streamich/react-use/issues/779
  useRaf(2147483646);

  const onActivate = () => {
    navigator.clipboard.writeText(display);
  };

  return (
    <Button className={classes.display} onActivate={onActivate} shortcut="c">
      {display}
    </Button>
  );
};
