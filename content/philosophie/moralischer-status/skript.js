(function(){
  const $ = id => document.getElementById(id);
  const R = [
    ["Familie und Stamm","früh","Über weite Strecken der Geschichte galt Rücksicht vor allem der eigenen Gruppe. Fremde standen oft außerhalb."],
    ["Alle Menschen","schrittweise, bis heute umkämpft","Die Idee, dass jeder Mensch gleichen Status hat – unabhängig von Herkunft, Geschlecht, Stand –, setzte sich erst über Jahrhunderte durch. Sklaverei war lange erlaubt."],
    ["Tiere mit Empfinden","seit dem 18./19. Jahrhundert","Mit Bentham rückte das Leiden ins Zentrum. Heute schützen viele Gesetze Tiere vor unnötigem Leid. Welche Tiere empfinden – Säugetiere, Vögel, Fische, Oktopusse, Insekten? –, wird weiter erforscht."],
    ["KI-Systeme?","offen","Ob überhaupt und welche KI-Systeme dazugehören, ist offen. Unklar ist auch, ob dieselben Kriterien passen – oder ob KI eine ganz eigene Kategorie braucht."]
  ];
  const svg = $("ringSvg"), C = 150;
  let sel = 3;
  function draw(){
    const radii = [38,72,106,140];
    svg.innerHTML = radii.slice().reverse().map((r,k) => { const i = 3-k; return `<g class="r" data-i="${i}"><circle cx="${C}" cy="${C}" r="${r}" style="fill:${i===sel?'var(--accent-soft)':'var(--card)'};stroke:${i===sel?'var(--accent)':'var(--line)'}" stroke-width="${i===sel?3:1.5}" ${i===3?'stroke-dasharray="6 5"':''}/></g>`; }).join("")
      + radii.map((r,i) => `<text x="${C}" y="${C - r + (i===0?42:20)}" text-anchor="middle" class="svg-text" font-size="${i===0?11:11.5}" font-weight="${i===sel?700:500}" style="pointer-events:none">${R[i][0]}</text>`).join("");
    svg.querySelectorAll(".r").forEach(g => g.addEventListener("click", e => { sel = +g.dataset.i; draw(); }));
    $("ringInfo").innerHTML = `<div class="k">${R[sel][1]}</div><h3>${R[sel][0]}</h3><p>${R[sel][2]}</p>`;
  }
  draw();
})();
