import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Folder,
  Bell,
  Check,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  CalendarDays,
  Receipt,
  ShieldCheck,
  CircleCheck,
} from "lucide-react";

const reveal = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#08090a] py-28 sm:py-36">
      {/* =====================================================
          AMBIENT LIGHTING
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft top light */}
        <div className="absolute left-1/2 top-[-420px] h-[760px] w-[1000px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[170px]" />

        {/* Left ambient light */}
        <div className="absolute left-[-250px] top-[28%] h-[560px] w-[560px] rounded-full bg-zinc-300/[0.018] blur-[160px]" />

        {/* Right ambient light */}
        <div className="absolute right-[-280px] top-[62%] h-[600px] w-[600px] rounded-full bg-white/[0.018] blur-[180px]" />

        {/* Center subtle light */}
        <div className="absolute left-1/2 top-[45%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.012] blur-[180px]" />

        {/* Very subtle dots */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Vertical guide */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.018]" />
      </div>

      <div className="container-custom relative">
        {/* =====================================================
            HEADING
        ====================================================== */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-white/[0.1]" />

            <p className="text-[10px] font-semibold tracking-[0.32em] text-zinc-500">
              HOW IT WORKS
            </p>

            <span className="h-px w-8 bg-white/[0.1]" />
          </div>

          <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl">
            From receipt
            <br />
            <span className="text-zinc-500">
              to everything in order.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-8 text-zinc-400">
            A simple way to keep track of purchases, receipts, and
            warranties without losing the details that matter.
          </p>
        </motion.div>

        {/* =====================================================
            STEP 01
        ====================================================== */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-28 grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]"
        >
          {/* TEXT */}

          <div className="lg:pr-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-600">
                01
              </span>

              <div className="h-px w-10 bg-white/[0.1]" />

              <span className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">
                ADD YOUR PURCHASE
              </span>
            </div>

            <h3 className="mt-9 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl">
              Keep the proof.
              <br />

              <span className="text-zinc-500">
                Leave the clutter behind.
              </span>
            </h3>

            <p className="mt-7 max-w-md text-[15px] leading-8 text-zinc-400">
              Upload a receipt or invoice once and give it a permanent home.
              Important purchase details stay together instead of getting lost
              in your downloads or photo library.
            </p>

            <div className="mt-9 flex items-center gap-3 text-xs text-zinc-500">
              <Upload size={15} />

              <span>Receipts and invoices, kept together.</span>
            </div>
          </div>

          {/* VISUAL */}

          <div className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e10] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            {/* Top card highlight */}

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

            {/* Background light */}

            <div className="absolute left-1/2 top-[10%] h-[280px] w-[380px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[100px]" />

            {/* Top Bar */}

            <div className="relative flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-zinc-500" />

                <span className="text-[10px] font-medium tracking-[0.16em] text-zinc-500">
                  NEW PURCHASE
                </span>
              </div>

              <MoreHorizontal size={17} className="text-zinc-600" />
            </div>

            {/* Receipt */}

            <motion.div
              initial={{
                opacity: 0,
                y: 45,
                rotate: -4,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: -1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                rotate: 0,
              }}
              className="absolute left-[9%] top-[19%] z-10 w-[250px] border border-white/[0.1] bg-[#191a1d] p-6 shadow-[28px_35px_80px_rgba(0,0,0,0.5)] sm:w-[285px]"
            >
              {/* Receipt Header */}

              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                  <Receipt size={16} className="text-zinc-300" />
                </div>

                <span className="text-[9px] tracking-[0.16em] text-zinc-600">
                  RECEIPT
                </span>
              </div>

              {/* Receipt Details */}

              <div className="mt-7">
                <p className="text-sm font-medium text-white">
                  Apple Store
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  MacBook Air M4
                </p>

                <div className="mt-5 space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
                  <div className="h-1.5 w-[84%] rounded-full bg-white/[0.06]" />
                  <div className="h-1.5 w-[66%] rounded-full bg-white/[0.06]" />
                </div>
              </div>

              {/* Bottom */}

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <p className="text-[9px] text-zinc-600">
                    TOTAL AMOUNT
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    $1,299
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <CalendarDays size={12} />

                  Aug 2026
                </div>
              </div>
            </motion.div>

            {/* Small floating file */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="absolute right-[10%] top-[22%] hidden border border-white/[0.07] bg-[#121316] px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:block"
            >
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-zinc-500" />

                <span className="text-[9px] text-zinc-500">
                  invoice.pdf
                </span>
              </div>
            </motion.div>

            {/* Saved card */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.4,
              }}
              className="absolute bottom-[11%] right-[8%] z-20 w-[220px] border border-white/[0.08] bg-[#101114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:w-[245px]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <Folder size={16} className="text-zinc-300" />
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    Purchase saved
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Added to your vault
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2">
                  <CircleCheck size={13} className="text-zinc-400" />

                  <span className="text-[10px] text-zinc-500">
                    Record ready
                  </span>
                </div>

                <ArrowUpRight size={13} className="text-zinc-600" />
              </div>
            </motion.div>

            {/* Connection */}

            <div className="absolute left-[42%] top-[58%] h-px w-[28%] rotate-[21deg] bg-white/[0.08]" />
          </div>
        </motion.div>

        {/* DIVIDER */}

        <div className="my-28 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* =====================================================
            STEP 02
        ====================================================== */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
        >
          {/* VISUAL */}

          <div className="relative order-2 min-h-[470px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e10] shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:order-1">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

            {/* Sidebar */}

            <div className="absolute bottom-0 left-0 top-0 w-[145px] border-r border-white/[0.06] bg-white/[0.01] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                <span className="text-xs font-semibold text-white">
                  B
                </span>
              </div>

              <div className="mt-12 space-y-1">
                {["Overview", "Purchases", "Warranties"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2.5 text-[10px] ${
                        index === 1
                          ? "border border-white/[0.07] bg-white/[0.04] text-white"
                          : "text-zinc-600"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              <div className="absolute bottom-6 left-5 right-5 border-t border-white/[0.06] pt-5">
                <p className="text-[9px] text-zinc-700">
                  126 records
                </p>
              </div>
            </div>

            {/* Workspace */}

            <div className="ml-[145px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Purchases
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Everything in one place
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025]">
                  <Search size={14} className="text-zinc-500" />
                </div>
              </div>

              {/* Category cards */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <CategoryCard
                  title="Electronics"
                  count="18 purchases"
                  delay={0.1}
                />

                <CategoryCard
                  title="Home"
                  count="32 purchases"
                  delay={0.18}
                />

                <CategoryCard
                  title="Fashion"
                  count="41 purchases"
                  delay={0.26}
                />

                <CategoryCard
                  title="Other"
                  count="35 purchases"
                  delay={0.34}
                />
              </div>

              {/* Recent item */}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="mt-5 rounded-xl border border-white/[0.07] bg-[#111215] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                    <FileText size={14} className="text-zinc-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-200">
                      MacBook Air M4
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Apple Store · Electronics
                    </p>
                  </div>

                  <ArrowUpRight size={15} className="text-zinc-600" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* TEXT */}

          <div className="order-1 lg:order-2 lg:pl-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-600">
                02
              </span>

              <div className="h-px w-10 bg-white/[0.1]" />

              <span className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">
                STAY ORGANIZED
              </span>
            </div>

            <h3 className="mt-9 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl">
              Everything has
              <br />

              <span className="text-zinc-500">
                a place to live.
              </span>
            </h3>

            <p className="mt-7 max-w-md text-[15px] leading-8 text-zinc-400">
              Keep purchases structured and easy to revisit. Receipts,
              purchase information, and important records stay connected in
              one organized space.
            </p>

            <div className="mt-9 flex items-center gap-3 text-xs text-zinc-500">
              <Folder size={15} />

              <span>Clear records. Less searching.</span>
            </div>
          </div>
        </motion.div>

        {/* DIVIDER */}

        <div className="my-28 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* =====================================================
            STEP 03
        ====================================================== */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]"
        >
          {/* TEXT */}

          <div className="lg:pr-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-600">
                03
              </span>

              <div className="h-px w-10 bg-white/[0.1]" />

              <span className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">
                KEEP TRACK
              </span>
            </div>

            <h3 className="mt-9 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl">
              Know what needs
              <br />

              <span className="text-zinc-500">
                your attention.
              </span>
            </h3>

            <p className="mt-7 max-w-md text-[15px] leading-8 text-zinc-400">
              Track warranties and important dates without trying to remember
              everything yourself. The details are already where you need
              them.
            </p>

            <div className="mt-9 flex items-center gap-3 text-xs text-zinc-500">
              <Bell size={15} />

              <span>Important dates, easier to remember.</span>
            </div>
          </div>

          {/* VISUAL */}

          <div className="relative min-h-[450px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e10] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

            {/* Soft inner light */}

            <div className="absolute right-[10%] top-[5%] h-[250px] w-[250px] rounded-full bg-white/[0.018] blur-[90px]" />

            <div className="relative mx-auto max-w-[500px]">
              {/* Header */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Warranty timeline
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Coverage and important dates
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
                  <ShieldCheck size={16} className="text-zinc-400" />
                </div>
              </div>

              {/* Timeline */}

              <div className="mt-12">
                <TimelineItem
                  title="MacBook Air M4"
                  subtitle="112 days remaining"
                  progress="78%"
                  delay={0.1}
                />

                <TimelineItem
                  title="Sony Headphones"
                  subtitle="38 days remaining"
                  progress="42%"
                  delay={0.2}
                />

                <TimelineItem
                  title="Office Chair"
                  subtitle="202 days remaining"
                  progress="88%"
                  delay={0.3}
                />
              </div>

              {/* Reminder */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.45,
                  duration: 0.6,
                }}
                className="mt-9 flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#111215] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                  <Bell size={15} className="text-zinc-300" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-300">
                    Upcoming reminder
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    Sony Headphones · 38 days remaining
                  </p>
                </div>

                <ArrowUpRight size={14} className="text-zinc-600" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            CLOSING LINE
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-28 flex items-center justify-center gap-5"
        >
          <span className="h-px w-12 bg-white/[0.07]" />

          <p className="text-center text-[10px] font-medium tracking-[0.2em] text-zinc-600">
            UPLOAD · ORGANIZE · KEEP TRACK
          </p>

          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>
      </div>
    </section>
  );
}

/* =====================================================
    CATEGORY CARD
===================================================== */

function CategoryCard({ title, count, delay }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
      }}
      whileHover={{
        y: -3,
        borderColor: "rgba(255,255,255,0.14)",
      }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.035]">
        <Folder size={14} className="text-zinc-500" />
      </div>

      <p className="mt-6 text-xs font-medium text-zinc-200">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-zinc-600">
        {count}
      </p>
    </motion.div>
  );
}

/* =====================================================
    TIMELINE ITEM
===================================================== */

function TimelineItem({ title, subtitle, progress, delay }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay,
        duration: 0.5,
      }}
      className="relative border-l border-white/[0.08] pb-9 pl-7 last:pb-0"
    >
      <div className="absolute -left-[4px] top-1 h-2 w-2 rounded-full border border-white/[0.15] bg-[#0d0e10]" />

      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-zinc-200">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-zinc-600">
            {subtitle}
          </p>
        </div>

        <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[9px] text-zinc-500">
          ACTIVE
        </span>
      </div>

      <div className="mt-4 h-[2px] w-full overflow-hidden bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: progress }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: delay + 0.2,
            ease: "easeOut",
          }}
          className="h-full bg-zinc-300/50"
        />
      </div>
    </motion.div>
  );
}

export default HowItWorks;