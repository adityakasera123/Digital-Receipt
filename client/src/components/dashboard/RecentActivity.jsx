import { Receipt } from 'lucide-react';
import Card from '../ui/Card';

function RecentActivity({ receipts = [] }) {
  const recentReceipts = [...receipts].slice(0, 5);

  return (
    <Card className='transition-theme'>
      <h2 className='text-2xl font-bold text-primary'>Recent Activity</h2>

      {recentReceipts.length === 0 ? (
        <div className='mt-6 flex h-40 items-center justify-center text-secondary'>
          No recent activity
        </div>
      ) : (
        <div className='mt-6 space-y-4'>
          {recentReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className='flex items-center justify-between rounded-2xl border border-default bg-surface p-4 transition-theme hover:bg-surface-hover'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100'>
                  <Receipt size={20} className='text-blue-600' />
                </div>

                <div>
                  <h3 className='font-semibold text-primary'>
                    Receipt Uploaded
                  </h3>

                  <p className='text-sm text-secondary'>
                    {receipt.productName || 'Untitled Product'} • ₹
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