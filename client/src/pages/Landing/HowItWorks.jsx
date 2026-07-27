const steps = [
  {
    number: "01",
    title: "Upload Your Receipt",
    desc: "Upload a receipt or invoice securely to your Billvora vault.",
  },
  {
    number: "02",
    title: "Organize Automatically",
    desc: "Keep purchases, warranties, and invoices neatly organized.",
  },
  {
    number: "03",
    title: "Track Anytime",
    desc: "Search receipts and monitor warranties whenever you need.",
  },
];

function HowItWorks() {
  return (
    <section className="container-custom py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          HOW IT WORKS
        </p>

        <h2 className="mt-5 text-5xl font-semibold text-white">
          Three Simple Steps
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Store your receipts, organize purchases, and never lose track of a
          warranty again.
        </p>
      </div>

      <div className="mx-auto mt-24 max-w-3xl">
        {steps.map((step, index) => (
          <div key={step.number} className="relative pb-12 last:pb-0">
            {index !== steps.length - 1 && (
              <div className="absolute left-6 top-16 h-full w-px bg-white/10" />
            )}

            <div className="flex gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#101012] text-white font-semibold">
                {step.number}
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#101012] p-8 flex-1">
                <h3 className="text-2xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-zinc-400">
                  {step.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;