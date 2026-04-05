"use client";

import { useState, useTransition } from "react";
import { generateQRCode } from "@/actions/qr";

export function QRCodeCard() {
  const [qrData, setQrData] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateQRCode();
      setQrData(result);
    });
  }

  function handleDownload() {
    if (!qrData?.dataUrl) return;
    const a = document.createElement("a");
    a.href = qrData.dataUrl;
    a.download = "linksy-qr-code.png";
    a.click();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">QR Code</h2>

      {!qrData ? (
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {isPending ? "Generating..." : "Generate QR Code"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <img
            src={qrData.dataUrl}
            alt="QR Code"
            className="h-48 w-48 rounded-md border border-gray-100"
          />
          <p className="text-center text-xs text-gray-500 break-all">
            {qrData.profileUrl}
          </p>
          <button
            onClick={handleDownload}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
