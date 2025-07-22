import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/ApiConfig";
import NavBar from "../components/Navbar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
export default function QuestionDetails() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      const res = await axiosInstance.get(`/questions/${questionId}`);
      setQuestion(res.data.data.question);
      setAnswers(res.data.data.answers);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load question.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    setPosting(true);
    try {
      await axiosInstance.post(`/answers/${questionId}`, {
        content: newAnswer.trim(),
      });
      await fetchQuestion();
      setNewAnswer("");
      setShowAnswerForm(false);
    } catch (err) {
      console.error("Failed to post answer", err);
      alert("Failed to post answer.");
    } finally {
      setPosting(false);
    }
  };

  const handleVote = async (isUpvote) => {
    try {
      await axiosInstance.post(`/questions/${questionId}/vote`, { isUpvote });
      await fetchQuestion();
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleAnswerVote = async (answerId, isUpvote) => {
    try {
      await axiosInstance.post(`/answers/vote/${answerId}`, { isUpvote });
      await fetchQuestion(); // refresh data
    } catch (err) {
      console.error("Answer vote failed", err);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 p-10">{error}</div>;
  if (!question) return <div className="text-center p-10">Question not found.</div>;

  return (
    <>
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <p className="text-gray-700 mb-4">{question.body}</p>
        <p className="text-sm text-gray-500">
          Asked by: <Link className="font-medium mx-0.5" to = {`/profile-page/${question.askedBy._id}`} >{question.askedBy?.username || "Anonymous"}</Link>
            <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
        </p>

        <div className="flex gap-2 my-3">
          {question.tags.map((tag, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Vote Buttons */}
        <div className="flex items-center gap-4 my-4">
          <button
            onClick={() => handleVote(true)}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            ⬆️ {question.upvotes?.length || 0}
          </button>
          <button
            onClick={() => handleVote(false)}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            ⬇️ {question.downvotes?.length || 0}
          </button>
        </div>

        {/* Answer Button */}
        <div className="flex justify-end my-4">
          <button
            onClick={() => setShowAnswerForm(!showAnswerForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showAnswerForm ? "Cancel" : "Answer this Question"}
          </button>
        </div>

        {/* Answer Form */}
        {showAnswerForm && (
          <div className="mb-6">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
            ></textarea>
            <div className="text-right mt-2">
              <button
                onClick={handlePostAnswer}
                disabled={posting}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {posting ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </div>
        )}

        <hr className="my-5" />
        <h2 className="text-xl font-semibold mb-3">Answers</h2>
        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet.</p>
        ) : (
          answers.map((ans) => (
            <div key={ans._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <p>{ans.text}</p>
              <Link className="text-xs text-gray-500 mt-2" to={`/profile-page/${ans.answeredBy._id}`}>
                Answered by: {ans.answeredBy?.username || "Anonymous"}
                <span className = "mx-0.5">{formatDistanceToNow(new Date(ans.createdAt), { addSuffix: true })}</span> 
              </Link>
              

              {/* Answer Vote Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleAnswerVote(ans._id, true)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                >
                  ⬆️ {ans.upvotes?.length || 0}
                </button>
                <button
                  onClick={() => handleAnswerVote(ans._id, false)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                >
                  ⬇️ {ans.downvotes?.length || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
