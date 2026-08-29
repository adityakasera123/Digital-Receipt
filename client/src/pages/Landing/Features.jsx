import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Archive,
  Bell,
  Search,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    number: "01",
    eyebrow: "YOUR PURCHASE VAULT",
    title: "Keep everything.",
    highlight: "Lose nothing.",
    description:
      "Receipts, invoices and purchase details stay together instead of disappearing into emails, galleries and drawers.",
    icon: Archive,
    meta: "126 PURCHASES ORGANIZED",
  },
  {
    number: "02",
    eyebrow: "ALWAYS A STEP AHEAD",
    title: "Track what matters.",
    highlight: "Before it matters.",
    description:
      "Keep warranties and important purchase dates visible without trying to remember every deadline yourself.",
    icon: Bell,
    meta: "3 UPCOMING REMINDERS",
  },
  {
    number: "03",
    eyebrow: "EVERYTHING WITHIN REACH",
    title: "Find anything.",
    highlight: "In seconds.",
    description:
      "Search across your purchase history and find the document you need without digging through old folders.",
    icon: Search,
    meta: "SEARCH. FIND. DONE.",
  },
];

function Features() {
  const sectionRef = useRef(null);

  const stageRefs = useRef([]);
  const numberRefs = useRef([]);
  const visualRefs = useRef([]);

  const mainCardRef = useRef(null);
  const backLayerOneRef = useRef(null);
  const backLayerTwoRef = useRef(null);

  const progressRef = useRef(null);
  const progressDotRefs = useRef([]);

  const glowRef = useRef(null);
  const dotFieldRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const textStages = stageRefs.current.filter(Boolean);
      const numbers = numberRefs.current.filter(Boolean);
      const visuals = visualRefs.current.filter(Boolean);
      const dots = progressDotRefs.current.filter(Boolean);

      /* ------------------------------
         INITIAL STATES
      ------------------------------ */

      gsap.set(textStages, {
        opacity: 0,
        y: 50,
        scale: 0.97,
      });

      gsap.set(textStages[0], {
        opacity: 1,
        y: 0,
        scale: 1,
      });

      gsap.set(numbers, {
        opacity: 0,
        y: 80,
      });

      gsap.set(numbers[0], {
        opacity: 1,
        y: 0,
      });

      gsap.set(visuals, {
        opacity: 0,
        x: 40,
        scale: 0.98,
      });

      gsap.set(visuals[0], {
        opacity: 1,
        x: 0,
        scale: 1,
      });

      gsap.set(dots, {
        opacity: 0.3,
      });

      gsap.set(dots[0], {
        opacity: 1,
      });

      gsap.set(progressRef.current, {
        scaleX: 0.15,
        transformOrigin: "left center",
      });

      /* ------------------------------
         MASTER PINNED TIMELINE
      ------------------------------ */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* =====================================
         STAGE 01 → STAGE 02
      ===================================== */

      timeline
        .to(
          textStages[0],
          {
            opacity: 0,
            x: -70,
            y: -20,
            scale: 0.95,
            duration: 1,
          },
          1
        )

        .fromTo(
          textStages[1],
          {
            opacity: 0,
            x: 90,
            y: 20,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
          },
          1
        )

        .to(
          numbers[0],
          {
            opacity: 0,
            y: -80,
            duration: 0.7,
          },
          1
        )

        .fromTo(
          numbers[1],
          {
            opacity: 0,
            y: 80,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          1.1
        )

        .to(
          visuals[0],
          {
            opacity: 0,
            x: -70,
            scale: 0.94,
            duration: 0.9,
          },
          1
        )

        .fromTo(
          visuals[1],
          {
            opacity: 0,
            x: 80,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
          },
          1.05
        )

        /* Card movement */
        .to(
          mainCardRef.current,
          {
            rotation: -1.5,
            y: -8,
            duration: 1,
          },
          1
        )

        .to(
          backLayerOneRef.current,
          {
            x: -12,
            y: 18,
            rotation: -3,
            duration: 1,
          },
          1
        )

        .to(
          backLayerTwoRef.current,
          {
            x: 12,
            y: 9,
            rotation: 2,
            duration: 1,
          },
          1
        )

        .to(
          glowRef.current,
          {
            x: -180,
            y: 40,
            scale: 1.2,
            duration: 1.5,
          },
          1
        )

        .to(
          progressRef.current,
          {
            scaleX: 0.5,
            duration: 1,
          },
          1
        )

        .to(
          dots[0],
          {
            opacity: 0.3,
            duration: 0.4,
          },
          1
        )

        .to(
          dots[1],
          {
            opacity: 1,
            duration: 0.4,
          },
          1
        );

      /* =====================================
         STAGE 02 → STAGE 03
      ===================================== */

      timeline
        .to(
          textStages[1],
          {
            opacity: 0,
            x: -70,
            y: -20,
            scale: 0.95,
            duration: 1,
          },
          3
        )

        .fromTo(
          textStages[2],
          {
            opacity: 0,
            x: 90,
            y: 20,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
          },
          3
        )

        .to(
          numbers[1],
          {
            opacity: 0,
            y: -80,
            duration: 0.7,
          },
          3
        )

        .fromTo(
          numbers[2],
          {
            opacity: 0,
            y: 80,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          3.1
        )

        .to(
          visuals[1],
          {
            opacity: 0,
            x: -70,
            scale: 0.94,
            duration: 0.9,
          },
          3
        )

        .fromTo(
          visuals[2],
          {
            opacity: 0,
            x: 80,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
          },
          3.05
        )

        /* Card moves other direction */
        .to(
          mainCardRef.current,
          {
            rotation: 1.5,
            y: 5,
            duration: 1,
          },
          3
        )

        .to(
          backLayerOneRef.current,
          {
            x: 14,
            y: 22,
            rotation: 3,
            duration: 1,
          },
          3
        )

        .to(
          backLayerTwoRef.current,
          {
            x: -10,
            y: 10,
            rotation: -2,
            duration: 1,
          },
          3
        )

        .to(
          glowRef.current,
          {
            x: 180,
            y: -60,
            scale: 0.95,
            duration: 1.5,
          },
          3
        )

        .to(
          progressRef.current,
          {
            scaleX: 1,
            duration: 1,
          },
          3
        )

        .to(
          dots[1],
          {
            opacity: 0.3,
            duration: 0.4,
          },
          3
        )

        .to(
          dots[2],
          {
            opacity: 1,
            duration: 0.4,
          },
          3
        );

      /* Final exit */
      timeline.to(
        mainCardRef.current,
        {
          y: -20,
          scale: 0.97,
          duration: 0.8,
        },
        5
      );

      /* Background movement */
      gsap.to(dotFieldRef.current, {
        backgroundPosition: "100px 100px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=380%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen overflow-hidden bg-[#070809]"
    >
      {/* BACKGROUND */}

      <div className="absolute inset-0">
        <div
          ref={dotFieldRef}
          className="absolute inset-0 opacity-[0.38]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.07] blur-[170px]"
        />

        {stages.map((stage, index) => (
          <div
            key={stage.number}
            ref={(element) => {
              numberRefs.current[index] = element;
            }}
            className="pointer-events-none absolute left-[5%] top-1/2 -translate-y-1/2 select-none text-[32vw] font-semibold leading-none tracking-[-0.1em] text-white/[0.025]"
          >
            {stage.number}
          </div>
        ))}

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070809] to-transparent" />
      </div>

      {/* CONTENT */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">

          {/* LEFT TEXT */}

          <div className="relative">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-emerald-300/60" />

              <span className="text-[10px] font-semibold tracking-[0.28em] text-emerald-200">
                BUILT FOR REAL PURCHASES
              </span>
            </div>

            <div className="relative min-h-[400px]">
              {stages.map((stage, index) => {
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.number}
                    ref={(element) => {
                      stageRefs.current[index] = element;
                    }}
                    className="absolute inset-0"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-zinc-500">
                      {stage.eyebrow}
                    </p>

                    <div className="mt-7">
                      <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-7xl">
                        {stage.title}
                      </h2>

                      <h2 className="mt-2 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-emerald-200/85 md:text-7xl">
                        {stage.highlight}
                      </h2>
                    </div>

                    <p className="mt-8 max-w-md text-base leading-8 text-zinc-400">
                      {stage.description}
                    </p>

                    <div className="mt-10 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                        <Icon
                          size={18}
                          strokeWidth={1.7}
                          className="text-emerald-200"
                        />
                      </div>

                      <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500">
                        {stage.meta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT VISUAL */}

          <div className="relative">
            <div className="pointer-events-none absolute -left-5 top-[18%] grid grid-cols-5 gap-2 opacity-50">
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1 w-1 rounded-full bg-white/30"
                />
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-[650px]">

              {/* BACK CARD 1 */}

              <div
                ref={backLayerOneRef}
                className="absolute inset-x-12 top-9 h-full rounded-[36px] border border-white/[0.04] bg-white/[0.015]"
              />

              {/* BACK CARD 2 */}

              <div
                ref={backLayerTwoRef}
                className="absolute inset-x-6 top-4 h-full rounded-[36px] border border-white/[0.06] bg-[#0b0c0f]"
              />

              {/* MAIN CARD — FIXED HEIGHT */}

              <div
                ref={mainCardRef}
                className="relative h-[500px] overflow-hidden rounded-[36px] border border-white/[0.1] bg-[#101114] shadow-[0_50px_130px_rgba(0,0,0,0.55)] sm:h-[540px]"
              >
                {/* VISUAL 01 */}

                <div
                  ref={(element) => {
                    visualRefs.current[0] = element;
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  <PurchaseVisual />
                </div>

                {/* VISUAL 02 */}

                <div
                  ref={(element) => {
                    visualRefs.current[1] = element;
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  <WarrantyVisual />
                </div>

                {/* VISUAL 03 */}

                <div
                  ref={(element) => {
                    visualRefs.current[2] = element;
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  <SearchVisual />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <span className="text-[10px] font-medium tracking-[0.15em] text-zinc-600">
          01
        </span>

        <div className="relative h-px w-28 bg-white/[0.08]">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-px w-full bg-emerald-300"
          />
        </div>

        {[0, 1, 2].map((index) => (
          <span
            key={index}
            ref={(element) => {
              progressDotRefs.current[index] = element;
            }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-300"
          />
        ))}

        <span className="text-[10px] font-medium tracking-[0.15em] text-zinc-600">
          03
        </span>
      </div>
    </section>
  );
}

/* =====================================================
   PURCHASE VISUAL
===================================================== */

function PurchaseVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Your purchases"
        subtitle="Everything in one place"
      />

      <div className="mt-5 rounded-[24px] border border-white/[0.07] bg-[#0a0b0d] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              Billvora overview
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Your records,
              <span className="text-zinc-500"> organized.</span>
            </h3>
          </div>

          <ArrowUpRight size={18} className="text-emerald-200" />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <MiniStat value="126" label="Receipts" />
          <MiniStat value="14" label="Protected" />
          <MiniStat value="3" label="Upcoming" active />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ReceiptRow store="Apple Store" item="MacBook Air M4" />
        <ReceiptRow store="Nike" item="Air Max" />
        <ReceiptRow store="IKEA" item="Workspace" />
      </div>
    </div>
  );
}

/* =====================================================
   WARRANTY VISUAL
===================================================== */

function WarrantyVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Warranty status"
        subtitle="Stay ahead of important dates"
      />

      <div className="mt-5 rounded-[24px] border border-white/[0.07] bg-[#0a0b0d] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              Protection overview
            </p>

            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              14 protected
            </h3>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06]">
            <ShieldCheck
              size={22}
              strokeWidth={1.6}
              className="text-emerald-200"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              Protection coverage
            </span>

            <span className="text-emerald-200">
              78%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full w-[78%] rounded-full bg-emerald-300/70" />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <WarrantyRow
          name="MacBook Air M4"
          date="Expires in 112 days"
          status="Protected"
        />

        <WarrantyRow
          name="Sony Headphones"
          date="Expires in 38 days"
          status="Upcoming"
          warning
        />

        <WarrantyRow
          name="Office Chair"
          date="Expires in 202 days"
          status="Protected"
        />
      </div>
    </div>
  );
}

/* =====================================================
   SEARCH VISUAL
===================================================== */

function SearchVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Find anything"
        subtitle="Your history is always searchable"
      />

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#0a0b0d] px-4 py-3">
        <Search size={16} className="text-zinc-500" />

        <span className="flex-1 text-sm text-zinc-300">
          MacBook Air
        </span>

        <span className="rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-[9px] font-medium text-emerald-200">
          3 results
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <SearchResult
          title="MacBook Air M4"
          store="Apple Store"
          amount="$1,299"
          active
        />

        <SearchResult
          title="MacBook Air Sleeve"
          store="Amazon"
          amount="$39"
        />

        <SearchResult
          title="MacBook USB-C Adapter"
          store="Apple Store"
          amount="$19"
        />
      </div>
    </div>
  );
}

/* =====================================================
   SHARED COMPONENTS
===================================================== */

function VisualHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04]">
          <span className="text-sm font-semibold text-white">
            B
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] text-zinc-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      </div>
    </div>
  );
}

function MiniStat({ value, label, active }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
      <p className="text-xl font-semibold text-white">
        {value}
      </p>

      <p
        className={`mt-1 text-[10px] ${
          active ? "text-emerald-200" : "text-zinc-600"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function ReceiptRow({ store, item }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-xs font-medium text-zinc-200">
          {store}
        </p>

        <p className="mt-1 text-[10px] text-zinc-600">
          {item}
        </p>
      </div>

      <CheckCircle2
        size={15}
        strokeWidth={1.7}
        className="text-emerald-300/70"
      />
    </div>
  );
}

function WarrantyRow({ name, date, status, warning }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-xs font-medium text-zinc-200">
          {name}
        </p>

        <p className="mt-1 text-[10px] text-zinc-600">
          {date}
        </p>
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-[9px] ${
          warning
            ? "bg-white/[0.06] text-zinc-300"
            : "bg-emerald-400/[0.06] text-emerald-200"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function SearchResult({ title, store, amount, active }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.035]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-zinc-200">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-zinc-600">
          {store}
        </p>
      </div>

      <span className="text-xs text-zinc-400">
        {amount}
      </span>
    </div>
  );
}

export default Features;