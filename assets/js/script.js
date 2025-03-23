'use strict';

// Function to parse hash and extract parameters
function parseHash() {
  const hash = window.location.hash.substring(1); // Remove the # character
  
  if (!hash) return { section: null, params: {} };
  
  // Check if there are parameters
  if (hash.includes('?')) {
    const [section, paramString] = hash.split('?');
    const params = {};
    
    // Parse parameters
    const searchParams = new URLSearchParams(paramString);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    return { section, params };
  }
  
  // No parameters, just section
  return { section: hash, params: {} };
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Check for hash in URL (e.g., #portfolio?filter=projects)
  if (window.location.hash) {
    const { section, params } = parseHash();
    
    // We'll handle this after components are loaded
    checkComponentsLoaded(section, params);
  } else {
    // No hash, just check if components are loaded
    checkComponentsLoaded();
  }
});

// Function to check if components are loaded
function checkComponentsLoaded(hashSection, hashParams) {
  // Check if all components are loaded every 100ms
  const componentsLoaded = setInterval(function() {
    // Count how many component placeholders are still empty
    const pendingComponents = document.querySelectorAll('[data-component]:empty').length;
    
    if (pendingComponents === 0) {
      // All components are loaded, clear interval and initialize
      clearInterval(componentsLoaded);
      initializePortfolio(hashSection, hashParams);
    }
  }, 100);
}

// Main initialization function - only called after all components are loaded
function initializePortfolio(hashSection, hashParams = {}) {
  console.log('All components loaded, initializing functionality');
  
  // Initialize sidebar
  initSidebar();
  
  // Initialize testimonials
  initTestimonials();
  
  // Initialize select and filter
  initSelectAndFilter();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize page navigation with parameters
  initNavigation(hashSection, hashParams);
  
  // Initialize filter memory enhancement
  enhanceFilterMemory();
}

// Sidebar functionality
function initSidebar() {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  
  // Check if elements exist (sidebar component loaded)
  if (sidebar && sidebarBtn) {
    // sidebar toggle functionality for mobile
    sidebarBtn.addEventListener("click", function() {
      sidebar.classList.toggle("active");
    });
  }
}

// Testimonials modal functionality
function initTestimonials() {
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  
  // Check if elements exist (testimonials component loaded)
  if (testimonialsItem.length && modalContainer && modalCloseBtn && overlay) {
    // modal variables
    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");
    
    // modal toggle function
    const testimonialsModalFunc = function() {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    };
    
    // add click event to all modal items
    for (let i = 0; i < testimonialsItem.length; i++) {
      testimonialsItem[i].addEventListener("click", function() {
        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
        
        testimonialsModalFunc();
      });
    }
    
    // add click event to modal close button
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    overlay.addEventListener("click", testimonialsModalFunc);
  }
}

// Select and filter functionality
function initSelectAndFilter() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");
  
  // Check if elements exist (portfolio component loaded)
  if (select && selectItems.length && selectValue && filterBtn.length && filterItems.length) {
    // Element toggle helper function 
    const elementToggleFunc = function(elem) {
      elem.classList.toggle("active");
    };
    
    // Select dropdown
    select.addEventListener("click", function() {
      elementToggleFunc(this);
    });
    
    // Filter function
    const filterFunc = function(selectedValue) {
      for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue === "all") {
          filterItems[i].classList.add("active");
        } else if (selectedValue === filterItems[i].dataset.category) {
          filterItems[i].classList.add("active");
        } else {
          filterItems[i].classList.remove("active");
        }
      }
    };
    
    // Add event to all select items
    for (let i = 0; i < selectItems.length; i++) {
      selectItems[i].addEventListener("click", function() {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
        
        // Store the active category in localStorage
        localStorage.setItem('activeFilterCategory', selectedValue);
      });
    }
    
    // Add event to all filter button items for large screen
    let lastClickedBtn = filterBtn[0];
    
    for (let i = 0; i < filterBtn.length; i++) {
      filterBtn[i].addEventListener("click", function() {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);
        
        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
        
        // Store the active category in localStorage
        localStorage.setItem('activeFilterCategory', selectedValue);
      });
    }
  }
}

// Contact form functionality
function initContactForm() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");
  
  // Check if elements exist (contact component loaded)
  if (form && formInputs.length && formBtn) {
    // Add event to all form input fields
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].addEventListener("input", function() {
        // Check form validation
        if (form.checkValidity()) {
          formBtn.removeAttribute("disabled");
        } else {
          formBtn.setAttribute("disabled", "");
        }
      });
    }
  }
}

