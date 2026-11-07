export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 px-6 py-5">
        <a href="/" className="text-2xl font-bold text-blue-400">
          ALIQO
        </a>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-3 font-semibold tracking-widest text-blue-400">
          GET IN TOUCH
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Contact Us
        </h1>

        <p className="mb-10 text-lg leading-8 text-slate-300">
          Have a question, suggestion, or feedback about ALIQO?
          We would be happy to hear from you.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-4 text-2xl font-bold">Send us a message</h2>

          <form
            action="mailto:YOUR_EMAIL@example.com"
            method="post"
            encType="text/plain"
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 p-4 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-slate-900 p-4 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 p-4 text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Please replace YOUR_EMAIL@example.com with your real support email
          before publishing this page.
        </p>

        <a
          href="/"
          className="mt-8 inline-block text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </a>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} ALIQO. All rights reserved.
      </footer>
    </main>
  );
}
