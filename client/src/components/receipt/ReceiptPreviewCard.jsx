import { FileImage, ImageIcon } from 'lucide-react';
import Card from '../ui/Card';

const ReceiptPreviewCard = ({ receiptData }) => {
  const previewUrl = receiptData.receiptImage
    ? typeof receiptData.receiptImage === 'string'
      ? receiptData.receiptImage
      : URL.createObjectURL(receiptData.receiptImage)
    : null;

  return (
    <Card className='transition-theme'>
      {/* Header */}
      <div className='mb-6 flex items-start justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-primary'>Receipt Preview</h2>

          <p className='mt-1 text-sm text-secondary'>
            Preview your uploaded receipt before saving.
          </p>
        </div>

        <span className='rounded-full bg-surface-hover px-3 py-1 text-xs font-semibold text-secondary'>
          {previewUrl ? 'Preview' : 'Empty'}
        </span>
      </div>

      {/* Preview Area */}
      <div className='flex min-h-[420px] items-center justify-center rounded-2xl border border-default bg-surface p-8 transition-theme'>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt='Receipt preview'
            className='max-h-[380px] w-auto rounded-xl object-contain'
          />
        ) : (
          <div className='flex flex-col items-center text-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-hover'>
              <FileImage size={36} className='text-secondary' />
            </div>

            <h3 className='mt-6 text-xl font-semibold text-primary'>
              No Receipt Selected
            </h3>

            <p className='mt-3 max-w-xs text-sm leading-6 text-secondary'>
              Upload a receipt to preview it before saving it to your digital
              receipt vault.
            </p>

            <div className='my-8 h-px w-full bg-[var(--border-color)]' />

            <div className='flex items-center gap-2 text-sm text-secondary'>
              <ImageIcon size={16} />
              PNG • JPG • JPEG • PDF
            </div>

            <p className='mt-3 text-xs text-secondary'>Waiting for upload...</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReceiptPreviewCard;