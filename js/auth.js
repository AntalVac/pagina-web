/*
 * AntalVac - autenticación provisional para GitHub Pages.
 *
 * Esta primera versión permite probar el flujo completo sin servidor:
 * - registro de alumnos
 * - inicio/cierre de sesión
 * - sesión del alumno
 * - historial de resultados por alumno
 *
 * IMPORTANTE: es una versión de prototipo. Los datos viven en el navegador.
 * Para producción sustituiremos esta capa por Supabase Auth + base de datos.
 */

const ANTALVAC_SESSION_KEY = "antalvac_sesion";
const ANTALVAC_USERS_KEY = "antalvac_usuarios";

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(ANTALVAC_USERS_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(ANTALVAC_USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function registrarAlumno(nombre, email, password) {
    const users = getUsers();
    const correo = email.trim().toLowerCase();

    if (!nombre.trim() || !correo || password.length < 6) {
        return { ok: false, mensaje: "Completa todos los campos y utiliza una contraseña de al menos 6 caracteres." };
    }

    if (users.some(user => user.email === correo)) {
        return { ok: false, mensaje: "Ya existe un alumno con ese correo electrónico." };
    }

    const passwordHash = await hashPassword(password);
    users.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        nombre: nombre.trim(),
        email: correo,
        passwordHash,
        creado: new Date().toISOString()
    });

    saveUsers(users);
    iniciarSesion({ nombre: nombre.trim(), email: correo });
    return { ok: true };
}

async function iniciarSesionConPassword(email, password) {
    const correo = email.trim().toLowerCase();
    const users = getUsers();
    const user = users.find(item => item.email === correo);

    if (!user) {
        return { ok: false, mensaje: "No existe una cuenta con ese correo." };
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
        return { ok: false, mensaje: "La contraseña no es correcta." };
    }

    iniciarSesion({ id: user.id, nombre: user.nombre, email: user.email });
    return { ok: true };
}

function iniciarSesion(usuario) {
    sessionStorage.setItem(ANTALVAC_SESSION_KEY, JSON.stringify({
        id: usuario.id || null,
        nombre: usuario.nombre,
        email: usuario.email,
        inicio: new Date().toISOString()
    }));
}

function getSesion() {
    try {
        return JSON.parse(sessionStorage.getItem(ANTALVAC_SESSION_KEY));
    } catch (error) {
        return null;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem(ANTALVAC_SESSION_KEY);
    window.location.href = "login.html";
}

function exigirSesion() {
    const sesion = getSesion();
    if (!sesion) {
        window.location.href = "login.html";
        return null;
    }
    return sesion;
}

function historialKey() {
    const sesion = getSesion();
    return sesion ? `antalvac_historial_${sesion.email}` : null;
}

function obtenerHistorial() {
    const key = historialKey();
    if (!key) return [];
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

function guardarResultado(resultado) {
    const key = historialKey();
    if (!key) return false;

    const historial = obtenerHistorial();
    historial.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        fecha: new Date().toISOString(),
        ...resultado
    });
    localStorage.setItem(key, JSON.stringify(historial.slice(0, 100)));
    return true;
}
