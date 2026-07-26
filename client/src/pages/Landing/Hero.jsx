function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Top Glow */}
      <div className="absolute left-1/2 top-[-650px] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[350px]" />

      <div className="absolute left-1/2 top-[-150px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/5 blur-[180px]" />

      <div className="container-custom">
        <div className="flex min-h-screen flex-col items-center pt-[150px]  text-center">
          {/* Badge */}
          <div className="mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-400 backdrop-blur-xl">
            ✨ Smart Receipt Management
          </div>

          {/* Heading */}
          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.04em] leading-[0.99] md:text-[78px]">
           Every Receipt.
            <br />
            One{" "}
            <span className="text-emerald-100">
              Secure
            </span>{" "}
            Vault.
          </h1>

          {/* Subtitle */}
          <p className="mt-[40px] max-w-2xl text-lg leading-8 text-zinc-400">
            Store receipts, invoices and warranties in one secure place.
            Get reminders before warranties expire and keep every purchase
            organized forever.
          </p>

          {/* Buttons */}
          <div className="mt-[56px] flex items-center gap-5">
            <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]">
              Get Started
            </button>

            <button className="rounded-full border border-white/10 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-500 hover:bg-white/5">
              View Demo
            </button>
          </div>

          {/* Dashboard Placeholder */}
         {/* Hero Dashboard */}
<div className="relative mt-[110px] w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0B0D] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

  {/* Header */}
  <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
        B
      </div>

      <div>
        <h3 className="text-white font-semibold">
          Billvora
        </h3>

        <p className="text-xs text-zinc-500">
          Personal Purchase Vault
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-64 rounded-xl border border-white/10 bg-[#111113] px-4 py-1.5 text-sm text-zinc-500">
        Search receipts...
      </div>

      <div className="h-10 w-10 rounded-xl border border-white/10 bg-[#111113]" />

      <div className="h-10 w-10 rounded-full border border-white/10 bg-[#111113]" />
    </div>
  </div>

  {/* Body */}
  <div className="p-6">

    <div className="grid grid-cols-3 gap-5">

      {/* Recent Receipts */}
     <div className="col-span-2 rounded-2xl border border-white/10 bg-[#111113] p-5">
  <div className="mb-6 flex items-center justify-between">
    <h4 className="text-lg font-semibold text-white">
      Recent Receipts
    </h4>

    <button className="text-sm text-zinc-400 hover:text-white transition-colors">
      View All
    </button>
  </div>

  <div className="space-y-3">

    {/* Receipt 1 */}
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#18181B] px-5 py-3 transition-all hover:border-white/15">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black font-semibold">
          A
        </div>

        <div>
          <h5 className="font-medium text-white">
            Apple Store
          </h5>

          <p className="text-sm text-zinc-500">
            MacBook Air M4 • Jul 12
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">
          $1,299
        </p>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Active
        </span>
      </div>
    </div>

    {/* Receipt 2 */}
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#18181B] px-5 py-3 transition-all hover:border-white/15">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black font-semibold">
          S
        </div>

        <div>
          <h5 className="font-medium text-white">
            Samsung
          </h5>

          <p className="text-sm text-zinc-500">
            Galaxy Watch • Jul 03
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">
          $249
        </p>

        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
          182 Days
        </span>
      </div>
    </div>

    {/* Receipt 3 */}
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#18181B] px-5 py-3 transition-all hover:border-white/15">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black font-semibold">
          B
        </div>

        <div>
          <h5 className="font-medium text-white">
            Boat Lifestyle
          </h5>

          <p className="text-sm text-zinc-500">
            Airdopes 311 • Jun 25
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">
          $49
        </p>

        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300">
          21 Days Left
        </span>
      </div>
    </div>

  </div>
</div>

      {/* Receipt Preview */}
      <div className="rounded-3xl border border-white/10 bg-[#111113] p-6">

  <h4 className="mb-5 text-lg font-semibold text-white">
    Receipt Preview
  </h4>

  <div className="rounded-2xl border border-white/10 bg-[#18181B] p-5">

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-500">
          Store
        </p>

        <h3 className="mt-1 text-white font-semibold">
          Apple Store
        </h3>
      </div>

      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
        Active
      </span>
    </div>

    <div className="my-5 h-px bg-white/10" />

    <div className="space-y-4">

      <div className="flex justify-between">
        <span className="text-zinc-500">
          Product
        </span>

        <span className="text-white">
          MacBook Air M4
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-zinc-500">
          Purchase
        </span>

        <span className="text-white">
          Jul 12, 2026
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

        <span className="font-semibold text-white">
          $1,299
        </span>
      </div>

    </div>

    <button className="mt-6 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-white transition hover:bg-white/5">
      View Invoice
    </button>

  </div>

</div>

    </div>

    {/* Warranty */}
    <div className="mt-6 rounded-3xl border border-white/10 bg-[#111113] p-6">

      <h4 className="mb-5 text-lg font-semibold text-white">
        Warranty Timeline
      </h4>

      <div className="h-20 rounded-2xl bg-white/5" />

    </div>

  </div>
</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;