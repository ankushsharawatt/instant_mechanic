import {
  Bell,
  Search,
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200 bg-white/90 px-8 backdrop-blur">

      {/* =========================
          Left
      ========================== */}

      <div>
        <p className="text-sm text-zinc-500">
          Operations Dashboard
        </p>

        <h2 className="text-lg font-semibold text-zinc-900">
          Live Service Overview
        </h2>
      </div>

      {/* =========================
          Right
      ========================== */}

      <div className="flex items-center gap-3">

        {/* Search */}

        <button
          type="button"
          aria-label="Search"
          className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Search size={20} />
        </button>

        {/* Notifications */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Bell size={20} />

          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
            aria-label="Unread notifications"
          />
        </button>

        {/* Divider */}

        <div className="mx-1 h-8 w-px bg-zinc-200" />

        {/* Admin */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-medium text-zinc-900">
              Admin
            </p>

            <p className="text-xs text-zinc-500">
              Operations
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}