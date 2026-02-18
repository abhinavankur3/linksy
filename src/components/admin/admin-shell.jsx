"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AdminShell({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        role={user.role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 bg-gray-50 p-4 md:p-6">
          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
