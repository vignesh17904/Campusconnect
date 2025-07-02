import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AxiosInstance from "@/utils/ApiConfig";

export default function PrivateRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = resolved

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AxiosInstance.get("/users/get-user");
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div className="text-center mt-10">Checking Auth...</div>;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}