(function(){
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const T = [
    {t:"Schläger und Ball", task:"Schläger und Ball kosten zusammen 1,10 €. Der Schläger kostet 1 € mehr als der Ball. Was kostet der Ball?",
     direct:"Der Ball kostet 0,10 €.", ok:false,
     think:"Ball = x. Schläger = x + 1,00.\nZusammen: x + x + 1,00 = 1,10\n→ 2x = 0,10 → x = 0,05.\nProbe: 0,05 + 1,05 = 1,10 ✓\n<span class=\"fix\">Die naheliegende Antwort 0,10 wäre falsch: dann kostete der Schläger 1,10 und zusammen 1,20.</span>",
     final:"Der Ball kostet 0,05 €, der Schläger 1,05 €.", tok:[8,74]},
    {t:"Java: Integer ==", task:"Was gibt dieser Code aus?  <code>Integer a = 128, b = 128; System.out.println(a == b);</code>",
     direct:"true – beide Werte sind 128.", ok:false,
     think:"a und b sind Integer-Objekte, nicht int.\n== vergleicht bei Objekten Referenzen, nicht Werte.\nAutoboxing nutzt Integer.valueOf(…), das Werte von −128 bis 127 cached.\n128 liegt außerhalb → zwei verschiedene Objekte.\n<span class=\"fix\">Also nicht true.</span> Bei 127 wäre es true gewesen.",
     final:"false. 128 liegt außerhalb des Integer-Caches (−128 bis 127), daher sind a und b verschiedene Objekte. Für Wertvergleiche a.equals(b) benutzen.", tok:[9,96]},
    {t:"23 × 47", task:"Wie viel ist 23 × 47?",
     direct:"23 × 47 = 1 071", ok:false,
     think:"23 × 47 = 23 × 40 + 23 × 7\n23 × 40 = 920\n23 × 7 = 161\n920 + 161 = 1 081\nProbe: 47 × 23 = 47 × 20 + 47 × 3 = 940 + 141 = 1 081 ✓",
     final:"23 × 47 = 1 081", tok:[6,58]}
  ];
  let ti = 0, m = 0, timer = null;
  T.forEach((x,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = x.t; b.addEventListener("click",()=>{ti=i;draw();}); $("tTabs").appendChild(b); });
  [...$("mode").children].forEach(b => b.addEventListener("click", () => { m = +b.dataset.m; draw(); }));
  function draw(){
    clearInterval(timer);
    [...$("tTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===ti)));
    [...$("mode").children].forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.m===m)));
    const x = T[ti];
    $("task").innerHTML = x.task;
    if (!m){
      $("out").innerHTML = `<div class="ans bad"><span class="lbl">Antwort</span>${esc(x.direct)}</div>`;
      $("mrow").innerHTML = `<span>Tokens: <b>${x.tok[0]}</b></span><span>Ergebnis: <b style="color:var(--bad)">falsch</b></span>`;
      return;
    }
    $("out").innerHTML = `<div class="think"><span class="lbl">Denkt nach …</span><span id="tt"></span></div><div class="ans" id="fa"><span class="lbl">Antwort</span>…</div>`;
    $("mrow").innerHTML = `<span>Tokens: <b id="tk">0</b></span>`;
    // Text schrittweise einblenden (HTML-Spans bleiben intakt, weil zeilenweise)
    const lines = x.think.split("\n"); let li = 0;
    timer = setInterval(() => {
      li++;
      $("tt").innerHTML = lines.slice(0, li).join("\n");
      $("tk").textContent = Math.round(x.tok[1] * li / lines.length);
      if (li >= lines.length){
        clearInterval(timer);
        const fa = $("fa"); fa.className = "ans ok"; fa.innerHTML = `<span class="lbl">Antwort</span>${esc(x.final)}`;
        $("mrow").innerHTML = `<span>Tokens: <b>${x.tok[1]}</b> statt ${x.tok[0]}</span><span>Ergebnis: <b style="color:var(--ok)">richtig</b></span>`;
      }
    }, 550);
  }
  draw();

  /* ---------- Rechendurchgänge ---------- */
  (function(){
    const bar = (x, y, c) => `<rect x="${x}" y="${y}" width="9" height="40" rx="2" style="fill:${c}"/>`;
    let d = ''; for (let i=0;i<3;i++) d += bar(10 + i*12, 34, "var(--ok)");
    $("cDirect").innerHTML = d;
    let t = ''; for (let i=0;i<42;i++) t += bar(10 + i*12, 124, i < 38 ? "var(--accent)" : "var(--ok)");
    $("cThink").innerHTML = t;
  })();

  /* ---------- Denkbudget ---------- */
  function budget(){
    const v = +$("bud").value, toks = Math.round(v*v*3.2);  // 0 … 32 000
    const acc = p => 18 + 70*(1 - Math.exp(-p/28));
    $("budO").textContent = toks >= 1000 ? (toks/1000).toLocaleString("de-DE",{maximumFractionDigits:1}) + " k" : toks;
    const a = acc(v);
    $("bA").textContent = Math.round(a) + " %";
    const sec = 2 + toks/120;
    $("bT").textContent = sec < 60 ? Math.round(sec) + " s" : (sec/60).toLocaleString("de-DE",{maximumFractionDigits:1}) + " min";
    $("bC").textContent = (1 + toks/400).toLocaleString("de-DE",{maximumFractionDigits:0}) + "×";
    const W = 520, H = 170, x0 = 40, y0 = 145, w = W - x0 - 12, h = 125;
    let path = ''; for (let k=0;k<=100;k++){ path += (k?'L':'M') + (x0 + k/100*w).toFixed(1) + ' ' + (y0 - acc(k)/100*h).toFixed(1); }
    const mx = x0 + v/100*w, my = y0 - a/100*h;
    $("budSvg").innerHTML = `
      ${[0,50,100].map(p => `<line x1="${x0}" y1="${y0-p/100*h}" x2="${W-12}" y2="${y0-p/100*h}" style="stroke:var(--line)"/><text x="${x0-6}" y="${y0-p/100*h+4}" text-anchor="end" class="svg-muted" font-size="11">${p}%</text>`).join("")}
      <text x="${x0}" y="${y0+18}" class="svg-muted" font-size="11">wenig nachdenken</text>
      <text x="${W-12}" y="${y0+18}" text-anchor="end" class="svg-muted" font-size="11">viel nachdenken</text>
      <path d="${path}" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/>
      <line x1="${mx}" y1="${y0}" x2="${mx}" y2="${my}" style="stroke:var(--accent-2)" stroke-dasharray="3 3"/>
      <circle cx="${mx}" cy="${my}" r="5" style="fill:var(--accent-2)"/>`;
  }
  $("bud").addEventListener("input", budget); budget();
})();
