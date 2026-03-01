import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const files: { url: string; name: string; size: number; uploadedAt: Date }[] = [];
    let cursor: string | undefined;

    // Iterate through all blobs
    do {
      const response = await list({ cursor, limit: 1000 });
      
      for (const blob of response.blobs) {
        files.push({
          url: blob.url,
          name: blob.pathname.split('/').pop() || blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
        });
      }
      
      cursor = response.cursor;
    } while (cursor);

    return NextResponse.json({
      success: true,
      files,
      count: files.length,
    });
  } catch (error) {
    console.error("Blob list error:", error);
    return NextResponse.json(
      { error: "Failed to list blob files" },
      { status: 500 }
    );
  }
}
