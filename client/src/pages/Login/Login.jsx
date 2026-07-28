import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthHeader from "../../components/auth/AuthHeader";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

const [errors, setErrors] = useState({
  email: "",
  password: "",
});

const navigate = useNavigate();
  const validateForm = () => {
  const newErrors = {
    email: "",
    password: "",
  };

  if (!email.trim()) {
    newErrors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  }

  if (!password.trim()) {
    newErrors.password = "Password is required.";
  }

  setErrors(newErrors);

  return Object.values(newErrors).every((error) => error === "");
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password);

    toast.success("Login successful!");

    navigate("/dashboard");
  } catch (error) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      toast.error("Invalid email or password.");
    } else {
      toast.error("Something went wrong.");
    }

    console.log(error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="w-full max-w-md -mt-4">
      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Sign in to securely manage your receipts, warranties and purchase history."
      />

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">

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
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }}
  placeholder="Enter your email"
  className={`h-14 w-full rounded-2xl bg-white pl-12 pr-4 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 ${
    errors.email
      ? "border border-red-500 focus:border-red-500"
      : "border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
  }`}
/>
          </div>
          {errors.email && (
    <p className="mt-2 text-sm text-red-500">
      {errors.email}
    </p>
  )}
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
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }}
  placeholder="Enter your password"
  className={`h-14 w-full rounded-2xl bg-white pl-12 pr-12 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 ${
    errors.password
      ? "border border-red-500 focus:border-red-500"
      : "border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
  }`}
/>

           <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
          </div>
          {errors.password && (
  <p className="mt-2 text-sm text-red-500">
    {errors.password}
  </p>
)}
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
  type="submit"
  disabled={loading}
  className="h-14 w-full rounded-2xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
>
  {loading ? "Signing In..." : "Continue"}
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