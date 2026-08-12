import HelpPageLayout from "../../components/help/HelpPageLayout";

const PrivacyPolicy = () => {
  return (
    <HelpPageLayout
      title="Privacy Policy"
      subtitle="Learn how Billvora collects, stores, and protects your purchase and account information."
    >
      <div className="space-y-8 text-sm leading-7 text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-primary">
            Your privacy matters
          </h2>
          <p className="mt-3">
            Billvora is designed to help you securely store receipts, manage warranties,
            and organize your purchase history. We collect only the information required
            to provide these features and improve the reliability of the application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Information we collect
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Account information such as your name and email address.</li>
            <li>Receipts, invoices, PDFs, and receipt images that you upload.</li>
            <li>Purchase details including product name, amount, category, and dates.</li>
            <li>Warranty information and reminder preferences.</li>
            <li>Basic diagnostic information that helps improve app performance.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            How we use your information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Store and organize your receipts and warranties.</li>
            <li>Provide warranty and return reminders.</li>
            <li>Enable search, analytics, and purchase history features.</li>
            <li>Respond to support requests and bug reports.</li>
            <li>Improve the quality, security, and reliability of Billvora.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Data storage and security
          </h2>
          <p className="mt-3">
            Billvora stores your data using Firebase services, including Firebase
            Authentication, Cloud Firestore, and Firebase Storage. We use industry-standard
            security practices to protect your information from unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Data sharing
          </h2>
          <p className="mt-3">
            We do not sell your personal information. Your uploaded receipts and purchase
            records remain associated with your account and are used only to provide
            Billvora features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Your choices
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Edit or delete your receipts and warranties.</li>
            <li>Export your data from the Settings page.</li>
            <li>Delete your account and associated data from within the app.</li>
            <li>Manage notification preferences at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Contact us
          </h2>
          <p className="mt-3">
            If you have questions about this Privacy Policy, please use the Contact
            Support option available in the Billvora Help Center.
          </p>
        </section>

        <div className="rounded-2xl border border-default bg-surface p-4 text-xs text-secondary transition-theme">
          Last updated: August 2026
        </div>
      </div>
    </HelpPageLayout>
  );
};

export default PrivacyPolicy;