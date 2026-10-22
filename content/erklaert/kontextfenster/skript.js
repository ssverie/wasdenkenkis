(function(){
  const $ = id => document.getElementById(id);
  const de = n => Math.round(n).toLocaleString("de-DE");
  const short = n => n >= 1e6 ? (n/1e6).toLocaleString("de-DE") + " Mio." : n >= 1000 ? de(n/1000) + " k" : de(n);

  /* ---------- Fenster füllen ---------- */
  const SIZES = [8000, 128000, 200000, 1000000];
  const KINDS = {
    sys:  {n: 3000,   cls: "k-sys",  name: "System"},
    msg:  {n: 400,    cls: "k-msg",  name: "Nachricht"},
    doc:  {n: 14000,  cls: "k-doc",  name: "PDF"},
    code: {n: 50000,  cls: "k-code", name: "Code"},
    book: {n: 140000, cls: "k-book", name: "Buch"}
  };
  const OUT = 8000;
  let size = 200000, items, gone, note = '';
  function reset(){ items = [{k:"sys"}]; gone = []; draw(); }
  SIZES.forEach(s => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = short(s);
    b.addEventListener("click", () => { size = s; fit(); draw(); });
    b.dataset.s = s; $("winSel").appendChild(b);
  });
  function used(){ return items.reduce((a,it) => a + KINDS[it.k].n, 0); }
  function fit(){
    // Systemprompt bleibt immer; Ältestes danach fällt heraus, bis alles inkl. Antwortreserve passt
    while (used() + OUT > size && items.length > 1){ gone.push(items.splice(1,1)[0]); }
  }
  function draw(){
    document.querySelectorAll("#winSel button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.s === size)));
    const u = used();
    let html = items.map(it => {
      const K = KINDS[it.k], w = Math.min(K.n, size) / size * 100;
      return '<span class="' + K.cls + '" style="width:' + w + '%" title="' + K.name + ': ' + de(K.n) + ' Tokens">' + (w > 9 ? K.name : '') + '</span>';
    }).join("");
    const outW = OUT / size * 100;
    html += '<span style="flex:1"></span><span class="k-out" style="width:' + outW + '%;flex:none">' + (outW > 9 ? 'Antwort' : '') + '</span>';
    $("ctxBar").innerHTML = html;
    $("ctxUsed").textContent = de(Math.min(u, size)); $("ctxMax").textContent = de(size);
    $("ctxPct").textContent = Math.round(Math.min(u + OUT, size) / size * 100) + " % inkl. Antwortreserve";
    $("ctxGone").innerHTML = (gone.length ? 'Herausgefallen: ' + gone.map(g => '<s>' + KINDS[g.k].name + '</s>').join(", ") : '') +
      (note ? (gone.length ? ' · ' : '') + note : '');
    note = '';
  }
  document.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.add;
    if (KINDS[k].n + KINDS.sys.n + OUT > size){ note = KINDS[k].name + ' passt gar nicht hinein – es ist größer als das ganze Fenster.'; draw(); return; }
    items.push({k}); fit(); draw();
  }));
  $("ctxReset").addEventListener("click", reset);
  reset();

  /* ---------- Kostenkurve ---------- */
  (function(){
    const svg = $("costSvg"), NS = "http://www.w3.org/2000/svg", R = 10, PER = 500;
    const vals = Array.from({length:R}, (_,i) => PER * (2*i + 1));   // Runde n: (n-1) Fragen+Antworten + neue Frage
    const max = 10000, x0 = 56, y0 = 210, h = 180, bw = 34, gap = (520 - x0 - 20 - R*bw) / (R-1);
    let s = '';
    [0, 2500, 5000, 7500, 10000].forEach(v => {
      const y = y0 - v/max*h;
      s += `<line x1="${x0}" y1="${y}" x2="510" y2="${y}" style="stroke:var(--line)" stroke-width="1"/>`;
      s += `<text x="${x0-8}" y="${y+4}" text-anchor="end" class="svg-muted" font-size="11">${v.toLocaleString("de-DE")}</text>`;
    });
    vals.forEach((v,i) => {
      const x = x0 + i*(bw+gap), bh = v/max*h;
      const newPart = PER/max*h;
      s += `<rect x="${x}" y="${y0-bh}" width="${bw}" height="${bh-newPart}" rx="3" style="fill:var(--accent)" opacity=".35"/>`;
      s += `<rect x="${x}" y="${y0-newPart}" width="${bw}" height="${newPart}" rx="3" style="fill:var(--accent)"/>`;
      s += `<text x="${x+bw/2}" y="${y0+16}" text-anchor="middle" class="svg-muted" font-size="11">${i+1}</text>`;
    });
    s += `<text x="${(x0+510)/2}" y="244" text-anchor="middle" class="svg-muted" font-size="12">Runde</text>`;
    s += `<rect x="${x0+6}" y="10" width="11" height="11" rx="2" style="fill:var(--accent)"/><text x="${x0+22}" y="20" class="svg-text" font-size="12">neue Frage</text>`;
    s += `<rect x="${x0+110}" y="10" width="11" height="11" rx="2" style="fill:var(--accent)" opacity=".35"/><text x="${x0+126}" y="20" class="svg-text" font-size="12">bisheriger Verlauf, erneut mitgeschickt</text>`;
    svg.innerHTML += s;
    $("costSum").textContent = de(vals.reduce((a,b)=>a+b,0));
  })();

  /* ---------- Dreieck ---------- */
  function tri(){
    const n = +$("triN").value;
    const t = $("tri"); t.style.gridTemplateColumns = `repeat(${n},1fr)`;
    let h = ''; for (let r=0;r<n;r++) for (let c=0;c<n;c++) h += '<span' + (c <= r ? ' class="on"' : '') + '></span>';
    t.innerHTML = h;
    const cmp = n*(n+1)/2;
    $("triNv").textContent = n; $("triNum").textContent = de(cmp) + " Vergleiche";
    const big = 200000, bigCmp = big*(big+1)/2;
    $("triTxt").innerHTML = `bei ${n} Tokens. Bei 200 000 Tokens wären es rund ${(bigCmp/1e9).toLocaleString("de-DE",{maximumFractionDigits:0})} Milliarden – pro Schicht und Aufmerksamkeitskopf.`;
  }
  $("triN").addEventListener("input", tri); tri();

  /* ---------- Lost in the middle (schematisch) ---------- */
  const L = $("lost"), N = 20; let lh = '';
  for (let i=0;i<N;i++){ const p = i/(N-1); const v = 55 + 40*Math.pow(2*p-1, 2) + (i===N-1 ? 3 : 0); lh += `<span style="height:${v}%"></span>`; }
  L.innerHTML = lh;
})();
