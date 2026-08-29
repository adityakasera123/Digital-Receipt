import {
  Bell,
  Box,
  ChevronRight,
  CircleCheck,
  FileText,
  Headphones,
  Laptop,
  Package,
  ReceiptText,
  Search,
  ShieldCheck,
  TrendingUp,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    value: "126",
    label: "Total receipts",
    detail: "+12 this month",
    icon: ReceiptText,
    accent: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    value: "14",
    label: "Active warranties",
    detail: "12 protected",
    icon: ShieldCheck,
    accent: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    value: "3",
    label: "Expiring soon",
    detail: "Needs attention",
    icon: TriangleAlert,
    accent: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    value: "$8.2K",
    label: "Total spending",
    detail: "+18% this year",
    icon: TrendingUp,
    accent: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

const receipts = [
  {
    store: "Apple Store",
    product: "MacBook Air M4",
    amount: "$1,299",
    status: "Active",
    icon: Laptop,
    iconColor: "text-blue-300",
    iconBg: "bg-blue-500/10",
  },
  {
    store: "Sony",
    product: "WH-1000XM5",
    amount: "$349",
    status: "Active",
    icon: Headphones,
    iconColor: "text-violet-300",
    iconBg: "bg-violet-500/10",
  },
  {
    store: "Amazon",
    product: "Kindle Paperwhite",
    amount: "$160",
    status: "Stored",
    icon: Package,
    iconColor: "text-cyan-300",
    iconBg: "bg-cyan-500/10",
  },
];

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] border border-slate-700/60 bg-[#0B1020] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">

      {/* Dashboard background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-500/[0.07] blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[130px]" />
      </div>

      <div className="relative">

        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-slate-700/50 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-lg shadow-blue-950/50">
              B
            </div>

            <div>
              <h3 className="font-semibold tracking-tight text-slate-100">
                Billvora
              </h3>

              <p className="mt-0.5 text-sm text-slate-500">
                Purchase management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="hidden w-[360px] items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-sm text-slate-500 md:flex">
              <Search size={18} />
              <span>Search receipts...</span>
            </div>

            {/* Bell */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/60 text-slate-400">
              <Bell size={18} />
            </div>

            {/* Profile */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/40">
              AK
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-5 md:p-6 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827]/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/[0.015] blur-2xl" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {stat.label}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.iconBg} ${stat.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <p className={`relative mt-6 text-sm ${stat.accent}`}>
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 px-5 pb-6 md:px-6 lg:grid-cols-5">

          {/* Recent Receipts */}
          <div className="rounded-[24px] border border-slate-700/60 bg-[#111827]/80 p-5 lg:col-span-3">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-100">
                  Recent Receipts
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest purchases
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500">
                <span className="text-lg">•••</span>
              </div>
            </div>

            <div className="space-y-2.5">

              {receipts.map((receipt) => {
                const Icon = receipt.icon;

                return (
                  <div
                    key={receipt.store}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-slate-900/50 px-4 py-4 transition-all duration-300 hover:border-slate-700/70 hover:bg-slate-900/80"
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${receipt.iconBg} ${receipt.iconColor}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-200">
                          {receipt.store}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {receipt.product}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-200">
                        {receipt.amount}
                      </p>

                      <p className="mt-1 text-sm text-blue-400">
                        {receipt.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-700/50 pt-4">

              <span className="text-sm text-slate-500">
                126 receipts stored
              </span>

              <div className="flex items-center gap-1 text-sm font-medium text-blue-400">
                View all
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="rounded-[24px] border border-slate-700/60 bg-[#111827]/80 p-5 lg:col-span-2">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-100">
                  Receipt Preview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Latest purchase
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <FileText size={19} />
              </div>
            </div>

            {/* Receipt Card */}
            <div className="rounded-[22px] border border-slate-700/60 bg-[#0B1220] p-4">

              {/* Product visual */}
              <div className="relative mb-5 flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-[#0f1725]">

                <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.08] blur-3xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-600 bg-slate-100 text-lg font-bold text-slate-900 shadow-lg">
                  A
                </div>
              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Store
                  </span>

                  <span className="font-medium text-slate-200">
                    Apple
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Warranty
                  </span>

                  <span className="font-medium text-blue-400">
                    365 Days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Amount
                  </span>

                  <span className="font-semibold text-slate-100">
                    $1,299
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-700/60" />

              <div className="flex items-center gap-2 text-sm text-blue-400">
                <CircleCheck size={17} />
                Securely stored in Billvora
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroDashboard;