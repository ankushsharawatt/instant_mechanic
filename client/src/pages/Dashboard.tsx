import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  DollarSign,
  Users,
  XCircle,
  CalendarDays,
  Wrench,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import BookingsChart from "../components/dashboard/BookingsChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import StatusChart from "../components/dashboard/StatusChart";
import ServiceChart from "../components/dashboard/ServiceChart";

import { dashboardApi } from "../services/api";


import type { DashboardStats } from "../types";

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

interface AppSettings {
  autoRefresh: boolean;
  refreshInterval: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoRefresh: true,
  refreshInterval: "30",
};

const SETTINGS_STORAGE_KEY = "instant-mechanic-settings";

export default function Dashboard() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

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

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  // --------------------------------
  // Fetch dashboard data
  // --------------------------------

  const fetchDashboardData = useCallback(
    async (isBackgroundRefresh = false) => {
      try {
        if (isBackgroundRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const [
          statsResponse,
          bookingsResponse,
          revenueResponse,
          statusResponse,
          serviceResponse,
        ] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getBookingsOverTime(),
          dashboardApi.getRevenueOverTime(),
          dashboardApi.getBookingStatus(),
          dashboardApi.getServiceBreakdown(),
        ]);

        setStats(statsResponse.data);
        setBookingsData(bookingsResponse.data);
        setRevenueData(revenueResponse.data);
        setStatusData(statusResponse.data);
        setServiceData(serviceResponse.data);

        setLastUpdated(new Date());
      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // --------------------------------
  // Initial dashboard fetch
  // --------------------------------

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --------------------------------
  // Automatic refresh
  // --------------------------------

  useEffect(() => {
    let interval:
      | ReturnType<typeof setInterval>
      | null = null;

    try {
      const savedSettings =
        localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

      let settings: AppSettings =
        DEFAULT_SETTINGS;

      if (savedSettings) {
        const parsed: Partial<AppSettings> =
          JSON.parse(savedSettings);

        settings = {
          autoRefresh:
            parsed.autoRefresh ??
            DEFAULT_SETTINGS.autoRefresh,

          refreshInterval:
            parsed.refreshInterval ??
            DEFAULT_SETTINGS.refreshInterval,
        };
      }

      const refreshInterval = Number(
        settings.refreshInterval
      );

      if (
        settings.autoRefresh &&
        refreshInterval > 0
      ) {
        interval = setInterval(() => {
          fetchDashboardData(true);
        }, refreshInterval * 1000);
      }
    } catch (err) {
      console.error(
        "Failed to read dashboard settings:",
        err
      );
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchDashboardData]);

  // --------------------------------
  // Currency formatter
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
  // Last updated formatter
  // --------------------------------

  const formatLastUpdated = (
    date: Date
  ) => {
    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
  };

  // --------------------------------
  // Loading state
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />

          <div className="mt-3 h-9 w-72 animate-pulse rounded bg-zinc-200" />

          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-zinc-200"
              />
            )
          )}
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

  // --------------------------------
  // Error state
  // --------------------------------

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Something went wrong
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error ||
            "Dashboard data is unavailable."}
        </p>

        <button
          type="button"
          onClick={() =>
            fetchDashboardData()
          }
          disabled={refreshing}
          className="mt-4 flex items-center gap-2 rounded-xl bg-red-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Try Again
        </button>
      </div>
    );
  }

  // --------------------------------
  // Dashboard
  // --------------------------------

  return (
    <div className="space-y-8">
      {/* Page heading */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Operations Overview
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Monitor bookings, mechanics,
            customers and revenue in real time.
          </p>
        </div>

        {/* Refresh controls */}

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="hidden text-right sm:block">
              <p className="text-xs text-zinc-400">
                Last updated
              </p>

              <p className="text-sm font-medium text-zinc-600">
                {formatLastUpdated(
                  lastUpdated
                )}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              fetchDashboardData(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </div>

      {/* Mobile last updated */}

      {lastUpdated && (
        <div className="sm:hidden">
          <p className="text-xs text-zinc-400">
            Last updated
          </p>

          <p className="text-sm font-medium text-zinc-600">
            {formatLastUpdated(
              lastUpdated
            )}
          </p>
        </div>
      )}

      {/* KPI cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={CalendarDays}
          description="All-time bookings"
        />

        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          icon={Activity}
          description="Scheduled today"
        />

        <StatCard
          title="Completed"
          value={stats.completedBookings}
          icon={CheckCircle2}
          description="Successfully completed"
        />

        <StatCard
          title="Pending"
          value={stats.pendingBookings}
          icon={Clock3}
          description="Awaiting action"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelledBookings}
          icon={XCircle}
          description="Cancelled bookings"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            stats.totalRevenue
          )}
          icon={DollarSign}
          description="From completed bookings"
        />

        <StatCard
          title="Active Mechanics"
          value={stats.activeMechanics}
          icon={Wrench}
          description="Currently operational"
        />

        <StatCard
          title="New Customers"
          value={stats.newCustomers}
          icon={Users}
          description="Last 30 days"
        />
      </div>

      {/* Analytics charts */}

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