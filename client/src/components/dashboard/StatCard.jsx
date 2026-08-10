import { TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card className='flex items-start justify-between'>
      <div>
        <p className='text-sm font-medium text-secondary'>{title}</p>

        <h2 className='mt-3 text-3xl font-bold text-primary'>{value}</h2>

        <div className='mt-3 flex items-center gap-2'>
          <TrendingUp size={16} className='text-green-500' />

          <p className='text-sm text-secondary'>{subtitle}</p>
        </div>
      </div>

      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-default transition-theme'>
        <Icon size={22} className='text-secondary' />
      </div>
    </Card>
  );
}

export default StatCard;