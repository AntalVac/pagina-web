/* =========================================================
   ELEMENTOS PRINCIPALES
   ========================================================= */

const contenido = document.getElementById("contenido");
const botones = document.querySelectorAll("[data-vista]");


/* =========================================================
   VISTAS
   ========================================================= */

const vistas = {
/*================1.- ELEMENTOS DE DERECHO PRIVADO===========*/    
    "DerechoPrivado": "html_tte/11DechoPrivado.html",
    "ContratoMercantil": "html_tte/12ContraMercantil.html",
    "condic_general": "html_tte/13Condic_Generales.html",
    "junta": "html_tte/14JuntaArbitral.html",
    "cmr": "html_tte/15cmr.html",
/*====2. EL TRANSPORTISTA COMO EMPRESARIO MERCANTIL.==========*/    
    "empremercantil": "html_tte/21empremercantil.html",
    "obligaformal": "html_tte/22obligaformales.html",
    "empreindivi": "html_tte/23empreindivi.html",
    "seciemerc": "html_tte/24seciemerc.html",
    "socianonima": "html_tte/25socianonima.html",
    "socierespcivil":"html_tte/26socierespcivil.html",
    "sociecoop": "html_tte/27sociecoop.html",
    "suspagos": "html_tte/28suspagos.html",
/*===========3.- DERECHO SOCIAL===============================*/
    "delegado": "html_tte/31delegados.html",
    "obligaciones":"html_tte/32obligaciones.html",
    "contratos":"html_tte/33contratos.html",
    "tacografo":"html_tte/34tacógrafo.html",


/*===========4.- DERECHO FISCAL===============================*/
    "eliva": "html_tte/41eliva.html",
    "elirpf":"html_tte/42elirpf.html",
    "impuestosocie":"html_tte/43impuestosocie.html",
    "otrostributos":"html_tte/44otrostributos.html",
/*===========5.- GESTION COMERCIAL============================*/
    "letracambio": "html_tte/51letracambio.html",
    "creditobanc":"html_tte/52creditobanc.html",
    "contrafianza":"html_tte/53contrafianza.html",
    "leasing":"html_tte/54leasing.html",
    "elbalance": "html_tte/55elbalance.html",
    "ctaperganacias":"html_tte/56ctaperganacias.html",
    "ratiofinanc":"html_tte/57ratiofinanc.html",
    "presupuesto":"html_tte/58presupuesto.html",
    "costes": "html_tte/59costes.html",
    "departamentacion":"html_tte/510departamentacion.html",
    "planificacion":"html_tte/511planificacion.html",
    "marketing":"html_tte/512marketing.html",
    "contratoseguro": "html_tte/513contratoseguro.html",
    "segurrespcivil": "html_tte/514segurrespcivil.html",
    "segurtte": "html_tte/515segurtte.html",
    "informatizacion": "html_tte/516informatizacion.html",
    "facturacion":"html_tte/517facturacion.html",
    "agenciatte":"html_tte/518agenciatte.html",
    /*===========6.- ACCESO AL MERCADO=======================*/
    "profesiontta": "html_tte/61profesiontta.html",
    "ttainterior":"html_tte/62ttainterior.html",
    "ttainternacional":"html_tte/63ttainternacional.html",
    "documentos":"html_tte/64documentos.html",
    "logistica": "html_tte/65logistica.html",
    "fronteras":"html_tte/66fronteras.html",
    "controltte":"html_tte/67controltte.html",
    /*===========7.- NORMAS DE EXPLOTACIÓN=======================*/
    "pesodimension": "html_tte/71pesosdimension.html",
    "vehiculosligpesados":"html_tte/72vehiculosligpesados.html",
    "tramiadministrativo":"html_tte/73tramiadministrativo.html",
    "limitacionesgases":"html_tte/74limitacionesgases.html",
    "planesperiodicos": "html_tte/75planesperiodicos.html",
    "proteccmercancia":"html_tte/76proteccmercancia.html",
    "transpintermodal":"html_tte/77transpintermodal.html",
    "atp" : "html_tte/79elatp.html",
    "animalesvivos" : "html_tte/710animalesvivos.html",
    "adr" : "html_tte/78eladr.html",
    /*===========8.- SEGURIDAD EN CARRETERA===================*/
    "permisocon": "html_tte/81permisocon.html",
    "circulavehículos":"html_tte/82circulavehículos.html",
    "segurconduccion":"html_tte/83segurconduccion.html",
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
