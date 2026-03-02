import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// CORS headers for cross-origin requests from DirectAdmin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Max file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Allowed types: JPEG, PNG, GIF, WebP, MP4, WebM" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${originalName}`;

    // Determine folder based on type
    const isVideo = file.type.startsWith("video/");
    const folder = isVideo ? "videos" : "images";

    // Upload to Vercel Blob
    const blob = await put(`${folder}/${filename}`, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      name: file.name,
      size: file.size,
      type: isVideo ? "video" : "image",
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500, headers: corsHeaders }
    );
  }
}
