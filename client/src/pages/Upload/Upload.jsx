import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import UploadHeader from "../../components/receipt/UploadHeader";
import UploadWorkspace from "../../components/receipt/UploadWorkspace";
import ReceiptForm from "../../components/receipt/ReceiptForm";
import WarrantyForm from "../../components/receipt/WarrantyForm";
import ReturnWindowCard from "../../components/returnWindow/ReturnWindowCard";
import NotesField from "../../components/receipt/NotesField";
import UploadActions from "../../components/receipt/UploadActions";

import OCRProcessingScreen from "../../components/receipt/OCRProcessingScreen";
import OCRReviewBanner from "../../components/receipt/OCRReviewBanner";
import OCRFailureState from "../../components/receipt/OCRFailureState";

import { uploadReceiptImage } from "../../services/storageService";
import { saveReceipt } from "../../services/receiptService";
import { saveWarranty } from "../../services/warrantyService";
import { extractReceiptData } from "../../services/ocrService";

import useReceiptForm from "../../hooks/useReceiptForm";
import { useOCR } from "../../hooks/useOCR";

import { calculateReturnEndDate } from "../../utils/returnUtils";
import { OCR_STATES } from "../../constants/ocrConstants";

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
    handleFileChange: originalHandleFileChange,
    validateReceipt,
  } = useReceiptForm();

  const {
    ocrState,
    setOCRState,
    ocrData,
    setOCRData,
    ocrError,
    setOCRError,
  } = useOCR();

  // Preview URL for OCR modal
  const previewImage = useMemo(() => {
    if (!receiptData.receiptImage) return null;

    return receiptData.receiptImage instanceof File
      ? URL.createObjectURL(receiptData.receiptImage)
      : receiptData.receiptImage;
  }, [receiptData.receiptImage]);

  useEffect(() => {
    return () => {
      if (
        previewImage &&
        receiptData.receiptImage instanceof File
      ) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, receiptData.receiptImage]);

  // Auto calculate Return End Date
  useEffect(() => {
    if (
      receiptData.returnTracking &&
      receiptData.returnStartDate &&
      receiptData.returnDurationDays
    ) {
      if (receiptData.returnEndDateManual) return;

      const endDate = calculateReturnEndDate(
        receiptData.returnStartDate,
        receiptData.returnDurationDays,
        receiptData.deliveryDate
      );

      setReceiptData((prev) => ({
        ...prev,
        returnEndDate: endDate,
      }));
    } else {
      setReceiptData((prev) => ({
        ...prev,
        returnEndDate: "",
        returnEndDateManual: false,
      }));
    }
  }, [
    receiptData.returnTracking,
    receiptData.returnStartDate,
    receiptData.returnDurationDays,
    receiptData.deliveryDate,
    receiptData.returnEndDateManual,
    setReceiptData,
  ]);

  // OCR-first upload flow
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    originalHandleFileChange(file);

    try {
      setOCRError(null);
      setOCRState(OCR_STATES.PROCESSING);

      const result = await extractReceiptData(file);

      setOCRData(result);

      setReceiptData((prev) => ({
        ...prev,
        productName: result.productName || prev.productName,
        storeName: result.storeName || prev.storeName,
        purchaseDate: result.purchaseDate || prev.purchaseDate,
        amount: result.amount || prev.amount,
      }));

      setOCRState(OCR_STATES.REVIEW);
    } catch (error) {
      console.error(error);
      setOCRError(error.message);
      setOCRState(OCR_STATES.FAILED);
    }
  };

  const handleRetryOCR = async () => {
    if (!receiptData.receiptImage) return;

    try {
      setOCRError(null);
      setOCRState(OCR_STATES.PROCESSING);

      const result = await extractReceiptData(receiptData.receiptImage);

      setOCRData(result);

      setReceiptData((prev) => ({
        ...prev,
        productName: result.productName || prev.productName,
        storeName: result.storeName || prev.storeName,
        purchaseDate: result.purchaseDate || prev.purchaseDate,
        amount: result.amount || prev.amount,
      }));

      setOCRState(OCR_STATES.REVIEW);
    } catch (error) {
      console.error(error);
      setOCRError(error.message);
      setOCRState(OCR_STATES.FAILED);
    }
  };

  const handleManualEntry = () => {
    setOCRState(OCR_STATES.REVIEW);
  };

  const handleSaveReceipt = async () => {
    const result = validateReceipt();

    setErrors(result.errors);

    if (!result.isValid) {
      toast.error(Object.values(result.errors)[0]);
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    try {
      const uid = user.uid;

      const imageUrl = await uploadReceiptImage(
        receiptData.receiptImage,
        uid
      );

      const receiptId = await saveReceipt({
        ...receiptData,
        receiptImage: imageUrl,
        userId: uid,
        returnTracking: receiptData.returnTracking,
        platform: receiptData.platform,
        returnType: receiptData.returnType,
        returnDurationDays: Number(receiptData.returnDurationDays),
        returnStartDate: receiptData.returnStartDate,
        returnEndDate: receiptData.returnEndDate,
      });

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

      {ocrState === OCR_STATES.PROCESSING && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <OCRProcessingScreen image={previewImage} />
          </div>
        </div>
      )}

      {ocrState === OCR_STATES.FAILED && (
        <OCRFailureState
          image={previewImage}
          onRetry={handleRetryOCR}
          onManualEntry={handleManualEntry}
        />
      )}

      {ocrState === OCR_STATES.REVIEW && (
        <OCRReviewBanner confidence={ocrData?.confidence || 0.91} />
      )}

      {ocrState !== OCR_STATES.PROCESSING && (
        <>
          <ReceiptForm
            receiptData={receiptData}
            onInputChange={handleInputChange}
            errors={errors}
            ocrData={ocrData}
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
        </>
      )}
    </div>
  );
};

export default Upload;