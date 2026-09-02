import { Request, Response } from "express";

import {
  getDashboardStats,
  getBookingsOverTime,
  getRevenueOverTime,
  getBookingStatusBreakdown,
  getServiceBreakdown,
} from "../services/dashboardService.js";

export const getDashboardStatsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getBookingsOverTimeController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await getBookingsOverTime();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get bookings over time error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings analytics",
    });
  }
};

export const getRevenueOverTimeController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await getRevenueOverTime();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get revenue over time error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
    });
  }
};

export const getBookingStatusController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await getBookingStatusBreakdown();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking status analytics",
    });
  }
};

export const getServiceBreakdownController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await getServiceBreakdown();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get service breakdown error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service analytics",
    });
  }
};