import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import HeroDashboard from "./hero-dashboard/HeroDashboard";

const floatingDots = [
  // FAR
  { left: "3%", top: "8%", size: 2, delay: 0, duration: 8, depth: "far" },
  { left: "8%", top: "20%", size: 2, delay: 1, duration: 9, depth: "far" },
  { left: "14%", top: "38%", size: 2, delay: 2, duration: 8, depth: "far" },
  { left: "19%", top: "12%", size: 3, delay: 0.5, duration: 10, depth: "far" },
  { left: "25%", top: "28%", size: 2, delay: 3, duration: 9, depth: "far" },
  { left: "32%", top: "7%", size: 2, delay: 1.5, duration: 8, depth: "far" },
  { left: "39%", top: "19%", size: 2, delay: 2.5, duration: 10, depth: "far" },
  { left: "47%", top: "6%", size: 3, delay: 0.8, duration: 9, depth: "far" },
  { left: "54%", top: "23%", size: 2, delay: 3.2, duration: 8, depth: "far" },
  { left: "61%", top: "9%", size: 2, delay: 1.2, duration: 10, depth: "far" },
  { left: "68%", top: "32%", size: 2, delay: 2.8, duration: 9, depth: "far" },
  { left: "75%", top: "13%", size: 3, delay: 0.4, duration: 8, depth: "far" },
  { left: "81%", top: "27%", size: 2, delay: 2, duration: 10, depth: "far" },
  { left: "88%", top: "8%", size: 2, delay: 1.8, duration: 9, depth: "far" },
  { left: "95%", top: "22%", size: 2, delay: 3.5, duration: 8, depth: "far" },
  { left: "5%", top: "58%", size: 2, delay: 2.3, duration: 9, depth: "far" },
  { left: "16%", top: "76%", size: 2, delay: 0.7, duration: 10, depth: "far" },
  { left: "28%", top: "84%", size: 2, delay: 1.9, duration: 8, depth: "far" },
  { left: "43%", top: "72%", size: 3, delay: 3.1, duration: 9, depth: "far" },
  { left: "59%", top: "86%", size: 2, delay: 0.9, duration: 10, depth: "far" },
  { left: "73%", top: "77%", size: 2, delay: 2.4, duration: 8, depth: "far" },
  { left: "87%", top: "84%", size: 2, delay: 1.4, duration: 9, depth: "far" },
  { left: "96%", top: "70%", size: 2, delay: 2.9, duration: 10, depth: "far" },

  // MID
  { left: "7%", top: "31%", size: 3, delay: 0.4, duration: 7, depth: "mid" },
  { left: "12%", top: "52%", size: 3, delay: 2.1, duration: 8, depth: "mid" },
  { left: "18%", top: "64%", size: 2, delay: 1.2, duration: 7, depth: "mid" },
  { left: "23%", top: "17%", size: 3, delay: 3, duration: 8, depth: "mid" },
  { left: "30%", top: "46%", size: 2, delay: 0.8, duration: 7.5, depth: "mid" },
  { left: "37%", top: "25%", size: 3, delay: 1.7, duration: 8.5, depth: "mid" },
  { left: "44%", top: "57%", size: 2, delay: 2.6, duration: 7, depth: "mid" },
  { left: "51%", top: "16%", size: 3, delay: 1.1, duration: 8, depth: "mid" },
  { left: "58%", top: "42%", size: 3, delay: 3.3, duration: 7.5, depth: "mid" },
  { left: "65%", top: "20%", size: 2, delay: 0.5, duration: 8.5, depth: "mid" },
  { left: "71%", top: "55%", size: 3, delay: 2.2, duration: 7, depth: "mid" },
  { left: "78%", top: "37%", size: 2, delay: 1.5, duration: 8, depth: "mid" },
  { left: "84%", top: "17%", size: 3, delay: 2.9, duration: 7.5, depth: "mid" },
  { left: "91%", top: "48%", size: 3, delay: 0.7, duration: 8.5, depth: "mid" },
  { left: "94%", top: "67%", size: 2, delay: 2.5, duration: 7, depth: "mid" },
  { left: "25%", top: "73%", size: 3, delay: 1.3, duration: 8, depth: "mid" },
  { left: "48%", top: "82%", size: 2, delay: 3.1, duration: 7.5, depth: "mid" },
  { left: "68%", top: "72%", size: 3, delay: 0.9, duration: 8.5, depth: "mid" },
  { left: "82%", top: "77%", size: 2, delay: 2.7, duration: 7, depth: "mid" },

  // NEAR — strongest visible movement
  { left: "4%", top: "44%", size: 4, delay: 1.3, duration: 6, depth: "near" },
  { left: "10%", top: "69%", size: 4, delay: 0.5, duration: 6.5, depth: "near" },
  { left: "17%", top: "28%", size: 3, delay: 2.2, duration: 5.8, depth: "near" },
  { left: "27%", top: "62%", size: 4, delay: 1, duration: 6.8, depth: "near" },
  { left: "34%", top: "38%", size: 3, delay: 2.8, duration: 6, depth: "near" },
  { left: "41%", top: "68%", size: 4, delay: 0.3, duration: 6.5, depth: "near" },
  { left: "55%", top: "53%", size: 4, delay: 1.8, duration: 5.7, depth: "near" },
  { left: "63%", top: "70%", size: 3, delay: 2.5, duration: 6.8, depth: "near" },
  { left: "72%", top: "48%", size: 4, delay: 0.9, duration: 6, depth: "near" },
  { left: "79%", top: "63%", size: 4, delay: 3, duration: 6.5, depth: "near" },
  { left: "86%", top: "34%", size: 4, delay: 1.4, duration: 5.8, depth: "near" },
  { left: "93%", top: "57%", size: 3, delay: 2.3, duration: 6.7, depth: "near" },
];

