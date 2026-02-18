"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ role, open, onClose }) {
  const pathname = usePathname();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <Link
            href="/links"
            className="text-lg font-bold text-gray-900"
            onClick={handleNavClick}
          >
            Linksy
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <SidebarLink href="/links" label="Links" pathname={pathname} onClick={handleNavClick} />
          <SidebarLink href="/profile" label="Profile" pathname={pathname} onClick={handleNavClick} />
          {role === "admin" && (
            <>
              <div className="my-3 border-t border-gray-200" />
              <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
                Admin
              </p>
              <SidebarLink href="/admin" label="Dashboard" pathname={pathname} onClick={handleNavClick} />
              <SidebarLink href="/admin/users" label="Users" pathname={pathname} onClick={handleNavClick} />
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ href, label, pathname, onClick }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}
