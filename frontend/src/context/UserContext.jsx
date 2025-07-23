import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/ApiConfig";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/get-user");
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasAuthCookie = document.cookie.includes("refreshToken");

    // 👇 Only try fetching user if token cookie exists
    if (hasAuthCookie) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
