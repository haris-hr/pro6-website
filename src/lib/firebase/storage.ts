import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { getStorageInstance } from "./config";
import type { MediaFile } from "@/types";

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string; path: string }> {
  const storage = await getStorageInstance();
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return { url, path };
}

/**
 * Upload an image to the images folder
 */
export async function uploadImage(file: File, filename?: string): Promise<MediaFile> {
  const storage = await getStorageInstance();
  const name = filename || `${Date.now()}-${file.name}`;
  const path = `images/${name}`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return {
    id: name,
    name: file.name,
    url,
    path,
    type: file.type.startsWith("video/") ? "video" : "image",
    size: file.size,
    createdAt: new Date(),
  };
}

/**
 * Upload a video to the videos folder
 */
export async function uploadVideo(file: File, filename?: string): Promise<MediaFile> {
  const storage = await getStorageInstance();
  const name = filename || `${Date.now()}-${file.name}`;
  const path = `videos/${name}`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return {
    id: name,
    name: file.name,
    url,
    path,
    type: "video",
    size: file.size,
    createdAt: new Date(),
  };
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storage = await getStorageInstance();
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * List all files in a folder
 */
export async function listFiles(folder: string): Promise<{ name: string; url: string; path: string }[]> {
  const storage = await getStorageInstance();
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  
  const files = await Promise.all(
    result.items.map(async (item) => ({
      name: item.name,
      url: await getDownloadURL(item),
      path: item.fullPath,
    }))
  );
  
  return files;
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(path: string): Promise<string> {
  const storage = await getStorageInstance();
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
