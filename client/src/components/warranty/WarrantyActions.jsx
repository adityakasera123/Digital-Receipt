import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

import ConfirmModal from '../common/ConfirmModal';
import { deleteWarranty } from '../../services/warrantyService';

const WarrantyActions = ({ warranty }) => {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteWarranty(warranty.id);

      toast.success('Warranty deleted successfully');

      setShowDeleteModal(false);

      navigate('/warranty');
    } catch (error) {
      console.error(error);

      toast.error('Failed to delete warranty');
    }
  };

  return (
    <>
      {/* Actions */}
      <section className="mt-6 flex flex-wrap items-center gap-3">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/warranty')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-default px-6 py-3 font-medium text-primary transition-theme hover:bg-surface-hover"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Edit */}
        <button
          type="button"
          onClick={() => navigate(`/warranty/edit/${warranty.id}`)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          <Pencil size={18} />
          Edit Warranty
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="basis-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-medium text-red-600 transition hover:bg-red-100 sm:basis-auto"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </section>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Warranty"
        message="Are you sure you want to permanently delete this warranty? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default WarrantyActions;