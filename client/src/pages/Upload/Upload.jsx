import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import UploadHeader from "../../components/receipt/UploadHeader";
import UploadWorkspace from "../../components/receipt/UploadWorkspace";
import ReceiptForm from "../../components/receipt/ReceiptForm";
import WarrantyForm from "../../components/receipt/WarrantyForm";
import ReturnWindowCard from "../../components/returnWindow/ReturnWindowCard";
import NotesField from "../../components/receipt/NotesField";
import UploadActions from "../../components/receipt/UploadActions";

import { uploadReceiptImage } from "../../services/storageService";
import { saveReceipt } from "../../services/receiptService";
import { saveWarranty } from "../../services/warrantyService";

import useReceiptForm from "../../hooks/useReceiptForm";
import { calculateReturnEndDate } from "../../utils/returnUtils";
import { AuthContext } from "../../context/AuthContext";

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    receiptData,
    setReceiptData,
    errors,
    setErrors,
    handleInputChange,
    handleFileChange,
    validateReceipt,
  } = useReceiptForm();

  // Auto calculate Return End Date
  useEffect(() => {
    if (
      receiptData.returnTracking &&
      receiptData.returnStartDate &&
      receiptData.returnDurationDays
    ) {
      const endDate = calculateReturnEndDate(
        receiptData.returnStartDate,
        receiptData.returnDurationDays
      );

      setReceiptData((prev) => ({
        ...prev,
        returnEndDate: endDate,
      }));
    } else {
      setReceiptData((prev) => ({
        ...prev,
        returnEndDate: "",
      }));
    }
  }, [
    receiptData.returnTracking,
    receiptData.returnStartDate,
    receiptData.returnDurationDays,
    setReceiptData,
  ]);

  const handleSaveReceipt = async () => {
    const result = validateReceipt();

    setErrors(result.errors);

    if (!result.isValid) {
      const firstError = Object.values(result.errors)[0];
      toast.error(firstError);
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    try {
      const uid = user.uid;

      // Upload image to Firebase Storage
      const imageUrl = await uploadReceiptImage(
        receiptData.receiptImage,
        uid
      );

      // Save receipt with current user UID
      const receiptId = await saveReceipt({
        ...receiptData,
        receiptImage: imageUrl,
        userId: uid,

        // Return Window Tracking
        returnTracking: receiptData.returnTracking,
        platform: receiptData.platform,
        returnType: receiptData.returnType,
        returnDurationDays: Number(receiptData.returnDurationDays),
        returnStartDate: receiptData.returnStartDate,
        returnEndDate: receiptData.returnEndDate,
      });

      // Save warranty if enabled
      if (receiptData.hasWarranty) {
        await saveWarranty({
          receiptId,
          productName: receiptData.productName,
          storeName: receiptData.storeName,
          category: receiptData.category,
          purchaseDate: receiptData.purchaseDate,
          warrantyDuration: receiptData.warrantyDuration,
          expiryDate: receiptData.warrantyExpiry,
          userId: uid,
        });
      }

      toast.success("Receipt saved successfully!");
      navigate("/receipts");
    } catch (error) {
      console.error(error);
      toast.error("Receipt save failed!");
    }
  };

  return (
    <div className="space-y-6">
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

      <ReturnWindowCard
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