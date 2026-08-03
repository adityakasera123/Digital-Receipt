function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">

      {/* ================= Header ================= */}
      <div>
        <div className="h-11 w-96 rounded-xl bg-gray-200" />

        <div className="mt-5 h-6 w-[34rem] rounded-lg bg-gray-100" />
      </div>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="h-4 w-28 rounded bg-gray-200" />

                <div className="h-10 w-24 rounded bg-gray-300" />

                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>

              <div className="h-14 w-14 rounded-2xl bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= Recent + Warranty ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Receipts */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-7 w-48 rounded bg-gray-200" />

            <div className="h-5 w-20 rounded bg-gray-100" />
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />

                  <div className="space-y-3">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-28 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-5 w-24 rounded bg-gray-200" />
                  <div className="ml-auto h-4 w-16 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Alerts */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-7 w-40 rounded bg-gray-200" />

            <div className="h-5 w-20 rounded bg-gray-100" />
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
              >
                <div className="h-11 w-11 rounded-xl bg-gray-200" />

                <div className="space-y-3">
                  <div className="h-5 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardSkeleton;