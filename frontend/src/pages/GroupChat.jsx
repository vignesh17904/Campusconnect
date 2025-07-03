import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AxiosInstance from "@/utils/ApiConfig";

const socket = io("http://localhost:8000", { withCredentials: true });

export default function GroupChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

 
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await AxiosInstance.get("/users/get-user");
      setUser(data?.user);
      setGroups(data?.user?.groups || []);
      if (data?.user?.groups?.length > 0) {
        const defaultGroupId = data.user.groups[0]._id;
        joinGroup(defaultGroupId);
      }
    };
    fetchUser();
  }, []);

 
  const loadMessages = async (groupId) => {
    const res = await AxiosInstance.get(`/messages/${groupId}`);
    setMessages(res.data.messages || []);
  };

  // Join new group
  const joinGroup = (newGroupId) => {
    socket.emit("joinGroup", newGroupId);
    setGroupId(newGroupId);
    loadMessages(newGroupId);
  };

  // Receive messages in real time
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && groupId && user) {
      socket.emit("sendMessage", {
        groupId,
        message,
        sender: user.username,
      });

      setMessages((prev) => [
        ...prev,
        { message, sender: user.username, time: new Date() },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Group Chat</h2>

      <div className="flex justify-center mb-4">
        <select
          value={groupId}
          onChange={(e) => joinGroup(e.target.value)}
          className="px-3 py-1 rounded border"
        >
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow px-4 py-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 ${
              msg.sender === user?.username ? "text-right" : "text-left"
            }`}
          >
            <p className="text-sm">
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
