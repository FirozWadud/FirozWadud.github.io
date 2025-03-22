/**
 * Theme Orbit
 * Interactive cosmic-inspired theme switcher
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if components are loaded
    const componentsLoaded = setInterval(function() {
      if (document.querySelector('.theme-orbit')) {
        clearInterval(componentsLoaded);
        initThemeOrbit();
      }
    }, 100);
  
    function initThemeOrbit() {
      // Get theme orbit elements
      const themeOrbit = document.querySelector('.theme-orbit');
      const themePlanets = document.querySelectorAll('.theme-planet');
      const prevArrow = document.querySelector('.prev-theme');
      const nextArrow = document.querySelector('.next-theme');
      const orbitSun = document.querySelector('.orbit-sun');
      
      const themes = ['dark', 'light', 'blue'];
      let currentThemeIndex = 0;
      
      // Check for saved theme or use default
      const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
      currentThemeIndex = themes.indexOf(savedTheme);
      if (currentThemeIndex === -1) currentThemeIndex = 0;
      
      // Set initial active theme
      setActiveTheme(themes[currentThemeIndex]);
      
      // Click on sun to toggle orbit visibility
      orbitSun.addEventListener('click', function() {
        themeOrbit.classList.toggle('active');
      });
      
      // Click on any planet to select theme
      themePlanets.forEach(planet => {
        const theme = planet.getAttribute('data-theme');
        
        // Set active planet based on saved theme
        if (theme === savedTheme) {
          planet.setAttribute('data-active', 'true');
        }
        
        planet.addEventListener('click', function() {
          const selectedTheme = this.getAttribute('data-theme');
          currentThemeIndex = themes.indexOf(selectedTheme);
          
          // Update active state
          themePlanets.forEach(p => p.removeAttribute('data-active'));
          this.setAttribute('data-active', 'true');
          
          // Apply theme
          setActiveTheme(selectedTheme);
          
          // Auto-hide the orbit after selection
          setTimeout(() => {
            themeOrbit.classList.remove('active');
          }, 1000);
        });
      });
      
      // Arrow navigation
      prevArrow.addEventListener('click', function() {
        currentThemeIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
        updateActiveTheme();
      });
      
      nextArrow.addEventListener('click', function() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        updateActiveTheme();
      });
      
      // Update theme based on current index
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
        setActiveTheme(selectedTheme);
      }
      
      // Theme setting function
      function setActiveTheme(theme) {
        // Remove existing theme stylesheet if any
        const existingTheme = document.getElementById('theme-stylesheet');
        if (existingTheme) {
          existingTheme.remove();
        }
        
        // Add theme stylesheet for all themes (including dark)
        const themeLink = document.createElement('link');
        themeLink.id = 'theme-stylesheet';
        themeLink.rel = 'stylesheet';
        themeLink.href = `./assets/css/themes/${theme}-theme.css`;
        document.head.appendChild(themeLink);
        
        // Save theme preference
        localStorage.setItem('selectedTheme', theme);
        
        // Add data attribute to body
        document.body.setAttribute('data-theme', theme);
        
        // Add transition effect to active content
        const activeContent = document.querySelector('article.active');
        if (activeContent) {
          activeContent.classList.add('theme-transition');
          setTimeout(() => {
            activeContent.classList.remove('theme-transition');
          }, 500);
        }
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('themechange', { 
          detail: { theme } 
        }));
      }
      
      // Keyboard navigation for accessibility
      document.addEventListener('keydown', function(event) {
        if (themeOrbit.classList.contains('active')) {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            prevArrow.click();
          } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextArrow.click();
          }
        }
      });
      
      // Mobile detection and adjustment
      function adjustForMobile() {
        if (window.innerWidth <= 767) {
          themeOrbit.style.flexDirection = 'row';
        } else {
          themeOrbit.style.flexDirection = 'column';
        }
      }
      
      // Apply initial adjustments
      adjustForMobile();
      
      // Adjust on window resize
      window.addEventListener('resize', adjustForMobile);
    }
  });