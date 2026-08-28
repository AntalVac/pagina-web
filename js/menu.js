/* =========================================================
   ELEMENTOS PRINCIPALES
   ========================================================= */

const contenido = document.getElementById("contenido");
const botones = document.querySelectorAll("[data-vista]");


/* =========================================================
   VISTAS
   ========================================================= */

const vistas = {
    "definiciones_via": "/html/01_am_definiciones.html",
    "normas": "/html/normas.html",
    "incorporacion": "/html/incorporacion.html",
    "desplazamiento": "/html/desplazamiento.html",
    "cambidir": "/html/cambidir.html",
    "cambisenti": "/html/cambisenti.html",
    "adelantar": "/html/adelantar.html",
    "reversa": "/html/marchatras.html"
};


/* =========================================================
   CARGAR VISTAS DEL MENÚ
   ========================================================= */

botones.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        event.preventDefault();
        const nombreVista = boton.dataset.vista;
        cargarVista(nombreVista);
    });
});


function cargarVista(nombreVista) {
    const archivo = vistas[nombreVista];

    if (!archivo) {
        contenido.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>No existe la sección: <strong>${nombreVista}</strong></p>
            </div>
        `;
        return;
    }

    contenido.innerHTML = `<div class="loading">Cargando...</div>`;

    fetch(archivo)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo: " + archivo);
            }
            return respuesta.text();
        })
        .then(function (html) {
            contenido.innerHTML = html;

            botones.forEach(function (item) {
                item.classList.remove("activo");
            });

            botonActivo(nombreVista);

            if (window.innerWidth <= 700) {
                const sidebarMovil = document.getElementById("sidebar");
                if (sidebarMovil) {
                    sidebarMovil.classList.add("oculto");
                }
            }
        })
        .catch(function (error) {
            console.error(error);

            contenido.innerHTML = `
                <div class="error">
                    <h2>Error</h2>
                    <p>No se pudo cargar la sección <strong>${nombreVista}</strong>.</p>
                    <small>${error.message}</small>
                </div>
            `;
        });
}


function botonActivo(nombreVista) {
    const boton = document.querySelector(`[data-vista="${nombreVista}"]`);
    if (boton) {
        boton.classList.add("activo");
    }
}


/* =========================================================
   BOTÓN DE LAS TRES LÍNEAS
   ========================================================= */

const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");

if (btnMenu && sidebar) {
    btnMenu.addEventListener("click", function () {
        if (window.innerWidth <= 700) {
            sidebar.classList.toggle("oculto");
        } else {
            sidebar.classList.toggle("colapsado");
        }
    });
}


/* =========================================================
   ACORDEÓN DEL MENÚ LATERAL
   Solo un submenú puede permanecer abierto.
   ========================================================= */

const gruposMenu = document.querySelectorAll(".menu-grupo");

function cerrarTodosLosSubmenus(excepto) {
    gruposMenu.forEach(function (grupo) {
        const submenu = grupo.querySelector(".submenu");
        const boton = grupo.querySelector(".menu-toggle");

        if (!submenu || grupo === excepto) {
            return;
        }

        submenu.classList.remove("abierto");

        if (boton) {
            boton.classList.remove("abierto");
            boton.setAttribute("aria-expanded", "false");
        }
    });
}

gruposMenu.forEach(function (grupo) {
    const boton = grupo.querySelector(".menu-toggle");
    const submenu = grupo.querySelector(".submenu");

    if (!boton || !submenu) {
        return;
    }

    boton.setAttribute("aria-expanded", "false");

    boton.addEventListener("click", function () {
        const estabaAbierto = submenu.classList.contains("abierto");

        cerrarTodosLosSubmenus(grupo);

        if (estabaAbierto) {
            submenu.classList.remove("abierto");
            boton.classList.remove("abierto");
            boton.setAttribute("aria-expanded", "false");
        } else {
            submenu.classList.add("abierto");
            boton.classList.add("abierto");
            boton.setAttribute("aria-expanded", "true");
        }
    });
});


/* =========================================================
   ANIMACIÓN SUAVE DEL ACORDEÓN
   Se inyecta aquí para no modificar el resto del CSS.
   ========================================================= */

const estiloAcordeon = document.createElement("style");
estiloAcordeon.textContent = `
    .submenu {
        display: grid;
        grid-template-rows: 0fr;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition:
            grid-template-rows 0.30s ease,
            max-height 0.30s ease,
            opacity 0.22s ease;
    }

    .submenu > * {
        min-height: 0;
    }

    .submenu.abierto {
        grid-template-rows: 1fr;
        max-height: 500px;
        opacity: 1;
    }

    .submenu-item {
        transition:
            color 0.20s ease,
            background 0.20s ease;
    }

    .menu-flecha {
        transition: transform 0.30s ease;
    }

    .menu-toggle.abierto .menu-flecha {
        transform: rotate(180deg);
    }

    .sidebar.colapsado .submenu {
        display: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .submenu,
        .submenu-item,
        .menu-flecha {
            transition: none;
        }
    }
`;
document.head.appendChild(estiloAcordeon);
