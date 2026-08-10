import {
  Upload,
  ShieldPlus,
  Receipt,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import Card from '../ui/Card';

const actions = [
  {
    id: 1,
    title: 'Upload Receipt',
    subtitle: 'Add a new purchase receipt',
    icon: Upload,
  },
  {
    id: 2,
    title: 'Add Warranty',
    subtitle: 'Register a product warranty',
    icon: ShieldPlus,
  },
  {
    id: 3,
    title: 'View Receipts',
    subtitle: 'Browse all saved receipts',
    icon: Receipt,
  },
  {
    id: 4,
    title: 'Analytics',
    subtitle: 'View spending insights',
    icon: BarChart3,
  },
];

function QuickActions() {
  return (
    <Card className='transition-theme'>
      <h2 className='text-2xl font-bold text-primary'>Quick Actions</h2>

      <div className='mt-6 space-y-3'>
        {actions.map((action) => (
          <button
            key={action.id}
            className='group flex w-full items-center justify-between rounded-2xl border border-default bg-surface p-4 text-left transition-theme hover:bg-surface-hover'
          >
            <div className='flex items-center gap-4'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-surface border border-default transition-theme group-hover:bg-surface-hover'>
                <action.icon size={20} className='text-secondary' />
              </div>

              <div>
                <h3 className='font-semibold text-primary'>{action.title}</h3>

                <p className='text-sm text-secondary'>{action.subtitle}</p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className='text-secondary transition-transform duration-300 group-hover:translate-x-1'
            />
          </button>
        ))}
      </div>
    </Card>
  );
}

export default QuickActions;