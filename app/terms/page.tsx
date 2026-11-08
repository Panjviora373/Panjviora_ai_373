
export default function TermsPage() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to ALIQO. By accessing or using our website, you agree to these Terms & Conditions. If you do not agree with these terms, please do not use our services.",
    },
    {
      title: "2. Acceptable Use and User Responsibilities",
      content:
        "You agree to use ALIQO lawfully and responsibly. You must not misuse, disrupt, damage, interfere with, or attempt to gain unauthorized access to our website, systems, or services.",
    },
    {
      title: "3. Search Results and AI Information",
      content:
        "ALIQO provides search results and AI-generated information for general informational purposes. We do not guarantee that all information is complete, accurate, reliable, or up to date. Always verify important information through reliable sources before making decisions.",
    },
    {
      title: "4. Third-Party Websites and Services",
      content:
        "Our website may provide links, search results, or access to third-party websites and services. ALIQO does not control these external platforms and is not responsible for their content, availability, security, or privacy practices.",
    },
    {
      title: "5. Advertising and Sponsored Content",
      content:
        "ALIQO may display advertisements, sponsored search results, or promotional content. Paid placements should be identified as sponsored where applicable. Advertisements do not necessarily represent an endorsement by ALIQO.",
    },
    {
      title: "6. Advertising Requests",
      content:
        "Businesses may submit advertising or partnership requests through ALIQO. Submitting a request does not guarantee approval, publication, or advertising placement. ALIQO reserves the right to review and decline requests.",
    },
    {
      title: "7. Intellectual Property",
      content:
        "The ALIQO name, logo, branding, website design, and original materials may be protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or misuse ALIQO materials without appropriate permission.",
    },
    {
      title: "8. Service Availability",
      content:
        "We aim to keep ALIQO available and functional. However, we do not guarantee uninterrupted access. Services may occasionally be unavailable because of maintenance, technical issues, updates, or circumstances beyond our control.",
    },
    {
      title: "9. Limitation of Responsibility",
      content:
        "To the extent permitted by applicable law, ALIQO is not responsible for losses or damages arising from reliance on search results, AI-generated information, third-party websites, advertisements, or temporary service interruptions.",
    },
    {
      title: "10. Privacy Policy",
      content:
        "Your use of ALIQO is also subject to our Privacy Policy, which explains how information may be collected, used, and handled. Please review our Privacy Policy for more details.",
    },
    {
      title: "11. Changes to These Terms",
      content:
        "We may update these Terms & Conditions when necessary. Any updates will be published on this page. Your continued use of ALIQO after changes are published indicates your acceptance of the updated terms.",
    },
    {
      title: "12. Governing Law",
      content:
        "These Terms & Conditions shall be interpreted in accordance with applicable laws. Where relevant, the laws of Pakistan may apply, subject to any mandatory legal requirements.",
    },
    {
      title: "13. Contact ALIQO",
      content:
        "If you have questions, concerns, or feedback regarding these Terms & Conditions, please contact our team using the email address provided below.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F3F7F1] text-[#17251B]">
      <header className="border-b border-[#D6C58B]/30 bg-[#0B1A11] px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a
            href="/"
            className="text-3xl font-extrabold tracking-wider text-[#E4C35D]"
          >
            ALIQO
          </a>
          <span className="text-sm font-medium text-[#E4C35D]">
            Terms & Conditions
          </span>
        </div>
      </header>

      <section className="bg-[#10251A] px-6 py-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E4C35D]">
          ALIQO LEGAL INFORMATION
        </p>
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          Terms & Conditions
        </h1>
        <p className="mt-5 text-sm text-green-100">
          Last updated: November 2026
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-2xl border border-[#DCE5D9] bg-white p-6 shadow-sm md:p-10">
          <p className="mb-8 leading-8 text-[#526356]">
            Welcome to ALIQO. These terms explain the rules and conditions
            for using our website and services. Please read them carefully.
          </p>

          <div className="space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 border-l-4 border-[#C6A33D] pl-4 text-xl font-bold text-[#183522]">
                  {section.title}
                </h2>
                <p className="leading-8 text-[#526356]">
                  {section.content}
                </p>

                {section.title === "10. Privacy Policy" && (
                  <a
                    href="/privacy"
                    className="mt-3 inline-block font-semibold text-[#98751D] underline underline-offset-4 hover:text-[#183522]"
                  >
                    Read ALIQO Privacy Policy →
                  </a>
                )}

                {section.title === "13. Contact ALIQO" && (
                  <a
                    href="mailto:aliqo37311011@gmail.com"
                    className="mt-3 inline-block font-semibold text-[#98751D] underline underline-offset-4 hover:text-[#183522]"
                  >
                    aliqo37311011@gmail.com
                  </a>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-[#DCE5D9] pt-8">
            <a
              href="/"
              className="inline-flex rounded-xl bg-[#183522] px-7 py-3 font-semibold text-white transition hover:bg-[#0B1A11]"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </section>

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
