function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Top Glow */}
      <div className="absolute left-1/2 top-[-650px] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[350px]" />

      <div className="absolute left-1/2 top-[-150px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/5 blur-[180px]" />

      <div className="container-custom">
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center pt-[150px] text-center">
          {/* Badge */}
          <div className="mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-400 backdrop-blur-xl">
            ✨ Smart Receipt Management
          </div>

          {/* Heading */}
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight leading-[1.05] md:text-[72px]">
            Never Lose
            <br />
            A{" "}
            <span className="text-emerald-100">
              Receipt
            </span>{" "}
            Again.
          </h1>

          {/* Subtitle */}
          <p className="mt-[40px] max-w-2xl text-lg leading-8 text-zinc-400">
            Store receipts, invoices and warranties in one secure place.
            Get reminders before warranties expire and keep every purchase
            organized forever.
          </p>

          {/* Buttons */}
          <div className="mt-[56px] flex items-center gap-5">
            <button className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]">
              Get Started
            </button>

            <button className="rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-500 hover:bg-white/5">
              View Demo
            </button>
          </div>

          {/* Dashboard Placeholder */}
          <div className="mt-[160px] h-[420px] w-full max-w-5xl rounded-[32px] border border-white/10 bg-[#0C0C0E]/80 backdrop-blur-xl">
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;