(function(){
  const $ = id => document.getElementById(id);
  const R = [
    {k:"ki", name:"Künstliche Intelligenz", yr:"seit 1956", txt:"Der Oberbegriff: Computer lösen Aufgaben, für die man Intelligenz zu brauchen scheint – Planen, Erkennen, Entscheiden, Sprache.", ex:"Beispiele: Schachcomputer, Routenplanung, Regel-Engines, und alles in den inneren Kreisen.", cx:210, cy:165, rx:200, ry:155, c:"var(--line)", f:"var(--card)", ly:28},
    {k:"ml", name:"Maschinelles Lernen", yr:"ab den 1980ern verbreitet", txt:"Der Teil der KI, bei dem das Verhalten aus Daten gelernt wird statt von Menschen programmiert.", ex:"Beispiele: Spamfilter, Empfehlungen im Online-Shop, Betrugserkennung, Kreditbewertung.", cx:220, cy:182, rx:165, ry:125, c:"var(--accent-2)", f:"var(--accent-2-soft)", ly:76},
    {k:"dl", name:"Deep Learning", yr:"Durchbruch 2012", txt:"Maschinelles Lernen mit tiefen neuronalen Netzen – vielen Schichten, die selbst lernen, welche Merkmale wichtig sind.", ex:"Beispiele: Gesichtserkennung, Spracherkennung, maschinelle Übersetzung.", cx:232, cy:200, rx:130, ry:96, c:"var(--accent)", f:"var(--accent-soft)", ly:124},
    {k:"gen", name:"Generative KI", yr:"breit bekannt seit 2022", txt:"Modelle, die neue Inhalte erzeugen statt nur einzuordnen: Text, Bilder, Musik, Video, Code.", ex:"Beispiele: Bildgeneratoren, Musikgeneratoren, Sprachmodelle.", cx:244, cy:218, rx:96, ry:66, c:"#8b5cf6", f:"rgba(139,92,246,.12)", ly:172},
    {k:"llm", name:"Sprachmodell (LLM)", yr:"Transformer seit 2017", txt:"Generative KI für Text. Ein großes neuronales Netz, das das nächste Wortstück vorhersagt. „LLM“ heißt Large Language Model.", ex:"Beispiele: Claude, GPT, Gemini, Llama. Mehr dazu im Hauptartikel.", cx:256, cy:234, rx:70, ry:36, c:"var(--ok)", f:"var(--ok-soft)", ly:240}
  ];
  let sel = 4;
  function draw(){
    $("nestSvg").innerHTML = R.map((r,i) => `<g class="ring" data-i="${i}" style="opacity:${i<=sel?1:.55}">
      <ellipse cx="${r.cx}" cy="${r.cy}" rx="${r.rx}" ry="${r.ry}" style="fill:${r.f};stroke:${r.c}" stroke-width="${i===sel?3.5:2}"/>
      <text x="${r.cx}" y="${i===4 ? r.cy+5 : r.cy - r.ry + 22}" text-anchor="middle" class="svg-text" font-size="${i===4?12.5:13}" font-weight="${i===sel?700:600}">${r.name}</text></g>`).join("");
    $("nestSvg").querySelectorAll(".ring").forEach(g => g.addEventListener("click", e => { e.stopPropagation(); sel = +g.dataset.i; draw(); }));
    const r = R[sel];
    $("nestInfo").innerHTML = `<div class="yr">${r.yr}</div><h3>${r.name}</h3><p>${r.txt}</p><p class="ex">${r.ex}</p>`;
  }
  draw();
})();
