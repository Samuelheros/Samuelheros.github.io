// Cargar datos de idioma
let currentLanguage = "es" // Idioma por defecto
let languageData = {}

// Elementos del sidebar
const menuButton = document.getElementById("menu-button")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebar-overlay")
const closeSidebarButton = document.getElementById("close-sidebar")
const mobileNavMenu = document.getElementById("mobile-nav-menu")

// Función para cargar los datos del idioma
async function loadLanguageData(lang) {
  try {
    const response = await fetch(`${lang}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    languageData = data
    updateContent()
  } catch (error) {
    console.error("Error cargando datos de idioma:", error)
  }
}

// Función para abrir el sidebar
function openSidebar() {
  sidebar.classList.add("open")
  sidebarOverlay.classList.add("open")
  document.body.classList.add("sidebar-open")
}

// Función para cerrar el sidebar
function closeSidebar() {
  sidebar.classList.remove("open")
  sidebarOverlay.classList.remove("open")
  document.body.classList.remove("sidebar-open")
}

// Event listeners para el sidebar
menuButton.addEventListener("click", openSidebar)
closeSidebarButton.addEventListener("click", closeSidebar)
sidebarOverlay.addEventListener("click", closeSidebar)

// Cerrar sidebar al cambiar el tamaño de la ventana a desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeSidebar()
  }
})

// Función para actualizar el contenido de la página
function updateContent() {
  // Actualizar título de la página
  document.title = languageData.title || "Portfolio"

  // Actualizar navegación
  const navMenu = document.getElementById("nav-menu")
  const mobileNavMenu = document.getElementById("mobile-nav-menu")
  navMenu.innerHTML = ""
  mobileNavMenu.innerHTML = ""

  // Obtener la sección activa del hash de la URL o usar 'about' por defecto
  const currentSection = window.location.hash ? window.location.hash.substring(1) : "about"

  for (const [key, value] of Object.entries(languageData.nav)) {
    // Menú desktop
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.href = `#${key}`
    a.textContent = value

    // Marcar como activo si corresponde a la sección actual
    if (key === currentSection) {
      a.classList.add("active")
    }

    li.appendChild(a)
    navMenu.appendChild(li)

    // Menú móvil (duplicamos para el sidebar)
    const mobileItem = document.createElement("li")
    const mobileLink = document.createElement("a")
    mobileLink.href = `#${key}`
    mobileLink.textContent = value

    // Marcar como activo si corresponde a la sección actual
    if (key === currentSection) {
      mobileLink.classList.add("active")
    }

    mobileLink.addEventListener("click", closeSidebar) // Cerrar sidebar al hacer clic en un enlace
    mobileItem.appendChild(mobileLink)
    mobileNavMenu.appendChild(mobileItem)
  }

  // Actualizar sección About
  document.getElementById("about-title").textContent = languageData.about.title
  document.getElementById("about-name").textContent = languageData.about.name
  document.getElementById("about-location").textContent = languageData.about.location
  document.getElementById("about-content").textContent = languageData.about.content

  // Actualizar sección Skills
  document.getElementById("skills-title").textContent = languageData.skills.title
  document.getElementById("technical-skills-title").textContent = languageData.skills.technical.title
  document.getElementById("soft-skills-title").textContent = languageData.skills.soft.title

  const technicalSkillsList = document.getElementById("technical-skills-list")
  technicalSkillsList.innerHTML = ""
  languageData.skills.technical.items.forEach((skill) => {
    const span = document.createElement("span")
    span.className = "skill-tag"
    span.textContent = skill
    technicalSkillsList.appendChild(span)
  })

  const softSkillsList = document.getElementById("soft-skills-list")
  softSkillsList.innerHTML = ""
  languageData.skills.soft.items.forEach((skill) => {
    const span = document.createElement("span")
    span.className = "skill-tag"
    span.textContent = skill
    softSkillsList.appendChild(span)
  })

  // Actualizar sección Experience
  document.getElementById("experience-title").textContent = languageData.experience.title

  const experienceItems = document.getElementById("experience-items")
  experienceItems.innerHTML = ""
  languageData.experience.items.forEach((item) => {
    const div = document.createElement("div")
    div.className = "experience-item"

    const h3 = document.createElement("h3")
    h3.textContent = item.title

    const pCompany = document.createElement("p")
    pCompany.className = "company"
    pCompany.textContent = item.company

    const pDates = document.createElement("p")
    pDates.className = "dates"
    pDates.textContent = item.period

    const pLocation = document.createElement("p")
    pLocation.className = "dates"
    pLocation.textContent = item.location

    const ul = document.createElement("ul")
    item.responsibilities.forEach((resp) => {
      const li = document.createElement("li")
      li.textContent = resp
      ul.appendChild(li)
    })

    div.appendChild(h3)
    div.appendChild(pCompany)
    div.appendChild(pDates)
    div.appendChild(pLocation)
    div.appendChild(ul)

    experienceItems.appendChild(div)
  })

  // Actualizar sección Education
  document.getElementById("education-title").textContent = languageData.education.title

  const educationItems = document.getElementById("education-items")
  educationItems.innerHTML = ""
  languageData.education.items.forEach((item) => {
    const div = document.createElement("div")
    div.className = "education-item"

    const h3 = document.createElement("h3")
    h3.textContent = item.title

    const pInstitution = document.createElement("p")
    pInstitution.className = "institution"
    pInstitution.textContent = item.institution

    const pType = document.createElement("p")
    pType.className = "dates"
    pType.textContent = item.type

    div.appendChild(h3)
    div.appendChild(pInstitution)
    div.appendChild(pType)

    if (item.url) {
      const a = document.createElement("a")
      a.href = item.url
      a.target = "_blank"
      a.className = "project-link"
      a.textContent = currentLanguage === "es" ? "Ver Certificado" : "View Certificate"
      div.appendChild(a)
    }

    educationItems.appendChild(div)
  })

  // Actualizar sección Certifications
  document.getElementById("certifications-title").textContent = languageData.certifications.title

  const certificationsList = document.getElementById("certifications-list")
  certificationsList.innerHTML = ""
  languageData.certifications.items.forEach((cert) => {
    const li = document.createElement("li")
    li.textContent = cert
    certificationsList.appendChild(li)
  })

  // Actualizar sección Projects
  document.getElementById("projects-title").textContent = languageData.projects.title

  // Asegurarse de que el grid de proyectos exista y esté visible por defecto
  const projectsGrid = document.getElementById("projects-grid")
  projectsGrid.innerHTML = ""

  // Mostrar el grid por defecto (se ajustará en initProjectsCarousel)
  projectsGrid.style.display = "grid"

  // Crear las tarjetas de proyectos para el grid
  languageData.projects.items.forEach((project) => {
    const div = document.createElement("div")
    div.className = "project-card"

    const img = document.createElement("img")
    img.src = project.image || `/placeholder.svg?height=200&width=400`
    img.alt = project.title
    img.className = "project-image"

    const infoDiv = document.createElement("div")
    infoDiv.className = "project-info"

    const h3 = document.createElement("h3")
    h3.textContent = project.title

    const pDesc = document.createElement("p")
    pDesc.className = "project-description"
    pDesc.textContent = project.description

    const aProject = document.createElement("a")
    aProject.href = project.url
    aProject.target = "_blank"
    aProject.className = "project-link"
    aProject.textContent = project.linkText

    infoDiv.appendChild(h3)
    infoDiv.appendChild(pDesc)
    infoDiv.appendChild(aProject)

    div.appendChild(img)
    div.appendChild(infoDiv)

    projectsGrid.appendChild(div)
  })

  // Inicializar el carrusel después de actualizar los proyectos
  // Esto configurará la visibilidad correcta según el tamaño de pantalla
  initProjectsCarousel()

  // Actualizar sección Contact
  document.getElementById("contact-title").textContent = languageData.contact.title

  // Actualizar footer
  document.getElementById("footer-rights").textContent = languageData.footer.rights
}

// Función para cambiar el idioma
function toggleLanguage() {
  currentLanguage = currentLanguage === "es" ? "en" : "es"
  loadLanguageData(currentLanguage)

  // Actualizar el estado del switch
  document.getElementById("language-toggle").checked = currentLanguage === "es"
}

// Función para cambiar entre tema claro y oscuro
function toggleTheme() {
  const htmlElement = document.documentElement
  const currentTheme = htmlElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  htmlElement.setAttribute("data-theme", newTheme)

  // Guardar preferencia en localStorage
  localStorage.setItem("theme", newTheme)
}

// Evento para el switch de tema
document.getElementById("theme-toggle").addEventListener("change", () => {
  toggleTheme()
})

// Evento para el switch de idioma
document.getElementById("language-toggle").addEventListener("change", () => {
  toggleLanguage()
})

// Función para scroll suave
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href") && e.target.getAttribute("href").startsWith("#")) {
    e.preventDefault()

    const targetId = e.target.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      // Cerrar el sidebar si está abierto
      closeSidebar()

      // Obtiene la posición del elemento de destino menos la altura del encabezado fijo
      const headerHeight = document.querySelector(".ios-header").offsetHeight
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20 // -20px extra padding

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth", // Habilita el scroll suave
      })

      // Actualiza la URL sin recargar la página para reflejar la sección actual
      history.pushState(null, null, targetId)
    }
  }
})

