"use client";

import { useState, useEffect } from "react";
import { getIconData } from "@/actions/icons";

// Default chain-link icon (shown when no icon is set)
export function DefaultLinkIcon({ size = 18, className = "" }) {
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
      className={`text-gray-400 ${className}`}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function LinkIcon({ slug, size = 18, className = "" }) {
  const [icon, setIcon] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoaded(true);
      return;
    }
    getIconData(slug).then((data) => {
      setIcon(data);
      setLoaded(true);
    });
  }, [slug]);

  if (!loaded) return <DefaultLinkIcon size={size} className={className} />;
  if (!icon) return <DefaultLinkIcon size={size} className={className} />;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="currentColor"
      className={`text-gray-600 ${className}`}
      aria-label={icon.label}
    >
      <path d={typeof icon.path === "string" ? icon.path : icon.path[0]} />
    </svg>
  );
}
