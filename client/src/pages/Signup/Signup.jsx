import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
createUserWithEmailAndPassword,
updateProfile,
} from "firebase/auth";
import {
doc,
setDoc,
serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
import toast from "react-hot-toast";

function Signup() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);

const [errors, setErrors] = useState({
fullName: "",
email: "",
password: "",
confirmPassword: "",
});

const navigate = useNavigate();

const validateForm = () => {
const newErrors = {
fullName: "",
email: "",
password: "",
confirmPassword: "",
};


if (!fullName.trim()) {
  newErrors.fullName = "Full name is required.";
} else if (fullName.trim().length < 3) {
  newErrors.fullName = "Full name must be at least 3 characters.";
}

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
} else if (password.length < 6) {
  newErrors.password = "Password must be at least 6 characters.";
}

if (password !== confirmPassword) {
  newErrors.confirmPassword = "Passwords do not match.";
}

setErrors(newErrors);

return Object.values(newErrors).every((error) => error === "");


};

const handleSubmit = async (e) => {
e.preventDefault();


if (!validateForm()) return;

try {
  setLoading(true);

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  await setDoc(doc(db, "users", userCredential.user.uid), {
    profile: {
      displayName: fullName,
      email: userCredential.user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  });

  toast.success("Account created successfully!");

  navigate("/login");
} catch (error) {
  if (error.code === "auth/email-already-in-use") {
    toast.error("Email already exists.");
  } else if (error.code === "auth/weak-password") {
    toast.error("Password is too weak.");
  } else if (error.code === "auth/invalid-email") {
    toast.error("Invalid email.");
  } else {
    toast.error("Something went wrong.");
  }

  console.log(error);
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6"> <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"> <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
Create Account </div>


    <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
      Join Billvora
    </h1>

    <p className="mt-3 text-gray-500 leading-7">
      Create your account to securely manage receipts, invoices and
      warranties.
    </p>

    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Full Name
        </label>

        <input
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);

            if (errors.fullName) {
              setErrors((prev) => ({
                ...prev,
                fullName: "",
              }));
            }
          }}
          className={`h-11 w-full rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
            errors.fullName
              ? "border border-red-500 focus:border-red-500"
              : "border border-gray-300 focus:border-blue-600"
          }`}
        />

        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <input
          type="email"
          placeholder="name@example.com"
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
          className={`h-11 w-full rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
            errors.email
              ? "border border-red-500 focus:border-red-500"
              : "border border-gray-300 focus:border-blue-600"
          }`}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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
            className={`h-11 w-full rounded-xl px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
              errors.password
                ? "border border-red-500 focus:border-red-500"
                : "border border-gray-300 focus:border-blue-600"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);

              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }
            }}
            className={`h-11 w-full rounded-xl px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
              errors.confirmPassword
                ? "border border-red-500 focus:border-red-500"
                : "border border-gray-300 focus:border-blue-600"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input type="checkbox" className="mt-1 accent-blue-600" />

        <span>
          I agree to the{' '}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-gray-500">
      Already have an account?{' '}
      <Link
        to="/login"
        className="font-semibold text-blue-600 hover:underline"
      >
        Sign In
      </Link>
    </p>
  </div>
</div>


);
}

export default Signup;
