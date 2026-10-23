(function(){
  const $ = id => document.getElementById(id);

  /* ---------- Reise ---------- */
  const STEPS = [
    ["Der Text", "Alles beginnt mit dem bisherigen Text – deiner Frage plus allem, was im Kontextfenster steht.", '"Die Katze jagt"'],
    ["Tokenizer", "Der Text wird in <a href=\"/erklaert/token/\">Tokens</a> zerlegt, jedes bekommt seine feste Nummer. Ab hier gibt es keine Buchstaben mehr.", '["Die", "␣Katze", "␣jagt"]\n→ [791, 18442, 30115]'],
    ["Embedding + Position", "Jede Nummer wird in einer großen Tabelle nachgeschlagen und durch einen langen Vektor ersetzt – bei großen Modellen mehrere Tausend Zahlen. Dazu kommt die Information, an welcher Stelle das Token steht.", '791   → [ 0.12, -0.83,  0.40, … ]   (z. B. 8192 Zahlen)\n18442 → [-0.55,  0.07,  1.21, … ]\n30115 → [ 0.91, -0.30, -0.12, … ]'],
    ["Aufmerksamkeit", "Jedes Token schaut auf alle Tokens vor sich und holt sich, was es braucht. „jagt“ erfährt hier zum Beispiel, wer da jagt. Mehr dazu im Eintrag <a href=\"/erklaert/aufmerksamkeit/\">Aufmerksamkeit</a>.", '„jagt“ schaut auf:\n  Die    6 %\n  Katze 71 %\n  jagt  23 %'],
    ["Addieren und normalisieren", "Das Ergebnis der Aufmerksamkeit wird zum bisherigen Vektor <em>addiert</em>, nicht an seine Stelle gesetzt. So geht nichts verloren. Danach werden die Zahlen auf einen handlichen Bereich gebracht.", 'x = x + aufmerksamkeit(x)'],
    ["Feedforward", "Jetzt wird jedes Token einzeln durch ein kleines Netz geschickt: aufblähen auf etwa die vierfache Breite, filtern, wieder zusammenfalten. Hier steckt der Großteil der Parameter.", '8192 Zahlen → 28 672 → 8192 Zahlen\n(je Token, unabhängig von den anderen)'],
    ["Addieren – und wiederholen", "Wieder wird addiert. Dann beginnt der nächste Block mit genau demselben Aufbau, aber eigenen Parametern. Große Modelle haben Dutzende bis über hundert solcher Blöcke hintereinander. Mit jedem wird die Darstellung abstrakter.", 'for (Block b : bloecke) { … }   // z. B. 80×'],
    ["Ausgabeschicht", "Nach dem letzten Block wird nur der Vektor des <em>letzten</em> Tokens genommen und mit einer großen Matrix in eine Punktzahl für jedes Token im Vokabular umgerechnet.", '[ …8192 Zahlen… ]  →  100 000 Logits\n"␣Mäuse" 8.1   "␣die" 7.4   "␣einen" 6.9 …'],
    ["Nächstes Token", "Aus den Punktzahlen werden Wahrscheinlichkeiten, und eines wird gezogen – mehr dazu bei <a href=\"/erklaert/temperatur/\">Temperatur</a>. Es wird an den Text angehängt, und das Ganze beginnt von vorn.", '"Die Katze jagt" + "␣Mäuse"\n→ nächster Durchlauf']
  ];
  let si = 0;
  const boxes = [...document.querySelectorAll("#arch .box")];
  function drawJ(){
    boxes.forEach(b => b.classList.toggle("on", +b.dataset.i === si));
    const [t, txt, data] = STEPS[si];
    $("jp").innerHTML = `<div class="j-step">Schritt ${si+1} von ${STEPS.length}</div><h3>${t}</h3><p>${txt}</p><div class="j-data">${data.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</div>`;
    $("jprev").disabled = si === 0;
    $("jnext").textContent = si === STEPS.length-1 ? "Von vorn ↺" : "Weiter →";
  }
  $("jnext").addEventListener("click", () => { si = (si + 1) % STEPS.length; drawJ(); });
  $("jprev").addEventListener("click", () => { if (si > 0){ si--; drawJ(); } });
  boxes.forEach(b => b.addEventListener("click", () => { si = +b.dataset.i; drawJ(); }));
  drawJ();

  /* ---------- Position ---------- */
  const SENTS = [["Hund","beißt","Mann"],["Mann","beißt","Hund"]];
  let pos = 0;
  const cls = {Hund:"c0", beißt:"c1", Mann:"c2"};
  function drawPos(){
    [...$("posSw").children].forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === pos)));
    $("order").innerHTML = SENTS.map(s => {
      const view = pos ? s.map((w,i) => [w, "Pos " + (i+1)]) : [...s].sort().map(w => [w, ""]);
      return `<div class="order-row"><div class="s">„${s.join(" ")}“</div><div class="chips">${view.map(([w,p]) => `<span class="chip ${cls[w]}">${w}${p ? `<small>${p}</small>` : ""}</span>`).join("")}</div></div>`;
    }).join("");
    const r = $("orderRes");
    if (pos){ r.className = "order-res diff"; r.textContent = "Unterschiedlich – das Modell weiß, wer wen beißt."; }
    else { r.className = "order-res same"; r.textContent = "Für die Aufmerksamkeit identisch: dieselben drei Wörter, Reihenfolge unbekannt."; }
  }
  [...$("posSw").children].forEach(b => b.addEventListener("click", () => { pos = +b.dataset.v; drawPos(); }));
  drawPos();
})();
