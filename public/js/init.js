// Script loader to ensure proper loading order
(function() {
  var scripts = [
    '/js/clapat.js',
    '/js/plugins.js',
    '/js/common.js',
    '/js/contact.js',
    '/js/scripts.js',
    '/js/footer-reveal.js'
  ];
  
  var loadedCount = 0;
  
  function loadScript(index) {
    if (index >= scripts.length) {
      console.log('All scripts loaded successfully');
      return;
    }
    
    var script = document.createElement('script');
    script.src = scripts[index];
    script.onload = function() {
      loadedCount++;
      loadScript(index + 1);
    };
    script.onerror = function() {
      console.error('Failed to load: ' + scripts[index]);
      loadScript(index + 1); // Continue with next script
    };
    document.body.appendChild(script);
  }
  
  // Start loading after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadScript(0);
    });
  } else {
    loadScript(0);
  }
})();
