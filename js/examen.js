// ============================================================
// ANTALVAC - EXAMEN
// Test Permiso B · Normativa general
// ============================================================

const DURACION_SEGUNDOS = 15 * 60;
const MINIMO_APTO = 7;

// ------------------------------------------------------------
// PREGUNTAS
// ------------------------------------------------------------

const preguntas = [
    {
        pregunta: "¿Qué indica una señal de STOP?",
        opciones: [
            "Que debemos reducir la velocidad.",
            "Que debemos detenernos obligatoriamente.",
            "Que tenemos prioridad."
        ],
        correcta: 1,
        explicacion: "La señal de STOP obliga a detenerse antes de continuar."
    },
    {
        pregunta: "¿Qué debe hacer el conductor antes de realizar una maniobra?",
        opciones: [
            "Comprobar que puede realizarla sin peligro.",
            "Acelerar para realizarla rápidamente.",
            "Avisar únicamente al vehículo que circula detrás."
        ],
        correcta: 0,
        explicacion: "Antes de cualquier maniobra debemos comprobar que puede realizarse con seguridad."
    },
    {
        pregunta: "Como norma general, ¿por qué lado de la calzada deben circular los vehículos?",
        opciones: [
            "Por el lado derecho.",
            "Por el centro.",
            "Por el lado izquierdo."
        ],
        correcta: 0,
        explicacion: "En España se circula normalmente por el lado derecho de la calzada."
    },
    {
        pregunta: "¿Qué debe hacer un conductor ante un semáforo en rojo?",
        opciones: [
            "Continuar si no viene ningún vehículo.",
            "Detenerse.",
            "Reducir la velocidad y continuar."
        ],
        correcta: 1,
        explicacion: "La luz roja obliga a detenerse."
    },
    {
        pregunta: "¿Quién debe utilizar el cinturón de seguridad?",
        opciones: [
            "Solo el conductor.",
            "Los ocupantes obligados a utilizarlo.",
            "Solo los pasajeros de los asientos delanteros."
        ],
        correcta: 1,
        explicacion: "El cinturón debe utilizarse por los ocupantes en los casos establecidos por la normativa."
    },
    {
        pregunta: "Ante un paso para peatones debidamente señalizado, el conductor debe:",
        opciones: [
            "Aumentar la velocidad para pasar antes.",
            "Ceder el paso a los peatones que estén cruzando o vayan a cruzar.",
            "Tocar el claxon para avisar."
        ],
        correcta: 1,
        explicacion: "Los conductores deben ceder el paso a los peatones en los pasos destinados a ellos cuando corresponda."
    },
    {
        pregunta: "¿Cuál es una medida adecuada para combatir la fatiga durante la conducción?",
        opciones: [
            "Aumentar la velocidad.",
            "Abrir la ventanilla y continuar sin parar.",
            "Realizar descansos adecuados."
        ],
        correcta: 2,
        explicacion: "Ante la fatiga, lo adecuado es detenerse y descansar."
    },
    {
        pregunta: "Antes de cambiar de carril, el conductor debe:",
        opciones: [
            "Comprobar que puede hacerlo con seguridad y señalizar la maniobra.",
            "Cambiar directamente si el carril está ocupado.",
            "Frenar bruscamente."
        ],
        correcta: 0,
        explicacion: "El cambio de carril debe realizarse de forma segura y señalizando adecuadamente."
    },
    {
        pregunta: "Cuando llueve intensamente, ¿qué debe hacer el conductor?",
        opciones: [
            "Aumentar la velocidad para salir antes de la zona de lluvia.",
            "Adaptar la velocidad a las condiciones y aumentar la precaución.",
            "Circular pegado al vehículo precedente."
        ],
        correcta: 1,
        explicacion: "La lluvia puede reducir la visibilidad y la adherencia, por lo que debemos adaptar la conducción."
    },
    {
        pregunta: "Una señal de prohibición de adelantar significa que:",
        opciones: [
            "Solo está prohibido adelantar a vehículos pesados.",
            "Está prohibido adelantar en el tramo señalizado.",
            "Se puede adelantar si se hace rápidamente."
        ],
        correcta: 1,
        explicacion: "La señal prohíbe realizar adelantamientos en el tramo afectado."
    }
];

