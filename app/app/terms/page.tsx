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
          Terms & Conditions
        </h1>

        <p className="mb-8 text-slate-400">
          Last updated: November 2026
        </p>

        <div className="space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ALIQO, you agree to these Terms and
              Conditions. If you do not agree, please do not use the website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">2. Use of Website</h2>
            <p>
              You agree to use ALIQO only for lawful purposes. You must not
              misuse the website, disrupt its services, or attempt
              unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">3. Search Information</h2>
            <p>
              Search results may come from third-party services. We do not
              guarantee that all information is complete, accurate, or
              up to date. Please verify important information independently.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">4. Third-Party Websites</h2>
            <p>
              ALIQO may link to external websites. We do not control or take
              responsibility for their content, services, or privacy practices.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">5. Intellectual Property</h2>
            <p>
              ALIQO branding, design, and original website content belong to
              their respective owners. You may not copy or reuse protected
              content without permission.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">6. Availability</h2>
            <p>
              We may update, suspend, or discontinue any part of the website
              when necessary. We cannot guarantee uninterrupted availability.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">7. Limitation of Liability</h2>
            <p>
              To the extent permitted by applicable law, ALIQO is not
              responsible for losses arising from your use of the website
              or reliance on third-party search information.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">8. Changes to Terms</h2>
            <p>
              We may revise these terms from time to time. Updated terms
              will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">9. Contact</h2>
            <p>
              For questions about these terms, email us at
              {" "}
              <a
                href="mailto:aliqo37311011@gmail.com"
                className="text-blue-400 underline"
              >
                aliqo37311011@gmail.com
              </a>.
            </p>
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
