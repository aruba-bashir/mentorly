import React from "react";
import "./ConfirmModal.css";
import "./ConfirmModal.css";

export default function ConfirmModal({
  show,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h5 className="confirm-title">{title}</h5>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}