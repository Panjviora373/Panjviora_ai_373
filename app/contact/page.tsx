
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 px-6 py-5">
        <a href="/" className="text-2xl font-bold text-blue-400">
          ALIQO
        </a>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-3 font-semibold tracking-widest text-blue-400">
          WE ARE HERE TO HELP
        </p>

        <h1 className="mb-6 text-4xl font-bold">Contact Us</h1>

        <p className="mb-10 leading-8 text-slate-300">
          Thank you for visiting ALIQO. We welcome your questions,
          suggestions, feedback, and business inquiries.
        </p>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-3 text-2xl font-bold">Get in Touch</h2>

          <p className="mb-5 leading-7 text-slate-300">
            For support, business inquiries, or general questions,
            contact our team by email.
          </p>

          <a
            href="mailto:aliqo37311011@gmail.com"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            aliqo37311011@gmail.com
          </a>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-bold">
            Your Feedback Matters
          </h2>

          <p className="leading-8 text-slate-300">
            Your feedback helps us improve ALIQO and make the search
            experience more useful and accessible.
          </p>
        </section>

        <a
          href="/"
          className="inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
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
