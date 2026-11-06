
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-800">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-blue-700">
          Terms & Conditions
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          Welcome to Panjviora AI Search 373. By using our website,
          you agree to these terms and conditions.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Using Our Services</h2>
        <p className="mt-3 leading-8 text-slate-600">
          You agree to use our search services lawfully and responsibly.
          You must not misuse, disrupt or attempt to damage our website.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Search Information</h2>
        <p className="mt-3 leading-8 text-slate-600">
          Search results and AI-generated answers are provided for
          informational purposes. Users should verify important information
          from reliable sources.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Third-Party Websites</h2>
        <p className="mt-3 leading-8 text-slate-600">
          Our search results may link to external websites.
          We do not control or guarantee their content or services.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Changes to These Terms</h2>
        <p className="mt-3 leading-8 text-slate-600">
          We may update these terms when necessary.
          Continued use of the website means you accept the updated terms.
        </p>

        <a href="/" className="mt-10 inline-block font-semibold text-blue-600">
          ← Back to Home
        </a>
      </article>
    </main>
  );
}
