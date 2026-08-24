/* =========================================================
   ELEMENTOS PRINCIPALES
   ========================================================= */

const contenido = document.getElementById("contenido");
const botones = document.querySelectorAll("[data-vista]");

/* =========================================================
   VISTAS
   Rutas relativas a la raíz de GitHub Pages
   ========================================================= */

const vistas = {
    definiciones_via: "01_am_definiciones.html"
};

/* =========================================================
   CARGAR VISTAS DEL MENÚ
   ========================================================= */

botones.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        event.preventDefault();

        const nombreVista = boton.dataset.vista;

        // Los elementos que todavía no tienen una página asociada
        // permanecen como enlaces pendientes (#).
        if (!vistas[nombreVista]) {
            return;
        }

        cargarVista(nombreVista);
    });
});

/* =========================================================
   CARGAR UNA VISTA
   ========================================================= */

function cargarVista(nombreVista) {
    const archivo = vistas[nombreVista];

    if (!archivo || !contenido) {
        return;
    }

    contenido.innerHTML = '<div class="loading">Cargando...</div>';

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

/* =========================================================
   MARCAR BOTÓN ACTIVO
   ========================================================= */

function botonActivo(nombreVista) {
    const boton = document.querySelector(`[data-vista="${nombreVista}"]`);

    if (boton) {
        boton.classList.add("activo");
    }
}

/* =========================================================
   SUBMENÚ DE DEFINICIONES
   ========================================================= */

const btnDefiniciones = document.getElementById("btnDefiniciones");
const submenuDefiniciones = document.getElementById("submenuDefiniciones");

if (btnDefiniciones && submenuDefiniciones) {
    btnDefiniciones.addEventListener("click", function () {
        submenuDefiniciones.classList.toggle("abierto");
        btnDefiniciones.classList.toggle("abierto");
    });
}

/* =========================================================
   SUBMENÚ DE MANIOBRAS
   ========================================================= */

const btnManiobras = document.getElementById("btnManiobras");
const submenuManiobras = document.getElementById("submenuManiobras");

if (btnManiobras && submenuManiobras) {
    btnManiobras.addEventListener("click", function () {
        submenuManiobras.classList.toggle("abierto");
        btnManiobras.classList.toggle("abierto");
    });
}
