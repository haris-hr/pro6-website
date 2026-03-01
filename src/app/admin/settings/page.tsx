"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin";
import { Save, Loader2, Plus, X } from "lucide-react";
import { getSiteSettings, updateSiteSettings, getAllMedia } from "@/lib/firebase/firestore";
import type { SiteSettings, MediaFile } from "@/types";

// Local settings type that matches the form fields
interface FormSettings {
  logo: string;
  logoWhite: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
  email: string;
  socialLinks: {
    linkedin: string;
    facebook: string;
    instagram: string;
  };
  homepageImages: string[];
}

const defaultSettings: FormSettings = {
  logo: "/images/logo.png",
  logoWhite: "/images/logo-white.png",
  address: {
    street: "Laat 88",
    city: "1811 EK Alkmaar",
  },
  phone: "072 785 5228",
  email: "info@pro6vastgoed.nl",
  socialLinks: {
    linkedin: "https://www.linkedin.com/",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  homepageImages: [
    "/images/pro6-1.jpg",
    "/images/pro6-2.jpg",
    "/images/pro6-3.jpg",
    "/images/pro6-4.jpg",
  ],
};

// Convert SiteSettings from Firestore to FormSettings
function toFormSettings(siteSettings: SiteSettings): FormSettings {
  const linkedinLink = siteSettings.footer.socialLinks.find(s => s.platform === 'linkedin');
  const facebookLink = siteSettings.footer.socialLinks.find(s => s.platform === 'facebook');
  const instagramLink = siteSettings.footer.socialLinks.find(s => s.platform === 'instagram');

  return {
    logo: siteSettings.logo,
    logoWhite: siteSettings.logoWhite,
    address: {
      street: siteSettings.footer.address.street,
      city: siteSettings.footer.address.city,
    },
    phone: siteSettings.footer.phone,
    email: siteSettings.footer.email,
    socialLinks: {
      linkedin: linkedinLink?.url || '',
      facebook: facebookLink?.url || '',
      instagram: instagramLink?.url || '',
    },
    homepageImages: siteSettings.homepage?.images || defaultSettings.homepageImages,
  };
}

// Convert FormSettings back to SiteSettings for Firestore
function toSiteSettings(formSettings: FormSettings): Partial<SiteSettings> {
  return {
    logo: formSettings.logo,
    logoWhite: formSettings.logoWhite,
    navigation: [
      { label: "Home", href: "/" },
      { label: "Projecten", href: "/projecten" },
      { label: "Over ons", href: "/over-ons" },
      { label: "Contact", href: "/contact" },
    ],
    homepage: {
      images: formSettings.homepageImages,
    },
    footer: {
      address: {
        street: formSettings.address.street,
        city: formSettings.address.city,
      },
      phone: formSettings.phone,
      email: formSettings.email,
      socialLinks: [
        { platform: "linkedin", url: formSettings.socialLinks.linkedin, label: "Li" },
        { platform: "facebook", url: formSettings.socialLinks.facebook, label: "Fb" },
        { platform: "instagram", url: formSettings.socialLinks.instagram, label: "In" },
      ],
    },
    updatedAt: new Date(),
  };
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<FormSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerIndex, setMediaPickerIndex] = useState<number>(0);

  // Load settings from Firestore on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [siteSettings, mediaFiles] = await Promise.all([
          getSiteSettings(),
          getAllMedia()
        ]);
        if (siteSettings) {
          setSettings(toFormSettings(siteSettings));
        }
        setMedia(mediaFiles);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleImageSelect = (url: string) => {
    const newImages = [...settings.homepageImages];
    newImages[mediaPickerIndex] = url;
    setSettings({ ...settings, homepageImages: newImages });
    setShowMediaPicker(false);
  };

  const openMediaPicker = (index: number) => {
    setMediaPickerIndex(index);
    setShowMediaPicker(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const siteSettingsUpdate = toSiteSettings(settings);
      await updateSiteSettings(siteSettingsUpdate);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
    color: "#374151",
    fontSize: "14px",
  };

  if (isLoading) {
    return (
      <div>
        <AdminHeader
          title="Contact & Socials"
          subtitle="Bewerk de contactgegevens en social media links"
        />
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          padding: "100px 0" 
        }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Contact & Socials"
        subtitle="Bewerk de contactgegevens en social media links"
      />

      <div style={{ padding: "0 30px 30px", maxWidth: "800px" }}>
        {/* Contact Info */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 600 }}>
            Contactgegevens
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Straat</label>
              <input
                type="text"
                value={settings.address.street}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Plaats</label>
              <input
                type="text"
                value={settings.address.city}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
            <div>
              <label style={labelStyle}>Telefoon</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, phone: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, email: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Homepage Images */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 600 }}>
            Homepage Afbeeldingen
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#6b7280" }}>
            De 4 afbeeldingen die op de homepage worden getoond
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {settings.homepageImages.map((img, index) => (
              <div
                key={index}
                onClick={() => openMediaPicker(index)}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  position: "relative",
                  border: "2px dashed #d1d5db",
                }}
              >
                {img ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Homepage ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >
                      <span style={{ color: "#fff", fontSize: "12px", fontWeight: 500 }}>
                        Wijzigen
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                    }}
                  >
                    <Plus size={24} />
                    <span style={{ fontSize: "12px", marginTop: "4px" }}>Afbeelding {index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 600 }}>
            Social Media
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>LinkedIn</label>
            <input
              type="url"
              value={settings.socialLinks.linkedin}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                }))
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Facebook</label>
            <input
              type="url"
              value={settings.socialLinks.facebook}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                }))
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Instagram</label>
            <input
              type="url"
              value={settings.socialLinks.instagram}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                }))
              }
              style={inputStyle}
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Save size={20} />
            {isSaving ? "Opslaan..." : "Instellingen opslaan"}
          </button>

          {saveStatus === "success" && (
            <span style={{ color: "#10b981", fontWeight: 500 }}>
              ✓ Instellingen opgeslagen
            </span>
          )}

          {saveStatus === "error" && (
            <span style={{ color: "#dc2626", fontWeight: 500 }}>
              ✗ Er is iets misgegaan
            </span>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowMediaPicker(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                Kies afbeelding {mediaPickerIndex + 1}
              </h3>
              <button
                onClick={() => setShowMediaPicker(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {media.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280" }}>
                  Geen media gevonden. Upload eerst afbeeldingen via Media beheer.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "12px",
                  }}
                >
                  {media
                    .filter((m) => m.type === "image")
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleImageSelect(item.url)}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "8px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "2px solid transparent",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#3b82f6")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "transparent")
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
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
