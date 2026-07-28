import { Link } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
    const { user, loading } = useContext(AuthContext);

console.log("Loading:", loading);
console.log("Current User:", user);
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg p-10 text-center">

        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-900">
          Dashboard Coming Soon
        </h1>

        <p className="mt-4 text-gray-600 leading-7">
          You're successfully inside the Billvora application.
          Soon you'll be able to manage receipts, warranties,
          analytics and AI insights from here.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Dashboard;