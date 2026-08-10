import { Search, Plus } from 'lucide-react';

function ReceiptSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
      {/* Search Box */}
      <div className='relative w-full max-w-xl'>
        <Search
          size={18}
          className='absolute left-4 top-1/2 -translate-y-1/2 text-secondary'
        />

        <input
          type='text'
          placeholder='Search receipts...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='input-surface w-full py-3 pl-11 pr-4 text-sm'
        />
      </div>

      {/* Add Button */}
      <button className='button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium'>
        <Plus size={18} />
        Add Receipt
      </button>
    </div>
  );
}

export default ReceiptSearch;