import {
  LayoutDashboard,
  Receipt,
  Upload,
  ShieldCheck,
  ChartColumn,
  Search,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

const navItem = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
    isActive
      ? 'button-primary shadow-surface'
      : 'text-primary hover:bg-surface-hover'
  }`;

function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const displayName = user?.displayName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-default bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-default px-6">
        <h1 className="text-xl font-bold text-primary">Billvora</h1>
      </div>

      {/* Main Menu */}
      <div className="px-6 pt-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
          Main
        </p>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/receipts" className={navItem}>
            <Receipt size={20} />
            Receipts
          </NavLink>

          <NavLink to="/upload" className={navItem}>
            <Upload size={20} />
            Upload Receipt
          </NavLink>

          <NavLink to="/warranty" className={navItem}>
            <ShieldCheck size={20} />
            Warranty
          </NavLink>

          <NavLink to="/analytics" className={navItem}>
            <ChartColumn size={20} />
            Analytics
          </NavLink>

          <NavLink to="/search" className={navItem}>
            <Search size={20} />
            Search
          </NavLink>
        </nav>
      </div>

      {/* Support */}
      <div className="mt-10 px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
          Support
        </p>

        <nav className="space-y-2">
          <NavLink to="/settings" className={navItem}>
            <Settings size={20} />
            Settings
          </NavLink>

          <NavLink to="/help-center" className={navItem}>
            <CircleHelp size={20} />
            Help Center
          </NavLink>
        </nav>
      </div>

      {/* User Card */}
      <div
        onClick={() => navigate('/settings')}
        className="mt-auto cursor-pointer border-t border-default p-6 transition-all hover:bg-surface-hover"
      >
        <div className="flex items-center gap-3">
          <div className="button-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold">
            {initial}
          </div>

          <div>
            <h3 className="font-semibold text-primary">
              {displayName}
            </h3>

            <p className="text-sm text-secondary">
              Personal Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;