// Efecto de aparición de secciones al hacer scroll usando Intersection Observer
// Modificar la función que se ejecuta al cargar el documento para asegurar que la primera sección se marque como activa
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section")

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        // Si la sección es visible en el viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible") // Añade la clase para activar la transición CSS
        }
      })
    },
    {
      rootMargin: "0px", // Margen alrededor del viewport
      threshold: 0.1, // Porcentaje del elemento que debe ser visible para activarse (10%)
    },
  )

  // Observa cada sección
  sections.forEach((section) => {
    observer.observe(section)
  })

  // Cargar preferencia de tema guardada
  let savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme)
    document.getElementById("theme-toggle").checked = savedTheme === "dark"
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // Si no hay preferencia guardada, usar la preferencia del sistema
    document.documentElement.setAttribute("data-theme", "dark")
    document.getElementById("theme-toggle").checked = true
  }

  // Detectar cambios en la preferencia del sistema
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", newTheme)
      document.getElementById("theme-toggle").checked = e.matches
    }
  })

  // Cargar el idioma por defecto al iniciar
  loadLanguageData(currentLanguage)

  // Sincronizar los toggles del sidebar con los del header
  savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.getElementById("sidebar-theme-toggle").checked = savedTheme === "dark"
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.getElementById("sidebar-theme-toggle").checked = true
  }

  // Añadir observador para detectar sección activa al hacer scroll
  const sectionsToObserve = document.querySelectorAll("section[id]")

  // Ejecutar al cargar la página para establecer la sección inicial activa
  setTimeout(() => {
    highlightNavOnScroll()

    // Si no hay hash en la URL, activar la primera sección
    if (!window.location.hash) {
      const firstSectionId = sectionsToObserve[0].id

      // Marcar la primera sección como activa en ambos menús
      document.querySelectorAll("#nav-menu a").forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${firstSectionId}`) {
          link.classList.add("active")
        }
      })

      document.querySelectorAll("#mobile-nav-menu a").forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${firstSectionId}`) {
          link.classList.add("active")
        }
      })

      // Actualizar URL sin recargar la página
      history.replaceState(null, null, `#${firstSectionId}`)
    } else {
      // Si hay un hash, activar la sección correspondiente
      const sectionId = window.location.hash.substring(1)

      document.querySelectorAll("#nav-menu a, #mobile-nav-menu a").forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  }, 100)

  // Añadir evento de scroll con throttling para mejor rendimiento
  let isScrolling = false
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        highlightNavOnScroll()
        isScrolling = false
      })
      isScrolling = true
    }
  })
})

// Detectar idioma del navegador (opcional)
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith("en")) {
    currentLanguage = "en"
    document.getElementById("language-toggle").checked = false
  } else if (browserLang.startsWith("es")) {
    currentLanguage = "es"
    document.getElementById("language-toggle").checked = true
  }
  loadLanguageData(currentLanguage)
}

// Descomentar para activar la detección automática del idioma del navegador
// detectBrowserLanguage();

// Función para inicializar el carrusel de proyectos
function initProjectsCarousel() {
  // Verificar si el contenedor de proyectos existe
  const projectsSection = document.getElementById("projects")
  if (!projectsSection) return

  const projectsData = languageData.projects.items
  if (!projectsData || projectsData.length === 0) return

  // Verificar si ya existe un carrusel y eliminarlo para evitar duplicados
  const existingCarousel = document.querySelector(".projects-carousel-container")
  if (existingCarousel) {
    existingCarousel.remove()
  }

  // Crear el contenedor del carrusel
  const carouselContainer = document.createElement("div")
  carouselContainer.className = "projects-carousel-container"

  // Crear el carrusel
  const carousel = document.createElement("div")
  carousel.className = "projects-carousel"

  // Crear slides para cada proyecto
  projectsData.forEach((project, index) => {
    const slide = document.createElement("div")
    slide.className = "carousel-slide"
    if (index === 0) slide.classList.add("active")

    const card = document.createElement("div")
    card.className = "project-card"

    const img = document.createElement("img")
    img.src = project.image || `/placeholder.svg?height=200&width=400`
    img.alt = project.title
    img.className = "project-image"

    const infoDiv = document.createElement("div")
    infoDiv.className = "project-info"

    const h3 = document.createElement("h3")
    h3.textContent = project.title

    const pDesc = document.createElement("p")
    pDesc.className = "project-description"
    pDesc.textContent = project.description

    const aProject = document.createElement("a")
    aProject.href = project.url
    aProject.target = "_blank"
    aProject.className = "project-link"
    aProject.textContent = project.linkText

    infoDiv.appendChild(h3)
    infoDiv.appendChild(pDesc)
    infoDiv.appendChild(aProject)

    card.appendChild(img)
    card.appendChild(infoDiv)

    slide.appendChild(card)
    carousel.appendChild(slide)
  })

  // Crear indicadores
  const indicators = document.createElement("div")
  indicators.className = "carousel-indicators"

  projectsData.forEach((_, index) => {
    const indicator = document.createElement("div")
    indicator.className = "carousel-indicator"
    if (index === 0) indicator.classList.add("active")
    indicators.appendChild(indicator)
  })

  carouselContainer.appendChild(carousel)
  carouselContainer.appendChild(indicators)

  // Obtener el contenedor de proyectos
  const projectsGrid = document.getElementById("projects-grid")
  const container = projectsSection.querySelector(".container")

  // Insertar el carrusel después del título
  container.insertBefore(carouselContainer, projectsGrid.nextSibling)

  // Ajustar la visibilidad según el tamaño de pantalla
  const isMobile = window.innerWidth <= 768
  projectsGrid.style.display = isMobile ? "none" : "grid"
  carouselContainer.style.display = isMobile ? "block" : "none"

  // Variables para el control táctil
  let startX, startY, moveX, moveY
  let currentIndex = 0
  const slideWidth = 100 // 100% del ancho
  const slideCount = projectsData.length
  let isDragging = false
  let isScrolling = null // Variable para determinar si el usuario está haciendo scroll vertical
  let isAnimating = false // Variable para controlar si hay una animación en curso

  // Función para actualizar el carrusel
  function updateCarousel(animate = true) {
    // Limitar el índice al rango válido
    if (currentIndex < 0) currentIndex = 0
    if (currentIndex >= slideCount) currentIndex = slideCount - 1

    // Calcular la nueva posición
    const translateX = -currentIndex * slideWidth

    // Aplicar la transformación con o sin animación
    carousel.style.transition = animate ? "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
    carousel.style.transform = `translateX(${translateX}%)`

    // Actualizar clases activas
    document.querySelectorAll(".carousel-slide").forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex)
    })

    // Actualizar indicadores
    document.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex)
    })
  }

  // Función para aplicar la animación de rebote
  function applyBounceEffect(direction) {
    if (isAnimating) return
    isAnimating = true

    // Crear un elemento clon para la animación
    const bounceElement = document.createElement("div")
    bounceElement.className = direction === "back" ? "bounce-back-element" : "bounce-forward-element"
    bounceElement.style.position = "absolute"
    bounceElement.style.top = "0"
    bounceElement.style.left = "0"
    bounceElement.style.width = "100%"
    bounceElement.style.height = "100%"
    bounceElement.style.pointerEvents = "none"

    // Añadir el elemento al contenedor
    carouselContainer.appendChild(bounceElement)

    // Aplicar la animación
    setTimeout(() => {
      bounceElement.classList.add(direction === "back" ? "bounce-back" : "bounce-forward")

      // Eliminar el elemento después de la animación
      setTimeout(() => {
        bounceElement.remove()
        isAnimating = false
      }, 400)
    }, 0)
  }

  // Manejadores de eventos táctiles
  carousel.addEventListener(
    "touchstart",
    (e) => {
      if (isAnimating) return

      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isDragging = true
      isScrolling = null

      // Desactivar transición durante el arrastre
      carousel.style.transition = "none"
    },
    { passive: true },
  )

  carousel.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || isAnimating) return

      moveX = e.touches[0].clientX
      moveY = e.touches[0].clientY

      const diffX = moveX - startX
      const diffY = moveY - startY

      // Determinar si el usuario está intentando hacer scroll vertical o deslizar horizontalmente
      if (isScrolling === null) {
        isScrolling = Math.abs(diffY) > Math.abs(diffX)
      }

      // Si el usuario está haciendo scroll vertical, no interferir
      if (isScrolling) return

      // Prevenir el comportamiento predeterminado solo si estamos deslizando horizontalmente
      e.preventDefault()

      const translateX = -currentIndex * slideWidth + (diffX / carousel.offsetWidth) * 100

      // Añadir resistencia en los extremos
      if (translateX > 0 || translateX < -((slideCount - 1) * slideWidth)) {
        const resistance = 0.25 // Menor valor = más resistencia
        carousel.style.transform = `translateX(${-currentIndex * slideWidth + ((diffX * resistance) / carousel.offsetWidth) * 100}%)`
      } else {
        carousel.style.transform = `translateX(${translateX}%)`
      }
    },
    { passive: false },
  )

  carousel.addEventListener("touchend", (e) => {
    if (!isDragging || isAnimating) return
    isDragging = false

    // Si el usuario estaba haciendo scroll vertical, no hacer nada más
    if (isScrolling) return

    moveX = e.changedTouches[0].clientX
    const diffX = moveX - startX

    // Determinar si el usuario ha deslizado lo suficiente para cambiar de slide
    if (Math.abs(diffX) > carousel.offsetWidth * 0.2) {
      if (diffX > 0) {
        // Deslizar a la derecha (slide anterior)
        currentIndex--
      } else {
        // Deslizar a la izquierda (slide siguiente)
        currentIndex++
      }
    }

    // Comprobar si estamos en los límites
    if (currentIndex < 0) {
      currentIndex = 0
      updateCarousel(true)
      applyBounceEffect("back")
    } else if (currentIndex >= slideCount) {
      currentIndex = slideCount - 1
      updateCarousel(true)
      applyBounceEffect("forward")
    } else {
      // Actualizar el carrusel normalmente si no estamos en los límites
      updateCarousel(true)
    }
  })

  // Inicializar el carrusel
  updateCarousel(false)
}

// Añadir un listener para el evento resize para ajustar la visualización del carrusel/grid
window.addEventListener("resize", () => {
  const isMobile = window.innerWidth <= 768
  const projectsGrid = document.getElementById("projects-grid")
  const carouselContainer = document.querySelector(".projects-carousel-container")

  if (projectsGrid && carouselContainer) {
    projectsGrid.style.display = isMobile ? "none" : "grid"
    carouselContainer.style.display = isMobile ? "block" : "none"
  }
})

// Añadir sincronización entre los toggles del sidebar y los del header
document.getElementById("sidebar-language-toggle").addEventListener("change", () => {
  toggleLanguage()
  // Sincronizar con el toggle del header
  document.getElementById("language-toggle").checked = currentLanguage === "es"
})

document.getElementById("sidebar-theme-toggle").addEventListener("change", () => {
  toggleTheme()
  // Sincronizar con el toggle del header
  document.getElementById("theme-toggle").checked = document.documentElement.getAttribute("data-theme") === "dark"
})

// Añadir evento para actualizar el menú activo al cambiar de sección
window.addEventListener("hashchange", () => {
  const currentSection = window.location.hash ? window.location.hash.substring(1) : "about"

  // Actualizar ambos menús
  document.querySelectorAll("#mobile-nav-menu a, #nav-menu a").forEach((link) => {
    const linkSection = link.getAttribute("href").substring(1)
    link.classList.toggle("active", linkSection === currentSection)
  })

  // Asegurar que se haga scroll a la sección correcta
  const targetElement = document.getElementById(currentSection)
  if (targetElement) {
    const headerHeight = document.querySelector(".ios-header").offsetHeight
    const targetPosition = targetElement.offsetTop - headerHeight - 20

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }
})

// Modificar la función highlightNavOnScroll para mejorar la detección de secciones activas
const sectionsToObserve = document.querySelectorAll("section[id]") // Declare sectionsToObserve

// Modificar la función highlightNavOnScroll para mejorar la detección de la última sección (contactos)
function highlightNavOnScroll() {
  const scrollPosition = window.scrollY + 100 // Ajustado para mejor detección
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollBottom = scrollPosition + windowHeight
  const isNearBottom = documentHeight - scrollBottom < 50 // Detectar si estamos cerca del final de la página

  // Si estamos cerca del final de la página, activar la última sección (contactos)
  if (isNearBottom) {
    const lastSectionId = sectionsToObserve[sectionsToObserve.length - 1].id

    // Actualizar menú desktop
    document.querySelectorAll("#nav-menu a").forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${lastSectionId}`) {
        link.classList.add("active")
      }
    })

    // Actualizar menú móvil
    document.querySelectorAll("#mobile-nav-menu a").forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${lastSectionId}`) {
        link.classList.add("active")
      }
    })

    // Actualizar URL sin recargar la página
    if (history.replaceState && window.location.hash !== `#${lastSectionId}`) {
      history.replaceState(null, null, `#${lastSectionId}`)
    }

    return // Salir de la función si estamos en la última sección
  }

  // Comportamiento normal para otras secciones
  sectionsToObserve.forEach((section) => {
    const sectionTop = section.offsetTop - document.querySelector(".ios-header").offsetHeight
    const sectionBottom = sectionTop + section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      // Actualizar menú desktop
      document.querySelectorAll("#nav-menu a").forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })

      // Actualizar menú móvil
      document.querySelectorAll("#mobile-nav-menu a").forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })

      // Actualizar URL sin recargar la página
      if (history.replaceState && window.location.hash !== `#${sectionId}`) {
        history.replaceState(null, null, `#${sectionId}`)
      }
    }
  })
}
