import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import ConfirmModal from '../common/ConfirmModal';
import { deleteReceipt } from '../../services/receiptService';
import toast from 'react-hot-toast';

import {
  Pencil,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import Card from '../ui/Card';

function ReceiptActions({ onView, receiptId }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReceipt(receiptId);

      toast.success('Receipt deleted successfully');

      setShowDeleteModal(false);

      navigate('/receipts');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete receipt');
    }
  };

  return (
    <>
      <Card className="transition-theme">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Receipt Actions
            </h2>

            <p className="mt-2 text-secondary">
              Manage and perform actions on this receipt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onView}
              className="button-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-theme"
            >
              <Eye size={18} />
              View
            </button>

            <button className="button-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-theme">
              <Download size={18} />
              Download
            </button>

            <button
              onClick={() => navigate(`/receipts/edit/${receiptId}`)}
              className="button-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-theme"
            >
              <Pencil size={18} />
              Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-medium text-red-600 transition-all duration-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Receipt"
        message="Are you sure you want to permanently delete this receipt? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ReceiptActions;