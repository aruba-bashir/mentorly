
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateCard from "../components/UpdateCard";
import CreateUpdate from "../components/CreateUpdate";

function TechUpdates() {
  const [updates, setUpdates] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  //if (!user) return <p>Loading...</p>;
  const token = localStorage.getItem("token");

  const fetchUpdates = async () => {
    try {
      console.log("Token being sent:", token); //  debug

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/updates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUpdates(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
        toast.error("Failed to load updates");
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
   <div className="page-container">
   <h2 className="title">Tech Updates</h2>

      {(user?.role === "mentor" || user?.role === "master") && (
        <div className="card" style={{ marginBottom: "16px" }}>
        <CreateUpdate fetchUpdates={fetchUpdates} />
        </div>
      )}

      {updates?.length === 0 ? (
        <p className="text-muted">No updates yet...</p>
      ) : (
                <div className="grid">

       { updates.map((u) => (
          <UpdateCard
            key={u._id}
            update={u}
            fetchUpdates={fetchUpdates}
          />
        ))}
        </div>
      )}
    </div>
  );
}

export default TechUpdates;