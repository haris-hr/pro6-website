import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./config";
import type { Page, Project, SiteSettings, MediaFile } from "@/types";

// Collection names
const PAGES_COLLECTION = "pages";
const PROJECTS_COLLECTION = "projects";
const SETTINGS_COLLECTION = "settings";
const MEDIA_COLLECTION = "media";

// Helper to convert Firestore timestamps to Dates
function convertTimestamps<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    const value = result[key];
    if (value instanceof Timestamp) {
      (result as Record<string, unknown>)[key] = value.toDate();
    }
  }
  return result;
}

// Helper to convert Dates to Firestore timestamps and remove undefined values
function prepareForFirestore<T>(data: T): T {
  const transform = (value: unknown): unknown => {
    if (value === undefined) return undefined;
    if (value instanceof Date) return Timestamp.fromDate(value);
    if (value instanceof Timestamp) return value;

    if (Array.isArray(value)) {
      return value
        .map((v) => transform(v))
        .filter((v) => v !== undefined);
    }

    if (value !== null && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(obj)) {
        const v = transform(obj[k]);
        if (v !== undefined) out[k] = v;
      }
      return out;
    }

    return value;
  };

  return transform(data) as T;
}

// ==================== PAGES ====================

export async function getAllPages(): Promise<Page[]> {
  const db = await getDb();
  const snapshot = await getDocs(collection(db, PAGES_COLLECTION));
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Page);
}

export async function getPageById(pageId: string): Promise<Page | null> {
  const db = await getDb();
  const docRef = doc(db, PAGES_COLLECTION, pageId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = await getDb();
  const q = query(collection(db, PAGES_COLLECTION), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return convertTimestamps({ ...docSnap.data(), id: docSnap.id }) as Page;
}

export async function createPage(page: Page): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PAGES_COLLECTION, page.id);
  await setDoc(docRef, prepareForFirestore(page as unknown as Record<string, unknown>));
}

export async function updatePage(pageId: string, data: Partial<Page>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PAGES_COLLECTION, pageId);
  await updateDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>));
}

export async function deletePage(pageId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PAGES_COLLECTION, pageId);
  await deleteDoc(docRef);
}

export function subscribePages(callback: (pages: Page[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    unsubscribe = onSnapshot(
      collection(db, PAGES_COLLECTION),
      (snapshot) => {
        const pages = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Page
        );
        callback(pages);
      },
      (error) => {
        console.error("Error subscribing to pages:", error);
        callback([]);
      }
    );
  }).catch((error) => {
    console.error("Error getting db for pages subscription:", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// ==================== PROJECTS ====================

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Project);
}

export async function getPublishedProjects(): Promise<Project[]> {
  const db = await getDb();
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where("published", "==", true),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Project);
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const db = await getDb();
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as Project;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  const q = query(collection(db, PROJECTS_COLLECTION), where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return convertTimestamps({ ...docSnap.data(), id: docSnap.id }) as Project;
}

export async function createProject(project: Project): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, prepareForFirestore(project as unknown as Record<string, unknown>));
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>));
}

export async function deleteProject(projectId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
}

export function subscribeProjects(callback: (projects: Project[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("order", "asc"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as Project
        );
        callback(projects);
      },
      (error) => {
        console.error("Error subscribing to projects:", error);
        callback([]);
      }
    );
  }).catch((error) => {
    console.error("Error getting db for projects subscription:", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const db = await getDb();
  const docRef = doc(db, SETTINGS_COLLECTION, "site");
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, SETTINGS_COLLECTION, "site");
  await setDoc(docRef, prepareForFirestore({ ...data, updatedAt: new Date() } as unknown as Record<string, unknown>), { merge: true });
}

export function subscribeSiteSettings(callback: (settings: SiteSettings | null) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const docRef = doc(db, SETTINGS_COLLECTION, "site");
    unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(null);
          return;
        }
        callback(convertTimestamps({ ...snapshot.data(), id: snapshot.id }) as SiteSettings);
      },
      (error) => {
        console.error("Error subscribing to site settings:", error);
        callback(null);
      }
    );
  }).catch((error) => {
    console.error("Error getting db for settings subscription:", error);
    callback(null);
  });
  
  return () => unsubscribe();
}

// ==================== MEDIA ====================

export async function getAllMedia(): Promise<MediaFile[]> {
  const db = await getDb();
  const q = query(collection(db, MEDIA_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as MediaFile);
}

export async function createMedia(media: MediaFile): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, MEDIA_COLLECTION, media.id);
  await setDoc(docRef, prepareForFirestore(media as unknown as Record<string, unknown>));
}

export async function deleteMedia(mediaId: string): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, MEDIA_COLLECTION, mediaId);
  await deleteDoc(docRef);
}

export function subscribeMedia(callback: (media: MediaFile[]) => void): Unsubscribe {
  let unsubscribe: Unsubscribe = () => {};
  
  getDb().then((db) => {
    const q = query(collection(db, MEDIA_COLLECTION), orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const media = snapshot.docs.map(
          (doc) => convertTimestamps({ ...doc.data(), id: doc.id }) as MediaFile
        );
        callback(media);
      },
      (error) => {
        console.error("Error subscribing to media:", error);
        callback([]);
      }
    );
  }).catch((error) => {
    console.error("Error getting db for media subscription:", error);
    callback([]);
  });
  
  return () => unsubscribe();
}

// ==================== SEEDING ====================

