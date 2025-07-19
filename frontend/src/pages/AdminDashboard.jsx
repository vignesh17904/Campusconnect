import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/ApiConfig";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (search.trim()) {
        if (tab === "users")
          res = await axiosInstance.get(`/admin/search/users?q=${search}`);
        else if (tab === "questions")
          res = await axiosInstance.get(`/admin/search/questions?q=${search}`);
        else if (tab === "groups")
          res = await axiosInstance.get(`/admin/search/groups?q=${search}`);
      } else {
        if (tab === "users") res = await axiosInstance.get("/admin/users");
        else if (tab === "questions") res = await axiosInstance.get("/admin/questions");
        else if (tab === "groups") res = await axiosInstance.get("/admin/groups");
      }
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handleDelete = async (type, id) => {
    try {
      await axiosInstance.delete(`/admin/${type}/${id}`);
      fetchData(); // Refresh
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-4 space-y-4">
        <h2 className="text-xl font-bold text-indigo-700">Admin Panel</h2>
        <nav className="space-y-2">
          <button
            onClick={() => {
              setTab("users");
              setSearch("");
            }}
            className={`block w-full text-left px-4 py-2 rounded-lg ${tab === "users" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            View Users
          </button>
          <button
            onClick={() => {
              setTab("questions");
              setSearch("");
            }}
            className={`block w-full text-left px-4 py-2 rounded-lg ${tab === "questions" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            View Questions
          </button>
          <button
            onClick={() => {
              setTab("groups");
              setSearch("");
            }}
            className={`block w-full text-left px-4 py-2 rounded-lg ${tab === "groups" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            View Groups
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{tab}</h1>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder={`Search ${tab}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </form>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white border shadow rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {tab === "users" && (
                  <>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th>Email</th>
                    <th>Branch</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </>
                )}
                {tab === "questions" && (
                  <>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th>Asked By</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </>
                )}
                {tab === "groups" && (
                  <>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th>Branch</th>
                    <th>Year</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  {tab === "users" && (
                    <>
                      <td className="px-4 py-2">{item.username}</td>
                      <td>{item.email}</td>
                      <td>{item.branch}</td>
                      <td>{item.year}</td>
                      <td>
                        <button
                          onClick={() => handleDelete("users", item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                  {tab === "questions" && (
                    <>
                      <td className="px-4 py-2">{item.title}</td>
                      <td>{item.askedBy?.username}</td>
                      <td>{item?.tags?.join(", ") || "—"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete("questions", item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                  {tab === "groups" && (
                    <>
                      <td className="px-4 py-2">{item.name}</td>
                      <td>{item.branch}</td>
                      <td>{item.year}</td>
                      <td>{item.admin?.username || "—"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete("groups", item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
