import { getPublishedProjects } from "@/lib/firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectenPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      {/* Include external styles */}
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/css/all.min.css" />
      <link rel="stylesheet" href="/css/custom-hero.css" />
      <link rel="stylesheet" href="https://use.typekit.net/der4czb.css" />

      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
          padding: 120px 40px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .project-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: #1a1a1a;
          border-radius: 8px;
        }
        
        .project-card a {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .project-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .project-card:hover img {
          transform: scale(1.05);
        }
        
        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 8px;
        }
        
        .project-card:hover .project-overlay {
          opacity: 1;
        }
        
        .project-info {
          text-align: center;
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }
        
        .project-card:hover .project-info {
          transform: translateY(0);
        }
        
        .project-title {
          color: #fff;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
          margin: 0;
          text-transform: uppercase;
        }
        
        .project-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          letter-spacing: 1px;
          margin-top: 8px;
        }
        
        /* Grid layout pattern */
        .project-card:nth-child(6n+1),
        .project-card:nth-child(6n+2) {
          grid-column: span 3;
          aspect-ratio: 4/3;
        }
        
        .project-card:nth-child(6n+3),
        .project-card:nth-child(6n+4),
        .project-card:nth-child(6n+5) {
          grid-column: span 2;
          aspect-ratio: 1/1;
        }
        
        .project-card:nth-child(6n) {
          grid-column: span 3;
          aspect-ratio: 4/3;
        }
        
        /* Single project edge case */
        .project-card:only-child {
          grid-column: span 6;
          aspect-ratio: 21/9;
        }
        
        .page-header {
          text-align: center;
          padding: 160px 40px 40px;
        }
        
        .page-header h1 {
          font-size: 72px;
          font-weight: 300;
          letter-spacing: 4px;
          margin: 0;
        }
        
        .page-header p {
          font-size: 18px;
          color: #666;
          margin-top: 20px;
        }
        
        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 100px 15px 60px;
          }
          
          .project-card:nth-child(n) {
            grid-column: span 1;
            aspect-ratio: 4/3;
          }
        }
        
        @media (max-width: 600px) {
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          
          .project-card:nth-child(n) {
            grid-column: span 1;
            aspect-ratio: 16/9;
          }
          
          .page-header h1 {
            font-size: 42px;
          }
        }
        
        /* Header styles */
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo img {
          height: 40px;
        }
        
        .nav-links {
          display: flex;
          gap: 40px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-links a {
          color: #000;
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .nav-links a:hover {
          opacity: 0.6;
        }
        
        /* Footer */
        .site-footer {
          padding: 60px 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
        {/* Header */}
        <header className="site-header">
          <Link href="/" className="logo">
            <Image src="/images/logo.png" alt="Pro6" width={120} height={40} style={{ height: "40px", width: "auto" }} />
          </Link>
          <nav>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/projecten" style={{ fontWeight: 600 }}>Projecten</Link></li>
              <li><Link href="/over-ons">Over ons</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>

        {/* Page Header */}
        <div className="page-header">
          <h1>Projecten</h1>
          <p>Ontdek onze projecten in ontwikkeling</p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.length === 0 ? (
            <div style={{ gridColumn: "span 6", textAlign: "center", padding: "80px 20px", color: "#666" }}>
              <p>Nog geen projecten gepubliceerd.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <Link href={`/projecten/${project.slug}`}>
                  {project.heroImage ? (
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#333" }} />
                  )}
                  <div className="project-overlay">
                    <div className="project-info">
                      <h3 className="project-title">{project.title}</h3>
                      {project.subtitle && (
                        <p className="project-subtitle">{project.subtitle}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="site-footer">
          <p>2025 © Pro6. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
