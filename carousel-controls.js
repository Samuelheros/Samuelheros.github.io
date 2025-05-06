// Floating Carousel Controls for Mobile
document.addEventListener("DOMContentLoaded", () => {
  // Create floating carousel controls
  createFloatingCarouselControls();

  // Initialize intersection observer for projects section
  initProjectsObserver();
});

// Create floating carousel controls
function createFloatingCarouselControls() {
  // Create the floating controls container
  const floatingControls = document.createElement("div");
  floatingControls.className = "floating-carousel-controls";

  // Create previous button
  const prevBtn = document.createElement("button");
  prevBtn.id = "floating-prev-project";
  prevBtn.className = "carousel-control";
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

  // Create next button
  const nextBtn = document.createElement("button");
  nextBtn.id = "floating-next-project";
  nextBtn.className = "carousel-control";
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

  // Add buttons to container
  floatingControls.appendChild(prevBtn);
  floatingControls.appendChild(nextBtn);

  // Add container to body
  document.body.appendChild(floatingControls);

  // Add event listeners
  setupFloatingControlsEvents(prevBtn, nextBtn);
}

// Setup event listeners for floating controls
function setupFloatingControlsEvents(prevBtn, nextBtn) {
  const container = document.getElementById("projects-carousel");

  if (!container) return;

  const projectItems = container.querySelectorAll(".project-item");
  const totalProjects = projectItems.length;

  // Get current index from container or set to 0
  let currentIndex = 0;
  if (container.style.transform) {
    const transformValue = container.style.transform;
    const match = transformValue.match(/translateX$$-(\d+)%$$/);
    if (match && match[1]) {
      currentIndex = Number.parseInt(match[1]) / 100;
    }
  }

  // Previous button click
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
    updateCarouselPosition(container, currentIndex);
    updateIndicators(currentIndex);
  });

  // Next button click
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalProjects;
    updateCarouselPosition(container, currentIndex);
    updateIndicators(currentIndex);
  });
}

// Update carousel position
function updateCarouselPosition(container, index) {
  container.style.transform = `translateX(-${index * 100}%)`;
}

// Update indicators
function updateIndicators(currentIndex) {
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentIndex);
  });
}

// Initialize intersection observer for projects section
function initProjectsObserver() {
  const projectsSection = document.getElementById("projects");
  const floatingControls = document.querySelector(".floating-carousel-controls");

  if (!projectsSection || !floatingControls) return;

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        floatingControls.classList.add("visible");
      } else {
        floatingControls.classList.remove("visible");
      }
    });
  }, options);

  observer.observe(projectsSection);
}

// Add touch swipe functionality for mobile carousel
document.addEventListener("DOMContentLoaded", () => {
  // Add swipe functionality after other carousel functions are initialized
  setTimeout(() => {
    addSwipeSupport();
  }, 500);
});

function addSwipeSupport() {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return;

  let touchStartX = 0;
  let touchStartY = 0; // Añadido para detectar dirección vertical
  let touchEndX = 0;
  let isSwiping = false;
  let originalTransform = '';
  let currentTranslateX = 0;
  let isScrollingVertically = false; // Para detectar scroll vertical
  let isScrollingHorizontally = false; // Para detectar scroll horizontal
  
  // Get total number of projects
  const projectItems = carousel.querySelectorAll(".project-item");
  const totalProjects = projectItems.length;
  
  // Get current index from transform or set to 0
  let currentIndex = 0;
  if (carousel.style.transform) {
    const transformValue = carousel.style.transform;
    const match = transformValue.match(/translateX$$-(\d+)%$$/);
    if (match && match[1]) {
      currentIndex = Number.parseInt(match[1]) / 100;
    }
  }

  // Touch start event
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY; // Guardar posición Y inicial
    isSwiping = true;
    originalTransform = carousel.style.transform || 'translateX(0%)';
    
    // Extract current translateX value
    const match = originalTransform.match(/translateX$$-?(\d+(?:\.\d+)?)%$$/);
    currentTranslateX = match ? -parseFloat(match[1]) : 0;
    
    // Resetear las banderas de dirección
    isScrollingVertically = false;
    isScrollingHorizontally = false;
  }, { passive: true }); // Cambiar a passive: true para mejorar rendimiento

  // Touch move event - for visual feedback during swipe
  carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;
    
    // Si aún no hemos determinado la dirección del desplazamiento
    if (!isScrollingVertically && !isScrollingHorizontally) {
      // Determinar si el desplazamiento es más horizontal o vertical
      // Usamos un umbral de 5px para evitar detecciones accidentales
      if (Math.abs(diffX) > Math.abs(diffY) + 5) {
        isScrollingHorizontally = true;
        e.preventDefault(); // Prevenir el scroll de la página solo para scroll horizontal
      } else if (Math.abs(diffY) > Math.abs(diffX) + 5) {
        isScrollingVertically = true;
        return; // Permitir el scroll vertical de la página
      }
    }
    
    // Si estamos desplazándonos horizontalmente, mover el carrusel
    if (isScrollingHorizontally) {
      // Calculate how much to move (as a percentage of container width)
      const movePercentage = (diffX / carousel.offsetWidth) * 100;
      
      // Apply transform with boundaries to prevent excessive swiping
      const newTranslateX = Math.max(
        -((totalProjects - 1) * 100), 
        Math.min(0, currentTranslateX + movePercentage)
      );
      
      carousel.style.transform = `translateX(${newTranslateX}%)`;
      e.preventDefault(); // Prevenir el scroll de la página
    }
  }, { passive: false }); // Necesitamos passive: false para poder llamar a preventDefault()

  // Touch end event
  carousel.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    
    touchEndX = e.changedTouches[0].clientX;
    isSwiping = false;
    
    // Solo procesar el final del swipe si estábamos desplazándonos horizontalmente
    if (isScrollingHorizontally) {
      const diffX = touchEndX - touchStartX;
      
      // Determine if swipe was significant enough to change slide
      // (at least 15% of container width)
      const threshold = carousel.offsetWidth * 0.15;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swiped right - go to previous slide
          currentIndex = Math.max(0, currentIndex - 1);
        } else {
          // Swiped left - go to next slide
          currentIndex = Math.min(totalProjects - 1, currentIndex + 1);
        }
      }
      
      // Apply final transform with animation
      carousel.style.transition = 'transform 0.3s ease';
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update indicators
      updateIndicators(currentIndex);
      
      // Reset transition after animation completes
      setTimeout(() => {
        carousel.style.transition = '';
      }, 300);
    }
    
    // Resetear las banderas de dirección después de un breve retraso
    setTimeout(() => {
      isScrollingHorizontally = false;
      isScrollingVertically = false;
    }, 100);
  }, { passive: true });

  // Cancel swipe on touch cancel
  carousel.addEventListener("touchcancel", () => {
    if (!isSwiping) return;
    
    isSwiping = false;
    isScrollingHorizontally = false;
    isScrollingVertically = false;
    
    // Restore original position with animation
    carousel.style.transition = 'transform 0.3s ease';
    carousel.style.transform = originalTransform;
    
    // Reset transition after animation completes
    setTimeout(() => {
      carousel.style.transition = '';
    }, 300);
  }, { passive: true });
}