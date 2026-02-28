(function() {
    'use strict';
    
    window.addEventListener('load', function() {
        
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }
        
        const footer = document.querySelector('.clapat-footer');
        const main = document.querySelector('#main');
        
        if (!footer || !main) return;

        setTimeout(function() {
            const viewportHeight = window.innerHeight;
            
            // Fix the footer in place
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
            footer.style.width = '100%';
            footer.style.zIndex = '-1';
            
            // Ensure footer content stays put - reset any transforms on dark-section-wrapper inside footer
            const footerDarkSections = footer.querySelectorAll('.dark-section-wrapper');
            footerDarkSections.forEach(function(section) {
                section.style.transform = 'none';
                section.style.position = 'relative';
            });
            
            if (document.body.classList.contains('smooth-scroll')) {
                gsap.to(main, {
                    y: -viewportHeight,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: footer,
                        scroller: '#content-scroll',
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true,
                        markers: false,
                    }
                });
                
            } else {
                gsap.to(main, {
                    y: -viewportHeight,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: footer,
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true,
                        markers: false
                    }
                });
            }
            ScrollTrigger.refresh();
        }, 1000);
    });
    
})();