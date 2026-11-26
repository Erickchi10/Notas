// ==========================================================
// Practica 5 y 6. Bloc de notas con Vue.js 3 - Equipo TacoCoders
// Practica 6: los datos se piden a la API con fetch (api.js)
// ==========================================================

const { createApp } = Vue;

// Reglas de validacion
const MIN_CARACTERES = 3;
const MAX_CARACTERES = 200;

createApp({
  // ---------- Datos de la app ----------
  data() {
    return {
      usuarios: [],      // se llenan con GET api/usuarios.php
      notas: [],         // se llenan con GET api/notas.php
      usuarioId: null,   // usuario elegido en el selector
      cargando: true,
      error: '',
      // Nota que se esta escribiendo en el formulario
      nuevaNota: {
        texto: '',
        color: '#fff3b0'
      },
      editandoId: null,      // id de la nota que se esta editando (null = nota nueva)
      intentoGuardar: false, // los errores se muestran despues del primer intento
      mensaje: '',           // aviso verde de "nota guardada"
      maxCaracteres: MAX_CARACTERES,
      idioma: 'es'           // idioma actual: 'es' o 'en'
    };
  },

  // ---------- Valores calculados ----------
  computed: {
    usuarioActual() {
      return this.usuarios.find(u => u.id === this.usuarioId);
    },
    // Solo las notas del usuario elegido, de la mas nueva a la mas vieja
    notasDelUsuario() {
      return this.notas
        .filter(n => n.usuarioId === this.usuarioId)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    // Lista de errores del formulario (vacia = todo correcto)
    errores() {
      const lista = [];
      const texto = this.nuevaNota.texto.trim();

      if (!this.usuarioActual) {
        lista.push(this.t('errUsuario'));
      }
      if (texto.length === 0) {
        lista.push(this.t('errVacia'));
      } else if (texto.length < MIN_CARACTERES) {
        lista.push(this.t('errCorta', MIN_CARACTERES));
      }
      if (this.nuevaNota.texto.length > MAX_CARACTERES) {
        lista.push(this.t('errLarga', MAX_CARACTERES));
      }
      if (!/^#[0-9a-fA-F]{6}$/.test(this.nuevaNota.color)) {
        lista.push(this.t('errColor'));
      }
      // No se permiten dos notas iguales del mismo usuario
      const repetida = this.notasDelUsuario.some(n =>
        n.id !== this.editandoId &&
        this.normalizar(n.texto) === this.normalizar(texto)
      );
      if (texto && repetida) {
        lista.push(this.t('errRepetida'));
      }
      return lista;
    },

    mostrarErrores() {
      return this.intentoGuardar && this.errores.length > 0;
    }
  },

  // ---------- Funciones ----------
  methods: {
    // Devuelve el texto de la clave en el idioma actual; {n} se cambia por valor
    t(clave, valor) {
      const texto = TEXTOS[this.idioma][clave] || clave;
      return valor !== undefined ? texto.replace('{n}', valor) : texto;
    },

    // Cambia entre espanol e ingles sin recargar la pagina
    cambiarIdioma() {
      this.idioma = this.idioma === 'es' ? 'en' : 'es';
    },

        // GET: pide los usuarios y las notas a la API
    async cargarDatos() {
      this.cargando = true;
      this.error = '';
      try {
        const [usuarios, notas] = await Promise.all([
          Api.obtenerUsuarios(),
          Api.obtenerNotas()
        ]);
        this.usuarios = usuarios;
        this.notas = notas;
        this.usuarioId = this.usuarios.length ? this.usuarios[0].id : null;
      } catch (e) {
        this.error = this.t('errorCarga') + e.message;
      } finally {
        this.cargando = false;
      }
    },

        // Guarda una nota nueva (POST) o los cambios de la que se esta editando.
    // Vue redibuja la lista sin recargar la pagina.
    async guardarNota() {
      this.intentoGuardar = true;
      if (this.errores.length > 0) return;   // no se envia si hay errores

      const texto = this.nuevaNota.texto.trim();
      const eraEdicion = this.editandoId !== null;

      try {
        if (eraEdicion) {
          // Editar (se cambia a PUT en la tarea 6)
          const nota = this.notas.find(n => n.id === this.editandoId);
          if (nota) {
            nota.texto = texto;
            nota.color = this.nuevaNota.color;
          }
        } else {
          // POST: la API valida y regresa la nota con su id y su fecha
          const creada = await Api.crearNota({
            usuarioId: this.usuarioId,
            texto: texto,
            color: this.nuevaNota.color
          });
          this.notas.push(creada);   // se agrega a la lista sin recargar
        }
        this.limpiarFormulario();
        this.avisar(this.t(eraEdicion ? 'actualizada' : 'guardada'));
      } catch (e) {
        alert(e.message);   // se cambia por un aviso en la tarea 8
      }
    },

    // Muestra un aviso verde por 2.5 segundos
    avisar(texto) {
      this.mensaje = texto;
      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(() => { this.mensaje = ''; }, 2500);
    },

    // Pasa los datos de la nota al formulario para editarla
    editarNota(nota) {
      this.editandoId = nota.id;
      this.nuevaNota.texto = nota.texto;
      this.nuevaNota.color = nota.color;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.$nextTick(() => document.getElementById('texto').focus());
    },

    // Quita la nota del arreglo despues de confirmar
    borrarNota(nota) {
      if (!confirm(this.t('confirmarBorrar', nota.texto))) return;
      this.notas = this.notas.filter(n => n.id !== nota.id);
      if (this.editandoId === nota.id) this.limpiarFormulario();
      this.avisar(this.t('borrada'));
    },

    limpiarFormulario() {
      this.editandoId = null;
      this.intentoGuardar = false;
      this.nuevaNota.texto = '';
      this.nuevaNota.color = '#fff3b0';
    },

    // Quita acentos, mayusculas y espacios de mas para comparar textos
    normalizar(texto) {
      return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
    },

    // Texto blanco sobre colores oscuros y oscuro sobre colores claros
    colorTexto(fondo) {
      const r = parseInt(fondo.substr(1, 2), 16);
      const g = parseInt(fondo.substr(3, 2), 16);
      const b = parseInt(fondo.substr(5, 2), 16);
      const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminancia < 0.55 ? '#ffffff' : '#212529';
    },

    formatearFecha(fechaISO) {
      return new Date(fechaISO).toLocaleString(this.t('formatoFecha'), {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
    }
  },

  // ---------- Vigilantes ----------
  watch: {
    // Si cambia el usuario, se cancela la edicion pendiente
    usuarioId() {
      this.limpiarFormulario();
    },
    // Actualiza el atributo lang de la pagina al cambiar de idioma
    idioma(nuevo) {
      document.documentElement.lang = nuevo;
      document.title = this.t('marca') + ' - TacoCoders';
    }
  },

  // ---------- Al iniciar la app ----------
  mounted() {
    this.cargarDatos();
  }
}).mount('#app');