import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Archive,
  Bell,
  Search,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    number: "01",
    eyebrow: "PURCHASE ORGANIZATION",
    title: "Everything you buy.",
    highlight: "Finally organized.",
    description:
      "Keep receipts, invoices, and important purchase details together in one place you can always come back to.",
    icon: Archive,
    meta: "126 PURCHASES ORGANIZED",
  },
  {
    number: "02",
    eyebrow: "WARRANTY TRACKING",
    title: "Know what's covered.",
    highlight: "Before it's too late.",
    description:
      "Track warranties and important deadlines automatically so valuable purchases never slip through the cracks.",
    icon: Bell,
    meta: "3 UPCOMING REMINDERS",
  },
  {
    number: "03",
    eyebrow: "SMART SEARCH",
    title: "Find anything.",
    highlight: "Without digging.",
    description:
      "Search your complete purchase history and find exactly what you need in seconds.",
    icon: Search,
    meta: "SEARCH YOUR ENTIRE HISTORY",
  },
];

function Features() {
  const sectionRef = useRef(null);

  const textRefs = useRef([]);
  const numberRefs = useRef([]);
  const visualRefs = useRef([]);
  const dotRefs = useRef([]);

  // Scroll-controlled wrappers
  const cardSceneRef = useRef(null);
  const backCardOneRef = useRef(null);
  const backCardTwoRef = useRef(null);

  // Independent floating layer
  const floatingCardRef = useRef(null);

  const progressRef = useRef(null);
  const glowRef = useRef(null);
  const dotsFieldRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const texts = textRefs.current.filter(Boolean);
      const numbers = numberRefs.current.filter(Boolean);
      const visuals = visualRefs.current.filter(Boolean);
      const dots = dotRefs.current.filter(Boolean);

      // -----------------------------
      // INITIAL STATES
      // -----------------------------

      gsap.set(texts, {
        autoAlpha: 0,
        x: 55,
      });

      gsap.set(texts[0], {
        autoAlpha: 1,
        x: 0,
      });

      gsap.set(numbers, {
        autoAlpha: 0,
        y: 70,
      });

      gsap.set(numbers[0], {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(visuals, {
        autoAlpha: 0,
        x: 50,
      });

      gsap.set(visuals[0], {
        autoAlpha: 1,
        x: 0,
      });

      gsap.set(dots, {
        opacity: 0.2,
        scale: 1,
      });

      gsap.set(dots[0], {
        opacity: 1,
        scale: 1.35,
      });

      gsap.set(progressRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // -----------------------------
      // AMBIENT MOVEMENT
      // -----------------------------

      gsap.to(floatingCardRef.current, {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(backCardOneRef.current, {
        y: 8,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(backCardTwoRef.current, {
        y: -7,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(dotsFieldRef.current, {
        y: -14,
        x: 8,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // -----------------------------
      // PINNED SCROLL STORY
      // -----------------------------

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // =====================================
      // STAGE 1 → STAGE 2
      // =====================================

      timeline
        .to(
          texts[0],
          {
            autoAlpha: 0,
            x: -65,
            duration: 1,
          },
          1
        )
        .fromTo(
          texts[1],
          {
            autoAlpha: 0,
            x: 65,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
          },
          1
        )

        .to(
          numbers[0],
          {
            autoAlpha: 0,
            y: -70,
            duration: 0.8,
          },
          1
        )
        .fromTo(
          numbers[1],
          {
            autoAlpha: 0,
            y: 70,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          },
          1
        )

        .to(
          visuals[0],
          {
            autoAlpha: 0,
            x: -60,
            duration: 0.9,
          },
          1
        )
        .fromTo(
          visuals[1],
          {
            autoAlpha: 0,
            x: 60,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
          },
          1
        )

        // Card scene movement
        .to(
          cardSceneRef.current,
          {
            x: -26,
            y: -18,
            rotation: -1.8,
            scale: 0.97,
            duration: 1,
          },
          1
        )

        // Glow movement
        .to(
          glowRef.current,
          {
            x: -120,
            y: 50,
            scale: 1.12,
            duration: 1,
          },
          1
        )

        // Progress
        .to(
          progressRef.current,
          {
            scaleX: 0.5,
            duration: 1,
          },
          1
        )

        // Active dots
        .to(
          dots[0],
          {
            opacity: 0.2,
            scale: 1,
            duration: 0.3,
          },
          1
        )
        .to(
          dots[1],
          {
            opacity: 1,
            scale: 1.35,
            duration: 0.3,
          },
          1
        );

      // =====================================
      // STAGE 2 → STAGE 3
      // =====================================

      timeline
        .to(
          texts[1],
          {
            autoAlpha: 0,
            x: -65,
            duration: 1,
          },
          3
        )
        .fromTo(
          texts[2],
          {
            autoAlpha: 0,
            x: 65,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
          },
          3
        )

        .to(
          numbers[1],
          {
            autoAlpha: 0,
            y: -70,
            duration: 0.8,
          },
          3
        )
        .fromTo(
          numbers[2],
          {
            autoAlpha: 0,
            y: 70,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          },
          3
        )

        .to(
          visuals[1],
          {
            autoAlpha: 0,
            x: -60,
            duration: 0.9,
          },
          3
        )
        .fromTo(
          visuals[2],
          {
            autoAlpha: 0,
            x: 60,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
          },
          3
        )

        // Card scene stronger opposite movement
        .to(
          cardSceneRef.current,
          {
            x: 26,
            y: -5,
            rotation: 1.8,
            scale: 1,
            duration: 1,
          },
          3
        )

        .to(
          glowRef.current,
          {
            x: 120,
            y: -40,
            scale: 0.96,
            duration: 1,
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
            opacity: 0.2,
            scale: 1,
            duration: 0.3,
          },
          3
        )
        .to(
          dots[2],
          {
            opacity: 1,
            scale: 1.35,
            duration: 0.3,
          },
          3
        );

      // Final subtle exit
      timeline.to(
        cardSceneRef.current,
        {
          y: -14,
          scale: 0.985,
          duration: 0.8,
        },
        5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---------------------------------
  // MOUSE 3D TILT
  // ---------------------------------

  useEffect(() => {
    const scene = cardSceneRef.current;

    if (!scene) return;

    const handleMouseMove = (event) => {
      const rect = scene.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((mouseX - centerX) / centerX) * 3;
      const rotateX = ((centerY - mouseY) / centerY) * 3;

      gsap.to(scene, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(scene, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    scene.addEventListener("mousemove", handleMouseMove);
    scene.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      scene.removeEventListener("mousemove", handleMouseMove);
      scene.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen overflow-hidden bg-[#08090a]"
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div
          ref={dotsFieldRef}
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.06] blur-[180px]"
        />

        {stages.map((stage, index) => (
          <div
            key={stage.number}
            ref={(element) => {
              numberRefs.current[index] = element;
            }}
            className="absolute left-[3%] top-1/2 -translate-y-1/2 select-none text-[30vw] font-semibold leading-none tracking-[-0.1em] text-white/[0.025]"
          >
            {stage.number}
          </div>
        ))}

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      </div>

      {/* CONTENT */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* LEFT CONTENT */}

          <div className="relative">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-9 bg-emerald-300/60" />

              <span className="text-[10px] font-semibold tracking-[0.28em] text-emerald-200/80">
                WHY BILLVORA
              </span>
            </div>

            <div className="relative h-[390px] md:h-[420px]">
              {stages.map((stage, index) => {
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.number}
                    ref={(element) => {
                      textRefs.current[index] = element;
                    }}
                    className="absolute inset-0"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">
                      {stage.eyebrow}
                    </p>

                    <h2 className="mt-7 text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white md:text-6xl lg:text-7xl">
                      {stage.title}
                    </h2>

                    <h2 className="mt-2 text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-emerald-200/90 md:text-6xl lg:text-7xl">
                      {stage.highlight}
                    </h2>

                    <p className="mt-8 max-w-md text-base leading-8 text-zinc-400">
                      {stage.description}
                    </p>

                    <div className="mt-9 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
                        <Icon
                          size={17}
                          strokeWidth={1.7}
                          className="text-emerald-200"
                        />
                      </div>

                      <span className="text-[10px] font-semibold tracking-[0.16em] text-zinc-500">
                        {stage.meta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT CARD AREA */}

          <div
            ref={cardSceneRef}
            className="relative mx-auto w-full max-w-[640px]"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Decorative dots */}

            <div className="absolute -left-5 top-10 z-0 grid grid-cols-5 gap-2 opacity-50">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className="h-[3px] w-[3px] rounded-full bg-white/50"
                />
              ))}
            </div>

            {/* BACK LAYER ONE */}

            <div
              ref={backCardOneRef}
              className="absolute inset-x-10 top-7 h-[540px] rounded-[32px] border border-white/[0.035] bg-white/[0.012]"
            />

            {/* BACK LAYER TWO */}

            <div
              ref={backCardTwoRef}
              className="absolute inset-x-5 top-3 h-[540px] rounded-[32px] border border-white/[0.06] bg-[#0b0c0e]"
            />

            {/* FLOATING MAIN CARD */}

            <div
              ref={floatingCardRef}
              className="relative h-[500px] overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#111214] shadow-[0_45px_120px_rgba(0,0,0,0.6)] md:h-[540px]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* CARD TOP HIGHLIGHT */}

              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.2] to-transparent" />

              {/* VISUAL 1 */}

              <div
                ref={(element) => {
                  visualRefs.current[0] = element;
                }}
                className="absolute inset-0"
              >
                <PurchaseVisual />
              </div>

              {/* VISUAL 2 */}

              <div
                ref={(element) => {
                  visualRefs.current[1] = element;
                }}
                className="absolute inset-0"
              >
                <WarrantyVisual />
              </div>

              {/* VISUAL 3 */}

              <div
                ref={(element) => {
                  visualRefs.current[2] = element;
                }}
                className="absolute inset-0"
              >
                <SearchVisual />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PROGRESS */}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <span className="text-[10px] font-medium tracking-[0.16em] text-zinc-600">
          01
        </span>

        <div className="relative h-px w-24 overflow-hidden bg-white/[0.08]">
          <div
            ref={progressRef}
            className="h-full w-full bg-emerald-300"
          />
        </div>

        {stages.map((stage, index) => (
          <span
            key={stage.number}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className="h-1.5 w-1.5 rounded-full bg-emerald-300"
          />
        ))}

        <span className="text-[10px] font-medium tracking-[0.16em] text-zinc-600">
          03
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   PURCHASE VISUAL
========================================================= */

function PurchaseVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Purchase overview"
        subtitle="Everything organized"
      />

      <div className="mt-5 rounded-3xl border border-white/[0.07] bg-[#0a0b0d] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">
              PURCHASE VAULT
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              126 purchases
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              All your important records together.
            </p>
          </div>

          <ArrowUpRight
            size={18}
            className="text-emerald-200"
          />
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          <MiniStat value="126" label="Receipts" />
          <MiniStat value="14" label="Warranty" />
          <MiniStat value="3" label="Upcoming" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <ReceiptRow
          store="Apple Store"
          item="MacBook Air M4"
          amount="$1,299"
        />

        <ReceiptRow
          store="Nike"
          item="Air Max 90"
          amount="$140"
        />

        <ReceiptRow
          store="IKEA"
          item="Workspace setup"
          amount="$320"
        />
      </div>
    </div>
  );
}

/* =========================================================
   WARRANTY VISUAL
========================================================= */

function WarrantyVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Warranty overview"
        subtitle="Protection you can track"
      />

      <div className="mt-5 rounded-3xl border border-white/[0.07] bg-[#0a0b0d] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">
              ACTIVE COVERAGE
            </p>

            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              14 protected
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Purchases currently covered.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06]">
            <ShieldCheck
              size={22}
              strokeWidth={1.7}
              className="text-emerald-200"
            />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">
              Active coverage
            </span>

            <span className="text-emerald-200">
              78%
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[78%] rounded-full bg-emerald-300/80" />
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

/* =========================================================
   SEARCH VISUAL
========================================================= */

function SearchVisual() {
  return (
    <div className="h-full p-6">
      <VisualHeader
        title="Search purchases"
        subtitle="Find what you need"
      />

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#0a0b0d] px-4 py-3.5">
        <Search
          size={17}
          className="text-zinc-500"
        />

        <span className="flex-1 text-sm text-zinc-200">
          MacBook Air
        </span>

        <span className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-500">
          ⌘ K
        </span>
      </div>

      <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-zinc-600">
        3 RESULTS FOUND
      </p>

      <div className="mt-3 space-y-2">
        <SearchResult
          title="MacBook Air M4"
          store="Apple Store"
          amount="$1,299"
          active
        />

        <SearchResult
          title="MacBook Sleeve"
          store="Amazon"
          amount="$39"
        />

        <SearchResult
          title="USB-C Adapter"
          store="Apple Store"
          amount="$19"
        />
      </div>
    </div>
  );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function VisualHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
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

      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      </div>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
      <p className="text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-zinc-600">
        {label}
      </p>
    </div>
  );
}

function ReceiptRow({ store, item, amount }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-[10px] font-medium text-zinc-400">
          {store.charAt(0)}
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-200">
            {store}
          </p>

          <p className="mt-1 text-[10px] text-zinc-600">
            {item}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-zinc-300">
          {amount}
        </p>

        <CheckCircle2
          size={13}
          className="ml-auto mt-1 text-emerald-300/70"
        />
      </div>
    </div>
  );
}

function WarrantyRow({ name, date, status }) {
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

      <span className="rounded-full bg-emerald-400/[0.07] px-2.5 py-1 text-[9px] text-emerald-200">
        {status}
      </span>
    </div>
  );
}

function SearchResult({ title, store, amount, active }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 ${
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