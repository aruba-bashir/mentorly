import React from "react";
import axios from "axios";

function UpdateCard({ update, fetchUpdates }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://mentorly-backend-9x4x.onrender.com/api/updates/${update._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchUpdates();
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
  }
};
  return (
    <div className="card" >
      <h4>{update.author?.name  ? update.author?.name :  "Anonymous"}</h4>
      <p className="text-muted">{update.content}</p>

     
     
   {(user?.role === "admin" || update.author?._id === user?._id) && (
  <button  className="btn btn-black" onClick={() => handleDelete(update._id)}>
    Delete
  </button>
)}
    </div>
  );
}

export default UpdateCard;