import HelpPageLayout from "../../components/help/HelpPageLayout";

const AppVersion = () => {
  const version = "1.0.0 (MVP)";
  const build = "Billvora 6.4";
  const environment = "Production Preview";

  return (
    <HelpPageLayout
      title="About Billvora"
      subtitle="Version information, build details, and the technologies powering your purchase management vault."
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-default bg-surface p-6 transition-theme">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-2xl font-bold text-primary">
              B
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary">Billvora</h2>
              <p className="mt-1 text-secondary">
                Modern personal purchase management system for receipts, warranties,
                return tracking, and future AI-powered purchase insights.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Application Information
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
              <p className="text-sm text-secondary">Version</p>
              <p className="mt-1 text-lg font-semibold text-primary">
                {version}
              </p>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
              <p className="text-sm text-secondary">Build</p>
              <p className="mt-1 text-lg font-semibold text-primary">
                {build}
              </p>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
              <p className="text-sm text-secondary">Environment</p>
              <p className="mt-1 text-lg font-semibold text-primary">
                {environment}
              </p>
            </div>

            <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
              <p className="text-sm text-secondary">Release</p>
              <p className="mt-1 text-lg font-semibold text-primary">
                August 2026
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Core Technologies
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "React",
              "Vite",
              "Tailwind CSS v4",
              "React Router",
              "Firebase Authentication",
              "Cloud Firestore",
              "Firebase Storage",
              "Framer Motion",
              "Lucide React",
            ].map((tech) => (
              <div
                key={tech}
                className="rounded-2xl border border-default bg-surface p-4 transition-theme"
              >
                <p className="font-medium text-primary">{tech}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            What's included in this release
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-secondary">
            <li>Receipt upload, edit, delete, and preview</li>
            <li>Warranty management and reminders</li>
            <li>Search and analytics dashboard</li>
            <li>Notification center</li>
            <li>Settings and account management</li>
            <li>Help Center with FAQs and support resources</li>
            <li>Theme-aware Light, Dark, and System modes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Next milestone
          </h2>

          <p className="mt-3 text-secondary">
            The next major release is <span className="font-medium text-primary">Billvora 7.0</span>,
            which will introduce OCR-powered receipt scanning, automatic field extraction,
            return window tracking, and smarter purchase intelligence.
          </p>
        </section>

        <div className="rounded-2xl border border-default bg-surface p-4 text-xs text-secondary transition-theme">
          Billvora © 2026. All rights reserved.
        </div>
      </div>
    </HelpPageLayout>
  );
};

export default AppVersion;