function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // More responsive and stronger spring
  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 18,
    mass: 0.5,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 18,
    mass: 0.5,
  });

  // Strong mouse parallax
  const farX = useTransform(smoothX, [-1, 1], [-35, 35]);
  const farY = useTransform(smoothY, [-1, 1], [-25, 25]);

  const midX = useTransform(smoothX, [-1, 1], [-75, 75]);
  const midY = useTransform(smoothY, [-1, 1], [-55, 55]);

  const nearX = useTransform(smoothX, [-1, 1], [-130, 130]);
  const nearY = useTransform(smoothY, [-1, 1], [-90, 90]);

  // Strong spotlight
  const spotlightX = useTransform(smoothX, [-1, 1], [-280, 280]);
  const spotlightY = useTransform(smoothY, [-1, 1], [-180, 180]);

  // Dashboard movement
  const dashboardX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const dashboardY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const dashboardRotateY = useTransform(smoothX, [-1, 1], [-6, 6]);
  const dashboardRotateX = useTransform(smoothY, [-1, 1], [4, -4]);

  const handleMouseMove = (event) => {
    if (shouldReduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden bg-[#050807]"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,rgba(16,185,129,0.13),transparent_45%),radial-gradient(ellipse_at_8%_65%,rgba(6,78,59,0.09),transparent_40%),radial-gradient(ellipse_at_92%_55%,rgba(15,118,110,0.08),transparent_42%),#050807]" />

        {/* Top glow */}
        <motion.div
          style={{ x: farX, y: farY }}
          className="absolute left-[18%] top-[-160px] h-[420px] w-[850px] rounded-full bg-emerald-500/[0.08] blur-[90px]"
        />

        {/* Cursor spotlight */}
        <motion.div
          style={{
            x: spotlightX,
            y: spotlightY,
          }}
          className="absolute left-[calc(50%-250px)] top-[130px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.18)_0%,rgba(16,185,129,0.07)_38%,transparent_72%)]"
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_35%,black_20%,transparent_82%)]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(110,255,210,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(110,255,210,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "90px 90px",
          }}
        />

        {/* FAR DOTS */}
        <motion.div
          style={{ x: farX, y: farY }}
          className="absolute inset-0"
        >
          {floatingDots
            .filter((dot) => dot.depth === "far")
            .map((dot, index) => (
              <motion.div
                key={`far-${index}`}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: [0, 12, -10, 6, 0],
                        y: [0, -18, 8, -5, 0],
                        opacity: [0.1, 0.65, 0.25, 0.45, 0.1],
                        scale: [1, 1.3, 0.9, 1.15, 1],
                      }
                }
                transition={{
                  duration: dot.duration,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: dot.left,
                  top: dot.top,
                  width: dot.size,
                  height: dot.size,
                }}
                className="absolute rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.65)]"
              />
            ))}
        </motion.div>

        {/* MID DOTS */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="absolute inset-0"
        >
          {floatingDots
            .filter((dot) => dot.depth === "mid")
            .map((dot, index) => (
              <motion.div
                key={`mid-${index}`}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: [0, -20, 15, -8, 0],
                        y: [0, -30, 12, -12, 0],
                        opacity: [0.15, 1, 0.35, 0.7, 0.15],
                        scale: [1, 1.6, 0.9, 1.3, 1],
                      }
                }
                transition={{
                  duration: dot.duration,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: dot.left,
                  top: dot.top,
                  width: dot.size,
                  height: dot.size,
                }}
                className="absolute rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]"
              />
            ))}
        </motion.div>

        {/* NEAR DOTS — strongest movement */}
        <motion.div
          style={{ x: nearX, y: nearY }}
          className="absolute inset-0"
        >
          {floatingDots
            .filter((dot) => dot.depth === "near")
            .map((dot, index) => (
              <motion.div
                key={`near-${index}`}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: [0, 35, -28, 18, -12, 0],
                        y: [0, -45, 22, -30, 12, 0],
                        opacity: [0.2, 1, 0.35, 0.9, 0.45, 0.2],
                        scale: [1, 2, 0.85, 1.6, 1.1, 1],
                      }
                }
                transition={{
                  duration: dot.duration,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: dot.left,
                  top: dot.top,
                  width: dot.size,
                  height: dot.size,
                }}
                className="absolute rounded-full bg-emerald-200 shadow-[0_0_22px_rgba(110,231,183,1)]"
              />
            ))}
        </motion.div>

        {/* Moving decorative lines */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 50, -30, 0],
                  opacity: [0.1, 0.35, 0.15, 0.1],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[38%] h-px w-[300px] rotate-[-20deg] bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, -50, 30, 0],
                  opacity: [0.08, 0.3, 0.12, 0.08],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[48%] h-px w-[280px] rotate-[24deg] bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent"
        />

        {/* Dashboard aura */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="absolute left-[calc(50%-500px)] top-[70%] h-[450px] w-[1000px] rounded-full bg-[radial-gradient(ellipse,rgba(16,185,129,0.13),transparent_68%)] blur-[70px]"
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-[450px] bg-gradient-to-b from-transparent to-[#050807]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      {/* CONTENT */}
      <div className="container-custom relative z-10">
        <div className="flex min-h-screen flex-col items-center pt-[145px] text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.05] px-5 py-2 text-sm text-zinc-300 backdrop-blur-xl"
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.3, 1],
                      rotate: [0, 15, 0],
                    }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-emerald-300"
            >
              ✦
            </motion.span>

            Smart Receipt Management
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 45, filter: "blur(10px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white md:text-[78px] lg:text-[88px]"
          >
            Every Receipt.
            <br />

            One{" "}

            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Secure
              </span>

              <motion.span
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: [0.2, 0.9, 0.2],
                        scaleX: [0.85, 1.15, 0.85],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-x-5 bottom-1 h-6 bg-emerald-400/15 blur-2xl"
              />
            </span>

            {" "}Vault.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-9 max-w-2xl text-lg leading-8 text-zinc-400"
          >
            Store receipts, invoices and warranties in one secure place.
            Get reminders before warranties expire and keep every purchase
            organized forever.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(255,255,255,0.15)]"
              >
                Get Started
              </motion.button>
            </Link>

            <motion.button
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-emerald-300/30 hover:bg-emerald-400/[0.04]"
            >
              View Demo
            </motion.button>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{
              opacity: 0,
              y: 90,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              x: dashboardX,
              y: dashboardY,
              rotateX: dashboardRotateX,
              rotateY: dashboardRotateY,
              transformPerspective: 1200,
            }}
            className="mt-[100px] w-full transform-gpu will-change-transform"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;