import Link from "next/link";

export function Sidebar({ role }) {
  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link href="/links" className="text-lg font-bold text-gray-900">
          Linksy
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <SidebarLink href="/links" label="Links" />
        <SidebarLink href="/profile" label="Profile" />
        {role === "admin" && (
          <>
            <div className="my-3 border-t border-gray-200" />
            <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
              Admin
            </p>
            <SidebarLink href="/admin" label="Dashboard" />
            <SidebarLink href="/admin/users" label="Users" />
          </>
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({ href, label }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {label}
    </Link>
  );
}
