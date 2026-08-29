import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Archive,
  Bell,
  Search,
  ShieldCheck,
  ArrowUpRight,
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
      "Keep warranties and important purchase dates visible without remembering every single deadline yourself.",
    icon: Bell,
    meta: "3 UPCOMING REMINDERS",
  },
  {
    number: "03",
    eyebrow: "EVERYTHING WITHIN REACH",
    title: "Find anything.",
    highlight: "In seconds.",
    description:
      "Search across your purchase history and reach the document you need without digging through old folders.",
    icon: Search,
    meta: "SEARCH. FIND. DONE.",
  },
];

function Features() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const stageRefs = useRef([]);
  const dotFieldRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const stages = stageRefs.current.filter(Boolean);

      // Initial state
      gsap.set(stages, {
        opacity: 0,
        y: 60,
        scale: 0.96,
        pointerEvents: "none",
      });

      gsap.set(stages[0], {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: "auto",
      });

      // Main pinned experience
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // -------------------------
      // STAGE 1 -> STAGE 2
      // -------------------------

      timeline
        .to(
          stages[0],
          {
            opacity: 0,
            x: -80,
            scale: 0.94,
            duration: 1,
          },
          1
        )
        .fromTo(
          stages[1],
          {
            opacity: 0,
            x: 90,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
          },
          1
        )

        // Main card changes position
        .to(
          cardRef.current,
          {
            rotation: -2,
            y: -10,
            duration: 1,
          },
          1
        )

        // -------------------------
        // STAGE 2 -> STAGE 3
        // -------------------------

        .to(
          stages[1],
          {
            opacity: 0,
            x: -80,
            scale: 0.94,
            duration: 1,
          },
          3
        )
        .fromTo(
          stages[2],
          {
            opacity: 0,
            x: 90,
            scale: 1.04,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
          },
          3
        )
        .to(
          cardRef.current,
          {
            rotation: 2,
            y: 0,
            duration: 1,
          },
          3
        );

      // Background dots movement
      if (dotFieldRef.current) {
        gsap.to(dotFieldRef.current, {
          backgroundPosition: "70px 70px",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
          },
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen overflow-hidden bg-[#070809]"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Dot field */}
        <div
          ref={dotFieldRef}
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Big ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.045] blur-[170px]" />

        {/* Giant background numbers */}
        <div className="absolute left-[6%] top-[50%] -translate-y-1/2 select-none text-[30vw] font-semibold leading-none tracking-[-0.1em] text-white/[0.018]">
          01
        </div>

        {/* Edge glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* LEFT SIDE */}
          <div className="relative">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-emerald-300/60" />
              <span className="text-[10px] font-semibold tracking-[0.28em] text-emerald-200">
                BUILT FOR REAL PURCHASES
              </span>
            </div>

            {/* All feature stages overlap here */}
            <div className="relative min-h-[390px]">
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
                    <div className="text-[11px] font-medium tracking-[0.25em] text-zinc-500">
                      {stage.eyebrow}
                    </div>

                    <div className="mt-7">
                      <div className="text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-7xl">
                        {stage.title}
                      </div>

                      <div className="mt-2 text-6xl font-semibold leading-[0.96] tracking-[-0.06em] text-emerald-200/80 md:text-7xl">
                        {stage.highlight}
                      </div>
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

                      <div className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500">
                        {stage.meta}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll indicator */}
            <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-zinc-600">
              <span>Scroll to explore</span>

              <div className="relative h-8 w-px overflow-hidden bg-white/10">
                <div className="absolute left-0 top-0 h-3 w-px bg-emerald-300 animate-[feature-scroll_1.6s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE VISUAL */}
          <div className="relative flex justify-center">
            {/* Floating dots */}
            <div className="pointer-events-none absolute -left-6 top-[18%] grid grid-cols-5 gap-2 opacity-60">
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1 w-1 rounded-full bg-white/25"
                />
              ))}
            </div>

            <div
              ref={cardRef}
              className="relative w-full max-w-[620px]"
            >
              {/* Back layers */}
              <div className="absolute inset-x-10 top-8 h-full rounded-[34px] border border-white/[0.04] bg-white/[0.015] blur-[0.2px]" />

              <div className="absolute inset-x-5 top-4 h-full rounded-[34px] border border-white/[0.06] bg-[#0b0c0f]" />

              {/* Main interface */}
              <div className="relative overflow-hidden rounded-[34px] border border-white/[0.1] bg-[#101114] shadow-[0_50px_120px_rgba(0,0,0,0.45)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04]">
                      <span className="text-sm font-semibold text-white">
                        B
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Your purchases
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">
                        Everything in one place
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </div>
                </div>

                {/* Main content */}
                <div className="p-5 md:p-6">
                  {/* Large visual */}
                  <div className="relative h-[190px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0a0b0d] p-5">
                    <div className="absolute inset-0 opacity-50">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                          backgroundSize: "32px 32px",
                        }}
                      />
                    </div>

                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                            Billvora overview
                          </p>

                          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                            Your records,
                            <span className="text-zinc-500">
                              {" "}organized.
                            </span>
                          </p>
                        </div>

                        <ArrowUpRight
                          size={18}
                          className="text-emerald-200"
                        />
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex gap-2">
                          {["Receipts", "Warranty", "History"].map(
                            (item, index) => (
                              <div
                                key={item}
                                className={`rounded-full border px-3 py-1.5 text-[10px] ${
                                  index === 0
                                    ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
                                    : "border-white/[0.06] bg-white/[0.02] text-zinc-500"
                                }`}
                              >
                                {item}
                              </div>
                            )
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-semibold text-white">
                            126
                          </p>
                          <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                            Records
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom cards */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ["Receipts", "126"],
                      ["Protected", "14"],
                      ["Upcoming", "3"],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                      >
                        <p className="text-xl font-semibold tracking-[-0.03em] text-white">
                          {value}
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                          {label}
                        </p>

                        {index === 2 && (
                          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
                            <div className="h-full w-[68%] rounded-full bg-emerald-300/60" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* bottom glow */}
                <div className="pointer-events-none absolute bottom-0 left-1/2 h-[140px] w-[70%] -translate-x-1/2 rounded-full bg-emerald-400/[0.05] blur-[70px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className={`h-1.5 rounded-full ${
              item === 0
                ? "w-6 bg-emerald-300"
                : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* local animation */}
      <style>
        {`
          @keyframes feature-scroll {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }

            35% {
              opacity: 1;
            }

            100% {
              transform: translateY(280%);
              opacity: 0;
            }
          }
        `}
      </style>
    </section>
  );
}

export default Features;