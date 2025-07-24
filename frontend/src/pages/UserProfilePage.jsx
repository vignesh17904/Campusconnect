import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/ApiConfig";
import NavBar from "@/components/Navbar";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <><div className="text-center mt-10">Loading...</div></>
  if (!profile) return <div className="text-center mt-10 text-red-500">User not found</div>;

  const { user, questions, answers } = profile;

  return (
    <>
    
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">User Profile Page</h1>

        {/* User Info */}
        <div className="mb-6 space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Reputation:</strong> {user.reputation}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>Year:</strong> {user.year}</p>
          <p><strong>Roll Number:</strong> {user.rollNumber}</p>
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Questions Asked</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions posted yet.</p>
          ) : (
            <ul className="list-disc pl-5 text-blue-700 space-y-4">
              {questions.map((q) => (
                <li key={q._id} className="bg-white shadow p-4 rounded">
                  <Link
                    to={`/community/question/${q._id}`}
                    className="text-xl text-indigo-600 font-semibold hover:underline"
                  >
                    {q.title}
                  </Link>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {q.tags.map((tag, idx) => (
                      <span key={idx} className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Asked by: {q.askedBy} · {q.answersCount} answers · {q.upvotes} 👍 · {q.downvotes} 👎
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Answers */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Answers Posted</h2>
          {answers.length === 0 ? (
            <p className="text-gray-500">No answers posted yet.</p>
          ) : (
            <ul className="list-disc pl-5 text-gray-800 space-y-2">
              {answers.map((a) => (
                <li key={a._id}>
                  <Link to={`/community/question/${a.question}`}>
                    {a.text.length > 100 ? a.text.slice(0, 100) + "..." : a.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </>
  );
}
