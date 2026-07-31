import UploadHeader from "../../components/receipt/UploadHeader";
import UploadWorkspace from "../../components/receipt/UploadWorkspace";
import ReceiptForm from "../../components/receipt/ReceiptForm";
import WarrantyForm from "../../components/receipt/WarrantyForm";
import NotesField from "../../components/receipt/NotesField";
import UploadActions from "../../components/receipt/UploadActions";

const Upload = () => {
  return (
    <div className="space-y-8">
      <UploadHeader />
      <UploadWorkspace />
      <ReceiptForm />
      <WarrantyForm />
      <NotesField />
      <UploadActions />
    </div>
  );
};

export default Upload;