"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { Edit, Eye, Loader2 } from "lucide-react";
import { subscribePages } from "@/lib/firebase/firestore";
import type { Page } from "@/types";

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time page updates
    const unsubscribe = subscribePages((loadedPages) => {
      setPages(loadedPages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <AdminHeader
        title="Pagina's"
        subtitle="Beheer de content van alle pagina's"
      />

      <div style={{ padding: "0 30px 30px" }}>
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
        ) : pages.length === 0 ? (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#666", margin: 0 }}>
              Nog geen pagina&apos;s gevonden. Seed de database via het dashboard.
            </p>
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
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Pagina
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    URL
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Laatst bewerkt
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#374151",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => {
                  // Pages that don't have working routes yet
                  const disabledPages = ['contact', 'over-ons'];
                  const isDisabled = disabledPages.includes(page.slug);
                  
                  return (
                  <tr
                    key={page.id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div>
                        <div style={{ fontWeight: 500, color: "#111827" }}>
                          {page.title}
                        </div>
                        <div style={{ fontSize: "14px", color: "#6b7280" }}>
                          {page.metaDescription}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#6b7280" }}>
                      /{page.slug}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#6b7280" }}>
                      {page.updatedAt instanceof Date 
                        ? page.updatedAt.toLocaleDateString("nl-NL")
                        : new Date(page.updatedAt).toLocaleDateString("nl-NL")}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {isDisabled ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#e5e7eb",
                              color: "#9ca3af",
                              borderRadius: "6px",
                              fontSize: "14px",
                              cursor: "not-allowed",
                            }}
                            title="Pagina nog niet beschikbaar"
                          >
                            <Eye size={16} />
                            Bekijk
                          </span>
                        ) : (
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "14px",
                            }}
                          >
                            <Eye size={16} />
                            Bekijk
                          </Link>
                        )}
                        {isDisabled ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#93c5fd",
                              color: "#fff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              cursor: "not-allowed",
                              opacity: 0.6,
                            }}
                            title="Pagina nog niet beschikbaar"
                          >
                            <Edit size={16} />
                            Bewerk
                          </span>
                        ) : (
                          <Link
                            href={`/admin/pages/${page.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 12px",
                              backgroundColor: "#3b82f6",
                              color: "#fff",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "14px",
                            }}
                          >
                            <Edit size={16} />
                            Bewerk
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
