"use client";

import { useTransition } from "react";
import { toggleUserDisabled } from "@/actions/users";

export function UserToggle({ userId, disabled, isSelf }) {
  const [isPending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-xs text-gray-400">You</span>;
  }

  function handleToggle() {
    startTransition(async () => {
      await toggleUserDisabled(userId);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`text-sm font-medium ${
        disabled
          ? "text-green-600 hover:text-green-700"
          : "text-red-600 hover:text-red-700"
      } disabled:opacity-50`}
    >
      {isPending ? "..." : disabled ? "Enable" : "Disable"}
    </button>
  );
}
