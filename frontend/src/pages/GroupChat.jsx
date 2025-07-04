import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AxiosInstance from "@/utils/ApiConfig";
import { Link } from "react-router-dom";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";

const socket = io("http://localhost:8000", { withCredentials: true });

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export default function GroupChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
const [showCreateModal, setShowCreateModal] = useState(false);
const [showJoinModal, setShowJoinModal] = useState(false);
const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await AxiosInstance.get("/users/get-user");
        setUser(data?.data);
        setGroups(data?.data?.groups || []);
        if (data?.data?.groups?.length > 0) {
          joinGroup(data.data.groups[0]._id);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);


  const loadMessages = async (groupId) => {
    try {
      const res = await AxiosInstance.get(`/messages/${groupId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };


  const joinGroup = (newGroupId) => {
    if (newGroupId === groupId) return;
    socket.emit("joinGroup", newGroupId);
    setGroupId(newGroupId);
    loadMessages(newGroupId);
  };

  // Handle receiving messages via Socket.io
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSend = () => {
    if (message.trim() && groupId && user) {
      const newMsg = {
        groupId,
        message,
        sender: user.username,
        time: new Date(),
      };
      socket.emit("sendMessage", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    }
  };

  const currentGroupName = groups.find((g) => g._id === groupId)?.name;

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-gray-50">

      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600">CampusConnect</h1>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/chat" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Chat</Link>
          <Link to="/community" className="text-gray-600 hover:text-indigo-600">Community</Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">My Groups</h2>

          {/* Create & Join Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 bg-indigo-600 text-gray py-2 px-3 rounded-lg text-sm"
            >
              Create Group
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm"
            >
              Join Group
            </button>
            {showJoinModal && <JoinGroupModal onClose={() => setShowJoinModal(false)} />}
          </div>
         
          {/* User's Groups */}
          <div className="space-y-2">
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => joinGroup(group._id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${group._id === groupId
                    ? "bg-indigo-500 text-grey shadow"
                    : "hover:bg-indigo-100 text-gray-700"
                  }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </aside>
        {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} />}
        {/* Chat Panel */}
        <main className="flex-1 flex flex-col bg-gray-100">
          {/* Chat Header */}
          <div className="bg-white border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">{currentGroupName || "Select a group"}</h2>
            <p className="text-sm text-gray-500">
              {groupId ? "You are chatting in this group." : "No group selected"}
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-gray-400">
                <div>
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Be the first to send something!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${msg.sender === user?.username ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-xl px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.sender === user?.username
                      ? "bg-indigo-500 text-white rounded-br-lg"
                      : "bg-white text-gray-800 rounded-bl-lg border border-gray-200"
                      }`}
                  >
                    {msg.sender !== user?.username && (
                      <p className="font-semibold text-indigo-600 mb-1">
                        {msg.sender}
                      </p>
                    )}
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt || msg.time).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`p-3 rounded-full transition duration-200 flex-shrink-0 ${message.trim()
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <SendIcon />
            </button>
          </div>
        </main>
      </div>

    </div>
  );
}
