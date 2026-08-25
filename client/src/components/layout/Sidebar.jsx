import {
  LayoutDashboard,
  Receipt,
  Upload,
  ShieldCheck,
  ChartColumn,
  Search,
  MessageCircle,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItem = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
    isActive
      ? 'button-primary shadow-surface'
      : 'text-primary hover:bg-surface-hover'
  }`;

function Sidebar({ isOpen, onClose }) {
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
       <div className="flex-1 overflow-y-auto px-6 pt-6">
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

            {/* Ask Billvora */}
            <NavLink
              to="/ask-billvora"
              className={navItem}
              onClick={onClose}
            >
              <MessageCircle size={20} />
              Ask Billvora
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

          {/* Support */}
          <div className="mt-6">
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
        </div>
      </aside>
    </>
  );
}

export default Sidebar;