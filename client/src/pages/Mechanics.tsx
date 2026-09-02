import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { mechanicsApi } from "../services/api";

interface Mechanic {
  _id: string;
  name: string;
  phone: string;
  status:
    | "AVAILABLE"
    | "BUSY"
    | "OFFLINE"
    | "ON_THE_WAY";
  jobsCompleted: number;
  currentBooking?: {
    _id: string;
    bookingId: string;
    status: string;
  } | null;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
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
  { value: "AVAILABLE", label: "Available" },
  { value: "BUSY", label: "Busy" },
  { value: "ON_THE_WAY", label: "On the way" },
  { value: "OFFLINE", label: "Offline" },
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
    value: "name-asc",
    label: "Name A-Z",
  },
  {
    value: "name-desc",
    label: "Name Z-A",
  },
  {
    value: "jobsCompleted-desc",
    label: "Most jobs completed",
  },
  {
    value: "jobsCompleted-asc",
    label: "Least jobs completed",
  },
];

export default function Mechanics() {
  const navigate = useNavigate();

  const [mechanics, setMechanics] =
    useState<Mechanic[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  const [page, setPage] =
    useState(1);

  const [showFilters, setShowFilters] =
    useState(false);

  const limit = 10;

  // --------------------------------
  // Fetch mechanics
  // --------------------------------

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await mechanicsApi.getMechanics({
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

        setMechanics(
          response.data || []
        );

        setPagination(
          response.pagination || null
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Mechanics fetch error:",
          err
        );

        setError(
          "Unable to load mechanics."
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
  // Status styles
  // --------------------------------

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700";

      case "BUSY":
        return "bg-amber-50 text-amber-700";

      case "ON_THE_WAY":
        return "bg-blue-50 text-blue-700";

      case "OFFLINE":
        return "bg-zinc-100 text-zinc-600";

      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  // --------------------------------
  // Status label
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
  // Filter
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
    const separatorIndex =
      value.lastIndexOf("-");

    const field = value.slice(
      0,
      separatorIndex
    );

    const order = value.slice(
      separatorIndex + 1
    );

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
  // Open mechanic details
  // --------------------------------

  const openMechanicDetails = (
    id: string
  ) => {
    navigate(`/mechanics/${id}`);
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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Wrench size={21} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Mechanics
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage and monitor your mechanic
              team.
            </p>
          </div>
        </div>
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
              placeholder="Search mechanic by name or phone..."
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

        {/* Filter panel */}

        {showFilters && (
          <div className="mt-4 border-t border-zinc-200 pt-4">

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Status
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

            {/* Clear */}

            {filtersActive && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Clear filters
                </button>
              </div>
            )}

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

            <thead className="border-b border-zinc-200 bg-zinc-50">

              <tr>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Mechanic
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Phone
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Status
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Jobs Completed
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Current Booking
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Location
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-zinc-100">

              {mechanics.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >

                    {loading ? (
                      <>
                        <p className="font-medium text-zinc-700">
                          Loading mechanics...
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Please wait.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-zinc-700">
                          No mechanics found
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Try a different search
                          or filter.
                        </p>
                      </>
                    )}

                  </td>
                </tr>

              ) : (

                mechanics.map(
                  (mechanic) => (

                    <tr
                      key={
                        mechanic._id
                      }
                      className="transition hover:bg-zinc-50"
                    >

                      {/* Mechanic */}

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            openMechanicDetails(
                              mechanic._id
                            )
                          }
                          className="text-left"
                        >

                          <p className="font-semibold text-zinc-900 hover:underline">
                            {mechanic.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            View details
                          </p>

                        </button>

                      </td>

                      {/* Phone */}

                      <td className="px-6 py-4 text-zinc-600">
                        {mechanic.phone}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            mechanic.status
                          )}`}
                        >
                          {formatStatus(
                            mechanic.status
                          )}
                        </span>

                      </td>

                      {/* Jobs */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-zinc-900">
                          {
                            mechanic.jobsCompleted
                          }
                        </span>

                      </td>

                      {/* Current booking */}

                      <td className="px-6 py-4">

                        {mechanic
                          .currentBooking ? (
                          <div>
                            <p className="font-medium text-zinc-900">
                              {
                                mechanic
                                  .currentBooking
                                  .bookingId
                              }
                            </p>

                            <p className="text-xs text-zinc-500">
                              {
                                mechanic
                                  .currentBooking
                                  .status
                              }
                            </p>
                          </div>
                        ) : (
                          <span className="text-zinc-400">
                            None
                          </span>
                        )}

                      </td>

                      {/* Location */}

                      <td className="px-6 py-4">

                        <p className="font-mono text-xs text-zinc-600">
                          {mechanic.location.lat.toFixed(
                            4
                          )}
                          ,{" "}
                          {mechanic.location.lng.toFixed(
                            4
                          )}
                        </p>

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
                {mechanics.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-zinc-700">
                {pagination.total}
              </span>{" "}

              mechanics

            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        current - 1,
                        1
                      )
                  )
                }
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
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
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