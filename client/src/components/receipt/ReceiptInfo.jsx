import {
  Store,
  IndianRupee,
  CalendarDays,
  Folder,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import Card from '../ui/Card';

function ReceiptInfo({ receipt }) {
  return (
    <Card className='transition-theme'>
      <h2 className='text-2xl font-bold text-primary'>{receipt.storeName}</h2>

      <p className='mt-2 text-secondary'>
        Complete purchase information
      </p>

      <div className='mt-8 grid grid-cols-2 gap-6'>
        {/* Store */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <Store size={18} />
            <span className='text-sm'>Store</span>
          </div>

          <p className='mt-2 font-semibold text-primary'>
            {receipt.storeName}
          </p>
        </div>

        {/* Amount */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <IndianRupee size={18} />
            <span className='text-sm'>Amount</span>
          </div>

          <p className='mt-2 font-semibold text-primary'>
            ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Purchase Date */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <CalendarDays size={18} />
            <span className='text-sm'>Purchase Date</span>
          </div>

          <p className='mt-2 font-semibold text-primary'>
            {receipt.purchaseDate}
          </p>
        </div>

        {/* Category */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <Folder size={18} />
            <span className='text-sm'>Category</span>
          </div>

          <p className='mt-2 font-semibold text-primary'>
            {receipt.category}
          </p>
        </div>

        {/* Payment */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <CreditCard size={18} />
            <span className='text-sm'>Payment Method</span>
          </div>

          <p className='mt-2 font-semibold text-primary'>
            {receipt.paymentMethod}
          </p>
        </div>

        {/* Warranty */}
        <div>
          <div className='flex items-center gap-2 text-secondary'>
            <ShieldCheck size={18} />
            <span className='text-sm'>Warranty</span>
          </div>

          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              receipt.hasWarranty
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {receipt.hasWarranty ? 'Active' : 'No Warranty'}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default ReceiptInfo;