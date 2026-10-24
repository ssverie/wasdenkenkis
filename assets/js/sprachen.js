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
    // Hinweis samt Windows-Weg nach der Thai-Vorlage der Sprachen-Instanz
    if (alle.length && !stimme) {
      const name = bereich.dataset.name || "diese Sprache";
      zeigeHinweis("Auf diesem Gerät ist keine Stimme für " + name + " installiert – die Aussprache kann falsch klingen oder ganz fehlen. " +
        "Unter Windows: Einstellungen → Zeit und Sprache → Sprache → „" + name + "“ hinzufügen (mit Sprachausgabe).");
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
