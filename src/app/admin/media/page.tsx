"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin";
import { Upload, Trash2, Copy, Check, Loader2, FolderOpen } from "lucide-react";
import { subscribeMedia, createMedia, deleteMedia } from "@/lib/firebase/firestore";
import { uploadImage, uploadVideo } from "@/lib/firebase/storage";
import type { MediaFile } from "@/types";

interface StaticImage {
  name: string;
  url: string;
  type: string;
  folder: string;
}

export default function MediaAdmin() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [staticImages, setStaticImages] = useState<StaticImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"uploaded" | "static">("uploaded");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Subscribe to real-time media updates
    const unsubscribe = subscribeMedia((loadedMedia) => {
      setMedia(loadedMedia);
      setIsLoading(false);
    });

    // Fetch static images
    fetch("/api/static-images")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStaticImages(data.images);
        }
      })
      .catch((err) => console.error("Error fetching static images:", err));

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`0/${files.length} bestanden`);

    let uploaded = 0;

    for (const file of Array.from(files)) {
      try {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
        if (!allowedTypes.includes(file.type)) {
          alert(`Bestandstype niet toegestaan: ${file.name}`);
          continue;
        }

        // Validate file size (max 10 MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(`Bestand te groot (max 10 MB): ${file.name}`);
          continue;
        }

        // Upload directly to Firebase Storage
        const isVideo = file.type.startsWith("video/");
        const mediaFile = isVideo 
          ? await uploadVideo(file)
          : await uploadImage(file);

        // Save metadata to Firestore
        await createMedia(mediaFile);
        uploaded++;
        setUploadProgress(`${uploaded}/${files.length} bestanden`);
      } catch (error) {
        console.error("Upload error:", error);
        alert(`Fout bij uploaden van ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (item: MediaFile) => {
    if (!confirm("Weet je zeker dat je dit bestand wilt verwijderen?")) return;

    try {
      // Delete the actual file from disk
      await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.url }),
      });

      // Delete from Firestore
      await deleteMedia(item.id);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Er is iets misgegaan bij het verwijderen.");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    // Create full URL if it's a relative path
    const fullUrl = url.startsWith('/') 
      ? `${window.location.origin}${url}`
      : url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenImage = (url: string) => {
    // Create full URL if it's a relative path
    const fullUrl = url.startsWith('/') 
      ? `${window.location.origin}${url}`
      : url;
    window.open(fullUrl, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const tabStyle = (isActive: boolean) => ({
    padding: "12px 24px",
    border: "none",
    backgroundColor: isActive ? "#3b82f6" : "#fff",
    color: isActive ? "#fff" : "#374151",
    borderRadius: "8px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  return (
    <div>
      <AdminHeader
        title="Media Bibliotheek"
        subtitle="Upload en beheer afbeeldingen en video's"
      />

      <div style={{ padding: "0 30px 30px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => setActiveTab("uploaded")}
            style={tabStyle(activeTab === "uploaded")}
          >
            <Upload size={18} />
            Geüploade bestanden ({media.length})
          </button>
          <button
            onClick={() => setActiveTab("static")}
            style={tabStyle(activeTab === "static")}
          >
            <FolderOpen size={18} />
            Bestaande afbeeldingen ({staticImages.length})
          </button>
        </div>

        {activeTab === "uploaded" && (
          <>
            {/* Upload Area */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "40px",
                marginBottom: "30px",
                border: "2px dashed #e5e7eb",
                textAlign: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                opacity: isUploading ? 0.7 : 1,
              }}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm"
                onChange={handleUpload}
                style={{ display: "none" }}
                disabled={isUploading}
              />
              {isUploading ? (
                <>
                  <Loader2
                    size={48}
                    style={{ 
                      color: "#3b82f6", 
                      marginBottom: "16px",
                      animation: "spin 1s linear infinite"
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
                  <p style={{ margin: "0 0 8px", fontWeight: 500, color: "#374151" }}>
                    Uploaden...
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                    {uploadProgress}
                  </p>
                </>
              ) : (
                <>
                  <Upload
                    size={48}
                    style={{ color: "#9ca3af", marginBottom: "16px" }}
                  />
                  <p style={{ margin: "0 0 8px", fontWeight: 500, color: "#374151" }}>
                    Klik om bestanden te uploaden
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                    Max 4 MB per bestand • JPEG, PNG, GIF, WebP, MP4, WebM
                  </p>
                </>
              )}
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                padding: "60px 0" 
              }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : media.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "60px 20px",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ color: "#666", margin: 0 }}>
                  Nog geen media geüpload. Upload je eerste bestand!
                </p>
              </div>
            ) : (
              /* Media Grid */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                {media.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Preview - clickable */}
                    <div
                      onClick={() => handleOpenImage(item.url)}
                      style={{
                        width: "100%",
                        height: "150px",
                        backgroundColor: "#f3f4f6",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      title="Klik om te openen"
                    >
                      {item.type === "image" ? (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                          }}
                        >
                          <span>🎬 Video</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "12px" }}>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#374151",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                        {formatFileSize(item.size)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          color: copiedId === item.id ? "#10b981" : "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={16} />
                            Gekopieerd
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Kopieer URL
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderLeft: "1px solid #e5e7eb",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          color: "#dc2626",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "static" && (
          <>
            <div
              style={{
                backgroundColor: "#f0f9ff",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                border: "1px solid #bae6fd",
              }}
            >
              <p style={{ margin: 0, color: "#0369a1", fontSize: "14px" }}>
                💡 Deze afbeeldingen staan op de server in de <code style={{ backgroundColor: "#e0f2fe", padding: "2px 6px", borderRadius: "4px" }}>/images</code> map. 
                Klik op &quot;Kopieer URL&quot; om de link te gebruiken in een project.
              </p>
            </div>

            {staticImages.length === 0 ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                padding: "60px 0" 
              }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                {staticImages.map((item, index) => {
                  const itemId = `static-${index}`;
                  return (
                    <div
                      key={itemId}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* Preview - clickable */}
                      <div
                        onClick={() => handleOpenImage(item.url)}
                        style={{
                          width: "100%",
                          height: "150px",
                          backgroundColor: "#f3f4f6",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        title="Klik om te openen"
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#6b7280",
                            }}
                          >
                            <span>🎬 Video</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "12px" }}>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                          📁 {item.folder}
                        </p>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: "flex",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <button
                          onClick={() => handleCopyUrl(item.url, itemId)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            color: copiedId === itemId ? "#10b981" : "#6b7280",
                            fontSize: "13px",
                          }}
                        >
                          {copiedId === itemId ? (
                            <>
                              <Check size={16} />
                              Gekopieerd
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Kopieer URL
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
