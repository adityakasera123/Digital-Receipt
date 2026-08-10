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
import { NavLink } from 'react-router-dom';

const navItem = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
    isActive
      ? 'button-primary shadow-surface'
      : 'text-primary hover:bg-surface-hover'
  }`;

function Sidebar() {
  return (
    <aside className='flex h-screen w-72 flex-col border-r border-default bg-surface transition-theme'>
      {/* Logo */}
      <div className='flex h-20 items-center border-b border-default px-8'>
        <h1 className='text-2xl font-bold text-primary'>Billvora</h1>
      </div>

      {/* Main Menu */}
      <div className='px-6 pt-8'>
        <p className='mb-4 text-xs font-semibold uppercase tracking-wider text-secondary'>
          Main
        </p>

        <nav className='space-y-2'>
          <NavLink to='/dashboard' className={navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to='/receipts' className={navItem}>
            <Receipt size={20} />
            Receipts
          </NavLink>

          <NavLink to='/upload' className={navItem}>
            <Upload size={20} />
            Upload Receipt
          </NavLink>

          <NavLink to='/warranty' className={navItem}>
            <ShieldCheck size={20} />
            Warranty
          </NavLink>

          <NavLink to='/analytics' className={navItem}>
            <ChartColumn size={20} />
            Analytics
          </NavLink>

          <NavLink to='/search' className={navItem}>
            <Search size={20} />
            Search
          </NavLink>
        </nav>
      </div>

      {/* Support */}
      <div className='mt-10 px-6'>
        <p className='mb-4 text-xs font-semibold uppercase tracking-wider text-secondary'>
          Support
        </p>

        <nav className='space-y-2'>
          <NavLink to='/settings' className={navItem}>
            <Settings size={20} />
            Settings
          </NavLink>

          <NavLink to='/help-center' className={navItem}>
            <CircleHelp size={20} />
            Help Center
          </NavLink>
        </nav>
      </div>

      {/* User Card */}
      <div className='mt-auto border-t border-default p-6'>
        <div className='flex items-center gap-3'>
          <div className='button-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold'>
            A
          </div>

          <div>
            <h3 className='font-semibold text-primary'>Aditya</h3>
            <p className='text-sm text-secondary'>Personal Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;