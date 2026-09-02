import { Router } from "express";

import {
  getDashboardStatsController,
  getBookingsOverTimeController,
  getRevenueOverTimeController,
  getBookingStatusController,
  getServiceBreakdownController,
} from "../controllers/dashboardController.js";

const router = Router();

router.get("/stats", getDashboardStatsController);

router.get(
  "/bookings-over-time",
  getBookingsOverTimeController
);

router.get(
  "/revenue-over-time",
  getRevenueOverTimeController
);

router.get(
  "/booking-status",
  getBookingStatusController
);

router.get(
  "/service-breakdown",
  getServiceBreakdownController
);

export default router;