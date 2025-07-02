import { useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const res = await AxiosInstance.post("/users/resend-verification", { email });
      setMessage(res?.data?.message || "Verification email resent");
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend verification link");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Resend Verification</h2>

        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Resend Link
          </button>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
