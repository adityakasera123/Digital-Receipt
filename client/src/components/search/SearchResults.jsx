import { SearchX } from "lucide-react";
import SearchResultCard from "./SearchResultCard";

const SearchResults = ({
  results,
  onView,
}) => {
  if (!results.length) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-dashed
          border-slate-300
          bg-white
          px-8
          py-16
          text-center
        "
      >
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-slate-100
          "
        >
          <SearchX
            size={30}
            className="text-slate-500"
          />
        </div>

        <h2 className="mt-6 text-xl font-semibold text-slate-900">
          No receipts found
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          We couldn't find any receipts matching your
          search or selected category.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Try a different keyword or choose another
          category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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