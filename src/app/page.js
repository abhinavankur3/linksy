import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-gray-900">Linksy</span>
        <div>
          {session?.user ? (
            <Link
              href="/links"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          One link for
          <br />
          <span className="text-blue-600">everything you share</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-gray-600">
          A fast, self-hosted, open-source alternative to Linktree. No bloat, no
          tracking, no lock-in.
        </p>
        <div className="mt-8 flex gap-3">
          {session?.user ? (
            <Link
              href="/links"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            GitHub
          </a>
        </div>

        {/* Features */}
        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          <Feature
            title="Fast"
            description="Sub-100ms page loads. Static generation with ISR. No heavy runtimes."
          />
          <Feature
            title="Self-hosted"
            description="One Docker container. SQLite database. Your data stays with you."
          />
          <Feature
            title="Open source"
            description="MIT licensed. No paid tiers. No cloud lock-in. Fork it, hack it."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        Linksy — Open source link-in-bio
      </footer>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
