import { Menu } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import GlobalSearch from '../search/GlobalSearch';

function Topbar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="flex h-16 lg:h-20 items-center border-b border-default bg-surface px-4 transition-theme lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="mr-3 shrink-0 rounded-lg p-2 text-primary transition-theme hover:bg-surface-hover lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      {/* Global Search */}
      <GlobalSearch />

      {/* Right Side Actions */}
      <div className="ml-3 flex shrink-0 items-center gap-2 lg:ml-8 lg:gap-4">
        {/* Notification Bell */}
        <NotificationBell />

        {/* User Card */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex shrink-0 items-center gap-3 rounded-2xl border border-default bg-surface p-2 text-left transition-theme hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:px-4 lg:py-2"
          aria-label="Open profile settings"
        >
          {/* Avatar */}
          <div className="button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold lg:h-11 lg:w-11">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Profile Details - Desktop Only */}
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-primary">
              {user?.displayName || 'User'}
            </p>

            <p className="text-xs text-secondary">
              Personal Plan
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Topbar;