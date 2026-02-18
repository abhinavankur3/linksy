import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Sign in | Linksy",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/links");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Linksy
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
