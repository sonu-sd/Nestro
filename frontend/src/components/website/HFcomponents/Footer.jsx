import Link from "next/link";

const company = [
  ["Our Story", "/about"],
  ["Sustainability", "/about"],
  ["Showrooms", "/contact"],
  ["Careers", "/contact"],
];
const support = [
  ["Returns & Exchange", "/contact"],
  ["Assembly Help", "/contact"],
  ["Contact Us", "/contact"],
];

function FooterLinks({ links }) {
  return (
    <ul className="space-y-2 text-xs text-white/65">
      {links.map(([label, href]) => (
        <li key={label}>
          <Link href={href} className="transition hover:text-[#C6A27E]">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#211208] px-4 pb-5 pt-8 text-white sm:px-6 lg:px-8 lg:pb-8 lg:pt-12">
      <div className="mx-auto max-w-[1580px]">
        <div className="flex items-start justify-between gap-4 lg:hidden">
          <div>
            <Link
              href="/"
              className="text-base font-bold uppercase tracking-[0.3em]"
            >
              Nestro<span className="text-[#C58A42]">.</span>
            </Link>
            <p className="mt-2 text-xs text-white/50">
              Furniture for thoughtful homes.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/75"
          >
            Need help?
          </Link>
        </div>

        <div className="mt-6 divide-y divide-white/10 border-y border-white/10 lg:hidden">
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
              Company
              <span className="text-[#C58A42] group-open:rotate-45">+</span>
            </summary>
            <div className="pt-4">
              <FooterLinks links={company} />
            </div>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
              Support
              <span className="text-[#C58A42] group-open:rotate-45">+</span>
            </summary>
            <div className="pt-4">
              <FooterLinks links={support} />
            </div>
          </details>
        </div>

        <div className="hidden grid-cols-5 gap-12 lg:grid">
          <div className="col-span-2">
            <Link
              href="/"
              className="text-xl font-bold uppercase tracking-[0.3em]"
            >
              Nestro<span className="text-[#C58A42]">.</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
              Curated furniture for thoughtful homes. Crafted with intention,
              made to endure.
            </p>
            <div className="mt-5 flex max-w-xl overflow-hidden rounded-lg border border-[#493326]">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                className="bg-[#9C6A42] px-6 py-3 text-sm font-semibold"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-[#C6A27E]">
              Company
            </h3>
            <FooterLinks links={company} />
          </div>
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-[#C6A27E]">
              Support
            </h3>
            <FooterLinks links={support} />
          </div>
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-[#C6A27E]">
              Account
            </h3>
            <FooterLinks
              links={[
                ["My profile", "/profile"],
                ["Shopping cart", "/cart"],
                ["Write a review", "/reviews/write"],
              ]}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/40 lg:mt-9 lg:border-t lg:border-white/10 lg:pt-5">
          <p>© 2026 Nestro</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
