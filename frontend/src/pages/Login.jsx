import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/ApiConfig";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/users/login", formData);
      navigate("/group-chat"); 
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 md:px-16 bg-gradient-to-br from-indigo-100 to-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-indigo-600">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["username", "password"].map((field) => (
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

            <button
              type="submit"
              className="w-full bg-indigo-600 text-blue py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log In
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Right: Image (hidden on small screens) */}
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
