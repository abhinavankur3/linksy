import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateUserForm } from "@/components/admin/create-user-form";

export const metadata = {
  title: "Create User | Linksy",
};

export default async function NewUserPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/links");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create User</h1>
      <CreateUserForm />
    </div>
  );
}
