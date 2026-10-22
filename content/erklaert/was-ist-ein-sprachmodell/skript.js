(function(){
  /* ---------- Nächstes Token ---------- */
  const BASE = "Der Kaffee ist heute";
  const DIST = {
    start:  [[" besonders",.36],[" sehr",.24],[" leider",.14],[" stark",.12],[" kalt",.09],[" lila",.05]],
    intens: [[" stark",.34],[" gut",.30],[" lecker",.20],[" bitter",.11],[" laut",.05]],
    leider: [[" kalt",.45],[" alle",.30],[" dünn",.25]],
    punct:  [[".",.70],["!",.22],["…",.08]]
  };
  const ENDS = [".","!","…"];
  function stateAfter(tok){
    if (tok == null) return "start";
    if (tok === " besonders" || tok === " sehr") return "intens";
    if (tok === " leider") return "leider";
    if (ENDS.includes(tok)) return "end";
    return "punct";
  }
  const $s = document.getElementById("nt-sentence"), $b = document.getElementById("nt-bars"),
        $t = document.getElementById("nt-temp"), $to = document.getElementById("nt-temp-out"),
        $samp = document.getElementById("nt-sample"), $gr = document.getElementById("nt-greedy"),
        $reset = document.getElementById("nt-reset");
  let added = [], picked = null;

  function temp(){ return parseFloat($t.value); }
  function state(){ return stateAfter(added.length ? added[added.length-1] : null); }
  function probs(){
    const d = DIST[state()], T = temp();
    const w = d.map(([,p]) => Math.pow(p, 1/T)), s = w.reduce((a,b)=>a+b,0);
    return d.map(([tok],i) => [tok, w[i]/s]);
  }
  function label(tok){ return tok.startsWith(" ") ? "␣" + tok.slice(1) : tok; }
  function esc(x){ return x.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }
  function fmt(p){ return (p*100).toLocaleString("de-DE",{maximumFractionDigits:p<.01?1:0}) + " %"; }

  function render(){
    const done = state() === "end";
    $s.innerHTML = esc(BASE) + added.map((t,i) => i === added.length-1 && picked !== null
        ? '<span class="new">'+esc(t)+'</span>' : esc(t)).join("") + (done ? "" : '<span class="cursor"></span>');
    if (done){
      $b.innerHTML = '<div class="end-note">Ende erreicht – die „Antwort“ ist fertig. Ein echtes Modell erzeugt dafür ein eigenes Ende-Token.</div>';
    } else {
      $b.innerHTML = probs().map(([tok,p]) =>
        '<div class="bar-row"><span class="bar-label">'+esc(label(tok))+'</span>'+
        '<span class="bar-track"><span class="bar-fill" style="width:'+(p*100).toFixed(1)+'%"></span></span>'+
        '<span class="bar-pct">'+fmt(p)+'</span></div>').join("");
    }
    $samp.disabled = $gr.disabled = done;
    const T = temp(), desc = T <= .4 ? "sehr vorhersehbar" : T <= .9 ? "eher vorhersehbar" : T <= 1.2 ? "ausgewogen" : T <= 1.6 ? "abwechslungsreich" : "wild";
    $to.textContent = T.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}) + " · " + desc;
  }
  function choose(greedy){
    const ps = probs(); let idx = 0;
    if (greedy){ ps.forEach((x,i)=>{ if (x[1] > ps[idx][1]) idx = i; }); }
    else { let r = Math.random(), acc = 0; for (let i=0;i<ps.length;i++){ acc += ps[i][1]; if (r <= acc){ idx = i; break; } idx = i; } }
    // kurz markieren, dann anhängen
    const rows = $b.querySelectorAll(".bar-row");
    if (rows[idx]) rows[idx].classList.add("picked");
    $samp.disabled = $gr.disabled = true;
    setTimeout(() => { added.push(ps[idx][0]); picked = idx; render(); }, 380);
  }
  $samp.addEventListener("click", () => choose(false));
  $gr.addEventListener("click", () => choose(true));
  $reset.addEventListener("click", () => { added = []; picked = null; render(); });
  $t.addEventListener("input", render);
  render();

  /* ---------- Parameter-Raster ---------- */
  const grid = document.getElementById("pgrid");
  let seed = 42; function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  const isDark = () => matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.getAttribute("data-theme") !== "light" || document.documentElement.getAttribute("data-theme") === "dark";
  const frag = document.createDocumentFragment(), vals = [];
  for (let i=0;i<480;i++){
    const v = ((rnd()+rnd()+rnd())/3 - .5) * 2; // grob glockenförmig in [-1,1]
    vals.push(v);
    const s = document.createElement("span");
    s.title = (v*0.05).toFixed(4).replace(".", ",");
    frag.appendChild(s);
  }
  grid.appendChild(frag);
  function paint(){
    const dark = isDark();
    grid.querySelectorAll("span").forEach((s,i) => {
      const v = vals[i], a = Math.min(1, Math.abs(v)*1.6);
      const hue = v < 0 ? 222 : 26;
      s.style.background = dark ? `hsla(${hue},80%,62%,${.12 + a*.85})` : `hsla(${hue},75%,50%,${.08 + a*.85})`;
    });
  }
  paint();
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint); } catch(e){}

  /* ---------- Aufmerksamkeit ---------- */
  const TOKS = ["Der","Kaffee",",","den","ich","gestern","gekauft","habe",",","ist"];
  const ATT = {
    9: [.04,.58,.02,.05,.05,.06,.12,.05,.03],
    7: [.03,.10,.02,.12,.48,.10,.15]
  };
  const tabs = document.getElementById("att-tabs"), row = document.getElementById("att-row");
  let focus = 9;
  [[9,"„ist“"],[7,"„habe“"]].forEach(([i,txt]) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = txt;
    b.addEventListener("click", () => { focus = i; drawAtt(); });
    b.dataset.i = i; tabs.appendChild(b);
  });
  function drawAtt(){
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.i === focus)));
    const w = ATT[focus], dark = isDark();
    row.innerHTML = TOKS.map((t,i) => {
      let cls = "att-tok", style = "", p = "";
      if (i === focus) cls += " focus";
      else if (i > focus) cls += " future";
      else { const a = w[i]; style = `background:hsla(${dark?220:224},${dark?85:80}%,${dark?62:55}%,${(.06 + a*1.4).toFixed(2)})`; p = Math.round(a*100) + " %"; }
      return `<div class="${cls}"><span class="w" style="${style}">${t}</span><span class="p">${p}</span></div>`;
    }).join("");
  }
  drawAtt();
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawAtt); } catch(e){}
})();
