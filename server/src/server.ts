import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

import "./models/Customer.js";
import "./models/Mechanic.js";
import "./models/Booking.js";

const PORT = Number(process.env.PORT) || 5050;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
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