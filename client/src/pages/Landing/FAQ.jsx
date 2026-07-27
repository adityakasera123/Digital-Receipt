import { useState } from "react";

const faqs = [
  {
    question: "Is Billvora free to use?",
    answer:
      "Yes. You can start using Billvora for free and securely organize your receipts, warranties, and purchase history.",
  },
  {
    question: "Can I upload receipts from any store?",
    answer:
      "Yes. Billvora supports receipts from both online and offline purchases.",
  },
  {
    question: "Will I get warranty reminders?",
    answer:
      "Absolutely. Billvora reminds you before your warranty expires, so you never miss important dates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data belongs to you and is stored securely with authenticated access.",
  },
  {
    question: "Can I search old receipts?",
    answer:
      "Yes. Search by product name, store, purchase date, or category to find receipts instantly.",
  },
  {
    question: "What if I lose the paper receipt?",
    answer:
      "Once it's saved in Billvora, you always have a digital copy ready whenever you need it.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <section className="container-custom py-32">

      <div className="mx-auto max-w-3xl text-center">

        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          QUESTIONS?
        </p>

        <h2 className="mt-5 text-5xl font-semibold text-white leading-tight">
          We've Got You Covered.
        </h2>

        <p className="mt-6 text-lg text-zinc-400 leading-8">
          Everything you need to know before getting started with Billvora.
        </p>

      </div>

      <div className="mx-auto mt-20 max-w-4xl space-y-5">

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-[#101012]"
          >

            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between p-6 text-left"
            >

              <h3 className="text-lg font-medium text-white">
                {faq.question}
              </h3>

              <span className="text-2xl text-zinc-400">
                {open === index ? "−" : "+"}
              </span>

            </button>

            {open === index && (

              <div className="border-t border-white/10 px-6 py-5">

                <p className="leading-7 text-zinc-400">
                  {faq.answer}
                </p>

              </div>

            )}

          </div>

        ))}

      </div>

      <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-white/10 bg-[#101012] p-10 text-center">

        <h3 className="text-3xl font-semibold text-white">
          Still have questions?
        </h3>

        <p className="mt-4 text-zinc-400">
          We're here to help you whenever you need us.
        </p>

        <button className="mt-8 rounded-full bg-white px-8 py-3 font-medium text-black">
          Contact Us
        </button>

      </div>

    </section>
  );
}

export default FAQ;