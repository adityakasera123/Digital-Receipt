import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthHeader from "../../components/auth/AuthHeader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-md">
      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Sign in to securely manage your receipts, warranties and purchase history."
      />

      <form className="mt-10 space-y-6">

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
               type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

           <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 accent-blue-600"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Continue */}
        <button
          className="h-14 w-full rounded-2xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0"
        >
          Continue
        </button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute left-0 top-1/2 w-full border-t border-slate-200"></div>

          <span className="relative mx-auto block w-fit bg-white px-4 text-sm text-slate-400">
            OR
          </span>
        </div>

        {/* Google */}
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white font-medium text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-slate-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />

          Continue with Google
        </button>

        {/* Signup */}
        <p className="pt-2 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;