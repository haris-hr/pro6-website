import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface StaticImage {
  name: string;
  url: string;
  type: string;
  folder: string;
}

function getImagesFromDir(dirPath: string, baseUrl: string, folder: string): StaticImage[] {
  const images: StaticImage[] = [];
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        // Only include image and video files
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm'].includes(ext)) {
          const type = ['.mp4', '.webm'].includes(ext) ? 'video' : 'image';
          images.push({
            name: file,
            url: `${baseUrl}/${file}`,
            type,
            folder,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return images;
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const imagesDir = path.join(publicDir, "images");
    const projectsDir = path.join(imagesDir, "projects");
    
    // Get images from main images folder
    const mainImages = getImagesFromDir(imagesDir, "/images", "images");
    
    // Get images from projects subfolder
    const projectImages = getImagesFromDir(projectsDir, "/images/projects", "projects");
    
    // Combine all images
    const allImages = [...mainImages, ...projectImages];
    
    return NextResponse.json({ 
      success: true, 
      images: allImages,
      count: allImages.length
    });
  } catch (error) {
    console.error("Error listing static images:", error);
    return NextResponse.json(
      { success: false, error: String(error), images: [] },
      { status: 500 }
    );
  }
}
