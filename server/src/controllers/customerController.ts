import { Request, Response } from "express";
import { Customer } from "../models/Customer.js";
import { Booking } from "../models/Booking.js";
// --------------------------------
// Get all customers
// --------------------------------

export const getCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search = "",
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
    // Search
    // --------------------------------

    const filter: Record<string, unknown> =
      {};

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
          email: {
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
        {
          address: {
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
      "email",
      "totalBookings",
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
    // Database query
    // --------------------------------

    const [customers, totalCustomers] =
      await Promise.all([
        Customer.find(filter)
          .sort({
            [safeSortField]: sortDirection,
          })
          .skip(skip)
          .limit(pageLimit)
          .lean(),

        Customer.countDocuments(filter),
      ]);

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.ceil(
      totalCustomers / pageLimit
    );

    // --------------------------------
    // Response
    // --------------------------------

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: totalCustomers,
        totalPages,
        hasNextPage:
          currentPage < totalPages,
        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get customers error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

// --------------------------------
// Get customer by ID
// --------------------------------

// --------------------------------
// Get customer by ID
// Includes booking history
// --------------------------------

export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const customer =
      await Customer.findById(id).lean();

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });

      return;
    }

    const bookings = await Booking.find({
      customer: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        customer,
        bookings,
      },
    });
  } catch (error) {
    console.error(
      "Get customer by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};