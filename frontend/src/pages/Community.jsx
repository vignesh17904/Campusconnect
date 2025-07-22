import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/ApiConfig";
import NavBar from "@/components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";
import ChatbotLauncher from "@/components/chatbot/ChatbotLauncher.jsx";
export default function Community() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get("/questions/all");
      setQuestions(res.data.data || []);
    } catch (err) {
      console.error("Failed to load questions", err);
    }
  };

  const handleVote = async (questionId, isUpvote) => {
    try {
      await axiosInstance.post(`/questions/${questionId}/vote`, { isUpvote });
      fetchQuestions(); // Refresh question list after vote
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">CampusBuzz</h1>
            <button
              onClick={() => navigate("/community/question/ask-question")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-xl transition"
            >
              + Ask a Question
            </button>
          </div>

          {/* Questions */}
          {questions.length === 0 ? (
            <p className="text-center text-gray-600">No questions found.</p>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => {
                const score = (q.upvotes || 0) - (q.downvotes || 0);

                return (
                  <div
                    key={q._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 p-5"
                  >
                    <div className="flex justify-between items-start">
                      {/* Main Content */}
                      <div className="flex-1">
                        <Link to={`/community/question/${q._id}`}>
                          <h2 className="text-xl font-semibold text-indigo-600 hover:underline">
                            {q.title}
                          </h2>
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>
                            Asked by{" "}
                            <Link
                              to={`/profile-page/${q.askedBy._id}`}
                              className="text-gray-700 font-medium hover:underline"
                            >
                              {q.askedBy.username}
                            </Link>
                          </span>{" "}
                          •{" "}
                          <span>
                            {formatDistanceToNow(new Date(q.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {q.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Voting */}
                      <div className="flex flex-col items-center gap-1 ml-4">
                        <button
                          onClick={() => handleVote(q._id, true)}
                          className="text-green-600 hover:text-green-800 transition"
                          title="Upvote"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-gray-700">{score}</span>
                        <button
                          onClick={() => handleVote(q._id, false)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Downvote"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <ChatbotLauncher />
      </div>
    </>
  );
}
