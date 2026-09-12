const preguntas = [
    {
        pregunta: "Ante una señal de STOP, ¿qué debe hacer el conductor?",
        respuestas: ["Reducir la velocidad y continuar si no viene ningún vehículo.", "Detenerse obligatoriamente.", "Detenerse solo si existe tráfico en la vía principal."],
        correcta: 1,
        explicacion: "La señal STOP obliga a detenerse ante la línea de detención, y si no existe, antes de la intersección."
    },
    {
        pregunta: "¿Qué debe hacer un conductor antes de iniciar una maniobra que pueda afectar a otros usuarios?",
        respuestas: ["Comprobar que puede realizarla sin peligro y señalizarla cuando corresponda.", "Realizarla rápidamente para reducir el tiempo de riesgo.", "Avisar únicamente mediante el claxon."],
        correcta: 0,
        explicacion: "Antes de una maniobra se debe comprobar que puede realizarse con seguridad y señalizarla cuando sea necesario."
    },
    {
        pregunta: "En una vía de doble sentido, ¿por qué lado de la calzada debe circular normalmente un turismo?",
        respuestas: ["Por el lado derecho.", "Por el centro de la calzada.", "Por el lado izquierdo."],
        correcta: 0,
        explicacion: "Como regla general, los vehículos deben circular por la derecha y lo más cerca posible del borde derecho."
    },
    {
        pregunta: "¿Qué indica una luz roja fija de un semáforo?",
        respuestas: ["Que se puede pasar extremando la precaución.", "Que hay que detenerse.", "Que solo deben detenerse los vehículos pesados."],
        correcta: 1,
        explicacion: "La luz roja fija prohíbe el paso y obliga a detenerse."
    },
    {
        pregunta: "¿Para qué sirve principalmente el cinturón de seguridad?",
        respuestas: ["Para mejorar la postura del conductor.", "Para reducir el riesgo de lesiones en caso de accidente.", "Para evitar que se abra una puerta durante la marcha."],
        correcta: 1,
        explicacion: "El cinturón ayuda a sujetar a los ocupantes y reduce las consecuencias de una colisión."
    },
    {
        pregunta: "Si se aproxima a un paso para peatones y hay peatones cruzando, ¿qué debe hacer?",
        respuestas: ["Aumentar la velocidad para pasar antes.", "Detenerse y cederles el paso cuando sea necesario.", "Tocar el claxon para que se aparten."],
        correcta: 1,
        explicacion: "El conductor debe respetar la prioridad de los peatones cuando corresponda y detenerse si es necesario."
    },
    {
        pregunta: "¿Qué debe hacer si nota síntomas de fatiga durante la conducción?",
        respuestas: ["Aumentar la velocidad para llegar antes.", "Bajar la ventanilla y continuar siempre.", "Detenerse en un lugar seguro y descansar."],
        correcta: 2,
        explicacion: "La fatiga disminuye la capacidad de conducción. Lo adecuado es parar en un lugar seguro y descansar."
    },
    {
        pregunta: "¿Qué debe comprobar antes de cambiar de carril?",
        respuestas: ["Que el nuevo carril está libre y que la maniobra puede realizarse con seguridad.", "Solo que no haya vehículos delante.", "Solo que el vehículo que circula detrás vaya despacio."],
        correcta: 0,
        explicacion: "Hay que comprobar el tráfico, los espejos y el ángulo muerto, y señalizar la maniobra cuando corresponda."
    },
    {
        pregunta: "Cuando llueve intensamente, ¿qué medida es especialmente recomendable?",
        respuestas: ["Aumentar la velocidad para atravesar antes la zona de lluvia.", "Adaptar la velocidad y aumentar la distancia de seguridad.", "Circular con las luces apagadas para evitar reflejos."],
        correcta: 1,
        explicacion: "La lluvia puede reducir la adherencia y la visibilidad, por lo que conviene adaptar la velocidad y aumentar la distancia."
    },
    {
        pregunta: "¿Qué debe hacer ante una señal que prohíbe adelantar?",
        respuestas: ["Adelantar si el vehículo precedente circula muy despacio.", "No adelantar mientras esté vigente la prohibición.", "Adelantar únicamente a los vehículos pesados."],
        correcta: 1,
        explicacion: "Una señal de prohibición de adelantar debe respetarse mientras sea aplicable."
    }
];

