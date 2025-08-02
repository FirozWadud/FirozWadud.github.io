/**
 * Space Theme Handler
 * Simplified theme handler for sidebar theme toggle
 */
(function() {
  'use strict';

  // Theme configuration
  const THEMES = {
    SPACE: 'space',
    CLASSIC: 'classic' // Optional alternative theme
  };

  const STORAGE_KEY = 'selectedTheme';
  const DEFAULT_THEME = THEMES.SPACE;

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
    setupSidebarThemeToggle();
    
    // Update theme toggle UI
    updateThemeToggleUI();
  }

  function setupSidebarThemeToggle() {
    // Wait for sidebar component to load
    const checkForToggle = setInterval(() => {
      const themeToggle = document.getElementById('sidebarThemeToggle');
      const themeLabel = document.getElementById('sidebarThemeLabel');
      
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
    // For now, just provide visual feedback
    // You can add more themes here later
    addTransitionEffect();
    
    // Add theme switching animation
    const spaceElements = document.querySelector('.space-bg');
    if (spaceElements) {
      spaceElements.style.transition = 'opacity 0.3s ease';
      spaceElements.style.opacity = '0.3';
      setTimeout(() => {
        spaceElements.style.opacity = '1';
      }, 300);
    }

    // Add sparkle effect from the sidebar
    createSidebarSparkleEffect();
  }

  function applyTheme(theme) {
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
    const themeLabel = document.getElementById('sidebarThemeLabel');
    
    if (themeLabel) {
      // Update label text
      themeLabel.textContent = 'Space';
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

  function createSidebarSparkleEffect() {
    const sparkleCount = 8;
    const sidebar = document.querySelector('.sidebar');
    
    if (!sidebar) return;
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const sidebarRect = sidebar.getBoundingClientRect();
      
      sparkle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: #ffc107;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${sidebarRect.left + Math.random() * sidebarRect.width}px;
        top: ${sidebarRect.top + Math.random() * sidebarRect.height}px;
        box-shadow: 0 0 8px #ffc107;
        animation: miniSparkleAnim 1s ease-out forwards;
      `;
      
      document.body.appendChild(sparkle);
      
      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
  }

  // Add mini sparkle animation CSS
  const sparkleCSS = `
    @keyframes miniSparkleAnim {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 1;
      }
      100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sparkleCSS;
  document.head.appendChild(styleSheet);

  // Public API (if needed)
  window.ThemeHandler = {
    getCurrentTheme: () => currentTheme,
    setTheme: (theme) => {
      if (theme === THEMES.SPACE || theme === THEMES.CLASSIC) {
        currentTheme = theme;
        applyTheme(theme);
        updateThemeToggleUI();
      }
    },
    toggleTheme: toggleTheme,
    createSparkle: createSidebarSparkleEffect
  };

})();