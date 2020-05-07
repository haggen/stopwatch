import { useEffect } from "react";

import Hashids from "hashids";

const hashids = new Hashids();

function uniqueId() {
  // This magic number is simply the value of Date.now() when I wrote this.
  // It's meant to reduce the length of the hashid generated.
  return hashids.encode(Date.now() - 1588812376880);
}

export function useUrlId(root = "/") {
  const roomId =
    window.location.pathname === root
      ? uniqueId()
      : window.location.pathname.substring(root.length);

  useEffect(() => {
    window.history.pushState({}, null, root + roomId);
  }, [root, roomId]);

  return roomId;
}
