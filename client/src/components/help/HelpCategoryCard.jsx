import { ChevronRight } from 'lucide-react';

function HelpCategoryCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='group flex w-full items-start gap-4 rounded-3xl border border-default bg-surface p-6 text-left transition-theme hover:bg-surface-hover'
    >
      {/* Icon */}
      <div className='button-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl'>
        <Icon size={22} />
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-4'>
          <h3 className='font-semibold text-primary'>
            {title}
          </h3>

          <ChevronRight
            size={18}
            className='shrink-0 text-secondary transition-transform group-hover:translate-x-1'
          />
        </div>

        <p className='mt-2 text-sm leading-6 text-secondary'>
          {description}
        </p>
      </div>
    </button>
  );
}

export default HelpCategoryCard;