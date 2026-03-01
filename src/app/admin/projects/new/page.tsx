"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { ArrowLeft, Save, Loader2, Plus, X, GripVertical } from "lucide-react";
import { createProject, getAllMedia, getAllProjects } from "@/lib/firebase/firestore";
import type { Project, MediaFile } from "@/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"hero" | "gallery">("hero");
  
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
    sections: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [mediaFiles, projects] = await Promise.all([
          getAllMedia(),
          getAllProjects()
        ]);
        setMedia(mediaFiles);
        // Set default order to be after all existing projects
        setFormData(prev => ({ ...prev, order: projects.length + 1 }));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: formData.slug || generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const now = new Date();
      const projectId = formData.slug || generateSlug(formData.title || "project");
      
      const newProject: Project = {
        id: projectId,
        slug: formData.slug || projectId,
        title: formData.title || "",
        subtitle: formData.subtitle,
        location: formData.location || "",
        date: formData.date,
        heroImage: formData.heroImage || "",
        heroVideo: formData.heroVideo,
        images: formData.images || [],
        description: formData.description || "",
        fullDescription: formData.fullDescription,
        sections: formData.sections || [],
        order: formData.order || 0,
        published: formData.published || false,
        createdAt: now,
        updatedAt: now,
      };

      await createProject(newProject);
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Er is iets misgegaan bij het aanmaken.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = (url: string) => {
    if (mediaPickerTarget === "hero") {
      setFormData({ ...formData, heroImage: url });
    } else {
      setFormData({ ...formData, images: [...(formData.images || []), url] });
    }
    setShowMediaPicker(false);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div>
      <AdminHeader
        title="Nieuw project"
        subtitle="Maak een nieuw project aan"
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
                      onChange={(e) => handleTitleChange(e.target.value)}
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
                    backgroundColor: "#10b981",
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
                  {isSaving ? "Aanmaken..." : "Project aanmaken"}
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
                <input
                  type="text"
                  value={formData.heroVideo}
                  onChange={(e) => setFormData({ ...formData, heroVideo: e.target.value })}
                  placeholder="Video URL"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
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
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Kies afbeelding</h3>
              <button onClick={() => setShowMediaPicker(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {media.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280" }}>Geen media gevonden. Upload eerst afbeeldingen via Media beheer.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {media.filter(m => m.type === "image").map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleImageSelect(item.url)}
                      style={{ aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", border: "2px solid transparent", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
