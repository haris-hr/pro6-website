"use client";

import { User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
        marginBottom: "30px",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#1a1a2e" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "5px 0 0", color: "#666", fontSize: "14px" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#1a1a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
