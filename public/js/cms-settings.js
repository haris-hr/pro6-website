/**
 * CMS Settings Loader
 * Fetches settings from the CMS API and updates the page elements
 */
(function() {
  'use strict';

  function updateHomepageImages(images) {
    if (!images || images.length < 4) return;
    
    // Map of original image names to new URLs
    var imageMap = {
      'images/pro6-1.jpg': images[0],
      'images/pro6-2.jpg': images[1],
      'images/pro6-3.jpg': images[2],
      'images/pro6-4.jpg': images[3],
    };
    
    // Update all img elements
    var allImages = document.querySelectorAll('img');
    allImages.forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && imageMap[src]) {
        img.setAttribute('src', imageMap[src]);
      }
    });
    
    // Update all image links (lightbox)
    var allLinks = document.querySelectorAll('a.image-link');
    allLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && imageMap[href]) {
        link.setAttribute('href', imageMap[href]);
      }
    });
  }

  function updateFooterWithSettings(settings) {
    // Update address
    if (settings.address) {
      // Find address elements by looking for specific patterns
      var addressElements = document.querySelectorAll('.box-icon-content h6');
      addressElements.forEach(function(el) {
        // Check if this is the address element (contains street-like text)
        var text = el.textContent.toLowerCase();
        if (text.includes('laat') || text.includes('straat') || el.closest('.box-icon-wrapper') && el.closest('.box-icon-wrapper').querySelector('.fa-map-marker, .fa-location-dot')) {
          el.textContent = settings.address.street;
          var cityEl = el.nextElementSibling;
          if (cityEl && cityEl.tagName === 'P') {
            cityEl.textContent = settings.address.city;
          }
        }
      });

      // Also try to find by marker icon
      var markerIcons = document.querySelectorAll('.fa-map-marker, .fa-location-dot, .fa-marker');
      markerIcons.forEach(function(icon) {
        var wrapper = icon.closest('.box-icon-wrapper');
        if (wrapper) {
          var content = wrapper.querySelector('.box-icon-content');
          if (content) {
            var h6 = content.querySelector('h6');
            var p = content.querySelector('p');
            if (h6) h6.textContent = settings.address.street;
            if (p) p.textContent = settings.address.city;
          }
        }
      });
    }

    // Update phone and email
    if (settings.phone || settings.email) {
      var phoneIcons = document.querySelectorAll('.fa-phone');
      phoneIcons.forEach(function(icon) {
        var wrapper = icon.closest('.box-icon-wrapper');
        if (wrapper) {
          var content = wrapper.querySelector('.box-icon-content');
          if (content) {
            var h6 = content.querySelector('h6');
            var p = content.querySelector('p');
            if (h6 && settings.phone) h6.textContent = settings.phone;
            if (p && settings.email) p.textContent = settings.email;
          }
        }
      });
    }

    // Update social links
    if (settings.socialLinks && settings.socialLinks.length > 0) {
      var socialsUl = document.querySelector('.socials-wrap .socials');
      if (socialsUl) {
        settings.socialLinks.forEach(function(social) {
          // Find the link by label
          var links = socialsUl.querySelectorAll('a');
          links.forEach(function(link) {
            var linkText = link.textContent.toLowerCase().trim();
            if (linkText === social.label.toLowerCase() || 
                (social.platform === 'linkedin' && linkText === 'li') ||
                (social.platform === 'facebook' && linkText === 'fb') ||
                (social.platform === 'instagram' && (linkText === 'in' || linkText === 'ig'))) {
              if (social.url) {
                link.href = social.url;
              }
            }
          });
        });
      }
    }
  }

  function loadSettings() {
    fetch('/api/settings')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success && data.settings) {
          updateFooterWithSettings(data.settings);
          if (data.settings.homepageImages) {
            updateHomepageImages(data.settings.homepageImages);
          }
        }
      })
      .catch(function(error) {
        console.log('CMS settings not available:', error);
      });
  }

  // Load settings when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
  } else {
    loadSettings();
  }
})();
