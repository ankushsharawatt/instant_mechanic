import {
  Bell,
  Clock,
  Info,
  Save,
  Settings as SettingsIcon,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AppSettings {
  businessName: string;
  emailNotifications: boolean;
  bookingNotifications: boolean;
  autoRefresh: boolean;
  refreshInterval: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  businessName: "Instant Mechanic",
  emailNotifications: true,
  bookingNotifications: true,
  autoRefresh: true,
  refreshInterval: "30",
};

const SETTINGS_STORAGE_KEY =
  "instant-mechanic-settings";

export default function Settings() {
  const [businessName, setBusinessName] =
    useState(DEFAULT_SETTINGS.businessName);

  const [emailNotifications, setEmailNotifications] =
    useState(
      DEFAULT_SETTINGS.emailNotifications
    );

  const [bookingNotifications, setBookingNotifications] =
    useState(
      DEFAULT_SETTINGS.bookingNotifications
    );

  const [autoRefresh, setAutoRefresh] =
    useState(DEFAULT_SETTINGS.autoRefresh);

  const [refreshInterval, setRefreshInterval] =
    useState(DEFAULT_SETTINGS.refreshInterval);

  const [saved, setSaved] =
    useState(false);

  // --------------------------------
  // Load saved settings
  // --------------------------------

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

      if (!savedSettings) return;

      const parsed: Partial<AppSettings> =
        JSON.parse(savedSettings);

      setBusinessName(
        parsed.businessName ??
          DEFAULT_SETTINGS.businessName
      );

      setEmailNotifications(
        parsed.emailNotifications ??
          DEFAULT_SETTINGS.emailNotifications
      );

      setBookingNotifications(
        parsed.bookingNotifications ??
          DEFAULT_SETTINGS.bookingNotifications
      );

      setAutoRefresh(
        parsed.autoRefresh ??
          DEFAULT_SETTINGS.autoRefresh
      );

      setRefreshInterval(
        parsed.refreshInterval ??
          DEFAULT_SETTINGS.refreshInterval
      );
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    }
  }, []);

  // --------------------------------
  // Save settings
  // --------------------------------

  const handleSave = () => {
    const settings: AppSettings = {
      businessName:
        businessName.trim() ||
        DEFAULT_SETTINGS.businessName,

      emailNotifications,

      bookingNotifications,

      autoRefresh,

      refreshInterval,
    };

    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* =========================
          Header
      ========================== */}

      <div>
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <SettingsIcon size={21} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage dashboard and operations preferences.
            </p>
          </div>

        </div>
      </div>

      {/* =========================
          General
      ========================== */}

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="border-b border-zinc-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <Info
              size={19}
              className="text-zinc-500"
            />

            <div>
              <h2 className="font-semibold text-zinc-900">
                General
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Basic information about the operations dashboard.
              </p>
            </div>

          </div>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label
              htmlFor="businessName"
              className="text-sm font-medium text-zinc-700"
            >
              Business name
            </label>

            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />

            <p className="mt-1.5 text-xs text-zinc-500">
              Name displayed across the operations dashboard.
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          Operations
      ========================== */}

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="border-b border-zinc-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <Clock
              size={19}
              className="text-zinc-500"
            />

            <div>
              <h2 className="font-semibold text-zinc-900">
                Operations
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Configure dashboard data refresh behavior.
              </p>
            </div>

          </div>

        </div>

        <div className="divide-y divide-zinc-100">

          {/* Automatic refresh */}

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-zinc-900">
                Automatic refresh
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Automatically refresh dashboard information.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setAutoRefresh(
                  (current) => !current
                )
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                autoRefresh
                  ? "bg-zinc-900"
                  : "bg-zinc-300"
              }`}
              aria-label="Toggle automatic refresh"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  autoRefresh
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* Refresh interval */}

          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-zinc-900">
                Refresh interval
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                How often dashboard data should refresh.
              </p>
            </div>

            <select
              value={refreshInterval}
              onChange={(e) =>
                setRefreshInterval(
                  e.target.value
                )
              }
              disabled={!autoRefresh}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none focus:border-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
            >
              <option value="15">
                Every 15 seconds
              </option>

              <option value="30">
                Every 30 seconds
              </option>

              <option value="60">
                Every minute
              </option>

              <option value="300">
                Every 5 minutes
              </option>
            </select>

          </div>

        </div>

      </section>

      {/* =========================
          Notifications
      ========================== */}

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="border-b border-zinc-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <Bell
              size={19}
              className="text-zinc-500"
            />

            <div>
              <h2 className="font-semibold text-zinc-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Control operational notification preferences.
              </p>
            </div>

          </div>

        </div>

        <div className="divide-y divide-zinc-100">

          {/* Email notifications */}

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-zinc-900">
                Email notifications
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Receive important operational updates by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEmailNotifications(
                  (current) => !current
                )
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                emailNotifications
                  ? "bg-zinc-900"
                  : "bg-zinc-300"
              }`}
              aria-label="Toggle email notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  emailNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* Booking alerts */}

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-zinc-900">
                Booking alerts
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Get notified about important booking changes.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setBookingNotifications(
                  (current) => !current
                )
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                bookingNotifications
                  ? "bg-zinc-900"
                  : "bg-zinc-300"
              }`}
              aria-label="Toggle booking notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  bookingNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          System Information
      ========================== */}

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">

        <div className="border-b border-zinc-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <Shield
              size={19}
              className="text-zinc-500"
            />

            <div>
              <h2 className="font-semibold text-zinc-900">
                System Information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Application and environment information.
              </p>
            </div>

          </div>

        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">
              Application
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              Instant Mechanic Dashboard
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">
              Environment
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              Development
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">
              Frontend
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              React + Vite
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">
              Backend
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              Node.js + Express
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          Save
      ========================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

        {saved && (
          <p className="text-sm font-medium text-emerald-600">
            Settings saved successfully.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

    </div>
  );
}