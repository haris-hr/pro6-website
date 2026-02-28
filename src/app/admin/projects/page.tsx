"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminHeader } from "@/components/admin";
import { Plus, Edit, Trash2, Eye, GripVertical, Loader2 } from "lucide-react";
import { subscribeProjects, deleteProject } from "@/lib/firebase/firestore";
import type { Project } from "@/types";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time project updates
    const unsubscribe = subscribeProjects((loadedProjects) => {
      setProjects(loadedProjects);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Weet je zeker dat je dit project wilt verwijderen?")) return;
    
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Er is iets misgegaan bij het verwijderen.");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Projecten"
        subtitle="Beheer alle woningbouwprojecten"
      />

      <div style={{ padding: "0 30px 30px" }}>
        {/* Actions Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#666", margin: 0 }}>
            {projects.length} project{projects.length !== 1 ? "en" : ""}
          </p>
          <Link
            href="/admin/projects/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#10b981",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <Plus size={20} />
            Nieuw project
          </Link>
        </div>

        {isLoading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: "60px 0" 
          }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#666", margin: "0 0 20px" }}>
              Nog geen projecten gevonden. Maak je eerste project aan!
            </p>
            <Link
              href="/admin/projects/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: "#10b981",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Plus size={20} />
              Nieuw project
            </Link>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid #e5e7eb",
                  gap: "16px",
                }}
              >
                {/* Drag Handle */}
                <div style={{ cursor: "grab", color: "#9ca3af" }}>
                  <GripVertical size={20} />
                </div>

                {/* Thumbnail */}
                <div
                  style={{
                    width: "80px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#f3f4f6",
                  }}
                >
                  {project.heroImage ? (
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      width={80}
                      height={60}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ 
                      width: "100%", 
                      height: "100%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: "12px"
                    }}>
                      Geen afb.
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                      {project.title}
                    </h3>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        backgroundColor: project.published ? "#d1fae5" : "#fee2e2",
                        color: project.published ? "#065f46" : "#991b1b",
                      }}
                    >
                      {project.published ? "Gepubliceerd" : "Concept"}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
                    {project.location} • {project.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href={`/projecten/${project.slug}`}
                    target="_blank"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}
                    title="Bekijk"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}
                    title="Bewerk"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title="Verwijder"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
