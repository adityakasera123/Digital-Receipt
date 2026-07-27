const problems = [
  {
    title: "Need warranty?",
    text: "Can't find the receipt.",
  },
  {
    title: "Need an exchange?",
    text: "Invoice disappeared.",
  },
  {
    title: "Bought months ago?",
    text: "Don't remember where it is.",
  },
  {
    title: "Drawer full of bills?",
    text: "Still searching every time.",
  },
];

function ReceiptProblems() {
  return (
    <section className="container-custom py-32">

      <div className="mx-auto max-w-3xl text-center">

        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          REAL LIFE
        </p>

        <h2 className="mt-5 text-5xl font-semibold leading-tight text-white">
          Never Say...
          <br />
          <span className="text-zinc-400">
            "I know it's somewhere."
          </span>
        </h2>

        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Receipts usually disappear exactly when you need them.
          Billvora keeps every purchase ready whenever life asks for it.
        </p>

      </div>

      <div className="mx-auto mt-20 max-w-5xl rounded-3xl border border-white/10 bg-[#101012]">

        {problems.map((item, index) => (

          <div
            key={item.title}
            className={`grid items-center gap-10 p-8 lg:grid-cols-2 ${
              index !== problems.length - 1
                ? "border-b border-white/10"
                : ""
            }`}
          >

            <h3 className="text-2xl font-semibold text-white">
              {item.title}
            </h3>

            <p className="text-lg text-zinc-400">
              {item.text}
            </p>

          </div>

        ))}

      </div>

      <div className="mt-20 text-center">

        <p className="text-zinc-500">
          That's exactly why we built
        </p>

        <h2 className="mt-3 text-5xl font-semibold text-white">
          Billvora.
        </h2>

      </div>

      <div className="mx-auto mt-12 max-w-6xl rounded-3xl border border-white/10 bg-[#101012] p-8">

       <div className="mt-24 text-center">
  <p className="text-lg text-zinc-500">
    Life's already complicated.
  </p>

  <h2 className="mt-4 text-5xl font-semibold leading-tight text-white">
    Keeping receipts
    <br />
    shouldn't be.
  </h2>

  <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
    Billvora keeps your receipts, warranties, and purchase history organized,
    so they're always ready when you need them.
  </p>
</div>

<div className="mt-20 flex justify-center">
  <div className="h-px w-32 bg-white/10"></div>
</div>

      </div>

    </section>
  );
}

export default ReceiptProblems;