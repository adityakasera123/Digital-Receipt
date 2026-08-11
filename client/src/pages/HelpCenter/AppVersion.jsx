import HelpPageLayout from "../../components/help/HelpPageLayout";

const AppVersion = () => {
  return (
    <HelpPageLayout
      title="App Version"
      subtitle="Information about your current Billvora installation."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
          <p className="text-sm text-secondary">Application</p>
          <p className="mt-1 text-lg font-semibold text-primary">Billvora</p>
        </div>

        <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
          <p className="text-sm text-secondary">Version</p>
          <p className="mt-1 text-lg font-semibold text-primary">v1.0.0 (MVP)</p>
        </div>

        <div className="rounded-2xl border border-default bg-surface p-5 transition-theme">
          <p className="text-sm text-secondary">Build</p>
          <p className="mt-1 text-lg font-semibold text-primary">Billvora 6.4</p>
        </div>
      </div>
    </HelpPageLayout>
  );
};

export default AppVersion;