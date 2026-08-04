function SearchSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* Icon */}
              <div className="h-14 w-14 rounded-full bg-slate-200" />

              {/* Title */}
              <div className="space-y-3">
                <div className="h-5 w-48 rounded bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-4 w-60 rounded bg-slate-200" />
              </div>
            </div>

            {/* Button */}
            <div className="h-8 w-28 rounded-full bg-slate-200" />
          </div>

          {/* Bottom */}
          <div className="mt-8 flex items-center justify-between">
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="h-5 w-28 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchSkeleton;