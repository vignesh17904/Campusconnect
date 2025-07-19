import { useState, useEffect, useRef } from "react";
import AxiosInstance from "@/utils/ApiConfig"; // make sure this is configured properly

export default function ChatbotWindow({ onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: `Hi! I’m your AI assistant 🤖 to help you write better community posts. Ask me anything!`,
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { from: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      const res = await AxiosInstance.post("/ai/write-post", {
        userPrompt: question.trim(),
      });

      const reply = res?.data?.data || "Something went wrong.";
      const botMessage = { from: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = {
        from: "bot",
        text: "Oops! Failed to get response. Try again later.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-300">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h2 className="text-xl font-bold text-indigo-700">CampusBot</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-1 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 max-w-[85%] text-sm rounded-2xl shadow transition-all duration-300 ${
              msg.from === "user"
                ? "ml-auto bg-indigo-100 text-indigo-900"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center border rounded-full px-3 py-2 shadow-sm bg-white">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask help to write your post..."
          className="flex-1 outline-none text-sm text-gray-700"
        />
        <button
          onClick={handleAsk}
          className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
