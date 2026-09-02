import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Car,
  ClipboardList,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { customersApi } from "../services/api";

interface Booking {
  _id: string;
  bookingId: string;

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

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
  createdAt: string;
}

interface CustomerDetailsResponse {
  customer: Customer;
  bookings: Booking[];
}

export default function CustomerDetails() {
  const navigate = useNavigate();

  const { id } =
    useParams<{ id: string }>();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // --------------------------------
  // Fetch customer details
  // --------------------------------

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setError(
          "Customer ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await customersApi.getCustomerById(
            id
          );

        const data =
          response.data as CustomerDetailsResponse;

        setCustomer(data.customer);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(
          "Customer details error:",
          err
        );

        setError(
          "Unable to load customer details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // --------------------------------
  // Format currency
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
  // Format date/time
  // --------------------------------

  const formatDateTime = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // --------------------------------
  // Format status
  // --------------------------------

  const formatStatus = (
    status: string
  ) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  // --------------------------------
  // Status style
  // --------------------------------

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "ASSIGNED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "MECHANIC_ON_THE_WAY":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "IN_PROGRESS":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span className="text-sm">
            Loading customer details...
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error || !customer) {
    return (
      <div className="space-y-6">

        <button
          type="button"
          onClick={() =>
            navigate("/customers")
          }
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ArrowLeft size={17} />

          Back to Customers
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error ||
              "Customer data is unavailable."}
          </p>
        </div>

      </div>
    );
  }

  // --------------------------------
  // Calculate completed revenue
  // --------------------------------

  const completedRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status ===
          "COMPLETED"
      )
      .reduce(
        (total, booking) =>
          total + booking.amount,
        0
      );

  // --------------------------------
  // Page
  // --------------------------------

  return (
    <div className="space-y-6">

      {/* =========================
          Back
      ========================== */}

      <button
        type="button"
        onClick={() =>
          navigate("/customers")
        }
        className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft size={17} />

        Back to Customers
      </button>

      {/* =========================
          Customer Header
      ========================== */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-xl font-bold text-white">
              {customer.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {customer.name}
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Customer since{" "}
                {formatDate(
                  customer.createdAt
                )}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <a
              href={`tel:${customer.phone}`}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <Phone size={16} />

              Call
            </a>

            <a
              href={`mailto:${customer.email}`}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Mail size={16} />

              Email
            </a>

          </div>

        </div>

      </div>

      {/* =========================
          Statistics
      ========================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total bookings */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-zinc-500">
                Total Bookings
              </p>

              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {customer.totalBookings}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <ClipboardList
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

        {/* Completed revenue */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-zinc-500">
                Completed Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-zinc-900">
                {formatCurrency(
                  completedRevenue
                )}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <IndianRupee
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

        {/* Vehicles / bookings */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-zinc-500">
                Booking History
              </p>

              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {bookings.length}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <Car
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          Customer Information
      ========================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Contact information */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-zinc-900">
            Customer Information
          </h2>

          <div className="mt-5 divide-y divide-zinc-100">

            <div className="flex items-center justify-between gap-4 py-4">

              <div className="flex items-center gap-3">

                <Mail
                  size={17}
                  className="text-zinc-400"
                />

                <span className="text-sm text-zinc-500">
                  Email
                </span>

              </div>

              <span className="break-all text-right text-sm font-medium text-zinc-900">
                {customer.email}
              </span>

            </div>

            <div className="flex items-center justify-between gap-4 py-4">

              <div className="flex items-center gap-3">

                <Phone
                  size={17}
                  className="text-zinc-400"
                />

                <span className="text-sm text-zinc-500">
                  Phone
                </span>

              </div>

              <span className="text-sm font-medium text-zinc-900">
                {customer.phone}
              </span>

            </div>

            <div className="flex items-center justify-between gap-4 py-4">

              <div className="flex items-center gap-3">

                <MapPin
                  size={17}
                  className="text-zinc-400"
                />

                <span className="text-sm text-zinc-500">
                  Address
                </span>

              </div>

              <span className="max-w-[60%] text-right text-sm font-medium text-zinc-900">
                {customer.address}
              </span>

            </div>

            <div className="flex items-center justify-between gap-4 py-4">

              <div className="flex items-center gap-3">

                <CalendarDays
                  size={17}
                  className="text-zinc-400"
                />

                <span className="text-sm text-zinc-500">
                  Joined
                </span>

              </div>

              <span className="text-sm font-medium text-zinc-900">
                {formatDate(
                  customer.createdAt
                )}
              </span>

            </div>

          </div>

        </div>

        {/* Summary */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-zinc-900">
            Booking Summary
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-4">

            {[
              {
                label: "Total",
                value: bookings.length,
              },
              {
                label: "Completed",
                value: bookings.filter(
                  (booking) =>
                    booking.status ===
                    "COMPLETED"
                ).length,
              },
              {
                label: "Pending",
                value: bookings.filter(
                  (booking) =>
                    booking.status ===
                    "PENDING"
                ).length,
              },
              {
                label: "Cancelled",
                value: bookings.filter(
                  (booking) =>
                    booking.status ===
                    "CANCELLED"
                ).length,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <p className="text-sm text-zinc-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  {item.value}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =========================
          Booking History
      ========================== */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="border-b border-zinc-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-zinc-900">
            Booking History
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            All service bookings for this customer.
          </p>

        </div>

        {bookings.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <ClipboardList
              size={32}
              className="mx-auto text-zinc-300"
            />

            <p className="mt-3 font-medium text-zinc-700">
              No bookings found
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              This customer has no booking history.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="border-b border-zinc-200 bg-zinc-50">

                <tr>

                  <th className="px-6 py-4 font-semibold text-zinc-700">
                    Booking
                  </th>

                  <th className="px-6 py-4 font-semibold text-zinc-700">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 font-semibold text-zinc-700">
                    Service
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

              <tbody className="divide-y divide-zinc-100">

                {bookings.map(
                  (booking) => (

                    <tr
                      key={
                        booking._id
                      }
                      className="transition hover:bg-zinc-50"
                    >

                      <td className="px-6 py-4">

                        <p className="font-semibold text-zinc-900">
                          {booking.bookingId}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-zinc-900">
                          {booking.vehicle.make}{" "}
                          {booking.vehicle.model}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {
                            booking.vehicle
                              .registrationNumber
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-zinc-900">
                          {booking.service.name}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {
                            booking.service
                              .category
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4 font-medium text-zinc-900">
                        {formatCurrency(
                          booking.amount
                        )}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {formatStatus(
                            booking.status
                          )}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {formatDateTime(
                          booking.scheduledAt
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}