import { Eye, Pencil, Trash2 } from "lucide-react";
import WarrantyStatusBadge from "./WarrantyStatusBadge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import ConfirmModal from "../common/ConfirmModal";
import { deleteWarranty } from "../../services/warrantyService";

const WarrantyRow = ({
  id,
  product,
  brand,
  purchaseDate,
  expiryDate,
  status,
  onDelete,
}) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

const handleDelete = async () => {
  try {
    await deleteWarranty(id);

    toast.success("Warranty deleted successfully");

    setShowDeleteModal(false);

    onDelete();

  } catch (error) {
    console.error(error);

    toast.error("Failed to delete warranty");
  }
};
  return (
  <>
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-900">{product}</p>
          <p className="text-sm text-slate-500">{brand}</p>
        </div>
      </td>

      <td className="px-6 py-4">{purchaseDate}</td>

      <td className="px-6 py-4">{expiryDate}</td>

      <td className="px-6 py-4">
        <WarrantyStatusBadge status={status} />
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/warranty/${id}`)}
            className="text-slate-500 transition hover:text-indigo-600"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => navigate(`/warranty/edit/${id}`)}
            className="text-slate-500 transition hover:text-amber-600"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-slate-500 transition hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>

    <ConfirmModal
      isOpen={showDeleteModal}
      title="Delete Warranty"
      message="Are you sure you want to permanently delete this warranty?"
      confirmText="Delete"
      cancelText="Cancel"
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={handleDelete}
    />
  </>
);
  
};

export default WarrantyRow;