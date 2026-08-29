import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  X,
  Send,
  CheckCircle2,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // <-- apne existing Firebase path ke hisaab se check kar lena

const faqs = [
  {
    question: "Is Billvora free to use?",
    answer:
      "Yes. Billvora gives you an easy way to organize your purchases, store receipts, and keep important purchase information in one place.",
  },
  {
    question: "Can I upload receipts from any store?",
    answer:
      "Yes. You can save receipts and purchase records from different stores and keep them together in your personal Billvora library.",
  },
  {
    question: "Will I get warranty reminders?",
    answer:
      "Yes. Billvora helps you keep track of important warranty information so you can stay aware of upcoming expiry dates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your purchase information is connected to your account and handled using secure authentication and cloud infrastructure.",
  },
  {
    question: "Can I search old receipts?",
    answer:
      "Absolutely. Billvora makes it easier to find older purchases instead of manually searching through email, galleries, folders, or drawers.",
  },
  {
    question: "What if I lose the paper receipt?",
    answer:
      "Once your receipt or purchase information is saved in Billvora, you can access your stored digital record whenever you need it.",
  },
];

function FAQItem({ item, index, isOpen, onClick }) {
  return (
    <div className="group border-b border-white/[0.08] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="relative flex w-full items-center gap-5 px-5 py-7 text-left transition-colors duration-300 sm:px-8 sm:py-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-white/[0.025] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span
          className={`relative shrink-0 font-mono text-xs tracking-[0.2em] transition-colors duration-300 ${
            isOpen
              ? "text-orange-300"
              : "text-zinc-600 group-hover:text-zinc-400"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`relative flex-1 text-lg font-medium transition-colors duration-300 sm:text-xl ${
            isOpen
              ? "text-white"
              : "text-zinc-300 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>

        <span
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-orange-300/30 bg-orange-300/[0.08] text-orange-200"
              : "border-white/[0.08] text-zinc-500 group-hover:border-white/[0.16] group-hover:bg-white/[0.04] group-hover:text-zinc-200"
          }`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={18} strokeWidth={1.8} />
          </motion.div>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-[4.4rem] pr-16 sm:pl-[5.4rem]">
              <div className="h-px w-12 bg-gradient-to-r from-orange-300/60 to-transparent" />

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    try {
      setStatus("loading");

      await addDoc(collection(db, "contactMessages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
        status: "new",
      });

      setStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status !== "loading" ? onClose : undefined}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#111216] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          {/* Top line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange-200/70">
                  Contact Billvora
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  How can we help?
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Send us a message and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={status === "loading"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                aria-label="Close contact form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Success state */}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-14 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
                  <CheckCircle2 className="h-7 w-7 text-orange-200" />
                </div>

                <h4 className="mt-6 text-2xl font-semibold text-white">
                  Message sent.
                </h4>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                  Thanks for reaching out. We've received your message.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 rounded-full border border-white/[0.1] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.05]"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Your name
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled={status === "loading"}
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-orange-300/30 focus:bg-white/[0.025] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={status === "loading"}
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-orange-300/30 focus:bg-white/[0.025] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    How can we help?
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    disabled={status === "loading"}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-orange-300/30 focus:bg-white/[0.025] disabled:opacity-60"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send message

                      <Send
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#08090b] py-28 sm:py-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/[0.025] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="container-custom relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-orange-300/50" />

            <p className="text-xs font-medium uppercase tracking-[0.32em] text-orange-200/80">
              Questions
            </p>

            <span className="h-px w-8 bg-orange-300/50" />
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            We've got you covered.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            Everything you need to know before getting started with Billvora.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="flex items-center justify-between px-1 pb-5">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-600">
              Common questions
            </span>

            <span className="text-xs text-zinc-600">
              {String(faqs.length).padStart(2, "0")} answers
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#111216]/90 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
            {faqs.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0d0e11] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />
            </div>

            <div className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-400/70 to-transparent transition-all duration-500 group-hover:w-48" />

            <div className="relative">
              <p className="text-sm text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                Still need help?
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                We're here when you need us.
              </h3>

              <p className="mx-auto mt-4 max-w-md leading-7 text-zinc-400">
                Can't find the answer you're looking for? Get in touch and
                we'll help you out.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="group/button relative inline-flex h-12 items-center overflow-hidden rounded-full bg-white text-sm font-semibold text-zinc-950 transition-all duration-500 hover:px-7 hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)]"
                >
                  <span className="flex items-center gap-3 px-6 transition-transform duration-300 group-hover/button:-translate-x-1">
                    Contact us

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5">
                      <ArrowUpRight size={15} />
                    </span>
                  </span>
                </button>
              </div>

              <div className="mx-auto mt-5 h-5 overflow-hidden">
                <p className="translate-y-6 text-xs text-zinc-600 transition-transform duration-500 group-hover:translate-y-0">
                  Send us a message — we'll be happy to help.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <ContactModal
            onClose={() => setIsContactOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default FAQ;