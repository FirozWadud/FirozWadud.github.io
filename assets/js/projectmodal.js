// Project Modal Functionality
function openProjectModal(projectName) {
    console.log('Opening project:', projectName);
    
    // Show loading indicator
    document.getElementById('projectContent').innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:var(--text-secondary);"><p>Loading project content...</p></div>';
    
    // Show modal
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load content
    fetch(`./projects/content/${projectName}-content.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load content for ${projectName}`);
        }
        return response.text();
      })
      .then(html => {
        // Insert content with project cover image
        document.getElementById('projectContent').innerHTML = `
          <div>
            <div style="position:relative; height:350px; overflow:hidden;">
              <img src="./assets/images/${projectName}/${projectName}_cover.jpg" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='./assets/images/${projectName}/fullrover.png'">
              <div style="position:absolute; bottom:0; left:0; right:0; padding:30px; background:linear-gradient(transparent, rgba(0,0,0,0.8));">
                <h1 style="color:var(--text-primary); margin:0 0 10px 0; font-size:28px;">${projectName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
                <p style="color:var(--primary-accent); margin:0; font-size:16px;">Project Details</p>
              </div>
            </div>
            <div style="padding:30px;">${html}</div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error loading content:', error);
        document.getElementById('projectContent').innerHTML = `
          <div style="padding:30px; text-align:center; color:var(--text-error);">
            <h3>Error Loading Content</h3>
            <p>Sorry, there was a problem loading the project content.</p>
            <p>${error.message}</p>
            <p>Check the browser console for more details.</p>
          </div>
        `;
      });
  }
  
  // Set up event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Set up close button
    document.getElementById('closeProjectBtn').addEventListener('click', function() {
      document.getElementById('projectModal').style.display = 'none';
      document.body.style.overflow = ''; // Restore background scrolling
    });
  
    // Close when clicking outside content
    document.getElementById('projectModal').addEventListener('click', function(e) {
      if (e.target === this) {
        document.getElementById('projectModal').style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });