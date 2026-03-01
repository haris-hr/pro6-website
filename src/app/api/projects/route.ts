import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/firebase/firestore";

export const revalidate = 0;

export async function GET() {
  try {
    const projects = await getPublishedProjects();
    
    return NextResponse.json({
      success: true,
      projects: projects.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle || p.location || '',
        heroImage: p.heroImage || '/images/dok6-1.jpg',
        isDefaultImage: !p.heroImage,
      }))
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: String(error), projects: [] },
      { status: 500 }
    );
  }
}
