// A megfelelő termékablak megnyitása.
function megnyitas(id) {
  document.getElementById(id).showModal();
}

// A felugró ablak bezárása.
function bezaras(id) {
  document.getElementById(id).close();
}

// A sötét háttérre kattintva is bezárható az ablak.
for (const ablak of document.querySelectorAll('.product-dialog')) {
  ablak.addEventListener('click', function(event) {
    if (event.target === ablak) {
      ablak.close();
    }
  });
}
// Az Escape billentyűt a böngésző automatikusan kezeli.
