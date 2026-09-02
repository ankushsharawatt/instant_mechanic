import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { bookingsApi } from "../services/api";

interface Booking {
  _id: string;
  bookingId: string;

  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };

  mechanic?: {
    _id: string;
    name: string;
    phone: string;
    status: string;
  };

  vehicle: {
    make: string;
    model: string;
    registrationNumber: string;
  };

  service: {
    name: string;
    category: string;
  };

  status: string;
  amount: number;
  scheduledAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  {
    value: "MECHANIC_ON_THE_WAY",
    label: "Mechanic on the way",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
  },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
  {
    value: "createdAt-desc",
    label: "Newest first",
  },
  {
    value: "createdAt-asc",
    label: "Oldest first",
  },
  {
    value: "amount-desc",
    label: "Highest amount",
  },
  {
    value: "amount-asc",
    label: "Lowest amount",
  },
  {
    value: "scheduledAt-desc",
    label: "Latest scheduled",
  },
  {
    value: "scheduledAt-asc",
    label: "Earliest scheduled",
  },
];

export default function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------
  // Search
  // --------------------------------

  const [searchInput, setSearchInput] =
    useState("");

  // --------------------------------
  // Pagination
  // --------------------------------

  const [page, setPage] =
    useState(1);

  const limit = 10;

  // --------------------------------
  // Filters
  // --------------------------------

  const [statusFilter, setStatusFilter] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  const [showFilters, setShowFilters] =
    useState(false);

  // --------------------------------
  // Fetch bookings
  // --------------------------------

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await bookingsApi.getBookings({
            search:
              searchInput.trim() || undefined,

            status:
              statusFilter || undefined,

            sortBy,
            sortOrder,
            page,
            limit,
          });

        if (cancelled) return;

        setBookings(
          response.data || []
        );

        setPagination(
          response.pagination || null
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Bookings fetch error:",
          err
        );

        setError(
          "Unable to load bookings."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    searchInput,
    statusFilter,
    sortBy,
    sortOrder,
    page,
  ]);

  // --------------------------------
  // Currency
  // --------------------------------

  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  // --------------------------------
  // Date
  // --------------------------------

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------
  // Status
  // --------------------------------

  const formatStatus = (
    status: string
  ) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );
  };

  // --------------------------------
  // Status change
  // --------------------------------

  const handleStatusChange = (
    value: string
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  // --------------------------------
  // Sorting
  // --------------------------------

  const handleSortChange = (
    value: string
  ) => {
    const [field, order] =
      value.split("-");

    setSortBy(field);

    setSortOrder(
      order as "asc" | "desc"
    );

    setPage(1);
  };

  // --------------------------------
  // Clear filters
  // --------------------------------

  const clearFilters = () => {
    setStatusFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const filtersActive =
    statusFilter !== "" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  const currentSortValue =
    `${sortBy}-${sortOrder}`;

  // --------------------------------
  // Open booking details
  // --------------------------------

  const openBookingDetails = (
    bookingId: string
  ) => {
    navigate(
      `/bookings/${bookingId}`
    );
  };

  // --------------------------------
  // Page
  // --------------------------------

  return (
    <div className="space-y-6">

      {/* =========================
          Header
      ========================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Bookings
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage and monitor all mechanic
          service bookings.
        </p>
      </div>

      {/* =========================
          Search & Filters
      ========================== */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              placeholder="Search booking, customer, mechanic, vehicle..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(
                  e.target.value
                );

                if (page !== 1) {
                  setPage(1);
                }
              }}
              className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />

            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
              </div>
            )}

          </div>

          {/* Filter button */}

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (current) => !current
              )
            }
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              showFilters ||
              filtersActive
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Filter size={17} />

            Filters

            {filtersActive && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-zinc-900">
                !
              </span>
            )}
          </button>

        </div>

        {/* =========================
            Filter Panel
        ========================== */}

        {showFilters && (
          <div className="mt-4 border-t border-zinc-200 pt-4">

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Booking Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                >
                  {STATUS_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Sort */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Sort By
                </label>

                <select
                  value={
                    currentSortValue
                  }
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                >
                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            {/* Filter actions */}

            <div className="mt-4 flex items-center justify-between">

              <p className="text-sm text-zinc-500">
                {filtersActive
                  ? "Filters are active"
                  : "No filters applied"}
              </p>

              {filtersActive && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <X size={16} />

                  Clear filters
                </button>
              )}

            </div>

          </div>
        )}

      </div>

      {/* =========================
          Error
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {error}
          </p>
        </div>
      )}

      {/* =========================
          Table
      ========================== */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            {/* Header */}

            <thead className="border-b border-zinc-200 bg-zinc-50">

              <tr>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Booking
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Customer
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Vehicle
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Service
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Mechanic
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Amount
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Status
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Scheduled
                </th>

              </tr>

            </thead>

            {/* Body */}

            <tbody className="divide-y divide-zinc-100">

              {bookings.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >

                    {loading ? (
                      <>
                        <p className="font-medium text-zinc-700">
                          Loading bookings...
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Please wait.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-zinc-700">
                          No bookings found
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Try a different search or filter.
                        </p>
                      </>
                    )}

                  </td>

                </tr>

              ) : (

                bookings.map(
                  (booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-zinc-50"
                    >

                      {/* Booking */}

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            openBookingDetails(
                              booking.bookingId
                            )
                          }
                          className="font-semibold text-zinc-900 hover:text-zinc-600 hover:underline"
                        >
                          {booking.bookingId}
                        </button>

                      </td>

                      {/* Customer */}

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium text-zinc-900">
                            {booking.customer?.name ||
                              "Unknown customer"}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {booking.customer?.phone ||
                              "—"}
                          </p>

                        </div>

                      </td>

                      {/* Vehicle */}

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium text-zinc-900">
                            {booking.vehicle?.make ||
                              "—"}{" "}
                            {booking.vehicle?.model ||
                              ""}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {booking.vehicle
                              ?.registrationNumber ||
                              "—"}
                          </p>

                        </div>

                      </td>

                      {/* Service */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-zinc-900">
                          {booking.service?.name ||
                            "—"}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {booking.service
                            ?.category ||
                            "—"}
                        </p>

                      </td>

                      {/* Mechanic */}

                      <td className="px-6 py-4">

                        {booking.mechanic?.name ||
                          "Unassigned"}

                      </td>

                      {/* Amount */}

                      <td className="px-6 py-4 font-medium">

                        {formatCurrency(
                          booking.amount
                        )}

                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                          {formatStatus(
                            booking.status
                          )}
                        </span>

                      </td>

                      {/* Scheduled */}

                      <td className="px-6 py-4 text-zinc-600">

                        {formatDate(
                          booking.scheduledAt
                        )}

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            Pagination
        ========================== */}

        {pagination && (
          <div className="flex flex-col gap-4 border-t border-zinc-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-zinc-500">

              Showing{" "}

              <span className="font-medium text-zinc-700">
                {bookings.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-zinc-700">
                {pagination.total}
              </span>{" "}

              bookings

            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage ||
                  loading
                }
                onClick={() => {
                  setPage(
                    (current) =>
                      Math.max(
                        current - 1,
                        1
                      )
                  );
                }}
                className="rounded-lg border border-zinc-200 p-2 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={17}
                />
              </button>

              {/* Page */}

              <span className="px-2 text-sm text-zinc-600">

                Page{" "}

                <span className="font-medium text-zinc-900">
                  {pagination.page}
                </span>{" "}

                of{" "}

                <span className="font-medium text-zinc-900">
                  {pagination.totalPages}
                </span>

              </span>

              {/* Next */}

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage ||
                  loading
                }
                onClick={() => {
                  setPage(
                    (current) =>
                      current + 1
                  );
                }}
                className="rounded-lg border border-zinc-200 p-2 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={17}
                />
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}