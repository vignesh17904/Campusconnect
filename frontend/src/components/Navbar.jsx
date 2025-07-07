import { Link, useLocation, useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/ApiConfig";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkClasses = (path) =>
    `pb-1 ${
      location.pathname === path
        ? "text-indigo-600 border-b-2 border-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/users/logout"); // token cleared in backend
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center border-b border-gray-200 w-full">
      <h1 className="text-2xl font-bold text-indigo-600">CampusConnect</h1>
      <div className="flex gap-6 text-sm font-medium items-center">
        <Link to="/group-chat" className={linkClasses("/group-chat")}>
          Chat
        </Link>
        <Link to="/community" className={linkClasses("/community")}>
          Community
        </Link>
        <Link to="/profile" className={linkClasses("/profile")}>
          Profile
        </Link>
        <Link to="/notifications" className={linkClasses("/notifications")}>
          Notifications
        </Link>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
