"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, FolderOpen, Image, Settings, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/pages", label: "Pagina's", icon: FileText },
  { href: "/admin/projects", label: "Projecten", icon: FolderOpen },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Site Instellingen", icon: Settings },
];

export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "80px" : "260px",
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
        color: "#fff",
        padding: "20px 0",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "0 20px 30px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "20px",
        }}
      >
        <Link href="/admin" style={{ color: "#fff", textDecoration: "none" }}>
          <h2 style={{ fontSize: isCollapsed ? "16px" : "24px", margin: 0, fontWeight: 600 }}>
            {isCollapsed ? "P6" : "Pro6 CMS"}
          </h2>
        </Link>
      </div>

      {/* Navigation */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: isActive ? "3px solid #fa821d" : "3px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0,
          padding: "0 20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "20px",
        }}
      >
        <Link
          href="/index.html"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 0",
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
          }}
        >
          <ExternalLink size={20} />
          {!isCollapsed && <span>Bekijk site</span>}
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 0",
            color: "rgba(255,255,255,0.7)",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Uitloggen</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          right: "-12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#fa821d",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        {isCollapsed ? "→" : "←"}
      </button>
    </aside>
  );
}
