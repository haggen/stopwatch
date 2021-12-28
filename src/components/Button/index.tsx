import { useRef } from "react";
import {
  ForwardedRef,
  forwardRef,
  ComponentPropsWithRef,
  SyntheticEvent,
} from "react";
import { useBoolean, useKey } from "react-use";

import classes from "./style.module.css";

type ActivateEventHandler = (
  event?: SyntheticEvent<HTMLButtonElement, MouseEvent>
) => void;

type ButtonProps = ComponentPropsWithRef<"button"> & {
  children: string;
  shortcut?: string;
  onActivate: ActivateEventHandler;
};

export const Button = forwardRef(
  (
    { children, onActivate, shortcut, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { onClick, onKeyDown } = props;
    const [active, setActive] = useBoolean(false);
    const activeTimeoutRef = useRef<any>();

    const onShortcut = () => {
      onActivate();

      // Emulate :active effects.
      // Yes, this is a hack.
      clearTimeout(activeTimeoutRef.current);
      setActive(true);
      activeTimeoutRef.current = setTimeout(() => {
        setActive(false);
      }, 75);
    };

    useKey(shortcut, onShortcut, undefined, [onActivate, shortcut]);

    props.onClick = (e) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        onActivate(e);
      }
    };

    props.onKeyDown = (e) => {
      e.stopPropagation();
      onKeyDown?.(e);
    };

    props.style = { ...props.style, width: `${children.length}ch` };

    props.className = `${props.className ?? ""} ${classes.button} ${
      active ? classes.active : ""
    }`;

    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
