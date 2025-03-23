/**
 * STORYTELLING.JS
 * Handles interactive elements and animations for the storytelling page layout
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the storytelling experience
    initStoryExperience();
  });
  
  function initStoryExperience() {
    // Initialize all components of the story experience
    setupIntroAnimation();
    setupChapterNavigation();
    setupParallaxEffects();
    setupScrollReveal();
    setupInteractiveElements();
    setupGallery();
    setupBackToTop();
    setupLoadingIndicator();
  }
  
  // Intro animation that plays before revealing the main content
  function setupIntroAnimation() {
    const introAnimation = document.querySelector('.intro-animation');
    const startButton = document.querySelector('.intro-btn');
    
    if (!introAnimation || !startButton) return;
    
    // Hide the main content until the intro is dismissed
    document.querySelector('.story-container').style.display = 'none';
    
    // Start button click handler
    startButton.addEventListener('click', function() {
      introAnimation.style.opacity = '0';
      
      // After animation completes, hide intro and show content
      setTimeout(() => {
        introAnimation.style.display = 'none';
        document.querySelector('.story-container').style.display = 'block';
        
        // Trigger initial animations
        document.querySelector('.story-chapter').classList.add('chapter-active');
      }, 1000);
    });
  }
  
  // Set up navigation between chapters
  function setupChapterNavigation() {
    const chapters = document.querySelectorAll('.story-chapter');
    const progressContainer = document.querySelector('.story-progress');
    const storyScroll = document.querySelector('.story-scroll');
    const prevButton = document.querySelector('.prev-chapter');
    const nextButton = document.querySelector('.next-chapter');
    
    if (!chapters.length || !storyScroll) return;
    
    // Create progress indicators if container exists
    if (progressContainer) {
      chapters.forEach((chapter, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (index === 0) dot.classList.add('active');
        
        const label = document.createElement('span');
        label.className = 'progress-label';
        label.textContent = chapter.getAttribute('data-title') || `Chapter ${index + 1}`;
        
        dot.appendChild(label);
        dot.addEventListener('click', () => scrollToChapter(index));
        
        progressContainer.appendChild(dot);
      });
    }
    
    // Set up prev/next navigation buttons
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const activeIndex = getCurrentChapterIndex();
        if (activeIndex > 0) {
          scrollToChapter(activeIndex - 1);
        }
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const activeIndex = getCurrentChapterIndex();
        if (activeIndex < chapters.length - 1) {
          scrollToChapter(activeIndex + 1);
        }
      });
    }
    
    // Handle scroll events to update active chapter
    storyScroll.addEventListener('scroll', debounce(updateActiveChapter, 50));
    
    // Initial update
    updateActiveChapter();
    
    // Function to find current chapter index
    function getCurrentChapterIndex() {
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].classList.contains('chapter-active')) {
          return i;
        }
      }
      return 0;
    }
    
    // Function to scroll to specific chapter
    function scrollToChapter(index) {
      if (index >= 0 && index < chapters.length) {
        chapters[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Update which chapter is active based on scroll position
    function updateActiveChapter() {
      const scrollPosition = storyScroll.scrollTop;
      const windowHeight = window.innerHeight;
      
      let activeIndex = 0;
      
      // Find which chapter is most visible
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const chapterTop = rect.top + scrollPosition - storyScroll.offsetTop;
        const chapterBottom = chapterTop + rect.height;
        
        // Check if chapter is in view
        if (
          (scrollPosition >= chapterTop - windowHeight / 2) && 
          (scrollPosition < chapterBottom - windowHeight / 3)
        ) {
          activeIndex = index;
        }
      });
      
      // Update active states
      chapters.forEach((chapter, index) => {
        if (index === activeIndex) {
          chapter.classList.add('chapter-active');
        } else {
          chapter.classList.remove('chapter-active');
        }
      });
      
      // Update progress indicators
      const progressDots = document.querySelectorAll('.progress-dot');
      progressDots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Update navigation button states
      if (prevButton) {
        prevButton.disabled = activeIndex === 0;
        prevButton.style.opacity = activeIndex === 0 ? '0.5' : '1';
      }
      
      if (nextButton) {
        nextButton.disabled = activeIndex === chapters.length - 1;
        nextButton.style.opacity = activeIndex === chapters.length - 1 ? '0.5' : '1';
      }
    }
  }
  
  // Create parallax scrolling effects
  function setupParallaxEffects() {
    const storyScroll = document.querySelector('.story-scroll');
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (!storyScroll || !parallaxElements.length) return;
    
    storyScroll.addEventListener('scroll', () => {
      const scrollTop = storyScroll.scrollTop;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
  
  // Set up reveal animations on scroll
  function setupScrollReveal() {
    const storyScroll = document.querySelector('.story-scroll');
    const revealElements = document.querySelectorAll('.reveal-element');
    const specItems = document.querySelectorAll('.spec-item');
    
    if (!storyScroll) return;
    
    // Check which elements should be revealed on scroll
    function checkReveal() {
      const triggerBottom = window.innerHeight * 0.8;
      
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
          element.classList.add('revealed');
        }
      });
      
      specItems.forEach((item, index) => {
        const itemTop = item.getBoundingClientRect().top;
        
        if (itemTop < triggerBottom) {
          // Stagger the animations
          setTimeout(() => {
            item.classList.add('reveal');
          }, index * 100);
        }
      });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    storyScroll.addEventListener('scroll', debounce(checkReveal, 50));
  }
  
  // Set up expandable/collapsible content sections
  function setupInteractiveElements() {
    const interactiveElements = document.querySelectorAll('.interactive-element');
    
    interactiveElements.forEach(element => {
      const title = element.querySelector('.interactive-title');
      
      if (title) {
        title.addEventListener('click', () => {
          element.classList.toggle('open');
        });
      }
    });
  }
  
  // Set up image gallery with lightbox
  function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    
    // Create modal for fullscreen images if it doesn't exist
    let modal = document.querySelector('.gallery-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'gallery-modal';
      modal.innerHTML = `
        <div class="modal-close">
          <ion-icon name="close-outline"></ion-icon>
        </div>
        <div class="modal-content">
          <img class="modal-img" src="" alt="">
          <div class="modal-caption"></div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Close modal when clicking outside the image
      modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.closest('.modal-close')) {
          modal.classList.remove('open');
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          modal.classList.remove('open');
        }
      });
    }
    
    const modalImg = modal.querySelector('.modal-img');
    const modalCaption = modal.querySelector('.modal-caption');
    
    // Add click handlers to gallery items
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const caption = item.getAttribute('data-caption') || '';
        
        modalImg.src = imgSrc;
        modalCaption.textContent = caption;
        modal.classList.add('open');
      });
    });
  }
  
  // Set up a back to top button
  function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    const storyScroll = document.querySelector('.story-scroll');
    
    if (!backToTopBtn || !storyScroll) return;
    
    storyScroll.addEventListener('scroll', () => {
      if (storyScroll.scrollTop > window.innerHeight) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      storyScroll.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Loading indicator at top of page
  function setupLoadingIndicator() {
    const loadingBar = document.querySelector('.loading-bar');
    const storyScroll = document.querySelector('.story-scroll');
    
    if (!loadingBar || !storyScroll) return;
    
    storyScroll.addEventListener('scroll', () => {
      // Calculate scroll percentage
      const scrollHeight = storyScroll.scrollHeight - storyScroll.clientHeight;
      const scrollPercent = (storyScroll.scrollTop / scrollHeight) * 100;
      
      // Update loading bar width
      loadingBar.style.width = `${scrollPercent}%`;
    });
  }
  
  // Utility function to debounce scroll events
  function debounce(func, wait) {
    let timeout;
    
    return function() {
      const context = this;
      const args = arguments;
      
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }