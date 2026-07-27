import HeroDashboard from "./hero-dashboard/HeroDashboard";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Top Glow */}
      <div className="absolute left-1/2 top-[-650px] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[350px]" />

      <div className="absolute left-1/2 top-[-150px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-400/5 blur-[180px]" />

      <div className="container-custom">
        <div className="flex min-h-screen flex-col items-center pt-[150px]  text-center">
          {/* Badge */}
          <div className="mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-400 backdrop-blur-xl">
            ✨ Smart Receipt Management
          </div>

          {/* Heading */}
          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.04em] leading-[0.99] md:text-[78px]">
           Every Receipt.
            <br />
            One{" "}
            <span className="text-emerald-100">
              Secure
            </span>{" "}
            Vault.
          </h1>

          {/* Subtitle */}
          <p className="mt-[40px] max-w-2xl text-lg leading-8 text-zinc-400">
            Store receipts, invoices and warranties in one secure place.
            Get reminders before warranties expire and keep every purchase
            organized forever.
          </p>

          {/* Buttons */}
          <div className="mt-[56px] flex items-center gap-5">
            <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]">
              Get Started
            </button>

            <button className="rounded-full border border-white/10 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-500 hover:bg-white/5">
              View Demo
            </button>
          </div>

          {/* Dashboard Placeholder */}
         
         {/* Hero Dashboard */}
<div className="mt-[110px] w-full">
  <HeroDashboard />
</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;