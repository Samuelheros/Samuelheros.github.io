document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById("mySidebar");
    const menuToggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.closebtn');
    const content = document.querySelector('.content');
    const sidebarLinks = document.querySelectorAll('#mySidebar a');
    const header = document.querySelector('header'); // Referencia al encabezado

    // Función para abrir el sidebar
    function openNav() {
         // Determina el ancho basado en el tamaño de la pantalla
        if (window.innerWidth <= 768) {
            sidebar.style.width = "75%"; // Ancho para móviles (debe coincidir con el CSS)
             // content.classList.add('shifted'); // Desplaza el contenido en móvil si usas esa clase
        } else {
            sidebar.style.width = "250px"; // Ancho para desktop
        }
        menuToggle.setAttribute('aria-expanded', 'true');
        // Opcional: Añadir una clase al body para controlar el scroll o el overlay
        // document.body.style.overflow = 'hidden'; // Previene el scroll del body al abrir sidebar
    }

    // Función para cerrar el sidebar
    function closeNav() {
        sidebar.style.width = "0";
        // content.classList.remove('shifted'); // Elimina la clase de desplazamiento
        menuToggle.setAttribute('aria-expanded', 'false');
        // Opcional: Restaurar el scroll del body
        // document.body.style.overflow = '';
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

    // Agregar listener para cerrar el sidebar al hacer clic en un enlace de sección
    sidebarLinks.forEach(link => {
        // Verificamos que el enlace tenga un href y no sea el botón de cerrar o un enlace de icono de contacto
        if (link.href && link.href.includes('#') && !link.classList.contains('closebtn') && link.parentElement.className !== 'sidebar-contact-icons') {
             link.addEventListener('click', function(e) {
                // No prevenimos el comportamiento por defecto para que el scroll suave de CSS funcione
                // e.preventDefault(); // Comentar o eliminar si usas scroll-behavior: smooth en CSS
                // El desplazamiento ahora lo maneja scroll-behavior: smooth;

                // Cerrar el sidebar con un pequeño retraso para que se vea el scroll
                // Ajusta el tiempo según la duración de tu transición de scroll suave
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                // Si el elemento existe, cerramos el menú después de un tiempo
                if (targetElement) {
                     // Espera un poco más que la duración del scroll suave si es necesario
                     // La duración por defecto de scroll-behavior: smooth puede variar.
                     // Un retraso de 600ms es a menudo suficiente.
                    setTimeout(closeNav, 600);
                } else {
                    // Si el enlace no apunta a un ID de sección válido, simplemente cerramos el menú
                    closeNav();
                }
            });
        } else if (!link.href || link.href === '#') {
             // Si es un enlace sin href o solo con #, como el de "cerrar menú"
            link.addEventListener('click', function(e) {
                 // Prevenir el comportamiento por defecto solo para enlaces que no deben navegar
                 // Esto evita que la página se mueva al inicio si el href es solo '#'
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                // No cerramos el menú aquí, ya que el botón cerrar ya tiene su propio listener
            });
        }
        // No añadimos listener de cerrar a los iconos de contacto en el sidebar,
        // ya que deben abrir el enlace externo y el usuario puede querer mantener el menú abierto.
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

     // Mejora opcional: Resaltar enlace activo en el sidebar al hacer scroll
     // Esto requiere Observadores de Intersección
     const sections = document.querySelectorAll('section');
     const observer = new IntersectionObserver(entries => {
         entries.forEach(entry => {
             const id = entry.target.getAttribute('id');
             // Excluimos el enlace de contacto si es necesario, aunque con href="#contacto" debería funcionar
             const sidebarLink = document.querySelector(`#mySidebar a[href="#${id}"]`);

             if (entry.isIntersecting) {
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
             }
         });
     }, {
         // Ajusta este valor si tu header tiene una altura diferente
         // rootMargin: '-50% 0px -50% 0px'
         // Una alternativa puede ser calcular dinámicamente la altura del header
         // Por ahora, mantenemos un valor fijo o puedes ajustarlo manualmente.
         // Si tu header mide 100px, -100px 0px -100px 0px podría funcionar.
         // Un valor más conservador como -20% 0px -20% 0px suele ser seguro.
         rootMargin: '-20% 0px -20% 0px'
     });

     // Observar cada sección
     sections.forEach(section => {
         observer.observe(section);
     });

});