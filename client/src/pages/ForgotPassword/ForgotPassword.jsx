import { Link } from "react-router-dom";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import toast from "react-hot-toast";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error("Please enter your email.");
    return;
  }

  try {
    setLoading(true);

    await sendPasswordResetEmail(auth, email);

    toast.success("Password reset link sent! Check your email.");

    setEmail("");

  } catch (error) {
    console.log(error);

    if (error.code === "auth/user-not-found") {
      toast.error("No account found with this email.");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Please enter a valid email.");
    } else {
      toast.error("Something went wrong.");
    }

  } finally {
    setLoading(false);
  }
};
const [loading, setLoading] = useState(false);
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
     <form
  onSubmit={handleSubmit}
  className="mt-8 space-y-5"
>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@example.com"
            value={email}
onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600"
          />
        </div>

       <button
  type="submit"
  disabled={loading}
  className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 active:scale-[0.99]"
>
  {loading ? "Sending..." : "Send Reset Link"}
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