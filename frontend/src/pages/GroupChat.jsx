import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AxiosInstance from "@/utils/ApiConfig";
import { Link } from "react-router-dom";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import Navbar from "@/components/Navbar";

const socket = io("http://localhost:8000", { withCredentials: true });

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export default function GroupChat() {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

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

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || !groupId || !user) return;

    const formData = new FormData();
    formData.append("groupId", groupId);
    formData.append("sender", user.username);
    formData.append("message", message);

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const { data } = await AxiosInstance.post("/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.emit("sendMessage", data.data);
      setMessages((prev) => [...prev, data.data]);
      setMessage("");
      setSelectedFiles([]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const currentGroupName = groups.find((g) => g._id === groupId)?.name;

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">My Groups</h2>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setShowCreateModal(true)} className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-indigo-700 transition">Create</button>
            <button onClick={() => setShowJoinModal(true)} className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition">Join</button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => joinGroup(group._id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition 
                  ${group._id === groupId ? "bg-indigo-100 text-indigo-700 font-semibold border border-indigo-400" : "hover:bg-gray-100 text-gray-700"}`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </aside>

        {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} />}
        {showJoinModal && <JoinGroupModal onClose={() => setShowJoinModal(false)} />}

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col bg-gray-100">
          <div className="bg-white border-b px-6 py-4 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">{currentGroupName || "Select a group"}</h2>
            <p className="text-sm text-gray-500 mt-1">{groupId ? "You're chatting in this group" : "No group selected"}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-gray-400">
                <div>
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Be the first to send something!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.sender === user?.username ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.sender === user?.username ? "bg-indigo-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-gray-200"}`}>
                    {msg.sender !== user?.username && (
                      <p className="font-semibold text-indigo-600 mb-1">{msg.sender}</p>
                    )}
                    <p>{msg.message}</p>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((att, index) => (
                          <div key={index}>
                            {att.type === "image" && (
                              <a href={att.url} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={att.url}
                                  alt="attachment"
                                  className="rounded-lg max-w-xs cursor-pointer hover:opacity-90"
                                />
                              </a>
                            )}
                            {att.type === "video" && (
                              <video controls className="rounded-lg max-w-xs">
                                <source src={att.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {["pdf", "raw"].includes(att.type) && (
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 underline"
                              >
                                View Attachment
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}


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

          {/* Input */}
          <div className="bg-white border-t px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="text-sm border border-gray-300 rounded-full mx-1"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() && selectedFiles.length === 0}
              className={`p-3 rounded-full transition duration-200 flex-shrink-0 
                ${message.trim() || selectedFiles.length
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              <SendIcon />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

