import express from "express";
import cors from "cors";

import { verifyToken, authorizeRoles } from "./middleware/auth.js";

import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Instant Mechanic API is running",
  });
});


// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mechanics",mechanicRoutes);
app.use("/api/customers",customerRoutes);


export default app;