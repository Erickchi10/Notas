// ==========================================================
// Practica 5. Aplicaciones del lado del cliente
// Bloc de notas con Vue.js 3 - Equipo TacoCoders
// ==========================================================

const { createApp } = Vue;

// Reglas de validacion
const MIN_CARACTERES = 3;
const MAX_CARACTERES = 200;

createApp({
  // ---------- Datos de la app ----------
  data() {
    return {
      usuarios: [],      // se llenan con data/usuarios.json
      notas: [],         // se llenan con data/notas.json
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

    async cargarDatos() {
      try {
        const [resUsuarios, resNotas] = await Promise.all([
          fetch('data/usuarios.json'),
          fetch('data/notas.json')
        ]);
        if (!resUsuarios.ok || !resNotas.ok) {
          throw new Error('No se pudieron leer los archivos JSON');
        }
        this.usuarios = await resUsuarios.json();
        this.notas = await resNotas.json();
        this.usuarioId = this.usuarios.length ? this.usuarios[0].id : null;
      } catch (e) {
        this.error = this.t('errorCarga') + e.message;
      } finally {
        this.cargando = false;
      }
    },

    // Guarda una nota nueva o los cambios de la que se esta editando.
    // Vue redibuja la lista sin recargar la pagina.
    guardarNota() {
      this.intentoGuardar = true;
      if (this.errores.length > 0) return;   // no se guarda si hay errores

      const texto = this.nuevaNota.texto.trim();
      const eraEdicion = this.editandoId !== null;

      if (this.editandoId !== null) {
        // Editar: se cambian el texto y el color de la nota existente
        const nota = this.notas.find(n => n.id === this.editandoId);
        if (nota) {
          nota.texto = texto;
          nota.color = this.nuevaNota.color;
        }
      } else {
        // Agregar: nota nueva para el usuario elegido
        const siguienteId = this.notas.length
          ? Math.max(...this.notas.map(n => n.id)) + 1
          : 1;

        this.notas.push({
          id: siguienteId,
          usuarioId: this.usuarioId,
          texto: texto,
          color: this.nuevaNota.color,
          fecha: new Date().toISOString()
        });
      }

      this.limpiarFormulario();
      this.avisar(this.t(eraEdicion ? 'actualizada' : 'guardada'));
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