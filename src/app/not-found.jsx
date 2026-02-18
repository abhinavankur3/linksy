import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page not found.</p>
      <Link
        href="/"
        className="mt-4 text-sm text-blue-600 hover:text-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
