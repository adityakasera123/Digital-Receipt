import clsx from 'clsx';

export default function Card({
  children,
  className = '',
  padding = 'p-6',
}) {
  return (
    <div
      className={clsx(
        'card-surface transition-theme',
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}