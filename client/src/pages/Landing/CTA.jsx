import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDown } from "lucide-react";

function CTA() {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame;

    const handleMouseEnter = (event) => {
      const rect = section.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      currentX = targetX;
      currentY = targetY;

      if (glowRef.current) {
        glowRef.current.style.opacity = "1";
      }

      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }

      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    const animate = () => {
      // Smoothness control:
      // Higher value = cursor follows faster
      // Lower value = more trailing effect
      const speed = 0.16;

      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      const transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (glowRef.current) {
        glowRef.current.style.transform = transform;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = transform;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#07090c] px-5 py-24 sm:px-6 md:py-32">
      <div
        ref={sectionRef}
        className="relative mx-auto min-h-[620px] max-w-[1500px] overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0d0e10]"
      >
        {/* Minimal grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "110px 110px",
          }}
        />

        {/* Smooth cursor-following spotlight */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(214,151,92,0.12) 0%, rgba(214,151,92,0.05) 35%, transparent 70%)",
            willChange: "transform",
          }}
        />

        {/* Subtle corner detail */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full border border-[#d6975c]/[0.08]" />

        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#d6975c]/[0.1]" />

        {/* Main content */}
        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d6975c]/50" />

            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#e3b17f]">
              Everything in one place
            </span>

            <span className="h-px w-8 bg-[#d6975c]/50" />
          </div>

          {/* Heading */}
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Stop searching.
            <br />

            <span className="text-white/[0.34]">
              Start knowing.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Every receipt, warranty, return window, and purchase stays
            organized and ready for the moment you need it.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#e6b27b] px-7 py-4 text-[15px] font-semibold text-[#1b1611] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f0c38f] hover:shadow-[0_15px_50px_rgba(214,151,92,0.18)]"
            >
              <span>Start organizing</span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.1] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight size={15} />
              </span>
            </Link>

            <button
              type="button"
              onClick={scrollToFeatures}
              className="group inline-flex items-center justify-center gap-3 px-5 py-4 text-[15px] font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
            >
              See how it works

              <ArrowDown
                size={16}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </button>
          </div>

          {/* Bottom info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-600">
            <span>Free to start</span>

            <span className="h-1 w-1 rounded-full bg-[#d6975c]/60" />

            <span>No credit card required</span>

            <span className="h-1 w-1 rounded-full bg-[#d6975c]/60" />

            <span>Built around your purchases</span>
          </div>
        </div>

        {/* Small smooth cursor dot */}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute left-0 top-0 hidden h-2.5 w-2.5 rounded-full bg-[#e6b27b] opacity-0 shadow-[0_0_24px_rgba(230,178,123,0.8)] transition-opacity duration-200 lg:block"
          style={{
            willChange: "transform",
          }}
        />

        {/* Bottom border detail */}
        <div className="pointer-events-none absolute bottom-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      </div>
    </section>
  );
}

export default CTA;