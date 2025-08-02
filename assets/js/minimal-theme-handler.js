/**
 * Space Theme Handler
 * Simplified theme handler for space theme
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
    // For now, just provide visual feedback
    // You can add more themes here later
    addTransitionEffect();
    
    // Optional: Add theme switching animation
    const spaceElements = document.querySelector('.space-bg');
    if (spaceElements) {
      spaceElements.style.opacity = '0.5';
      setTimeout(() => {
        spaceElements.style.opacity = '1';
      }, 300);
    }
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
    const themeLabel = document.getElementById('themeLabel');
    
    if (themeLabel) {
      // Update label text with space emoji
      themeLabel.innerHTML = '🌌 Space Theme';
    }
  }

  function addTransitionEffect() {
    // Add transition class to body for smooth theme change
    document.body.classList.add('theme-transition');
    
    // Add sparkle effect
    createSparkleEffect();
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }

  function createSparkleEffect() {
    const sparkleCount = 15;
    const container = document.body;
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #ffc107;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        box-shadow: 0 0 10px #ffc107;
        animation: sparkleAnim 1s ease-out forwards;
      `;
      
      container.appendChild(sparkle);
      
      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
  }

  // Add sparkle animation CSS
  const sparkleCSS = `
    @keyframes sparkleAnim {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(1) rotate(180deg);
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
    createSparkle: createSparkleEffect
  };

})();