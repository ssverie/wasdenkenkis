(function(){
  const $ = id => document.getElementById(id);
  const Q = [
    {tab:"Hauptstadt Frankreich", pre:"Die Hauptstadt von Frankreich ist ", post:".", truth:"Paris",
     c:[["Paris",.96],["Lyon",.015],["Marseille",.01],["Versailles",.008],["Nizza",.007]]},
    {tab:"Erscheinungsjahr Java", pre:"Java 1.0 erschien im Jahr ", post:".", truth:"1996",
     c:[["1996",.62],["1995",.27],["1997",.06],["1991",.03],["1998",.02]]},
    {tab:"Einwohner eines Dorfs", pre:"Kleinkleckersdorf hat ", post:" Einwohner.", truth:null,
     c:[["1 247",.19],["850",.18],["2 300",.17],["412",.16],["3 100",.15],["640",.15]]}
  ];
  let qi = 0;
  Q.forEach((q,i) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = q.tab;
    b.addEventListener("click", () => { qi = i; draw(); }); $("qtabs").appendChild(b);
  });
  function entropy(c){ const h = -c.reduce((a,[,p]) => a + p*Math.log2(p), 0); return h / Math.log2(c.length); }
  function draw(){
    const q = Q[qi];
    [...$("qtabs").children].forEach((b,i) => b.setAttribute("aria-pressed", String(i === qi)));
    $("hbars").innerHTML = q.c.map(([t,p]) =>
      '<div class="bar-row' + (t === q.truth ? ' truth' : '') + '"><span class="bar-label">' + t + '</span>' +
      '<span class="bar-track"><span class="bar-fill" style="width:' + (p*100).toFixed(1) + '%"></span></span>' +
      '<span class="bar-pct">' + (p*100).toLocaleString("de-DE",{maximumFractionDigits: p < .1 ? 1 : 0}) + ' %</span></div>').join("");
    const e = entropy(q.c);
    $("ent").style.width = Math.max(4, e*100) + "%";
    $("entTxt").textContent = e < .3 ? "gering" : e < .75 ? "mittel" : "hoch";
    $("ans").innerHTML = q.pre + '<span class="tok">…</span>' + q.post;
    $("verdict").textContent = ""; $("verdict").className = "verdict";
  }
  function pick(q){
    let r = Math.random();
    for (const [t,p] of q.c){ r -= p; if (r <= 0) return t; }
    return q.c[q.c.length-1][0];
  }
  $("ask").addEventListener("click", () => {
    const q = Q[qi], t = pick(q);
    $("ans").innerHTML = q.pre + '<span class="tok">' + t + '</span>' + q.post;
    const v = $("verdict");
    if (q.truth === null){ v.textContent = "Klingt sicher – ist aber geraten. Den Ort gibt es nicht."; v.className = "verdict bad"; }
    else if (t === q.truth){ v.textContent = "Richtig."; v.className = "verdict ok"; }
    else { v.textContent = "Falsch – richtig wäre " + q.truth + ". Klingt aber genauso überzeugend."; v.className = "verdict bad"; }
  });
  $("ask10").addEventListener("click", () => {
    const q = Q[qi], res = Array.from({length:10}, () => pick(q));
    const ok = q.truth === null ? 0 : res.filter(t => t === q.truth).length;
    $("ans").innerHTML = res.map(t => '<span class="tok">' + t + '</span>').join(" · ");
    const v = $("verdict");
    if (q.truth === null){ v.textContent = "10 selbstsichere Antworten, " + new Set(res).size + " verschiedene Werte – alle erfunden."; v.className = "verdict bad"; }
    else { v.textContent = ok + " von 10 richtig."; v.className = "verdict " + (ok >= 8 ? "ok" : "bad"); }
  });
  draw();
})();
