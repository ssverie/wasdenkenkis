// Rubrik Sprachen: Wort antippen → Sprachausgabe des Browsers (speechSynthesis), keine externen Dienste.
// Nach der gelieferten Vorlage englisch-100.html, ergänzt um Hinweis bei fehlender Stimme und Schalter „langsam“.
(function () {
  const bereich = document.querySelector(".sprache");
  if (!bereich) return;
  const SPRACHE = bereich.dataset.sprache;          // z. B. "en-GB"
  const hinweis = bereich.querySelector(".sprache-hinweis");
  const langsam = document.getElementById("sprache-langsam");

  function zeigeHinweis(text) { hinweis.textContent = text; hinweis.hidden = false; }

  if (!("speechSynthesis" in window)) {
    zeigeHinweis("Dieser Browser hat keine Sprachausgabe – die Wörter lassen sich hier leider nicht anhören.");
    return;
  }

  let stimme = null;
  function stimmeWaehlen() {
    const alle = speechSynthesis.getVoices();
    stimme = alle.find(v => v.lang.replace("_", "-") === SPRACHE)
          || alle.find(v => v.lang.toLowerCase().startsWith(SPRACHE.slice(0, 2).toLowerCase()))
          || null;
    // Stimmenliste ist da, aber keine passende: Hinweis (das Gerät versucht es trotzdem mit lang)
    // Hinweis samt Windows-Weg (Thai-Vorlage) und Edge-Tipp (Japanisch-Vorlage) der Sprachen-Instanz
    if (alle.length && !stimme) {
      const name = bereich.dataset.name || "diese Sprache";
      zeigeHinweis("Auf diesem Gerät ist keine Stimme für " + name + " installiert – die Aussprache kann falsch klingen oder ganz fehlen. " +
        "Tipp: Seite mit Microsoft Edge öffnen, oder unter Windows: Einstellungen → Zeit und Sprache → Sprache → „" + name + "“ hinzufügen (mit Sprachausgabe).");
    } else if (stimme) {
      hinweis.hidden = true;
    }
  }
  stimmeWaehlen();
  speechSynthesis.addEventListener("voiceschanged", stimmeWaehlen);

  function sprich(text) {
    speechSynthesis.cancel();
    const s = new SpeechSynthesisUtterance(text);
    s.lang = SPRACHE;
    s.rate = langsam && langsam.checked ? 0.6 : 0.85;
    if (stimme) s.voice = stimme;
    speechSynthesis.speak(s);
  }

  bereich.addEventListener("click", e => {
    const knopf = e.target.closest(".wort");
    if (!knopf) return;
    sprich(knopf.dataset.wort);
    knopf.classList.add("aktiv");
    setTimeout(() => knopf.classList.remove("aktiv"), 400);
  });
})();

// Große Listen (1000 Wörter): Suche über Wort, Umschrift und Übersetzung, Gruppen mit Treffern aufklappen,
// „Alle auf / Alle zu“ – nach der Vorlage der Sprachen-Instanz. Unabhängig von der Sprachausgabe.
(function () {
  const suche = document.getElementById("sprache-suche");
  if (!suche) return;
  const gruppen = [...document.querySelectorAll(".sprache-gruppe")].map(det => ({
    det,
    // Zeilen eines Knopfs (Wort, Umschrift, Übersetzung) mit Leerzeichen trennen, sonst findet „hund“ auch „khun|danke“
    woerter: [...det.querySelectorAll(".wort")].map(el => ({ el, text: [...el.children].map(c => c.textContent).join(" ").toLowerCase() }))
  }));
  const treffer = document.getElementById("sprache-treffer");
  const ruhetext = treffer.textContent;
  let offenVorher = null;   // Aufklapp-Zustand vor der Suche, danach wiederherstellen

  suche.addEventListener("input", () => {
    const q = suche.value.trim().toLowerCase();
    if (q && !offenVorher) offenVorher = gruppen.map(g => g.det.open);
    let gesamt = 0;
    gruppen.forEach((g, i) => {
      let n = 0;
      g.woerter.forEach(w => { const passt = !q || w.text.includes(q); w.el.hidden = !passt; if (passt) n++; });
      gesamt += n;
      g.det.hidden = !!q && n === 0;
      if (q) g.det.open = n > 0;
      else if (offenVorher) g.det.open = offenVorher[i];
    });
    if (!q) offenVorher = null;
    treffer.textContent = q ? gesamt + " Treffer" : ruhetext;
  });

  document.getElementById("sprache-alle-auf").addEventListener("click", () => gruppen.forEach(g => g.det.open = true));
  document.getElementById("sprache-alle-zu").addEventListener("click", () => gruppen.forEach(g => g.det.open = false));
})();
