import { Booking } from "../models/Booking.js";
import { Mechanic } from "../models/Mechanic.js";
import { Customer } from "../models/Customer.js";

export const getDashboardStats = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    revenueResult,
    activeMechanics,
    newCustomers,
  ] = await Promise.all([
    Booking.countDocuments(),

    Booking.countDocuments({
      scheduledAt: {
        $gte: startOfToday,
        $lt: startOfTomorrow,
      },
    }),

    Booking.countDocuments({
      status: "COMPLETED",
    }),

    Booking.countDocuments({
      status: "PENDING",
    }),

    Booking.countDocuments({
      status: "CANCELLED",
    }),

    Booking.aggregate([
      {
        $match: {
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]),

    Mechanic.countDocuments({
      status: {
        $in: ["AVAILABLE", "BUSY", "ON_THE_WAY"],
      },
    }),

    Customer.countDocuments({
      createdAt: {
        $gte: thirtyDaysAgo,
      },
    }),
  ]);

  return {
    totalBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue: revenueResult[0]?.total ?? 0,
    activeMechanics,
    newCustomers,
  };
};

export const getBookingsOverTime = async () => {
  return Booking.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$scheduledAt",
          },
        },
        bookings: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        bookings: 1,
      },
    },
  ]);
};

export const getRevenueOverTime = async () => {
  return Booking.aggregate([
    {
      $match: {
        status: "COMPLETED",
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$scheduledAt",
          },
        },

        revenue: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
      },
    },
  ]);
};

export const getBookingStatusBreakdown = async () => {
  return Booking.aggregate([
    {
      $group: {
        _id: "$status",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },

    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);
};

export const getServiceBreakdown = async () => {
  return Booking.aggregate([
    {
      $group: {
        _id: "$service.category",

        bookings: {
          $sum: 1,
        },

        revenue: {
          $sum: "$amount",
        },
      },
    },

    {
      $sort: {
        bookings: -1,
      },
    },

    {
      $project: {
        _id: 0,
        category: "$_id",
        bookings: 1,
        revenue: 1,
      },
    },
  ]);
};