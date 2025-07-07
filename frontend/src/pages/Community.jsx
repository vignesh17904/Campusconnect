import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/utils/ApiConfig";
import NavBar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Community() {
     const Navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get("/questions/all");
        setQuestions(res.data.data || []);
      } catch (err) {
        console.error("Failed to load questions", err);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <> <NavBar/>
    <div className="min-h-screen bg-gray-100 py-6 px-5">
       
      <div className="max-w-6xl mx-auto">
        {/* Header with Post Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">CampusBuzz</h1>
          
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-2xl shadow" onClick={()=>Navigate("/community/question/ask-question")}>
              Make a post 
            </button>
        
        </div>

        {questions.length === 0 ? (
          <p className="text-center text-gray-600">No questions found.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => {
              const upvotes = q.upvotes?.length || 0;
              const downvotes = q.downvotes?.length || 0;
              const score = upvotes - downvotes;

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

                    <div className="text-center px-4">
                      <div className="text-sm font-bold text-gray-700">Votes</div>
                      <div className="text-xl font-semibold text-green-600">
                        {score}
                      </div>
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
