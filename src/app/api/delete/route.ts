import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("Attempting to delete from Vercel Blob:", url);

    // Delete from Vercel Blob storage
    await del(url);
    
    console.log("Successfully deleted from Vercel Blob:", url);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedUrl: url,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
