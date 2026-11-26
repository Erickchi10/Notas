# Notas

Bloc de notas con **Vue.js 3** y **Bootstrap 5** — Prácticas 5 y 6 de Programación Web (AEB-1055).

**Carrera:** Ingeniería en Sistemas Computacionales - ITESCAM
**Equipo:** TacoCoders
**Responsable:** Erick Chi Calán

### Integrantes

- Josue Hilario Cab Ku
- Erick Chi Calán
- Luis Sánchez Ucán
- Mauricio Cih Koh
- Tommy Can Mut

---

# Práctica 5. Aplicaciones del lado del cliente

## Descripción

Aplicación web para registrar notas, basada en la imagen del manual (*Simple note taking app*).
Las notas dependen de cada usuario: primero se elige el usuario y la app muestra y maneja solo sus notas.
El diseño se hizo con **Bootstrap** y toda la funcionalidad con **Vue.js 3**, sin recargar la página.

### Funcionalidades

- Elegir usuario y ver solo sus notas, de la más nueva a la más vieja.
- **Agregar** nota con texto, color y fecha automática.
- **Editar** y **borrar** notas (con confirmación).
- **Validación** de los campos de captura:
  - la nota no puede ir vacía ni solo con espacios;
  - mínimo 3 y máximo 200 caracteres (con contador);
  - no se permiten notas repetidas del mismo usuario (ignora acentos, mayúsculas y espacios);
  - debe haber un usuario elegido y el color debe ser válido.
- Texto blanco u oscuro automático según el color de la nota, para que siempre se lea.
- Cambio de idioma **español / inglés** con un botón, sin recargar.

## Modelo de datos

Cada entidad es un archivo JSON dentro de `data/`, accesible en el servidor.
Por ahora son datos fijos; después se sustituirán por modelos dinámicos.

```
usuarios.json   id, nombre, usuario, correo
notas.json      id, usuarioId, texto, color, fecha
```

`notas.usuarioId` apunta a `usuarios.id`, por eso cada nota pertenece a un usuario.

## Estructura

```
index.html        Vista de la app (plantilla de Vue + Bootstrap)
css/app.css       Estilos propios
js/app.js         Lógica de la app con Vue.js 3
js/idiomas.js     Textos en español e inglés
data/             Modelo de datos (usuarios.json, notas.json)
lib/              Bootstrap 5.3.8 y Vue 3.5 descargados
```

## Cómo probar

1. Copiar `index.html`, `css`, `js`, `data` y `lib` a `app-laravel/public/notas/` del entorno Docker de la Práctica 1.
2. Abrir <http://localhost:8000/notas/index.html>
3. Los JSON quedan disponibles en <http://localhost:8000/notas/data/notas.json> y `.../usuarios.json`.

En desarrollo también se puede abrir con la extensión *Live Server* de VS Code. No funciona abriendo
el archivo con doble clic, porque `fetch` necesita un servidor.

> Los cambios (agregar, editar, borrar) viven en memoria mientras la página está abierta: los JSON son
> fijos y todavía no hay un servidor que los guarde. Al recargar, la app vuelve a los datos del JSON.

## Ramas

- `main`: versión estable.
- `desarrollo`: rama de trabajo de la Práctica 5 (se mezcló a `main` y no se borró).

## Plan de trabajo

| #  | Tarea                                                    | Estimado |
|----|----------------------------------------------------------|----------|
| 1  | Crear repo `Notas`, clonarlo y crear la rama `desarrollo` | 15 min   |
| 2  | Estructura del proyecto con Bootstrap y Vue.js descargados | 15 min   |
| 3  | Modelo de datos: `usuarios.json` y `notas.json`          | 20 min   |
| 4  | Página base con Bootstrap (encabezado, formulario, lista) | 25 min   |
| 5  | Cargar los JSON y elegir el usuario con Vue              | 30 min   |
| 6  | Agregar nota (texto, color y fecha)                      | 25 min   |
| 7  | Editar y borrar notas                                    | 30 min   |
| 8  | Validación de los campos de captura                      | 25 min   |
| 9  | Cambio de idioma ES / EN                                 | 25 min   |
| 10 | Publicar en Docker y probar                              | 20 min   |
| 11 | Commit, push y merge a `main`                            | 15 min   |
| 12 | README, tabla comparativa y conclusiones                 | 25 min   |
|    | **Total**                                                | **4 h 30 min** |

## Comparativa de tiempos

Tiempos registrados en TopTracker (proyecto *Practica 5 - Notas*, una actividad por tarea), tomados de
la sección *My activities*. TopTracker redondea cada actividad hacia abajo; el total que reporta es
1 h 01 min.

| #  | Tarea                                                    | Estimado   | Real (TopTracker) | Diferencia |
|----|----------------------------------------------------------|------------|-------------------|------------|
| 1  | Crear repo `Notas`, clonarlo y crear la rama `desarrollo` | 15 min     | 3 min             | -12 min    |
| 2  | Estructura del proyecto con Bootstrap y Vue.js descargados | 15 min     | 2 min             | -13 min    |
| 3  | Modelo de datos: `usuarios.json` y `notas.json`          | 20 min     | 3 min             | -17 min    |
| 4  | Página base con Bootstrap (encabezado, formulario, lista) | 25 min     | 6 min             | -19 min    |
| 5  | Cargar los JSON y elegir el usuario con Vue              | 30 min     | 7 min             | -23 min    |
| 6  | Agregar nota (texto, color y fecha)                      | 25 min     | 7 min             | -18 min    |
| 7  | Editar y borrar notas                                    | 30 min     | 8 min             | -22 min    |
| 8  | Validación de los campos de captura                      | 25 min     | 10 min            | -15 min    |
| 9  | Cambio de idioma ES / EN                                 | 25 min     | 5 min             | -20 min    |
| 10 | Publicar en Docker y probar                              | 20 min     | 1 min             | -19 min    |
| 11 | Commit, push y merge a `main`                            | 15 min     | 1 min             | -14 min    |
| 12 | README, tabla comparativa y conclusiones                 | 25 min     | 1 min             | -24 min    |
|    | **Total (reporte de TopTracker)**                        | **4 h 30 min** | **1 h 01 min** | **-3 h 29 min** |

## Conclusiones

El tiempo estimado fue de 4 horas con 30 minutos y el tiempo real registrado en TopTracker fue de
1 hora con 1 minuto, 3 horas con 29 minutos menos. Igual que en la Práctica 4, la estimación se hizo
pensando en escribir todo desde cero y buscar documentación, pero el trabajo se hizo siguiendo una guía
paso a paso con el código ya planeado y probado. Bootstrap resolvió el diseño con clases ya hechas, y
las tareas de preparación (repositorio, librerías, JSON y Docker) tomaron entre 1 y 3 minutos.

Las tareas que más tiempo llevaron fueron las de Vue.js (de la 5 a la 8), porque ahí está la lógica de la
aplicación y fue donde más se probó. La más larga fue la validación (10 minutos): al probarla se
encontró que una nota escrita sin acentos ("practicas") no se detectaba como repetida de otra con
acentos ("prácticas"), y se corrigió normalizando el texto antes de comparar. También al probar se vio
que el texto de una nota con fondo rojo oscuro casi no se leía, y se agregó el cambio automático del
color del texto según el fondo. En otra ocasión se probó la app sin haber pegado el código nuevo en
`app.js` e `index.html`; revisar que los archivos tengan la marca de modificado en VS Code evitó perder
más tiempo.

Lo más útil de la práctica fue ver cómo Vue mantiene la vista sincronizada con los datos: con `v-model`,
`computed` y `v-for` la lista se filtra por usuario, se agregan, editan y borran notas y se cambia el
idioma sin recargar la página. Guardar cada entidad en su propio archivo JSON y relacionarlas con
`usuarioId` hace que cada nota dependa de un usuario, como pide el manual. La limitación actual es que los
cambios solo viven en memoria, porque los JSON son fijos; eso se trabaja en la Práctica 6 con peticiones
`fetch`.

