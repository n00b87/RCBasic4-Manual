/* ============================================================
   copy-code.js - Visor de código mejorado
   1) Construye una barra superior (puntos, nombre de archivo, lenguaje, botón Copy)
   2) Numera las líneas (con CSS counters: no se copian al portapapeles)
   3) Botón Copy con fallback si no hay navigator.clipboard (file://)
   ============================================================ */
const ICON_COPY = '<img src="../assets/icon/copy-icon.png" width="14" height="14" alt=""> Copy';

// Plan B para navegadores/contextos sin Clipboard API
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(ta); ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  return ok;
}

// Muestra "Copied" un momento y vuelve a "Copy"
function flash(btn, ok) {
  btn.innerHTML = ok ? "Copied ✓" : "Error";
  btn.classList.toggle("done", ok);
  setTimeout(() => { btn.innerHTML = ICON_COPY; btn.classList.remove("done"); }, 1800);
}

// Llamada desde onclick="copyCode(this)"
function copyCode(btn) {
  const codeEl = btn.closest(".code-viewer")?.querySelector("code") || btn.parentElement.querySelector("code");
  if (!codeEl) return;
  // las líneas son <span> de bloque: se unen con \n para copiar texto limpio
  const text = [...codeEl.querySelectorAll(".code-line")].map(l => l.textContent).join("\n") || codeEl.innerText;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => flash(btn, true)).catch(() => flash(btn, fallbackCopy(text)));
  } else {
    flash(btn, fallbackCopy(text));
  }
}

// Convierte cada <pre class="language-basic"> en un visor completo
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre.language-basic").forEach(pre => {
    const code = pre.querySelector("code");
    if (!code || pre.closest(".code-viewer")) return;

    // cada <br> separa una línea -> la envolvemos en <span class="code-line">
    const lines = code.innerHTML.split(/<br\s*\/?>/i);
    code.innerHTML = lines.map(l => `<span class="code-line">${l || " "}</span>`).join("");

    // el botón original (dentro del pre) se mueve a la barra
    const oldBtn = pre.querySelector(".copy-btn"); if (oldBtn) oldBtn.remove();

    const viewer = document.createElement("div");
    viewer.className = "code-viewer";
    viewer.innerHTML = `<div class="code-bar"><span class="code-dots"><i></i><i></i><i></i></span>
      <span class="code-name">${pre.dataset.file || "main.bas"}</span><span class="code-lang">RCBasic</span>
      <button class="copy-btn" type="button" onclick="copyCode(this)">${ICON_COPY}</button></div>`;
    pre.parentNode.insertBefore(viewer, pre);
    viewer.appendChild(pre);
  });
});
