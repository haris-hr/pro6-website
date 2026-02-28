import { getProjectBySlug, getPublishedProjects, getSiteSettings } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Project, SiteSettings } from "@/types";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch current project, all projects for navigation, and settings
  const [project, allProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
    getSiteSettings()
  ]) as [Project | null, Project[], SiteSettings | null];

  if (!project) {
    notFound();
  }

  // Find next project for navigation
  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  const nextProject = currentIndex < allProjects.length - 1 
    ? allProjects[currentIndex + 1] 
    : allProjects[0]; // Loop back to first project

  // Generate gallery images HTML
  const galleryImagesHtml = project.images && project.images.length > 0
    ? project.images.map((img, idx) => `
        <li${idx === 0 ? ' class="zoom-center"' : ''}>
          <div class="zoom-img-wrapper">
            <a href="${img}" class="image-link"><img src="${img}" alt="${project.title}"></a>
          </div>
        </li>
      `).join('')
    : '';

  // Generate panels HTML for image gallery
  const panelsHtml = project.images && project.images.length > 0
    ? project.images.map(img => `
        <div class="panel" data-color="#000" data-firstline="View" data-secondline="Gallery">
          <a href="${img}" class="image-link"><img src="${img}" alt="${project.title}"></a>
        </div>
      `).join('')
    : '';

  return (
    <html lang="en">
      <head>
        <title>{project.title} - Pro6</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={project.description || project.title} />
        <meta name="author" content="Pro6" />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <link href="/style.css" rel="stylesheet" />
        <link href="/css/all.min.css" rel="stylesheet" />
        <link href="/css/custom-hero.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.typekit.net/der4czb.css" />
      </head>

      <body className="hidden hidden-ball smooth-scroll rounded-borders hero-below-caption" data-primary-color="#fa821d">
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
                  {/* Hero Section */}
                  <div id="hero" className="has-image autoscroll">
                    <div id="hero-styles">
                      <div id="hero-caption" className="content-full-width parallax-scroll-caption" style={{ marginTop: "-100px" }}>
                        <div className="inner">
                          <h1 className="hero-title caption-timeline">
                            <span>{project.title}</span>
                            {project.location && <span> {project.location}</span>}
                          </h1>
                          <div className="hero-subtitle caption-timeline onload-shuffle">
                            {project.subtitle && <div><span>{project.subtitle}</span></div>}
                            {project.date && <div className="secondary-font"><span>{project.date}</span></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="hero-image-wrapper" className="hero-pixels-cover parallax-scroll-image" style={{ marginTop: "-300px" }}>
                    <div id="hero-background-layer" className="parallax-scroll-image">
                      <div id="hero-bg-image" style={{ backgroundImage: `url(${project.heroImage || '/images/dok6-1.jpg'})` }}></div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div id="main-content">
                    <div id="main-page-content">
                      {/* Description Row */}
                      {project.description && (
                        <div className="content-row row_padding_top row_padding_bottom light-section" data-bgcolor="#fff">
                          <div className="pinned-section">
                            <div className="scrolling-element left">
                              <figure className="has-animation">
                                <a href={project.images?.[0] || project.heroImage} className="image-link">
                                  <img src={project.images?.[0] || project.heroImage} alt={project.title} />
                                </a>
                              </figure>
                            </div>
                            <div className="pinned-element right">
                              <h1 className="has-opacity no-margins">{project.title}</h1>
                              <p className="has-opacity no-margins">{project.description}</p>
                              {project.fullDescription && <p>{project.fullDescription}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Zoom Gallery Row */}
                      {project.images && project.images.length > 0 && (
                        <div className="content-row" data-bgcolor="#0c0c0c">
                          <div className="zoom-gallery">
                            <ul 
                              className="zoom-wrapper-gallery" 
                              data-heightratio="0.6"
                              dangerouslySetInnerHTML={{ __html: galleryImagesHtml }}
                            />
                            <div className="zoom-wrapper-thumb"></div>
                          </div>
                        </div>
                      )}

                      {/* Panels Gallery Row */}
                      {project.images && project.images.length > 0 && (
                        <div className="content-row light-section full" data-bgcolor="#fff" style={{ paddingTop: "100px" }}>
                          <div className="panels" data-widthratio="1">
                            <div 
                              className="panels-container"
                              dangerouslySetInnerHTML={{ __html: panelsHtml }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Full Description Row */}
                      {project.fullDescription && (
                        <>
                          <div className="content-row full dark-section change-header-color disable-header-gradient" data-bgcolor="#0c0c0c" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div className="content-full-width text-align-center">
                              <h2 style={{ color: "#fff" }}>
                                <span className="has-mask-fill">{project.title}</span>
                              </h2>
                            </div>
                          </div>

                          <div className="content-row full" data-bgcolor="#0c0c0c" style={{ overflow: "hidden" }}>
                            <figure id="quote-image" style={{ margin: 0, width: "100%", transform: "scale(0.7)", transformOrigin: "center center" }}>
                              <img src={project.heroImage || '/images/dok6-1.jpg'} alt={project.title} style={{ width: "100%", display: "block" }} />
                            </figure>
                          </div>

                          <div className="content-row row_padding_top text-align-center" data-bgcolor="#0c0c0c" style={{ padding: "300px" }}>
                            <h1>Over dit project</h1>
                            <p className="has-opacity">{project.fullDescription}</p>
                          </div>
                        </>
                      )}

                      {/* Project Navigation Bar */}
                      <div className="content-row dark-section" data-bgcolor="#0c0c0c" style={{ backgroundColor: "#0c0c0c", padding: "80px 40px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
                          {/* Left - Overview */}
                          <a 
                            href="/projecten" 
                            style={{ display: "flex", alignItems: "center", gap: "16px", color: "#fff", textDecoration: "none", fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase" }}
                          >
                            <i className="fa-solid fa-arrow-left" style={{ fontSize: "16px" }}></i>
                            <span>Overzicht</span>
                          </a>

                          {/* Right - Next Project */}
                          {nextProject && nextProject.slug !== slug && (
                            <a 
                              href={`/projecten/${nextProject.slug}`}
                              style={{ display: "flex", alignItems: "center", gap: "16px", color: "#fff", textDecoration: "none", fontSize: "18px", letterSpacing: "2px", textTransform: "uppercase" }}
                            >
                              <span>{nextProject.title}</span>
                              <i className="fa-solid fa-arrow-right" style={{ fontSize: "16px" }}></i>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <footer className="clapat-footer hidden">
                  {/* Contact Row */}
                  <div className="content-row full row_padding_top row_padding_bottom dark-section text-align-center disable-header-gradient footer-fix" data-bgcolor="#0c0c0c">
                    <div className="one_third has-animation" data-delay="100">
                      <div className="box-icon-wrapper block-boxes">
                        <div className="box-icon">
                          <i className="fa fa-map-marker fa-2x" aria-hidden="true"></i>
                        </div>
                        <div className="box-icon-content">
                          <h6 className="no-margins">{settings?.footer?.address?.street || 'Laat 88'}</h6>
                          <p>{settings?.footer?.address?.city || '1811 EK Alkmaar'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="one_third has-animation" data-delay="200">
                      <hr /><p className="bigger">{settings?.siteName || 'Pro6'}</p>
                    </div>
                    <div className="one_third last has-animation" data-delay="300">
                      <div className="box-icon-wrapper block-boxes">
                        <div className="box-icon">
                          <i className="fa fa-phone fa-2x" aria-hidden="true"></i>
                        </div>
                        <div className="box-icon-content">
                          <h6 className="no-margins">{settings?.footer?.phone || '072 785 5228'}</h6>
                          <p>{settings?.footer?.email || 'info@pro6vastgoed.nl'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="footer-container">
                    <div id="backtotop" className="button-wrap left">
                      <div className="icon-wrap parallax-wrap">
                        <div className="button-icon parallax-element">
                          <i className="fa-solid fa-angle-up"></i>
                        </div>
                      </div>
                      <div className="button-text sticky left"><span data-hover="Back Top">Terug</span></div>
                    </div>
                    <div className="footer-middle">
                      <div className="copyright">2026 ©</div>
                    </div>
                    <div className="socials-wrap">
                      <div className="socials-icon"><i className="fa-solid fa-share-nodes"></i></div>
                      <div className="socials-text">Volg ons</div>
                      <ul className="socials">
                        {settings?.footer?.socialLinks?.map((social, idx) => (
                          <li key={idx}><span className="parallax-wrap"><a className="parallax-element" href={social.url || '#'} target="_blank">{social.label}</a></span></li>
                        )) || (
                          <>
                            <li><span className="parallax-wrap"><a className="parallax-element" href="#" target="_blank">Li</a></span></li>
                            <li><span className="parallax-wrap"><a className="parallax-element" href="#" target="_blank">Ig</a></span></li>
                          </>
                        )}
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

        <Script src="/js/jquery.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/Flip.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/smooth-scrollbar/8.4.0/smooth-scrollbar.js" strategy="beforeInteractive" />

        <Script src="/js/clapat.js" strategy="afterInteractive" />
        <Script src="/js/plugins.js" strategy="afterInteractive" />
        <Script src="/js/common.js" strategy="afterInteractive" />
        <Script src="/js/contact.js" strategy="afterInteractive" />
        <Script src="/js/scripts.js" strategy="afterInteractive" />

        <Script id="scroll-animations" strategy="afterInteractive">{`
          (function() {
            function initScrollAnimations() {
              if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
              
              var heroImage = document.getElementById('hero-image-wrapper');
              if (heroImage) {
                gsap.fromTo(heroImage, 
                  { opacity: 0, scale: 1.05 },
                  {
                    opacity: 1,
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: heroImage,
                      scroller: "#content-scroll",
                      start: "top bottom",
                      end: "top 40%",
                      scrub: 0.5
                    }
                  }
                );
              }
              
              var quoteImage = document.getElementById('quote-image');
              if (quoteImage) {
                gsap.fromTo(quoteImage, 
                  { scale: 0.7 },
                  {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: quoteImage,
                      scroller: "#content-scroll",
                      start: "top bottom",
                      end: "top 20%",
                      scrub: 0.3
                    }
                  }
                );
              }
            }
            
            if (document.readyState === 'complete') {
              setTimeout(initScrollAnimations, 100);
            } else {
              window.addEventListener('load', function() {
                setTimeout(initScrollAnimations, 100);
              });
            }
          })();
        `}</Script>
      </body>
    </html>
  );
}
