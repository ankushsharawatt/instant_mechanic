import { Request, Response } from "express";
import { Booking } from "../models/Booking.js";

export const getBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // -----------------------------
    // 1. Read query parameters
    // -----------------------------

    const {
      search = "",
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // -----------------------------
    // 2. Pagination
    // -----------------------------

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (currentPage - 1) * pageLimit;

    // -----------------------------
    // 3. Search value
    // -----------------------------

    const searchText =
      String(search || "").trim();

    // Escape regex characters
    const escapeRegex = (value: string) =>
      value.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );

    const escapedSearch =
      escapeRegex(searchText);

    // -----------------------------
    // 4. Allowed sorting
    // -----------------------------

    const allowedSortFields = [
      "createdAt",
      "scheduledAt",
      "amount",
      "bookingId",
      "status",
    ];

    const safeSortField =
      allowedSortFields.includes(
        String(sortBy)
      )
        ? String(sortBy)
        : "createdAt";

    const sortDirection =
      String(sortOrder) === "asc"
        ? 1
        : -1;

    // -----------------------------
    // 5. Aggregation pipeline
    // -----------------------------

    const pipeline: any[] = [];

    // -----------------------------
    // Status filter
    // -----------------------------

    if (status) {
      pipeline.push({
        $match: {
          status: String(status),
        },
      });
    }

    // -----------------------------
    // Customer lookup
    // -----------------------------

    pipeline.push({
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    });

    // -----------------------------
    // Mechanic lookup
    // -----------------------------

    pipeline.push({
      $lookup: {
        from: "mechanics",
        localField: "mechanic",
        foreignField: "_id",
        as: "mechanic",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$mechanic",
        preserveNullAndEmptyArrays: true,
      },
    });

    // -----------------------------
    // Search
    // -----------------------------

    if (searchText) {
      pipeline.push({
        $match: {
          $or: [
            // Booking ID
            {
              bookingId: {
                $regex: escapedSearch,
                $options: "i",
              },
            },

            // Customer
            {
              "customer.name": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "customer.email": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "customer.phone": {
                $regex: escapedSearch,
                $options: "i",
              },
            },

            // Mechanic
            {
              "mechanic.name": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "mechanic.phone": {
                $regex: escapedSearch,
                $options: "i",
              },
            },

            // Vehicle
            {
              "vehicle.registrationNumber": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "vehicle.make": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "vehicle.model": {
                $regex: escapedSearch,
                $options: "i",
              },
            },

            // Service
            {
              "service.name": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "service.category": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    // -----------------------------
    // Sorting
    // -----------------------------

    pipeline.push({
      $sort: {
        [safeSortField]: sortDirection,
      },
    });

    // -----------------------------
    // Pagination + total
    // -----------------------------

    pipeline.push({
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: pageLimit,
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    // -----------------------------
    // Execute
    // -----------------------------

    const result =
      await Booking.aggregate(
        pipeline
      ).exec();

    const aggregationResult =
      result[0] || {
        data: [],
        totalCount: [],
      };

    const bookings =
      aggregationResult.data || [];

    const totalBookings =
      aggregationResult.totalCount?.[0]
        ?.count || 0;

    // -----------------------------
    // Pagination information
    // -----------------------------

    const totalPages = Math.ceil(
      totalBookings / pageLimit
    );

    // -----------------------------
    // Response
    // -----------------------------

    res.status(200).json({
      success: true,

      data: bookings,

      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalBookings,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get bookings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }

  
};
export const getBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      bookingId: id,
    })
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "mechanic",
        "name phone status"
      )
      .lean();

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(
      "Get booking by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};