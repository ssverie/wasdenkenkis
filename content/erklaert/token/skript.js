(function(){
  const CORPUS = [["machen",5],["lachen",4],["sachen",3],["macht",2],["lacht",2]];
  const COLORS = ["c0","c1","c2","c3","c4"];
  const $w = document.getElementById("bpe-words"), $p = document.getElementById("bpe-pairs"),
        $m = document.getElementById("bpe-merges"), $none = document.getElementById("bpe-none"),
        $tot = document.getElementById("bpe-total"), $voc = document.getElementById("bpe-vocab"),
        $step = document.getElementById("bpe-step"), $all = document.getElementById("bpe-all"),
        $reset = document.getElementById("bpe-reset");
  let words, merges, fresh;

  function init(){
    words = CORPUS.map(([w,c]) => ({syms: w.split(""), count: c}));
    merges = []; fresh = null; render();
  }
  function pairCounts(){
    const map = new Map();
    for (const w of words) for (let i=0;i<w.syms.length-1;i++){
      const k = w.syms[i] + "\u0001" + w.syms[i+1];
      map.set(k, (map.get(k)||0) + w.count);
    }
    return [...map.entries()].map(([k,n]) => [k.split("\u0001"), n]);
  }
  function best(pairs){
    let b = null;
    for (const p of pairs) if (!b || p[1] > b[1]) b = p;   // bei Gleichstand gewinnt das zuerst gefundene Paar
    return b && b[1] >= 2 ? b : null;
  }
  function step(){
    const b = best(pairCounts());
    if (!b) return false;
    const [a, c] = b[0], neu = a + c;
    for (const w of words){
      const out = [];
      for (let i=0;i<w.syms.length;i++){
        if (i < w.syms.length-1 && w.syms[i] === a && w.syms[i+1] === c){ out.push(neu); i++; }
        else out.push(w.syms[i]);
      }
      w.syms = out;
    }
    merges.push([a, c, b[1]]); fresh = neu;
    return true;
  }
  function render(){
    const vocab = new Set(CORPUS.flatMap(([w]) => w.split("")));
    const colorOf = s => COLORS[[...s].reduce((h,ch)=>h + ch.charCodeAt(0), s.length) % COLORS.length];
    $w.innerHTML = words.map(w =>
      '<div class="bpe-word"><span class="cnt">' + w.count + '×</span><span class="chips">' +
      w.syms.map(s => '<span class="chip ' + colorOf(s) + (s === fresh ? ' fresh' : '') + '">' + s + '</span>').join("") +
      '</span></div>').join("");
    const pairs = pairCounts().sort((x,y) => y[1]-x[1]);
    const b = best(pairCounts());
    if (!b){
      $p.innerHTML = '<div class="fine" style="margin:0">Kein Paar kommt mehr als einmal vor – fertig. Jedes Wort ist jetzt ein einziges Token.</div>';
    } else {
      const max = pairs[0][1];
      $p.innerHTML = pairs.slice(0,5).map(([pr,n]) =>
        '<div class="pair-row' + (pr[0]===b[0][0] && pr[1]===b[0][1] ? ' top' : '') + '"><span class="pl">' + pr[0] + ' + ' + pr[1] +
        '</span><span class="pt"><span class="pf" style="width:' + (n/max*100) + '%"></span></span><span class="pn">' + n + '</span></div>').join("");
    }
    $m.innerHTML = merges.map(([a,c,n]) => '<li>' + a + ' + ' + c + ' → <strong>' + a + c + '</strong> <span style="color:var(--muted)">(' + n + '×)</span></li>').join("");
    $none.style.display = merges.length ? "none" : "";
    $m.scrollTop = $m.scrollHeight;
    $tot.textContent = words.reduce((s,w) => s + w.syms.length * w.count, 0);
    $voc.textContent = vocab.size + merges.length;
    $step.disabled = $all.disabled = !b;
  }
  $step.addEventListener("click", () => { step(); render(); });
  $all.addEventListener("click", () => { while (step()); render(); });
  $reset.addEventListener("click", init);
  init();
})();
