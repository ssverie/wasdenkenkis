// Suche: lädt /suche/index.json (von Hugo erzeugt) und durchsucht ihn im Browser.
// Alle Wörter der Anfrage müssen vorkommen; Treffer im Titel zählen mehr als in der Beschreibung, die mehr als im Text.
// Groß/klein und Umlaute werden für den Vergleich vereinheitlicht (ä = a, ß = ss). Ausgabe nur per textContent.
(function () {
  const bereich = document.querySelector(".suche");
  if (!bereich) return;
  const feld = document.getElementById("suche-feld");
  const status = bereich.querySelector(".suche-status");
  const liste = bereich.querySelector(".suche-treffer");
  const MAX = 50;
  let index = null;

  // Vergleichsform: klein, ohne Akzente/Umlautpunkte, ß → ss
  function norm(s) {
    return s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  fetch(bereich.dataset.index)
    .then(r => r.json())
    .then(daten => {
      index = daten.map(e => ({ ...e, nt: norm(e.t), nd: norm(e.d + " " + e.m + " " + e.r + " " + (e.k || "")), nx: norm(e.x) }));
      const q = new URLSearchParams(location.search).get("q");
      if (q) feld.value = q;
      suche();
    })
    .catch(() => { status.textContent = "Der Suchindex konnte nicht geladen werden."; });

  function zaehle(text, wort) {
    let n = 0, i = text.indexOf(wort);
    while (i !== -1 && n < 20) { n++; i = text.indexOf(wort, i + wort.length); }
    return n;
  }

  // Ausschnitt um die erste Fundstelle im Text, Fundstellen markiert
  function ausschnitt(e, woerter) {
    let pos = -1;
    for (const w of woerter) { const p = e.nx.indexOf(w); if (p !== -1 && (pos === -1 || p < pos)) pos = p; }
    const p = document.createElement("p");
    if (pos === -1) { p.textContent = e.d; return p; }
    const start = Math.max(0, pos - 80), ende = Math.min(e.x.length, pos + 160);
    // Normalisierte und Originalfassung sind fast immer gleich lang; bei Abweichung nur grob markieren
    const roh = (start > 0 ? "… " : "") + e.x.slice(start, ende) + (ende < e.x.length ? " …" : "");
    const rohNorm = norm(roh);
    const marken = [];
    for (const w of woerter) {
      let i = rohNorm.indexOf(w);
      while (i !== -1) { marken.push([i, i + w.length]); i = rohNorm.indexOf(w, i + w.length); }
    }
    marken.sort((a, b) => a[0] - b[0]);
    let zuletzt = 0;
    for (const [a, b] of marken) {
      if (a < zuletzt) continue;
      p.append(roh.slice(zuletzt, a));
      const m = document.createElement("mark");
      m.textContent = roh.slice(a, b);
      p.append(m);
      zuletzt = b;
    }
    p.append(roh.slice(zuletzt));
    return p;
  }

  function suche() {
    if (!index) return;
    const anfrage = feld.value.trim();
    const woerter = norm(anfrage).split(/\s+/).filter(w => w.length > 1);
    liste.replaceChildren();
    if (!woerter.length) {
      status.textContent = index.length + " Seiten durchsuchbar. Mindestens zwei Buchstaben eingeben.";
      return;
    }
    const treffer = [];
    for (const e of index) {
      let punkte = 0, alle = true;
      for (const w of woerter) {
        const t = zaehle(e.nt, w), d = zaehle(e.nd, w), x = zaehle(e.nx, w);
        if (!t && !d && !x) { alle = false; break; }
        punkte += t * 20 + d * 5 + Math.min(x, 10);
      }
      if (alle) treffer.push([punkte, e]);
    }
    treffer.sort((a, b) => b[0] - a[0]);
    status.textContent = treffer.length === 0 ? "Keine Treffer für „" + anfrage + "“."
      : treffer.length + (treffer.length === 1 ? " Treffer" : " Treffer") + (treffer.length > MAX ? ", die ersten " + MAX + " werden gezeigt." : ".");
    for (const [, e] of treffer.slice(0, MAX)) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = e.u; a.className = "liste-titel"; a.textContent = e.t;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = [e.r, e.m].filter(Boolean).join(" · ");
      li.append(a, meta, ausschnitt(e, woerter));
      liste.append(li);
    }
  }

  let warte;
  feld.addEventListener("input", () => {
    clearTimeout(warte);
    warte = setTimeout(() => {
      suche();
      // Suchbegriff in der Adresse merken (Zurück-Taste, Link teilen), ohne neuen Verlaufseintrag
      const u = new URL(location.href);
      if (feld.value.trim()) u.searchParams.set("q", feld.value.trim()); else u.searchParams.delete("q");
      history.replaceState(null, "", u);
    }, 150);
  });
  bereich.querySelector(".suche-form").addEventListener("submit", e => { e.preventDefault(); suche(); });
})();
