import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { UserContext } from "@/context/UserContext";
export default function Navbar() {
  const { user } = useUser(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);
  const linkClasses = (path) =>
    `pb-1 ${
      location.pathname === path
        ? "text-indigo-600 border-b-2 border-indigo-600 mx-2"
        : "text-gray-600 hover:text-indigo-600 mx-2"
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
    <nav className="bg-white border-b border-gray-200 shadow px-6 py-3 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600">CampusConnect</h1>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link to="/group-chat" className={linkClasses("/group-chat")}>
            Chat
          </Link>
          <Link to="/community" className={linkClasses("/community")}>
            Community
          </Link>
          <Link to={`/profile-page/${user._id}`} className={linkClasses(`/profile-page/${user._id}`)}>
            Profile
          </Link>
          <Link to="/notifications" className={linkClasses("/notifications")}>
            Notifications
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm font-medium">
          <Link to="/group-chat" className={linkClasses("/group-chat")} onClick={() => setMenuOpen(false)}>
            Chat
          </Link>
          <Link to="/community" className={linkClasses("/community")} onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link to="/profile" className={linkClasses("/profile")} onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/notifications" className={linkClasses("/notifications")} onClick={() => setMenuOpen(false)}>
            Notifications
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
