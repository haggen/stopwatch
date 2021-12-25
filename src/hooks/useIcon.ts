import { useEffect, useRef } from "react";

type Options = {
  href: string;
};

const getLink = (rel: string) => {
  const link =
    document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`) ??
    document.createElement("link");
  link.rel = rel;
  document.head.appendChild(link);
  return link;
};

const useLinkRef = (rel: string) => {
  return useRef(getLink(rel));
};

/**
 * Update favicon href.
 */
export const useIcon = ({ href }: Options) => {
  const iconRef = useLinkRef("icon");

  useEffect(() => {
    iconRef.current.href = href;
  }, [href, iconRef]);
};