export async function seedDatabase(): Promise<{ pages: number; projects: number }> {
  const db = await getDb();
  
  // Check if already seeded
  const pagesSnapshot = await getDocs(collection(db, PAGES_COLLECTION));
  if (!pagesSnapshot.empty) {
    return { pages: 0, projects: 0 };
  }
  
  const now = new Date();
  
  // Seed default pages
  const defaultPages: Page[] = [
    {
      id: "home",
      slug: "",
      title: "Pro6 - Creating Living Spaces",
      metaDescription: "Pro6 ontwikkelt én ontwerpt woningbouwprojecten in heel Nederland.",
      sections: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "projecten",
      slug: "projecten",
      title: "Projecten - Pro6",
      metaDescription: "Bekijk onze woningbouwprojecten.",
      sections: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "over-ons",
      slug: "over-ons",
      title: "Over Ons - Pro6",
      metaDescription: "Leer meer over Pro6 en ons team.",
      sections: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "contact",
      slug: "contact",
      title: "Contact - Pro6",
      metaDescription: "Neem contact met ons op.",
      sections: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  const pagesBatch = writeBatch(db);
  for (const page of defaultPages) {
    const docRef = doc(db, PAGES_COLLECTION, page.id);
    pagesBatch.set(docRef, prepareForFirestore(page as unknown as Record<string, unknown>));
  }
  await pagesBatch.commit();
  
  // Seed default projects
  const defaultProjects: Project[] = [
    {
      id: "dok6",
      slug: "dok6",
      title: "Dok6",
      subtitle: "Alkmaar",
      location: "Alkmaar",
      date: "2024",
      heroImage: "/images/dok6-1.jpg",
      images: ["/images/dok6-1.jpg", "/images/dok6-2.jpg", "/images/dok6-3.jpg", "/images/dok6-4.jpg"],
      description: "Bedrijventerrein Oudorp zal, als onderdeel van de Kanaalzone, de komende jaren gaan transformeren naar een woon-werk gebied.",
      fullDescription: "Het door DELVA vervaardigde stedenbouwkundig plan telt 230 wooneenheden, 4.000m2 aan commerciële ruimte, een parkeerhuis voor 190 auto's en maar liefst 5.000m2 aan hoogwaardig stadsgroen waarmee elke woning in het plan een directe relatie heeft.",
      sections: [],
      order: 1,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "project-2",
      slug: "project-2",
      title: "Project 2",
      subtitle: "Heerhugowaard",
      location: "Heerhugowaard",
      date: "2024",
      heroImage: "/images/pro6-2.jpg",
      images: ["/images/pro6-2.jpg", "/images/pro6-3.jpg", "/images/pro6-4.jpg"],
      description: "Een nieuw woningbouwproject in Heerhugowaard.",
      fullDescription: "Dit project in Heerhugowaard omvat de ontwikkeling van moderne woningen met aandacht voor duurzaamheid en leefbaarheid. Het ontwerp combineert hedendaagse architectuur met groene buitenruimtes, waardoor een prettige woonomgeving ontstaat voor bewoners van alle leeftijden.",
      sections: [],
      order: 2,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "project-3",
      slug: "project-3",
      title: "Project 3",
      subtitle: "Alkmaar",
      location: "Alkmaar",
      date: "2025",
      heroImage: "/images/pro6-3.jpg",
      images: ["/images/pro6-3.jpg", "/images/pro6-4.jpg", "/images/pro6-2.jpg"],
      description: "Een nieuw woningbouwproject in Alkmaar.",
      fullDescription: "In het hart van Alkmaar ontwikkelt Pro6 een uniek woonproject dat perfect aansluit bij de historische charme van de stad. Met ruime appartementen en penthouses biedt dit project een hoogwaardige woonervaring met alle moderne gemakken binnen handbereik.",
      sections: [],
      order: 3,
      published: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  const projectsBatch = writeBatch(db);
  for (const project of defaultProjects) {
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    projectsBatch.set(docRef, prepareForFirestore(project as unknown as Record<string, unknown>));
  }
  await projectsBatch.commit();
  
  // Seed default site settings
  const defaultSettings: SiteSettings = {
    id: "site",
    siteName: "Pro6",
    logo: "/images/logo.png",
    logoWhite: "/images/logo-white.png",
    primaryColor: "#000",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Projecten", href: "/projecten" },
      { label: "Over ons", href: "/over-ons" },
      { label: "Contact", href: "/contact" },
    ],
    homepage: {
      images: [
        "/images/pro6-1.jpg",
        "/images/pro6-2.jpg",
        "/images/pro6-3.jpg",
        "/images/pro6-4.jpg",
      ],
    },
    footer: {
      address: {
        street: "Laat 88",
        city: "1811 EK Alkmaar",
      },
      phone: "072 785 5228",
      email: "info@pro6vastgoed.nl",
      socialLinks: [
        { platform: "linkedin", url: "https://www.linkedin.com/", label: "Li" },
        { platform: "facebook", url: "https://www.facebook.com/", label: "Fb" },
        { platform: "instagram", url: "https://www.instagram.com/", label: "In" },
      ],
    },
    updatedAt: now,
  };
  
  const settingsRef = doc(db, SETTINGS_COLLECTION, "site");
  await setDoc(settingsRef, prepareForFirestore(defaultSettings as unknown as Record<string, unknown>));
  
  return { pages: defaultPages.length, projects: defaultProjects.length };
}
