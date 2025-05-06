// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Initialize language
  // Use a variable accessible in loadLanguage
  const currentLanguage = "es"
  loadLanguage(currentLanguage) // Initial load

  // Initialize theme - Asegurarse de que el tema claro sea el predeterminado
  document.body.setAttribute("data-theme", "light")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  if (prefersDarkScheme.matches) {
    document.body.setAttribute("data-theme", "dark")
    document.getElementById("theme-toggle").checked = true
  }

  // Event Listeners
  setupEventListeners()

  // Setup scroll reveal observer (create the observer instance)
  setupScrollReveal()

  // Create backdrop for mobile menu
  createMenuBackdrop()

  // Setup refined carousel with persistent controls
  setupRefinedCarousel()
})

// Create backdrop element for mobile menu
function createMenuBackdrop() {
  const backdrop = document.createElement("div")
  backdrop.className = "menu-backdrop"
  document.body.appendChild(backdrop)

  // Add click event to close menu when backdrop is clicked
  backdrop.addEventListener("click", () => {
    const menuToggle = document.querySelector(".menu-toggle")
    const mainNav = document.querySelector(".main-nav")

    if (menuToggle && mainNav) {
      menuToggle.classList.remove("active")
      mainNav.classList.remove("active")
      backdrop.classList.remove("active")
      document.body.classList.remove("menu-open")
    }
  })
}

// Setup refined carousel with persistent controls
function setupRefinedCarousel() {
  const projectsSection = document.getElementById("projects")
  const carouselControls = document.querySelector(".carousel-controls")

  if (!projectsSection || !carouselControls) return

  // Function to check if projects section is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0
  }

  // Function to update controls visibility
  function updateControlsVisibility() {
    if (isElementInViewport(projectsSection)) {
      carouselControls.classList.add("visible")
    } else {
      carouselControls.classList.remove("visible")
    }
  }

  // Add scroll event listener to update controls visibility
  window.addEventListener("scroll", updateControlsVisibility, { passive: true })
  window.addEventListener("resize", updateControlsVisibility, { passive: true })

  // Initial visibility check
  updateControlsVisibility()
}

// Setup all event listeners
function setupEventListeners() {
  // Language toggle
  const languageToggle = document.getElementById("language-toggle")
  languageToggle.addEventListener("change", function () {
    const newLanguage = this.checked ? "en" : "es"
    loadLanguage(newLanguage)
  })

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  themeToggle.addEventListener("change", function () {
    document.body.setAttribute("data-theme", this.checked ? "dark" : "light")
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const mainNav = document.querySelector(".main-nav")
  const backdrop = document.querySelector(".menu-backdrop")

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    mainNav.classList.toggle("active")
    backdrop.classList.toggle("active")

    // Toggle body class for overflow control
    document.body.classList.toggle("menu-open", mainNav.classList.contains("active"))
  })

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".main-nav a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      mainNav.classList.remove("active")
      backdrop.classList.remove("active")
      document.body.classList.remove("menu-open") // Restore scrolling
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".main-nav") &&
      !event.target.closest(".menu-toggle") &&
      mainNav.classList.contains("active")
    ) {
      menuToggle.classList.remove("active")
      mainNav.classList.remove("active")
      backdrop.classList.remove("active")
      document.body.classList.remove("menu-open") // Restore scrolling
    }
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerOffset = 80 // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Add iOS-style touch feedback to education items
  const educationItems = document.querySelectorAll(".education-item")
  educationItems.forEach((item) => {
    // Add touch start event for mobile devices
    item.addEventListener(
      "touchstart",
      function () {
        this.style.transform = "scale(0.98)"
      },
      { passive: true },
    )

    // Add touch end event for mobile devices
    item.addEventListener(
      "touchend",
      function () {
        this.style.transform = ""
      },
      { passive: true },
    )

    // Reset transform on touch cancel
    item.addEventListener(
      "touchcancel",
      function () {
        this.style.transform = ""
      },
      { passive: true },
    )
  })

  // Add this at the end of the function
  // Ensure projects section is visible on mobile
  const projectsSection = document.getElementById("projects")
  const projectsLink = document.querySelector('a[href="#projects"]')

  if (projectsSection) {
    projectsSection.style.display = "block"
    projectsSection.style.visibility = "visible"
  }

  if (projectsLink) {
    projectsLink.style.display = "block"
  }
}

// Make sure all nav links are properly handled in mobile view
function checkMobileNavLinks() {
  // Get all navigation links
  const allNavLinks = document.querySelectorAll(".main-nav a")
  const mobileNav = document.querySelector(".main-nav")

  // Ensure all links are visible in mobile menu
  if (window.innerWidth <= 768) {
    allNavLinks.forEach((link) => {
      link.style.display = "block"
    })

    // Make sure projects link is visible
    const projectsLink = document.querySelector('a[href="#projects"]')
    if (projectsLink) {
      projectsLink.style.display = "block"
    }
  }
}

// Add to existing event listeners
window.addEventListener("resize", checkMobileNavLinks)
window.addEventListener("load", checkMobileNavLinks)

// Load language data and update UI with fade effect
async function loadLanguage(lang) {
  try {
    const mainContent = document.querySelector("main")
    // Add fade-out class to main content before fetching new language
    mainContent.classList.add("fade-out")

    // Wait briefly for fade-out transition to start (adjust time if needed)
    await new Promise((resolve) => setTimeout(resolve, 100)) // Shorter delay

    const response = await fetch(`${lang}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load language file: ${response.status}`)
    }

    const data = await response.json()
    updateContent(data) // Update the content with new language data
    // Update currentLanguage variable (assuming it's declared with let)
    window.currentLanguage = lang // Store language globally or pass it if needed elsewhere

    // Remove fade-out class after content is updated
    mainContent.classList.remove("fade-out")
    // The fade-in is handled by the CSS animation added dynamically below
  } catch (error) {
    console.error("Error loading language file:", error)
    // Ensure fade-out class is removed even if loading fails
    const mainContent = document.querySelector("main")
    mainContent.classList.remove("fade-out")
  }
}

// Helper function to get nested properties from an object using dot notation
function getNestedProperty(obj, path) {
  return path.split(".").reduce((prev, curr) => {
    return prev ? prev[curr] : undefined
  }, obj)
}

// Update skills list
function updateSkillsList(skills, containerId) {
  const container = document.getElementById(containerId)
  container.innerHTML = ""

  skills.forEach((skill) => {
    const li = document.createElement("li")
    li.textContent = skill
    container.appendChild(li)
  })
}

// Update experience items
function updateExperienceItems(experiences) {
  const container = document.getElementById("experience-content")
  container.innerHTML = ""

  experiences.forEach((exp) => {
    const item = document.createElement("div")
    item.className = "experience-item"

    const header = document.createElement("div")
    header.className = "experience-header"

    const title = document.createElement("h3")
    title.className = "experience-title"
    title.textContent = exp.title

    const company = document.createElement("div")
    company.className = "experience-company"
    company.textContent = exp.company

    const period = document.createElement("div")
    period.className = "experience-period"
    period.textContent = exp.period

    const location = document.createElement("div")
    location.className = "experience-location"
    location.textContent = exp.location

    header.appendChild(title)
    header.appendChild(company)
    header.appendChild(period)
    header.appendChild(location)

    const responsibilities = document.createElement("ul")
    responsibilities.className = "responsibilities-list"

    exp.responsibilities.forEach((resp) => {
      const li = document.createElement("li")
      li.textContent = resp
      responsibilities.appendChild(li)
    })

    item.appendChild(header)
    item.appendChild(responsibilities)
    container.appendChild(item)
  })
}

// Update education items
function updateEducationItems(educationItems) {
  const container = document.getElementById("education-content")
  container.innerHTML = ""

  educationItems.forEach((edu) => {
    const item = document.createElement("div")
    item.className = "education-item"

    const link = document.createElement("a")
    link.href = edu.url || "#"
    if (edu.url) {
      link.target = "_blank"
      link.rel = "noopener noreferrer"
    }

    const title = document.createElement("div")
    title.className = "education-title"
    title.textContent = edu.title

    const institution = document.createElement("div")
    institution.className = "education-institution"
    institution.textContent = edu.institution

    const type = document.createElement("div")
    type.className = "education-type"
    type.textContent = edu.type

    link.appendChild(title)
    link.appendChild(institution)
    link.appendChild(type)

    item.appendChild(link)
    container.appendChild(item)
  })

  // Add iOS-style animations to education items
  setupEducationAnimations()
}

// Setup iOS-style animations for education items
function setupEducationAnimations() {
  const educationItems = document.querySelectorAll(".education-item")

  educationItems.forEach((item) => {
    // Add hover effect with spring animation
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.02) translateY(-2px)"
    })

    item.addEventListener("mouseleave", function () {
      this.style.transform = ""
    })

    // Add click/tap effect
    item.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.98)"
    })

    item.addEventListener("mouseup", function () {
      this.style.transform = "scale(1.02) translateY(-2px)"
    })
  })
}

// Update certifications list
function updateCertificationsList(certifications) {
  const container = document.getElementById("certifications-list")
  container.innerHTML = ""

  certifications.forEach((cert) => {
    const li = document.createElement("li")
    li.textContent = cert
    container.appendChild(li)
  })
}

// Add this function after the updateCertificationsList function
// Update projects carousel
function updateProjectsCarousel(projects) {
  // Ensure projects section is visible on mobile
  const projectsSection = document.getElementById("projects")
  if (projectsSection) {
    projectsSection.style.display = "block"
    projectsSection.style.visibility = "visible"
  }

  const container = document.getElementById("projects-carousel")
  const indicators = document.getElementById("carousel-indicators")

  if (!container || !indicators) return

  container.innerHTML = ""
  indicators.innerHTML = ""

  // Create project items
  projects.forEach((project, index) => {
    const item = document.createElement("div")
    item.className = "project-item"
    item.setAttribute("data-index", index)

    // Create project card with image and content
    const card = document.createElement("div")
    card.className = "project-card"

    // Create image container
    const imageContainer = document.createElement("div")
    imageContainer.className = "project-image-container"

    // Create image element
    const image = document.createElement("img")
    image.className = "project-image"
    image.src = project.image || "/images/allpay.png" // Use provided image or default
    image.alt = project.title

    // Add error handling for image loading
    image.onerror = () => {
      console.error("Failed to load image:", image.src)
      // Try with absolute path if relative path fails
      if (!image.src.startsWith("http")) {
        image.src = window.location.origin + "/images/allpay.png"
      }
    }

    imageContainer.appendChild(image)

    // Create content container
    const content = document.createElement("div")
    content.className = "project-content"

    const header = document.createElement("div")
    header.className = "project-header"

    const title = document.createElement("h3")
    title.className = "project-title"
    title.textContent = project.title

    const description = document.createElement("p")
    description.className = "project-description"
    description.textContent = project.description

    // Create buttons container
    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "project-buttons"
    buttonsContainer.style.display = "flex"
    buttonsContainer.style.gap = "10px"
    buttonsContainer.style.marginTop = "10px"

    // Create project link button
    const projectLink = document.createElement("a")
    projectLink.className = "project-link"
    projectLink.href = project.url
    projectLink.target = "_blank"
    projectLink.rel = "noopener noreferrer"
    projectLink.textContent = project.linkText

    // Create GitHub link button
    const githubLink = document.createElement("a")
    githubLink.className = "project-link"
    githubLink.style.backgroundColor = "#333"
    githubLink.href = project.githubUrl || "https://github.com/Samuelheros"
    githubLink.target = "_blank"
    githubLink.rel = "noopener noreferrer"
    githubLink.textContent = "GitHub"

    // Add buttons to container
    buttonsContainer.appendChild(projectLink)
    buttonsContainer.appendChild(githubLink)

    header.appendChild(title)
    content.appendChild(header)
    content.appendChild(description)
    content.appendChild(buttonsContainer)

    // Add image and content to card
    card.appendChild(imageContainer)
    card.appendChild(content)

    // Add card to item
    item.appendChild(card)
    container.appendChild(item)

    // Create indicator
    const indicator = document.createElement("div")
    indicator.className = "indicator" + (index === 0 ? " active" : "")
    indicator.setAttribute("data-index", index)
    indicator.setAttribute("role", "button")
    indicator.setAttribute("aria-label", `Go to project ${index + 1}`)
    indicator.setAttribute("tabindex", "0")
    indicators.appendChild(indicator)
  })

  // Initialize carousel
  initCarousel()
}

// Add this function after the updateProjectsCarousel function
// Initialize carousel functionality
function initCarousel() {
  const container = document.getElementById("projects-carousel")
  if (!container) return

  const projectItems = container.querySelectorAll(".project-item")
  const indicators = document.querySelectorAll(".indicator")
  const prevBtn = document.getElementById("prev-project")
  const nextBtn = document.getElementById("next-project")

  if (!indicators.length || !prevBtn || !nextBtn) return

  // Ensure carousel is properly initialized for mobile
  function adjustCarouselForMobile() {
    if (!container) return

    if (window.innerWidth <= 768) {
      // Mobile setup
      container.style.transform = "none" // Reset any transform

      // Make sure all project items are visible and properly sized
      projectItems.forEach((item) => {
        item.style.minWidth = "100%"
        item.style.width = "100%"
      })

      // Setup touch-based carousel for mobile
      setupTouchCarousel()
    } else {
      // Desktop setup - use transform-based navigation
      setupDesktopCarousel()
    }
  }

  // New function to handle desktop carousel separately
  function setupDesktopCarousel() {
    let currentIndex = 0
    const totalProjects = projectItems.length

    // Update carousel position
    function updateCarousel() {
      if (!container) return

      container.style.transform = `translateX(-${currentIndex * 100}%)`

      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex)
        indicator.setAttribute("aria-current", index === currentIndex ? "true" : "false")
      })
    }

    // Event listeners for controls
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalProjects) % totalProjects
      updateCarousel()
    })

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalProjects
      updateCarousel()
    })

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentIndex = index
        updateCarousel()
      })

      // Keyboard support for indicators
      indicator.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          currentIndex = index
          updateCarousel()
        }
      })
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.closest("#projects")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          currentIndex = (currentIndex - 1 + totalProjects) % totalProjects
          updateCarousel()
        } else if (e.key === "ArrowRight") {
          e.preventDefault()
          currentIndex = (currentIndex + 1) % totalProjects
          updateCarousel()
        }
      }
    })

    // Initialize position
    updateCarousel()
  }

  // Call this function on window resize with debounce
  let resizeTimeout
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(adjustCarouselForMobile, 100)
  })

  // Initial setup
  adjustCarouselForMobile()

  // Add to scroll reveal
  if (window.scrollRevealObserver) {
    projectItems.forEach((item) => {
      item.classList.add("scroll-reveal")
      window.scrollRevealObserver.observe(item)
    })
  }
}

// Update the setupTouchCarousel function to fix the indicator synchronization issues
function setupTouchCarousel() {
  const container = document.getElementById("projects-carousel")
  const indicators = document.querySelectorAll(".indicator")
  const prevBtn = document.getElementById("prev-project")
  const nextBtn = document.getElementById("next-project")

  if (!container || !indicators.length) return

  let currentIndex = 0
  const projectItems = container.querySelectorAll(".project-item")
  const totalProjects = projectItems.length

  // More reliable method to update indicators based on scroll position
  function updateIndicators() {
    if (!container) return

    // Calculate which project is most visible
    const containerWidth = container.clientWidth
    const scrollPosition = container.scrollLeft

    // Use a more precise calculation with threshold
    const scrollRatio = scrollPosition / containerWidth
    currentIndex = Math.round(scrollRatio)

    // Ensure currentIndex is within bounds
    currentIndex = Math.max(0, Math.min(currentIndex, totalProjects - 1))

    // Update indicators with a clear active state
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex)
      indicator.setAttribute("aria-current", index === currentIndex ? "true" : "false")
    })
  }

  // Improved scroll event with better throttling
  let scrollTimeout
  container.addEventListener(
    "scroll",
    () => {
      // Clear previous timeout to prevent multiple rapid updates
      clearTimeout(scrollTimeout)

      // Set a new timeout for better performance
      scrollTimeout = setTimeout(() => {
        updateIndicators()
      }, 50)
    },
    { passive: true },
  )

  // Enhanced touch event listeners for iOS-style interaction
  let startX,
    startScrollLeft,
    isDragging = false

  container.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX
      startScrollLeft = container.scrollLeft
      isDragging = true
      container.style.scrollBehavior = "auto" // Disable smooth scrolling during touch
    },
    { passive: true },
  )

  container.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return
      // No need to manually adjust scroll position - let native scrolling handle it
    },
    { passive: true },
  )

  container.addEventListener(
    "touchend",
    () => {
      if (!isDragging) return

      isDragging = false
      container.style.scrollBehavior = "smooth" // Re-enable smooth scrolling

      // Snap to nearest project with improved calculation
      const containerWidth = container.clientWidth
      const scrollPosition = container.scrollLeft
      const targetIndex = Math.round(scrollPosition / containerWidth)

      // Ensure targetIndex is within bounds
      const safeTargetIndex = Math.max(0, Math.min(targetIndex, totalProjects - 1))

      // Scroll to the target project
      container.scrollTo({
        left: safeTargetIndex * containerWidth,
        behavior: "smooth",
      })

      // Update current index and indicators after scrolling completes
      setTimeout(() => {
        currentIndex = safeTargetIndex
        updateIndicators()
      }, 300) // Wait for scroll animation to complete
    },
    { passive: true },
  )

  // Improved button handlers with better boundary checks
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1)
      scrollToProject(currentIndex)
    })

    nextBtn.addEventListener("click", () => {
      currentIndex = Math.min(totalProjects - 1, currentIndex + 1)
      scrollToProject(currentIndex)
    })
  }

  // Enhanced indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentIndex = index
      scrollToProject(currentIndex)
    })

    // Add keyboard support for indicators
    indicator.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        currentIndex = index
        scrollToProject(currentIndex)
      }
    })
  })

  // Improved scrollToProject function with error handling
  function scrollToProject(index) {
    if (!container) return

    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(index, totalProjects - 1))
    const containerWidth = container.clientWidth

    // Scroll with smooth behavior
    container.scrollTo({
      left: safeIndex * containerWidth,
      behavior: "smooth",
    })

    // Update indicators after scrolling completes
    setTimeout(() => {
      updateIndicators()
    }, 300)
  }

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (document.activeElement.closest("#projects")) {
      if (e.key === "ArrowLeft" && prevBtn) {
        e.preventDefault()
        prevBtn.click()
      } else if (e.key === "ArrowRight" && nextBtn) {
        e.preventDefault()
        nextBtn.click()
      }
    }
  })

  // Add window resize handler to recalculate positions
  window.addEventListener("resize", () => {
    // Recalculate and scroll to current project after resize
    setTimeout(() => {
      scrollToProject(currentIndex)
    }, 100)
  })

  // Initial update to ensure indicators match initial position
  setTimeout(updateIndicators, 100)
}

// Add this function after the setupTouchCarousel function
function setupPersistentControls() {
  const projectsSection = document.getElementById("projects")
  const carouselControls = document.querySelector(".carousel-controls")

  if (!projectsSection || !carouselControls) return

  // Store original position
  const originalRect = carouselControls.getBoundingClientRect()
  const originalTop = originalRect.top
  let isSticky = false
  let controlsContainer = null

  // Create a wrapper for the controls when they become fixed
  function createControlsContainer() {
    if (controlsContainer) return controlsContainer

    controlsContainer = document.createElement("div")
    controlsContainer.className = "fixed-controls-container"
    controlsContainer.style.position = "fixed"
    controlsContainer.style.bottom = "20px"
    controlsContainer.style.left = "0"
    controlsContainer.style.width = "100%"
    controlsContainer.style.display = "flex"
    controlsContainer.style.justifyContent = "center"
    controlsContainer.style.zIndex = "100"
    controlsContainer.style.pointerEvents = "none"
    controlsContainer.style.opacity = "0"
    controlsContainer.style.transition = "opacity 0.3s ease"

    document.body.appendChild(controlsContainer)
    return controlsContainer
  }

  // Function to check if controls should be fixed
  function updateControlsVisibility() {
    const projectsRect = projectsSection.getBoundingClientRect()
    const controlsRect = carouselControls.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Check if projects section is visible and controls would be out of view
    const projectsVisible = projectsRect.top < windowHeight && projectsRect.bottom > 0
    const controlsOutOfView = controlsRect.bottom > windowHeight || controlsRect.top < 0

    if (projectsVisible) {
      if (!controlsContainer) {
        controlsContainer = createControlsContainer()

        // Clone the controls for the fixed container
        const clonedControls = carouselControls.cloneNode(true)
        clonedControls.style.position = "static"
        clonedControls.style.pointerEvents = "auto"
        controlsContainer.appendChild(clonedControls)

        // Add event listeners to cloned controls
        const prevBtn = clonedControls.querySelector("#prev-project")
        const nextBtn = clonedControls.querySelector("#next-project")
        const indicators = clonedControls.querySelectorAll(".indicator")

        if (prevBtn && nextBtn) {
          prevBtn.addEventListener("click", () => {
            const originalPrev = document.getElementById("prev-project")
            if (originalPrev) originalPrev.click()
          })

          nextBtn.addEventListener("click", () => {
            const originalNext = document.getElementById("next-project")
            if (originalNext) originalNext.click()
          })
        }

        indicators.forEach((indicator, index) => {
          indicator.addEventListener("click", () => {
            const originalIndicators = document.querySelectorAll(".carousel-indicators .indicator")
            if (originalIndicators[index]) originalIndicators[index].click()
          })
        })
      }

      // Show fixed controls when original controls are out of view
      if (controlsOutOfView && projectsRect.bottom > 100) {
        controlsContainer.style.opacity = "1"
        isSticky = true
      } else {
        controlsContainer.style.opacity = "0"
        isSticky = false
      }
    } else if (controlsContainer) {
      controlsContainer.style.opacity = "0"
      isSticky = false
    }
  }

  // Listen for scroll events
  let scrollTimeout
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      scrollTimeout = setTimeout(() => {
        updateControlsVisibility()
      }, 10) // Small timeout for better performance
    },
    { passive: true },
  )

  // Listen for resize events
  let resizeTimeout
  window.addEventListener("resize", () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(() => {
      updateControlsVisibility()
    }, 100)
  })

  // Initial check
  setTimeout(updateControlsVisibility, 500)
}

// --- Scroll Reveal and Language Fade Functionality ---

// Update all content with the selected language
function updateContent(data) {
  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n")
    const value = getNestedProperty(data, key)

    if (value !== undefined) {
      element.textContent = value // This sets the text
    }
  })

  // Update specific lists/sections
  updateSkillsList(data.skills.technical.items, "technical-skills")
  updateSkillsList(data.skills.soft.items, "soft-skills")
  updateExperienceItems(data.experience.items)
  updateEducationItems(data.education.items)
  updateCertificationsList(data.certifications.items)
  // Add this line to update projects
  updateProjectsCarousel(data.projects.items)
  preloadProjectImages(data.projects.items)

  // --- Apply scroll reveal *after* content is fully updated ---
  // Find elements to animate (ensure they exist after update)
  const elementsToAnimate = document.querySelectorAll(
    "#about .section-content, " +
      "#skills .skills-group, " +
      "#experience .experience-item, " +
      "#education .education-item, " +
      "#certifications .certifications-list li, " +
      "#projects .project-item, " +
      "#contact .contact-links a",
  )

  // Remove existing scroll-reveal and is-visible classes before re-adding
  // This is important when language changes and content is replaced
  document.querySelectorAll(".scroll-reveal").forEach((element) => {
    element.classList.remove("scroll-reveal", "is-visible")
  })

  // Add scroll-reveal class to the elements
  elementsToAnimate.forEach((element) => {
    element.classList.add("scroll-reveal")
  })

  // Observe the elements for the scroll animation
  // Ensure the observer is ready (created in DOMContentLoaded)
  if (window.scrollRevealObserver) {
    elementsToAnimate.forEach((element) => {
      // Start observing only if not already visible (for elements initially in view)
      if (!element.classList.contains("is-visible")) {
        window.scrollRevealObserver.observe(element)
      }
    })
  } else {
    console.error("IntersectionObserver not initialized.")
  }
}

// Setup IntersectionObserver for scroll reveal
function setupScrollReveal() {
  const options = {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  }

  // Create a single observer instance and store it globally
  window.scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible")
        // Stop observing once the element is visible
        observer.unobserve(entry.target)
      }
    })
  }, options)

  // The initial observation will happen within updateContent after the first language load
}

// Add CSS for fade transition dynamically
const style = document.createElement("style")
style.innerHTML = `
  main.fade-out {
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }
  /* Reuse the existing fade-in keyframes from style-fixed.css */
  /*
  main.fade-in {
    animation: fadeIn 0.5s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  */
`
document.head.appendChild(style)

// Add error handling for image loading
function preloadProjectImages(projects) {
  if (!projects || !Array.isArray(projects)) return

  projects.forEach((project) => {
    if (project.image) {
      const img = new Image()
      img.src = project.image
      img.onerror = () => {
        console.error("Failed to preload image:", img.src)
        // Try with absolute path if relative path fails
        if (!img.src.startsWith("http")) {
          img.src = window.location.origin + project.image
        }
      }
    }
  })
}