// ------------------------------------------------------------
// VARIABLES DEL EXAMEN
// ------------------------------------------------------------

let preguntaActual = 0;
let respuestasUsuario = Array(preguntas.length).fill(null);

let segundosRestantes = DURACION_SEGUNDOS;
let temporizador = null;

let examenFinalizado = false;
let guardandoResultado = false;

let usuarioActual = null;

// ------------------------------------------------------------
// ELEMENTOS HTML
// ------------------------------------------------------------

const pantallaExamen = document.getElementById("pantalla-examen");
const pantallaResultado = document.getElementById("pantalla-resultado");

const textoPregunta = document.getElementById("texto-pregunta");
const opcionesContainer = document.getElementById("opciones");

const numeroPregunta = document.getElementById("numero-pregunta");
const totalPreguntas = document.getElementById("total-preguntas");

const progreso = document.getElementById("progreso");
const contador = document.getElementById("contador");

const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnFinalizar = document.getElementById("btn-finalizar");

const btnRepetir = document.getElementById("btn-repetir");

const resultadoTitulo = document.getElementById("resultado-titulo");
const resultadoPuntuacion = document.getElementById("resultado-puntuacion");
const resultadoPorcentaje = document.getElementById("resultado-porcentaje");
const resultadoTiempo = document.getElementById("resultado-tiempo");
const resultadoRevision = document.getElementById("resultado-revision");

const resultadoCard = document.querySelector(".resultado-card");

const nombreAlumno = document.getElementById("nombre-alumno");

// ------------------------------------------------------------
// INICIO SEGURO DEL EXAMEN
// ------------------------------------------------------------

async function iniciarExamenSeguro() {

    try {

        if (typeof cliente === "undefined") {
            console.error("No se ha encontrado el cliente de Supabase.");
            window.location.href = "login.html";
            return;
        }

        const { data, error } = await cliente.auth.getSession();

        if (error) {
            console.error("Error comprobando la sesión:", error);
            window.location.href = "login.html";
            return;
        }

        if (!data.session) {
            window.location.href = "login.html";
            return;
        }

        usuarioActual = data.session.user;

        const nombre =
            usuarioActual.user_metadata?.full_name ||
            usuarioActual.user_metadata?.name ||
            "Alumno";

        if (nombreAlumno) {
            nombreAlumno.textContent = nombre;
        }

        if (totalPreguntas) {
            totalPreguntas.textContent = preguntas.length;
        }

        actualizarCronometro();
        mostrarPregunta();
        iniciarCronometro();

    } catch (error) {

        console.error("Error iniciando el examen:", error);
        window.location.href = "login.html";
    }
}

// ------------------------------------------------------------
// MOSTRAR PREGUNTA
// ------------------------------------------------------------

function mostrarPregunta() {

    const pregunta = preguntas[preguntaActual];

    numeroPregunta.textContent = preguntaActual + 1;
    textoPregunta.textContent = pregunta.pregunta;

    opcionesContainer.innerHTML = "";

    pregunta.opciones.forEach((opcion, indice) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "opcion";

        boton.innerHTML = `
            <span class="letra-opcion">${String.fromCharCode(65 + indice)}</span>
            <span>${opcion}</span>
        `;

        if (respuestasUsuario[preguntaActual] === indice) {
            boton.classList.add("seleccionada");
        }

        boton.addEventListener("click", () => {
            seleccionarRespuesta(indice);
        });

        opcionesContainer.appendChild(boton);
    });

    actualizarNavegacion();
    actualizarProgreso();
}

