import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const options = [
  {
    id: 'light',
    label: 'Light',
    description: 'Bright interface for daytime use',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Comfortable in low-light environments',
    icon: Moon,
  },
  {
    id: 'system',
    label: 'System',
    description: 'Match your device appearance',
    icon: Monitor,
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='space-y-3'>
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.id;

        return (
          <button
            key={option.id}
            type='button'
            onClick={() => setTheme(option.id)}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${
              active
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className='flex items-center gap-3'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  active ? 'bg-white/15' : 'bg-gray-100'
                }`}
              >
                <Icon className='h-5 w-5' />
              </div>

              <div className='text-left'>
                <p className='font-semibold'>{option.label}</p>
                <p
                  className={`text-sm ${
                    active ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {option.description}
                </p>
              </div>
            </div>

            {active && <Check className='h-5 w-5' />}
          </button>
        );
      })}
    </div>
  );
}