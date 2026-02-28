import { getProjectBySlug, getPublishedProjects } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get all projects for navigation
  const allProjects = await getPublishedProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[currentIndex + 1] || allProjects[0];

  return (
    <>
      {/* External styles */}
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/css/all.min.css" />
      <link rel="stylesheet" href="/css/custom-hero.css" />
      <link rel="stylesheet" href="https://use.typekit.net/der4czb.css" />

      <style>{`
        .project-detail {
          min-height: 100vh;
          background: #fff;
        }
        
        /* Header */
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
          background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent);
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
        
        /* Hero Section */
        .hero-section {
          position: relative;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 120px 40px 60px;
        }
        
        .hero-title {
          font-size: clamp(48px, 10vw, 120px);
          font-weight: 300;
          letter-spacing: 4px;
          margin: 0;
          text-align: center;
        }
        
        .hero-subtitle {
          font-size: 18px;
          color: #666;
          margin-top: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .hero-meta {
          display: flex;
          gap: 40px;
          margin-top: 40px;
          font-size: 14px;
          color: #666;
        }
        
        /* Hero Image */
        .hero-image-section {
          position: relative;
          width: 100%;
          height: 80vh;
          margin-top: -100px;
        }
        
        .hero-image-section img {
          object-fit: cover;
        }
        
        /* Content Sections */
        .content-section {
          padding: 120px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .description-section {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
        }
        
        .description-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
        }
        
        .description-text {
          font-size: 32px;
          line-height: 1.5;
          font-weight: 300;
        }
        
        .full-description {
          font-size: 18px;
          line-height: 1.8;
          color: #444;
          margin-top: 40px;
        }
        
        /* Gallery Section */
        .gallery-section {
          padding: 80px 0;
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }
        
        .gallery-item {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
        }
        
        .gallery-item:first-child {
          grid-column: span 2;
          aspect-ratio: 21/9;
        }
        
        .gallery-item img {
          transition: transform 0.6s ease;
        }
        
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        
        /* Quote Section */
        .quote-section {
          background: #0c0c0c;
          color: #fff;
          padding: 160px 40px;
          text-align: center;
        }
        
        .quote-text {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 300;
          line-height: 1.3;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        /* Navigation */
        .project-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 60px 40px;
          background: #0c0c0c;
          color: #fff;
        }
        
        .nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          background: #fff;
          color: #000;
        }
        
        .next-project {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-decoration: none;
          color: #fff;
        }
        
        .next-label {
          font-size: 12px;
          color: #666;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .next-title {
          font-size: 32px;
          font-weight: 300;
        }
        
        /* Footer */
        .site-footer {
          padding: 60px 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          background: #0c0c0c;
        }
        
        .site-footer a {
          color: #fff;
        }
        
        @media (max-width: 768px) {
          .description-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .gallery-grid {
            grid-template-columns: 1fr;
          }
          
          .gallery-item:first-child {
            grid-column: span 1;
            aspect-ratio: 4/3;
          }
          
          .project-nav {
            flex-direction: column;
            gap: 30px;
          }
        }
      `}</style>

      <div className="project-detail">
        {/* Header */}
        <header className="site-header">
          <Link href="/" className="logo">
            <Image
              src="/images/logo.png"
              alt="Pro6"
              width={120}
              height={40}
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/projecten">Projecten</Link>
              </li>
              <li>
                <Link href="/over-ons">Over ons</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="hero-subtitle">{project.subtitle}</p>
          )}
          <div className="hero-meta">
            {project.location && <span>{project.location}</span>}
            {project.date && <span>{project.date}</span>}
          </div>
        </section>

        {/* Hero Image */}
        {project.heroImage && (
          <section className="hero-image-section">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </section>
        )}

        {/* Description Section */}
        <section className="content-section">
          <div className="description-section">
            <div>
              <p className="description-label">Over dit project</p>
            </div>
            <div>
              <p className="description-text">{project.description}</p>
              {project.fullDescription && (
                <p className="full-description">{project.fullDescription}</p>
              )}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="quote-section">
          <p className="quote-text">
            Hier groeit de stad
            <br />
            {project.title} • {project.subtitle || project.location}
          </p>
        </section>

        {/* Gallery Section */}
        {project.images && project.images.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-grid">
              {project.images.map((image, index) => (
                <div key={index} className="gallery-item">
                  <Image
                    src={image}
                    alt={`${project.title} - Afbeelding ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Navigation */}
        <nav className="project-nav">
          <Link href="/projecten" className="nav-link">
            ← Overzicht
          </Link>
          {nextProject && nextProject.slug !== slug && (
            <Link href={`/projecten/${nextProject.slug}`} className="next-project">
              <span className="next-label">Volgend project</span>
              <span className="next-title">{nextProject.title}</span>
            </Link>
          )}
        </nav>

        {/* Footer */}
        <footer className="site-footer">
          <p>
            2025 © <a href="https://pro6.nl/">Pro6</a>. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
