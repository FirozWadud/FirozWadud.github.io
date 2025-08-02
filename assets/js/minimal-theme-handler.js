/**
 * Minimalistic Theme Handler
 * Handles switching between dark and light glassmorphism themes
 */
(function() {
  'use strict';

  // Theme configuration
  const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
  };

  const STORAGE_KEY = 'selectedTheme';
  const DEFAULT_THEME = THEMES.DARK;

  // State
  let currentTheme = DEFAULT_THEME;

  // Initialize theme system when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initThemeSystem();
  });

  function initThemeSystem() {
    // Load saved theme or default
    currentTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    
    // Apply the theme
    applyTheme(currentTheme);
    
    // Set up theme toggle when components are loaded
    setupThemeToggle();
    
    // Update theme toggle UI
    updateThemeToggleUI();
  }

  function setupThemeToggle() {
    // Wait for component to load
    const checkForToggle = setInterval(() => {
      const themeToggle = document.getElementById('themeToggle');
      const themeLabel = document.getElementById('themeLabel');
      
      if (themeToggle && themeLabel) {
        clearInterval(checkForToggle);
        
        // Add click event listener
        themeToggle.addEventListener('click', toggleTheme);
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        });
        
        // Update initial UI state
        updateThemeToggleUI();
      }
    }, 100);
  }

  function toggleTheme() {
    // Switch between themes
    currentTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    
    // Apply the new theme
    applyTheme(currentTheme);
    
    // Update UI
    updateThemeToggleUI();
    
    // Add transition effect
    addTransitionEffect();
  }

  function applyTheme(theme) {
    // Remove existing theme stylesheets
    const existingTheme = document.getElementById('theme-stylesheet');
    if (existingTheme) {
      existingTheme.remove();
    }

    // Determine correct path to theme file based on current location
    let themePath;
    if (window.location.pathname.includes('/projects/')) {
      // For project pages, go up one directory
      themePath = `../assets/css/themes/enhanced-${theme}-glassmorphism-theme.css`;
    } else {
      // For main page
      themePath = `./assets/css/themes/enhanced-${theme}-glassmorphism-theme.css`;
    }

    // Create and add the theme stylesheet
    const themeLink = document.createElement('link');
    themeLink.id = 'theme-stylesheet';
    themeLink.rel = 'stylesheet';
    themeLink.href = themePath;
    document.head.appendChild(themeLink);

    // Save theme preference
    localStorage.setItem(STORAGE_KEY, theme);

    // Add data attribute to body
    document.body.setAttribute('data-theme', theme);

    // Trigger custom event for any listeners
    document.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme } 
    }));
  }

  function updateThemeToggleUI() {
    const themeLabel = document.getElementById('themeLabel');
    
    if (themeLabel) {
      // Update label text
      themeLabel.textContent = currentTheme === THEMES.DARK ? 'Dark' : 'Light';
    }
  }

  function addTransitionEffect() {
    // Add transition class to body for smooth theme change
    document.body.classList.add('theme-transition');
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }

  // Handle system theme preference change
  function handleSystemThemeChange() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', function(e) {
      // Only auto-switch if no manual preference is saved
      if (!localStorage.getItem(STORAGE_KEY)) {
        const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        currentTheme = systemTheme;
        applyTheme(currentTheme);
        updateThemeToggleUI();
      }
    });
  }

  // Initialize system theme change handling
  handleSystemThemeChange();

  // Public API (if needed)
  window.ThemeHandler = {
    getCurrentTheme: () => currentTheme,
    setTheme: (theme) => {
      if (theme === THEMES.DARK || theme === THEMES.LIGHT) {
        currentTheme = theme;
        applyTheme(theme);
        updateThemeToggleUI();
      }
    },
    toggleTheme: toggleTheme
  };

})();