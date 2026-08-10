import {
  Laptop,
  UtensilsCrossed,
  Plane,
  Package,
  ShoppingBag,
  Home,
  Car,
  HeartPulse,
} from 'lucide-react';
import Card from '../ui/Card';

const categoryIcons = {
  Electronics: {
    icon: Laptop,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    barColor: 'bg-blue-600',
  },
  Food: {
    icon: UtensilsCrossed,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    barColor: 'bg-green-500',
  },
  Travel: {
    icon: Plane,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    barColor: 'bg-orange-500',
  },
  Shopping: {
    icon: ShoppingBag,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    barColor: 'bg-purple-500',
  },
  Home: {
    icon: Home,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    barColor: 'bg-pink-500',
  },
  Transport: {
    icon: Car,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    barColor: 'bg-yellow-500',
  },
  Healthcare: {
    icon: HeartPulse,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    barColor: 'bg-red-500',
  },
  Others: {
    icon: Package,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    barColor: 'bg-gray-500',
  },
};

function ExpenseCategories({ categories = [] }) {
  const total = categories.reduce(
    (sum, category) => sum + Number(category.amount || 0),
    0
  );

  return (
    <Card className='transition-theme'>
      <h2 className='text-2xl font-bold text-primary'>Expense Categories</h2>

      {categories.length === 0 ? (
        <div className='mt-6 flex h-48 items-center justify-center text-secondary'>
          No category data available
        </div>
      ) : (
        <div className='mt-6 space-y-6'>
          {categories.map((category, index) => {
            const config = categoryIcons[category.name] || categoryIcons.Others;

            const Icon = config.icon;

            const percentage =
              total > 0
                ? Math.round((Number(category.amount) / total) * 100)
                : 0;

            return (
              <div key={index}>
                {/* Header */}
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBg}`}
                    >
                      <Icon size={18} className={config.iconColor} />
                    </div>

                    <div>
                      <h3 className='font-semibold text-primary'>
                        {category.name}
                      </h3>

                      <p className='text-sm text-secondary'>
                        ₹{Number(category.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <span className='text-sm font-medium text-secondary'>
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className='h-2.5 w-full rounded-full bg-surface'>
                  <div
                    className={`h-2.5 rounded-full ${config.barColor} transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default ExpenseCategories;