import { SearchX } from 'lucide-react';
import SearchResultCard from './SearchResultCard';

function SearchResults({ results, onView }) {
  if (results.length === 0) {
    return (
      <div className='rounded-3xl border border-default bg-surface p-12 transition-theme'>
        <div className='flex flex-col items-center justify-center text-center'>
          {/* Icon */}
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary'>
            <SearchX
              size={32}
              className='text-secondary'
            />
          </div>

          {/* Title */}
          <h2 className='mt-6 text-2xl font-bold text-primary'>
            No receipts found
          </h2>

          {/* Description */}
          <p className='mt-3 max-w-md text-sm leading-6 text-secondary'>
            We couldn't find any receipts matching your search or
            selected filters.
          </p>

          {/* Suggestion */}
          <div className='bg-surface-hover mt-8 rounded-2xl px-6 py-4'>
            <p className='text-sm text-secondary'>
              💡 Try searching with a different product name,
              store name or category.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {results.map((receipt) => (
        <SearchResultCard
          key={receipt.id}
          receipt={receipt}
          onView={() => onView(receipt.id)}
        />
      ))}
    </div>
  );
}

export default SearchResults;