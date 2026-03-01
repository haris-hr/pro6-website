import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    let totalSize = 0;
    let fileCount = 0;
    let cursor: string | undefined;

    // Iterate through all blobs to calculate total size
    do {
      const response = await list({ cursor, limit: 1000 });
      
      for (const blob of response.blobs) {
        totalSize += blob.size;
        fileCount++;
      }
      
      cursor = response.cursor;
    } while (cursor);

    // Convert to MB
    const usedMB = totalSize / (1024 * 1024);
    const limitMB = 100; // Free tier limit

    return NextResponse.json({
      success: true,
      usedBytes: totalSize,
      usedMB: Math.round(usedMB * 100) / 100,
      limitMB,
      percentage: Math.round((usedMB / limitMB) * 100),
      fileCount,
    });
  } catch (error) {
    console.error("Storage usage error:", error);
    return NextResponse.json(
      { error: "Failed to get storage usage" },
      { status: 500 }
    );
  }
}
