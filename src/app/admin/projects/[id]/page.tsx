"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { ArrowLeft, Save, Loader2, Plus, X, GripVertical } from "lucide-react";
import { getProjectById, updateProject, getAllMedia } from "@/lib/firebase/firestore";
import type { Project, MediaFile } from "@/types";

interface StaticImage {
  name: string;
  url: string;
  type: string;
  folder: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [staticImages, setStaticImages] = useState<StaticImage[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"hero" | "gallery" | "video">("hero");
  const [showStaticMedia, setShowStaticMedia] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    slug: "",
    subtitle: "",
    location: "",
    date: "",
    heroImage: "",
    heroVideo: "",
    images: [],
    description: "",
    fullDescription: "",
    published: false,
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [project, mediaFiles] = await Promise.all([
          getProjectById(id),
          getAllMedia()
        ]);
        
        if (project) {
          setFormData(project);
        }
        setMedia(mediaFiles);

        // Load static images
        const staticRes = await fetch("/api/static-images");
        const staticData = await staticRes.json();
        if (staticData.success) {
          setStaticImages(staticData.images);
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProject(id, formData);
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Er is iets misgegaan bij het opslaan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = (url: string) => {
    if (mediaPickerTarget === "hero") {
      setFormData({ ...formData, heroImage: url });
    } else if (mediaPickerTarget === "video") {
      setFormData({ ...formData, heroVideo: url });
    } else {
      setFormData({ ...formData, images: [...(formData.images || []), url] });
    }
    setShowMediaPicker(false);
  };

  const openMediaPicker = (target: "hero" | "gallery" | "video") => {
    setMediaPickerTarget(target);
    setShowStaticMedia(false);
    setShowMediaPicker(true);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Project bewerken"
        subtitle={formData.title || "Nieuw project"}
      />

      <div style={{ padding: "0 30px 30px" }}>
        <Link
          href="/admin/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b7280",
            textDecoration: "none",
            marginBottom: "20px",
          }}
        >
          <ArrowLeft size={18} />
          Terug naar overzicht
        </Link>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
            {/* Main Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Basic Info */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Basis informatie</h3>
                
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Titel *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                    />
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Slug (URL)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="bijv: dok6"
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Subtitel</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="bijv: Alkmaar"
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Locatie</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Datum</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="bijv: 2024"
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Beschrijving</h3>
                
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Korte beschrijving</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Volledige beschrijving</label>
                    <textarea
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      rows={6}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Galerij afbeeldingen</h3>
                  <button
                    type="button"
                    onClick={() => { setMediaPickerTarget("gallery"); setShowMediaPicker(true); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
                  >
                    <Plus size={16} />
                    Toevoegen
                  </button>
                </div>
                
                {(formData.images || []).length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>Nog geen afbeeldingen toegevoegd</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    {(formData.images || []).map((img, index) => (
                      <div key={index} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          style={{ position: "absolute", top: "8px", right: "8px", width: "24px", height: "24px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <X size={14} />
                        </button>
                        <div style={{ position: "absolute", top: "8px", left: "8px", color: "#fff", cursor: "grab" }}>
                          <GripVertical size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Publish Settings */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Publicatie</h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="published" style={{ fontSize: "14px" }}>Gepubliceerd</label>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>Volgorde</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min={0}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "12px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isSaving ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                  {isSaving ? "Opslaan..." : "Opslaan"}
                </button>
              </div>

              {/* Hero Image */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Hero afbeelding</h3>
                
                {formData.heroImage && formData.heroImage.length > 0 ? (
                  <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", marginBottom: "12px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.heroImage} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, heroImage: "" })}
                      style={{ position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ aspectRatio: "16/9", backgroundColor: "#f3f4f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                    <span style={{ color: "#9ca3af" }}>Geen afbeelding</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => { setMediaPickerTarget("hero"); setShowMediaPicker(true); }}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#f3f4f6", border: "1px dashed #d1d5db", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
                >
                  Afbeelding kiezen
                </button>
              </div>

              {/* Hero Video */}
              <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Hero video (optioneel)</h3>
                {formData.heroVideo && (
                  <div style={{ marginBottom: "12px", position: "relative", borderRadius: "8px", overflow: "hidden", backgroundColor: "#000" }}>
                    <video src={formData.heroVideo} style={{ width: "100%", maxHeight: "150px", objectFit: "contain" }} muted />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, heroVideo: "" })}
                      style={{ position: "absolute", top: "8px", right: "8px", width: "24px", height: "24px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => openMediaPicker("video")}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#f3f4f6", border: "1px dashed #d1d5db", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
                >
                  Video kiezen
                </button>
                <input
                  type="text"
                  value={formData.heroVideo}
                  onChange={(e) => setFormData({ ...formData, heroVideo: e.target.value })}
                  placeholder="Of voer een video URL in..."
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", marginTop: "8px" }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: "90%", maxWidth: "800px", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                Kies {mediaPickerTarget === "video" ? "video" : "afbeelding"}
              </h3>
              <button onClick={() => setShowMediaPicker(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            {/* Toggle between uploaded and static media */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowStaticMedia(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: !showStaticMedia ? "#3b82f6" : "#f3f4f6",
                  color: !showStaticMedia ? "#fff" : "#374151",
                }}
              >
                Geüpload
              </button>
              <button
                onClick={() => setShowStaticMedia(true)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: showStaticMedia ? "#3b82f6" : "#f3f4f6",
                  color: showStaticMedia ? "#fff" : "#374151",
                }}
              >
                Bestaande bestanden
              </button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {(() => {
                const mediaType = mediaPickerTarget === "video" ? "video" : "image";
                const currentMedia = showStaticMedia 
                  ? staticImages.filter(m => m.type === mediaType)
                  : media.filter(m => m.type === mediaType);
                
                if (currentMedia.length === 0) {
                  return (
                    <p style={{ textAlign: "center", color: "#6b7280" }}>
                      Geen {mediaType === "video" ? "video's" : "afbeeldingen"} gevonden. 
                      {!showStaticMedia && " Upload eerst via Media beheer."}
                    </p>
                  );
                }

                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    {currentMedia.map((item) => (
                      <div
                        key={item.url || item.id}
                        onClick={() => handleImageSelect(item.url)}
                        style={{ aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", border: "2px solid transparent", transition: "border-color 0.2s", position: "relative" }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                      >
                        {mediaType === "video" ? (
                          <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                        {showStaticMedia && (
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 8px", fontSize: "10px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
