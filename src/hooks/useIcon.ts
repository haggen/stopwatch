import { useEffect } from "react";

type Options = {
  href: string;
  color: string;
};

const setFavicon = (href: string) => {
  const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (link) {
    link.href = href;
  }
};

const setMaskIcon = (href: string, color: string) => {
  const link = document.querySelector<HTMLLinkElement>(
    "link[rel*='mask-icon']"
  );
  if (link) {
    link.href = href;
    link.setAttribute("color", color);
  }
};

/**
 * Update favicon and mask-icon for Safari.
 */
export const useIcon = ({ href, color }: Options) => {
  useEffect(() => {
    setFavicon(href);
    setMaskIcon(href, color);
  }, [href, color]);
};
