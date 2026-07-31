import { useEffect, useState } from "react";

import UploadWorkspace from "./UploadWorkspace";
import ReceiptForm from "./ReceiptForm";
import WarrantyForm from "./WarrantyForm";
import NotesField from "./NotesField";
import UploadActions from "./UploadActions";

const initialReceiptData = {
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

const ReceiptEditor = ({
  mode = "add",
  initialData,
  onSubmit,
}) => {
  const [receiptData, setReceiptData] = useState(
    initialData || initialReceiptData
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setReceiptData(initialData);
    }
  }, [initialData]);

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
  };

  return (
    <div className="space-y-8">
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
        mode={mode}
        onSave={() => onSubmit(receiptData, setErrors)}
      />
    </div>
  );
};

export default ReceiptEditor;