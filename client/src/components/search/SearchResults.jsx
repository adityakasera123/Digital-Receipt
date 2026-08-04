import SearchResultCard from "./SearchResultCard";

const SearchResults = ({ results, onView }) => {
  if (!results.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No receipts found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Try searching by product name, store name or category.
        </p>
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
};

export default SearchResults;