import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";

export default function JoinGroupModal({ onClose }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await AxiosInstance.get("/groups/all-user-groups");
        setGroups(res.data.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    fetchGroups();
  }, []);

  const handleSendRequest = async (groupId) => {
    try {
      await AxiosInstance.post("/groups/send-join-request", { groupId });
      alert("Request sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Join a Group</h2>
        {groups.length === 0 ? (
          <p className="text-gray-500">No available groups to join</p>
        ) : (
          <ul className="space-y-3">
            {groups.map((group) => (
              <li key={group._id} className="flex justify-between items-center">
                <span>{group.name}</span>
                <button
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() => handleSendRequest(group._id)}
                >
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
