import { Outlet } from "react-router-dom";

const features = [
  "Secure Receipt Storage",
  "Warranty Tracking",
  "Smart Search",
  "AI Insights (Coming Soon)",
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
     <div className="mx-auto flex h-[650px] w-[1120px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">

        {/* LEFT SIDE */}
       <div className="flex h-full w-full justify-center overflow-y-auto px-8 py-8 lg:w-[42%]">
  <div className="w-full max-w-sm self-start py-8">
    <Outlet />
  </div>
</div>
        {/* RIGHT SIDE */}
       <div className="relative hidden lg:flex lg:w-[60%] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#4338CA] p-10 text-white">

          {/* Glow */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl"></div>

          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>

          <div className="relative z-10 flex h-full flex-col justify-between">

            {/* TOP */}
            <div>
              <span className="rounded-full border border-white/20 px-4 py-2 text-sm">
                Billvora
              </span>

              <h2 className="mt-8 text-[56px] font-bold leading-[1.05] tracking-tight">
                Your Purchases.
                <br />
                One Secure Vault.
              </h2>

              <p className="mt-6 max-w-md text-lg text-blue-100">
                Securely manage receipts, invoices and warranties from one place.
              </p>
            </div>

            {/* FEATURES */}
            <div className="space-y-5">

              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-300"></div>

                  <span className="text-blue-100">
                    {item}
                  </span>
                </div>
              ))}

              {/* Dashboard Card */}

              

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthLayout;