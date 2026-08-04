import { SearchX } from "lucide-react";
import SearchResultCard from "./SearchResultCard";

function SearchResults({ results, onView }) {
  if (results.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <SearchX
              size={36}
              className="text-slate-500"
            />
          </div>

          {/* Title */}
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            No receipts found
          </h2>

          {/* Description */}
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            We couldn't find any receipts matching your search or
            selected filters.
          </p>

          {/* Suggestion */}
          <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-600">
              💡 Try searching with a different product name,
              store name or category.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {results.map((receipt) => (
        <SearchResultCard
          key={receipt.id}
          receipt={receipt}
          onView={onView}
        />
      ))}
    </div>
  );
}

export default SearchResults;