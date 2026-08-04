import { CalendarDays, IndianRupee, Store, Tag, ArrowRight } from "lucide-react";

const SearchResultCard = ({ receipt, onView }) => {
  const {
    productName,
    storeName,
    category,
    amount,
    purchaseDate,
  } = receipt;

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {productName}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Store size={16} />
            <span>{storeName}</span>
          </div>
        </div>

        <span
          className="
            rounded-full
            bg-blue-50
            px-3
            py-1
            text-xs
            font-medium
            text-blue-600
          "
        >
          {category}
        </span>
      </div>

      {/* Details */}
      <div className="mt-5 flex flex-wrap gap-5">
        <div className="flex items-center gap-2 text-gray-600">
          <IndianRupee size={16} />
          <span className="font-medium">
            ₹{Number(amount).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} />
          <span>{purchaseDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onView(receipt.id)}
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-blue-600
            transition-colors
            hover:text-blue-700
          "
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchResultCard;