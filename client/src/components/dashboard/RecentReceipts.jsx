import { ChevronRight, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';

function RecentReceipts({ receipts = [] }) {
  const navigate = useNavigate();

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          Recent Receipts
        </h2>

        <button
          type="button"
          onClick={() => navigate('/receipts')}
          className="flex items-center gap-1 text-sm font-medium text-primary transition hover:opacity-80"
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Empty State */}
      {receipts.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No receipts yet"
          description="Upload your first receipt to start tracking purchases."
        />
      ) : (
        <div className="divide-y divide-[var(--border-color)]">
          {receipts
            .slice()
            .sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              return b.createdAt.seconds - a.createdAt.seconds;
            })
            .slice(0, 5)
            .map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-center justify-between py-4 transition-theme"
              >
                <div>
                  <h3 className="font-semibold text-primary">
                    {receipt.productName}
                  </h3>

                  <p className="text-sm text-secondary">
                    {receipt.storeName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
                  </p>

                  <p className="text-sm text-secondary">
                    {receipt.purchaseDate}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}

export default RecentReceipts;