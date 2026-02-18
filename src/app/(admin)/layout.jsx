import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
