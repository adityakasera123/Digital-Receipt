function HeroDashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0B0D] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
            B
          </div>

          <div>
            <h3 className="font-semibold text-white">Billvora</h3>
            <p className="text-sm text-zinc-500">
              Personal Purchase Vault
            </p>
          </div>
        </div>

        <div className="flex gap-3">

          <div className="hidden w-60 rounded-xl border border-white/10 bg-[#111113] px-4 py-2 text-sm text-zinc-500 md:block">
            Search receipts...
          </div>

          <div className="h-10 w-10 rounded-xl border border-white/10 bg-[#111113]" />

          <div className="h-10 w-10 rounded-full border border-white/10 bg-[#111113]" />

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 lg:grid-cols-4">

        {[
          ["126", "Receipts"],
          ["14", "Warranty"],
          ["3", "Expiring"],
          ["$8.2K", "Spent"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-[#111113] p-5"
          >
            <h2 className="text-3xl font-bold text-white">
              {value}
            </h2>

            <p className="mt-2 text-zinc-500">
              {label}
            </p>
          </div>
        ))}

      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-[#111113] p-6 lg:col-span-2">

          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Receipts
          </h3>

          <div className="space-y-3">

            {[1,2,3].map((item)=>(
              <div
                key={item}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-[#18181B] p-4"
              >
                <div>
                  <h4 className="text-white">Apple Store</h4>
                  <p className="text-sm text-zinc-500">
                    MacBook Air M4
                  </p>
                </div>

                <span className="text-emerald-300">
                  Active
                </span>
              </div>
            ))}

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111113] p-6">

          <h3 className="mb-5 text-lg font-semibold text-white">
            Receipt Preview
          </h3>

          <div className="rounded-xl bg-[#18181B] p-5">

            <div className="mb-6 h-40 rounded-xl bg-white/5"></div>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Store
                </span>

                <span className="text-white">
                  Apple
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Warranty
                </span>

                <span className="text-emerald-300">
                  365 Days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Amount
                </span>

                <span className="text-white">
                  $1299
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroDashboard;