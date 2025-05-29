import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

export function UseSocket(userId) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId || socketRef.current) return;

    const socketIo = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    socketRef.current = socketIo;
    setSocket(socketIo);

    socketIo.on("connect", () => {
      console.log(" Client connected:", socketIo.id);
    });

    socketIo.on("disconnect", () => {
      console.log(" Client disconnected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [userId]);

  return socket;
}
