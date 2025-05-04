// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Initialize language
  // Use a variable accessible in loadLanguage
  let currentLanguage = "es";
  loadLanguage(currentLanguage); // Initial load

  // Initialize theme - Asegurarse de que el tema claro sea el predeterminado
  document.body.setAttribute("data-theme", "light")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  if (prefersDarkScheme.matches) {
    document.body.setAttribute("data-theme", "dark")
    document.getElementById("theme-toggle").checked = true
  }

  // Event Listeners
  setupEventListeners();

  // Setup scroll reveal observer (create the observer instance)
  setupScrollReveal();

});

// Setup all event listeners
function setupEventListeners() {
  // Language toggle
  const languageToggle = document.getElementById("language-toggle");
  languageToggle.addEventListener("change", function () {
    const newLanguage = this.checked ? "en" : "es";
    loadLanguage(newLanguage);
  });

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("change", function () {
    document.body.setAttribute("data-theme", this.checked ? "dark" : "light");
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    mainNav.classList.toggle("active");

    // Toggle body class for overflow control
    document.body.classList.toggle("menu-open", mainNav.classList.contains("active"));
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.classList.remove("menu-open"); // Restore scrolling
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".main-nav") &&
      !event.target.closest(".menu-toggle") &&
      mainNav.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      document.body.classList.remove("menu-open"); // Restore scrolling
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Load language data and update UI with fade effect
async function loadLanguage(lang) {
  try {
    const mainContent = document.querySelector('main');
    // Add fade-out class to main content before fetching new language
    mainContent.classList.add('fade-out');

    // Wait briefly for fade-out transition to start (adjust time if needed)
    await new Promise(resolve => setTimeout(resolve, 100)); // Shorter delay

    const response = await fetch(`${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load language file: ${response.status}`);
    }

    const data = await response.json();
    updateContent(data); // Update the content with new language data
    // Update currentLanguage variable (assuming it's declared with let)
    window.currentLanguage = lang; // Store language globally or pass it if needed elsewhere

    // Remove fade-out class after content is updated
    mainContent.classList.remove('fade-out');
    // The fade-in is handled by the CSS animation added dynamically below

  } catch (error) {
    console.error("Error loading language file:", error);
     // Ensure fade-out class is removed even if loading fails
     const mainContent = document.querySelector('main');
     mainContent.classList.remove('fade-out');
  }
}

// Helper function to get nested properties from an object using dot notation
function getNestedProperty(obj, path) {
  return path.split(".").reduce((prev, curr) => {
    return prev ? prev[curr] : undefined;
  }, obj);
}

// Update skills list
function updateSkillsList(skills, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill;
    container.appendChild(li);
  });
}

// Update experience items
function updateExperienceItems(experiences) {
  const container = document.getElementById("experience-content");
  container.innerHTML = "";

  experiences.forEach((exp) => {
    const item = document.createElement("div");
    item.className = "experience-item";

    const header = document.createElement("div");
    header.className = "experience-header";

    const title = document.createElement("h3");
    title.className = "experience-title";
    title.textContent = exp.title;

    const company = document.createElement("div");
    company.className = "experience-company";
    company.textContent = exp.company;

    const period = document.createElement("div");
    period.className = "experience-period";
    period.textContent = exp.period;

    const location = document.createElement("div");
    location.className = "experience-location";
    location.textContent = exp.location;

    header.appendChild(title);
    header.appendChild(company);
    header.appendChild(period);
    header.appendChild(location);

    const responsibilities = document.createElement("ul");
    responsibilities.className = "responsibilities-list";

    exp.responsibilities.forEach((resp) => {
      const li = document.createElement("li");
      li.textContent = resp;
      responsibilities.appendChild(li);
    });

    item.appendChild(header);
    item.appendChild(responsibilities);
    container.appendChild(item);
  });
}

// Update education items
function updateEducationItems(educationItems) {
  const container = document.getElementById("education-content");
  container.innerHTML = "";

  educationItems.forEach((edu) => {
    const item = document.createElement("div");
    item.className = "education-item";

    const link = document.createElement("a");
    link.href = edu.url || "#";
    if (edu.url) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const title = document.createElement("div");
    title.className = "education-title";
    title.textContent = edu.title;

    const institution = document.createElement("div");
    institution.className = "education-institution";
    institution.textContent = edu.institution;

    const type = document.createElement("div");
    type.className = "education-type";
    type.textContent = edu.type;

    link.appendChild(title);
    link.appendChild(institution);
    link.appendChild(type);

    item.appendChild(link);
    container.appendChild(item);
  });
}

// Update certifications list
function updateCertificationsList(certifications) {
  const container = document.getElementById("certifications-list");
  container.innerHTML = "";

  certifications.forEach((cert) => {
    const li = document.createElement("li");
    li.textContent = cert;
    container.appendChild(li);
  });
}


// --- Scroll Reveal and Language Fade Functionality ---

// Update all content with the selected language
function updateContent(data) {
    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const value = getNestedProperty(data, key);

        if (value !== undefined) {
            element.textContent = value; // This sets the text
        }
    });

    // Update specific lists/sections
    updateSkillsList(data.skills.technical.items, "technical-skills");
    updateSkillsList(data.skills.soft.items, "soft-skills");
    updateExperienceItems(data.experience.items);
    updateEducationItems(data.education.items);
    updateCertificationsList(data.certifications.items);

    // --- Apply scroll reveal *after* content is fully updated ---
    // Find elements to animate (ensure they exist after update)
    const elementsToAnimate = document.querySelectorAll(
        '#about .section-content, ' +
        '#skills .skills-group, ' +
        '#experience .experience-item, ' +
        '#education .education-item, ' +
        '#certifications .certifications-list li, ' +
        '#contact .contact-links a'
    );

    // Remove existing scroll-reveal and is-visible classes before re-adding
    // This is important when language changes and content is replaced
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        element.classList.remove('scroll-reveal', 'is-visible');
    });


    // Add scroll-reveal class to the elements
     elementsToAnimate.forEach(element => {
        element.classList.add('scroll-reveal');
    });

    // Observe the elements for the scroll animation
    // Ensure the observer is ready (created in DOMContentLoaded)
    if (window.scrollRevealObserver) {
         elementsToAnimate.forEach(element => {
            // Start observing only if not already visible (for elements initially in view)
             if (!element.classList.contains('is-visible')) {
                 window.scrollRevealObserver.observe(element);
             }
         });
    } else {
        console.error("IntersectionObserver not initialized.");
    }
}


// Setup IntersectionObserver for scroll reveal
function setupScrollReveal() {
    const options = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // Create a single observer instance and store it globally
    window.scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once the element is visible
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // The initial observation will happen within updateContent after the first language load
}


// Add CSS for fade transition dynamically
const style = document.createElement('style');
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
`;
document.head.appendChild(style);