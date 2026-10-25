// Gemeinsamer Rahmen der Sortier-Visualisierungen (Selectionsort, Insertionsort, Shellsort, Mergesort)
// für wasdenkenkis.de – Claude Code Opus 5.5. Keine externen Dateien, keine Bibliotheken.
//
// Prinzip: Das Verfahren läuft einmal komplett durch und legt jeden Schritt als Momentaufnahme ab
// (Array, Code-Zeile, Erklärsatz, Zähler, Markierungen). Vor, Zurück, Abspielen und die Sprung-Knöpfe
// blättern danach nur noch in dieser Liste – die Anzeige rechnet selbst nichts.
//
// Aufruf in static/apps/<verfahren>.html:
//   SortierRahmen.starte({
//     code: [...Zeilen...], codeTitel, protokollTitel,
//     groessen: [10, 12, 16, 20], groesse: 12, anordnungen: ['zufall', 'fast', 'sortiert', 'umgekehrt'],
//     legende: [['var(--neu)', 'Text'], ...],
//     spruenge: [{ text, title, bis: s => ... }],       // zusätzliche Knöpfe „Bis …“
//     baue(a, n) → Liste der Schritte {line, a, msg, cls, ...},
//     balken(s, k, pos) → CSS-Klasse des Balkens k,  marken(s, k) → [[klasse, text], ...],
//     zaehler(s, start) → HTML,  protokoll(s, start) → HTML,  kopf(s) → HTML (optional),
//     unten(s) → HTML unter den Indizes (optional, z. B. das Hilfsarray bei Mergesort),
//     test: 'name'                                   // window.<name> für automatische Tests
//   });
(function () {
  const ANORDNUNG = { zufall: 'zufällig', fast: 'fast sortiert', sortiert: 'schon sortiert', umgekehrt: 'umgekehrt' };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Inversionen = Paare (p, q) mit p < q und a[p] > a[q]
  function inversionen(a) {
    let z = 0;
    for (let p = 0; p < a.length; p++) for (let q = p + 1; q < a.length; q++) if (a[p] > a[q]) z++;
    return z;
  }

  function starte(cfg) {
    const wurzel = document.querySelector('.wrap');
    const sprungKnoepfe = (cfg.spruenge || []).map((sp, k) =>
      `<button id="sprung${k}" title="${esc(sp.title || '')}">${esc(sp.text)}</button>`).join('');
    wurzel.innerHTML = `
      <div class="box controls">
        <label>Größe <select id="size">${cfg.groessen.map(g => `<option${g === cfg.groesse ? ' selected' : ''}>${g}</option>`).join('')}</select></label>
        <label>Anordnung <select id="art">${cfg.anordnungen.map(a => `<option value="${a}">${ANORDNUNG[a]}</option>`).join('')}</select></label>
        <button id="fresh">Neues Array</button>
      </div>
      <div class="box">
        ${cfg.kopf ? '<div class="kopf" id="kopf"></div>' : ''}
        <div class="bars" id="bars"></div>
        <div class="marks" id="marks"></div>
        <div class="idx" id="idx"></div>
        ${cfg.unten ? '<div class="unten" id="unten"></div>' : ''}
        <div class="legende">${cfg.legende.map(([farbe, text]) => `<span><i style="background:${farbe}"></i>${esc(text)}</span>`).join('')}</div>
      </div>
      <div class="box">
        <div class="controls" style="margin-bottom:10px">
          <div class="group">
            <button id="back" aria-label="Schritt zurück">◀ Zurück</button>
            <button id="play" class="primary">▶ Abspielen</button>
            <button id="next" aria-label="Nächster Schritt">Schritt ▶</button>
            ${sprungKnoepfe}
            <button id="restart">Von vorn</button>
          </div>
          <label>Tempo <input type="range" id="speed" min="1" max="10" value="5"></label>
        </div>
        <div class="msg" id="msg"></div>
        <div class="count" id="count"></div>
      </div>
      <div class="two">
        <div class="box"><div class="h">${esc(cfg.codeTitel)}</div><pre id="code"></pre></div>
        <div class="box"><div class="h">${esc(cfg.protokollTitel)}</div><div class="proto" id="proto"></div></div>
      </div>`;

    const $ = id => document.getElementById(id);
    $('code').innerHTML = cfg.code.map((l, i) => `<span class="ln" data-i="${i}">${esc(l) || ' '}</span>`).join('');

    let n = cfg.groesse, start = [], steps = [], pos = 0, timer = null;

    // 10–20 verschiedene Zahlen zwischen 5 und 99, damit jeder Balken eindeutig ist
    function makeArray() {
      n = +$('size').value;
      const art = $('art').value;
      const set = new Set();
      while (set.size < n) set.add(5 + Math.floor(Math.random() * 95));
      let a = [...set];
      if (art !== 'zufall') a.sort((x, y) => x - y);
      if (art === 'umgekehrt') a.reverse();
      if (art === 'fast') for (let k = 0; k < Math.max(1, Math.floor(n / 6)); k++) {
        const p = Math.floor(Math.random() * (n - 1));
        [a[p], a[p + 1]] = [a[p + 1], a[p]];
      }
      start = a;
    }

    function build() { steps = cfg.baue(start.slice(), n); pos = 0; }

    function render() {
      const s = steps[pos];
      const cols = `repeat(${n}, 1fr)`;
      ['bars', 'marks', 'idx'].forEach(id => $(id).style.gridTemplateColumns = cols);
      const max = Math.max(...s.a);
      $('bars').innerHTML = s.a.map((v, k) => {
        const c = cfg.balken(s, k, pos);
        return `<div class="bar${c ? ' ' + c : ''}" style="height:${10 + 90 * v / max}%" title="a[${k}] = ${v}"><span>${v}</span></div>`;
      }).join('');
      $('idx').innerHTML = s.a.map((_, k) => `<div>${k}</div>`).join('');
      $('marks').innerHTML = s.a.map((_, k) =>
        `<div>${cfg.marken(s, k).map(([cls, t]) => `<span class="${cls}">${t}</span>`).join('<br>')}</div>`).join('');
      if (cfg.kopf) $('kopf').innerHTML = cfg.kopf(s);
      if (cfg.unten) $('unten').innerHTML = cfg.unten(s);
      const msg = $('msg');
      msg.textContent = s.msg; msg.className = 'msg' + (s.cls ? ' ' + s.cls : '');
      $('count').innerHTML = `Schritt ${pos + 1} von ${steps.length} · ` + cfg.zaehler(s, start);
      document.querySelectorAll('#code .ln').forEach(el => el.classList.toggle('on', +el.dataset.i === s.line));
      $('proto').innerHTML = cfg.protokoll(s, start);

      const amEnde = pos === steps.length - 1;
      $('back').disabled = pos === 0;
      $('next').disabled = amEnde;
      (cfg.spruenge || []).forEach((_, k) => $('sprung' + k).disabled = amEnde);
      if (amEnde) stop();
    }

    function stop() { clearInterval(timer); timer = null; $('play').textContent = '▶ Abspielen'; }
    function play() {
      if (pos === steps.length - 1) pos = 0;
      $('play').textContent = '❚❚ Pause';
      timer = setInterval(() => { if (pos < steps.length - 1) { pos++; render(); } else stop(); }, 2000 / +$('speed').value);
      render();
    }
    function fresh() { stop(); makeArray(); build(); render(); }
    function springe(bis) { stop(); do { pos++; } while (pos < steps.length - 1 && !bis(steps[pos])); render(); }

    $('play').addEventListener('click', () => timer ? stop() : play());
    $('next').addEventListener('click', () => { stop(); if (pos < steps.length - 1) { pos++; render(); } });
    $('back').addEventListener('click', () => { stop(); if (pos > 0) { pos--; render(); } });
    (cfg.spruenge || []).forEach((sp, k) => $('sprung' + k).addEventListener('click', () => springe(sp.bis)));
    $('restart').addEventListener('click', () => { stop(); pos = 0; render(); });
    $('speed').addEventListener('input', () => { if (timer) { stop(); play(); } });
    $('size').addEventListener('change', fresh);
    $('art').addEventListener('change', fresh);
    $('fresh').addEventListener('click', fresh);

    // für automatische Tests: Schritte und Startarray von außen lesbar, Startarray setzbar
    if (cfg.test) window[cfg.test] = { get steps() { return steps; }, get start() { return start; },
      setStart(a) { stop(); start = a.slice(); n = a.length; build(); render(); } };

    fresh();
  }

  window.SortierRahmen = { starte, inversionen };
})();
