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

// Existing image OCR
import { runOCR } from "../../services/ocr";

// PDF text extraction
import { extractTextFromPDF } from "../../services/pdf/pdfService";

// PDF visual OCR fallback
import { runPDFOCRFallback } from "../../services/pdf/pdfOCRFallback";

// PDF-specific parser router
import { parsePDFReceipt } from "../../services/pdf/pdfParserRouter";

// Existing image OCR hook
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
    processReceipt,
  } = useOCR();

  // ==========================================
  // Preview URL
  // ==========================================

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

  // ==========================================
  // Auto calculate Return End Date
  // ==========================================

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

  // ==========================================
  // Validate PDF parser result
  // ==========================================

  const isPDFResultIncomplete = (result) => {
    if (!result) return true;

    const product =
      typeof result.productName === "string"
        ? result.productName.trim()
        : "";

    const store =
      typeof result.storeName === "string"
        ? result.storeName.trim()
        : "";

    const purchaseDate =
      typeof result.purchaseDate === "string"
        ? result.purchaseDate.trim()
        : "";

    const amount = Number(result.amount);

    // ------------------------------------------
    // Product sanity checks
    // ------------------------------------------

    const invalidProductPatterns = [
      /^page\s+\d+/i,
      /^\d+\s+of\s+\d+/i,
      /^e\.?\s*&?\s*o\.?\s*e\.?/i,
      /^signature/i,
      /^authorized signatory/i,
      /^tax invoice$/i,
      /^invoice$/i,
    ];

    const invalidProduct = invalidProductPatterns.some(
      (pattern) => pattern.test(product)
    );

    // ------------------------------------------
    // Date sanity checks
    // ------------------------------------------

    const dateParts = purchaseDate.split("-");

    const invalidDate =
      !purchaseDate ||
      dateParts.length !== 3 ||
      Number(dateParts[0]) < 2000 ||
      Number(dateParts[0]) > 2100 ||
      Number(dateParts[1]) < 1 ||
      Number(dateParts[1]) > 12 ||
      Number(dateParts[2]) < 1 ||
      Number(dateParts[2]) > 31;

    // ------------------------------------------
    // Amount sanity check
    // ------------------------------------------

    const invalidAmount =
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 100000000;

    return (
      !product ||
      invalidProduct ||
      !store ||
      invalidDate ||
      invalidAmount
    );
  };

  // ==========================================
  // Apply OCR/PDF result to Receipt Form
  // ==========================================

  const applyOCRResultToReceipt = (result) => {
    setOCRData(result);

    setReceiptData((prev) => ({
      ...prev,
      productName: result.productName || "",
      storeName: result.storeName || "",
      purchaseDate: result.purchaseDate || "",
      amount: result.amount || "",
      paymentMethod: result.paymentMethod || "",
      category: result.category || "",
    }));
  };

  // ==========================================
  // File Upload + OCR / PDF Processing
  // ==========================================

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Keep existing preview behavior
    originalHandleFileChange(file);

    // ==========================================
    // PDF FLOW
    // ==========================================

    if (file.type === "application/pdf") {
      try {
        setOCRError(null);
        setOCRState(OCR_STATES.PROCESSING);

        console.log(
          "================ PDF PROCESSING ================"
        );

        console.log("PDF File:", file.name);
        console.log("PDF Size:", file.size);
        console.log("PDF Type:", file.type);

        console.log(
          "================================================"
        );

        // ------------------------------------------
        // STEP 1
        // Extract embedded PDF text
        // ------------------------------------------

        const pdfResult = await extractTextFromPDF(file);

        console.log(
          "================ PDF TEXT ================"
        );

        console.log(pdfResult.text);
        console.log("PDF Pages:", pdfResult.pageCount);

        console.log(
          "=========================================="
        );

        // ------------------------------------------
        // STEP 2
        // PDF-specific existing parser routing
        // ------------------------------------------

        let result = parsePDFReceipt(
          pdfResult.text
        );

        console.log(
          "================ PDF PARSER RESULT ================"
        );

        console.log("Full Result:", result);
        console.log("Product:", result.productName);
        console.log("Store:", result.storeName);
        console.log("Date:", result.purchaseDate);
        console.log("Amount:", result.amount);
        console.log("Category:", result.category);

        console.log(
          "==================================================="
        );

        // ------------------------------------------
        // STEP 3
        // Fallback to visual OCR if result
        // is incomplete or obviously invalid
        // ------------------------------------------

        if (isPDFResultIncomplete(result)) {
          console.log(
            "PDF parser result is incomplete or invalid."
          );

          console.log(
            "Starting PDF visual OCR fallback..."
          );

          result = await runPDFOCRFallback(file);

          console.log(
            "================ PDF OCR FALLBACK RESULT ================"
          );

          console.log("Full Result:", result);
          console.log("Product:", result.productName);
          console.log("Store:", result.storeName);
          console.log("Date:", result.purchaseDate);
          console.log("Amount:", result.amount);
          console.log("Category:", result.category);

          console.log(
            "=========================================================="
          );
        }

        // ------------------------------------------
        // STEP 4
        // Apply final result
        // ------------------------------------------

        applyOCRResultToReceipt(result);

        console.log(
          "Setting PDF Receipt State:",
          {
            productName: result.productName,
            storeName: result.storeName,
            purchaseDate: result.purchaseDate,
            amount: result.amount,
            category: result.category,
          }
        );

        setOCRState(OCR_STATES.REVIEW);

        return;
      } catch (error) {
        console.error(
          "PDF Processing Error:",
          error
        );

        setOCRError(
          error.message ||
            "PDF processing failed"
        );

        setOCRState(OCR_STATES.FAILED);

        return;
      }
    }

    // ==========================================
    // EXISTING IMAGE OCR FLOW
    // ==========================================

    try {
      setOCRError(null);
      setOCRState(OCR_STATES.PROCESSING);

      const result = await processReceipt(file);

      console.log(
        "================ RAW OCR TEXT ================"
      );

      console.log(result.text);

      console.log(
        "==============================================="
      );

      console.log(
        "================ OCR RESULT ================"
      );

      console.log("Full Result:", result);
      console.log("Product:", result.productName);
      console.log("Store:", result.storeName);
      console.log("Date:", result.purchaseDate);
      console.log("Amount:", result.amount);
      console.log("Category:", result.category);

      console.log(
        "============================================"
      );

      applyOCRResultToReceipt(result);

      console.log(
        "Setting Receipt State:",
        {
          productName: result.productName,
          storeName: result.storeName,
          purchaseDate: result.purchaseDate,
          amount: result.amount,
          category: result.category,
        }
      );

      setOCRState(OCR_STATES.REVIEW);
    } catch (error) {
      console.error(error);

      setOCRError(
        error.message || "OCR failed"
      );

      setOCRState(OCR_STATES.FAILED);
    }
  };

  // ==========================================
  // Retry OCR
  // ==========================================

  const handleRetryOCR = async () => {
    if (!receiptData.receiptImage) return;

    // ==========================================
    // PDF RETRY
    // ==========================================

    if (
      receiptData.receiptImage instanceof File &&
      receiptData.receiptImage.type ===
        "application/pdf"
    ) {
      try {
        setOCRError(null);
        setOCRState(OCR_STATES.PROCESSING);

        console.log(
          "================ PDF RETRY ================"
        );

        // ------------------------------------------
        // Normal PDF text extraction
        // ------------------------------------------

        const pdfResult =
          await extractTextFromPDF(
            receiptData.receiptImage
          );

        console.log(
          "PDF Retry Text:",
          pdfResult.text
        );

        console.log(
          "PDF Retry Pages:",
          pdfResult.pageCount
        );

        // ------------------------------------------
        // PDF-specific parser router
        // ------------------------------------------

        let result = parsePDFReceipt(
          pdfResult.text
        );

        // ------------------------------------------
        // Fallback if result is invalid/incomplete
        // ------------------------------------------

        if (isPDFResultIncomplete(result)) {
          console.log(
            "PDF retry result incomplete or invalid."
          );

          console.log(
            "Starting PDF OCR fallback..."
          );

          result = await runPDFOCRFallback(
            receiptData.receiptImage
          );
        }

        console.log(
          "================ PDF RETRY RESULT ================"
        );

        console.log(result);

        console.log(
          "==================================================="
        );

        applyOCRResultToReceipt(result);

        setOCRState(OCR_STATES.REVIEW);
      } catch (error) {
        console.error(
          "PDF Retry Error:",
          error
        );

        setOCRError(
          error.message ||
            "PDF processing failed"
        );

        setOCRState(OCR_STATES.FAILED);
      }

      return;
    }

    // ==========================================
    // EXISTING IMAGE OCR RETRY
    // ==========================================

    try {
      setOCRError(null);
      setOCRState(OCR_STATES.PROCESSING);

      const result = await processReceipt(
        receiptData.receiptImage
      );

      console.log(
        "================ OCR RETRY ================"
      );

      console.log(result);

      console.log(
        "==========================================="
      );

      applyOCRResultToReceipt(result);

      setOCRState(OCR_STATES.REVIEW);
    } catch (error) {
      console.error(error);

      setOCRError(
        error.message || "OCR failed"
      );

      setOCRState(OCR_STATES.FAILED);
    }
  };

  // ==========================================
  // Manual Entry
  // ==========================================

  const handleManualEntry = () => {
    setOCRState(OCR_STATES.REVIEW);
  };

  // ==========================================
  // Save Receipt
  // ==========================================

  const handleSaveReceipt = async () => {
    const result = validateReceipt();

    setErrors(result.errors);

    if (!result.isValid) {
      toast.error(
        Object.values(result.errors)[0]
      );

      return;
    }

    if (!user) {
      toast.error("Please login first.");

      return;
    }

    try {
      const uid = user.uid;

      const imageUrl =
        await uploadReceiptImage(
          receiptData.receiptImage,
          uid
        );

      const receiptId =
        await saveReceipt({
          ...receiptData,
          receiptImage: imageUrl,
          userId: uid,

          // Return Tracking
          returnTracking:
            receiptData.returnTracking,

          platform:
            receiptData.platform,

          returnType:
            receiptData.returnType,

          returnDurationDays: Number(
            receiptData.returnDurationDays
          ),

          returnStartDate:
            receiptData.returnStartDate,

          returnEndDate:
            receiptData.returnEndDate,
        });

      if (receiptData.hasWarranty) {
        await saveWarranty({
          receiptId,

          productName:
            receiptData.productName,

          storeName:
            receiptData.storeName,

          category:
            receiptData.category,

          purchaseDate:
            receiptData.purchaseDate,

          warrantyDuration:
            receiptData.warrantyDuration,

          expiryDate:
            receiptData.warrantyExpiry,

          userId: uid,
        });
      }

      toast.success(
        "Receipt saved successfully!"
      );

      navigate("/receipts");
    } catch (error) {
      console.error(error);

      toast.error(
        "Receipt save failed!"
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

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
            <OCRProcessingScreen
              image={previewImage}
            />
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
        <OCRReviewBanner
          confidence={
            ocrData?.confidence || 0.98
          }
        />
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