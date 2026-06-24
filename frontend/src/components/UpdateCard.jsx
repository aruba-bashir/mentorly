import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

function UpdateCard({ update, fetchUpdates }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/updates/${update._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchUpdates();
    toast.success("Update deleted successfully");
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    toast.error("Failed to delete update");
  }
};
  return (
    <div className="card" >
      <h4>{update.author?.name  ? update.author?.name :  "Anonymous"}</h4>
      <p className="text-muted">{update.content}</p>

     
     
   {(user?.role === "admin" || update.author?._id === user?._id) && (
   <button
  className="btn btn-black"
  onClick={() => setShowDeleteModal(true)}
>
  Delete
</button>
)}
<ConfirmModal
  show={showDeleteModal}
  title="Delete Update"
  message="Are you sure you want to delete this update?"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={() => {
    handleDelete(update._id);
    setShowDeleteModal(false);
  }}
  onClose={() => setShowDeleteModal(false)}
/>
    </div>
  );
}

export default UpdateCard;