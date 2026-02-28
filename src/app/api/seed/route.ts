import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/firebase/firestore";

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${result.pages} pages and ${result.projects} projects`,
      ...result 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "POST to this endpoint to seed the database" 
  });
}
