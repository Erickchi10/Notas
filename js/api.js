// ==========================================================
// Practica 6. Solicitud a datos
// Peticiones fetch a la API: GET, POST, PUT y DELETE
// ==========================================================

const API_URL = 'api';

// Hace la peticion y devuelve el JSON de respuesta.
// Si el servidor responde con error (400, 404, 422...), lanza una excepcion.
async function pedir(url, opciones = {}) {
  const respuesta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const mensaje = datos.errores ? datos.errores.join(' ') : (datos.error || respuesta.statusText);
    throw new Error(mensaje);
  }
  return datos;
}

const Api = {
  // GET: leer datos
  obtenerUsuarios() {
    return pedir(`${API_URL}/usuarios.php`);
  },
  obtenerNotas() {
    return pedir(`${API_URL}/notas.php`);
  },
  // POST: crear una nota
  crearNota(nota) {
    return pedir(`${API_URL}/notas.php`, { method: 'POST', body: JSON.stringify(nota) });
  },
  // PUT: actualizar una nota
  actualizarNota(nota) {
    return pedir(`${API_URL}/notas.php?id=${nota.id}`, { method: 'PUT', body: JSON.stringify(nota) });
  },
  // DELETE: borrar una nota
  borrarNota(id) {
    return pedir(`${API_URL}/notas.php?id=${id}`, { method: 'DELETE' });
  }
};