El registro de la tarea 12 se detuvo antes de pasar la tabla final, para que el total del reporte no
cambiara. Para la siguiente práctica la estimación debe ser más corta, porque ya está armada la
estructura del proyecto y el entorno de pruebas.


---

# Práctica 6. Solicitud a datos

Continuación de la Práctica 5. Ahora la aplicación ya no lee los JSON directamente: **consume los datos con peticiones `fetch` usando los métodos GET, POST, PUT y DELETE** contra una pequeña API en PHP que corre en el servidor Laravel del entorno Docker. Las notas se muestran en una lista debajo del formulario y se agregan, editan y borran **sin recargar la página**.

Como pide el manual, los cambios **no se guardan en los archivos JSON**: la API valida los datos y responde como si los hubiera guardado, simulando el almacenamiento en una base de datos.

## API (`api/`)

| Método | URL | Acción | Respuesta |
|--------|-----|--------|-----------|
| GET | `api/usuarios.php` | Lista de usuarios | 200 |
| GET | `api/notas.php` | Lista de notas | 200 |
| POST | `api/notas.php` | Crear nota (valida texto, usuario y color) | 201 con la nota, su `id` y su `fecha` |
| PUT | `api/notas.php?id=N` | Actualizar nota | 200 con la nota actualizada |
| DELETE | `api/notas.php?id=N` | Borrar nota | 200 con mensaje |

Si los datos no son válidos la API responde **422** con la lista de errores; si falta el `id`, **400**; con otro método, **405**.

## Cambios en la aplicación

- `js/api.js`: funciones `fetch` para cada método (`obtenerUsuarios`, `obtenerNotas`, `crearNota`, `actualizarNota`, `borrarNota`).
- `js/app.js`: la carga inicial usa GET; agregar usa POST; editar usa PUT; borrar usa DELETE. Vue actualiza la lista con la respuesta del servidor.
- Avisos: indicador de carga, aviso rojo si falla una petición (por ejemplo sin conexión), botón *Reintentar* si falla la carga y botón *Enviando...* mientras se espera la respuesta.
- Textos nuevos en español e inglés en `js/idiomas.js`.

## Cómo probar

La API necesita PHP, por eso se prueba en el servidor del entorno Docker (Live Server no ejecuta PHP):

```
Copy-Item index.html, css, js, data, lib, api -Destination "C:\Practicas yaqui\practica-1-docker\practica-1-docker\app-laravel\public\notas" -Recurse -Force
```

Abrir `http://localhost:8000/notas/index.html` y revisar las peticiones en DevTools → Network.

## Ramas

- `main`: versión final.
- `solicitud-a-datos`: rama de trabajo de la Práctica 6 (no se borra, es evidencia).
- `desarrollo`: rama de trabajo de la Práctica 5.
- Etiquetas: `practica-5` y `practica-6`.

## Plan de trabajo

| #  | Tarea                                     | Estimado       |
|----|-------------------------------------------|----------------|
| 1  | Crear la rama `solicitud-a-datos`         | 5 min          |
| 2  | Mini API en PHP (GET, POST, PUT, DELETE)  | 25 min         |
| 3  | `api.js` con las funciones fetch          | 20 min         |
| 4  | GET: cargar usuarios y notas desde la API | 15 min         |
| 5  | POST: agregar nota                        | 15 min         |
| 6  | PUT: editar nota                          | 15 min         |
| 7  | DELETE: borrar nota                       | 10 min         |
| 8  | Lista con avisos de carga y error         | 15 min         |
| 9  | Probar en Docker y revisar Network        | 15 min         |
| 10 | Commit, push, merge a `main` y tag        | 10 min         |
| 11 | README, tabla y conclusiones              | 15 min         |
|    | **Total**                                 | **2 h 40 min** |

## Comparativa de tiempos

Tiempos tomados del reporte *My activities* de TopTracker (una actividad por tarea). TopTracker muestra cada actividad en minutos completos y redondea hacia abajo, por eso la suma de las tareas (53 min) es menor que el total que reporta para el proyecto (57 min); en la tabla se usa el total reportado.

| #  | Tarea                                     | Estimado       | Real       | Diferencia      |
|----|-------------------------------------------|----------------|------------|-----------------|
| 1  | Crear la rama `solicitud-a-datos`         | 5 min          | 2 min      | -3 min          |
| 2  | Mini API en PHP (GET, POST, PUT, DELETE)  | 25 min         | 5 min      | -20 min         |
| 3  | `api.js` con las funciones fetch          | 20 min         | 8 min      | -12 min         |
| 4  | GET: cargar usuarios y notas desde la API | 15 min         | 4 min      | -11 min         |
| 5  | POST: agregar nota                        | 15 min         | 6 min      | -9 min          |
| 6  | PUT: editar nota                          | 15 min         | 4 min      | -11 min         |
| 7  | DELETE: borrar nota                       | 10 min         | 4 min      | -6 min          |
| 8  | Lista con avisos de carga y error         | 15 min         | 13 min     | -2 min          |
| 9  | Probar en Docker y revisar Network        | 15 min         | 3 min      | -12 min         |
| 10 | Commit, push, merge a `main` y tag        | 10 min         | 2 min      | -8 min          |
| 11 | README, tabla y conclusiones              | 15 min         | 2 min      | -13 min         |
|    | **Total (reporte de TopTracker)**         | **2 h 40 min** | **57 min** | **-1 h 43 min** |

## Conclusiones

El tiempo estimado fue de 2 horas con 40 minutos y el tiempo real registrado en TopTracker fue de 57 minutos, 1 hora con 43 minutos menos. Como se planteó al terminar la Práctica 5, esta vez la estimación fue más corta (2 h 40 min contra 4 h 30 min), porque el proyecto, el entorno Docker y la interfaz ya estaban hechos; aun así el tiempo real fue cerca de un tercio del estimado, porque se siguió una guía paso a paso con el código ya planeado.

La tarea que más tiempo llevó fue la 8 (13 minutos), casi igual a lo estimado, porque tocaba tres archivos a la vez (`idiomas.js`, `app.js` e `index.html`). Al editarlos se borró por accidente la clave `formatoFecha` y quedó una comilla de más en `idiomas.js`, y en `index.html` faltaron dos cambios, así que se reemplazaron los archivos completos. Otro problema que se repitió fue probar sin haber guardado: la pestaña de VS Code tenía el punto blanco de "sin guardar" y el navegador ejecutaba el código anterior. Se detectó porque en la pestaña Network de DevTools no aparecían las peticiones POST, PUT o DELETE; se resolvió guardando, activando *Disable cache* y volviendo a copiar los archivos al servidor.

Lo más útil de la práctica fue ver cómo funcionan las peticiones `fetch` con los distintos métodos HTTP y comprobar cada una en Network: GET con 200 para leer, POST con 201 para crear, PUT y DELETE con 200 para actualizar y borrar, y el aviso de error cuando se simula estar sin conexión. Un archivo JSON estático no puede recibir POST, PUT ni DELETE, por eso se hizo una pequeña API en PHP que valida y responde como si guardara; por la misma razón la aplicación ya no se puede probar con Live Server, que no ejecuta PHP. La lista de notas se actualiza con la respuesta del servidor sin recargar la página, como pide el manual.

La limitación es que los cambios no se guardan: al recargar se vuelven a leer los JSON originales. El siguiente paso sería guardar las notas en una base de datos (por ejemplo MySQL con Laravel, que ya está en el entorno Docker), sin tener que cambiar la parte de Vue, porque toda la comunicación ya pasa por `api.js`.