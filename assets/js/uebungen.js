/* IT-Übungen (layouts/uebung.html): Antwort wählen, richtig/falsch, Erklärung, „Weiter“, „Nochmal“, Filter nach
   Schwierigkeit und Thema, Runde mit 5 zufälligen Aufgaben. Fortschritt nur im Browser – localStorage
   „wdk-uebungen:<blatt>“ = { geloest: [ids, die je richtig beantwortet wurden], antworten: { id: gewählter Index } }.
   Ohne Skript bleiben die Antwortknöpfe gesperrt und die Lösung lässt sich über „Lösung anzeigen“ aufklappen. */
(function () {
  const blatt = document.querySelector('[data-uebung]');
  if (!blatt) return;
  const schluessel = 'wdk-uebungen:' + blatt.dataset.uebung;
  const RUNDE = 5;
  const leer = () => ({ geloest: [], antworten: {} });
  function lies() {
    try {
      const s = JSON.parse(localStorage.getItem(schluessel));
      if (s && Array.isArray(s.geloest) && s.antworten) return s;
    } catch (e) { /* kaputt oder gesperrt */ }
    return leer();
  }
  const schreib = () => { try { localStorage.setItem(schluessel, JSON.stringify(stand)); } catch (e) { /* privat/gesperrt: gilt nur bis zum Neuladen */ } };
  let stand = lies();
  let runde = null;                                  // { ids: [...] } während „5 zufällige Aufgaben“
  const aufgaben = [...blatt.querySelectorAll('.aufgabe')];
  const leiste = blatt.querySelector('.uebung-leiste');
  const fertig = blatt.querySelector('.uebung-fertig');
  const themaWahl = leiste.querySelector('.uebung-thema select');
  let stufe = '0';
  const $z = name => leiste.querySelector(`[data-zaehler="${name}"]`);
  const richtigIndex = li => +li.dataset.richtig;

  function zeige(li) {
    const id = li.dataset.id, gewaehlt = stand.antworten[id], beantwortet = gewaehlt !== undefined;
    li.querySelectorAll('.option').forEach(b => {
      const i = +b.dataset.i;
      b.disabled = beantwortet;
      b.classList.toggle('richtig', beantwortet && i === richtigIndex(li));
      b.classList.toggle('falsch', beantwortet && i === gewaehlt && i !== richtigIndex(li));
    });
    li.classList.toggle('beantwortet', beantwortet);
    li.classList.toggle('getroffen', beantwortet && gewaehlt === richtigIndex(li));
    li.querySelector('.loesung').open = beantwortet;
    li.querySelector('.aufgabe-aktionen').hidden = !beantwortet;
    li.querySelector('.geloest-marke').hidden = !stand.geloest.includes(id);
  }

  // sichtbar: in der Runde nur ihre Aufgaben (in Rundenreihenfolge), sonst nach Schwierigkeit und Thema
  const passt = li => (stufe === '0' || li.dataset.stufe === stufe) && (!themaWahl.value || li.dataset.themen.split('|').includes(themaWahl.value));
  function anwenden() {
    aufgaben.forEach(li => {
      const pos = runde ? runde.ids.indexOf(li.dataset.id) : -1;
      li.hidden = runde ? pos < 0 : !passt(li);
      li.style.order = runde && pos >= 0 ? pos : '';
    });
    leiste.querySelector('.uebung-runde').hidden = !runde;
    leiste.querySelector('.uebung-alle').hidden = !runde;
    zaehle();
  }
  const sichtbare = () => aufgaben.filter(li => !li.hidden).sort((a, b) => (+a.style.order || 0) - (+b.style.order || 0) || aufgaben.indexOf(a) - aufgaben.indexOf(b));

  function zaehle() {
    $z('geloest').textContent = stand.geloest.filter(id => aufgaben.some(li => li.dataset.id === id)).length;
    if (runde) {
      const b = runde.ids.filter(id => stand.antworten[id] !== undefined);
      const r = b.filter(id => stand.antworten[id] === richtigIndex(blatt.querySelector(`.aufgabe[data-id="${id}"]`)));
      $z('runde-richtig').textContent = r.length; $z('runde-beantwortet').textContent = b.length; $z('runde-anzahl').textContent = runde.ids.length;
      $z('runde-fertig').textContent = b.length === runde.ids.length ? ' – Runde fertig' : '';
    }
    const offen = sichtbare().filter(li => stand.antworten[li.dataset.id] === undefined).length;
    fertig.hidden = offen > 0 || !sichtbare().length;
    fertig.textContent = runde ? 'Runde fertig. Mit „5 zufällige Aufgaben“ geht es weiter, „Alle Aufgaben zeigen“ führt zurück.' : 'Alle angezeigten Aufgaben sind beantwortet.';
  }

  function springe(li) {
    li.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const erste = li.querySelector('.option:not(:disabled)');
    if (erste) erste.focus({ preventScroll: true });
  }
  // Weiter: nächste unbeantwortete sichtbare Aufgabe nach dieser, sonst die erste offene davor, sonst ans Ende
  function weiter(li) {
    const liste = sichtbare(), i = liste.indexOf(li);
    const offen = x => stand.antworten[x.dataset.id] === undefined;
    const ziel = liste.slice(i + 1).find(offen) || liste.slice(0, i).find(offen);
    if (ziel) springe(ziel); else { zaehle(); fertig.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  aufgaben.forEach(li => {
    const id = li.dataset.id;
    li.querySelectorAll('.option').forEach(b => {
      b.disabled = false;
      b.addEventListener('click', () => {
        if (stand.antworten[id] !== undefined) return;
        const i = +b.dataset.i;
        stand.antworten[id] = i;
        if (i === richtigIndex(li) && !stand.geloest.includes(id)) stand.geloest.push(id);
        schreib(); zeige(li); zaehle();
        li.querySelector('.weiter').focus({ preventScroll: true });
      });
    });
    li.querySelector('.nochmal').addEventListener('click', () => {
      delete stand.antworten[id]; schreib(); zeige(li); zaehle();
      const erste = li.querySelector('.option'); if (erste) erste.focus();
    });
    li.querySelector('.weiter').addEventListener('click', () => weiter(li));
    zeige(li);
  });

  leiste.querySelectorAll('[data-stufe]').forEach(b => b.addEventListener('click', () => {
    stufe = b.dataset.stufe; runde = null;
    leiste.querySelectorAll('[data-stufe]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    anwenden();
  }));
  themaWahl.addEventListener('change', () => { runde = null; anwenden(); });

  // Runde: 5 zufällige Aufgaben aus der aktuellen Auswahl, jeweils frisch zu beantworten (gelöst bleibt gelöst)
  leiste.querySelector('.uebung-zufall').addEventListener('click', () => {
    const pool = aufgaben.filter(passt);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    runde = { ids: pool.slice(0, RUNDE).map(li => li.dataset.id) };
    runde.ids.forEach(id => { delete stand.antworten[id]; });
    schreib();
    aufgaben.forEach(zeige); anwenden();
    if (runde.ids.length) springe(sichtbare()[0]);
  });
  leiste.querySelector('.uebung-alle').addEventListener('click', () => { runde = null; anwenden(); leiste.scrollIntoView({ behavior: 'smooth' }); });
  leiste.querySelector('.uebung-neu').addEventListener('click', () => {
    stand = leer(); runde = null; schreib();
    aufgaben.forEach(zeige); anwenden();
  });

  leiste.hidden = false;
  anwenden();

  // für automatische Tests
  window.__uebungen = { get stand() { return stand; }, get runde() { return runde; }, sichtbare: () => sichtbare().map(li => li.dataset.id) };
})();