// Page navigation functionality
function initNavigation(hashSection, hashParams = {}) {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");
  
  // Helper function to activate a specific section
  function activateSection(sectionName, params = {}) {
    // Loop through all nav links and pages
    for (let i = 0; i < navigationLinks.length; i++) {
      if (navigationLinks[i].innerHTML.toLowerCase() === sectionName) {
        navigationLinks[i].classList.add("active");
      } else {
        navigationLinks[i].classList.remove("active");
      }
    }
    
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].dataset.page === sectionName) {
        pages[i].classList.add("active");
        
        // If this is the portfolio section and we have a filter parameter
        if (sectionName === 'portfolio' && params.filter) {
          // Activate the specified filter after a short delay to ensure DOM is ready
          setTimeout(() => {
            activateFilter(params.filter);
          }, 100);
        }
      } else {
        pages[i].classList.remove("active");
      }
    }
    
    window.scrollTo(0, 0);
  }
  
  // Helper function to activate a specific filter
  function activateFilter(filterName) {
    const filterButtons = document.querySelectorAll("[data-filter-btn]");
    const selectValue = document.querySelector("[data-selecct-value]");
    let lastClickedBtn = null;
    
    // Normalize the filter name for comparison
    filterName = filterName.toLowerCase();
    
    // Find the corresponding filter button and activate it
    for (let i = 0; i < filterButtons.length; i++) {
      const btnText = filterButtons[i].innerText.toLowerCase();
      
      if (btnText === filterName) {
        // This is our target filter button
        filterButtons[i].classList.add("active");
        lastClickedBtn = filterButtons[i];
        
        // Update select value text if available
        if (selectValue) {
          selectValue.innerText = filterButtons[i].innerText;
        }
        
        // Define and call the filter function
        const filterItems = document.querySelectorAll("[data-filter-item]");
        for (let j = 0; j < filterItems.length; j++) {
          if (filterName === "all") {
            filterItems[j].classList.add("active");
          } else if (filterName === filterItems[j].dataset.category) {
            filterItems[j].classList.add("active");
          } else {
            filterItems[j].classList.remove("active");
          }
        }
        
        // Store the active filter
        localStorage.setItem('activeFilterCategory', filterName);
        
      } else if (filterButtons[i].classList.contains("active")) {
        // Deactivate any other active button
        filterButtons[i].classList.remove("active");
      }
    }
  }
  
  // First check if we have a hash section with parameters (highest priority)
  if (hashSection) {
    // Check if there's a filter parameter in the hashParams
    if (hashParams.filter) {
      // Activate the section with filter parameter
      activateSection(hashSection, { filter: hashParams.filter });
    } else {
      // No parameters, just activate the section
      activateSection(hashSection);
    }
    
    // Also store it in localStorage for future visits
    localStorage.setItem('activeSection', hashSection);
  } 
  // Then check localStorage
  else {
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection) {
      // Check if we have a stored filter for the portfolio section
      if (storedSection === 'portfolio') {
        const storedFilter = localStorage.getItem('activeFilterCategory');
        if (storedFilter) {
          activateSection(storedSection, { filter: storedFilter });
        } else {
          activateSection(storedSection);
        }
      } else {
        activateSection(storedSection);
      }
    }
    // Default behavior is already handled by HTML (first section active)
  }
  
  // Add click event to all nav links
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function() {
      const targetPage = this.innerHTML.toLowerCase();
      
      // Store the active section
      localStorage.setItem('activeSection', targetPage);
      
      // If going to portfolio and we have a stored filter, activate with filter
      if (targetPage === 'portfolio') {
        const storedFilter = localStorage.getItem('activeFilterCategory');
        if (storedFilter) {
          activateSection(targetPage, { filter: storedFilter });
          
          // Update URL hash with filter parameter
          history.replaceState(null, null, '#' + targetPage + '?filter=' + storedFilter);
          return;
        }
      }
      
      // Otherwise just activate the section
      activateSection(targetPage);
      
      // Update URL hash without page reload
      history.replaceState(null, null, '#' + targetPage);
    });
  }
  
  // Store section when clicking on project links
  const projectLinks = document.querySelectorAll('.project-item a');
  if (projectLinks.length) {
    projectLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Find the current active page
        const currentPage = document.querySelector('[data-page].active');
        if (currentPage) {
          localStorage.setItem('activeSection', currentPage.dataset.page);
        }
      });
    });
  }
}

// Enhance the filter functionality to remember the active category
function enhanceFilterMemory() {
  // Store the currently selected filter category when clicking on a project
  const projectLinks = document.querySelectorAll('.project-item a');
  
  if (projectLinks.length) {
    projectLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Find the active filter
        const activeFilterBtn = document.querySelector('[data-filter-btn].active');
        if (activeFilterBtn) {
          const activeCategory = activeFilterBtn.innerText.toLowerCase();
          // Store the active category
          localStorage.setItem('activeFilterCategory', activeCategory);
          console.log(`Stored active category: ${activeCategory}`);
        }
      });
    });
  }
}

// Store section when clicking on project links
document.addEventListener('DOMContentLoaded', function() {
  // Find all section containers
  const sectionContainers = document.querySelectorAll('[data-page]');
  
  // Process each section
  sectionContainers.forEach(section => {
    // Find all links in this section that go to other pages
    const externalLinks = section.querySelectorAll('a[href$=".html"]');
    
    // Add click handler to remember which section we're in
    externalLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Store the current section name
        localStorage.setItem('activeSection', section.dataset.page);
        
        // If in portfolio section, also store the active filter
        if (section.dataset.page === 'portfolio') {
          const activeFilterBtn = document.querySelector('[data-filter-btn].active');
          if (activeFilterBtn) {
            const activeCategory = activeFilterBtn.innerText.toLowerCase();
            localStorage.setItem('activeFilterCategory', activeCategory);
          }
        }
      });
    });
  });
});