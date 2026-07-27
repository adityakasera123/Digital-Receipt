function Footer() {
  const productLinks = [
    "Dashboard",
    "Receipts",
    "Warranty",
    "Analytics",
  ];

  const companyLinks = [
    "About",
    "Contact",
    "Privacy",
    "Terms",
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#07110D] via-[#040404] to-[#020202]">

      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Watermark */}
      <h1 className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[120px] font-bold tracking-[0.4em] text-white/[0.03] select-none lg:text-[180px]">
        BILLVORA
      </h1>

      <div className="container-custom relative py-24">

        {/* Transition */}
        <div className="mb-20 text-center">

          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />

          <p className="mt-6 text-sm uppercase tracking-[0.35em] text-emerald-300">
            Built for life after checkout.
          </p>

        </div>

        {/* Main */}
        <div className="grid gap-20 lg:grid-cols-[1.3fr_1fr]">

          {/* Brand */}
          <div>

            <h2 className="text-5xl font-bold tracking-tight text-white">
              BILLVORA
            </h2>

            <p className="mt-3 text-lg text-zinc-400">
              Your Digital Purchase Vault
            </p>

            <div className="mt-10 space-y-2 text-zinc-300 leading-8">

              <p>Every receipt.</p>
              <p>Every warranty.</p>
              <p>Every purchase.</p>

              <p className="pt-4 text-xl font-medium text-white">
                Everything. One Secure Vault.
              </p>

            </div>

          </div>

          {/* Navigation */}
          <div className="space-y-12">

            {/* Product */}
            <div>

              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-zinc-500">
                Product
              </p>

              <div className="flex flex-wrap gap-3">

                {productLinks.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-white"
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {/* Company */}
            <div>

              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-zinc-500">
                Company
              </p>

              <div className="grid grid-cols-2 gap-4">

                {companyLinks.map((item) => (
                  <a
                    href="#"
                    key={item}
                    className="text-zinc-400 transition hover:text-white"
                  >
                    {item}
                  </a>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex gap-8 text-zinc-400">

            <a href="#" className="hover:text-white">
              GitHub
            </a>

            <a href="#" className="hover:text-white">
              LinkedIn
            </a>

            <a href="#" className="hover:text-white">
              Email
            </a>

          </div>

          <p className="text-sm text-zinc-500">
            © 2026 Billvora. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;