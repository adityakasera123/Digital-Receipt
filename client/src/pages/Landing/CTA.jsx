import { Link } from "react-router-dom";
function CTA() {
  return (
    <section className="container-custom py-32">

      <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-[#101012] px-8 py-20 text-center">

        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          READY TO GET STARTED?
        </p>

        <h2 className="mt-6 text-5xl font-semibold leading-tight text-white">
          Never Lose
          <br />
          Another Receipt Again.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Store receipts, track warranties, and organize every purchase
          in one secure digital vault. Everything you need,
          always within reach.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to = "/login">
         <button className="rounded-full bg-white px-8 py-4 text-lg font-medium text-black transition">
            Get Started Free
          </button>
          </Link>

          <button className="rounded-full border border-white/10 px-8 py-4 text-lg font-medium text-white">
            View Demo
          </button>

        </div>

        <p className="mt-8 text-sm text-zinc-500">
          Free to start • Secure by design • No credit card required
        </p>

      </div>

    </section>
  );
}

export default CTA;