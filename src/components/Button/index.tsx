import { ComponentPropsWithRef } from "react";

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
  return (
    <button
      className={`${classes.button} ${className ?? ""}`}
      style={{ ...style, width: `${children.length}ch` }}
      {...props}
    >
      {children}
    </button>
  );
};
