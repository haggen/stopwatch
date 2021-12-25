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
      <Button onClick={onToggle}>{started ? "Stop" : "Play"}</Button>
      <Button onClick={onClear}>Clear</Button>
    </div>
  );
};
