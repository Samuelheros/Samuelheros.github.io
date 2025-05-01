document.addEventListener('DOMContentLoaded', function() {
    // --- Código Original del Sidebar, Scroll, etc. ---
    const sidebar = document.getElementById("mySidebar");
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.closebtn');
    const content = document.querySelector('.content');
    const sidebarLinks = document.querySelectorAll('#mySidebar a');
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section'); // Necesario para el observer

    function openNav() {
        if (window.innerWidth <= 768) {
            sidebar.style.width = "75%";
        } else {
            sidebar.style.width = "250px";
        }
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        sidebar.style.width = "0";
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        if (content) content.classList.remove('sidebar-open');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openNav);
        menuToggle.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNav(); }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNav);
        closeBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeNav(); }
        });
    }

    if (content) {
        content.addEventListener('click', function(e) {
            if (content.classList.contains('sidebar-open') && e.target === content) {
                closeNav();
            }
        });
    }

    sidebarLinks.forEach(link => {
        if (link.href && link.href.includes('#') && !link.classList.contains('closebtn') && link.parentElement.className !== 'sidebar-contact-icons') {
             link.addEventListener('click', function(e) {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    setTimeout(closeNav, 300);
                } else {
                    closeNav();
                }
            });
        } else if (!link.href || link.href === '#') {
             link.addEventListener('click', function(e) {
                if (link.getAttribute('href') === '#') { e.preventDefault(); }
             });
        }
    });

    window.addEventListener('scroll', function() {
        const scrollThreshold = 50;
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer para resaltar enlace activo
     const observerOptions = {
         root: null,
         rootMargin: '0px 0px -60% 0px',
         threshold: 0
     };

     const observer = new IntersectionObserver(entries => {
         let lastActiveLink = null; // Para evitar quitar active si no hay nueva sección intersectando claramente

         entries.forEach(entry => {
             const id = entry.target.getAttribute('id');
             const sidebarLink = document.querySelector(`#mySidebar a[href="#${id}"]`);

             if (entry.isIntersecting && entry.intersectionRatio > 0) {
                 // Marcar el enlace actual como potencialmente activo
                if(sidebarLink) lastActiveLink = sidebarLink;
             }
         });

        // Después de revisar todas las entries, actualizamos la clase active
         sidebarLinks.forEach(link => {
            if (link.href && link.href.includes('#') && !link.parentElement.classList.contains('sidebar-contact-icons')) {
                link.classList.remove('active');
            }
         });
         if(lastActiveLink){
            lastActiveLink.classList.add('active');
         }


     }, observerOptions);

     sections.forEach(section => {
         observer.observe(section);
     });

    // --- FIN CÓDIGO ORIGINAL ---


    // --- INICIO CÓDIGO DE TRADUCCIÓN ---

    const langSelect = document.getElementById('lang-select');
    // Seleccionar todos los elementos que puedan necesitar traducción
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    const elementsToTranslateAria = document.querySelectorAll('[data-translate-aria]');
    const elementsToTranslateTitle = document.querySelectorAll('[data-translate-title]');
    const elementsToTranslateAlt = document.querySelectorAll('[data-translate-alt]');

    // Función para cargar y aplicar las traducciones
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${lang}.json?v=${Date.now()}`); // Añadir caché busting
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const translations = await response.json();

            // Aplicar traducciones al contenido principal (innerText/innerHTML)
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key] !== undefined) { // Comprobar si la clave existe
                    if (element.tagName === 'TITLE') {
                        element.textContent = translations[key];
                    } else {
                        element.innerHTML = translations[key]; // Usar innerHTML para permitir etiquetas básicas si es necesario
                    }
                } else {
                    console.warn(`Translation key not found for [${key}] in ${lang}.json`);
                }
            });

            // Aplicar traducciones a atributos aria-label
            elementsToTranslateAria.forEach(element => {
                const key = element.getAttribute('data-translate-aria');
                if (translations[key] !== undefined) {
                    element.setAttribute('aria-label', translations[key]);
                } else {
                    console.warn(`Translation key not found for ARIA [${key}] in ${lang}.json`);
                }
            });

            // Aplicar traducciones a atributos title
            elementsToTranslateTitle.forEach(element => {
                const key = element.getAttribute('data-translate-title');
                 if (translations[key] !== undefined) {
                     element.setAttribute('title', translations[key]);
                } else {
                    console.warn(`Translation key not found for TITLE [${key}] in ${lang}.json`);
                }
            });

             // Aplicar traducciones a atributos alt
             elementsToTranslateAlt.forEach(element => {
                const key = element.getAttribute('data-translate-alt');
                 if (translations[key] !== undefined) {
                     element.setAttribute('alt', translations[key]);
                } else {
                    console.warn(`Translation key not found for ALT [${key}] in ${lang}.json`);
                }
            });


            // Actualizar el atributo lang del HTML
            document.documentElement.lang = lang;

            // Guardar preferencia en localStorage
            localStorage.setItem('preferredLanguage', lang);

            // Asegurar que el select muestre el idioma actual
            if (langSelect) {
                langSelect.value = lang;
            }

        } catch (error) {
            console.error("Could not load translations:", error);
            // Opcional: Mostrar un mensaje al usuario o cargar un idioma por defecto
        }
    }

    // Event listener para el cambio de idioma en el select
    if (langSelect) {
        langSelect.addEventListener('change', (event) => {
            loadTranslations(event.target.value);
        });
    }

    // Cargar idioma al iniciar la página (ya estamos dentro de DOMContentLoaded)
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    let initialLang = 'es'; // Default a español

    const supportedLangs = ['es', 'en']; // Lista de idiomas soportados

    if (preferredLanguage && supportedLangs.includes(preferredLanguage)) {
        initialLang = preferredLanguage;
    } else if (supportedLangs.includes(browserLanguage)) {
        // initialLang = browserLanguage; // Descomentar si quieres priorizar el idioma del navegador si no hay preferencia guardada
    }

    // Carga las traducciones iniciales
    loadTranslations(initialLang);

    // --- FIN CÓDIGO DE TRADUCCIÓN ---

}); // Cierre del addEventListener 'DOMContentLoaded' principal