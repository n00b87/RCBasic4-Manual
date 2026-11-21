// ==========================================================================
// theme-toggle.js — Cambio de tema claro/oscuro
// Corrige: typos, enlaces (accent-hover/visited), persistencia en localStorage
// ==========================================================================

// Definimos los dos sets de variables en un solo lugar (fácil de mantener)
const TEMA_OSCURO = {
  '--bg-page':              '#09090b',
  '--bg-sidebar':           '#0e0e11',
  '--bg-content':           'transparent',
  '--bg-code':              '#0f1115',
  '--bg-table-head':        '#15151a',
  '--bg-table-odd':         '#0e0e11',
  '--bg-nav-search':        '#0e0e11',
  '--bg-nav-top':           '#09090b',
  '--bg-versions':          '#010409',
  '--bg-versions-cur':      '#020c1a',

  '--text-body':            '#c9c9d1',
  '--text-muted':           '#8b8b94',
  '--text-heading':         '#fafafa',
  '--text-sidebar':         '#c9c9d1',
  '--text-code':            'white',
  '--text-footer':          '#94a3b8',

  '--accent':               '#7c9dff',
  '--accent-hover':         '#a5bbff',
  '--accent-visited':       '#4338CA',
  '--accent-active':        '#B6B6B6',
  '--accent-text':          '#0D0D0D',

  '--border':               '#232327',
  '--border-button-theme':  '#232327',
  '--border-table':         '#232327',

  '--sidebar-active-bg':    '#1a1d2b',
  '--sidebar-active-text':  '#cfdcff',
  '--sidebar-hover-bg':     '#15151a',

  '--scroll-bg':            '#080b0f',
  '--scroll-hover':         '#7B8FB8',
  '--scroll-bg-color':      '#5E77A8',

  '--adm-note-bg':           '#2D3A54',
  '--adm-note-border':       '#4C628E',
  '--adm-note-title-bg':     '#3D4E71',
  '--adm-note-title-fg':     '#D2D9E7',

  '--adm-warn-bg':           'rgba(234,179,8,0.08)',
  '--adm-warn-border':       '#f0b37e',
  '--adm-warn-title-bg':     '#3a2a0a',
  '--adm-warn-title-fg':     '#f0b37e',

  '--adm-danger-bg':         'rgba(220,38,38,0.10)',
  '--adm-danger-border':     '#f29f97',
  '--adm-danger-title-bg':   '#3a0a0a',
  '--adm-danger-title-fg':   '#f29f97',

  '--adm-tip-bg':            'rgba(16,163,74,0.10)',
  '--adm-tip-border':        '#1abc9c',
  '--adm-tip-title-bg':      '#0a2a1a',
  '--adm-tip-title-fg':      '#1abc9c',
};

const TEMA_CLARO = {
  // Fondos generales
  '--bg-page':              '#fafaf8',
  '--bg-sidebar':           '#f4f4f0',
  '--bg-content':           '#FFFFFF',
  '--bg-code':              '#0f1115',
  '--bg-code-inline':       'transparent',
  '--bg-table-head':        '#f0f0eb',
  '--bg-table-odd':         '#fafaf8',
  '--bg-nav-search':        '#f4f4f0',
  '--bg-nav-top':           '#fafaf8',
  '--bg-versions':          '#F3F4F6',
  '--bg-versions-cur':      '#E5E7EB',

  // Textos
  '--text-body':            '#3c3c44',
  '--text-muted':           '#6b6b73',
  '--text-heading':         '#16161a',
  '--text-sidebar':         '#3c3c44',
  '--text-code':            'white',
  '--text-footer':          '#9CA3AF',

  '--btn-color':            'black',
  '--btn-bg':               'white',
  '--btn-border':           '#868686',

  // Acentos
  '--accent':               '#2f5bea',
  '--accent-hover':         '#1e44c4',
  '--accent-visited':       '#4338CA',
  '--accent-active':        '#1E40AF',
  '--accent-text':          '#FFFFFF',

  // Bordes
  '--border':               '#e7e6e1',
  '--border-button-theme':  '#e7e6e1',
  '--border-table':         '#e7e6e1',

  // Sidebar
  '--sidebar-active-bg':    '#e8edff',
  '--sidebar-active-text':  '#1e3a8a',
  '--sidebar-hover-bg':     '#ecece7',

  // Scrollbar
  '--scroll-bg':            '#E5E7EB',
  '--scroll-hover':         '#9CA3AF',
  '--scroll-bg-color':      '#F3F4F6',

  // Admonitions - Note (azul)
  '--adm-note-bg':           '#EFF6FF',
  '--adm-note-border':       '#93C5FD',
  '--adm-note-title-bg':     '#DBEAFE',
  '--adm-note-title-fg':     '#1E40AF',

  // Admonitions - Warning (naranja)
  '--adm-warn-bg':           '#FFF7ED',
  '--adm-warn-border':       '#f0b37e',
  '--adm-warn-title-bg':     '#FFEDD5',
  '--adm-warn-title-fg':     '#9A5B13',

  // Admonitions - Danger (rojo)
  '--adm-danger-bg':         'rgba(220,38,38,0.06)',
  '--adm-danger-border':     '#f29f97',
  '--adm-danger-title-bg':   '#FEE2E2',
  '--adm-danger-title-fg':   '#B91C1C',

  // Admonitions - Tip (verde)
  '--adm-tip-bg':            'rgba(16,163,74,0.06)',
  '--adm-tip-border':        '#1abc9c',
  '--adm-tip-title-bg':      '#D1FAE5',
  '--adm-tip-title-fg':      '#0F766E',
};

// ── Capturamos la carpeta real de ESTE script en cuanto se ejecuta ───────
// Debe ir aquí arriba, antes de cualquier función async o setTimeout,
// porque document.currentScript deja de funcionar después de ese punto.
(function () {
  const scriptActual = document.currentScript;
  if (scriptActual && scriptActual.src) {
    // De ".../_static/js/theme-toggle.js" nos quedamos con ".../_static/js/"
    window.__RUTA_BASE_ICONOS__ = scriptActual.src.replace(/[^/]+$/, '');
  }
})();

function aplicarVariables(vars) {
  const root = document.documentElement.style;
  for (const [propiedad, valor] of Object.entries(vars)) {
    root.setProperty(propiedad, valor);
  }
}

// ── Ruta a _static/js/ calculada desde la ubicación del propio script ────
// En vez de adivinar la profundidad de la página (index vs subpáginas),
// usamos la URL real desde donde el navegador cargó este mismo archivo
// (theme-toggle.js). Como los íconos viven en la MISMA carpeta que este
// script, basta con quedarnos con todo lo que está antes de "theme-toggle.js"
// en su URL. Esto funciona sin importar cuántos "../" necesite cada página.
function obtenerRutaBase() {
  // document.currentScript solo está disponible mientras el script se
  // ejecuta por primera vez (no dentro de funciones), así que lo capturamos
  // una sola vez en una variable a nivel de módulo (ver más abajo).
  return window.__RUTA_BASE_ICONOS__ || './';
}

function actualizarIconoBoton(esClaro) {
  const btn = document.getElementById('btn-theme');
  if (!btn) return;

  const img = btn.querySelector('img');
  if (!img) return;

  const base = obtenerRutaBase(); // ya incluye ".../_static/js/"
  img.src = esClaro
    ? `${base}night-icon.png`
    : `${base}brightness-icon.png`;

  // Ajustamos el tamaño solo si cambia (opcional, ya que los tamaños difieren
  // un poco entre los dos íconos originales)
  if (esClaro) {
    img.width = 28;
    img.height = 28;
  } else {
    img.width = 32;
    img.height = 32;
  }
}

function cambiarTema(esClaro) {
  aplicarVariables(esClaro ? TEMA_CLARO : TEMA_OSCURO);
  actualizarIconoBoton(esClaro);
  localStorage.setItem('tema-claro', esClaro ? '1' : '0');
}

// Función global para poder usarla con onclick="change_theme(this)" en el HTML
function change_theme(btn) {
  const esClaroActual = localStorage.getItem('tema-claro') !== '0';
  cambiarTema(!esClaroActual); // invierte el estado actual
}

// ── PASO 1: aplicar las variables de color YA MISMO ──────────────────────
// No esperamos a DOMContentLoaded para esto: document.documentElement
// existe desde el principio, así que evitamos el "parpadeo" del tema
// incorrecto al cargar la página.
aplicarVariables(
  (localStorage.getItem('tema-claro') !== '0') ? TEMA_CLARO : TEMA_OSCURO
);

// ── PASO 2: actualizar el ícono del botón cuando el botón ya exista ──────
document.addEventListener('DOMContentLoaded', () => {
  const esClaro = localStorage.getItem('tema-claro') !== '0';
  actualizarIconoBoton(esClaro);
});