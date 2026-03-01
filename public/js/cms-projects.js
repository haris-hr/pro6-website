/**
 * CMS Projects Loader
 * Fetches projects from the CMS API and updates the projects grid
 */
(function() {
  'use strict';

  function createProjectCard(project) {
    var defaultImageBadge = project.isDefaultImage 
      ? '<div class="default-image-badge">Standaard afbeelding</div>' 
      : '';
    
    return '<div class="project-card">' +
      '<a href="/projecten/' + project.slug + '">' +
        '<img src="' + project.heroImage + '" alt="' + project.title + '">' +
        defaultImageBadge +
        '<div class="project-overlay">' +
          '<div class="project-info">' +
            '<h3 class="project-title">' + project.title + '</h3>' +
            '<p class="project-subtitle">' + project.subtitle + '</p>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</div>';
  }

  function updateProjectsGrid(projects) {
    var grid = document.querySelector('.projects-grid');
    if (!grid) return;

    if (projects.length === 0) {
      grid.innerHTML = '<div style="grid-column: span 6; text-align: center; padding: 80px 20px; color: #666;">' +
        '<p>Nog geen projecten gepubliceerd.</p>' +
      '</div>';
      return;
    }

    var html = '';
    projects.forEach(function(project) {
      html += createProjectCard(project);
    });
    grid.innerHTML = html;
  }

  function loadProjects() {
    fetch('/api/projects')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success && data.projects) {
          updateProjectsGrid(data.projects);
        }
      })
      .catch(function(error) {
        console.log('CMS projects not available:', error);
      });
  }

  // Load projects when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
  } else {
    loadProjects();
  }
})();
