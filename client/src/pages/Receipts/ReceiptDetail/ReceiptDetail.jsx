import { useParams } from "react-router-dom";
import { receiptData } from "../../../data/receiptData";

import ReceiptHeader from "../../../components/receipt/ReceiptHeader";
import ReceiptInfo from "../../../components/receipt/ReceiptInfo";
import ReceiptPreview from "../../../components/receipt/ReceiptPreview";
import PurchaseDetails from "../../../components/receipt/PurchaseDetails";

function ReceiptDetail() {
  const { id } = useParams();

  const receipt = receiptData.find(
    (receipt) => receipt.id === Number(id)
  );

  if (!receipt) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold">Receipt not found</h1>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <ReceiptHeader />

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

    </div>
  );
}

export default ReceiptDetail;