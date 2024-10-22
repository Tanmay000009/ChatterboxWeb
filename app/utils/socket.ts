import { SERVER_BASE } from "../constants";

import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const createSocket = (token: string) => {
  socket = io(SERVER_BASE, {
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to socket");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });

  return socket;
};