// ------------------------------------------------------------
// SELECCIONAR RESPUESTA
// ------------------------------------------------------------

function seleccionarRespuesta(indice) {

    if (examenFinalizado) {
        return;
    }

    respuestasUsuario[preguntaActual] = indice;

    const botones = opcionesContainer.querySelectorAll(".opcion");

    botones.forEach((boton, i) => {
        boton.classList.toggle(
            "seleccionada",
            i === indice
        );
    });

    actualizarNavegacion();
    actualizarProgreso();
}

// ------------------------------------------------------------
// NAVEGACIÓN
// ------------------------------------------------------------

function actualizarNavegacion() {

    btnAnterior.disabled = preguntaActual === 0;

    if (preguntaActual === preguntas.length - 1) {
        btnSiguiente.classList.add("oculto");
        btnFinalizar.classList.remove("oculto");
    } else {
        btnSiguiente.classList.remove("oculto");
        btnFinalizar.classList.add("oculto");
    }
}

function siguientePregunta() {

    if (examenFinalizado) {
        return;
    }

    if (preguntaActual < preguntas.length - 1) {

        preguntaActual++;

        mostrarPregunta();
    }
}

function anteriorPregunta() {

    if (examenFinalizado) {
        return;
    }

    if (preguntaActual > 0) {

        preguntaActual--;

        mostrarPregunta();
    }
}

// ------------------------------------------------------------
// PROGRESO
// ------------------------------------------------------------

function actualizarProgreso() {

    const respondidas = respuestasUsuario.filter(
        respuesta => respuesta !== null
    ).length;

    const porcentaje = (respondidas / preguntas.length) * 100;

    if (progreso) {
        progreso.style.width = `${porcentaje}%`;
    }
}

// ------------------------------------------------------------
// CRONÓMETRO
// ------------------------------------------------------------

function iniciarCronometro() {

    clearInterval(temporizador);

    temporizador = setInterval(() => {

        if (examenFinalizado) {
            clearInterval(temporizador);
            return;
        }

        segundosRestantes--;

        actualizarCronometro();

        if (segundosRestantes <= 0) {

            segundosRestantes = 0;

            actualizarCronometro();

            finalizarExamen(true);
        }

    }, 1000);
}

function actualizarCronometro() {

    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;

    const minutosTexto = String(minutos).padStart(2, "0");
    const segundosTexto = String(segundos).padStart(2, "0");

    if (contador) {
        contador.textContent =
            `${minutosTexto}:${segundosTexto}`;
    }

    if (contador) {

        contador.classList.remove("urgente");

        if (segundosRestantes <= 60) {
            contador.classList.add("urgente");
        }
    }
}

// ------------------------------------------------------------
// FINALIZAR EXAMEN
// ------------------------------------------------------------

async function finalizarExamen(automatico = false) {

    if (examenFinalizado || guardandoResultado) {
        return;
    }

    examenFinalizado = true;

    clearInterval(temporizador);

    const tiempoEmpleado =
        DURACION_SEGUNDOS - segundosRestantes;

    let aciertos = 0;

    preguntas.forEach((pregunta, indice) => {

        if (
            respuestasUsuario[indice] ===
            pregunta.correcta
        ) {
            aciertos++;
        }
    });

    const porcentaje =
        Math.round((aciertos / preguntas.length) * 100);

    const apto =
        aciertos >= MINIMO_APTO;

    mostrarResultado(
        aciertos,
        porcentaje,
        tiempoEmpleado,
        apto,
        automatico
    );

    // --------------------------------------------------------
    // GUARDAR RESULTADO EN SUPABASE
    // --------------------------------------------------------

    guardandoResultado = true;

    mostrarEstadoGuardado(
        "💾 Guardando resultado..."
    );

    if (btnRepetir) {
        btnRepetir.disabled = true;
    }

    try {

        await guardarResultado(
            aciertos,
            porcentaje,
            tiempoEmpleado,
            apto
        );

        mostrarEstadoGuardado(
            "✅ Resultado guardado en tu historial."
        );

    } catch (error) {

        console.error(
            "Error guardando el resultado:",
            error
        );

        mostrarEstadoGuardado(
            "⚠️ El resultado se ha calculado, pero no se ha podido guardar en tu historial. Inténtalo de nuevo o contacta con el centro."
        );

    } finally {

        guardandoResultado = false;

        if (btnRepetir) {
            btnRepetir.disabled = false;
        }
    }
}

