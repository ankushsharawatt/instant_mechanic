import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Wrench,
  MapPin,
  CalendarDays,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { mechanicsApi } from "../services/api";

interface CurrentBooking {
  _id: string;
  bookingId: string;
  status: string;
  amount?: number;
  scheduledAt?: string;
}

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
  currentBooking?: CurrentBooking | null;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export default function MechanicDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [mechanic, setMechanic] =
    useState<Mechanic | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // --------------------------------
  // Fetch mechanic
  // --------------------------------

  useEffect(() => {
    const fetchMechanic = async () => {
      if (!id) {
        setError("Mechanic ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await mechanicsApi.getMechanicById(id);

        setMechanic(response.data);
      } catch (err) {
        console.error(
          "Mechanic details error:",
          err
        );

        setError(
          "Unable to load mechanic details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMechanic();
  }, [id]);

  // --------------------------------
  // Status styles
  // --------------------------------

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "BUSY":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "ON_THE_WAY":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "OFFLINE":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";

      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
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
        (char) => char.toUpperCase()
      );
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
            Loading mechanic details...
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error || !mechanic) {
    return (
      <div className="space-y-6">

        <button
          type="button"
          onClick={() =>
            navigate("/mechanics")
          }
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ArrowLeft size={17} />

          Back to Mechanics
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error ||
              "Mechanic data is unavailable."}
          </p>
        </div>

      </div>
    );
  }

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
          navigate("/mechanics")
        }
        className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
      >
        <ArrowLeft size={17} />

        Back to Mechanics
      </button>

      {/* =========================
          Header
      ========================== */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-xl font-bold text-white">
              {mechanic.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {mechanic.name}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <Phone size={15} />

                {mechanic.phone}
              </div>

            </div>

          </div>

          {/* Status */}

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(
              mechanic.status
            )}`}
          >
            {formatStatus(
              mechanic.status
            )}
          </span>

        </div>

      </div>

      {/* =========================
          Statistics
      ========================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Jobs */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Jobs Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {mechanic.jobsCompleted}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <ClipboardCheck
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

        {/* Current booking */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Current Booking
              </p>

              <p className="mt-2 text-lg font-bold text-zinc-900">
                {mechanic.currentBooking
                  ?.bookingId ||
                  "No active booking"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <Wrench
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

        {/* Joined */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-zinc-500">
                Joined
              </p>

              <p className="mt-2 text-lg font-bold text-zinc-900">
                {formatDate(
                  mechanic.createdAt
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <CalendarDays
                size={21}
                className="text-zinc-700"
              />
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          Details
      ========================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Mechanic information */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-zinc-900">
            Mechanic Information
          </h2>

          <div className="mt-5 divide-y divide-zinc-100">

            <div className="flex items-center justify-between py-4">

              <span className="text-sm text-zinc-500">
                Full Name
              </span>

              <span className="text-sm font-medium text-zinc-900">
                {mechanic.name}
              </span>

            </div>

            <div className="flex items-center justify-between py-4">

              <span className="text-sm text-zinc-500">
                Phone
              </span>

              <span className="text-sm font-medium text-zinc-900">
                {mechanic.phone}
              </span>

            </div>

            <div className="flex items-center justify-between py-4">

              <span className="text-sm text-zinc-500">
                Status
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                  mechanic.status
                )}`}
              >
                {formatStatus(
                  mechanic.status
                )}
              </span>

            </div>

            <div className="flex items-center justify-between py-4">

              <span className="text-sm text-zinc-500">
                Jobs Completed
              </span>

              <span className="text-sm font-semibold text-zinc-900">
                {mechanic.jobsCompleted}
              </span>

            </div>

            <div className="flex items-center justify-between py-4">

              <span className="text-sm text-zinc-500">
                Joined Date
              </span>

              <span className="text-sm font-medium text-zinc-900">
                {formatDate(
                  mechanic.createdAt
                )}
              </span>

            </div>

          </div>

        </div>

        {/* Location */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <MapPin
                size={20}
                className="text-zinc-700"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Current Location
              </h2>

              <p className="text-sm text-zinc-500">
                Mechanic GPS coordinates
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-xl bg-zinc-50 p-5">

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Latitude
                </p>

                <p className="mt-2 font-mono text-sm font-semibold text-zinc-900">
                  {mechanic.location.lat.toFixed(
                    6
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Longitude
                </p>

                <p className="mt-2 font-mono text-sm font-semibold text-zinc-900">
                  {mechanic.location.lng.toFixed(
                    6
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          Current Booking
      ========================== */}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-zinc-900">
          Current Booking
        </h2>

        {mechanic.currentBooking ? (

          <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Booking ID
                </p>

                <p className="mt-1 text-lg font-bold text-zinc-900">
                  {
                    mechanic
                      .currentBooking
                      .bookingId
                  }
                </p>

              </div>

              <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {formatStatus(
                  mechanic
                    .currentBooking
                    .status
                )}
              </span>

            </div>

            {mechanic.currentBooking
              .amount !== undefined && (
              <div className="mt-4">

                <p className="text-xs text-zinc-500">
                  Amount
                </p>

                <p className="mt-1 font-semibold text-zinc-900">
                  ₹
                  {mechanic.currentBooking.amount.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>
            )}

            {mechanic.currentBooking
              .scheduledAt && (
              <div className="mt-4">

                <p className="text-xs text-zinc-500">
                  Scheduled
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {formatDateTime(
                    mechanic.currentBooking
                      .scheduledAt
                  )}
                </p>

              </div>
            )}

          </div>

        ) : (

          <div className="mt-5 rounded-xl border border-dashed border-zinc-300 p-8 text-center">

            <Wrench
              size={28}
              className="mx-auto text-zinc-300"
            />

            <p className="mt-3 font-medium text-zinc-700">
              No active booking
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              This mechanic currently has no
              assigned booking.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}