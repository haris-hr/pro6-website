import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Only allow deleting files from /images or /videos folders
    if (!url.startsWith("/images/") && !url.startsWith("/videos/")) {
      return NextResponse.json(
        { error: "Cannot delete files outside of images/videos folders" },
        { status: 403 }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), "public", url);

    // Delete the file
    try {
      await unlink(filePath);
    } catch (fileError: unknown) {
      // File might not exist, which is fine - we still want to clean up Firestore
      const error = fileError as { code?: string };
      if (error.code !== "ENOENT") {
        console.error("Error deleting file:", fileError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
