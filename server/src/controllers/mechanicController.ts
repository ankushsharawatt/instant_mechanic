import { Request, Response } from "express";
import { Mechanic } from "../models/Mechanic.js";

// --------------------------------
// Get all mechanics
// --------------------------------

export const getMechanics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search = "",
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // --------------------------------
    // Pagination
    // --------------------------------

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

    // --------------------------------
    // Search + filter
    // --------------------------------

    const filter: Record<string, unknown> =
      {};

    if (status) {
      filter.status = String(status);
    }

    const searchText =
      String(search || "").trim();

    if (searchText) {
      const escapedSearch =
        searchText.replace(
          /[-/\\^$*+?.()|[\]{}]/g,
          "\\$&"
        );

      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------
    // Sorting
    // --------------------------------

    const allowedSortFields = [
      "createdAt",
      "name",
      "jobsCompleted",
      "status",
    ];

    const safeSortField =
      allowedSortFields.includes(
        String(sortBy)
      )
        ? String(sortBy)
        : "createdAt";

    const sortDirection =
      sortOrder === "asc" ? 1 : -1;

    // --------------------------------
    // Query
    // --------------------------------

    const [mechanics, totalMechanics] =
      await Promise.all([
        Mechanic.find(filter)
          .populate(
            "currentBooking",
            "bookingId status"
          )
          .sort({
            [safeSortField]: sortDirection,
          })
          .skip(skip)
          .limit(pageLimit)
          .lean(),

        Mechanic.countDocuments(filter),
      ]);

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.ceil(
      totalMechanics / pageLimit
    );

    // --------------------------------
    // Response
    // --------------------------------

    res.status(200).json({
      success: true,
      data: mechanics,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalMechanics,
        totalPages,
        hasNextPage:
          currentPage < totalPages,
        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get mechanics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch mechanics",
    });
  }
};

// --------------------------------
// Get mechanic by ID
// --------------------------------

export const getMechanicById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const mechanic =
      await Mechanic.findById(id)
        .populate(
          "currentBooking",
          "bookingId status amount scheduledAt"
        )
        .lean();

    if (!mechanic) {
      res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: mechanic,
    });
  } catch (error) {
    console.error(
      "Get mechanic by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch mechanic",
    });
  }
};