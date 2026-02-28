"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { FileText, FolderOpen, Image, Settings, Database, Loader2 } from "lucide-react";
import { seedDatabase } from "@/lib/firebase/firestore";

const quickLinks = [
  {
    href: "/admin/pages",
    label: "Pagina's beheren",
    description: "Bewerk de homepage, over ons en contact pagina's",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    href: "/admin/projects",
    label: "Projecten beheren",
    description: "Voeg projecten toe of bewerk bestaande projecten",
    icon: FolderOpen,
    color: "#10b981",
  },
  {
    href: "/admin/media",
    label: "Media bibliotheek",
    description: "Upload en beheer afbeeldingen en video's",
    icon: Image,
    color: "#f59e0b",
  },
  {
    href: "/admin/settings",
    label: "Instellingen",
    description: "Configureer site-instellingen en navigatie",
    icon: Settings,
    color: "#8b5cf6",
  },
];

export default function AdminDashboard() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    if (!confirm("Wil je de database vullen met standaard data? Dit werkt alleen als er nog geen data is.")) {
      return;
    }

    setIsSeeding(true);
    setSeedResult(null);

    try {
      const result = await seedDatabase();
      if (result.pages === 0 && result.projects === 0) {
        setSeedResult("Database bevat al data. Geen wijzigingen gemaakt.");
      } else {
        setSeedResult(`Succesvol aangemaakt: ${result.pages} pagina's en ${result.projects} projecten.`);
      }
    } catch (error) {
      console.error("Seed error:", error);
      setSeedResult("Er is een fout opgetreden bij het seeden van de database.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Welkom bij het Pro6 Content Management System"
      />

      <div style={{ padding: "0 30px 30px" }}>
        {/* Quick Links Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  padding: "24px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  textDecoration: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    backgroundColor: `${link.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Icon size={24} color={link.color} />
                </div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                  }}
                >
                  {link.label}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: 1.5,
                  }}
                >
                  {link.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Database Seed Section */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                backgroundColor: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Database size={24} color="#3b82f6" />
            </div>
            <div>
              <h2
                style={{
                  margin: "0 0 4px",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#1a1a2e",
                }}
              >
                Database Initialiseren
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                Vul de Firestore database met standaard pagina&apos;s, projecten en instellingen.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: isSeeding ? "not-allowed" : "pointer",
                opacity: isSeeding ? 0.7 : 1,
              }}
            >
              {isSeeding ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Bezig...
                </>
              ) : (
                <>
                  <Database size={18} />
                  Database Seeden
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>

            {seedResult && (
              <span style={{ 
                color: seedResult.includes("fout") ? "#dc2626" : "#10b981", 
                fontSize: "14px" 
              }}>
                {seedResult}
              </span>
            )}
          </div>
        </div>

        {/* Getting Started */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "20px",
              fontWeight: 600,
              color: "#1a1a2e",
            }}
          >
            Aan de slag
          </h2>
          <div style={{ color: "#666", lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 12px" }}>
              <strong>1. Firebase configureren:</strong> Zorg dat{" "}
              <code style={{ backgroundColor: "#f5f5f5", padding: "2px 6px", borderRadius: "4px" }}>
                .env.local
              </code>{" "}
              is geconfigureerd met je Firebase credentials.
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong>2. Database initialiseren:</strong> Klik op &quot;Database Seeden&quot; hierboven om
              standaard pagina&apos;s en projecten aan te maken.
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong>3. Pagina&apos;s bewerken:</strong> Ga naar Pagina&apos;s om de content van de homepage,
              over ons en contact pagina&apos;s aan te passen.
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong>4. Projecten toevoegen:</strong> Voeg nieuwe projecten toe met afbeeldingen en
              beschrijvingen.
            </p>
            <p style={{ margin: 0 }}>
              <strong>5. Media uploaden:</strong> Upload afbeeldingen en video&apos;s naar de media
              bibliotheek voor gebruik op de website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
