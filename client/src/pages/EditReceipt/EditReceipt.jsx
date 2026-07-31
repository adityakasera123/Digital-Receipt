import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import UploadWorkspace from "../../components/receipt/UploadWorkspace";
import ReceiptForm from "../../components/receipt/ReceiptForm";
import WarrantyForm from "../../components/receipt/WarrantyForm";
import NotesField from "../../components/receipt/NotesField";
import UploadActions from "../../components/receipt/UploadActions";

import useReceiptForm from "../../hooks/useReceiptForm";

import {
  getReceiptById,
  updateReceipt,
} from "../../services/receiptService";

import { uploadReceiptImage } from "../../services/storageService";

const EditReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const {
    receiptData,
    setReceiptData,
    errors,
    setErrors,
    handleInputChange,
    handleFileChange,
    validateReceipt,
  } = useReceiptForm();
    useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceiptById(id);

        if (!data) {
          toast.error("Receipt not found");
          navigate("/receipts");
          return;
        }

        setReceiptData(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);
  const handleUpdateReceipt = async () => {
  if (!validateReceipt()) return;

  try {
    let imageUrl = receiptData.receiptImage;

    // Agar user ne nayi image select ki hai
    if (receiptData.receiptImage instanceof File) {
      imageUrl = await uploadReceiptImage(receiptData.receiptImage);
    }

    const updatedReceipt = {
      ...receiptData,
      receiptImage: imageUrl,
    };

    await updateReceipt(id, updatedReceipt);

    toast.success("Receipt updated successfully");

    navigate(`/receipts/${id}`);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update receipt");
  }
};
if (loading) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <p className="text-slate-500">Loading...</p>
    </div>
  );
}
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
      mode="edit"
      onSave={handleUpdateReceipt}
    />
  </div>
);
};

export default EditReceipt;