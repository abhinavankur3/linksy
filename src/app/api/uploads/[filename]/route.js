import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(_request, { params }) {
  const { filename } = await params;

  // Sanitize: prevent directory traversal
  const sanitized = path.basename(filename);
  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  const filepath = path.join(uploadDir, sanitized);

  try {
    const file = await readFile(filepath);
    const ext = path.extname(sanitized).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
