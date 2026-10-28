// Haken „gelesen“ an jedem Beitrag und Übersicht „Lesestand“ (seit 2026-10-28, Sven: „Haken gelesen kannst du ran machen“ –
// er baut erst und liest später; Gelesenes darf danach wieder von der Seite).
// Gespeichert nur in diesem Browser: localStorage „wdk-gelesen-seiten“ = { "/pfad/": "JJJJ-MM-TT", … } (Tag des Hakens).
// Nicht verwechseln mit „wdk-gelesen“ der KI-Begriffe-Lesereihenfolge (eigener Stand, eigenes Format).
//   Beitrag:   <label class="gelesen-zeile" hidden><input type="checkbox" data-gelesen="/pfad/"> gelesen</label>
//   Übersicht: <ul data-lesestand> mit <li data-pfad="/pfad/" data-rubrik="…">, Knöpfe [data-filter], <select data-rubrik-wahl>,
//              Zähler [data-lesestand-zahl]; Startseite: [data-lesestand-kurz] („N als gelesen markiert“)
// Ohne Skript bleiben Haken und Zähler unsichtbar (hidden).
(function () {
  const KEY = "wdk-gelesen-seiten";
  let stand = {};
  try { stand = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { stand = {}; }
  const sichern = () => { try { localStorage.setItem(KEY, JSON.stringify(stand)); } catch (e) {} };
  const heute = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const datum = t => t ? t.split("-").reverse().join(".") : "";
  const setze = (pfad, an) => { if (an) stand[pfad] = heute(); else delete stand[pfad]; sichern(); };

  // Haken auf Beitragsseiten (und in der Übersicht)
  const kaestchen = [...document.querySelectorAll("input[data-gelesen]")];
  kaestchen.forEach(cb => {
    cb.closest("[hidden]")?.removeAttribute("hidden");
    cb.checked = !!stand[cb.dataset.gelesen];
    cb.addEventListener("change", () => { setze(cb.dataset.gelesen, cb.checked); zeigen(); });
  });

  // Startseite: nur die Zahl der Haken (die Liste aller Seiten kennt nur die Übersicht)
  document.querySelectorAll("[data-lesestand-kurz]").forEach(el => {
    const n = Object.keys(stand).length;
    el.querySelector("[data-zahl]").textContent = n ? `${n} als gelesen markiert` : "noch nichts als gelesen markiert";
    el.removeAttribute("hidden");
  });

  // Übersicht
  const liste = document.querySelector("[data-lesestand]");
  let filter = "ungelesen", rubrik = "";
  const eintraege = liste ? [...liste.querySelectorAll("li[data-pfad]")] : [];
  if (liste) {
    const wahl = document.querySelector("[data-rubrik-wahl]");
    if (wahl) {
      const rubriken = [...new Set(eintraege.map(li => li.dataset.rubrik))].sort((a, b) => a.localeCompare(b, "de"));
      rubriken.forEach(r => wahl.add(new Option(r, r)));
      wahl.addEventListener("change", () => { rubrik = wahl.value; zeigen(); });
    }
    document.querySelectorAll("[data-filter]").forEach(k => k.addEventListener("click", () => { filter = k.dataset.filter; zeigen(); }));
    document.querySelectorAll(".lesestand-leiste[hidden]").forEach(el => el.removeAttribute("hidden"));
  }

  function zeigen() {
    kaestchen.forEach(cb => { cb.checked = !!stand[cb.dataset.gelesen]; });
    if (!liste) return;
    let sichtbar = 0;
    eintraege.forEach(li => {
      const gelesen = !!stand[li.dataset.pfad];
      li.classList.toggle("ist-gelesen", gelesen);
      const am = li.querySelector("[data-gelesen-am]");
      if (am) am.textContent = gelesen ? ` · gelesen am ${datum(stand[li.dataset.pfad])}` : "";
      const passt = (filter === "alle" || (filter === "gelesen") === gelesen) && (!rubrik || li.dataset.rubrik === rubrik);
      li.hidden = !passt;
      if (passt) sichtbar++;
    });
    const imBereich = eintraege.filter(li => !rubrik || li.dataset.rubrik === rubrik);
    const n = imBereich.filter(li => stand[li.dataset.pfad]).length;
    document.querySelectorAll("[data-lesestand-zahl]").forEach(z => {
      z.textContent = `${n} von ${imBereich.length} gelesen` + (rubrik ? ` (${rubrik})` : "");
    });
    document.querySelectorAll("[data-filter]").forEach(k => k.setAttribute("aria-pressed", String(k.dataset.filter === filter)));
    const leer = document.querySelector("[data-lesestand-leer]");
    if (leer) leer.hidden = sichtbar > 0;
  }
  zeigen();

  // Testzugang
  window.__gelesen = { stand: () => ({ ...stand }), setze: (p, an) => { setze(p, an); zeigen(); }, KEY };
})();
