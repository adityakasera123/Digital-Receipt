import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ConfirmModal from "../common/ConfirmModal";
import { deleteReceipt } from "../../services/receiptService";
import toast from "react-hot-toast";

import {
  Pencil,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

function ReceiptActions({ onView, receiptId }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDelete = async () => {
  try {
    await deleteReceipt(receiptId);

    toast.success("Receipt deleted successfully");

    setShowDeleteModal(false);

    navigate("/receipts");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete receipt");
  }
};
  
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Receipt Actions
          </h2>

          <p className="mt-2 text-slate-500">
            Manage and perform actions on this receipt.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button  onClick={onView}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye size={18} />
            View
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Download size={18} />
            Download
          </button>

          <button
           onClick={() => navigate(`/receipts/edit/${receiptId}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition-all duration-300 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
  onClick={() => setShowDeleteModal(true)}
  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-600 transition-all duration-300 hover:bg-red-100"
>
  <Trash2 size={18} />
  Delete
</button>

        </div>

      </div>
      <ConfirmModal
  isOpen={showDeleteModal}
  title="Delete Receipt"
  message="Are you sure you want to permanently delete this receipt? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  onCancel={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
/>

    </div>
  );
}

export default ReceiptActions;