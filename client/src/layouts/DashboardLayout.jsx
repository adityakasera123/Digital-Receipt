import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] px-10 py-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;