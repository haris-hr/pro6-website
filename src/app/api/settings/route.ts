import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/firebase/firestore";

export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        error: "No settings found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        siteName: settings.siteName,
        address: settings.footer.address,
        phone: settings.footer.phone,
        email: settings.footer.email,
        socialLinks: settings.footer.socialLinks,
      }
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
