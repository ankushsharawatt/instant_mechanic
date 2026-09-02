import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  DollarSign,
  Users,
  XCircle,
  CalendarDays,
  Wrench,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import { dashboardApi } from "../services/api";
import { socket } from "../services/socket";

import type { DashboardStats } from "../types";
import BookingsChart from "../components/dashboard/BookingsChart"
import RevenueChart from "../components/dashboard/RevenueChart"
import StatusChart from "../components/dashboard/StatusChart"
import ServiceChart from "../components/dashboard/ServiceChart"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(
  null
);

interface BookingData {
  date: string;
  bookings: number;
}

interface ServiceData {
  category: string;
  bookings: number;
  revenue: number;
}

const [bookingsData, setBookingsData] = useState<BookingData[]>(
  []
);

  const [revenueData, setRevenueData] = useState<
    { date: string; revenue: number }[]
  >([]);

  const [statusData, setStatusData] = useState<
    { status: string; count: number }[]
  >([]);

  const [serviceData, setServiceData] =
    useState<ServiceData[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
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
        console.log("BOOKINGS API:", bookingsResponse.data);
        setBookingsData(bookingsResponse.data);
        console.log("REVENUE API:", revenueResponse.data);
        setRevenueData(revenueResponse.data);
        setStatusData(statusResponse.data);
        setServiceData(serviceResponse.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-zinc-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Something went wrong
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error || "Dashboard data is unavailable."}
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Page heading */}

      <div>
        <p className="text-sm font-medium text-zinc-500">
          Tuesday, September 1
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          Operations Overview
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Monitor bookings, mechanics, customers and revenue
          in real time.
        </p>
      </div>

      {/* KPI Cards */}

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
          value={formatCurrency(stats.totalRevenue)}
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

      {/* Analytics placeholder */}

      <div className="grid gap-6 lg:grid-cols-2">
        <BookingsChart data={bookingsData} />

        <RevenueChart data={revenueData} />

        <StatusChart data={statusData} />

        <ServiceChart data={serviceData} />
      </div>
    </div>
  );
}