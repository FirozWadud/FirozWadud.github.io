/**
 * Unified Theme Handler
 * One script to handle themes across all pages
 */
(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      initThemeSystem();
    });
  
    function initThemeSystem() {
      // Determine if we're on a project page or main page
      const isProjectPage = window.location.pathname.includes('/projects/');
      
      // Set up theme toggling elements if they exist
      setupThemeToggle();
      
      // Apply the saved theme (or default)
      const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
      applyTheme(savedTheme);
      
      // Set up communication between pages if needed
      setupCrossSiteCommunication(isProjectPage);
    }
    
    function setupThemeToggle() {
      // Find theme planets if available
      const themePlanets = document.querySelectorAll('.theme-planet');
      const prevArrow = document.querySelector('.prev-theme');
      const nextArrow = document.querySelector('.next-theme');
      const orbitSun = document.querySelector('.orbit-sun');
      
      // Themes supported by our system
      const themes = ['dark', 'light', 'blue'];
      let currentThemeIndex = 0;
      
      // Check for saved theme or use default
      const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
      currentThemeIndex = themes.indexOf(savedTheme);
      if (currentThemeIndex === -1) currentThemeIndex = 0;
      
      // Only proceed if we have theme planets (i.e., main page)
      if (themePlanets.length === 0) return;
      
      // Get the theme orbit element if it exists
      const themeOrbit = document.querySelector('.theme-orbit');
      
      // Toggle orbit visibility when clicking the sun
      if (orbitSun) {
        orbitSun.addEventListener('click', function() {
          themeOrbit.classList.toggle('active');
        });
      }
      
      // Mark the active theme
      themePlanets.forEach(planet => {
        const theme = planet.getAttribute('data-theme');
        if (theme === savedTheme) {
          planet.setAttribute('data-active', 'true');
        }
        
        // Add click event to change themes
        planet.addEventListener('click', function() {
          const selectedTheme = this.getAttribute('data-theme');
          currentThemeIndex = themes.indexOf(selectedTheme);
          
          // Update active states
          themePlanets.forEach(p => p.removeAttribute('data-active'));
          this.setAttribute('data-active', 'true');
          
          // Apply the theme
          applyTheme(selectedTheme);
          
          // Auto-hide the orbit
          setTimeout(() => {
            if (themeOrbit) themeOrbit.classList.remove('active');
          }, 1000);
        });
      });
      
      // Add arrow navigation if available
      if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', function() {
          currentThemeIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
          updateActiveTheme();
        });
        
        nextArrow.addEventListener('click', function() {
          currentThemeIndex = (currentThemeIndex + 1) % themes.length;
          updateActiveTheme();
        });
      }
      
      // Update active theme based on current index
      function updateActiveTheme() {
        const selectedTheme = themes[currentThemeIndex];
        
        // Update active planet
        themePlanets.forEach(planet => {
          const planetTheme = planet.getAttribute('data-theme');
          if (planetTheme === selectedTheme) {
            planet.setAttribute('data-active', 'true');
          } else {
            planet.removeAttribute('data-active');
          }
        });
        
        // Apply the theme
        applyTheme(selectedTheme);
      }
    }
    
    // The main function to apply a theme
    function applyTheme(theme) {
      // Remove existing theme stylesheet if any
      const existingTheme = document.getElementById('theme-stylesheet');
      if (existingTheme) {
        existingTheme.remove();
      }
      
      // Determine correct path to theme file based on current location
      let themePath;
      if (window.location.pathname.includes('/projects/')) {
        // For project pages, go up one directory
        themePath = `../assets/css/themes/${theme}-theme.css`;
      } else {
        // For main page
        themePath = `./assets/css/themes/${theme}-theme.css`;
      }
      
      // Create and add the theme stylesheet
      const themeLink = document.createElement('link');
      themeLink.id = 'theme-stylesheet';
      themeLink.rel = 'stylesheet';
      themeLink.href = themePath;
      document.head.appendChild(themeLink);
      
      // Save theme preference
      localStorage.setItem('selectedTheme', theme);
      
      // Add data attribute to body
      document.body.setAttribute('data-theme', theme);
      
      // Add transition effect
      const activeContent = document.querySelector('article.active') || document.body;
      activeContent.classList.add('theme-transition');
      setTimeout(() => {
        activeContent.classList.remove('theme-transition');
      }, 500);
      
      // Trigger a custom event for any listeners
      document.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme } 
      }));
    }
    
    // Setup communication between main page and project pages
    function setupCrossSiteCommunication(isProjectPage) {
      if (isProjectPage) {
        // Project pages listen for messages from main page
        window.addEventListener('message', function(event) {
          if (event.data && event.data.theme) {
            applyTheme(event.data.theme);
          }
        });
      } else {
        // Main page listens for theme changes to send to project iframes
        document.addEventListener('themechange', function(e) {
          const theme = e.detail.theme;
          
          // Find any project iframes and send them the theme
          const projectFrames = document.querySelectorAll('iframe[src*="projects/"]');
          projectFrames.forEach(frame => {
            try {
              frame.contentWindow.postMessage({ theme: theme }, '*');
            } catch (error) {
              console.warn('Could not send theme to iframe:', error);
            }
          });
        });
      }
    }
  })();