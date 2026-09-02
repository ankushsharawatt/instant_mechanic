import type { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const setIO = (
  socketServer: SocketIOServer
): void => {
  io = socketServer;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};