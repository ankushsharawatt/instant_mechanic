import {
  BarChart3,
  Car,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: ClipboardList,
  },
  {
    name: "Mechanics",
    path: "/mechanics",
    icon: Wrench,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
        border-r border-zinc-200 bg-white
        transition-transform duration-300 ease-in-out
        md:z-40 md:translate-x-0
        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      {/* Logo */}

      <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-6">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Car size={20} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-zinc-900">
              Instant Mechanic
            </h1>

            <p className="text-xs text-zinc-500">
              Operations
            </p>
          </div>

        </div>

        {/* Mobile close button */}

        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 md:hidden"
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <Icon size={19} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Settings */}

      <div className="border-t border-zinc-200 p-4">
        <NavLink
          to="/settings"
          onClick={onMobileClose}
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`
          }
        >
          <Settings size={19} />

          <span>
            Settings
          </span>
        </NavLink>
      </div>
    </aside>
  );
}