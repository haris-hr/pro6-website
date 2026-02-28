// Config
export { getApp, getAuthInstance, getDb, getStorageInstance } from "./config";

// Auth
export { signIn, signOut, onAuthChange, getCurrentUser } from "./auth";

// Firestore
export {
  // Pages
  getAllPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  subscribePages,
  // Projects
  getAllProjects,
  getPublishedProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  subscribeProjects,
  // Site Settings
  getSiteSettings,
  updateSiteSettings,
  subscribeSiteSettings,
  // Seeding
  seedDatabase,
} from "./firestore";

// Storage
export {
  uploadFile,
  uploadImage,
  uploadVideo,
  deleteFile,
  listFiles,
  getFileUrl,
} from "./storage";
