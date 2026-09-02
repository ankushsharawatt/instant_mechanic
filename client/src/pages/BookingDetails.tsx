import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Mail,
  Phone,
  User,
  Wrench,
  IndianRupee,
} from "lucide-react";

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
  createdAt?: string;
  updatedAt?: string;
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await bookingsApi.getBookingById(id);

        setBooking(response.data);
      } catch (err) {
        console.error(
          "Booking details error:",
          err
        );

        setError(
          "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-zinc-200" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft size={17} />
          Back to Bookings
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error ||
              "Booking was not found."}
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Helpers
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

  const formatStatus = (
    status: string
  ) => {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // --------------------------------
  // Status badge
  // --------------------------------

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "MECHANIC_ON_THE_WAY":
        return "bg-purple-100 text-purple-700";

      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-700";

      case "PENDING":
        return "bg-zinc-100 text-zinc-700";

      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  // --------------------------------
  // Page
  // --------------------------------

  return (
    <div className="space-y-6">

      {/* Back button */}

      <button
        type="button"
        onClick={() => navigate("/bookings")}
        className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft size={17} />
        Back to Bookings
      </button>

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm text-zinc-500">
            Booking Details
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            {booking.bookingId}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Created{" "}
            {booking.createdAt
              ? formatDateTime(
                  booking.createdAt
                )
              : "—"}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
            booking.status
          )}`}
        >
          {formatStatus(
            booking.status
          )}
        </span>
      </div>

      {/* Main information */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Customer */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <User
                size={19}
                className="text-zinc-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Customer
              </h2>

              <p className="text-sm text-zinc-500">
                Customer information
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-zinc-500">
                Name
              </p>

              <p className="mt-1 font-medium text-zinc-900">
                {booking.customer.name}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <Mail
                size={17}
                className="text-zinc-400"
              />

              <div>
                <p className="text-xs text-zinc-500">
                  Email
                </p>

                <p className="text-sm font-medium text-zinc-900">
                  {booking.customer.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <Phone
                size={17}
                className="text-zinc-400"
              />

              <div>
                <p className="text-xs text-zinc-500">
                  Phone
                </p>

                <p className="text-sm font-medium text-zinc-900">
                  {booking.customer.phone}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Vehicle */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <Car
                size={19}
                className="text-zinc-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Vehicle
              </h2>

              <p className="text-sm text-zinc-500">
                Vehicle information
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-zinc-500">
                Vehicle
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {booking.vehicle.make}{" "}
                {booking.vehicle.model}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Registration Number
              </p>

              <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">
                {booking.vehicle.registrationNumber}
              </p>
            </div>

          </div>
        </div>

        {/* Service */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <Wrench
                size={19}
                className="text-zinc-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Service
              </h2>

              <p className="text-sm text-zinc-500">
                Requested service
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-zinc-500">
                Service
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {booking.service.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Category
              </p>

              <p className="mt-1 text-sm text-zinc-700">
                {booking.service.category}
              </p>
            </div>

            <div className="flex items-center gap-2">

              <IndianRupee
                size={17}
                className="text-zinc-400"
              />

              <div>
                <p className="text-xs text-zinc-500">
                  Amount
                </p>

                <p className="text-lg font-bold text-zinc-900">
                  {formatCurrency(
                    booking.amount
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Mechanic */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <Wrench
                size={19}
                className="text-zinc-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Mechanic
              </h2>

              <p className="text-sm text-zinc-500">
                Assigned mechanic
              </p>
            </div>
          </div>

          {booking.mechanic ? (
            <div className="space-y-4">

              <div>
                <p className="text-xs text-zinc-500">
                  Name
                </p>

                <p className="mt-1 font-semibold text-zinc-900">
                  {booking.mechanic.name}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <Phone
                  size={17}
                  className="text-zinc-400"
                />

                <div>
                  <p className="text-xs text-zinc-500">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-zinc-900">
                    {booking.mechanic.phone}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Current Status
                </p>

                <span className="mt-1 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {formatStatus(
                    booking.mechanic.status
                  )}
                </span>
              </div>

            </div>
          ) : (
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-700">
                No mechanic assigned
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                This booking is waiting for mechanic assignment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
            <CalendarDays
              size={19}
              className="text-zinc-700"
            />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-900">
              Schedule
            </h2>

            <p className="text-sm text-zinc-500">
              Booking schedule
            </p>
          </div>
        </div>

        <div className="mt-5">

          <p className="text-xs text-zinc-500">
            Scheduled At
          </p>

          <p className="mt-1 text-lg font-semibold text-zinc-900">
            {formatDateTime(
              booking.scheduledAt
            )}
          </p>
        </div>
      </div>
    </div>
  );
}