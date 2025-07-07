import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "@/utils/ApiConfig";
import Navbar from "../components/Navbar";
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await AxiosInstance.get("/users/get-user");
      setNotifications(data?.data?.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAction = async (groupId, userId, action) => {
    try {
      await AxiosInstance.post("/groups/handle-request", {
        groupId,
        userId,
        action,
      });
      await fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  return (
    <>
      {/* Navbar
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600">CampusConnect</h1>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/chat-group" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Chat</Link>
          <Link to="/community" className="text-gray-600 hover:text-indigo-600">Community</Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
          <Link to="/notifications" className="text-gray-600 hover:text-indigo-600">Notifications</Link>

        </div>
      </nav> */}
      <Navbar />


      {/* Notifications */}
      <div className="min-h-screen bg-gray-50 flex justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No notifications at the moment.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((n, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <p className="text-black text-base font-medium">{n.message}</p>

                  {n.type === "group-join-request" && (
                    <div className="flex gap-3 mt-4 sm:mt-0">
                      <button
                        onClick={() =>
                          handleAction(
                            n.groupId?._id || n.groupId,
                            n.fromUser?._id || n.fromUser,
                            "accept"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            n.groupId?._id || n.groupId,
                            n.fromUser?._id || n.fromUser,
                            "reject"
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
