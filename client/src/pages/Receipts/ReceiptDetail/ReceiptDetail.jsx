import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";

import { getReceiptById } from "../../../services/receiptService";

import ReceiptHeader from "../../../components/receipt/ReceiptHeader";
import ReceiptInfo from "../../../components/receipt/ReceiptInfo";
import ReceiptPreview from "../../../components/receipt/ReceiptPreview";
import PurchaseDetails from "../../../components/receipt/PurchaseDetails";
import ReceiptActions from "../../../components/receipt/ReceiptActions";

import ReturnStatusBadge from "../../../components/returnWindow/ReturnStatusBadge";
import ReturnCountdown from "../../../components/returnWindow/ReturnCountdown";
import { getReturnStatus } from "../../../utils/returnUtils";

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

const formatDate = (dateString) => {
if (!dateString) return "-";


return new Date(dateString).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});


};

if (loading) {
return ( <div className="flex items-center justify-center py-20"> <div className="text-secondary">Loading...</div> </div>
);
}

if (!receipt) {
return ( <div className="flex items-center justify-center py-20"> <div className="text-secondary">Receipt not found</div> </div>
);
}

const handleBack = () => {
if (location.state?.from === "search") {
navigate(-1);
} else {
navigate("/receipts");
}
};

return ( <div className="min-h-screen bg-background p-6 transition-theme">
{/* Header */} <ReceiptHeader receipt={receipt} onBack={handleBack} />


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

  {/* Return Window */}
  {receipt.returnTracking && (
    <div className="mt-6 rounded-3xl border border-default bg-surface p-6 shadow-sm transition-theme">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-secondary">
          <RotateCcw className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-primary">
              Return Window
            </h2>

            <ReturnStatusBadge
              status={getReturnStatus(receipt.returnEndDate)}
            />
          </div>

          <p className="mt-1 text-sm text-secondary">
            Track return and replacement eligibility for this purchase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-default bg-surface-secondary p-5">
          <p className="text-xs uppercase tracking-wide text-secondary">
            Platform
          </p>
          <p className="mt-2 text-base font-semibold text-primary">
            {receipt.platform || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-default bg-surface-secondary p-5">
          <p className="text-xs uppercase tracking-wide text-secondary">
            Return Type
          </p>
          <p className="mt-2 text-base font-semibold text-primary">
            {receipt.returnType || "Return"}
          </p>
        </div>

        <div className="rounded-2xl border border-default bg-surface-secondary p-5">
          <p className="text-xs uppercase tracking-wide text-secondary">
            Start Date
          </p>
          <p className="mt-2 text-base font-semibold text-primary">
            {formatDate(receipt.returnStartDate)}
          </p>
        </div>

        <div className="rounded-2xl border border-default bg-surface-secondary p-5">
          <p className="text-xs uppercase tracking-wide text-secondary">
            End Date
          </p>
          <p className="mt-2 text-base font-semibold text-primary">
            {formatDate(receipt.returnEndDate)}
          </p>
        </div>
      </div>

      {/* Time Remaining */}
      <div className="mt-6 rounded-2xl border border-default bg-surface-secondary p-6">
        <p className="text-xs uppercase tracking-wide text-secondary">
          Time Remaining
        </p>

        <div className="mt-3">
          <div className="text-3xl font-bold tracking-tight text-primary">
            <ReturnCountdown endDate={receipt.returnEndDate} />
          </div>

          <p className="mt-2 text-sm text-secondary">
            Return window closes on {formatDate(receipt.returnEndDate)}
          </p>
        </div>
      </div>
    </div>
  )}

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
