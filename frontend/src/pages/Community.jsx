import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/ApiConfig";
import NavBar from "@/components/Navbar";

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
      await axiosInstance.post(`/questions/vote/${questionId}`, { isUpvote });
      fetchQuestions(); // Refresh question list after vote
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 py-6 px-5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">CampusBuzz</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-2xl shadow"
              onClick={() => navigate("/community/question/ask-question")}
            >
              Make a post
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
                    className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/community/question/${q._id}`}>
                          <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                            {q.title}
                          </h2>
                        </Link>
                        <p className="text-sm text-gray-500">
                          Asked by:{" "}
                          <span className="font-medium">
                            {q.askedBy || "Anonymous"}
                          </span>
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {q.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Voting Section */}
                      <div className="text-center px-4 flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleVote(q._id, true)}
                          className="text-green-600 hover:text-green-800 font-bold text-xl"
                          title="Upvote"
                        >
                          👍
                        </button>
                        <span className="text-lg font-semibold text-gray-700">
                          {score}
                        </span>
                        <button
                          onClick={() => handleVote(q._id, false)}
                          className="text-red-600 hover:text-red-800 font-bold text-xl"
                          title="Downvote"
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
