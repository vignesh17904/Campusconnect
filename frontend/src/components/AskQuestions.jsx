import { useState } from "react";
import AxiosInstance from "@/utils/ApiConfig";
import { useNavigate } from "react-router-dom";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/questions/ask", {
        title,
        description,
        tags: tags.split(",").map(tag => tag.trim()),
      });
      navigate("/community");
    } catch (err) {
      console.error("Failed to ask question", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded mt-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Post Question
        </button>
      </form>
    </div>
  );
}
