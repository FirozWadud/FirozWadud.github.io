/**
 * Project Popup Handler
 * Controls the display and interaction with project detail popups
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get references to popup elements
    const projectPopup = document.getElementById('projectPopup');
    const modalOverlay = document.getElementById('modalOverlay');
    const closePopupBtn = document.getElementById('closePopupBtn');
    
    // Show popup function
    function showPopup() {
      modalOverlay.style.display = 'block';
      projectPopup.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Hide popup function
    function hidePopup(callback) {
      modalOverlay.style.display = 'none';
      projectPopup.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
      
      // Execute callback if provided
      if (typeof callback === 'function') {
        callback();
      }
    }
    
    // Only show automatically if this is not loaded in an iframe
    if (window.self === window.top) {
      showPopup();
    }
    
    // Setup close button functionality
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function() {
        // If standalone page, redirect to portfolio section
        if (window.self === window.top) {
          hidePopup(function() {
            window.location.href = '../index.html#portfolio';
          });
        } else {
          // Just hide the popup if in iframe
          hidePopup();
        }
      });
    }
    
    // Close when clicking on overlay - same behavior
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function() {
        if (window.self === window.top) {
          hidePopup(function() {
            window.location.href = '../index.html#portfolio';
          });
        } else {
          hidePopup();
        }
      });
    }
    
    // Smooth scrolling for table of contents links
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const popupContent = document.querySelector('.popup-content');
          const targetPosition = targetElement.offsetTop - 20;
          
          popupContent.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  });