import { useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";
import { useNavigate } from "react-router-dom";

const branches = ["CSE", "ECE", "EEE", "MECH"];

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    branch: "",
    year: "",
    rollNumber: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/users/signup", {
        ...formData,
        role: "user",
      });
      setMessage("Verification email sent. Please check your inbox.");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Sign Up form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 md:px-16 bg-gradient-to-br from-indigo-100 to-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["fullName", "username", "email", "password", "rollNumber"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}

            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-dark py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}
          </form>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      {/* Right: Image section (only on medium+ screens) */}
      <div className="hidden md:block w-1/2 h-screen">
        <img
          src="/login-bg.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
