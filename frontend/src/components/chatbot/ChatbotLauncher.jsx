import { useState } from "react";
import { PiRobotBold } from "react-icons/pi"; // Sleek AI assistant icon
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white px-5 py-3 rounded-full shadow-xl z-50 hover:bg-purple-700 flex flex-col items-center text-center"
      >
        <PiRobotBold size={28} className="mb-1" />
        <span className="text-xs font-medium leading-tight">
          Need help? <br /> Write with AI
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
          <ChatbotWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
