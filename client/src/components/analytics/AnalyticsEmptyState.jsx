import { ReceiptText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnalyticsEmptyState = ({
  title = 'No Analytics Yet',
  description = 'Upload your first receipt to unlock analytics.',
}) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center rounded-3xl border border-dashed border-default bg-surface p-12 text-center transition-theme'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary'>
        <ReceiptText
          size={30}
          className='text-secondary'
        />
      </div>

      <h3 className='mt-6 text-xl font-semibold text-primary'>
        {title}
      </h3>

      <p className='mt-2 max-w-sm text-sm text-secondary'>
        {description}
      </p>

      <button
        onClick={() => navigate('/upload')}
        className='button-primary mt-8 rounded-xl px-6 py-3 text-sm font-semibold transition-theme'
      >
        Upload Receipt
      </button>
    </div>
  );
};

export default AnalyticsEmptyState;