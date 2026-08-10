import { CalendarDays, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

function ReceiptCard({
  id,
  product,
  store,
  category,
  amount,
  purchaseDate,
  warrantyStatus,
}) {
  const isWarrantyActive = warrantyStatus === 'Active';

  return (
    <Link to={`/receipts/${id}`}>
      <Card className='h-full transition-theme hover:-translate-y-1 hover:shadow-xl'>
        {/* Top */}
        <div className='flex items-center justify-between'>
          <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600'>
            {category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isWarrantyActive
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {warrantyStatus}
          </span>
        </div>

        {/* Product */}
        <div className='mt-6 space-y-1'>
          <h3 className='text-xl font-semibold text-primary'>{product}</h3>

          <p className='text-sm text-secondary'>{store}</p>
        </div>

        {/* Price */}
        <div className='mt-6'>
          <p className='text-3xl font-bold text-primary'>{amount}</p>
        </div>

        {/* Bottom */}
        <div className='mt-6 flex items-center justify-between border-t border-default pt-4 text-sm text-secondary'>
          <div className='flex items-center gap-2'>
            <CalendarDays size={16} />
            <span>{purchaseDate}</span>
          </div>

          <div className='flex items-center gap-2'>
            <ShieldCheck
              size={16}
              className={isWarrantyActive ? 'text-green-500' : 'text-red-500'}
            />
            <span>Warranty</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ReceiptCard;