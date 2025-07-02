import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/utils/ApiConfig"; 

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const res = await axios.post("/auth/verify-email", { token });
        setMessage(res.data.message || "Email verified successfully!");
        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message || "Email verification failed.";
        setMessage(errorMsg);
        setSuccess(false);
      }
    };

    if (token) {
      verifyUserEmail();
    } else {
      setMessage("Invalid verification link");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className={`text-2xl font-semibold mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
          {success ? "✅ Verified" : "❌ Failed"}
        </h1>
        <p className="text-gray-700">{message}</p>
        {success && (
          <p className="text-sm mt-2 text-gray-500">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}
