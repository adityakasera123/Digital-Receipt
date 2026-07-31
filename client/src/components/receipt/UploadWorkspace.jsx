import UploadPanel from "./UploadPanel";
import ReceiptPreviewCard from "./ReceiptPreviewCard";

const UploadWorkspace = ({ receiptData, onFileChange, errors }) => {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
<UploadPanel
  onFileChange={onFileChange}
  errors={errors}
/>

      <ReceiptPreviewCard receiptData={receiptData} />
    </section>
  );
};

export default UploadWorkspace;