import { NextResponse } from "next/server";
import { updateProject } from "@/lib/firebase/firestore";

export async function POST() {
  try {
    // Update Project 2
    await updateProject("project-2", {
      date: "2024",
      images: ["/images/pro6-2.jpg", "/images/pro6-3.jpg", "/images/pro6-4.jpg"],
      fullDescription: "Dit project in Heerhugowaard omvat de ontwikkeling van moderne woningen met aandacht voor duurzaamheid en leefbaarheid. Het ontwerp combineert hedendaagse architectuur met groene buitenruimtes, waardoor een prettige woonomgeving ontstaat voor bewoners van alle leeftijden.",
    });

    // Update Project 3
    await updateProject("project-3", {
      date: "2025",
      images: ["/images/pro6-3.jpg", "/images/pro6-4.jpg", "/images/pro6-2.jpg"],
      fullDescription: "In het hart van Alkmaar ontwikkelt Pro6 een uniek woonproject dat perfect aansluit bij de historische charme van de stad. Met ruime appartementen en penthouses biedt dit project een hoogwaardige woonervaring met alle moderne gemakken binnen handbereik.",
    });

    return NextResponse.json({ success: true, message: "Projects updated successfully" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
