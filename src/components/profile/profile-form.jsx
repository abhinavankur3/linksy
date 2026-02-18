"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/actions/profile";

export function ProfileForm({ profile }) {
  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatarPath ? `/api/uploads/${profile.avatarPath}` : null
  );

  const [state, formAction, isPending] = useActionState(async (_prev, formData) => {
    const result = await updateProfile(formData);
    return result;
  }, null);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          Profile updated successfully.
        </div>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-gray-400">
              {profile?.displayName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div>
          <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change avatar
            <input
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="mt-1 text-xs text-gray-500">Max 2MB. JPEG, PNG, WebP, GIF.</p>
        </div>
      </div>

      <div>
        <label
          htmlFor="displayName"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          defaultValue={profile?.displayName || ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Profile URL
        </label>
        <div className="flex items-center">
          <span className="shrink-0 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            /
          </span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={profile?.slug || ""}
            pattern="[a-z0-9][a-z0-9\-]{1,46}[a-z0-9]"
            className="min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm lowercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="your-username"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Lowercase letters, numbers, and hyphens. 3-48 characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={profile?.bio || ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="A short bio about yourself"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
