import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";

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
      await fetchNotifications(); // Refresh notifications after handling
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-semibold text-black mb-8">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-600 text-lg">No notifications.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {notifications.map((n, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <p className="text-black text-base font-medium">{n.message}</p>

              {n.type === "group-join-request" && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() =>
                      handleAction(
                        n.groupId?._id || n.groupId,
                        n.fromUser?._id || n.fromUser,
                        "accept"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
  );
}
