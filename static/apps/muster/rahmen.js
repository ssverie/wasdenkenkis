/* Gemeinsamer Rahmen der Design-Pattern-Abläufe für wasdenkenkis.de – Claude Code Opus 5.5.
   Zeigt ein Muster in vier Teilen: Klassendiagramm mit den GoF-Rollen, Aufrufstapel, Objekte im Speicher, Konsole –
   daneben der Java-Code der Instanz (window.MUSTER_CODE aus <muster>-code.js, vom Einlese-Skript geschrieben).
   Ein Muster ruft MusterRahmen.starte({ rollen, diagramm, szenarien }) auf; jedes Szenario spielt main() mit dem
   Aufzeichner s nach (s.ruf, s.raus, s.neu, s.feld, s.var, s.aus, s.schritt). Bedienung wie bei den Algorithmen:
   Abspielen am Ende von vorn, „↺ Neu starten“, Höhe der Kästen wächst nur (kein Springen der Knöpfe). */
window.MusterRahmen = (function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function starte(cfg) {
    const CODE = window.MUSTER_CODE || [];
    const rollenNr = {}; cfg.rollen.forEach((r, i) => { rollenNr[r] = i + 1; });
    const klasseRolle = {}; cfg.diagramm.klassen.forEach(k => { klasseRolle[k.name] = k.rolle; });

    document.body.innerHTML = `
<div class="wrap">
  <div class="box controls" id="szenarien"><span class="szenario-titel">Ablauf:</span></div>
  <div class="box"><div class="h">Klassen und ihre Rollen</div><div class="diagramm-rahmen"><svg class="diagramm" id="diagramm" role="img" aria-label="Klassendiagramm"></svg></div><div class="legende" id="rollen"></div></div>
  <div class="box">
    <div class="controls" style="margin-bottom:10px">
      <div class="group">
        <button id="back" aria-label="Schritt zurück">◀ Zurück</button>
        <button id="play" class="primary">▶ Abspielen</button>
        <button id="next" aria-label="Nächster Schritt">Schritt ▶</button>
        <button id="bis" title="Weiter bis zur nächsten Ausgabe auf der Konsole">Bis Ausgabe ▶▶</button>
        <button id="neu" title="Alles zurücksetzen wie beim ersten Öffnen">↺ Neu starten</button>
      </div>
      <label>Tempo <input type="range" id="speed" min="1" max="10" value="5"></label>
    </div>
    <div class="msg" id="msg"></div>
    <div class="count" id="count"></div>
  </div>
  <div class="zwei">
    <div class="box"><div class="h">Java – Code der Instanz, unverändert</div><pre id="code"></pre></div>
    <div class="spalte">
      <div class="box" id="stapelBox"><div class="h">Aufrufstapel (oben: läuft gerade)</div><div class="rahmen-liste" id="stapel"></div></div>
      <div class="box" id="heapBox"><div class="h">Objekte im Speicher</div><div class="heap" id="heap"></div></div>
      <div class="box"><div class="h">Konsole</div><pre id="konsole"></pre></div>
    </div>
  </div>
</div>`;
    $('code').innerHTML = CODE.map((l, i) => `<span class="ln" data-i="${i}">${esc(l) || ' '}</span>`).join('');
    $('rollen').innerHTML = cfg.rollen.map(r => `<span class="rolle-${rollenNr[r]}"><i class="r"></i>${esc(r)}</span>`).join('');
    zeichneDiagramm(cfg.diagramm, rollenNr);

    // ---------- Aufzeichnung ----------
    let steps = [], pos = 0, timer = null, szenario = 0;
    function zeile(z) {
      if (typeof z === 'number') return z;
      if (Array.isArray(z)) return zeile(z[0]) + z[1];     // [Text, Versatz], z. B. die Klammer nach der letzten Zeile
      const treffer = CODE.map((l, i) => l.includes(z) ? i : -1).filter(i => i >= 0);
      if (treffer.length !== 1) throw new Error(`Codezeile „${z}“: ${treffer.length} Treffer`);
      return treffer[0];
    }
    function aufzeichnen(lauf) {
      const st = { stapel: [], heap: [], konsole: [], zaehler: {} };
      const out = [];
      let neueObj = [], neueZeilen = 0;
      const s = {
        // Methode betreten: Rahmen auf den Stapel
        ruf(sig, vars, z, msg, o) { st.stapel.push({ sig, vars: (vars || []).map(v => v.slice()) }); s.schritt(z, msg, o); },
        // Methode verlassen: Rahmen vom Stapel; o.setze = [[name, wert]] weist den Rückgabewert im Aufrufer zu
        raus(z, msg, o) { st.stapel.pop(); ((o && o.setze) || []).forEach(([n, w]) => s.var(n, w)); s.schritt(z, msg, o); },
        var(name, wert) { const f = st.stapel[st.stapel.length - 1]; const v = f.vars.find(v => v[0] === name); if (v) v[1] = wert; else f.vars.push([name, wert]); },
        neu(klasse, felder) {
          st.zaehler[klasse] = (st.zaehler[klasse] || 0) + 1;
          const id = `${klasse} #${st.zaehler[klasse]}`;
          st.heap.push({ id, klasse, felder: (felder || []).map(f => f.slice()), weg: false }); neueObj.push(id);
          return id;
        },
        feld(id, name, wert) { const o = st.heap.find(o => o.id === id); const f = o.felder.find(f => f[0] === name); if (f) f[1] = wert; else o.felder.push([name, wert]); },
        weg(...ids) { ids.forEach(id => { st.heap.find(o => o.id === id).weg = true; }); },
        aus(text) { String(text).split('\n').forEach(t => st.konsole.push(t)); neueZeilen += String(text).split('\n').length; },
        ref: id => `→ ${id}`,
        schritt(z, msg, o) {
          o = o || {};
          const hl = {}; neueObj.forEach(id => { hl[id] = 'neu'; }); (o.cur || []).forEach(id => { hl[id] = 'cur'; });
          const klassen = new Set(o.klassen || []);
          Object.keys(hl).forEach(id => klassen.add(st.heap.find(x => x.id === id).klasse));
          out.push({ line: zeile(z), msg, hl, klassen: [...klassen],
            stapel: st.stapel.map(f => ({ sig: f.sig, vars: f.vars.map(v => v.slice()) })),
            heap: st.heap.map(x => ({ ...x, felder: x.felder.map(f => f.slice()) })),
            konsole: st.konsole.slice(), neueZeilen, ausgabe: neueZeilen > 0 });
          neueObj = []; neueZeilen = 0;
        }
      };
      lauf(s);
      return out;
    }

    // ---------- Anzeige ----------
    function render() {
      const s = steps[pos];
      document.querySelectorAll('#code .ln').forEach(el => el.classList.toggle('on', +el.dataset.i === s.line));
      const an = $('code').querySelector('.ln.on');
      if (an) { const pre = $('code'); const oben = an.offsetTop - pre.offsetTop; if (oben < pre.scrollTop + 20 || oben > pre.scrollTop + pre.clientHeight - 40) pre.scrollTop = Math.max(0, oben - pre.clientHeight / 3); }
      const aktiv = new Set(s.klassen);
      document.querySelectorAll('#diagramm g.k').forEach(g => { g.classList.toggle('aktiv', aktiv.has(g.dataset.name)); g.classList.toggle('ruhig', aktiv.size > 0 && !aktiv.has(g.dataset.name)); });
      $('stapel').innerHTML = s.stapel.length
        ? s.stapel.slice().reverse().map((f, i) => `<div class="frame${i === 0 ? ' oben' : ''}"><div class="sig">${esc(f.sig)}</div>${f.vars.map(v => `<div class="var"><b>${esc(v[0])}</b> = ${esc(v[1])}</div>`).join('')}</div>`).join('')
        : '<p class="leer">Das Programm ist beendet.</p>';
      $('heap').innerHTML = s.heap.length
        ? s.heap.map(o => `<div class="obj rolle-${rollenNr[klasseRolle[o.klasse]] || 0}${s.hl[o.id] ? ' ' + s.hl[o.id] : ''}${o.weg ? ' weg' : ''}"><div class="kopf"><b>${esc(o.id)}</b><small>${esc(klasseRolle[o.klasse] || '')}</small></div>${o.felder.map(f => `<div class="feld">${esc(f[0])} = ${esc(f[1])}</div>`).join('')}</div>`).join('')
        : '<p class="leer">Noch keine Objekte.</p>';
      const k = s.konsole;
      $('konsole').innerHTML = k.map((t, i) => `<span class="zeile${i >= k.length - s.neueZeilen ? ' neu' : ''}">${esc(t) || ' '}</span>`).join('');
      $('msg').textContent = s.msg;
      $('count').textContent = `Schritt ${pos + 1} von ${steps.length}`;
      const amEnde = pos === steps.length - 1;
      $('back').disabled = pos === 0; $('next').disabled = amEnde; $('bis').disabled = amEnde;
      ['stapelBox', 'heapBox', 'msg'].forEach(i => stabil($(i)));
      if (amEnde) stop();
    }
    // Kästen werden nie wieder niedriger, sonst springen die Knöpfe auf und ab
    function stabil(el) { const h = el.offsetHeight; if (h > (el._hoch || 0)) { el._hoch = h; el.style.minHeight = h + 'px'; } }
    function stabilZurueck() { ['stapelBox', 'heapBox', 'msg'].forEach(i => { $(i)._hoch = 0; $(i).style.minHeight = ''; }); }
    window.addEventListener('resize', () => { stabilZurueck(); if (steps.length) render(); });

    function stop() { clearInterval(timer); timer = null; $('play').textContent = '▶ Abspielen'; }
    function play() {
      if (pos === steps.length - 1) pos = 0;      // am Ende: von vorn abspielen
      $('play').textContent = '❚❚ Pause';
      timer = setInterval(() => { if (pos < steps.length - 1) { pos++; render(); } else stop(); }, 2400 / +$('speed').value);
      render();
    }
    function waehle(i) {
      stop(); szenario = i; steps = aufzeichnen(cfg.szenarien[i].laufe); pos = 0;
      document.querySelectorAll('#szenarien button').forEach((b, j) => b.classList.toggle('primary', j === i));
      stabilZurueck(); render();
    }
    cfg.szenarien.forEach((sz, i) => {
      const b = document.createElement('button'); b.textContent = sz.name; if (sz.titel) b.title = sz.titel;
      b.addEventListener('click', () => waehle(i)); $('szenarien').appendChild(b);
    });
    $('play').addEventListener('click', () => timer ? stop() : play());
    $('next').addEventListener('click', () => { stop(); if (pos < steps.length - 1) { pos++; render(); } });
    $('back').addEventListener('click', () => { stop(); if (pos > 0) { pos--; render(); } });
    $('bis').addEventListener('click', () => { stop(); do { pos++; } while (pos < steps.length - 1 && !steps[pos].ausgabe); render(); });
    $('neu').addEventListener('click', () => waehle(0));
    $('speed').addEventListener('input', () => { if (timer) { stop(); play(); } });

    // für automatische Tests: Konsole am Ende jedes Szenarios, alle Schritte
    window.__muster = {
      konsole: i => { const st = aufzeichnen(cfg.szenarien[i].laufe); return st[st.length - 1].konsole.join('\n'); },
      schritte: i => aufzeichnen(cfg.szenarien[i].laufe), waehle, get steps() { return steps; }, get pos() { return pos; },
      code: CODE, anzahl: cfg.szenarien.length };
    waehle(0);
  }

  // Klassendiagramm: Kästen auf einem Raster (x, y in Spalten/Zeilen), Kanten implementiert / nutzt / erzeugt
  function zeichneDiagramm(d, rollenNr) {
    const B = d.breite || 170, H = 58, SX = B + (d.abstandX || 40), SY = H + (d.abstandY || 46), R = d.rand || 14;
    const RY = 14;                                   // Rand oben/unten; R (seitlich) ist breiter, wenn Bögen außen herumlaufen
    const pos = {}; d.klassen.forEach(k => { pos[k.name] = { x: R + k.x * SX, y: RY + k.y * SY }; });
    const spalten = Math.max(...d.klassen.map(k => k.x)) + 1, zeilen = Math.max(...d.klassen.map(k => k.y)) + 1;
    const W = 2 * R + spalten * SX - (SX - B), Hg = 2 * RY + zeilen * SY - (SY - H) + (d.untenPlatz || 0);   // untenPlatz: für Bögen unter der letzten Zeile
    // Anschlusspunkt am Kastenrand in Richtung des anderen Kastens
    const rand = (a, b) => {
      const ax = a.x + B / 2, ay = a.y + H / 2, bx = b.x + B / 2, by = b.y + H / 2, dx = bx - ax, dy = by - ay;
      const t = Math.min(Math.abs(dx) > 0 ? (B / 2) / Math.abs(dx) : Infinity, Math.abs(dy) > 0 ? (H / 2) / Math.abs(dy) : Infinity);
      return [ax + dx * t, ay + dy * t];
    };
    let defs = `<defs>
      <marker id="dreieck" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 Z" style="fill:var(--panel);stroke:var(--grau);stroke-width:1.3"/></marker>
      <marker id="pfeil" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11" style="fill:none;stroke:var(--grau);stroke-width:1.5"/></marker>
    </defs>`;
    let kanten = '';
    (d.kanten || []).forEach(k => {
      const art = { impl: 'gestrichelt" marker-end="url(#dreieck)', erbt: '" marker-end="url(#dreieck)', nutzt: '" marker-end="url(#pfeil)', erzeugt: 'gestrichelt" marker-end="url(#pfeil)' }[k.art];
      let tx, ty;
      if (k.unten) {
        // Bogen unten herum, von Kastenunterkante zu Kastenunterkante – für Kästen in derselben Zeile mit etwas dazwischen
        const a = pos[k.von], b = pos[k.zu];
        const x1 = a.x + B / 2, x2 = b.x + B / 2, y = a.y + H, cy = y + k.unten;
        kanten += `<path d="M${x1},${y} C${x1},${cy} ${x2},${cy} ${x2},${y}" class="${art}"/>`;
        tx = (x1 + x2) / 2; ty = y + 0.75 * k.unten + 14;
      } else if (k.bogen) {
        // Bogen außen herum (bogen < 0: links bzw. oben), von Kastenseite zu Kastenseite – z. B. Fabrik → zweites Produkt darunter
        const a = pos[k.von], b = pos[k.zu], links = k.bogen < 0;
        const x1 = links ? a.x : a.x + B, y1 = a.y + H / 2, x2 = links ? b.x : b.x + B, y2 = b.y + H / 2, cx = x1 + k.bogen;
        kanten += `<path d="M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}" class="${art}"/>`;
        tx = x1 + 0.75 * k.bogen; ty = (y1 + y2) / 2;      // weitester Punkt der Kurve
      } else {
        const [x1, y1] = rand(pos[k.von], pos[k.zu]), [x2, y2] = rand(pos[k.zu], pos[k.von]);
        kanten += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${art}"/>`;
        tx = (x1 + x2) / 2; ty = (y1 + y2) / 2;
      }
      if (k.text) kanten += `<text class="kante" x="${tx + (k.dx || 0)}" y="${ty + (k.dy || -4)}">${esc(k.text)}</text>`;
    });
    let kaesten = '';
    d.klassen.forEach(k => {
      const p = pos[k.name];
      kaesten += `<g class="k rolle-${rollenNr[k.rolle] || 0}" data-name="${esc(k.name)}">
        <rect class="klasse" x="${p.x}" y="${p.y}" width="${B}" height="${H}" rx="8"/>
        <text class="stereo" x="${p.x + B / 2}" y="${p.y + 15}">${esc(k.art ? '«' + k.art + '»' : '')}</text>
        <text class="name" x="${p.x + B / 2}" y="${p.y + 33}">${esc(k.name)}</text>
        <text class="rolle" x="${p.x + B / 2}" y="${p.y + 49}">${esc(k.rolle)}</text></g>`;
    });
    const svg = document.getElementById('diagramm');
    svg.setAttribute('viewBox', `0 0 ${W} ${Hg}`);
    svg.style.width = W + 'px'; svg.style.maxWidth = '100%'; svg.style.minWidth = Math.round(W * 0.62) + 'px';
    svg.innerHTML = defs + kanten + kaesten;
  }

  return { starte };
})();
