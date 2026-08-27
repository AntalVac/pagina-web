/* =========================================================
   ELEMENTOS PRINCIPALES
   ========================================================= */

const contenido = document.getElementById("contenido");
const botones = document.querySelectorAll("[data-vista]");


/* =========================================================
   VISTAS
   Relación entre data-vista y archivo HTML
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


/* =========================================================
   CARGAR UNA VISTA
   ========================================================= */

function cargarVista(nombreVista) {
    const archivo = vistas[nombreVista];

    if (!archivo) {
        contenido.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>
                    No existe la sección:
                    <strong>${nombreVista}</strong>
                </p>
            </div>
        `;
        return;
    }

    contenido.innerHTML = `
        <div class="loading">
            Cargando...
        </div>
    `;

    fetch(archivo)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo cargar el archivo: " + archivo
                );
            }

            return respuesta.text();
        })
        .then(function (html) {
            contenido.innerHTML = html;

            botones.forEach(function (item) {
                item.classList.remove("activo");
            });

            botonActivo(nombreVista);

            // En móvil, al elegir una sección se cierra el panel.
            if (window.innerWidth <= 700) {
                const sidebar = document.getElementById("sidebar");

                if (sidebar) {
                    sidebar.classList.add("oculto");
                }
            }
        })
        .catch(function (error) {
            console.error(error);

            contenido.innerHTML = `
                <div class="error">
                    <h2>Error</h2>
                    <p>
                        No se pudo cargar la sección
                        <strong>${nombreVista}</strong>.
                    </p>
                    <small>
                        ${error.message}
                    </small>
                </div>
            `;
        });
}


/* =========================================================
   MARCAR BOTÓN ACTIVO
   ========================================================= */

function botonActivo(nombreVista) {
    const boton = document.querySelector(
        `[data-vista="${nombreVista}"]`
    );

    if (boton) {
        boton.classList.add("activo");
    }
}


/* =========================================================
   BOTÓN DE LAS TRES LÍNEAS
   =========================================================
   Escritorio:
   - alterna .colapsado (250px <-> 70px)

   Móvil:
   - alterna .oculto (visible <-> fuera de pantalla)
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
   SUBMENÚ DE DEFINICIONES
   ========================================================= */

const btnDefiniciones =
    document.getElementById("btnDefiniciones");

const submenuDefiniciones =
    document.getElementById("submenuDefiniciones");

if (btnDefiniciones && submenuDefiniciones) {
    btnDefiniciones.addEventListener("click", function () {
        submenuDefiniciones.classList.toggle("abierto");
        btnDefiniciones.classList.toggle("abierto");
    });
}


/* =========================================================
   SUBMENÚ DE MANIOBRAS
   ========================================================= */

const btnManiobras =
    document.getElementById("btnManiobras");

const submenuManiobras =
    document.getElementById("submenuManiobras");

if (btnManiobras && submenuManiobras) {
    btnManiobras.addEventListener("click", function () {
        submenuManiobras.classList.toggle("abierto");
        btnManiobras.classList.toggle("abierto");
    });
}


/* =========================================================
   SUBMENÚ DE SEÑALIZACIÓN DE LA VÍA
   ========================================================= */

const btnSeñalizacion =
    document.getElementById("btnSeñalizacion");

const submenuSeñalizacion =
    document.getElementById("submenuSeñalizacion");

if (btnSeñalizacion && submenuSeñalizacion) {
    btnSeñalizacion.addEventListener("click", function () {
        submenuSeñalizacion.classList.toggle("abierto");
        btnSeñalizacion.classList.toggle("abierto");
    });
}
