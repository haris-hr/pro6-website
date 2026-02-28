/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-img-element */

import { getPublishedProjects } from "@/lib/firebase/firestore";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectenPage() {
  let projects: Project[] = [];
  
  try {
    projects = await getPublishedProjects();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  // Generate project cards HTML
  const projectCardsHtml = projects.length > 0 
    ? projects.map((project) => `
        <div class="project-card">
          <a href="/projecten/${project.slug}">
            <img src="${project.heroImage || '/images/dok6-1.jpg'}" alt="${project.title}">
            <div class="project-overlay">
              <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-subtitle">${project.subtitle || project.location || ''}</p>
              </div>
            </div>
          </a>
        </div>
      `).join('')
    : `<div style="grid-column: span 6; text-align: center; padding: 80px 20px; color: #666;">
        <p>Nog geen projecten gepubliceerd.</p>
       </div>`;

  return (
    <html lang="en">
      <head>
        <title>Projecten - Pro6</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Pro6 Projecten Overzicht" />
        <meta name="author" content="Pro6" />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <link href="/style.css" rel="stylesheet" />
        <link href="/css/all.min.css" rel="stylesheet" />
        <link href="/css/custom-hero.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.typekit.net/der4czb.css" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Projects Grid Styles */
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
          
          /* Row 1: Two equal columns */
          .project-card:nth-child(1) {
            grid-column: span 3;
            aspect-ratio: 4/3;
          }
          
          .project-card:nth-child(2) {
            grid-column: span 3;
            aspect-ratio: 4/3;
          }
          
          /* Row 2: Three equal columns */
          .project-card:nth-child(3) {
            grid-column: span 2;
            aspect-ratio: 1/1;
          }
          
          .project-card:nth-child(4) {
            grid-column: span 2;
            aspect-ratio: 1/1;
          }
          
          .project-card:nth-child(5) {
            grid-column: span 2;
            aspect-ratio: 1/1;
          }
          
          /* Row 3: Two equal columns */
          .project-card:nth-child(6) {
            grid-column: span 3;
            aspect-ratio: 4/3;
          }
          
          .project-card:nth-child(7) {
            grid-column: span 3;
            aspect-ratio: 4/3;
          }
          
          /* Page title */
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
        `}} />
      </head>
      <body className="hidden hidden-ball smooth-scroll rounded-borders" data-primary-color="#fa821d">
        <main>
          {/* Preloader */}
          <div className="preloader-wrap" data-centerline="Loading">
            <div className="percentage-wrapper">
              <div className="percentage" id="precent">
                <span className="number number_2">
                  <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
                </span>
                <span className="number number_3">
                  <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
                </span>
              </div>
              <div className="percentage-first"><span>wait, wait..</span></div>
              <div className="percentage-last"><span>100</span></div>
            </div>
          </div>

          <div className="cd-index cd-main-content">
            {/* Page Content */}
            <div id="clapat-page-content" className="dark-content" data-bgcolor="#fff">
              {/* Header */}
              <header className="clapat-header fullscreen-menu" data-menucolor="#fff">
                <div className="header-gradient"></div>
                <div id="header-container">
                  {/* Logo */}
                  <div id="clapat-logo" className="hide-ball">
                    <a href="/index.html">
                      <img className="black-logo" src="/images/logo.png" alt="Pro6 Logo" />
                      <img className="white-logo" src="/images/logo-white.png" alt="Pro6 Logo" />
                    </a>
                  </div>

                  {/* Navigation */}
                  <nav className="clapat-nav-wrapper">
                    <div className="nav-height">
                      <ul data-breakpoint="1025" className="flexnav">
                        <li className="menu-timeline link"><a href="/index.html"><div className="before-span"><span data-hover="Index">Home</span></div></a></li>
                        <li className="menu-timeline link"><a className="active" href="/projecten"><div className="before-span"><span data-hover="Projecten">Projecten</span></div></a></li>
                        <li className="menu-timeline link"><a href=""><div className="before-span"><span data-hover="Over ons">Over ons</span></div></a></li>
                        <li className="menu-timeline link"><a href=""><div className="before-span"><span data-hover="Contact">Contact</span></div></a></li>
                        <li className="menu-timeline link"><a href=""><div className="before-span"><span data-hover="Te koop">Te koop</span></div></a></li>
                      </ul>
                    </div>
                  </nav>

                  {/* Header Button */}
                  <a className="header-button" href="">
                    <div className="button-icon-link right">
                      <div className="icon-wrap-scale">
                        <div className="icon-wrap parallax-wrap">
                          <div className="button-icon parallax-element">
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                        </div>
                      </div>
                      <div className="button-text sticky right"><span data-hover="Contact">Contact</span></div>
                    </div>
                  </a>

                  {/* Menu Burger */}
                  <div className="button-wrap right menu burger-lines">
                    <div className="button-icon parallax-element">
                      <div id="burger-wrapper">
                        <div id="menu-burger">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div className="button-text sticky right"><span data-hover="Menu">Menu</span></div>
                  </div>
                </div>
              </header>

              {/* Content Scroll */}
              <div id="content-scroll">
                {/* Main */}
                <div id="main">
                  <div id="main-content">
                    <div id="main-page-content">
                      {/* Page Header */}
                      <div className="page-header">
                        <h1>Projecten</h1>
                        <p>Ontdek onze projecten in ontwikkeling</p>
                      </div>

                      {/* Projects Grid - Dynamic from CMS */}
                      <div 
                        className="projects-grid"
                        dangerouslySetInnerHTML={{ __html: projectCardsHtml }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <footer className="clapat-footer hidden">
                  <div id="footer-container">
                    <div id="backtotop" className="button-wrap left">
                      <div className="icon-wrap parallax-wrap">
                        <div className="button-icon parallax-element">
                          <i className="fa-solid fa-angle-up"></i>
                        </div>
                      </div>
                      <div className="button-text sticky left"><span data-hover="Back Top">Back Top</span></div>
                    </div>
                    <div className="footer-middle">
                      <div className="copyright">2025 © <a className="link" target="_blank" href="https://pro6.nl/">Pro6</a>. All rights reserved.</div>
                    </div>
                    <div className="socials-wrap">
                      <div className="socials-icon"><i className="fa-solid fa-share-nodes"></i></div>
                      <div className="socials-text">Follow Us</div>
                      <ul className="socials">
                        <li><span className="parallax-wrap"><a className="parallax-element" href="#" target="_blank">Li</a></span></li>
                        <li><span className="parallax-wrap"><a className="parallax-element" href="#" target="_blank">Ig</a></span></li>
                      </ul>
                    </div>
                  </div>
                </footer>
              </div>

              <div id="app"></div>
            </div>
          </div>
        </main>

        <div className="cd-cover-layer"></div>
        <div id="magic-cursor">
          <div id="ball">
            <div id="ball-drag-x"></div>
            <div id="ball-drag-y"></div>
            <div id="ball-loader"></div>
          </div>
        </div>
        <div id="clone-image">
          <div className="hero-translate"></div>
        </div>
        <div id="rotate-device"></div>

        {/* Scripts */}
        <script src="/js/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/Flip.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/smooth-scrollbar/8.4.0/smooth-scrollbar.js"></script>
        <script src="/js/clapat.js"></script>
        <script src="/js/plugins.js"></script>
        <script src="/js/common.js"></script>
        <script src="/js/contact.js"></script>
        <script src="/js/scripts.js"></script>
      </body>
    </html>
  );
}
