/**
 * Space Theme Handler
 * Simplified theme handler for minimalistic theme toggle
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
    setupMiniThemeToggle();
    
    // Update theme toggle UI
    updateThemeToggleUI();
  }

  function setupMiniThemeToggle() {
    // Wait for sidebar component to load
    const checkForToggle = setInterval(() => {
      const themeToggle = document.getElementById('miniThemeToggle');
      
      if (themeToggle) {
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
    // Add click animation
    const themeToggle = document.getElementById('miniThemeToggle');
    if (themeToggle) {
      themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 150);
    }

    // Add transition effect
    addTransitionEffect();
    
    // Add theme switching animation
    const spaceElements = document.querySelector('.space-bg');
    if (spaceElements) {
      spaceElements.style.transition = 'opacity 0.3s ease';
      spaceElements.style.opacity = '0.7';
      setTimeout(() => {
        spaceElements.style.opacity = '1';
      }, 300);
    }

    // Add sparkle effect from the toggle button
    createToggleSparkleEffect();
    
    // Toggle night mode class for visual feedback
    if (themeToggle) {
      themeToggle.classList.toggle('night-mode');
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
    const themeToggle = document.getElementById('miniThemeToggle');
    
    if (themeToggle) {
      // Set initial state based on current theme
      if (currentTheme === THEMES.SPACE) {
        themeToggle.classList.remove('night-mode');
      } else {
        themeToggle.classList.add('night-mode');
      }
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

  function createToggleSparkleEffect() {
    const sparkleCount = 6;
    const themeToggle = document.getElementById('miniThemeToggle');
    
    if (!themeToggle) return;
    
    const toggleRect = themeToggle.getBoundingClientRect();
    const centerX = toggleRect.left + toggleRect.width / 2;
    const centerY = toggleRect.top + toggleRect.height / 2;
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const angle = (i / sparkleCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      sparkle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #ffc107;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${centerX}px;
        top: ${centerY}px;
        box-shadow: 0 0 10px #ffc107;
        animation: toggleSparkleAnim 0.8s ease-out forwards;
      `;
      
      sparkle.style.setProperty('--target-x', `${x}px`);
      sparkle.style.setProperty('--target-y', `${y}px`);
      
      document.body.appendChild(sparkle);
      
      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 800);
    }
  }

  // Add sparkle animation CSS
  const sparkleCSS = `
    @keyframes toggleSparkleAnim {
      0% {
        transform: scale(0) translateX(0) translateY(0);
        opacity: 1;
      }
      50% {
        transform: scale(1.2) translateX(calc(var(--target-x) - ${window.innerWidth/2}px)) translateY(calc(var(--target-y) - ${window.innerHeight/2}px));
        opacity: 1;
      }
      100% {
        transform: scale(0) translateX(calc(var(--target-x) - ${window.innerWidth/2}px)) translateY(calc(var(--target-y) - ${window.innerHeight/2}px));
        opacity: 0;
      }
    }
    
    /* Smooth theme transition */
    .theme-transition,
    .theme-transition * {
      transition: background-color 0.3s ease, 
                  border-color 0.3s ease, 
                  color 0.3s ease,
                  box-shadow 0.3s ease !important;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sparkleCSS;
  document.head.appendChild(styleSheet);

  // Add subtle parallax effect for sidebar
  let ticking = false;
  
  function updateSidebarParallax() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth >= 1250) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.1; // Very subtle movement
      sidebar.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
  }

  function requestSidebarParallax() {
    if (!ticking) {
      requestAnimationFrame(updateSidebarParallax);
      ticking = true;
    }
  }

  // Only apply parallax on desktop
  if (window.innerWidth >= 1250) {
    window.addEventListener('scroll', requestSidebarParallax);
  }

  // Update on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1250) {
      window.addEventListener('scroll', requestSidebarParallax);
    } else {
      window.removeEventListener('scroll', requestSidebarParallax);
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.transform = '';
      }
    }
  });

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
    createSparkle: createToggleSparkleEffect
  };

})();