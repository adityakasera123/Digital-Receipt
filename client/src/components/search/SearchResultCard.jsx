import {
  ArrowUpRight,
  CalendarDays,
  Store,
  Package,
} from "lucide-react";

const SearchResultCard = ({ receipt, onView }) => {
  const {
    id,
    productName,
    storeName,
    category,
    amount,
    purchaseDate,
  } = receipt;

  return (
    <article
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-6">
        {/* Left */}
        <div className="flex flex-1 gap-4">
          {/* Icon */}
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-slate-600
            "
          >
            <Package size={22} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {productName}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Store size={15} />
              {storeName}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={15} />
                <span>{purchaseDate}</span>
              </div>

              <p className="text-lg font-bold text-slate-900">
                ₹{Number(amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end justify-between">
          <span
            className="
              rounded-full
              bg-sky-50
              px-3
              py-1
              text-xs
              font-semibold
              text-sky-700
            "
          >
            {category}
          </span>

          <button
            onClick={() => onView(id)}
            className="
              mt-12
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-700
              transition-all
              duration-200
              hover:text-blue-600
            "
          >
            View Details

            <ArrowUpRight
              size={16}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default SearchResultCard;