const DURACION_SEGUNDOS = 15 * 60;
const MINIMO_APTO = 7;

let preguntaActual = 0;
let respuestasUsuario = Array(preguntas.length).fill(null);
let segundosRestantes = DURACION_SEGUNDOS;
let temporizador = null;
let examenFinalizado = false;

const pantallaExamen = document.getElementById("pantalla-examen");
const pantallaResultado = document.getElementById("pantalla-resultado");
const numeroPregunta = document.getElementById("numero-pregunta");
const textoPregunta = document.getElementById("texto-pregunta");
const respuestas = document.getElementById("respuestas");
const preguntaActualTexto = document.getElementById("pregunta-actual-texto");
const barraProgreso = document.getElementById("barra-progreso");
const navegadorPreguntas = document.getElementById("navegador-preguntas");
const cronometro = document.getElementById("cronometro");
const barraTiempo = document.getElementById("barra-tiempo");
const cronometroCard = document.getElementById("cronometro-card");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnRepetir = document.getElementById("btn-repetir");

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    numeroPregunta.textContent = preguntaActual + 1;
    preguntaActualTexto.textContent = `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;
    textoPregunta.textContent = pregunta.pregunta;
    barraProgreso.style.width = `${((preguntaActual + 1) / preguntas.length) * 100}%`;

    respuestas.innerHTML = "";
    pregunta.respuestas.forEach((texto, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "respuesta";
        boton.setAttribute("role", "radio");
        boton.setAttribute("aria-checked", respuestasUsuario[preguntaActual] === indice ? "true" : "false");
        boton.innerHTML = `
            <span class="respuesta-radio" aria-hidden="true"></span>
            <span class="respuesta-letra">${String.fromCharCode(65 + indice)}</span>
            <span class="respuesta-texto">${texto}</span>
        `;

        if (respuestasUsuario[preguntaActual] === indice) {
            boton.classList.add("seleccionada");
        }

        boton.addEventListener("click", () => seleccionarRespuesta(indice));
        respuestas.appendChild(boton);
    });

    btnAnterior.disabled = preguntaActual === 0;
    btnSiguiente.textContent = preguntaActual === preguntas.length - 1 ? "Ver resultado →" : "Siguiente →";
    actualizarNavegador();
}

function seleccionarRespuesta(indice) {
    if (examenFinalizado) return;
    respuestasUsuario[preguntaActual] = indice;
    mostrarPregunta();
}

function actualizarNavegador() {
    navegadorPreguntas.innerHTML = "";
    preguntas.forEach((_, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "nav-pregunta";
        boton.textContent = indice + 1;
        boton.setAttribute("aria-label", `Ir a la pregunta ${indice + 1}`);

        if (indice === preguntaActual) boton.classList.add("actual");
        if (respuestasUsuario[indice] !== null) boton.classList.add("respondida");

        boton.addEventListener("click", () => {
            preguntaActual = indice;
            mostrarPregunta();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        navegadorPreguntas.appendChild(boton);
    });
}

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60).toString().padStart(2, "0");
    const segundosRestantesLocal = (segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${segundosRestantesLocal}`;
}

function actualizarCronometro() {
    cronometro.textContent = formatearTiempo(segundosRestantes);
    barraTiempo.style.width = `${(segundosRestantes / DURACION_SEGUNDOS) * 100}%`;

    if (segundosRestantes <= 60) {
        cronometroCard.classList.add("urgente");
    } else {
        cronometroCard.classList.remove("urgente");
    }
}

