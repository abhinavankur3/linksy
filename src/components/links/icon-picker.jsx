"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { searchIcons, getIconData } from "@/actions/icons";

export function IconPicker({ value, onChange, autoDetected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef(null);

  // Load the selected icon's data on mount
  useEffect(() => {
    if (value && !selectedIcon) {
      startTransition(async () => {
        const icon = await getIconData(value);
        if (icon) setSelectedIcon(icon);
      });
    }
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const icons = await searchIcons(query);
        setResults(icons);
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  function handleSelect(icon) {
    setSelectedIcon(icon);
    onChange(icon.id);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }

  function handleClear() {
    setSelectedIcon(null);
    onChange("");
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
      >
        {selectedIcon ? (
          <>
            <IconSvg icon={selectedIcon} size={16} />
            <span className="text-gray-700">{selectedIcon.label}</span>
          </>
        ) : autoDetected ? (
          <span className="text-gray-500">Auto-detected (click to change)</span>
        ) : (
          <>
            <DefaultLinkSvg size={16} />
            <span className="text-gray-500">Choose icon...</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons (e.g. amazon, linkedin, globe)..."
            className="mb-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="mb-2 w-full rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
            >
              Remove icon
            </button>
          )}

          {isPending && (
            <p className="py-2 text-center text-xs text-gray-400">
              Searching...
            </p>
          )}

          {results.length > 0 && (
            <div className="grid max-h-52 grid-cols-5 gap-1 overflow-y-auto">
              {results.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => handleSelect(icon)}
                  className="flex flex-col items-center gap-1 rounded-md p-2 hover:bg-gray-100"
                  title={icon.label}
                >
                  <IconSvg icon={icon} size={20} />
                  <span className="max-w-full truncate text-[10px] text-gray-500">
                    {icon.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && !isPending && results.length === 0 && (
            <p className="py-2 text-center text-xs text-gray-400">
              No icons found
            </p>
          )}

          {query.length < 2 && results.length === 0 && !isPending && (
            <p className="py-2 text-center text-xs text-gray-400">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      )}

      <input type="hidden" name="icon" value={value || ""} />
    </div>
  );
}

function IconSvg({ icon, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="currentColor"
      className="text-gray-700"
    >
      <path d={typeof icon.path === "string" ? icon.path : icon.path[0]} />
    </svg>
  );
}

function DefaultLinkSvg({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
