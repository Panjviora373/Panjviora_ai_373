
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-blue-700">
          About Aliqo
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          Panjviora AI Search 373 is an independent search platform
          designed to help people discover information and explore
          knowledge through AI-powered search.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Our Mission</h2>
        <p className="mt-3 leading-8 text-slate-600">
          Our mission is to make information discovery simple,
          accessible and useful for everyone.
        </p>

        <h2 className="mt-8 text-2xl font-bold">What We Offer</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
          <li>AI-assisted answers</li>
          <li>Web search results</li>
          <li>A simple search experience</li>
          <li>Access to useful information</li>
        </ul>

        <a href="/" className="mt-10 inline-block font-semibold text-blue-600">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
