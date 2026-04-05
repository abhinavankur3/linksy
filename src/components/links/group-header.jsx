"use client";

import { useState, useTransition } from "react";
import { updateLinkGroup, deleteLinkGroup } from "@/actions/link-groups";

export function GroupHeader({ group, onDeleted, onRenamed }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [isPending, startTransition] = useTransition();

  function handleRename(e) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      const result = await updateLinkGroup(group.id, formData);
      if (result?.success) {
        setIsEditing(false);
        onRenamed?.(group.id, name);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete group "${group.name}"? Links in this group will become ungrouped.`)) return;
    startTransition(async () => {
      await deleteLinkGroup(group.id);
      onDeleted?.(group.id);
    });
  }

  if (isEditing) {
    return (
      <form onSubmit={handleRename} className="flex flex-1 items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => { setIsEditing(false); setName(group.name); }}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <>
      <h3 className="flex-1 text-sm font-semibold text-gray-700">{group.name}</h3>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Rename group"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
          title="Delete group"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </>
  );
}
