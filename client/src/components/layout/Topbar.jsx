import { Search } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Topbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearch("");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Search */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipts..."
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
        </div>
      </form>

      {/* Right Side */}
      <div className="ml-8 flex items-center gap-4">
        {/* Notification Bell */}
        <NotificationBell />

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
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