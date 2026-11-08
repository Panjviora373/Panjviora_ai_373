
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F3F7F1] text-[#17251B]">
      {/* Header */}
      <nav className="border-b border-[#DCE5D9] bg-[#0B1A11] px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-3xl font-extrabold tracking-wide text-[#E4C35D]">
            ALIQO
          </a>
          <a
            href="/"
            className="rounded-full border border-[#C4D0C5]/30 px-5 py-2 text-sm text-[#E4C35D] transition hover:bg-[#E4C35D] hover:text-[#0B1A11]"
          >
            Home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#10251A] px-6 py-16 text-center text-white">
        <p className="mb-4 text-sm font-bold tracking-[0.3em] text-[#E4C35D]">
          ALIQO TRUST CENTER
        </p>
        <h1 className="text-4xl font-extrabold md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#C4D0C5]">
          Your privacy matters to us. This policy explains how ALIQO
          collects, uses, and protects information when you use our website.
        </p>
        <p className="mt-5 text-sm text-[#E4C35D]">
          Last updated: November 8, 2026
        </p>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-2xl border border-[#DCE5D9] bg-white p-7 shadow-sm md:p-12">
          <div className="mb-10 border-b border-[#E5EBE2] pb-7">
            <span className="rounded-full bg-[#EDF3E9] px-4 py-2 text-xs font-bold tracking-wider text-[#426348]">
              YOUR PRIVACY
            </span>
            <h2 className="mt-5 text-2xl font-bold text-[#183522]">
              Our Commitment to You
            </h2>
            <p className="mt-3 leading-8 text-[#647267]">
              ALIQO aims to provide a useful search experience while
              respecting your privacy. Please read this policy to understand
              how information may be handled when you use our services.
            </p>
          </div>

          <div className="space-y-9 leading-8 text-[#526156]">
            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                1. Introduction
              </h2>
              <p>
                Welcome to ALIQO. ALIQO provides web search, image search,
                video search, and AI-assisted search features. This Privacy
                Policy describes the types of information that may be
                collected or processed when you visit or use our website.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                2. Information We May Collect
              </h2>
              <p>
                Depending on how you use ALIQO, information may include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  Search queries that you enter into our search services.
                </li>
                <li>
                  Contact details and business information that you
                  voluntarily submit through advertising or contact forms.
                </li>
                <li>
                  Technical information such as browser type, device
                  information, approximate usage data, and diagnostic
                  information.
                </li>
                <li>
                  Information collected through cookies or similar
                  technologies, where enabled.
                </li>
              </ul>
              <p className="mt-3">
                Please avoid entering passwords, financial details, or other
                sensitive personal information into search queries or
                advertising request forms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                3. Search and AI Services
              </h2>
              <p>
                When you use web search, image search, video search, or
                AI-assisted search, your query may be processed by external
                service providers to retrieve results or generate responses.
                These providers may include Tavily, Google Gemini, and
                YouTube services, depending on the feature being used.
              </p>
              <p className="mt-3">
                The handling of information by these providers is also
                governed by their respective privacy policies and terms.
                ALIQO does not control the privacy practices of independent
                third-party providers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                4. Advertising Requests
              </h2>
              <p>
                If you submit an advertising request, we may collect
                information such as your business name, contact person's
                name, email address, phone number, and advertising details.
              </p>
              <p className="mt-3">
                This information may be processed and stored using our
                database provider, Supabase, so that our team can review
                requests and respond to enquiries.
              </p>
              <p className="mt-3">
                We use submitted information for business communication,
                advertising enquiries, and related administrative purposes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                5. How We Use Information
              </h2>
              <p>Information may be used to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Provide and operate ALIQO search features.</li>
                <li>Process search queries and return relevant results.</li>
                <li>Respond to contact and advertising enquiries.</li>
                <li>Maintain website security and prevent misuse.</li>
                <li>Understand website performance and improve our services.</li>
                <li>Meet applicable legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                6. Cookies and Advertising
              </h2>
              <p>
                ALIQO or its service providers may use cookies and similar
                technologies to support website functionality, understand
                usage, and improve the user experience.
              </p>
              <p className="mt-3">
                If third-party advertising services such as Google AdSense
                are enabled on our website, advertising providers may use
                cookies or similar technologies to display and measure
                advertisements, subject to their own policies and applicable
                consent requirements.
              </p>
              <p className="mt-3">
                You can manage cookies through your browser settings.
                Disabling certain cookies may affect some website features.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                7. Third-Party Services and Links
              </h2>
              <p>
                ALIQO may use third-party services for search, AI responses,
                video results, hosting, databases, analytics, and advertising.
                Our website may also contain links to external websites.
              </p>
              <p className="mt-3">
                External websites and providers operate under their own
                privacy policies. We encourage you to review those policies
                before sharing information with them.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                8. Data Storage and Retention
              </h2>
              <p>
                Information submitted through our forms may be stored by
                service providers on our behalf. We aim to retain personal
                information only for as long as reasonably necessary for the
                purposes described in this policy, unless a longer period is
                required by law or needed to resolve a legitimate issue.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                9. Data Security
              </h2>
              <p>
                We take reasonable technical and organizational steps to
                protect information against unauthorized access, misuse,
                alteration, or disclosure. However, no website, internet
                transmission, or storage system can be guaranteed to be
                completely secure.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                10. Your Privacy Choices
              </h2>
              <p>
                Depending on applicable law, you may have the right to
                request access to, correction of, or deletion of personal
                information that you have provided to us.
              </p>
              <p className="mt-3">
                You may contact us to ask questions or make a privacy-related
                request. We may need to verify your identity before responding.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                11. Children's Privacy
              </h2>
              <p>
                ALIQO is not intentionally designed to collect personal
                information from children. If you believe a child has
                provided personal information to us, please contact us so
                that we can review the matter and take appropriate action.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                12. International Data Processing
              </h2>
              <p>
                Some third-party providers used by ALIQO may process or store
                information in countries other than your own. Their handling
                of information is subject to their applicable privacy
                practices and legal requirements.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                13. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy when our services,
                practices, or legal requirements change. Any updated version
                will be published on this page with a revised update date.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-[#183522]">
                14. Contact ALIQO
              </h2>
              <p>
                If you have questions about this Privacy Policy or wish to
                make a privacy-related request, contact us:
              </p>
              <a
                href="mailto:aliqo37311011@gmail.com"
                className="mt-3 inline-block font-semibold text-[#98751D] hover:underline"
              >
                aliqo37311011@gmail.com
              </a>
              <br />
              <a
                href="/contact"
                className="mt-3 inline-block font-semibold text-[#98751D] hover:underline"
              >
                Visit Contact Page →
              </a>
            </section>
          </div>

          <div className="mt-12 border-t border-[#E5EBE2] pt-8">
            <a
              href="/"
              className="inline-flex rounded-full bg-[#183522] px-8 py-3 font-semibold text-white transition hover:bg-[#294D32]"
            >
              Back to Home
            </a>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[#263D2D] bg-[#090F0B] px-6 py-8 text-center text-sm text-[#A9B7AA]">
        © 2026 <span className="font-bold text-[#E4C35D]">ALIQO</span>.
        All rights reserved.
      </footer>
    </main>
  );
}
