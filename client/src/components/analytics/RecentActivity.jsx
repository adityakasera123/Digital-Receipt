import { Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';

function RecentActivity({ receipts = [] }) {
  const navigate = useNavigate();
  const recentReceipts = [...receipts].slice(0, 5);

  return (
    <Card className='transition-theme'>
      <div className='mb-6 flex items-start justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-primary'>
            Recent Activity
          </h2>

          <p className='mt-2 text-secondary'>
            Latest receipt activity.
          </p>
        </div>

        <button
          onClick={() => navigate('/receipts')}
          className='text-sm font-medium text-blue-600 transition hover:text-blue-500'
        >
          View All →
        </button>
      </div>

      {recentReceipts.length === 0 ? (
        <div className='flex h-40 items-center justify-center text-secondary'>
          No recent activity
        </div>
      ) : (
        <div className='space-y-4'>
          {recentReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className='flex items-center justify-between rounded-2xl border border-default bg-surface p-4 transition-theme hover:bg-surface-hover'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100'>
                  <Receipt
                    size={20}
                    className='text-blue-600'
                  />
                </div>

                <div>
                  <h3 className='font-semibold text-primary'>
                    {receipt.productName || 'Untitled Product'}
                  </h3>

                  <p className='text-sm text-secondary'>
                    {receipt.storeName || 'Unknown Store'} • ₹
                    {Number(receipt.amount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <span className='text-sm text-secondary'>
                {receipt.purchaseDate || '--'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentActivity;