'use strict';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if all components are loaded every 100ms
  const componentsLoaded = setInterval(function() {
    // Count how many component placeholders are still empty
    const pendingComponents = document.querySelectorAll('[data-component]:empty').length;
    
    if (pendingComponents === 0) {
      // All components are loaded, clear interval and initialize
      clearInterval(componentsLoaded);
      initializePortfolio();
    }
  }, 100);
});

// Main initialization function - only called after all components are loaded
function initializePortfolio() {
  console.log('All components loaded, initializing functionality');
  
  // Initialize sidebar
  initSidebar();
  
  // Initialize testimonials
  initTestimonials();
  
  // Initialize select and filter
  initSelectAndFilter();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize page navigation
  initNavigation();
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
function initNavigation() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");
  
  // Check if elements exist (navbar component loaded)
  if (navigationLinks.length && pages.length) {
    // Add event to all nav links
    for (let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].addEventListener("click", function() {
        for (let j = 0; j < pages.length; j++) {
          if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
            pages[j].classList.add("active");
            navigationLinks[i].classList.add("active");
            window.scrollTo(0, 0);
          } else {
            pages[j].classList.remove("active");
            navigationLinks[j].classList.remove("active");
          }
        }
      });
    }
  }
}