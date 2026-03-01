import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

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

    console.log("Attempting to delete from Vercel Blob:", url);

    // Delete from Vercel Blob storage
    await del(url);
    
    console.log("Successfully deleted from Vercel Blob:", url);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedUrl: url,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: String(error) },
      { status: 500 }
    );
  }
}
