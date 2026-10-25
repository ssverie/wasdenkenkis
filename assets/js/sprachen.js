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
    // Wie in der Vorlage der Instanz: Erklärungen in Klammern und Auslassungspunkte nicht vorlesen,
    // Schrägstriche („ครับ / ค่ะ“, „einfach / leicht“) als kurze Pause sprechen statt „Slash“
    const sauber = text.replace(/\s*\([^)]*\)/g, "").replace(/…/g, "").replace(/\s*\/\s*/g, ", ").trim();
    speechSynthesis.cancel();
    const s = new SpeechSynthesisUtterance(sauber);
    s.lang = SPRACHE;
    s.rate = langsam && langsam.checked ? 0.6 : 0.85;
    if (stimme) s.voice = stimme;
    speechSynthesis.speak(s);
  }
  window.wdkSprich = sprich;   // für den Lernmodus (unten)

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
  // Zeilen eines Knopfs (Wort, Umschrift, Übersetzung) mit Leerzeichen trennen, sonst findet „hund“ auch „khun|danke“;
  // Text erst beim Suchen lesen, weil der Sprecher-Umschalter (Thai) die Wörter ändern kann
  const text = el => [...el.children].map(c => c.textContent).join(" ").toLowerCase();
  const gruppen = [...document.querySelectorAll(".sprache-gruppe")].map(det => ({
    det,
    woerter: [...det.querySelectorAll(".wort")].map(el => ({ el }))
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
      g.woerter.forEach(w => { const passt = !q || text(w.el).includes(q); w.el.hidden = !passt; if (passt) n++; });
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

// Sprecher-Formen (Thai-Sätze): „Ich spreche als Mann / Frau“ ersetzt die Platzhalter {I}, {P}, {Q} in Wort und Umschrift,
// nach der Vorlage der Sprachen-Instanz. Die Wahl merkt sich nur dieser Browser (localStorage, Schlüssel wdk-sprecher).
(function () {
  const wahl = document.getElementById("sprache-form");
  const bereich = document.querySelector(".sprache[data-formen]");
  if (!wahl || !bereich) return;
  const formen = {};
  JSON.parse(bereich.dataset.formen).forEach(f => {
    const paare = liste => { const p = {}; for (let i = 0; i + 1 < liste.length; i += 2) p[liste[i]] = liste[i + 1]; return p; };
    formen[f.schluessel] = { th: paare(f.th), um: paare(f.um) };
  });
  const ersetze = (roh, tabelle) => roh.replace(/\{[A-Z]\}/g, t => tabelle[t] ?? t);

  function anwenden(schluessel) {
    const f = formen[schluessel];
    if (!f) return;
    bereich.querySelectorAll(".wort[data-roh]").forEach(el => {
      const wort = ersetze(el.dataset.roh, f.th);
      el.firstElementChild.textContent = wort;
      el.dataset.wort = wort;
      const u = el.querySelector(".umschrift");
      if (u) u.textContent = ersetze(el.dataset.umRoh, f.um);
    });
  }

  let gemerkt = null;
  try { gemerkt = localStorage.getItem("wdk-sprecher"); } catch (e) {}
  if (gemerkt && formen[gemerkt]) { wahl.value = gemerkt; anwenden(gemerkt); }
  wahl.addEventListener("change", () => {
    anwenden(wahl.value);
    try { localStorage.setItem("wdk-sprecher", wahl.value); } catch (e) {}
  });
})();

// Lernmodus (Karteikasten) für große Listen (1000 Wörter, Sätze) – nach der Vorlage der Sprachen-Instanz
// (englisch-1000-lernen.html), hier einmal allgemein für alle Sprachen gebaut. Leitner-System: Fach 0 = neu oder
// nicht gewusst, gewusst → ein Fach weiter, wieder fällig nach 1, 3, 7, 14, 30 Tagen; Fach 5 = sitzt.
// Die Karten kommen aus den Knöpfen der Seite (bei Thai-Sätzen also in der gewählten Mann/Frau-Form).
// Lernstand und Einstellungen nur in diesem Browser (localStorage, Schlüssel „wdk-lernstand:<Seitenpfad>“).
(function () {
  const bereich = document.querySelector(".sprache-gross");
  const leiste = bereich && bereich.querySelector(".sprache-leiste");
  if (!leiste) return;

  const ABSTAENDE = [0, 1, 3, 7, 14, 30];
  const FAECHER = ABSTAENDE.length - 1;
  const TAG = 86400000;
  const SPEICHER = "wdk-lernstand:" + location.pathname;
  const SPRACHE = bereich.dataset.sprache;
  const NAME = bereich.dataset.name || "der Fremdsprache";
  const UEBERSETZUNG = SPRACHE.startsWith("de") ? "Englisch" : "Deutsch";   // Deutsch-Seiten sind für Englischsprachige
  const laut = t => { try { if (window.wdkSprich) window.wdkSprich(t); } catch (e) {} };   // Ton darf nie blockieren

  // Karten aus der Seite: Gruppe = Überschrift der aufklappbaren Gruppe; id bleibt bei Mann/Frau-Wechsel gleich
  const gruppen = [];
  const karten = [];
  bereich.querySelectorAll(".sprache-gruppe").forEach(det => {
    const gruppe = det.querySelector("summary span").textContent;
    const liste = [...det.querySelectorAll(".wort")];
    gruppen.push({ name: gruppe, anzahl: liste.length });
    liste.forEach(el => karten.push({ id: gruppe + "|" + (el.dataset.roh || el.firstElementChild.textContent), gruppe, el }));
  });
  // Inhalt einer Karte immer frisch aus dem Knopf (der Mann/Frau-Umschalter kann ihn geändert haben)
  const fremdText = k => k.el.firstElementChild.textContent;
  const lesung = k => k.el.dataset.wort;
  const umschrift = k => {
    const u = k.el.querySelector(".umschrift"), kana = k.el.querySelector(".kana");
    return [kana && kana.textContent, u && u.textContent].filter(Boolean).join(" · ");
  };
  const bedeutung = k => k.el.querySelector("small").textContent;

  let stand = {}, einst = { gruppe: "", richtung: "de", anzahl: 20 };
  try { stand = JSON.parse(localStorage.getItem(SPEICHER) || "{}"); } catch (e) { stand = {}; }
  try { Object.assign(einst, JSON.parse(localStorage.getItem(SPEICHER + ":einst") || "{}")); } catch (e) {}
  function sichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(stand)); localStorage.setItem(SPEICHER + ":einst", JSON.stringify(einst)); } catch (e) {}
  }
  const jetzt = () => Date.now();
  const imThema = k => !einst.gruppe || k.gruppe === einst.gruppe;
  const faellig = k => stand[k.id] && stand[k.id].faellig <= jetzt();
  const istNeu = k => !stand[k.id];

  // Fenster über der Seite
  const box = document.createElement("div");
  box.className = "lern-box";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Lernmodus");
  box.innerHTML = '<div class="lern-innen"></div>';
  document.body.appendChild(box);
  const inhalt = box.firstElementChild;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let sitzung = [], pos = 0, umgedreht = false, richtig = 0, falsch = 0, resetGeklickt = false;

  function start() {
    const auswahl = karten.filter(imThema);
    const f = auswahl.filter(faellig).length, neu = auswahl.filter(istNeu).length;
    const sitzt = auswahl.filter(k => stand[k.id] && stand[k.id].fach >= FAECHER).length;
    const proFach = Array(FAECHER + 1).fill(0);
    auswahl.forEach(k => { if (stand[k.id]) proFach[stand[k.id].fach]++; });
    const max = Math.max(1, ...proFach);
    inhalt.innerHTML = `
      <div class="lern-kopf"><h2>Lernen</h2><button type="button" data-aktion="zu">Schließen</button></div>
      <label class="lern-feld">Thema
        <select data-feld="gruppe"><option value="">Alle Themen (${karten.length})</option>
        ${gruppen.map(g => `<option value="${esc(g.name)}"${g.name === einst.gruppe ? " selected" : ""}>${esc(g.name)} (${g.anzahl})</option>`).join("")}
        </select></label>
      <label class="lern-feld">Richtung
        <select data-feld="richtung">
          <option value="de"${einst.richtung === "de" ? " selected" : ""}>${UEBERSETZUNG} → ${esc(NAME)} (selbst sprechen)</option>
          <option value="fremd"${einst.richtung === "fremd" ? " selected" : ""}>${esc(NAME)} → ${UEBERSETZUNG} (hören und verstehen)</option>
        </select></label>
      <label class="lern-feld">Karten pro Runde
        <select data-feld="anzahl">${[10, 20, 30, 50].map(n => `<option${n === einst.anzahl ? " selected" : ""}>${n}</option>`).join("")}</select></label>
      <div class="lern-statistik">
        <div><b>${f}</b><span>heute fällig</span></div><div><b>${neu}</b><span>noch neu</span></div><div><b>${sitzt}</b><span>sitzen (Fach 5)</span></div>
      </div>
      <div class="lern-faecher">${proFach.map(n => `<div style="height:${Math.round(n / max * 100)}%" title="${n}"></div>`).join("")}</div>
      <div class="lern-faecher-text">${proFach.map((n, i) => `<span>${i === 0 ? "nicht gewusst" : "Fach " + i}<br>${n}</span>`).join("")}</div>
      <button type="button" class="lern-gross lern-blau" data-aktion="runde">${f + neu ? "Runde starten" : "Alles gelernt – trotzdem üben"}</button>
      <p class="lern-info">So geht's: Versuch die Antwort zuerst <b>laut</b> zu sagen, dann umdrehen.
      Gewusste Karten wandern ein Fach weiter und kommen seltener (nach 1, 3, 7, 14, 30 Tagen).
      Nicht gewusste kommen in dieser Runde noch einmal. Dein Lernstand wird nur in diesem Browser gespeichert.</p>
      <button type="button" class="lern-klein" data-aktion="reset">Lernstand dieses Themas zurücksetzen</button>`;
    inhalt.querySelectorAll("select").forEach(s => s.addEventListener("change", () => {
      einst[s.dataset.feld] = s.dataset.feld === "anzahl" ? +s.value : s.value;
      sichern();
      if (s.dataset.feld === "gruppe") start();
    }));
  }

  function zuruecksetzen(knopf) {   // zweimal tippen statt Browser-Dialog
    if (!resetGeklickt) {
      resetGeklickt = true;
      knopf.textContent = "Wirklich? Nochmal tippen zum Zurücksetzen";
      setTimeout(() => { resetGeklickt = false; if (knopf.isConnected) knopf.textContent = "Lernstand dieses Themas zurücksetzen"; }, 4000);
      return;
    }
    resetGeklickt = false;
    karten.filter(imThema).forEach(k => delete stand[k.id]);
    sichern(); start();
  }

  const mischen = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function runde() {
    const auswahl = karten.filter(imThema);
    const f = mischen(auswahl.filter(faellig)).sort((a, b) => stand[a.id].fach - stand[b.id].fach);
    const neu = auswahl.filter(istNeu);                         // neue in Listenreihenfolge (häufige zuerst)
    let liste = f.concat(neu).slice(0, einst.anzahl);
    if (!liste.length) liste = mischen(auswahl.slice()).slice(0, einst.anzahl);   // alles gelernt: freies Üben
    sitzung = mischen(liste); pos = 0; richtig = 0; falsch = 0;
    zeige();
  }

  function zeige() {
    if (pos >= sitzung.length) return ende();
    umgedreht = false;
    const k = sitzung[pos], um = umschrift(k);
    const fach = stand[k.id] ? stand[k.id].fach : null;
    const vorne = einst.richtung === "de"
      ? `<div class="lern-frage">${esc(bedeutung(k))}</div><div class="lern-hinweis">Wie sagt man das auf ${esc(NAME)}? Sag es laut.</div>`
      : `<div class="lern-frage" lang="${esc(SPRACHE)}">${esc(fremdText(k))}</div>${um ? `<div class="lern-umschrift">${esc(um)}</div>` : ""}
         <button type="button" class="lern-klein" data-aktion="hoeren">🔊 Anhören</button><div class="lern-hinweis">Was bedeutet das?</div>`;
    inhalt.innerHTML = `
      <div class="lern-kopf"><span>${pos + 1} / ${sitzung.length} · ${esc(k.gruppe)}</span><button type="button" data-aktion="start">Beenden</button></div>
      <div class="lern-fortschritt"><div style="width:${pos / sitzung.length * 100}%"></div></div>
      <div class="lern-karte" data-aktion="umdrehen">${vorne}<div class="lern-rueck"></div>
        <div class="lern-fach">${fach === null ? "neue Karte" : fach === 0 ? "zuletzt nicht gewusst" : "Fach " + fach}</div></div>
      <div class="lern-knoepfe"><button type="button" class="lern-gross lern-blau" data-aktion="umdrehen">Umdrehen</button></div>`;
    if (einst.richtung === "fremd") laut(lesung(k));
  }

  function umdrehen() {
    if (umgedreht) return;
    umgedreht = true;
    const k = sitzung[pos], um = umschrift(k);
    inhalt.querySelector(".lern-rueck").innerHTML = einst.richtung === "de"
      ? `<div class="lern-trenner"></div><div class="lern-antwort" lang="${esc(SPRACHE)}">${esc(fremdText(k))}</div>${um ? `<div class="lern-umschrift">${esc(um)}</div>` : ""}<button type="button" class="lern-klein" data-aktion="hoeren">🔊 Nochmal</button>`
      : `<div class="lern-trenner"></div><div class="lern-antwort">${esc(bedeutung(k))}</div>`;
    if (einst.richtung === "de") laut(lesung(k));
    inhalt.querySelector(".lern-knoepfe").innerHTML =
      `<div class="lern-zweier"><button type="button" class="lern-gross lern-rot" data-aktion="nein">✗ Noch nicht</button><button type="button" class="lern-gross lern-gruen" data-aktion="ja">✓ Gewusst</button></div>`;
  }

  function bewerte(gewusst) {
    const k = sitzung[pos];
    const s = stand[k.id] || { fach: 0, faellig: 0 };
    if (gewusst) {
      s.fach = Math.min(FAECHER, s.fach + 1);
      s.faellig = jetzt() + ABSTAENDE[s.fach] * TAG - 3600000;   // eine Stunde Puffer
      richtig++;
    } else {
      s.fach = 0; s.faellig = jetzt();
      falsch++;
      sitzung.push(k);                                           // kommt in dieser Runde nochmal
    }
    stand[k.id] = s; sichern();
    pos++; zeige();
  }

  function ende() {
    inhalt.innerHTML = `
      <div class="lern-kopf"><h2>Runde geschafft!</h2><button type="button" data-aktion="zu">Schließen</button></div>
      <div class="lern-statistik lern-zwei"><div><b>${richtig}</b><span>gewusst</span></div><div><b>${falsch}</b><span>noch nicht</span></div></div>
      <p class="lern-info">Nicht gewusste Karten kommen morgen wieder. Am besten jeden Tag eine kurze Runde – 10 bis 15 Minuten reichen.</p>
      <button type="button" class="lern-gross lern-blau" data-aktion="runde">Noch eine Runde</button>
      <button type="button" class="lern-gross" data-aktion="start">Zur Übersicht</button>`;
  }

  function oeffnen() { box.classList.add("offen"); document.body.style.overflow = "hidden"; start(); }
  function schliessen() { box.classList.remove("offen"); document.body.style.overflow = ""; try { speechSynthesis.cancel(); } catch (e) {} }

  // Alle Knöpfe im Fenster über data-aktion
  inhalt.addEventListener("click", e => {
    const ziel = e.target.closest("[data-aktion]");
    if (!ziel) return;
    const a = ziel.dataset.aktion;
    if (a === "hoeren") { e.stopPropagation(); laut(lesung(sitzung[pos])); return; }
    if (a === "umdrehen") return umdrehen();
    if (a === "zu") return schliessen();
    if (a === "start") return start();
    if (a === "runde") return runde();
    if (a === "reset") return zuruecksetzen(ziel);
    if (a === "ja" || a === "nein") return bewerte(a === "ja");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("offen")) schliessen(); });

  // Knopf in die Leiste, vor „Alle auf“
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "lern-start";
  knopf.textContent = "📚 Lernen";
  knopf.addEventListener("click", oeffnen);
  leiste.insertBefore(knopf, document.getElementById("sprache-alle-auf"));
})();
