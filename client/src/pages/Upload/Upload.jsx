import UploadHeader from "../../components/receipt/UploadHeader";
import UploadWorkspace from "../../components/receipt/UploadWorkspace";
import ReceiptForm from "../../components/receipt/ReceiptForm";
import WarrantyForm from "../../components/receipt/WarrantyForm";
import NotesField from "../../components/receipt/NotesField";
import UploadActions from "../../components/receipt/UploadActions";

import toast from "react-hot-toast";

import { uploadReceiptImage } from "../../services/storageService";
import { saveReceipt } from "../../services/receiptService";
import useReceiptForm from "../../hooks/useReceiptForm";
import { useNavigate } from "react-router-dom";

import { saveWarranty } from "../../services/warrantyService";


const Upload = () => {
  const navigate = useNavigate();
  const {
    receiptData,
    errors,
    setErrors,
    handleInputChange,
    handleFileChange,
    validateReceipt,
  } = useReceiptForm();

  const handleSaveReceipt = async () => {
    console.log("=== HANDLE SAVE CALLED ===");
    const result = validateReceipt();

    setErrors(result.errors);

    if (!result.isValid) {
      const firstError = Object.values(result.errors)[0];
      toast.error(firstError);
      return;
    }

    try {
      // Upload image
      const imageUrl = await uploadReceiptImage(
        receiptData.receiptImage,
        "test-user"
      );

      // Save receipt
     const receiptId = await saveReceipt({
  ...receiptData,
  receiptImage: imageUrl,
  userId: "test-user",
});

console.log("Receipt ID:", receiptId);

console.log("Has Warranty:", receiptData.hasWarranty);

if (receiptData.hasWarranty) {
  console.log("Saving warranty...");

 await saveWarranty({
  receiptId,
  productName: receiptData.productName,
  storeName: receiptData.storeName,
  category: receiptData.category,
  purchaseDate: receiptData.purchaseDate,
  warrantyDuration: receiptData.warrantyDuration,
  expiryDate: receiptData.warrantyExpiry,
  userId: "test-user",
});

  console.log("Warranty saved");
}

toast.success("Receipt saved successfully!");
navigate("/receipts");

    } catch (error) {
      console.error(error);
      toast.error("Receipt save failed!");
    }
  };

  return (
    <div className="space-y-8">
      <UploadHeader />

      <UploadWorkspace
        receiptData={receiptData}
        onFileChange={handleFileChange}
        errors={errors}
      />

      <ReceiptForm
        receiptData={receiptData}
        onInputChange={handleInputChange}
        errors={errors}
      />

      <WarrantyForm
        receiptData={receiptData}
        onInputChange={handleInputChange}
        errors={errors}
      />

      <NotesField
        receiptData={receiptData}
        onInputChange={handleInputChange}
      />

      <UploadActions
        mode="add"
        onSave={handleSaveReceipt}
      />
    </div>
  );
};

export default Upload;