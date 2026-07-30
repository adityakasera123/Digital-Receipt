import {
  LayoutDashboard,
  Receipt,
  Upload,
  ShieldCheck,
  ChartColumn,
  Search,
  Settings,
  CircleHelp,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-72 h-screen border-r border-gray-200 bg-white flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Billvora
        </h1>
      </div>

      {/* Main Menu */}
      <div className="px-6 pt-8">

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Main
        </p>

        <nav className="space-y-2">

          <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
      isActive
        ? "bg-black text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`
  }
>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/receipts"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Receipt size={20} />
            Receipts
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
      isActive
        ? "bg-black text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    }`
  }
          >
            <Upload size={20} />
            Upload Receipt
          </NavLink>

          <NavLink
            to="/warranty"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <ShieldCheck size={20} />
            Warranty
          </NavLink>

          <NavLink
            to="/analytics"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <ChartColumn size={20} />
            Analytics
          </NavLink>

          <NavLink
            to="/search"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Search size={20} />
            Search
          </NavLink>

        </nav>

      </div>

      {/* Support */}
      <div className="mt-10 px-6">

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Support
        </p>

        <nav className="space-y-2">

          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Settings size={20} />
            Settings
          </NavLink>

          <NavLink
            to="/help-center"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <CircleHelp size={20} />
            Help Center
          </NavLink>

        </nav>

      </div>

      {/* User Card */}
      <div className="mt-auto border-t border-gray-200 p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-semibold">
            A
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Aditya
            </h3>

            <p className="text-sm text-gray-500">
              Personal Plan
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;