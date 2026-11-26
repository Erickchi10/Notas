// ==========================================================
// Practica 5. Aplicaciones del lado del cliente
// Bloc de notas con Vue.js 3 - Equipo TacoCoders
// ==========================================================

const { createApp } = Vue;

createApp({
  // ---------- Datos de la app ----------
  data() {
    return {
      usuarios: [],      // se llenan con data/usuarios.json
      notas: [],         // se llenan con data/notas.json
      usuarioId: null,   // usuario elegido en el selector
      cargando: true,
      error: ''
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
    }
  },

  // ---------- Funciones ----------
  methods: {
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
        this.error = 'Error al cargar los datos: ' + e.message;
      } finally {
        this.cargando = false;
      }
    },

    formatearFecha(fechaISO) {
      return new Date(fechaISO).toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
    }
  },

  // ---------- Al iniciar la app ----------
  mounted() {
    this.cargarDatos();
  }
}).mount('#app');