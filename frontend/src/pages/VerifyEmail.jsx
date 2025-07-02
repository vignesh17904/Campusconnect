import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/ApiConfig";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await AxiosInstance.post("/users/verify-email", { token, email });
        setStatus("Email verified successfully!");
        setVerified(true);
        setTimeout(() => navigate("/login"), 3000); // redirect to login
      } catch (error) {
        setStatus(error.response?.data?.message || "Verification failed.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-100 to-blue-100">
      <div className="bg-white p-8 rounded shadow text-center space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-indigo-700">Email Verification</h2>
        <p className="text-gray-600">{status}</p>
        {verified && (
          <p className="text-green-600 text-sm">
            Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  );
}
