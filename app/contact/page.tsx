
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F3F7F1] text-[#17251B]">
      <nav className="border-b border-white/10 bg-[#0B1A11] px-6 py-5">
        <a
          href="/"
          className="text-2xl font-bold tracking-wide text-[#E4C35D]"
        >
          ALIQO
        </a>
      </nav>

      <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <header className="mb-12 rounded-3xl bg-[#10251A] px-8 py-12 text-white shadow-xl md:px-12">
          <p className="mb-4 text-sm font-bold tracking-[0.25em] text-[#E4C35D]">
            WE ARE HERE TO HELP
          </p>

          <h1 className="mb-5 text-4xl font-bold md:text-5xl">
            Contact Us
          </h1>

          <p className="max-w-2xl leading-8 text-slate-300">
            Thank you for visiting ALIQO. We welcome your questions,
            suggestions, feedback, and business inquiries. Our team
            appreciates hearing from you.
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-[#DCE5D9] bg-white p-8 shadow-sm md:p-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1E7] text-2xl">
            ✉
          </div>

          <p className="mb-2 text-sm font-bold tracking-widest text-[#98751D]">
            GET IN TOUCH
          </p>

          <h2 className="mb-4 text-2xl font-bold text-[#183522]">
            We'd Love to Hear From You
          </h2>

          <p className="mb-6 leading-8 text-slate-600">
            For support, business inquiries, advertising questions,
            or general feedback, please contact us by email.
          </p>

          <a
            href="mailto:aliqo37311011@gmail.com"
            className="inline-block break-all rounded-full bg-[#10251A] px-7 py-3 font-semibold text-[#E4C35D] transition hover:bg-[#1B3826]"
          >
            aliqo37311011@gmail.com
          </a>
        </section>

        <section className="mb-10 rounded-3xl border border-[#DCE5D9] bg-white p-8 shadow-sm md:p-10">
          <p className="mb-2 text-sm font-bold tracking-widest text-[#98751D]">
            YOUR VOICE MATTERS
          </p>

          <h2 className="mb-4 text-2xl font-bold text-[#183522]">
            Your Feedback Helps Us Grow
          </h2>

          <p className="leading-8 text-slate-600">
            Your suggestions and feedback help us improve ALIQO
            and make the search experience more useful, reliable,
            and accessible for everyone.
          </p>
        </section>

        <a
          href="/"
          className="inline-block rounded-full bg-[#10251A] px-8 py-3 font-semibold text-[#E4C35D] transition hover:bg-[#1B3826]"
        >
          ← Back to Home
        </a>
      </article>

      <footer className="border-t border-[#26382B] bg-[#090F0B] px-6 py-8 text-center text-sm text-slate-400">
        © 2026 ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