// ------------------------------------------------------------
// GUARDAR RESULTADO EN SUPABASE
// ------------------------------------------------------------

async function guardarResultado(
    aciertos,
    porcentaje,
    tiempoEmpleado,
    apto
) {

    if (!usuarioActual) {
        throw new Error(
            "No hay una sesión de alumno activa."
        );
    }

    // --------------------------------------------------------
    // 1. GUARDAR EL INTENTO
    // --------------------------------------------------------

    const {
        data: intento,
        error: intentoError
    } = await cliente
        .from("attempts")
        .insert({
            user_id: usuarioActual.id,
            test_name: "Test Permiso B · Normativa general",
            total_questions: preguntas.length,
            correct_answers: aciertos,
            percentage: porcentaje,
            passed: apto,
            elapsed_seconds: tiempoEmpleado
        })
        .select("id")
        .single();

    if (intentoError) {
        throw intentoError;
    }

    if (!intento || !intento.id) {
        throw new Error(
            "Supabase no devolvió el identificador del intento."
        );
    }

    // --------------------------------------------------------
    // 2. GUARDAR LAS RESPUESTAS
    // --------------------------------------------------------

    const respuestas = preguntas.map(
        (pregunta, indice) => {

            const seleccion =
                respuestasUsuario[indice];

            return {
                attempt_id: intento.id,
                question_id: String(indice + 1),
                selected_option: seleccion,
                is_correct:
                    seleccion === pregunta.correcta
            };
        }
    );

    const {
        error: respuestasError
    } = await cliente
        .from("attempt_answers")
        .insert(respuestas);

    if (respuestasError) {
        throw respuestasError;
    }
}

// ------------------------------------------------------------
// MOSTRAR RESULTADO
// ------------------------------------------------------------

function mostrarResultado(
    aciertos,
    porcentaje,
    tiempoEmpleado,
    apto,
    automatico
) {

    if (pantallaExamen) {
        pantallaExamen.classList.add("oculto");
    }

    if (pantallaResultado) {
        pantallaResultado.classList.remove("oculto");
    }

    if (resultadoTitulo) {

        resultadoTitulo.textContent =
            apto ? "¡APTO!" : "NO APTO";

        resultadoTitulo.classList.remove(
            "apto",
            "no-apto"
        );

        resultadoTitulo.classList.add(
            apto ? "apto" : "no-apto"
        );
    }

    if (resultadoPuntuacion) {

        resultadoPuntuacion.textContent =
            `${aciertos} / ${preguntas.length}`;
    }

    if (resultadoPorcentaje) {

        resultadoPorcentaje.textContent =
            `${porcentaje}%`;
    }

    if (resultadoTiempo) {

        resultadoTiempo.textContent =
            formatearTiempo(tiempoEmpleado);
    }

    mostrarRevision();

    if (automatico) {

        const aviso = document.createElement("p");

        aviso.className = "aviso-tiempo";

        aviso.textContent =
            "⏱️ El tiempo ha terminado. El examen se ha corregido automáticamente.";

        if (resultadoCard) {
            resultadoCard.appendChild(aviso);
        }
    }
}

// ------------------------------------------------------------
// ESTADO DEL GUARDADO
// ------------------------------------------------------------

