import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, getPublishedProjects, getSiteSettings } from "@/lib/firebase/firestore";
import type { Project, SiteSettings } from "@/types";

export const revalidate = 0;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Fetch current project, all projects for navigation, and settings
  const [project, allProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
    getSiteSettings()
  ]) as [Project | null, Project[], SiteSettings | null];

  if (!project) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Find next project for navigation
  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  const nextProject = currentIndex < allProjects.length - 1 
    ? allProjects[currentIndex + 1] 
    : allProjects[0];

  // Generate gallery images HTML
  const galleryImagesHtml = project.images && project.images.length > 0
    ? project.images.map((img, idx) => `
        <li${idx === 0 ? ' class="zoom-center"' : ''}>
          <div class="zoom-img-wrapper">
            <a href="${img}" class="image-link"><img src="${img}" alt="${escapeHtml(project.title)}"></a>
          </div>
        </li>
      `).join('')
    : '';

  // Generate panels HTML for image gallery
  const panelsHtml = project.images && project.images.length > 0
    ? project.images.map(img => `
        <div class="panel" data-color="#000" data-firstline="View" data-secondline="Gallery">
          <a href="${img}" class="image-link"><img src="${img}" alt="${escapeHtml(project.title)}"></a>
        </div>
      `).join('')
    : '';

  const heroImage = project.heroImage || '';
  const firstImage = project.images?.[0] || heroImage;

  // Build the HTML page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>${escapeHtml(project.title)} - Pro6</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(project.description || project.title)}" />
    <meta name="author" content="Pro6">
    <meta charset="UTF-8" />
    <link rel="icon" type="image/ico" href="/favicon.ico" />
    <link href="/style.css" rel="stylesheet" />
    <link href="/css/all.min.css" rel="stylesheet" />
    <link href="/css/custom-hero.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://use.typekit.net/der4czb.css">
</head>

<body class="hidden hidden-ball smooth-scroll rounded-borders hero-below-caption" data-primary-color="#fa821d">

