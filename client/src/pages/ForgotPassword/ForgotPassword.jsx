import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="w-full max-w-[380px]">
      {/* Logo */}
      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        Billvora
      </span>

      {/* Heading */}
      <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
        Forgot Password?
      </h1>

      {/* Description */}
      <p className="mt-3 leading-7 text-gray-500">
        Enter your email address and we'll send you a password reset link to get
        back into your account.
      </p>

      {/* Form */}
      <form className="mt-8 space-y-5">
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

        <button
          type="submit"
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 active:scale-[0.99]"
        >
          Send Reset Link
        </button>
      </form>

      {/* Back */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;