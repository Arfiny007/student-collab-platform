import {
  io,
  Socket,
} from "socket.io-client";

let socket:
  | Socket
  | null =
  null;

export function getSocket() {
  if (socket) {
    return socket;
  }

  const token =
    localStorage.getItem(
      "token",
    );

  socket = io(
    process.env
      .NEXT_PUBLIC_API_URL ||
      "http://localhost:5000",
    {
      transports: [
        "websocket",
      ],

      auth: {
        token,
      },

      reconnection: true,

      reconnectionAttempts:
        Infinity,
    },
  );

  return socket;
}