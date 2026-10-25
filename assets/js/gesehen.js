// Haken „gesehen“ (seit 2026-10-25, zuerst bei Podcasts – Svens Wunsch).
// Gespeichert nur in diesem Browser: localStorage, Schlüssel „wdk-gesehen“, Inhalt { "podcasts:<schluessel>": 1, … }.
// Kein Server, nichts im Repo; anderer Browser oder anderes Gerät = eigene Haken.
//   <label class="gesehen-haken" hidden><input type="checkbox" data-gesehen="podcasts:<schluessel>"> gesehen</label>
//   <p data-gesehen-zaehler="podcasts"></p>   → „2 von 4 gesehen“ (zählt die Haken dieser Seite)
// Ohne Skript bleiben die Haken unsichtbar (hidden).
(function () {
  const KEY = "wdk-gesehen";
  let stand = {};
  try { stand = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { stand = {}; }
  const sichern = () => { try { localStorage.setItem(KEY, JSON.stringify(stand)); } catch (e) {} };
  const kaestchen = [...document.querySelectorAll("input[data-gesehen]")];
  if (!kaestchen.length) return;

  function zeigen() {
    kaestchen.forEach(cb => {
      cb.checked = !!stand[cb.dataset.gesehen];
      const karte = cb.closest(".karte");
      if (karte) karte.classList.toggle("ist-gesehen", cb.checked);
    });
    document.querySelectorAll("[data-gesehen-zaehler]").forEach(z => {
      const bereich = z.dataset.gesehenZaehler + ":";
      const hier = kaestchen.filter(cb => cb.dataset.gesehen.startsWith(bereich));
      const n = hier.filter(cb => cb.checked).length;
      z.textContent = n ? `${n} von ${hier.length} gesehen` : "";
    });
  }
  kaestchen.forEach(cb => {
    cb.closest("[hidden]")?.removeAttribute("hidden");
    cb.addEventListener("change", () => {
      if (cb.checked) stand[cb.dataset.gesehen] = 1; else delete stand[cb.dataset.gesehen];
      sichern(); zeigen();
    });
  });
  zeigen();
})();
