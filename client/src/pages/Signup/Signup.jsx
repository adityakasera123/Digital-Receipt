import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-[380px] -mt-7">
      {/* Badge */}
      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        Create Account
      </span>

      {/* Heading */}
      <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
        Join Billvora
      </h1>

      <p className="mt-3 text-gray-500 leading-7">
        Create your account to securely manage receipts, invoices and
        warranties.
      </p>

      {/* Form */}
      <form className="mt-8 space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@example.com"
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-gray-300 px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-gray-300 px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1 accent-blue-600" />

          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Button */}
        <button
  type="submit"
  className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 active:scale-[0.99]"
>
  Create Account
</button>
      </form>

      {/* Login */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default Signup;