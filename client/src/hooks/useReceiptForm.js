import { useState } from "react";

const initialReceiptData = {
  productName: "",

  storeName: "",
  category: "",
  amount: "",
  purchaseDate: "",
  paymentMethod: "",
  hasWarranty: false,
  warrantyDuration: "",
  warrantyExpiry: "",
  notes: "",
  receiptImage: null,
};

const useReceiptForm = () => {
  const [receiptData, setReceiptData] = useState(initialReceiptData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setReceiptData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (file) => {
    setReceiptData((prev) => ({
      ...prev,
      receiptImage: file,
    }));

    setErrors((prev) => ({
      ...prev,
      receiptImage: "",
    }));
  };

  const validateReceipt = () => {
    const errors = {};

    if (!receiptData.productName.trim()) {
  errors.productName = "Product Name is required";
}

    if (!receiptData.storeName.trim()) {
      errors.storeName = "Store Name is required";
    }

    if (!receiptData.category) {
      errors.category = "Category is required";
    }

    if (!receiptData.amount) {
      errors.amount = "Amount is required";
    } else if (Number(receiptData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!receiptData.purchaseDate) {
      errors.purchaseDate = "Purchase Date is required";
    }

    if (!receiptData.paymentMethod) {
      errors.paymentMethod = "Payment Method is required";
    }

    if (!receiptData.receiptImage) {
      errors.receiptImage = "Receipt image is required";
    }

    if (receiptData.hasWarranty) {
      if (!receiptData.warrantyDuration) {
        errors.warrantyDuration = "Warranty Duration is required";
      }

      if (!receiptData.warrantyExpiry) {
        errors.warrantyExpiry = "Warranty Expiry is required";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    receiptData,
    setReceiptData,
    errors,
    setErrors,
    handleInputChange,
    handleFileChange,
    validateReceipt,
  };
};

export default useReceiptForm;