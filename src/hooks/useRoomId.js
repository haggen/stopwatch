import { useEffect } from "react";

import Hashids from "hashids";

const hashids = new Hashids();

function uniqueId() {
  return hashids.encode(Date.now());
}

export function useRoomId(root = "/") {
  const roomId =
    window.location.pathname === root
      ? uniqueId()
      : window.location.pathname.substring(root.length);

  useEffect(() => {
    window.history.pushState({}, null, root + roomId);
  }, [root, roomId]);

  return roomId;
}
