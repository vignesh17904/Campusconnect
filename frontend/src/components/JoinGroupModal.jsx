
import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";

export default function JoinGroupModal({ onClose }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await AxiosInstance.get("/groups/all");
        setGroups(data.groups || []);
      } catch (err) {
        console.error("Failed to load groups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleSendRequest = async (groupId) => {
    try {
      await AxiosInstance.post(`/groups/join-request`, { groupId });
      alert("Request sent!");
    } catch (err) {
      console.error("Join request failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-[28rem] max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Join a Group</h3>
        {loading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <p>No groups available</p>
        ) : (
          <ul className="space-y-3">
            {groups.map((group) => (
              <li
                key={group._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>{group.name}</span>
                <button
                  onClick={() => handleSendRequest(group._id)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded"
                >
                  Send Request
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
}
