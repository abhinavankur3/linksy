"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateLink } from "@/actions/links";
import { IconPicker } from "./icon-picker";
import { LinkIcon, DefaultLinkIcon } from "./link-icon";

export function LinkItem({ link, onToggle, onDelete, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editIcon, setEditIcon] = useState(link.icon || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleSaveEdit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("title", editTitle);
    formData.set("url", editUrl);
    formData.set("icon", editIcon);
    await updateLink(link.id, formData);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4"
      >
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Icon
            </label>
            <IconPicker value={editIcon} onChange={setEditIcon} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 sm:gap-3 sm:p-4"
    >
      <button
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      {link.icon ? (
        <LinkIcon slug={link.icon} size={20} />
      ) : (
        <DefaultLinkIcon size={20} />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-900">
            {link.title}
          </p>
          {link._count?.clicks > 0 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {link._count.clicks} clicks
            </span>
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{link.url}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(link.id)}
          disabled={disabled}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            link.active ? "bg-blue-600" : "bg-gray-300"
          }`}
          title={link.active ? "Disable link" : "Enable link"}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              link.active ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </button>

        <button
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Edit link"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          onClick={() => onDelete(link.id)}
          disabled={disabled}
          className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          title="Delete link"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
