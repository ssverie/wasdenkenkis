(function(){
  const $ = id => document.getElementById(id);
  const de = (v,d=2) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  const CAND = [["Brötchen",4.2],["Müsli",3.6],["Rührei",3.1],["Toast",2.8],["Obst",2.3],["Joghurt",2.0],["Pfannkuchen",1.2],["Pizza",-0.3],["Beton",-2.5]];
  let samples = [];

  function probs(T, P){
    let p;
    if (T === 0){ p = CAND.map((_,i) => i === 0 ? 1 : 0); }
    else {
      const m = Math.max(...CAND.map(c=>c[1]));
      const e = CAND.map(c => Math.exp((c[1]-m)/T)), s = e.reduce((a,b)=>a+b,0);
      p = e.map(x => x/s);
    }
    // Top-p: Kandidaten sind nach Logit sortiert
    const keep = []; let acc = 0;
    for (let i=0;i<p.length;i++){ keep.push(acc < P - 1e-9); acc += p[i]; }
    const ks = p.reduce((a,x,i) => a + (keep[i] ? x : 0), 0);
    const pf = p.map((x,i) => keep[i] ? x/ks : 0);
    return {p, keep, pf};
  }
  function draw(){
    const T = +$("T").value, P = +$("P").value;
    $("To").textContent = de(T) + (T === 0 ? " greedy" : "");
    $("Po").textContent = P >= 1 ? "aus" : de(P);
    const {keep, pf} = probs(T, P);
    $("tbars").innerHTML = CAND.map((c,i) =>
      '<div class="bar-row' + (keep[i] ? '' : ' cut') + '"><span class="bar-label">' + c[0] + ' <span class="logit">' + de(c[1],1) + '</span></span>' +
      '<span class="bar-track"><span class="bar-fill" style="width:' + (pf[i]*100).toFixed(1) + '%"></span></span>' +
      '<span class="bar-pct">' + (pf[i] > 0 && pf[i] < 0.001 ? '&lt; 0,1 %' : (pf[i]*100).toLocaleString("de-DE",{maximumFractionDigits: pf[i] < .1 ? 1 : 0}) + ' %') + '</span></div>').join("");
  }
  function sample(n){
    const T = +$("T").value, P = +$("P").value, {pf} = probs(T, P);
    for (let k=0;k<n;k++){
      let r = Math.random(), idx = pf.length-1;
      for (let i=0;i<pf.length;i++){ r -= pf[i]; if (r <= 0 && pf[i] > 0){ idx = i; break; } }
      while (pf[idx] === 0 && idx > 0) idx--;
      samples.push(CAND[idx][0]);
    }
    $("gap").textContent = samples[samples.length-1];
    renderSamples();
  }
  function renderSamples(){
    $("samples").innerHTML = samples.slice(-40).map(s => '<span>' + s + '</span>').join("");
    if (!samples.length){ $("tally").innerHTML = ""; $("gap").textContent = "___"; return; }
    const cnt = {}; samples.forEach(s => cnt[s] = (cnt[s]||0) + 1);
    $("tally").innerHTML = 'Insgesamt ' + samples.length + ' gezogen: ' +
      Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([k,v]) => '<span><b>' + v + '×</b> ' + k + '</span>').join("");
  }
  $("T").addEventListener("input", draw); $("P").addEventListener("input", draw);
  $("s1").addEventListener("click", () => sample(1));
  $("s20").addEventListener("click", () => sample(20));
  $("sclr").addEventListener("click", () => { samples = []; renderSamples(); });
  draw();

  /* Mini-Kurven */
  const L = [3, 2.2, 1.6, 1.0, 0.4];
  [[0.3,"mc0"],[1,"mc1"],[2,"mc2"]].forEach(([T,id]) => {
    const e = L.map(z => Math.exp(z/T)), s = e.reduce((a,b)=>a+b,0);
    $(id).innerHTML = e.map(x => '<span style="height:' + Math.max(2, x/s*100) + '%"></span>').join("");
  });
})();
