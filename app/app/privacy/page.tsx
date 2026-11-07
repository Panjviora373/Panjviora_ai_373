export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 px-6 py-5">
        <a href="/" className="text-2xl font-bold text-blue-400">ALIQO</a>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-3 font-semibold tracking-widest text-blue-400">
          ALIQO
        </p>
        <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-slate-400">Last updated: November 2026</p>

        <div className="space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              Welcome to ALIQO. We respect your privacy and aim to protect
              information collected when you use our website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">2. Information We Collect</h2>
            <p>
              We may collect information you voluntarily provide, such as
              messages sent through our contact options, and basic technical
              information needed to operate and improve the website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">3. How We Use Information</h2>
            <p>
              Information may be used to provide search services, respond to
              enquiries, maintain security, and improve website performance.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">4. Cookies and Advertising</h2>
            <p>
              ALIQO may use cookies and third-party advertising services,
              including Google AdSense. These services may use cookies or
              similar technologies according to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">5. Third-Party Services</h2>
            <p>
              Our website may use external search, hosting, analytics, or
              advertising providers. Their own privacy policies apply to
              information they process.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">6. Data Security</h2>
            <p>
              We take reasonable steps to protect information, but no
              internet transmission or storage system can be guaranteed
              completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">7. Contact</h2>
            <p>
              For privacy questions, please contact us through the Contact
              page on ALIQO.
            </p>
          </section>
        </div>

        <a href="/" className="mt-10 inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold">
          Back to Home
        </a>
      </article>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
