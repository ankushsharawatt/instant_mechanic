import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { customersApi } from "../services/api";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
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
    value: "totalBookings-desc",
    label: "Most bookings",
  },
  {
    value: "totalBookings-asc",
    label: "Least bookings",
  },
];

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searchInput, setSearchInput] =
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
  // Fetch customers
  // --------------------------------

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await customersApi.getCustomers({
            search:
              searchInput.trim() || undefined,

            sortBy,
            sortOrder,
            page,
            limit,
          });

        if (cancelled) return;

        setCustomers(
          response.data || []
        );

        setPagination(
          response.pagination || null
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Customers fetch error:",
          err
        );

        setError(
          "Unable to load customers."
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
    sortBy,
    sortOrder,
    page,
  ]);

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
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const filtersActive =
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  const currentSortValue =
    `${sortBy}-${sortOrder}`;

  // --------------------------------
  // Open customer details
  // --------------------------------

  const openCustomerDetails = (
    id: string
  ) => {
    navigate(`/customers/${id}`);
  };

  // --------------------------------
  // Format date
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
            <Users size={21} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Customers
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage and monitor your customers.
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
              placeholder="Search customer by name, email or phone..."
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

          {/* Filter */}

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

            <div className="max-w-md">

              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Sort By
              </label>

              <select
                value={currentSortValue}
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

            {filtersActive && (
              <div className="mt-4">
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
                  Customer
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Contact
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Address
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Total Bookings
                </th>

                <th className="px-6 py-4 font-semibold text-zinc-700">
                  Joined
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-zinc-100">

              {customers.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >

                    {loading ? (
                      <>
                        <p className="font-medium text-zinc-700">
                          Loading customers...
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Please wait.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-zinc-700">
                          No customers found
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Try a different search.
                        </p>
                      </>
                    )}

                  </td>

                </tr>

              ) : (

                customers.map(
                  (customer) => (

                    <tr
                      key={
                        customer._id
                      }
                      className="transition hover:bg-zinc-50"
                    >

                      {/* Customer */}

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            openCustomerDetails(
                              customer._id
                            )
                          }
                          className="text-left"
                        >

                          <p className="font-semibold text-zinc-900 hover:underline">
                            {customer.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            View details
                          </p>

                        </button>

                      </td>

                      {/* Contact */}

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium text-zinc-900">
                            {customer.email}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {customer.phone}
                          </p>

                        </div>

                      </td>

                      {/* Address */}

                      <td className="max-w-xs px-6 py-4">

                        <p className="truncate text-zinc-600">
                          {customer.address}
                        </p>

                      </td>

                      {/* Bookings */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-zinc-900">
                          {
                            customer.totalBookings
                          }
                        </span>

                      </td>

                      {/* Joined */}

                      <td className="px-6 py-4 text-zinc-600">
                        {formatDate(
                          customer.createdAt
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
                {customers.length}
              </span>{" "}

              of{" "}

              <span className="font-medium text-zinc-700">
                {pagination.total}
              </span>{" "}

              customers

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