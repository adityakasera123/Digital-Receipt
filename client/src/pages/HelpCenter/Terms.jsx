import HelpPageLayout from "../../components/help/HelpPageLayout";

const Terms = () => {
  return (
    <HelpPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Billvora and its purchase management features."
    >
      <div className="space-y-8 text-sm leading-7 text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-primary">
            Acceptance of terms
          </h2>
          <p className="mt-3">
            By creating an account or using Billvora, you agree to these Terms &
            Conditions. If you do not agree with these terms, please discontinue use of
            the application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Use of the service
          </h2>
          <p className="mt-3">
            Billvora is intended for personal purchase management. You may use the
            service to upload receipts, manage warranties, track return windows, and
            organize your purchase history.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Your responsibilities
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Provide accurate information when creating and managing your account.</li>
            <li>Upload only receipts and documents that you are authorized to store.</li>
            <li>Keep your account credentials secure and confidential.</li>
            <li>Do not misuse, disrupt, or attempt unauthorized access to Billvora systems.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Data and content
          </h2>
          <p className="mt-3">
            You retain ownership of the receipts, images, PDFs, and purchase information
            that you upload. Billvora stores this information only to provide application
            features such as receipt management, warranty reminders, analytics, and
            search.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Service availability
          </h2>
          <p className="mt-3">
            We strive to keep Billvora available and reliable, but we cannot guarantee
            uninterrupted access at all times. Features may change, improve, or be
            temporarily unavailable due to maintenance or technical issues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Limitation of liability
          </h2>
          <p className="mt-3">
            Billvora is provided on an "as is" basis. We are not responsible for indirect,
            incidental, or consequential damages resulting from the use of the
            application, including missed warranty claims or loss of uploaded content due
            to factors outside our reasonable control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Account termination
          </h2>
          <p className="mt-3">
            You may delete your account at any time from the Settings page. We may
            suspend or terminate accounts that violate these Terms & Conditions or are
            used for abusive or fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Changes to these terms
          </h2>
          <p className="mt-3">
            We may update these Terms & Conditions from time to time. Continued use of
            Billvora after changes become effective constitutes acceptance of the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary">
            Contact
          </h2>
          <p className="mt-3">
            For questions regarding these Terms & Conditions, please use the Contact
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

export default Terms;