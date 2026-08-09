import { Eye, Pencil, Trash2 } from 'lucide-react';
import WarrantyStatusBadge from './WarrantyStatusBadge';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

import ConfirmModal from '../common/ConfirmModal';
import { deleteWarranty } from '../../services/warrantyService';

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

      toast.success('Warranty deleted successfully');

      setShowDeleteModal(false);

      onDelete();
    } catch (error) {
      console.error(error);

      toast.error('Failed to delete warranty');
    }
  };

  return (
    <>
      {/* ========================= */}
      {/* DESKTOP TABLE ROW */}
      {/* ========================= */}
      <tr className="hidden lg:table-row">
        <td className="px-6 py-4">
          <div>
            <p className="font-semibold text-primary">
              {product}
            </p>

            <p className="text-sm text-secondary">
              {brand}
            </p>
          </div>
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-primary">
          {purchaseDate}
        </td>

        <td className="whitespace-nowrap px-6 py-4 text-primary">
          {expiryDate}
        </td>

        <td className="px-6 py-4">
          <WarrantyStatusBadge status={status} />
        </td>

        <td className="px-6 py-4">
          <div className="flex gap-3">
            {/* View */}
            <button
              type="button"
              onClick={() => navigate(`/warranty/${id}`)}
              className="text-secondary transition hover:text-indigo-600"
              aria-label="View warranty"
            >
              <Eye size={18} />
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => navigate(`/warranty/edit/${id}`)}
              className="text-secondary transition hover:text-amber-600"
              aria-label="Edit warranty"
            >
              <Pencil size={18} />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-secondary transition hover:text-red-600"
              aria-label="Delete warranty"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      {/* ========================= */}
      {/* MOBILE CARD */}
      {/* ========================= */}
      <tr className="lg:hidden">
        <td colSpan="5" className="px-4 py-3">
          <div className="rounded-2xl border border-default bg-surface p-4 transition-theme">
            {/* Product Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-primary">
                  {product}
                </h3>

                <p className="mt-1 text-sm text-secondary">
                  {brand}
                </p>
              </div>

              <div className="shrink-0">
                <WarrantyStatusBadge status={status} />
              </div>
            </div>

            {/* Dates */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-secondary p-3">
                <p className="text-xs text-secondary">
                  Purchase
                </p>

                <p className="mt-1 text-sm font-medium text-primary">
                  {purchaseDate}
                </p>
              </div>

              <div className="rounded-xl bg-surface-secondary p-3">
                <p className="text-xs text-secondary">
                  Expiry
                </p>

                <p className="mt-1 text-sm font-medium text-primary">
                  {expiryDate}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2 border-t border-default pt-3">
              <button
                type="button"
                onClick={() => navigate(`/warranty/${id}`)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-default text-secondary transition-theme hover:bg-surface-hover"
                aria-label="View warranty"
              >
                <Eye size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/warranty/edit/${id}`)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-default text-secondary transition-theme hover:bg-surface-hover"
                aria-label="Edit warranty"
              >
                <Pencil size={17} />
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                aria-label="Delete warranty"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation */}
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