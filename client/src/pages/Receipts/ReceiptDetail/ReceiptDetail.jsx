import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getReceiptById } from "../../../services/receiptService";

import ReceiptHeader from "../../../components/receipt/ReceiptHeader";
import ReceiptInfo from "../../../components/receipt/ReceiptInfo";
import ReceiptPreview from "../../../components/receipt/ReceiptPreview";
import PurchaseDetails from "../../../components/receipt/PurchaseDetails";
import ReceiptActions from "../../../components/receipt/ReceiptActions";

function ReceiptDetail() {
  const { id } = useParams();

  // ✅ New
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
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold">Receipt not found</h1>
      </div>
    );
  }

  // ✅ Back Logic
  const handleBack = () => {
    if (location.state?.from === "search") {
      navigate(-1);
    } else {
      navigate("/receipts");
    }
  };

  return (
    <div className="container-custom py-8">
      {/* 👇 Ye line change hui hai */}
      <ReceiptHeader onBack={handleBack} />

      <div className="mt-6 grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-4">
          <ReceiptPreview receipt={receipt} />
        </div>

        <div className="col-span-8">
          <ReceiptInfo receipt={receipt} />
        </div>
      </div>

      <div className="mt-6">
        <PurchaseDetails receipt={receipt} />
      </div>

      <div className="mt-6">
        <ReceiptActions
          receiptId={receipt.id}
          onView={() => setIsPreviewOpen(true)}
        />
      </div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white p-2 shadow-lg"
          >
            ✕
          </button>

          <img
            src={receipt.receiptImage}
            alt={receipt.storeName}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl bg-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ReceiptDetail;