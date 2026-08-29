import { useRef } from "react";

import {
  Receipt,
  ShieldCheck,
  History,
  Search,
  Sparkles,
} from "lucide-react";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";


const featureCards = [
  {
    title: "Receipts",
    description: "Keep every receipt organized in one secure place.",
    icon: Receipt,
    position: "left-top",
  },
  {
    title: "Purchase History",
    description: "Revisit every purchase without searching through emails.",
    icon: History,
    position: "right-top",
  },
  {
    title: "Warranties",
    description: "Know exactly when your warranty is about to expire.",
    icon: ShieldCheck,
    position: "left-bottom",
  },
  {
    title: "Smart Search",
    description: "Find any receipt in seconds whenever you need it.",
    icon: Search,
    position: "right-bottom",
  },
];


function FeatureCard({ card, scrollYProgress }) {
  const Icon = card.icon;

  let xValues = [0, 0, 0];
  let yValues = [0, 0, 0];
  let rotateValues = [0, 0, 0];

  if (card.position === "left-top") {
    xValues = [-45, 0, 35];
    yValues = [35, 0, -25];
    rotateValues = [-1.5, 0, 1.5];
  }

  if (card.position === "left-bottom") {
    xValues = [-30, 0, 50];
    yValues = [-25, 0, 35];
    rotateValues = [1.5, 0, -1.5];
  }

  if (card.position === "right-top") {
    xValues = [45, 0, -35];
    yValues = [35, 0, -25];
    rotateValues = [1.5, 0, -1.5];
  }

  if (card.position === "right-bottom") {
    xValues = [30, 0, -50];
    yValues = [-25, 0, 35];
    rotateValues = [-1.5, 0, 1.5];
  }


  // Raw scroll movement
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    xValues
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    yValues
  );

  const rawRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    rotateValues
  );


  // Smooth movement
  const springConfig = {
    stiffness: 80,
    damping: 20,
    mass: 0.8,
  };

  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);
  const rotate = useSpring(rawRotate, springConfig);


  return (
    <motion.div
      style={{ x, y, rotate }}
      className="relative"
    >
      <motion.div
        drag
        dragElastic={0.12}
        dragMomentum={false}
        whileHover={{
          y: -6,
          scale: 1.015,
        }}
        whileDrag={{
          scale: 1.035,
          cursor: "grabbing",
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className="
          group
          relative
          cursor-grab
          select-none
          overflow-hidden
          rounded-[2rem]
          border
          border-white/[0.08]
          bg-[linear-gradient(145deg,rgba(29,37,34,0.85),rgba(14,17,16,0.95))]
          p-8
          shadow-[0_25px_70px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
          transition-all
          duration-500
          hover:border-emerald-300/[0.22]
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.32),0_0_45px_rgba(16,185,129,0.05)]
        "
      >

        {/* Top light */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-emerald-300/[0.22]
            to-transparent
          "
        />

        {/* Soft card atmosphere */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-40
            w-40
            rounded-full
            bg-emerald-400/[0.045]
            blur-3xl
          "
        />

        <div className="relative z-10">

          {/* Icon */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-white/[0.08]
              bg-emerald-400/[0.045]
              transition-all
              duration-300
              group-hover:border-emerald-300/[0.2]
              group-hover:bg-emerald-400/[0.075]
            "
          >
            <Icon
              size={23}
              strokeWidth={1.7}
              className="
                text-zinc-300
                transition-colors
                duration-300
                group-hover:text-emerald-300
              "
            />
          </div>


          {/* Title */}
          <h3 className="mt-7 text-2xl font-semibold tracking-tight text-white">
            {card.title}
          </h3>


          {/* Description */}
          <p className="mt-4 max-w-sm text-base leading-8 text-zinc-400">
            {card.description}
          </p>


          {/* Bottom detail */}
          <div className="mt-8 flex items-center gap-3">

            <span className="h-1 w-8 rounded-full bg-emerald-400/50" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Billvora
            </span>

          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}


function WhyBillvora() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });


  const leftCards = featureCards.filter((card) =>
    card.position.startsWith("left")
  );

  const rightCards = featureCards.filter((card) =>
    card.position.startsWith("right")
  );


  // ==========================================
  // CENTER CARD SCROLL MOVEMENT
  // ==========================================

  const rawCenterX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-35, 0, 35]
  );

  const rawCenterY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [45, 0, -45]
  );

  const rawCenterRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-2, 0, 2]
  );


  const springConfig = {
    stiffness: 80,
    damping: 20,
    mass: 0.8,
  };


  // Smooth center movement
  const centerX = useSpring(rawCenterX, springConfig);

  const centerY = useSpring(rawCenterY, springConfig);

  const centerRotate = useSpring(
    rawCenterRotate,
    springConfig
  );


  return (
    <section
      ref={sectionRef}
      className="
        container-custom
        relative
        overflow-hidden
        py-28
        lg:py-36
      "
    >

      {/* ==========================================
          BACKGROUND ATMOSPHERE
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[720px]
          w-[720px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-400/[0.035]
          blur-[160px]
        "
      />


      {/* Decorative grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.02]
          [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />


      {/* ==========================================
          HEADING
      ========================================== */}

      <div className="relative z-10 mx-auto max-w-3xl text-center">

        <div className="flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-emerald-400/50" />

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">
            Built for life after checkout
          </p>

          <span className="h-px w-8 bg-emerald-400/50" />

        </div>


        <h2 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Shopping doesn't end
          <br />

          <span className="text-zinc-400">
            after you pay.
          </span>

        </h2>


        <div className="mt-8 space-y-2 text-lg leading-8 text-zinc-400">

          <p>
            Most apps help you buy products.
          </p>

          <p>
            Billvora helps you manage everything that comes after.
          </p>

        </div>

      </div>


      {/* ==========================================
          MAIN VISUAL
      ========================================== */}

      <div className="relative z-10 mx-auto mt-24 max-w-7xl lg:mt-32">

        <div
          className="
            relative
            grid
            gap-8
            lg:grid-cols-[1fr_420px_1fr]
            lg:items-center
            lg:gap-16
          "
        >


          {/* ======================================
              LEFT CARDS
          ====================================== */}

          <div className="relative z-10 flex flex-col gap-8">

            {leftCards.map((card) => (
              <FeatureCard
                key={card.title}
                card={card}
                scrollYProgress={scrollYProgress}
              />
            ))}

          </div>


          {/* ======================================
              CENTER
          ====================================== */}

          <div className="relative flex min-h-[480px] items-center justify-center">


            {/* Ambient breathing light */}

            <motion.div
              animate={{
                scale: [0.96, 1.06, 0.96],
                opacity: [0.4, 0.75, 0.4],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                h-[460px]
                w-[460px]
                rounded-full
                bg-emerald-400/[0.055]
                blur-[130px]
              "
            />


            {/* Outer ring */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 55,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                pointer-events-none
                absolute
                h-[440px]
                w-[440px]
                rounded-full
                border
                border-white/[0.06]
              "
            >

              {/* Orbit marker */}

              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300/70 shadow-[0_0_14px_rgba(52,211,153,0.6)]" />

            </motion.div>


            {/* Inner ring */}

            <div
              className="
                pointer-events-none
                absolute
                h-[365px]
                w-[365px]
                rounded-full
                border
                border-emerald-300/[0.07]
              "
            />


            {/* Cross lines */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[440px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />


            {/* ======================================
                SMOOTH SCROLL MOVEMENT
            ====================================== */}

            <motion.div
              style={{
                x: centerX,
                y: centerY,
                rotate: centerRotate,
              }}
              className="relative z-20"
            >


              {/* ======================================
                  DRAGGABLE CENTER CARD
              ====================================== */}

              <motion.div
                drag
                dragElastic={0.12}
                dragMomentum={false}

                whileHover={{
                  scale: 1.025,
                }}

                whileDrag={{
                  scale: 1.05,
                  cursor: "grabbing",
                }}

                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}

                className="
                  relative
                  flex
                  h-[340px]
                  w-[340px]
                  cursor-grab
                  select-none
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[3rem]
                  border
                  border-emerald-300/[0.20]
                  bg-[linear-gradient(145deg,#1b2421_0%,#121817_45%,#0c0f0e_100%)]
                  px-10
                  text-center
                  shadow-[0_35px_100px_rgba(0,0,0,0.55),0_0_50px_rgba(16,185,129,0.07)]
                  transition-shadow
                  duration-500
                  hover:shadow-[0_40px_110px_rgba(0,0,0,0.60),0_0_65px_rgba(16,185,129,0.10)]
                "
              >


                {/* Soft top-right emerald atmosphere */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    bg-emerald-300/[0.08]
                    blur-[90px]
                  "
                />


                {/* Bottom teal depth */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    -left-20
                    h-64
                    w-64
                    rounded-full
                    bg-teal-400/[0.045]
                    blur-[100px]
                  "
                />


                {/* Top highlight */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-10
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-emerald-200/[0.45]
                    to-transparent
                  "
                />


                {/* ======================================
                    CARD CONTENT
                ====================================== */}

                <div className="relative z-10 flex flex-col items-center">


                  {/* Icon */}

                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-[1.5rem]
                      border
                      border-emerald-300/[0.16]
                      bg-emerald-400/[0.06]
                      shadow-[0_0_35px_rgba(52,211,153,0.09)]
                    "
                  >

                    <Sparkles
                      size={30}
                      strokeWidth={1.5}
                      className="
                        text-emerald-300
                        drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]
                      "
                    />

                  </motion.div>


                  {/* Brand */}

                  <h3 className="mt-7 text-4xl font-semibold tracking-tight text-white">
                    Billvora
                  </h3>


                  {/* Subtitle */}

                  <p className="mt-3 text-lg leading-7 text-zinc-400">
                    Your Digital
                    <br />
                    Purchase Vault
                  </p>


                  {/* Status */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-emerald-300/[0.08]
                      bg-black/10
                      px-3
                      py-1.5
                      text-[11px]
                      text-zinc-400
                    "
                  >

                    <span className="relative flex h-1.5 w-1.5">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />

                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    </span>

                    Everything stays ready

                  </div>

                </div>

              </motion.div>

            </motion.div>

          </div>


          {/* ======================================
              RIGHT CARDS
          ====================================== */}

          <div className="relative z-10 flex flex-col gap-8">

            {rightCards.map((card) => (
              <FeatureCard
                key={card.title}
                card={card}
                scrollYProgress={scrollYProgress}
              />
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default WhyBillvora;