import "dotenv/config";

import http from "http";
import { Server as SocketIOServer } from "socket.io";

import app from "./app.js";
import { connectDB } from "./config/db.js";

import "./models/Customer.js";
import "./models/Mechanic.js";
import "./models/Booking.js";
import { setIO } from "./socket.js";
const PORT = Number(process.env.PORT) || 5050;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Create HTTP server using Express app
    const httpServer = http.createServer(app);

    // Create Socket.IO server
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin:
          process.env.CLIENT_URL ||
          "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });

    // Make Socket.IO available inside Express controllers
setIO(io);

    // Socket connection
    io.on("connection", (socket) => {
      console.log(
        `Socket connected: ${socket.id}`
      );

      socket.on("disconnect", () => {
        console.log(
          `Socket disconnected: ${socket.id}`
        );
      });
    });

    // Start HTTP + Socket.IO server
    httpServer.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );

      console.log(
        `Socket.IO running on ws://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();