
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F3F7F1] text-[#17251B]">
      {/* Header */}
      <header className="border-b border-[#D6C58B]/30 bg-[#0B1A11] px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a
            href="/"
            className="text-3xl font-extrabold tracking-wider text-[#E4C35D]"
          >
            ALIQO
          </a>

          <span className="text-sm font-medium text-[#E4C35D]">
            Contact Us
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#10251A] px-6 py-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E4C35D]">
          WE ARE HERE TO HELP
        </p>

        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          Contact Us
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-green-100">
          Have a question, suggestion, or business inquiry?
          We would love to hear from you.
        </p>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="grid gap-7 md:grid-cols-2">

          {/* Email Card */}
          <div className="rounded-2xl border border-[#DCE5D9] bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#183522] text-2xl text-[#E4C35D]">
              ✉
            </div>

            <h2 className="text-2xl font-bold text-[#183522]">
              Email Support
            </h2>

            <p className="mt-4 leading-7 text-[#526356]">
              For questions, technical support, or general inquiries,
              contact our team through email.
            </p>

            <a
              href="mailto:aliqo37311011@gmail.com"
              className="mt-6 inline-block break-all font-semibold text-[#98751D] underline underline-offset-4 hover:text-[#183522]"
            >
              aliqo37311011@gmail.com
            </a>
          </div>

          {/* Feedback Card */}
          <div className="rounded-2xl border border-[#DCE5D9] bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#183522] text-2xl text-[#E4C35D]">
              ★
            </div>

            <h2 className="text-2xl font-bold text-[#183522]">
              Your Feedback Matters
            </h2>

            <p className="mt-4 leading-7 text-[#526356]">
              Your suggestions help us improve ALIQO. Share your
              ideas, report an issue, or tell us about your experience.
            </p>

            <a
              href="mailto:aliqo37311011@gmail.com?subject=ALIQO%20Feedback"
              className="mt-6 inline-flex rounded-xl bg-[#183522] px-6 py-3 font-semibold text-white transition hover:bg-[#0B1A11]"
            >
              Send Your Feedback →
            </a>
          </div>
        </div>

        {/* Message Section */}
        <div className="mt-8 rounded-2xl border border-[#DCE5D9] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-[#98751D]">
            ALIQO SUPPORT
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#183522]">
            We Appreciate Your Trust
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#526356]">
            We are continuously working to make your search
            experience better, smarter, and more useful.
            Thank you for being part of ALIQO.
          </p>

          <a
            href="/"
            className="mt-7 inline-flex rounded-xl bg-[#183522] px-7 py-3 font-semibold text-white transition hover:bg-[#0B1A11]"
          >
            ← Back to Home
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090F0B] px-6 py-7 text-center">
        <p className="text-sm text-green-100">
          © 2026 ALIQO. All rights reserved.
        </p>

        <p className="mt-2 text-xs text-[#C6A33D]">
          Search Smarter. Discover More.
        </p>
      </footer>
    </main>
  );
}
