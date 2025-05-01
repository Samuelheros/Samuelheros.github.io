document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById("mySidebar");
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.closebtn');
    const content = document.querySelector('.content'); // Selecciona el div .content
    const sidebarLinks = document.querySelectorAll('#mySidebar a');
    const header = document.querySelector('header'); // Referencia al encabezado

    // Función para abrir el sidebar
    function openNav() {
         // Determina el ancho basado en el tamaño de la pantalla
        if (window.innerWidth <= 768) {
            sidebar.style.width = "75%"; // Ancho para móviles (debe coincidir con el CSS)
        } else {
            sidebar.style.width = "250px"; // Ancho para desktop
        }
        menuToggle.setAttribute('aria-expanded', 'true');
        content.classList.add('sidebar-open'); // *** NUEVO: Añade clase para overlay ***
        // Opcional: Añadir una clase al body para controlar el scroll
        document.body.style.overflow = 'hidden'; // Previene el scroll del body
    }

    // Función para cerrar el sidebar
    function closeNav() {
        sidebar.style.width = "0";
        menuToggle.setAttribute('aria-expanded', 'false');
        content.classList.remove('sidebar-open'); // *** NUEVO: Quita clase para overlay ***
        // Opcional: Restaurar el scroll del body
        document.body.style.overflow = ''; // Restaura el scroll
    }

    // Event listener para el botón de menú
    if (menuToggle) {
        menuToggle.addEventListener('click', openNav);
        menuToggle.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openNav();
            }
        });
    }

    // Event listener para el botón de cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNav);
         closeBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeNav();
            }
        });
    }

    // *** NUEVO: Event listener para cerrar el menú al hacer clic en el overlay ***
    // (Se adjunta al contenedor '.content' porque el pseudo-elemento ::before no puede recibir eventos directamente,
    // pero podemos detectar el clic en el área del content cuando el overlay está activo)
    if (content) {
        content.addEventListener('click', function(e) {
            // Verificar si la clase 'sidebar-open' está presente y si el clic NO fue dentro del sidebar
            // (esto asume que el sidebar no está dentro del div .content)
            // Una comprobación más robusta sería verificar e.target directamente
            if (content.classList.contains('sidebar-open') && e.target === content) {
                 // Opcionalmente, puedes hacer la condición más segura verificando
                 // si el pseudo-elemento '::before' está efectivamente visible,
                 // aunque la clase 'sidebar-open' debería ser suficiente.
                closeNav();
            }
        });
    }


    // Agregar listener para cerrar el sidebar al hacer clic en un enlace de sección
    sidebarLinks.forEach(link => {
        // Verificamos que el enlace tenga un href y no sea el botón de cerrar o un enlace de icono de contacto
        if (link.href && link.href.includes('#') && !link.classList.contains('closebtn') && link.parentElement.className !== 'sidebar-contact-icons') {
             link.addEventListener('click', function(e) {
                // El desplazamiento ahora lo maneja scroll-behavior: smooth;
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                // Si el elemento existe, cerramos el menú después de un tiempo
                if (targetElement) {
                    // Espera un poco para permitir que el scroll inicie antes de cerrar
                    setTimeout(closeNav, 300); // Reducido para una respuesta más rápida
                } else {
                    // Si el enlace no apunta a un ID de sección válido, cerramos el menú inmediatamente
                    closeNav();
                }
            });
        } else if (!link.href || link.href === '#') {
             // Si es un enlace sin href o solo con #, como el de "cerrar menú"
            link.addEventListener('click', function(e) {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
            });
        }
    });


    // Implementación: Añadir/quitar clase 'scrolled' al header
    window.addEventListener('scroll', function() {
        // Define el umbral de scroll para añadir la clase
        const scrollThreshold = 50;
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled'); // Añade una clase CSS
        } else {
            header.classList.remove('scrolled');
        }
    });

     // Mejora: Resaltar enlace activo en el sidebar al hacer scroll
     const sections = document.querySelectorAll('section');
     const observerOptions = {
         root: null, // Relativo al viewport
         rootMargin: '0px 0px -60% 0px', // Considera activa una sección cuando su parte superior está en el 40% superior de la pantalla
         threshold: 0 // Se dispara apenas entre/salga
     };

     const observer = new IntersectionObserver(entries => {
         entries.forEach(entry => {
             const id = entry.target.getAttribute('id');
             const sidebarLink = document.querySelector(`#mySidebar a[href="#${id}"]`);

             if (entry.isIntersecting && entry.intersectionRatio > 0) {
                 // Eliminar 'active' de todos los enlaces de sección primero
                 sidebarLinks.forEach(link => {
                      if (link.href && link.href.includes('#') && !link.parentElement.classList.contains('sidebar-contact-icons')) {
                           link.classList.remove('active');
                      }
                 });
                 // Añadir 'active' al enlace de sección visible actualmente
                 if (sidebarLink) {
                     sidebarLink.classList.add('active');
                 }
             } else {
                // Opcional: quitar la clase active si ya no es la más visible
                 if (sidebarLink) {
                     // sidebarLink.classList.remove('active'); // Puede causar parpadeo, mejor manejar solo la adición
                 }
             }
         });
     }, observerOptions);

     // Observar cada sección
     sections.forEach(section => {
         observer.observe(section);
     });

});