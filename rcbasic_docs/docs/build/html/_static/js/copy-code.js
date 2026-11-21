/* ============================================================
   copy-code.js (docs) - Visor de código con barra, números de línea y Copy
   Estructura original: <div class="highlight"><pre><button class="copy-btn">..</button><div>CÓDIGO</div></pre></div>
   Corrige: rutas de iconos fijas ("../_static/..." fallaba en index.html),
   falta de plan B de portapapeles y fallo si no existía el <div> interno.
   ============================================================ */

// Carpeta de ESTE script (.../_static/js/): sirve a cualquier profundidad de página
const BASE_JS = (document.currentScript && document.currentScript.src.replace(/[^/]+$/, "")) || "";
const ICON_COPY = `<img src="${BASE_JS}copy-icon.png" width="14" height="14" alt=""> Copy`;

// Plan B cuando no hay Clipboard API (p. ej. abrir la doc con file://)
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(ta); ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  return ok;
}

// Feedback temporal en el botón
function flash(btn, ok) {
  btn.innerHTML = ok ? "Copied ✓" : "Error";
  btn.classList.toggle("done", ok);
  setTimeout(() => { btn.innerHTML = ICON_COPY; btn.classList.remove("done"); }, 1800);
}

// onclick="copyCode(this)": copia solo el texto del código (sin números de línea)
function copyCode(btn) {
  const pre = btn.closest(".code-viewer")?.querySelector("pre") || btn.closest("pre");
  if (!pre) return;
  const lines = pre.querySelectorAll(".code-line");
  const text = lines.length ? [...lines].map(l => l.textContent).join("\n") : pre.innerText;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => flash(btn, true)).catch(() => flash(btn, fallbackCopy(text)));
  } else flash(btn, fallbackCopy(text));
}

// Construye el visor para cada bloque de código de la página
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".highlight > pre").forEach(pre => {
    if (pre.closest(".code-viewer")) return;
    const code = pre.querySelector(":scope > div");            // contenedor del código
    const oldBtn = pre.querySelector(".copy-btn");
    if (code) {                                                 // una <span class="code-line"> por cada <br>
      code.innerHTML = code.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="code-line">${l || " "}</span>`).join("");
      const last = code.lastElementChild;                       // quita la última línea vacía (dejaba espacio de sobra)
      if (last && last.textContent.trim() === "" && code.children.length > 1) last.remove();
    }
    if (oldBtn) oldBtn.remove();
    const viewer = document.createElement("div");
    viewer.className = "code-viewer";
    viewer.innerHTML = `<div class="code-bar"><span class="code-dots"><i></i><i></i><i></i></span>
      <span class="code-name">example.bas</span>
      <button class="copy-btn" type="button" onclick="copyCode(this)">${ICON_COPY}</button></div>`;
    pre.parentNode.insertBefore(viewer, pre);
    viewer.appendChild(pre);
  });
});
