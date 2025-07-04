import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
  message?: string;
}

export default function ConfirmDeleteModal({ open, onCancel, onDelete, message }: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-[#222]">{message || "Are you sure you want to delete this? This action cannot be undone."}</p>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-2 rounded bg-gray-200 text-black font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 