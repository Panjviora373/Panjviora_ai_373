
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 px-6 py-5">
        <a href="/" className="text-2xl font-bold text-blue-400">
          ALIQO
        </a>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-3 font-semibold tracking-widest text-blue-400">
          ALIQO
        </p>

        <h1 className="mb-6 text-4xl font-bold">
          Terms &amp; Conditions
        </h1>

        <p className="mb-8 text-slate-400">
          Last updated: November 2026
        </p>

        <div className="space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to ALIQO. By accessing or using our website,
              you agree to these Terms &amp; Conditions. If you do
              not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              2. Using Our Services
            </h2>
            <p>
              You agree to use ALIQO lawfully and responsibly.
              You must not misuse, disrupt, damage, or attempt to
              gain unauthorized access to our website or services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              3. Search Information
            </h2>
            <p>
              Search results and AI-generated answers are provided
              for general informational purposes. We do not guarantee
              that all information is complete, accurate, or current.
              Please verify important information using reliable sources.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              4. Third-Party Websites
            </h2>
            <p>
              ALIQO may provide links to third-party websites.
              We do not control or take responsibility for their
              content, privacy practices, or services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              5. Intellectual Property
            </h2>
            <p>
              The ALIQO name, branding, and website materials may
              be protected by applicable intellectual property laws.
              You may not copy or misuse our materials without
              appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              6. Changes to These Terms
            </h2>
            <p>
              We may update these Terms &amp; Conditions when necessary.
              Updated terms will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              7. Contact
            </h2>
            <p>
              For questions about these terms, contact us at:
            </p>
            <a
              href="mailto:aliqo37311011@gmail.com"
              className="text-blue-400 hover:text-blue-300"
            >
              aliqo37311011@gmail.com
            </a>
          </section>
        </div>

        <a
          href="/"
          className="mt-10 inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
        >
          Back to Home
        </a>
      </article>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
