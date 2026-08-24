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

    inicio: "html/inicio.html",

    definiciones: "html/01_am_definiciones.html",

    clientes: "html/clientes.html",

    productos: "html/productos.html",

    contacto: "html/contacto.html",

    configuracion: "html/configuracion.html",

    /* ----- SUBMENÚ DEFINICIONES ----- */

    "definiciones_via": "/html/01_am_definiciones.html",

    "tipos-vehiculos": "html/01_am_02_tipos_vehiculos.html",

    "vehiculos-sin-motor":
        "html/01_am_03_vehiculos_sin_motor.html",

    "vehiculos-con-motor":
        "html/01_am_04_vehiculos_con_motor.html"

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


    /* -----------------------------------------------------
       Comprobar que exista la vista
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Mostrar "Cargando..."
       ----------------------------------------------------- */

    contenido.innerHTML = `

        <div class="loading">

            Cargando...

        </div>

    `;


    /* -----------------------------------------------------
       Cargar archivo HTML
       ----------------------------------------------------- */

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

            /* ---------------------------------------------
               Introducir HTML en el <main>
               --------------------------------------------- */

            contenido.innerHTML = html;


            /* ---------------------------------------------
               Quitar clase activo de todos los elementos
               --------------------------------------------- */

            botones.forEach(function (item) {

                item.classList.remove("activo");

            });


            /* ---------------------------------------------
               Marcar botón seleccionado
               --------------------------------------------- */

            botonActivo(nombreVista);

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
   SUBMENÚ DE DEFINICIONES
   ========================================================= */

const btnDefiniciones =
    document.getElementById("btnDefiniciones");

const submenuDefiniciones =
    document.getElementById("submenuDefiniciones");


if (btnDefiniciones && submenuDefiniciones) {

    btnDefiniciones.addEventListener(
        "click",
        function () {

            submenuDefiniciones.classList.toggle(
                "abierto"
            );


            btnDefiniciones.classList.toggle(
                "abierto"
            );

        }
    );

}

/* =========================================================
   SUBMENÚ DE MANIOBRAS
   ========================================================= */

const btnManiobras =
    document.getElementById("btnManiobras");

const submenuManiobras =
    document.getElementById("submenuManiobras");


if (btnManiobras && submenuManiobras) {

    btnManiobras.addEventListener(
        "click",
        function () {

            submenuManiobras.classList.toggle(
                "abierto"
            );


            btnManiobras.classList.toggle(
                "abierto"
            );

        }
    );

}