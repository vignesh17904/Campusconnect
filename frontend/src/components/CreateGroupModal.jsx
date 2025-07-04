
import { useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";

export default function CreateGroupModal({ onClose }) {
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = async () => {
    try {
      await AxiosInstance.post("/groups/create", { name: groupName });
      setGroupName("");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Group creation failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Create a Group</h3>
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button onClick={handleCreateGroup} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
