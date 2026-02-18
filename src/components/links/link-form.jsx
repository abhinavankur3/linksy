"use client";

import { useRef, useState, useTransition } from "react";
import { createLink } from "@/actions/links";
import { detectIconFromUrl } from "@/lib/icons";
import { IconPicker } from "./icon-picker";

export function LinkForm({ onLinkAdded }) {
  const formRef = useRef(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [icon, setIcon] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);

  function handleUrlBlur(e) {
    const url = e.target.value;
    if (!icon && url) {
      const detected = detectIconFromUrl(url);
      if (detected) {
        setIcon(detected);
        setAutoDetected(true);
      }
    }
  }

  function handleIconChange(slug) {
    setIcon(slug);
    setAutoDetected(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setError(null);

    startTransition(async () => {
      const result = await createLink(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.link) {
        formRef.current?.reset();
        setIcon("");
        setAutoDetected(false);
        onLinkAdded?.(result.link);
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Add Link</h2>
      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            name="title"
            type="text"
            required
            placeholder="Title"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="url"
            type="url"
            required
            placeholder="https://example.com"
            onBlur={handleUrlBlur}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <IconPicker
            value={icon}
            onChange={handleIconChange}
            autoDetected={autoDetected}
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}
