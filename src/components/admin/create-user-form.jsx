"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/users";
import { useRouter } from "next/navigation";

export function CreateUserForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(async (_prev, formData) => {
    const result = await createUser(formData);
    if (result?.success) {
      router.push("/admin/users");
      return { success: true };
    }
    return result;
  }, null);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          User created successfully. Redirecting...
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          Profile Slug
        </label>
        <div className="flex items-center">
          <span className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            /
          </span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            pattern="[a-z0-9][a-z0-9\-]{1,46}[a-z0-9]"
            className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm lowercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="username"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
