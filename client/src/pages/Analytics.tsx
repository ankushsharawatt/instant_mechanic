import { useEffect, useState } from "react";
import BookingsChart from "../components/dashboard/BookingsChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import StatusChart from "../components/dashboard/StatusChart";
import ServiceChart from "../components/dashboard/ServiceChart";
import { dashboardApi } from "../services/api";

interface BookingData {
  date: string;
  bookings: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface StatusData {
  status: string;
  count: number;
}

interface ServiceData {
  category: string;
  bookings: number;
  revenue: number;
}

export default function Analytics() {
  const [bookingsData, setBookingsData] =
    useState<BookingData[]>([]);

  const [revenueData, setRevenueData] =
    useState<RevenueData[]>([]);

  const [statusData, setStatusData] =
    useState<StatusData[]>([]);

  const [serviceData, setServiceData] =
    useState<ServiceData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          bookingsResponse,
          revenueResponse,
          statusResponse,
          serviceResponse,
        ] = await Promise.all([
          dashboardApi.getBookingsOverTime(),
          dashboardApi.getRevenueOverTime(),
          dashboardApi.getBookingStatus(),
          dashboardApi.getServiceBreakdown(),
        ]);

        if (cancelled) return;

        setBookingsData(
          bookingsResponse.data
        );

        setRevenueData(
          revenueResponse.data
        );

        setStatusData(
          statusResponse.data
        );

        setServiceData(
          serviceResponse.data
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Analytics fetch error:",
          err
        );

        setError(
          "Unable to load analytics data."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Analytics unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <p className="text-sm font-medium text-zinc-500">
          Performance & Insights
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Analyze bookings, revenue, booking status,
          and service performance.
        </p>
      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <BookingsChart
          data={bookingsData}
        />

        <RevenueChart
          data={revenueData}
        />

        <StatusChart
          data={statusData}
        />

        <ServiceChart
          data={serviceData}
        />

      </div>

    </div>
  );
}