/* ============================================================
   search_engine.js - Buscador del menú lateral de la documentación
   Filtra los enlaces de cada <details> según lo escrito.
   ============================================================ */
const search  = document.getElementById("searchDocs");
const details = document.querySelectorAll(".sidebar details");

// Antes fallaba con "Cannot read properties of null" en páginas sin buscador
if (search) {
  // 'input' también detecta pegar texto o borrar con el ratón (keyup no)
  search.addEventListener("input", function () {
    const value = this.value.trim().toLowerCase();

    details.forEach(section => {
      let matchFound = false;

      section.querySelectorAll("a").forEach(link => {
        const visible = link.textContent.toLowerCase().includes(value);
        link.style.display = visible ? "block" : "none";
        if (visible) matchFound = true;
      });

      // abre la sección si tiene coincidencias (o si el buscador está vacío)
      section.open = matchFound || value === "";
    });
  });
}
