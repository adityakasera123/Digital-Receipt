const highlights = [
  {
    title: "Receipts",
    desc: "Keep every receipt organized in one secure place.",
  },
  {
    title: "Warranties",
    desc: "Know exactly when your warranty is about to expire.",
  },
  {
    title: "Purchase History",
    desc: "Revisit every purchase without searching through emails.",
  },
  {
    title: "Smart Search",
    desc: "Find any receipt in seconds whenever you need it.",
  },
];

function WhyBillvora() {
  return (
    <section className="container-custom py-32">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          BUILT FOR LIFE AFTER CHECKOUT
        </p>

        <h2 className="mt-5 text-5xl font-semibold leading-tight text-white">
          Shopping Doesn't End
          <br />
          After You Pay.
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Most apps help you buy products.
          <br />
          Billvora helps you manage everything that comes after.
        </p>
      </div>

      {/* Layout */}
      <div className="mt-24 grid items-center gap-10 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#101012] p-6">
            <div className="mb-5 h-12 w-12 rounded-2xl bg-white/5" />

            <h3 className="text-xl font-semibold text-white">
              {highlights[0].title}
            </h3>

            <p className="mt-3 leading-7 text-zinc-400">
              {highlights[0].desc}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101012] p-6">
            <div className="mb-5 h-12 w-12 rounded-2xl bg-white/5" />

            <h3 className="text-xl font-semibold text-white">
              {highlights[1].title}
            </h3>

            <p className="mt-3 leading-7 text-zinc-400">
              {highlights[1].desc}
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="flex justify-center">
          <div className="flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-[#101012] text-center">
            <div>
              <div className="mb-4 h-16 w-16 rounded-2xl bg-white/5 mx-auto" />

              <h3 className="text-3xl font-semibold text-white">
                Billvora
              </h3>

              <p className="mt-3 text-zinc-400">
                Your Digital
                <br />
                Purchase Vault
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#101012] p-6">
            <div className="mb-5 h-12 w-12 rounded-2xl bg-white/5" />

            <h3 className="text-xl font-semibold text-white">
              {highlights[2].title}
            </h3>

            <p className="mt-3 leading-7 text-zinc-400">
              {highlights[2].desc}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101012] p-6">
            <div className="mb-5 h-12 w-12 rounded-2xl bg-white/5" />

            <h3 className="text-xl font-semibold text-white">
              {highlights[3].title}
            </h3>

            <p className="mt-3 leading-7 text-zinc-400">
              {highlights[3].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyBillvora;