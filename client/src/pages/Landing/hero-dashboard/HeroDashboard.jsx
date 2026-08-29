import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Box,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Home,
  LayoutGrid,
  Package,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    value: "126",
    label: "Receipts",
    meta: "+12 this month",
    icon: ReceiptText,
    iconClass: "text-zinc-400",
  },
  {
    value: "14",
    label: "Protected",
    meta: "Active warranties",
    icon: ShieldCheck,
    iconClass: "text-zinc-400",
  },
  {
    value: "3",
    label: "Expiring",
    meta: "Needs attention",
    icon: Bell,
    iconClass: "text-amber-400",
  },
  {
    value: "$8.2K",
    label: "Spent",
    meta: "+18% this year",
    icon: TrendingUp,
    iconClass: "text-zinc-400",
  },
];

const receipts = [
  {
    store: "Apple Store",
    item: "MacBook Air M4",
    amount: "$1,299",
    date: "Today",
    initial: "A",
  },
  {
    store: "Sony",
    item: "WH-1000XM5",
    amount: "$349",
    date: "Yesterday",
    initial: "S",
  },
  {
    store: "Amazon",
    item: "Kindle Paperwhite",
    amount: "$160",
    date: "Aug 21",
    initial: "A",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HeroDashboard() {
  const dashboardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (event) => {
    if (shouldReduceMotion || window.innerWidth < 1024) return;

    const element = dashboardRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.setProperty("--rotate-x", `${y * -1.2}deg`);
    element.style.setProperty("--rotate-y", `${x * 1.2}deg`);
  };

  const handleMouseLeave = () => {
    const element = dashboardRef.current;

    if (!element) return;

    element.style.setProperty("--rotate-x", "0deg");
    element.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="relative mx-auto w-full max-w-[1450px] px-3 md:px-6"
    >
      {/* Dashboard glow */}
      <div className="pointer-events-none absolute inset-x-[10%] top-[15%] -z-10 h-[70%] bg-emerald-500/[0.035] blur-[120px]" />

      <motion.div
        variants={fadeUp}
        ref={dashboardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.09]
          bg-[#0b0c0e]
          shadow-[0_35px_100px_rgba(0,0,0,0.5)]
          transition-transform
          duration-300
          ease-out
          will-change-transform
        "
        style={{
          transform:
            "perspective(1800px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))",
        }}
      >
        {/* Subtle internal background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.025),transparent_35%)]" />

        {/* ================= HEADER ================= */}

        <motion.div
          variants={fadeUp}
          className="
            relative
            flex
            items-center
            justify-between
            border-b
            border-white/[0.07]
            px-5
            py-4
            md:px-8
          "
        >
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white text-sm font-bold text-black shadow-lg">
              B
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-white">
                Overview
              </h3>

              <p className="mt-0.5 text-xs text-zinc-500">
                Your purchase activity
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 md:flex">
              <Search size={17} className="text-zinc-500" />

              <span className="text-sm text-zinc-500">
                Search receipts...
              </span>
            </div>

            <button
              type="button"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.02]
                text-zinc-400
              "
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
              AK
            </div>
          </div>
        </motion.div>

        {/* ================= DASHBOARD ================= */}

        <div className="relative grid lg:grid-cols-[82px_1fr]">
          {/* Sidebar */}
          <motion.aside
            variants={fadeUp}
            className="
              hidden
              border-r
              border-white/[0.07]
              bg-white/[0.012]
              py-6
              lg:flex
              lg:flex-col
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex flex-col gap-3">
              <SidebarIcon icon={Home} active />
              <SidebarIcon icon={ReceiptText} />
              <SidebarIcon icon={ShieldCheck} />
              <SidebarIcon icon={LayoutGrid} />
            </div>

            <SidebarIcon icon={Settings} />
          </motion.aside>

          {/* Main */}
          <main className="p-4 sm:p-6 md:p-8">
            {/* Top content */}
            <motion.div
              variants={fadeUp}
              className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="mb-2 text-xs text-zinc-600">
                  Your purchase activity
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Your purchases, organized.
                </h2>
              </div>

              <button
                type="button"
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-black
                  transition-transform
                  duration-200
                  hover:scale-[1.02]
                "
              >
                <ReceiptText size={16} />
                Add receipt
              </button>
            </motion.div>

            {/* ================= STATS ================= */}

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -3,
                          }
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-[#101114]
                      p-4
                      transition-colors
                      duration-300
                      hover:border-white/[0.12]
                      md:p-5
                    "
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-zinc-500 md:text-sm">
                          {stat.label}
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                          {stat.value}
                        </h3>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025]">
                        <Icon
                          size={17}
                          className={stat.iconClass}
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>

                    <p
                      className={`mt-5 text-xs ${
                        stat.label === "Expiring"
                          ? "text-amber-400/90"
                          : "text-zinc-600"
                      }`}
                    >
                      {stat.meta}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ================= MAIN GRID ================= */}

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
              {/* Recent purchases */}
              <motion.section
                variants={fadeUp}
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#101114]
                  p-4
                  md:p-6
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Recent purchases
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Latest stored receipts
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-zinc-600"
                  />
                </div>

                <motion.div
                  variants={containerVariants}
                  className="mt-5 space-y-2"
                >
                  {receipts.map((receipt) => (
                    <motion.div
                      variants={fadeUp}
                      key={receipt.store}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-transparent
                        bg-white/[0.025]
                        px-3
                        py-3
                        transition-all
                        duration-200
                        hover:border-white/[0.06]
                        hover:bg-white/[0.04]
                        md:px-4
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02] text-xs font-medium text-zinc-400">
                          {receipt.initial}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {receipt.store}
                          </p>

                          <p className="mt-1 truncate text-xs text-zinc-600">
                            {receipt.item}
                          </p>
                        </div>
                      </div>

                      <div className="ml-3 text-right">
                        <p className="text-sm font-medium text-zinc-300">
                          {receipt.amount}
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          {receipt.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-xs text-zinc-600">
                    126 receipts stored
                  </span>

                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                    View all
                    <ChevronRight size={14} />
                  </span>
                </div>
              </motion.section>

              {/* Warranty */}
              <motion.section
                variants={fadeUp}
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#101114]
                  p-4
                  md:p-6
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Warranty status
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      MacBook Air M4
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/[0.12] bg-emerald-400/[0.04]">
                    <ShieldCheck
                      size={18}
                      className="text-emerald-400"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-semibold tracking-tight text-white">
                        74%
                      </div>

                      <p className="mt-1 text-xs text-zinc-600">
                        Coverage remaining
                      </p>
                    </div>

                    <span className="text-sm font-medium text-emerald-300">
                      Protected
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "74%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 1.2,
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-t border-white/[0.06] pt-5">
                  <InfoRow
                    label="Purchased"
                    value="Aug 24, 2026"
                  />

                  <InfoRow
                    label="Expires"
                    value="Aug 24, 2027"
                  />

                  <InfoRow
                    label="Remaining"
                    value="365 days"
                    highlight
                  />
                </div>

                <button
                  type="button"
                  className="
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-white/[0.08]
                    py-2.5
                    text-sm
                    font-medium
                    text-zinc-400
                    transition-all
                    duration-200
                    hover:border-white/[0.15]
                    hover:bg-white/[0.03]
                    hover:text-white
                  "
                >
                  <FileText size={15} />
                  View warranty
                </button>
              </motion.section>
            </div>

            {/* Bottom insight */}
            <motion.div
              variants={fadeUp}
              className="
                mt-5
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.018]
                px-4
                py-4
                md:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04]">
                  <TrendingUp
                    size={16}
                    className="text-zinc-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Spending is up this month
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    18% more compared to last month
                  </p>
                </div>
              </div>

              <span className="hidden text-xs text-zinc-600 sm:block">
                Analytics →
              </span>
            </motion.div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SidebarIcon({ icon: Icon, active = false }) {
  return (
    <div
      className={`
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        transition-all
        duration-200
        ${
          active
            ? "border border-white/[0.08] bg-white/[0.06] text-white"
            : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-300"
        }
      `}
    >
      <Icon size={17} strokeWidth={1.8} />
    </div>
  );
}

function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-600">{label}</span>

      <span
        className={
          highlight
            ? "font-medium text-emerald-300"
            : "text-zinc-400"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default HeroDashboard;