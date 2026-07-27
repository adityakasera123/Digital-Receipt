function Features() {
  const features = [
    {
      title: "Store Receipts",
      desc: "Upload and organize all your receipts in one secure place.",
    },
    {
      title: "Warranty Tracking",
      desc: "Get reminders before your warranties expire.",
    },
    {
      title: "Smart Search",
      desc: "Find any receipt instantly with powerful search.",
    },
    {
      title: "Purchase History",
      desc: "View every purchase you've ever made in one dashboard.",
    },
    {
      title: "Secure Storage",
      desc: "Keep your receipts and invoices safe and encrypted.",
    },
    {
      title: "Access Anywhere",
      desc: "Access your purchase records anytime from any device.",
    },
  ];

  return (
    <section className="container-custom py-32">
      {/* Section Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          FEATURES
        </p>

        <h2 className="mt-5 text-5xl font-semibold text-white leading-tight">
          Everything You Need,
          <br />
          To Manage Every Purchase.
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Store receipts, track warranties, organize purchases, and keep
          everything securely accessible from one place.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-20 grid gap-6 lg:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/10 bg-[#101012] p-8"
          >
            {/* Icon Placeholder */}
            <div className="mb-8 h-12 w-12 rounded-2xl bg-white/5" />

            <h3 className="text-2xl font-semibold text-white">
              {feature.title}
            </h3>

            <p className="mt-4 leading-8 text-zinc-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;