<main>
    <!-- Preloader -->
    <div class="preloader-wrap" data-centerLine="Loading">
        <div class="percentage-wrapper">
            <div class="percentage" id="precent">
                <span class="number number_2">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
                </span>
                <span class="number number_3">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>
                </span>
            </div>
            <div class="percentage-first"><span>wait, wait..</span></div>
            <div class="percentage-last"><span>100</span></div>
        </div>
    </div>

    <div class="cd-index cd-main-content">
        <!-- Page Content -->
        <div id="clapat-page-content" class="dark-content" data-bgcolor="#fff">
            <!-- Header -->
            <header class="clapat-header fullscreen-menu" data-menucolor="#fff">
                <div class="header-gradient"></div>
                <div id="header-container">
                    <div id="clapat-logo" class="hide-ball">
                        <a href="/index.html">
                            <img class="black-logo" src="/images/logo.png" alt="Pro6 Logo">
                            <img class="white-logo" src="/images/logo-white.png" alt="Pro6 Logo">
                        </a>
                    </div>

                    <nav class="clapat-nav-wrapper">
                        <div class="nav-height">
                            <ul data-breakpoint="1025" class="flexnav">
                                <li class="menu-timeline link"><a href="/index.html"><div class="before-span"><span data-hover="Index">Home</span></div></a></li>
                                <li class="menu-timeline link"><a class="active" href="/projecten"><div class="before-span"><span data-hover="Projecten">Projecten</span></div></a></li>
                                <li class="menu-timeline link"><a href=""><div class="before-span"><span data-hover="Over ons">Over ons</span></div></a></li>
                                <li class="menu-timeline link"><a href=""><div class="before-span"><span data-hover="Contact">Contact</span></div></a></li>
                                <li class="menu-timeline link"><a href=""><div class="before-span"><span data-hover="Te koop">Te koop</span></div></a></li>
                            </ul>
                        </div>
                    </nav>

                    <a class="header-button" href="">
                        <div class="button-icon-link right">
                            <div class="icon-wrap-scale">
                                <div class="icon-wrap parallax-wrap">
                                    <div class="button-icon parallax-element">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="button-text sticky right"><span data-hover="Contact">Contact</span></div>
                        </div>
                    </a>

                    <div class="button-wrap right menu burger-lines">
                        <div class="button-icon parallax-element">
                            <div id="burger-wrapper">
                                <div id="menu-burger">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div class="button-text sticky right"><span data-hover="Menu">Menu</span></div>
                    </div>
                </div>
            </header>

            <div id="content-scroll">
                <div id="main">
                    <!-- Hero Section -->
                    <div id="hero" class="has-image autoscroll">
                        <div id="hero-styles">
                            <div id="hero-caption" class="content-full-width parallax-scroll-caption" style="margin-top: -100px;">
                                <div class="inner">
                                    <h1 class="hero-title caption-timeline">
                                        <span>${escapeHtml(project.title)}</span>
                                        ${project.location ? `<span> ${escapeHtml(project.location)}</span>` : ''}
                                    </h1>
                                    <div class="hero-subtitle caption-timeline onload-shuffle">
                                        ${project.subtitle ? `<div><span>${escapeHtml(project.subtitle)}</span></div>` : ''}
                                        ${project.date ? `<div class="secondary-font"><span>${escapeHtml(project.date)}</span></div>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="hero-image-wrapper" class="hero-pixels-cover parallax-scroll-image" style="margin-top: -300px;">
                        <div id="hero-background-layer" class="parallax-scroll-image">
                            <div id="hero-bg-image" style="background-image: url(${heroImage});"></div>
                        </div>
                    </div>

                    <div id="main-content">
                        <div id="main-page-content">
                            ${project.description ? `
                            <!-- Description Row -->
                            <div class="content-row row_padding_top row_padding_bottom light-section" data-bgcolor="#fff">
                                <div class="pinned-section">
                                    <div class="scrolling-element left">
                                        <figure class="has-animation">
                                            <a href="${firstImage}" class="image-link">
                                                <img src="${firstImage}" alt="${escapeHtml(project.title)}">
                                            </a>
                                        </figure>
                                    </div>
                                    <div class="pinned-element right">
                                        <h1 class="has-opacity no-margins">${escapeHtml(project.title)}</h1>
                                        <p class="has-opacity no-margins">${escapeHtml(project.description)}</p>
                                        ${project.fullDescription ? `<p>${escapeHtml(project.fullDescription)}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                            ` : ''}

                            ${project.images && project.images.length > 0 ? `
                            <!-- Zoom Gallery Row -->
                            <div class="content-row" data-bgcolor="#0c0c0c">
                                <div class="zoom-gallery">
                                    <ul class="zoom-wrapper-gallery" data-heightratio="0.6">
                                        ${galleryImagesHtml}
                                    </ul>
                                    <div class="zoom-wrapper-thumb"></div>
                                </div>
                            </div>
                            ` : ''}

                            ${project.images && project.images.length > 0 ? `
                            <!-- Panels Gallery Row -->
                            <div class="content-row light-section full" data-bgcolor="#fff" style="padding-top: 100px;">
                                <div class="panels" data-widthratio="1">
                                    <div class="panels-container">
                                        ${panelsHtml}
                                    </div>
                                </div>
                            </div>
                            ` : ''}

                            ${project.fullDescription ? `
                            <!-- Full Description -->
                            <div class="content-row full dark-section change-header-color disable-header-gradient" data-bgcolor="#0c0c0c" style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                                <div class="content-full-width text-align-center">
                                    <h2 style="color: #fff;">
                                        <span class="has-mask-fill">${escapeHtml(project.title)}</span>
                                    </h2>
                                </div>
                            </div>

                            <div class="content-row full" data-bgcolor="#0c0c0c" style="overflow: hidden;">
                                <figure id="quote-image" style="margin: 0; width: 100%; transform: scale(0.7); transform-origin: center center;">
                                    <img src="${heroImage}" alt="${escapeHtml(project.title)}" style="width: 100%; display: block;">
                                </figure>
                            </div>

                            <div class="content-row row_padding_top text-align-center" data-bgcolor="#0c0c0c" style="padding: 300px;">
                                <h1>Over dit project</h1>
                                <p class="has-opacity">${escapeHtml(project.fullDescription)}</p>
                            </div>
                            ` : ''}

                            <!-- Project Navigation Bar -->
                            <div class="content-row dark-section" data-bgcolor="#0c0c0c" style="background-color: #0c0c0c; padding: 80px 40px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; width: 100%;">
                                    <a href="/projecten" style="display: flex; align-items: center; gap: 16px; color: #fff; text-decoration: none; font-size: 18px; letter-spacing: 2px; text-transform: uppercase;">
                                        <i class="fa-solid fa-arrow-left" style="font-size: 16px;"></i>
                                        <span>Overzicht</span>
                                    </a>
                                    ${nextProject && nextProject.slug !== slug ? `
                                    <a href="/projecten/${escapeHtml(nextProject.slug)}" style="display: flex; align-items: center; gap: 16px; color: #fff; text-decoration: none; font-size: 18px; letter-spacing: 2px; text-transform: uppercase;">
                                        <span>${escapeHtml(nextProject.title)}</span>
                                        <i class="fa-solid fa-arrow-right" style="font-size: 16px;"></i>
                                    </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <footer class="clapat-footer hidden">
                    <div class="content-row full row_padding_top row_padding_bottom dark-section text-align-center disable-header-gradient footer-fix" data-bgcolor="#0c0c0c">
                        <div class="one_third has-animation" data-delay="100">
                            <div class="box-icon-wrapper block-boxes">
                                <div class="box-icon">
                                    <i class="fa fa-map-marker fa-2x" aria-hidden="true"></i>
                                </div>
                                <div class="box-icon-content">
                                    <h6 class="no-margins">${escapeHtml(settings?.footer?.address?.street || 'Laat 88')}</h6>
                                    <p>${escapeHtml(settings?.footer?.address?.city || '1811 EK Alkmaar')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="one_third has-animation" data-delay="200">
                            <hr><p class="bigger">${escapeHtml(settings?.siteName || 'Pro6')}</p>
                        </div>
                        <div class="one_third last has-animation" data-delay="300">
                            <div class="box-icon-wrapper block-boxes">
                                <div class="box-icon">
                                    <i class="fa fa-phone fa-2x" aria-hidden="true"></i>
                                </div>
                                <div class="box-icon-content">
                                    <h6 class="no-margins">${escapeHtml(settings?.footer?.phone || '072 785 5228')}</h6>
                                    <p>${escapeHtml(settings?.footer?.email || 'info@pro6vastgoed.nl')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="footer-container">
                        <div id="backtotop" class="button-wrap left">
                            <div class="icon-wrap parallax-wrap">
                                <div class="button-icon parallax-element">
                                    <i class="fa-solid fa-angle-up"></i>
                                </div>
                            </div>
                            <div class="button-text sticky left"><span data-hover="Back Top">Terug</span></div>
                        </div>
                        <div class="footer-middle">
                            <div class="copyright">2026 ©</div>
                        </div>
                        <div class="socials-wrap">
                            <div class="socials-icon"><i class="fa-solid fa-share-nodes"></i></div>
                            <div class="socials-text">Volg ons</div>
                            <ul class="socials">
                                ${settings?.footer?.socialLinks?.map(social => 
                                    `<li><span class="parallax-wrap"><a class="parallax-element" href="${escapeHtml(social.url || '#')}" target="_blank">${escapeHtml(social.label)}</a></span></li>`
                                ).join('') || `
                                <li><span class="parallax-wrap"><a class="parallax-element" href="#" target="_blank">Li</a></span></li>
                                <li><span class="parallax-wrap"><a class="parallax-element" href="#" target="_blank">Ig</a></span></li>
                                `}
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>

            <div id="app"></div>
        </div>
    </div>
</main>

<div class="cd-cover-layer"></div>
<div id="magic-cursor">
    <div id="ball">
        <div id="ball-drag-x"></div>
        <div id="ball-drag-y"></div>
        <div id="ball-loader"></div>
    </div>
</div>
<div id="clone-image">
    <div class="hero-translate"></div>
</div>
<div id="rotate-device"></div>

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

<script>
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
</script>

</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