function mostrarEstadoGuardado(mensaje) {

    let elemento =
        document.getElementById("estado-guardado");

    if (!elemento) {

        elemento = document.createElement("p");

        elemento.id = "estado-guardado";

        elemento.style.marginTop = "15px";
        elemento.style.fontWeight = "600";

        if (resultadoCard) {
            resultadoCard.appendChild(elemento);
        }
    }

    elemento.textContent = mensaje;
}

// ------------------------------------------------------------
// REVISIÓN DE RESPUESTAS
// ------------------------------------------------------------

function mostrarRevision() {

    if (!resultadoRevision) {
        return;
    }

    resultadoRevision.innerHTML = "";

    preguntas.forEach((pregunta, indice) => {

        const seleccion =
            respuestasUsuario[indice];

        const correcta =
            seleccion === pregunta.correcta;

        const bloque =
            document.createElement("div");

        bloque.className =
            `revision-item ${correcta ? "correcta" : "incorrecta"}`;

        let respuestaAlumno = "Sin responder";

        if (seleccion !== null) {

            respuestaAlumno =
                `${String.fromCharCode(65 + seleccion)}. ${pregunta.opciones[seleccion]}`;
        }

        const respuestaCorrecta =
            `${String.fromCharCode(65 + pregunta.correcta)}. ${pregunta.opciones[pregunta.correcta]}`;

        bloque.innerHTML = `
            <div class="revision-cabecera">
                <strong>Pregunta ${indice + 1}</strong>
                <span>${correcta ? "✓ Correcta" : "✗ Incorrecta"}</span>
            </div>

            <p class="revision-pregunta">
                ${pregunta.pregunta}
            </p>

            <p>
                <strong>Tu respuesta:</strong>
                ${respuestaAlumno}
            </p>

            <p>
                <strong>Respuesta correcta:</strong>
                ${respuestaCorrecta}
            </p>

            <p>
                <strong>Explicación:</strong>
                ${pregunta.explicacion}
            </p>
        `;

        resultadoRevision.appendChild(bloque);
    });
}

// ------------------------------------------------------------
// FORMATEAR TIEMPO
// ------------------------------------------------------------

function formatearTiempo(segundosTotales) {

    const minutos =
        Math.floor(segundosTotales / 60);

    const segundos =
        segundosTotales % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

// ------------------------------------------------------------
// REPETIR EXAMEN
// ------------------------------------------------------------

function reiniciarExamen() {

    clearInterval(temporizador);

    preguntaActual = 0;

    respuestasUsuario =
        Array(preguntas.length).fill(null);

    segundosRestantes =
        DURACION_SEGUNDOS;

    examenFinalizado = false;

    guardandoResultado = false;

    const estadoGuardado =
        document.getElementById("estado-guardado");

    if (estadoGuardado) {
        estadoGuardado.remove();
    }

    document
        .querySelectorAll(".aviso-tiempo")
        .forEach(elemento => elemento.remove());

    if (pantallaResultado) {
        pantallaResultado.classList.add("oculto");
    }

    if (pantallaExamen) {
        pantallaExamen.classList.remove("oculto");
    }

    if (btnRepetir) {
        btnRepetir.disabled = false;
    }

    actualizarCronometro();
    mostrarPregunta();
    iniciarCronometro();
}

// ------------------------------------------------------------
// EVENTOS
// ------------------------------------------------------------

if (btnAnterior) {

    btnAnterior.addEventListener(
        "click",
        anteriorPregunta
    );
}

if (btnSiguiente) {

    btnSiguiente.addEventListener(
        "click",
        siguientePregunta
    );
}

if (btnFinalizar) {

    btnFinalizar.addEventListener(
        "click",
        () => finalizarExamen(false)
    );
}

if (btnRepetir) {

    btnRepetir.addEventListener(
        "click",
        reiniciarExamen
    );
}

// ------------------------------------------------------------
// ARRANCAR
// ------------------------------------------------------------

iniciarExamenSeguro();
