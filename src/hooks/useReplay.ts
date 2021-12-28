import { RefObject, useEffect, useRef } from "react";

/**
 * Replay CSS animations on the referred element on update.
 */
export const useReplay = <T extends HTMLElement>(
  existingRef?: RefObject<T>
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    // @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips#run_an_animation_again
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.animation = "none";
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.animation = "";
          }
        });
      }
    });
  });

  return existingRef ?? ref;
};
