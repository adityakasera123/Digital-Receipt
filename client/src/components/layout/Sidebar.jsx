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

function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const displayName = user?.displayName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-default bg-surface transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-default px-6">
          <h1 className="text-xl font-bold text-primary">
            Billvora
          </h1>
        </div>

        {/* Main Menu */}
        <div className="px-6 pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">
            Main
          </p>

          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              className={navItem}
              onClick={onClose}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>

            <NavLink
              to="/receipts"
              className={navItem}
              onClick={onClose}
            >
              <Receipt size={20} />
              Receipts
            </NavLink>

            <NavLink
              to="/upload"
              className={navItem}
              onClick={onClose}
            >
              <Upload size={20} />
              Upload Receipt
            </NavLink>

            <NavLink
              to="/warranty"
              className={navItem}
              onClick={onClose}
            >
              <ShieldCheck size={20} />
              Warranty
            </NavLink>

            <NavLink
              to="/analytics"
              className={navItem}
              onClick={onClose}
            >
              <ChartColumn size={20} />
              Analytics
            </NavLink>

            <NavLink
              to="/search"
              className={navItem}
              onClick={onClose}
            >
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
            <NavLink
              to="/settings"
              className={navItem}
              onClick={onClose}
            >
              <Settings size={20} />
              Settings
            </NavLink>

            <NavLink
              to="/help-center"
              className={navItem}
              onClick={onClose}
            >
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
    </>
  );
}

export default Sidebar;