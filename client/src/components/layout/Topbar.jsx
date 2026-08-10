import { Search } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

function Topbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate('/search');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearch('');
  };

  return (
    <header className='flex h-20 items-center justify-between border-b border-default bg-surface px-8 transition-theme'>
      {/* Search */}
      <form onSubmit={handleSubmit} className='flex-1'>
        <div className='input-surface flex w-full max-w-xl items-center gap-3 rounded-2xl px-4 py-3 transition-theme'>
          <Search className='h-5 w-5 text-secondary' />

          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search receipts...'
            className='w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary'
          />
        </div>
      </form>

      {/* Right Side */}
      <div className='ml-8 flex items-center gap-4'>
        {/* Notification Bell */}
        <NotificationBell />

        {/* User */}
        <div className='flex items-center gap-3 rounded-xl border border-default bg-surface px-3 py-2 transition-theme'>
          <div className='button-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold'>
            {user?.displayName?.charAt(0) || 'U'}
          </div>

          <div>
            <p className='text-sm font-semibold text-primary'>
              {user?.displayName || 'User'}
            </p>

            <p className='text-xs text-secondary'>Personal Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;