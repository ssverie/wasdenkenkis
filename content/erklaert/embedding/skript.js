(function(){
  const $ = id => document.getElementById(id);
  const de = (v,d=2) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});

  /* ---------- Karte ---------- */
  const GROUPS = {tier:["Tiere","var(--accent-2)"], prog:["Programmiersprachen","var(--accent)"], essen:["Essen","var(--ok)"], pc:["Computer","#8b5cf6"], ort:["Inseln","#0e9aa7"]};
  const W = [
    ["Hund",58,74,"tier"],["Katze",104,50,"tier"],["Kater",122,76,"tier"],["Wolf",40,48,"tier"],["Pferd",62,98,"tier"],["Maus",150,88,"tier"],
    ["Python",318,58,"prog"],["Kotlin",350,82,"prog"],["Scala",372,60,"prog"],["C#",330,105,"prog"],["Java",338,172,"prog"],
    ["Brot",72,232,"essen"],["Käse",100,258,"essen"],["Nudeln",58,272,"essen"],["Kaffee",140,222,"essen"],
    ["Tastatur",205,128,"pc"],["Bildschirm",225,156,"pc"],["Drucker",188,165,"pc"],
    ["Bali",318,250,"ort"],["Sumatra",350,276,"ort"],["Borneo",376,248,"ort"]
  ];
  let sel = 0;
  function sim(a,b){ const d = Math.hypot(a[1]-b[1], a[2]-b[2]); return Math.max(0, 1 - d/380); }
  function drawMap(){
    let s = '';
    const me = W[sel];
    W.forEach((w,i) => { if (i!==sel){ const v = sim(me,w); if (v > .78) s += `<line x1="${me[1]}" y1="${me[2]}" x2="${w[1]}" y2="${w[2]}" style="stroke:var(--muted)" stroke-width="1" opacity="${(v-.7)*2.5}"/>`; }});
    W.forEach((w,i) => {
      s += `<g class="pt${i===sel?' sel':''}" data-i="${i}"><circle cx="${w[1]}" cy="${w[2]}" r="${i===sel?8:6}" style="fill:${GROUPS[w[3]][1]}"/><text x="${w[1]+10}" y="${w[2]+4}">${w[0]}</text></g>`;
    });
    $("map").innerHTML = s;
    $("map").querySelectorAll(".pt").forEach(g => g.addEventListener("click", () => { sel = +g.dataset.i; drawMap(); }));
    const nn = W.map((w,i) => [w, sim(me,w), i]).filter(x => x[2] !== sel).sort((a,b) => b[1]-a[1]).slice(0,5);
    $("nn").innerHTML = `<div class="h">Nächste Nachbarn von „${me[0]}“</div><ol>${nn.map(([w,v]) => `<li>${w[0]}<span class="sim">${de(v)}</span></li>`).join("")}</ol>`;
  }
  $("legend").innerHTML = Object.values(GROUPS).map(([n,c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("");
  drawMap();

  /* ---------- Arithmetik ---------- */
  const DIMS = ["königlich","weiblich","erwachsen","Familie"];
  const V = {
    "König":[1,0,1,0], "Königin":[1,1,1,0], "Prinz":[1,0,0,0], "Prinzessin":[1,1,0,0],
    "Mann":[0,0,1,0], "Frau":[0,1,1,0], "Junge":[0,0,0,0], "Mädchen":[0,1,0,0],
    "Onkel":[0,0,1,1], "Tante":[0,1,1,1], "Neffe":[0,0,0,1], "Nichte":[0,1,0,1]
  };
  // leichte Unschärfe, damit es nicht zu "perfekt" aussieht
  const J = {"König":[.92,.04,.95,.05],"Königin":[.9,.93,.93,.06],"Prinz":[.88,.06,.12,.04],"Prinzessin":[.87,.95,.1,.05],
    "Mann":[.03,.05,.9,.04],"Frau":[.04,.92,.91,.06],"Junge":[.02,.04,.08,.03],"Mädchen":[.03,.94,.07,.05],
    "Onkel":[.05,.06,.9,.91],"Tante":[.04,.93,.92,.9],"Neffe":[.03,.05,.1,.88],"Nichte":[.05,.92,.09,.9]};
  const names = Object.keys(V);
  ["eA","eB","eC"].forEach((id,k) => { $(id).innerHTML = names.map(n => `<option>${n}</option>`).join(""); $(id).value = ["König","Mann","Frau"][k]; $(id).addEventListener("change", drawEq); });
  const heatC = v => { const a = Math.max(-1, Math.min(1, v)); return a >= 0 ? `hsla(224,75%,55%,${.08 + a*.8})` : `hsla(26,80%,52%,${.08 - a*.8})`; };
  function cos(a,b){ let d=0,x=0,y=0; for (let i=0;i<a.length;i++){ d+=a[i]*b[i]; x+=a[i]*a[i]; y+=b[i]*b[i]; } return (x&&y) ? d/Math.sqrt(x*y) : 0; }
  function drawEq(){
    const A = $("eA").value, B = $("eB").value, C = $("eC").value;
    const r = J[A].map((v,i) => v - J[B][i] + J[C][i]);
    const cand = names.filter(n => n!==A && n!==B && n!==C).map(n => [n, cos(r, J[n]), Math.hypot(...r.map((v,i)=>v-J[n][i]))]).sort((a,b) => a[2]-b[2]);
    const best = cand[0][0];
    $("eR").textContent = best;
    const row = (label, v, cls) => `<tr class="${cls||''}"><td>${label}</td>${v.map(x => `<td class="n"><span class="cell" style="background:${heatC(x)}"></span> ${de(x)}</td>`).join("")}</tr>`;
    $("vtbl").innerHTML = `<thead><tr><th></th>${DIMS.map(d=>`<th>${d}</th>`).join("")}</tr></thead><tbody>` +
      row(A, J[A]) + row("− " + B, J[B].map(x=>-x)) + row("+ " + C, J[C]) + row("= Ergebnis", r, "res") + row("nächstes Wort: " + best, J[best], "hit") + '</tbody>';
    $("eRes").innerHTML = `${A} − ${B} + ${C} ≈ ${best}<small>Abstand ${de(cand[0][2])}, Kosinus-Ähnlichkeit ${de(cand[0][1])}. Zweitbester Treffer: ${cand[1][0]} (Abstand ${de(cand[1][2])}). Die drei Eingabewörter selbst werden – wie in der Forschung üblich – ausgeschlossen.</small>`;
  }
  drawEq();

  /* ---------- Kosinus ---------- */
  function drawCos(){
    const ang = +$("cosA").value, a0 = 20*Math.PI/180, a1 = (20+ang)*Math.PI/180, R = 85;
    const c = Math.cos(ang*Math.PI/180);
    const ax = Math.cos(a0)*R, ay = -Math.sin(a0)*R, bx = Math.cos(a1)*R*.8, by = -Math.sin(a1)*R*.8;
    const arcR = 30, large = ang > 180 ? 1 : 0;
    $("cosSvg").innerHTML = `
      <defs><marker id="ca" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)"/></marker>
      <marker id="cb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent-2)"/></marker></defs>
      <circle r="${R}" fill="none" style="stroke:var(--line)" stroke-dasharray="3 4"/>
      <path d="M${Math.cos(a0)*arcR} ${-Math.sin(a0)*arcR} A${arcR} ${arcR} 0 ${large} 0 ${Math.cos(a1)*arcR} ${-Math.sin(a1)*arcR}" fill="none" style="stroke:var(--muted)" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="${ax}" y2="${ay}" style="stroke:var(--accent)" stroke-width="3.5" marker-end="url(#ca)"/>
      <line x1="0" y1="0" x2="${bx}" y2="${by}" style="stroke:var(--accent-2)" stroke-width="3.5" marker-end="url(#cb)"/>
      <text x="${ax*1.12}" y="${ay*1.12+4}" text-anchor="middle" class="svg-text" font-size="12" font-weight="700">a</text>
      <text x="${bx*1.18}" y="${by*1.18+4}" text-anchor="middle" class="svg-text" font-size="12" font-weight="700">b</text>
      <text x="${Math.cos((a0+a1)/2)*48}" y="${-Math.sin((a0+a1)/2)*48+4}" text-anchor="middle" class="svg-muted" font-size="11">${ang}°</text>`;
    $("cosV").textContent = "cos = " + de(c);
    $("cosT").textContent = c > .9 ? "sehr ähnlich – fast dieselbe Richtung" : c > .5 ? "ähnlich" : c > .1 ? "wenig gemeinsam" : c > -.1 ? "unabhängig – senkrecht zueinander" : "gegenläufig";
  }
  $("cosA").addEventListener("input", drawCos); drawCos();
})();
