import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { getReceiptById } from '../../../services/receiptService';

import ReceiptHeader from '../../../components/receipt/ReceiptHeader';
import ReceiptInfo from '../../../components/receipt/ReceiptInfo';
import ReceiptPreview from '../../../components/receipt/ReceiptPreview';
import PurchaseDetails from '../../../components/receipt/PurchaseDetails';
import ReceiptActions from '../../../components/receipt/ReceiptActions';

function ReceiptDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceiptById(id);
        setReceipt(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-secondary">
        Loading...
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-secondary">
        Receipt not found
      </div>
    );
  }

  const handleBack = () => {
    if (location.state?.from === 'search') {
      navigate(-1);
    } else {
      navigate('/receipts');
    }
  };

  return (
    <div>
      {/* Header */}
      <ReceiptHeader
        receipt={receipt}
        onBack={handleBack}
      />

      {/* Receipt Preview + Info */}
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-4">
          <ReceiptPreview receipt={receipt} />
        </div>

        <div className="col-span-1 lg:col-span-8">
          <ReceiptInfo receipt={receipt} />
        </div>
      </div>

      {/* Purchase Details */}
      <div className="mt-6">
        <PurchaseDetails receipt={receipt} />
      </div>

      {/* Receipt Actions */}
      <div className="mt-6">
        <ReceiptActions
          receiptId={receipt.id}
          onView={() => setIsPreviewOpen(true)}
        />
      </div>

      {/* Receipt Preview Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute right-6 top-6 rounded-full border border-default bg-surface p-2 text-primary shadow-lg transition-theme"
          >
            ✕
          </button>

          <img
            src={receipt.receiptImage}
            alt={receipt.storeName}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl bg-surface object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ReceiptDetail;