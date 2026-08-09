import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className='flex h-screen bg-app text-primary transition-theme'>
      {/* Sidebar */}
     <Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
      {/* Right Section */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto bg-app px-10 py-8 transition-theme'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;