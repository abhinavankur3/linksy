"use client";

import { useRef, useState, useTransition } from "react";
import { createLinkGroup } from "@/actions/link-groups";

export function GroupForm({ onGroupAdded }) {
  const formRef = useRef(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);

    startTransition(async () => {
      const result = await createLinkGroup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.group) {
        formRef.current?.reset();
        onGroupAdded?.(result.group);
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        name="name"
        type="text"
        required
        placeholder="New group name"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add Group"}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
