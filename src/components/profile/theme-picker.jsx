"use client";

import { THEMES } from "@/lib/themes";

function ClassicPreview({ vars }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-1.5 p-3"
      style={{ background: vars["--bg"] }}
    >
      <div
        className="h-5 w-5 rounded-full"
        style={{ backgroundColor: vars["--avatar-bg"] }}
      />
      <div className="h-1 w-8 rounded-full" style={{ backgroundColor: vars["--text"] }} />
      <div className="h-0.5 w-10 rounded-full" style={{ backgroundColor: vars["--text-secondary"], opacity: 0.5 }} />
      <div className="mt-1 flex w-full flex-col items-center gap-1">
        <LinkBar vars={vars} />
        <LinkBar vars={vars} />
        <LinkBar vars={vars} />
      </div>
    </div>
  );
}

function CardPreview({ vars }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center p-2"
      style={{ background: vars["--bg"] }}
    >
      <div
        className="flex w-full flex-col items-center gap-1.5 rounded-lg p-2.5"
        style={{ backgroundColor: vars["--bg-card"], boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
      >
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: vars["--avatar-bg"] }}
        />
        <div className="h-1 w-7 rounded-full" style={{ backgroundColor: vars["--text"] }} />
        <div className="mt-0.5 flex w-full flex-col items-center gap-1">
          <LinkBar vars={vars} />
          <LinkBar vars={vars} />
        </div>
      </div>
    </div>
  );
}

function CoverPreview({ vars }) {
  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: vars["--bg-card"] || vars["--bg-solid"] || "#fff" }}>
      <div className="h-8 w-full" style={{ background: vars["--bg"] }} />
      <div className="-mt-3 flex flex-1 flex-col items-center gap-1 px-2 pb-2">
        <div
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: vars["--avatar-bg"], border: `2px solid ${vars["--bg-card"] || "#fff"}` }}
        />
        <div className="h-1 w-7 rounded-full" style={{ backgroundColor: vars["--text"] }} />
        <div className="mt-0.5 flex w-full flex-col items-center gap-1">
          <LinkBar vars={vars} />
          <LinkBar vars={vars} />
        </div>
      </div>
    </div>
  );
}

function LinkBar({ vars }) {
  return (
    <div
      className="h-2.5 w-full"
      style={{
        backgroundColor: vars["--link-bg"],
        border: `1px solid ${vars["--link-border"]}`,
        borderRadius: vars["--link-radius"],
        boxShadow: vars["--link-shadow"],
      }}
    />
  );
}

const LAYOUT_PREVIEWS = {
  classic: ClassicPreview,
  card: CardPreview,
  cover: CoverPreview,
};

export function ThemePicker({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Theme
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.values(THEMES).map((theme) => {
          const PreviewComponent = LAYOUT_PREVIEWS[theme.layout] || ClassicPreview;
          const isSelected = value === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`rounded-lg border-2 p-2 text-left transition-all ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-2 overflow-hidden rounded-md border border-gray-100" style={{ aspectRatio: "9/14" }}>
                <PreviewComponent vars={theme.vars} />
              </div>
              <p className="text-xs font-medium text-gray-700">{theme.name}</p>
              <p className="text-[10px] capitalize text-gray-400">
                {theme.layout}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
