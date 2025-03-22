/**
 * Component Loader
 * Dynamically loads HTML components into the page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with data-component attribute
    const componentElements = document.querySelectorAll('[data-component]');
    
    // Load each component
    componentElements.forEach(function(element) {
      const componentPath = element.getAttribute('data-component');
      
      // Fetch the component HTML
      fetch(componentPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
          }
          return response.text();
        })
        .then(html => {
          // Insert the component HTML
          element.innerHTML = html;
          
          // Dispatch event when component is loaded
          element.dispatchEvent(new CustomEvent('component:loaded'));
        })
        .catch(error => {
          console.error(error);
          element.innerHTML = `<p class="error">Failed to load component</p>`;
        });
    });
  });