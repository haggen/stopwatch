import { Button } from "src/components/Button";

import classes from "./style.module.css";

type Props = {
  started: number | false;
  onToggle: () => void;
  onClear: () => void;
};

export const Controls = ({ started, onToggle, onClear }: Props) => {
  return (
    <div className={classes.controls}>
      <Button onActivate={onToggle} shortcut=" ">
        {started ? "Stop" : "Play"}
      </Button>
      <Button onActivate={onClear} shortcut="Backspace">
        Clear
      </Button>
    </div>
  );
};
