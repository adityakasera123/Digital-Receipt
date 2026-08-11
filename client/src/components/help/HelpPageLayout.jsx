import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpPageLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface transition-theme">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-default bg-surface px-3 py-2 text-sm text-secondary transition-theme hover:bg-surface-hover hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-secondary sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-default bg-surface p-5 shadow-sm transition-theme sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HelpPageLayout;