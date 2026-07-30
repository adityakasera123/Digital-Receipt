import { Search, Plus } from "lucide-react";
function ReceiptSearch({ searchTerm, setSearchTerm })  {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Box */}
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search receipts..."
          value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
         className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Add Button */}
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
        <Plus size={18} />
        Add Receipt
      </button>
    </div>
  );
}

export default ReceiptSearch;