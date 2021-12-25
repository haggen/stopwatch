import { useEffect } from "react";

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

/**
 * Update favicon href.
 */
export const useIcon = ({ href }: Options) => {
  useEffect(() => {
    const link = getLink("icon");
    link.href = href;
  }, [href]);
};