function iniciarCronometro() {
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        if (segundosRestantes <= 0) {
            clearInterval(temporizador);
            finalizarExamen(true);
            return;
        }
        segundosRestantes--;
        actualizarCronometro();
    }, 1000);
}

function finalizarExamen(automatico = false) {
    if (examenFinalizado) return;

    const sinResponder = respuestasUsuario.filter(respuesta => respuesta === null).length;
    if (!automatico && sinResponder > 0) {
        const confirmar = window.confirm(`Todavía tienes ${sinResponder} pregunta(s) sin responder. ¿Quieres finalizar el test?`);
        if (!confirmar) return;
    }

    examenFinalizado = true;
    clearInterval(temporizador);

    let aciertos = 0;
    preguntas.forEach((pregunta, indice) => {
        if (respuestasUsuario[indice] === pregunta.correcta) aciertos++;
    });

    const porcentaje = Math.round((aciertos / preguntas.length) * 100);
    const tiempoEmpleado = DURACION_SEGUNDOS - segundosRestantes;
    const apto = aciertos >= MINIMO_APTO;

    document.getElementById("resultado-icono").textContent = apto ? "✓" : "×";
    document.getElementById("resultado-titulo").textContent = apto ? "APTO" : "NO APTO";
    document.getElementById("resultado-subtitulo").textContent = automatico
        ? "El tiempo se ha agotado y el test se ha corregido automáticamente."
        : apto ? "Has superado el test de práctica." : "No has alcanzado el mínimo de aciertos en esta práctica.";
    document.getElementById("resultado-aciertos").textContent = `${aciertos} / ${preguntas.length}`;
    document.getElementById("resultado-porcentaje").textContent = `${porcentaje} %`;
    document.getElementById("resultado-tiempo").textContent = formatearTiempo(tiempoEmpleado);

    const resultadoCard = document.querySelector(".resultado-card");
    resultadoCard.classList.toggle("no-apto", !apto);

    const revision = document.getElementById("revision");
    revision.innerHTML = "";
    preguntas.forEach((pregunta, indice) => {
        const respuestaUsuario = respuestasUsuario[indice];
        const correcta = respuestaUsuario === pregunta.correcta;
        const respuestaTexto = respuestaUsuario === null ? "Sin responder" : `${String.fromCharCode(65 + respuestaUsuario)}. ${pregunta.respuestas[respuestaUsuario]}`;
        const correctaTexto = `${String.fromCharCode(65 + pregunta.correcta)}. ${pregunta.respuestas[pregunta.correcta]}`;

        const item = document.createElement("article");
        item.className = "revision-item";
        item.innerHTML = `
            <div class="revision-pregunta">${indice + 1}. ${pregunta.pregunta}</div>
            <div class="revision-respuesta ${correcta ? "correcta" : "incorrecta"}">
                ${correcta ? "✓" : "✗"} Tu respuesta: ${respuestaTexto}
            </div>
            ${correcta ? "" : `<div class="revision-respuesta correcta">✓ Respuesta correcta: ${correctaTexto}</div>`}
            <div class="revision-explicacion">${pregunta.explicacion}</div>
        `;
        revision.appendChild(item);
    });

    pantallaExamen.classList.add("oculto");
    pantallaResultado.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function reiniciarExamen() {
    preguntaActual = 0;
    respuestasUsuario = Array(preguntas.length).fill(null);
    segundosRestantes = DURACION_SEGUNDOS;
    examenFinalizado = false;
    pantallaResultado.classList.add("oculto");
    pantallaExamen.classList.remove("oculto");
    actualizarCronometro();
    mostrarPregunta();
    iniciarCronometro();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

btnAnterior.addEventListener("click", () => {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

btnSiguiente.addEventListener("click", () => {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        finalizarExamen();
    }
});

btnFinalizar.addEventListener("click", () => finalizarExamen(false));
btnRepetir.addEventListener("click", reiniciarExamen);

actualizarCronometro();
mostrarPregunta();
iniciarCronometro();
