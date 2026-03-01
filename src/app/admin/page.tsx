"use client";

import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { FileText, FolderOpen, Image, Settings } from "lucide-react";

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
    label: "Site Instellingen",
    description: "Homepage afbeeldingen, contact en socials",
    icon: Settings,
    color: "#8b5cf6",
  },
];

export default function AdminDashboard() {

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
      </div>
    </div>
  );
}
