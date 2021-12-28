import { ComponentPropsWithRef, KeyboardEvent } from "react";

import classes from "./style.module.css";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  children: string;
};

export const Button = ({
  children,
  style,
  className,
  ...props
}: ButtonProps) => {
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " ") {
      e.stopPropagation();
    }
    props.onKeyDown?.(e);
  };

  return (
    <button
      className={`${classes.button} ${className ?? ""}`}
      style={{ ...style, width: `${children.length}ch` }}
      {...props}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
};
