// Künstlerseite der Musik (layouts/musik-kuenstler.html): Umschalter „Alben“ | „Titel“.
// Ohne Skript stehen beide Teile untereinander; mit Skript ist immer nur einer sichtbar.
// Die Wahl steht in der Adresse (#titel), damit ein Link direkt auf die Titel zeigen kann.
(function () {
  var schalter = document.querySelector(".umschalter");
  if (!schalter) return;
  var knoepfe = schalter.querySelectorAll("button");

  function zeige(ziel) {
    knoepfe.forEach(function (k) {
      var an = k.dataset.ziel === ziel;
      k.setAttribute("aria-pressed", an ? "true" : "false");
      document.getElementById(k.dataset.ziel).hidden = !an;
    });
  }

  knoepfe.forEach(function (k) {
    k.addEventListener("click", function () {
      zeige(k.dataset.ziel);
      history.replaceState(null, "", k.dataset.ziel === "alben" ? location.pathname : "#" + k.dataset.ziel);
    });
  });

  schalter.hidden = false;
  document.querySelectorAll(".musik-teil-kopf").forEach(function (h) { h.hidden = true; });
  zeige(location.hash === "#titel" ? "titel" : "alben");
})();
