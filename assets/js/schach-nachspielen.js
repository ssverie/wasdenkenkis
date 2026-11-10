// Lösungen nachspielen (Shortcode schachaufgaben, Parameter nachspielen="592,…" – Sven: „versuche mal 592 spielbar zu
// machen, evtl auch mit den Varianten“). Eigenes Skript ohne Bibliotheken: liest Stellung (FEN), Hauptlinie und Varianten
// aus dem fertigen HTML, macht jeden Zug anklickbar und stellt unter der Lösung Knöpfe ⏮ ◀ ▶ ⏭ bereit; das Brett links
// zeigt die Stellung nach dem gewählten Zug. Varianten zweigen dort ab, wo ihre Zugnummer in der Hauptlinie steht;
// Klammern darin zweigen von der Variante ab. Was sich nicht als Zug lesen lässt (Text, Bewertungen), bleibt Text;
// passt ein Zug nicht zur Stellung, bleibt der Rest der Zeile Text. Zuglogik wie skripte/loesung-nachspielen.pl
// (deutsche Buchstaben K D T L S, Umwandlung „f8D“, Rochade „0-0“). Ohne Skript bleibt alles wie bisher.
// Seit 2026-11-01 außerdem wie im Buch (Sven: „genau so wie im Image“ – „probier mal 1+2“): Figurinen statt Buchstaben,
// und jede Variante steht eingerückt direkt unter dem Zug der Hauptlinie, von dem sie abzweigt.
(function () {
  'use strict';
  var TYP = { K: 'K', D: 'Q', T: 'R', L: 'B', S: 'N' };
  var NAME = { K: 'König', Q: 'Dame', R: 'Turm', B: 'Läufer', N: 'Springer', P: 'Bauer' };
  // Abspielen: Millisekunden je Halbzug; gemerkte Wahl aus localStorage (fehlt sie, „mittel“). Es spielt immer nur ein Brett.
  var TEMPI = [['langsam', 2500], ['mittel', 1500], ['schnell', 700]];
  var tempo = 1500, laufend = null;
  try { var gemerkt = Number(localStorage.getItem('np-tempo')); if (TEMPI.some(function (t) { return t[1] === gemerkt; })) tempo = gemerkt; } catch (e) { /* ohne Speicher: mittel */ }

  function index(f) { return (8 - Number(f[1])) * 8 + (f.charCodeAt(0) - 97); }
  function feld(c, r) { return (c < 0 || c > 7 || r < 1 || r > 8) ? null : String.fromCharCode(97 + c) + r; }
  function eigen(p, w) { return !!p && (w ? p === p.toUpperCase() : p === p.toLowerCase()); }

  function ausFen(fen) {
    var b = new Array(64).fill(null);
    fen.split(' ')[0].split('/').forEach(function (reihe, r) {
      var c = 0;
      reihe.split('').forEach(function (ch) {
        if (/\d/.test(ch)) c += Number(ch); else { b[r * 8 + c] = ch; c++; }
      });
    });
    return b;
  }

  // Kann eine Figur vom Typ typ (K Q R B N) von „von“ nach „nach“ ziehen (ohne Bauern)?
  function erreicht(b, von, nach, typ) {
    var vf = von.charCodeAt(0) - 97, vr = Number(von[1]), nf = nach.charCodeAt(0) - 97, nr = Number(nach[1]);
    var df = nf - vf, dr = nr - vr;
    if (!df && !dr) return false;
    if (typ === 'N') return Math.abs(df) * Math.abs(dr) === 2;
    if (typ === 'K') return Math.abs(df) <= 1 && Math.abs(dr) <= 1;
    var gerade = !df || !dr, diag = Math.abs(df) === Math.abs(dr);
    if (typ === 'R' && !gerade) return false;
    if (typ === 'B' && !diag) return false;
    if (typ === 'Q' && !gerade && !diag) return false;
    var sf = Math.sign(df), sr = Math.sign(dr), f = vf + sf, r = vr + sr;
    while (f !== nf || r !== nr) { if (b[index(feld(f, r))]) return false; f += sf; r += sr; }
    return true;
  }

  function angegriffen(b, ziel, w) {
    var zf = ziel.charCodeAt(0) - 97, zr = Number(ziel[1]);
    for (var i = 0; i < 64; i++) {
      var p = b[i];
      if (!eigen(p, w)) continue;
      var q = feld(i % 8, 8 - Math.floor(i / 8)), typ = p.toUpperCase();
      if (typ === 'P') {
        if (zr === Number(q[1]) + (w ? 1 : -1) && Math.abs(zf - (q.charCodeAt(0) - 97)) === 1) return true;
        continue;
      }
      if (erreicht(b, q, ziel, typ)) return true;
    }
    return false;
  }

  function imSchach(b, w) {
    var k = b.indexOf(w ? 'K' : 'k');
    if (k < 0) return false;
    return angegriffen(b, feld(k % 8, 8 - Math.floor(k / 8)), !w);
  }

  // Führt den Zug s (ohne !?+#) aus. Ergebnis: {b, von, nach, ep} oder eine Fehlermeldung (Text).
  function zug(alt, w, s, ep) {
    var b = alt.slice(), grund = w ? 1 : 8;
    var ro = /^[0O]-[0O](-[0O])?$/.exec(s);
    if (ro) {
      var lang = !!ro[1], k = w ? 'K' : 'k', t = w ? 'R' : 'r';
      // Auch Chess960: König irgendwo auf der Grundreihe, Turm = der äußerste auf der Rochadeseite;
      // danach steht der König auf c/g, der Turm auf d/f (wie im normalen Schach).
      var reihe = 'abcdefgh', kf = -1, tf = -1, i;
      for (i = 0; i < 8; i++) if (b[index(reihe[i] + grund)] === k) kf = i;
      if (kf < 0) return 'Rochade nicht möglich';
      if (lang) { for (i = 0; i < kf; i++) if (b[index(reihe[i] + grund)] === t) { tf = i; break; } }
      else { for (i = 7; i > kf; i--) if (b[index(reihe[i] + grund)] === t) { tf = i; break; } }
      if (tf < 0) return 'Rochade nicht möglich';
      var kv = reihe[kf] + grund, tn = (lang ? 'd' : 'f') + grund, kn = (lang ? 'c' : 'g') + grund;
      b[index(kv)] = null; b[index(reihe[tf] + grund)] = null; b[index(kn)] = k; b[index(tn)] = t;
      // Bleibt der König stehen (Chess960), den Turmzug markieren
      if (kv === kn) return { b: b, von: reihe[tf] + grund, nach: tn, ep: '' };
      return { b: b, von: kv, nach: kn, ep: '' };
    }
    var m = /^([KDTLS])?([a-h])?([1-8])?(x)?([a-h][1-8])=?([DTLS])?$/.exec(s);
    if (!m) return 'nicht lesbar';
    var fig = m[1], vf = m[2], vr = m[3], x = m[4], nach = m[5], um = m[6], ziel = b[index(nach)];
    if (x) {
      if (!ziel && !(!fig && nach === ep)) return 'Schlagzug auf leeres Feld';
      if (ziel && eigen(ziel, w)) return 'schlägt eigene Figur';
    } else if (ziel) return 'Zielfeld besetzt';
    var kand = [], nf = nach.charCodeAt(0) - 97, nr = Number(nach[1]);
    if (!fig) {
      var bp = w ? 'P' : 'p', d = w ? 1 : -1, q;
      if (x) {
        if (!vf) return 'Bauernschlag ohne Linie';
        q = feld(vf.charCodeAt(0) - 97, nr - d);
        if (q && b[index(q)] === bp && Math.abs(vf.charCodeAt(0) - 97 - nf) === 1) kand.push(q);
      } else {
        q = feld(nf, nr - d);
        if (q && b[index(q)] === bp) kand.push(q);
        else if (q && !b[index(q)]) {
          var q2 = feld(nf, nr - 2 * d);
          if (q2 && b[index(q2)] === bp && nr === (w ? 4 : 5)) kand.push(q2);
        }
      }
    } else {
      var typ = TYP[fig], p = w ? typ : typ.toLowerCase();
      for (var i = 0; i < 64; i++) {
        if (b[i] !== p) continue;
        var von = feld(i % 8, 8 - Math.floor(i / 8));
        if (vf && von[0] !== vf) continue;
        if (vr && von[1] !== vr) continue;
        if (erreicht(b, von, nach, typ)) kand.push(von);
      }
    }
    if (!kand.length) return 'keine passende Figur';
    if (kand.length > 1) {   // gefesselte Figuren aussortieren
      kand = kand.filter(function (v) { var c = b.slice(); c[index(nach)] = c[index(v)]; c[index(v)] = null; return !imSchach(c, w); });
      if (kand.length !== 1) return 'mehrdeutig';
    }
    var start = kand[0], figur = b[index(start)];
    b[index(start)] = null;
    if (!fig && x && !ziel) b[index(nach[0] + start[1])] = null;   // en passant
    var neuEp = (!fig && Math.abs(nr - Number(start[1])) === 2) ? nach[0] + ((nr + Number(start[1])) / 2) : '';
    if (um) figur = w ? TYP[um] : TYP[um].toLowerCase();
    else if (!fig && nr === (w ? 8 : 1)) return 'Umwandlung ohne Figur';
    b[index(nach)] = figur;
    if (imSchach(b, w)) return 'eigener König im Schach';
    return { b: b, von: start, nach: nach, ep: neuEp };
  }

  var ZUG = /^(?:(\d+)(\.\.\.|\.))?([KDTLS]?[a-h]?[1-8]?x?[a-h][1-8](?:=?[DTLS])?|[0O]-[0O](?:-[0O])?)([+#]*)([!?]*)$/;   // „++“ = Doppelschach

  function einrichten(li) {
    var brett = li.querySelector('.brett'), loesung = li.querySelector('details.schachloesung');
    var haupt = loesung && loesung.querySelector('.hauptlinie strong');
    var fenEl = li.querySelector('code.fen');
    if (!brett || !haupt || !fenEl) return;
    var fen = fenEl.textContent.trim(), teile = fen.split(' ');
    var startBrett = ausFen(fen), startWeiss = teile[1] === 'w', startNr = Number(teile[5]) || 1;
    var startEp = teile[3] && teile[3] !== '-' ? teile[3] : '';
    var felder = brett.querySelectorAll('.feld');
    var bild = brett.querySelector('img.figur');
    var basis = bild ? bild.getAttribute('src').replace(/[wb][KQRBNP]\.svg$/, '') : '';
    var aktuell = null, aktivEl = null;
    var uhr = null, automatisch = false, abspielKnopf = null;

    function plyVon(nr, schwarz) { return (nr - startNr) * 2 + (schwarz ? 1 : 0) - (startWeiss ? 0 : 1); }
    function schwarzBeiPly(ply) { return (ply + (startWeiss ? 0 : 1)) % 2 === 1; }
    function nummerBeiPly(ply) { return startNr + Math.floor((ply + (startWeiss ? 0 : 1)) / 2); }

    // Figurinen wie im Buch (Sven, „genau so wie im Image“): Figurenbuchstabe → kleines Figurenbild (immer der weiße Satz,
    // wie im Buch); alt = Buchstabe, damit Kopieren weiter „Sf5“ ergibt.
    function figurine(t) {
      var frag = document.createDocumentFragment();
      var m = /^(\d+\.(?:\.\.)?)?([KDTLS])?(.*?)(=?)([DTLS])?([+#]*[!?]*)$/.exec(t);
      function bild(b) {
        var img = document.createElement('img');
        img.className = 'np-fig'; img.alt = b; img.src = basis + 'w' + TYP[b] + '.svg';
        return img;
      }
      if (!m) { frag.appendChild(document.createTextNode(t)); return frag; }
      if (m[1]) frag.appendChild(document.createTextNode(m[1]));
      if (m[2]) frag.appendChild(bild(m[2]));
      frag.appendChild(document.createTextNode(m[3] + m[4]));
      if (m[5]) frag.appendChild(bild(m[5]));
      if (m[6]) frag.appendChild(document.createTextNode(m[6]));
      return frag;
    }

    function zeigen(b, von, nach) {
      for (var i = 0; i < 64; i++) {
        var f = felder[i], p = b[i], img = f.querySelector('img');
        if (p) {
          var w = p === p.toUpperCase(), typ = p.toUpperCase(), src = basis + (w ? 'w' : 'b') + typ + '.svg';
          if (!img) { img = document.createElement('img'); img.className = 'figur'; img.width = 45; img.height = 45; f.appendChild(img); }
          if (img.getAttribute('src') !== src) img.setAttribute('src', src);
          img.alt = (w ? 'Weiß: ' : 'Schwarz: ') + NAME[typ];
        } else if (img) img.remove();
        f.classList.remove('np-markiert');
      }
      if (von) felder[index(von)].classList.add('np-markiert');
      if (nach) felder[index(nach)].classList.add('np-markiert');
    }

    function gehe(knoten) {
      if (!automatisch) stoppe();   // jeder Eingriff von Hand hält das Abspielen an
      aktuell = knoten;
      if (aktivEl) aktivEl.classList.remove('np-aktiv');
      aktivEl = knoten ? knoten.el : null;
      if (aktivEl) aktivEl.classList.add('np-aktiv');
      if (knoten) zeigen(knoten.nach, knoten.von, knoten.ziel); else zeigen(startBrett);
    }

    // Wandelt den Text einer Zeile in Text + anklickbare Züge um. hauptlinie = true: Start in der Ausgangsstellung.
    // frueher = schon verarbeitete Varianten: eine Untervariante des Buchs, die als eigene Zeile steht,
    // hängt sich an die letzte frühere Variante, in der ihr erster Zug passt.
    function verarbeite(el, hauptlinie, hauptPlys, frueher) {
      var text = el.textContent, teile = text.match(/\(|\)|\s+|[^\s()]+/g) || [];
      var frag = document.createDocumentFragment();
      function neueLinie(eltern) { return { pos: null, w: null, ply: null, vorher: null, ep: '', kaputt: false, plys: {}, eltern: eltern, erster: true }; }
      function anker(plys, ply) {
        var k = plys[ply], davor = plys[ply - 1];
        if (k) return { pos: k.vor, ep: k.epVor, vorher: k.vorher };
        if (davor) return { pos: davor.nach, ep: davor.ep, vorher: davor };
        return null;
      }
      // Wie viele Züge dieser Linie (ab teile[i], Klammern übersprungen) lassen sich von Stellung a aus spielen?
      function reichweite(a, w, ply, i) {
        var pos = a.pos, ep = a.ep, tiefe = 0, n = 0;
        for (var j = i; j < teile.length; j++) {
          var t = teile[j];
          if (t === '(') { tiefe++; continue; }
          if (t === ')') { if (!tiefe) break; tiefe--; continue; }
          if (tiefe) continue;
          var m = ZUG.exec(t);
          if (!m) continue;
          if (m[1] && plyVon(Number(m[1]), m[2] === '...') !== ply) break;
          var erg = zug(pos, w, m[3], ep);
          if (typeof erg === 'string') break;
          pos = erg.b; ep = erg.ep; w = !w; ply++; n++;
        }
        return n;
      }
      var linie = neueLinie(null), wurzel = linie, stapel = [], eigene = [], abzweig;
      if (hauptlinie) { linie.pos = startBrett; linie.w = startWeiss; linie.ply = 0; linie.ep = startEp; linie.plys = hauptPlys; }
      teile.forEach(function (t, ti) {
        if (t === '(') { stapel.push(linie); linie = neueLinie(linie); frag.appendChild(document.createTextNode(t)); return; }
        if (t === ')') { if (stapel.length) linie = stapel.pop(); frag.appendChild(document.createTextNode(t)); return; }
        var m = ZUG.exec(t);
        if (m && (linie.kaputt || (!m[1] && linie.pos === null))) { frag.appendChild(figurine(t)); return; }
        if (!m || /^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
        var w, ply;
        if (m[1]) {
          var schwarz = m[2] === '...';
          w = !schwarz; ply = plyVon(Number(m[1]), schwarz);
          if (linie.pos === null || linie.ply !== ply) {
            if (linie.pos !== null) { linie.kaputt = true; frag.appendChild(figurine(t)); return; }
            // Abzweig: Stellung vor diesem Halbzug in der übergeordneten Linie (endet sie davor: nach ihrem
            // letzten Zug), in der Hauptlinie oder in einer früheren Variante. Gewählt wird die Quelle, von der
            // aus sich die Linie am weitesten nachspielen lässt (bei Gleichstand die erste in dieser Reihenfolge);
            // passt schon der erste Zug nirgends, die erste vorhandene (dann meldet zug() den Fehler).
            var quellen = [];
            if (linie.eltern) quellen.push({ plys: linie.eltern.plys });
            quellen.push({ plys: hauptPlys, abzweig: ply });
            if (!hauptlinie && !linie.eltern && frueher) {
              for (var i = frueher.length - 1; i >= 0; i--) quellen.push({ plys: frueher[i].plys, abzweig: frueher[i].abzweig });
            }
            var gewaehlt = null, erste = null, beste = 0;
            quellen.forEach(function (q) {
              var a = anker(q.plys, ply);
              if (!a && ply === 0 && q.plys === hauptPlys) a = { pos: startBrett, ep: startEp, vorher: null };
              if (!a) return;
              a.abzweig = q.abzweig;
              if (!erste) erste = a;
              var n = reichweite(a, w, ply, ti);
              if (n > beste) { beste = n; gewaehlt = a; }
            });
            gewaehlt = gewaehlt || erste;
            if (!gewaehlt) { linie.kaputt = true; frag.appendChild(figurine(t)); return; }
            if (!hauptlinie && !stapel.length && abzweig === undefined) abzweig = gewaehlt.abzweig !== undefined ? gewaehlt.abzweig : ply;
            linie.pos = gewaehlt.pos; linie.ep = gewaehlt.ep; linie.vorher = gewaehlt.vorher;
            linie.w = w; linie.ply = ply;
          }
        } else {
          w = linie.w; ply = linie.ply;
        }
        var erg = zug(linie.pos, w, m[3], linie.ep);
        if (typeof erg === 'string') {
          linie.kaputt = true;
          frag.appendChild(figurine(t));
          if (window.console) console.warn('Nachspielen ' + li.id + ': ' + t + ' – ' + erg);
          return;
        }
        var span = document.createElement('span');
        span.className = 'np-zug'; span.appendChild(figurine(t)); span.tabIndex = 0; span.setAttribute('role', 'button');
        var knoten = { vor: linie.pos, nach: erg.b, von: erg.von, ziel: erg.nach, epVor: linie.ep, ep: erg.ep,
                       vorher: linie.vorher, weiter: null, el: span, ply: ply, nummeriert: !!m[1] };
        span.knoten = knoten;
        if (!linie.erster && linie.vorher) linie.vorher.weiter = knoten;
        linie.erster = false;
        linie.plys[ply] = knoten;
        eigene.push(knoten);
        span.addEventListener('click', function () { gehe(knoten); });
        span.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); gehe(knoten); } });
        frag.appendChild(span);
        linie.pos = erg.b; linie.ep = erg.ep; linie.w = !w; linie.ply = ply + 1; linie.vorher = knoten;
      });
      el.textContent = '';
      el.appendChild(frag);
      eigene.abzweig = abzweig;
      eigene.plys = wurzel.plys;
      return eigene;
    }

    var hauptPlys = {};
    var hauptKnoten = verarbeite(haupt, true, hauptPlys);
    if (!hauptKnoten.length) return;
    // Bewertungen (KI-Partien, seit 2026-11-03): je Halbzug der Hauptlinie ein Wert, klein hinter dem Zug.
    var bewEl = loesung.querySelector('.np-bewertungen');
    if (bewEl) {
      bewEl.textContent.trim().split(/\s+/).forEach(function (wert, i) {
        var k = hauptKnoten[i];
        if (!k) return;
        var ev = document.createElement('span');
        ev.className = 'np-ev'; ev.textContent = wert;
        ev.zuKnoten = k; k.evEl = ev;
        k.el.parentNode.insertBefore(ev, k.el.nextSibling);
        k.el.parentNode.insertBefore(document.createTextNode(' '), k.el.nextSibling);
      });
    }
    // Kommentare an Zügen: data-nach = „12.d5“ oder „18...Tab8“ (auch „18…Tab8“) → Halbzug der Hauptlinie.
    var kommBeiPly = {};
    loesung.querySelectorAll('.np-kommentare p').forEach(function (p) {
      var m = /^(\d+)(\.\.\.|…|\.)/.exec(p.dataset.nach || '');
      if (!m) return;
      var ply = plyVon(Number(m[1]), m[2] !== '.');
      if (hauptPlys[ply]) (kommBeiPly[ply] = kommBeiPly[ply] || []).push(p);
    });
    var varianten = [];
    loesung.querySelectorAll('.varianten li').forEach(function (v) {
      var e = verarbeite(v, false, hauptPlys, varianten);
      varianten.push({ el: v, abzweig: e.abzweig, plys: e.plys });
    });

    var knoepfe = document.createElement('div');
    knoepfe.className = 'np-knoepfe';
    [['⏮', 'Zur Ausgangsstellung', function () { gehe(null); }],
     ['◀', 'Einen Zug zurück', function () { if (aktuell) gehe(aktuell.vorher); }],
     ['▶', 'Einen Zug vor', function () { if (!aktuell) gehe(hauptKnoten[0]); else if (aktuell.weiter) gehe(aktuell.weiter); }],
     ['⏭', 'Zum Ende der Linie', function () { var k = aktuell || hauptKnoten[0]; while (k.weiter) k = k.weiter; gehe(k); }]
    ].forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = a[0]; b.title = a[1]; b.setAttribute('aria-label', a[1]);
      b.addEventListener('click', a[2]);
      knoepfe.appendChild(b);
    });
    // Abspielen (Sven, 2026-11-02: „ein Button reicht, mach es abhängig vom State“): ⏩ startet, während des Laufens
    // zeigt derselbe Knopf ⏸ (Pause – die Stellung bleibt stehen, ⏩ spielt dort weiter) und hält an. Läuft ab der Stellung auf dem Brett die aktuelle Linie entlang; steht das Brett
    // am Ende, beginnt es von vorn. Tempo wählbar, die Wahl gilt für alle Bretter und wird gemerkt.
    abspielKnopf = document.createElement('button');
    abspielKnopf.type = 'button'; abspielKnopf.className = 'np-abspielen';
    abspielKnopf.addEventListener('click', function () { if (uhr) stoppe(); else starte(); });
    knoepfe.appendChild(abspielKnopf);
    zeigeKnopf();
    var tempoWahl = document.createElement('select');
    tempoWahl.className = 'np-tempo'; tempoWahl.title = 'Tempo beim Abspielen'; tempoWahl.setAttribute('aria-label', 'Tempo beim Abspielen');
    TEMPI.forEach(function (t) {
      var o = document.createElement('option');
      o.value = t[1]; o.textContent = t[0]; if (t[1] === tempo) o.selected = true;
      tempoWahl.appendChild(o);
    });
    tempoWahl.addEventListener('change', function () {
      tempo = Number(tempoWahl.value);
      try { localStorage.setItem('np-tempo', String(tempo)); } catch (e) { /* ohne Speicher gilt die Wahl nur hier */ }
      document.querySelectorAll('select.np-tempo').forEach(function (s) { s.value = String(tempo); });
    });
    knoepfe.appendChild(tempoWahl);
    // PGN-Download (Sven, 2026-11-02: „rechts neben dem Geschwindigkeitsbutton … pgn“): der Text kommt fertig aus dem
    // Shortcode (data-pgn, Partial schach-pgn.html), hier wird er nur als Datei angeboten.
    if (li.dataset.pgn) {
      var pgnKnopf = document.createElement('button');
      pgnKnopf.type = 'button'; pgnKnopf.className = 'np-pgn'; pgnKnopf.textContent = 'PGN ⬇';
      pgnKnopf.title = 'Als PGN-Datei speichern'; pgnKnopf.setAttribute('aria-label', 'Als PGN-Datei speichern');
      pgnKnopf.addEventListener('click', function () {
        var url = URL.createObjectURL(new Blob([li.dataset.pgn], { type: 'application/x-chess-pgn;charset=utf-8' }));
        var a = document.createElement('a');
        a.href = url; a.download = li.dataset.pgnName || 'partie.pgn';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
      knoepfe.appendChild(pgnKnopf);
    }
    // Brett drehen (Sven, 2026-11-10: „können wir das Brett flippen … ein Knopf drücken“): kehrt nur die Reihenfolge
    // der 64 Felder im Raster um (CSS order), die Figuren bleiben aufrecht, Markierungen wandern mit. Gilt nur für
    // dieses Brett und wird nicht gemerkt.
    var drehKnopf = document.createElement('button'), gedreht = false;
    drehKnopf.type = 'button'; drehKnopf.className = 'np-drehen'; drehKnopf.textContent = '⇅';
    function zeigeDrehung() {
      var t = gedreht ? 'Brett aus Sicht von Weiß' : 'Brett aus Sicht von Schwarz';
      drehKnopf.title = t; drehKnopf.setAttribute('aria-label', t);
      drehKnopf.setAttribute('aria-pressed', gedreht ? 'true' : 'false');
      brett.classList.toggle('np-gedreht', gedreht);
      var al = brett.getAttribute('aria-label');
      if (al) brett.setAttribute('aria-label', al.replace(/Sicht von (Weiß|Schwarz)/, gedreht ? 'Sicht von Schwarz' : 'Sicht von Weiß'));
      for (var i = 0; i < 64; i++) felder[i].style.order = gedreht ? String(63 - i) : '';
    }
    drehKnopf.addEventListener('click', function () { gedreht = !gedreht; zeigeDrehung(); });
    zeigeDrehung();
    knoepfe.appendChild(drehKnopf);
    var hinweis = document.createElement('span');
    hinweis.className = 'np-hinweis';
    hinweis.textContent = 'Züge anklicken oder mit den Pfeiltasten nachspielen';
    knoepfe.appendChild(hinweis);

    function zeigeKnopf() {
      var t = uhr ? 'Abspielen anhalten' : 'Partie abspielen';
      abspielKnopf.textContent = uhr ? '⏸︎' : '⏩︎';
      abspielKnopf.title = t; abspielKnopf.setAttribute('aria-label', t);
      abspielKnopf.classList.toggle('np-laeuft', !!uhr);
    }
    function schritt() {
      var naechster = aktuell ? aktuell.weiter : hauptKnoten[0];
      if (!naechster) { stoppe(); return; }
      automatisch = true; gehe(naechster); automatisch = false;
      if (!aktuell.weiter) stoppe();
    }
    function starte() {
      if (laufend && laufend !== stoppe) laufend();
      if (aktuell && !aktuell.weiter) { automatisch = true; gehe(null); automatisch = false; }
      uhr = setInterval(schritt, tempo);
      laufend = stoppe;
      zeigeKnopf();
      schritt();
    }
    function stoppe() {
      if (!uhr) return;
      clearInterval(uhr); uhr = null;
      if (laufend === stoppe) laufend = null;
      zeigeKnopf();
    }
    haupt.parentNode.parentNode.insertBefore(knoepfe, haupt.parentNode);
    buchansicht();

    // Wie im Buch: Hauptlinie (fett) nach dem Zug teilen, von dem eine Variante abzweigt, und die Variante darunter
    // einrücken; der nächste Absatz der Hauptlinie beginnt bei einem schwarzen Zug mit „27...“. Varianten ohne
    // erkennbaren Abzweig bleiben am Ende.
    function buchansicht() {
      var hauptP = haupt.parentNode, liste = loesung.querySelector('ul.varianten');
      var beiPly = {}, rest = [], gefunden = false;
      varianten.forEach(function (v) {
        if (v.abzweig !== undefined && hauptPlys[v.abzweig]) { (beiPly[v.abzweig] = beiPly[v.abzweig] || []).push(v.el); gefunden = true; }
        else rest.push(v.el);
      });
      if (Object.keys(kommBeiPly).length) gefunden = true;
      if (!gefunden) return;
      var aus = document.createDocumentFragment(), strong = null, neuerAbsatz = true;
      function kommentare(ps) {
        var div = document.createElement('div');
        div.className = 'np-kommentar-block';
        ps.forEach(function (p) { p.className = 'np-kommentar' + (p.className ? ' ' + p.className : ''); div.appendChild(p); });
        aus.appendChild(div);
      }
      function block(lis) {
        var div = document.createElement('div');
        div.className = 'varianten np-varianten';
        lis.forEach(function (li) {
          var p = document.createElement('p');
          while (li.firstChild) p.appendChild(li.firstChild);
          div.appendChild(p);
        });
        aus.appendChild(div);
      }
      Array.prototype.slice.call(haupt.childNodes).forEach(function (n) {
        if (neuerAbsatz) {
          if (n.nodeType === 3 && !n.textContent.trim()) return;
          var p = document.createElement('p');
          p.className = 'hauptlinie';
          strong = document.createElement('strong');
          p.appendChild(strong);
          aus.appendChild(p);
          var k = n.knoten;
          if (k && !k.nummeriert && schwarzBeiPly(k.ply)) strong.appendChild(document.createTextNode(nummerBeiPly(k.ply) + '...'));
          neuerAbsatz = false;
        }
        strong.appendChild(n);
        // Nach dem Zug – oder, wenn er eine Bewertung hat, erst nach der Bewertung – Kommentare, dann Varianten
        var k2 = n.zuKnoten || (n.knoten && !n.knoten.evEl ? n.knoten : null);
        if (k2 && (kommBeiPly[k2.ply] || beiPly[k2.ply])) {
          if (kommBeiPly[k2.ply]) kommentare(kommBeiPly[k2.ply]);
          if (beiPly[k2.ply]) block(beiPly[k2.ply]);
          neuerAbsatz = true;
        }
      });
      if (rest.length) block(rest);
      hauptP.parentNode.replaceChild(aus, hauptP);
      if (liste) liste.remove();
      var kommEl = loesung.querySelector('.np-kommentare');
      if (kommEl) kommEl.remove();
    }

    loesung.addEventListener('keydown', function (e) {
      if (e.target.closest('summary')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); knoepfe.children[2].click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); knoepfe.children[1].click(); }
    });
    loesung.addEventListener('toggle', function () { if (!loesung.open) gehe(null); });
  }

  document.querySelectorAll('.schachaufgaben li.nachspielbar').forEach(einrichten);
})();
