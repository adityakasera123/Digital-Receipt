import { useRef, useState } from "react";
import {
  ReceiptText,
  ShieldCheck,
  RotateCcw,
  CalendarDays,
  Check,
  ArrowUpRight,
} from "lucide-react";

const problems = [
  {
    number: "01",
    title: "Need warranty?",
    text: "Can't find the receipt.",
  },
  {
    number: "02",
    title: "Need an exchange?",
    text: "Invoice disappeared.",
  },
  {
    number: "03",
    title: "Bought months ago?",
    text: "Don't remember where it is.",
  },
  {
    number: "04",
    title: "Drawer full of bills?",
    text: "Still searching every time.",
  },
];

function ReceiptProblems() {
  const cardRef = useRef(null);

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    setCursor({
      x,
      y,
    });

    setRotation({
      x: (percentY - 0.5) * -2,
      y: (percentX - 0.5) * 2,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    setRotation({
      x: 0,
      y: 0,
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#070708]">
      <div className="container-custom relative py-28 lg:py-36">
        {/* =========================
            HEADING
        ========================= */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">
            REAL LIFE
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Never say...
            <br />

            <span className="text-zinc-500">
              "I know it's somewhere."
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Receipts usually disappear exactly when you need them.
            Billvora keeps every purchase ready whenever life asks for it.
          </p>
        </div>

        {/* =========================
            PROBLEMS
        ========================= */}

        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#101114]">
          {problems.map((item, index) => (
            <div
              key={item.number}
              className={`group grid items-center gap-5 px-7 py-7 transition-colors duration-300 hover:bg-white/[0.025] md:grid-cols-[70px_1fr_1fr] md:gap-8 md:px-10 ${
                index !== problems.length - 1
                  ? "border-b border-white/[0.07]"
                  : ""
              }`}
            >
              <span className="text-xs font-medium tracking-[0.2em] text-emerald-300/80">
                {item.number}
              </span>

              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {item.title}
              </h3>

              <p className="text-base text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* =========================
            TRANSITION
        ========================= */}

        <div className="mt-24 text-center">
          <p className="text-sm text-zinc-500">
            That's exactly why we built
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Billvora.
          </h2>
        </div>

        {/* =========================
            PURCHASE RECORD
        ========================= */}

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Shadow / depth behind card */}

          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-24 rounded-full bg-black/60 blur-3xl" />

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-[2rem] bg-[#eeeae1] shadow-[0_35px_100px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `perspective(1400px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {/* =========================
                CURSOR RING
            ========================= */}

            <div
              className="pointer-events-none absolute z-30 h-14 w-14 rounded-full border border-[#1b1b1b]/25 transition-opacity duration-300"
              style={{
                left: cursor.x,
                top: cursor.y,
                opacity: isHovering ? 1 : 0,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e06b3c]" />
            </div>

            {/* =========================
                TOP BAR
            ========================= */}

            <div className="relative flex items-center justify-between border-b border-black/[0.08] px-7 py-5 sm:px-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#191919] text-[#eeeae1]">
                  <ReceiptText size={19} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-tight text-[#191919]">
                    BILLVORA
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#77736c]">
                    Digital purchase record
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#1b1b1b]/10 bg-[#e4dfd5] px-3 py-1.5">
                <Check size={13} className="text-[#4d7c62]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#55514b]">
                  Saved
                </span>
              </div>
            </div>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="relative p-7 sm:p-10 lg:p-12">
              {/* Label */}

              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8b857c]">
                PURCHASE RECORD
              </p>

              {/* Product */}

              <div className="mt-5 flex flex-col gap-6 border-b border-black/[0.08] pb-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
                    MacBook Air
                  </h3>

                  <p className="mt-3 text-sm text-[#77736c]">
                    Apple Store · Order #BV-10284
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-[#8b857c]">
                    PURCHASE VALUE
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#171717]">
                    ₹89,990
                  </p>
                </div>
              </div>

              {/* =========================
                  DATES
              ========================= */}

              <div className="grid border-b border-black/[0.08] sm:grid-cols-2">
                <div className="border-b border-black/[0.08] py-7 sm:border-b-0 sm:border-r sm:border-black/[0.08] sm:pr-10">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={17}
                      className="text-[#e06b3c]"
                    />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b857c]">
                        PURCHASED
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#272727]">
                        12 August 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-7 sm:pl-10">
                  <div className="flex items-center gap-3">
                    <RotateCcw
                      size={17}
                      className="text-[#e06b3c]"
                    />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b857c]">
                        RETURN ENDS
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#272727]">
                        31 August 2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================
                  STATUS
              ========================= */}

              <div className="grid gap-3 pt-8 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-[#e7e2d8] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-[#eeeae1]">
                    <ReceiptText size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#202020]">
                      Receipt saved
                    </p>

                    <p className="mt-1 text-xs text-[#77736c]">
                      Original invoice ready
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-[#e7e2d8] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-[#eeeae1]">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#202020]">
                      Warranty active
                    </p>

                    <p className="mt-1 text-xs text-[#77736c]">
                      Coverage being tracked
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================
                  FOOTER
              ========================= */}

              <div className="mt-10 flex flex-col gap-5 border-t border-black/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-sm leading-6 text-[#77736c]">
                  Everything important about this purchase stays together,
                  ready whenever you need it.
                </p>

                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.1] text-[#444] transition-all duration-300 hover:scale-105 hover:bg-[#191919] hover:text-[#eeeae1]"
                  aria-label="Open purchase"
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </div>

            {/* Bottom receipt-style accent */}

            <div className="flex gap-2 overflow-hidden px-8 pb-5">
              {Array.from({ length: 30 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1 w-1 shrink-0 rounded-full bg-black/15"
                />
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            FINAL MESSAGE
        ========================= */}

        <div className="mx-auto mt-24 max-w-3xl text-center">
          <p className="text-base text-zinc-500">
            Life's already complicated.
          </p>

          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Keeping receipts
            <br />

            <span className="text-zinc-500">
              shouldn't be.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Billvora keeps your receipts, warranties, return windows, and
            purchase history organized—so they're ready when you need them.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReceiptProblems;