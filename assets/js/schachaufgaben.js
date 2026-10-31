// Schachaufgaben (Shortcode schachaufgaben): Knopf neben jeder Kapitelüberschrift klappt alle Lösungen
// des Kapitels auf oder zu (Sven). Ohne Skript bleibt der Knopf versteckt, jede Lösung lässt sich einzeln öffnen.
document.querySelectorAll('.kapitel-kopf').forEach(function (kopf) {
  var knopf = kopf.querySelector('.alle-loesungen');
  var liste = kopf.nextElementSibling;
  if (!knopf || !liste) return;
  var loesungen = liste.querySelectorAll('details.schachloesung');
  function alleOffen() {
    return Array.prototype.every.call(loesungen, function (d) { return d.open; });
  }
  function beschriften() {
    var offen = alleOffen();
    knopf.textContent = offen ? 'Alle Lösungen zuklappen' : 'Alle Lösungen aufklappen';
    knopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
  }
  knopf.addEventListener('click', function () {
    var oeffnen = !alleOffen();
    loesungen.forEach(function (d) { d.open = oeffnen; });
    beschriften();
  });
  loesungen.forEach(function (d) { d.addEventListener('toggle', beschriften); });
  knopf.hidden = false;
  beschriften();
});
