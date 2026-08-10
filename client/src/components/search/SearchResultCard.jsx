import {
  ArrowUpRight,
  CalendarDays,
  Store,
  Package,
} from 'lucide-react';
import Card from '../ui/Card';

const SearchResultCard = ({ receipt, onView }) => {
  const {
    id,
    productName,
    storeName,
    category,
    amount,
    purchaseDate,
  } = receipt;

  return (
    <Card className='group transition-theme hover:-translate-y-1 hover:shadow-lg'>
      <div className='flex items-start justify-between gap-6'>
        {/* Left */}
        <div className='flex flex-1 items-start gap-4'>
          {/* Icon */}
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100'>
            <Package
              size={24}
              className='text-blue-600'
            />
          </div>

          {/* Content */}
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-primary'>
              {productName}
            </h3>

            <div className='mt-2 flex items-center gap-2 text-sm text-secondary'>
              <Store size={15} />
              {storeName}
            </div>

            <div className='mt-4 flex flex-wrap items-center gap-6'>
              <div className='flex items-center gap-2 text-sm text-secondary'>
                <CalendarDays size={15} />
                <span>{purchaseDate}</span>
              </div>

              <p className='text-lg font-bold text-primary'>
                ₹{Number(amount).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='flex flex-col items-end justify-between'>
          <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'>
            {category}
          </span>

          <button
            onClick={() => onView(id)}
            className='mt-12 flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:text-blue-600'
          >
            View Details

            <ArrowUpRight
              size={16}
              className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1'
            />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SearchResultCard;