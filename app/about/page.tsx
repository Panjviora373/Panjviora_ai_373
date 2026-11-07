
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 px-6 py-5">
        <a href="/" className="text-2xl font-bold text-blue-400">
          ALIQO
        </a>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-3 font-semibold tracking-widest text-blue-400">
          DISCOVER ALIQO
        </p>

        <h1 className="mb-6 text-4xl font-bold">
          About Us
        </h1>

        <p className="mb-8 text-slate-400">
          Welcome to ALIQO — your gateway to exploring information
          and discovering new ideas.
        </p>

        <div className="space-y-8 leading-8 text-slate-300">
          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Our Mission
            </h2>
            <p>
              Our mission is to make discovering information easier
              and more accessible. We aim to provide a simple and
              helpful search experience for everyone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              What Is ALIQO?
            </h2>
            <p>
              ALIQO is an online search platform designed to help
              people explore topics, discover websites, and find
              useful information through search and AI-powered features.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Our Vision
            </h2>
            <p>
              We want to build a user-friendly platform that makes
              information discovery simple, useful, and accessible.
              We continue working to improve the ALIQO experience.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Contact Us
            </h2>
            <p>
              We welcome your questions, suggestions, and feedback.
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
