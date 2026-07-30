import { Bell, Search } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

      {/* Search */}
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

        <Search size={18} className="text-gray-400" />
<input
  type="text"
  placeholder="Search receipts..."
  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
/>

      </div>

      {/* Right Side */}
      <div className="ml-8 flex items-center gap-4">

        {/* Notification */}
        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition">
          <Bell size={20} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
            {user?.displayName?.charAt(0) || "U"}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.displayName || "User"}
            </p>

            <p className="text-xs text-gray-500">
              Personal Plan
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;