(function(){
  const de = (v, d=1) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});

  /* ---------- Neuron ---------- */
  const x = [1, 3, 0];
  const $ = id => document.getElementById(id);
  document.querySelectorAll(".toggle").forEach(t => {
    const i = +t.dataset.x;
    t.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { x[i] = +btn.dataset.v; neuron(); }));
  });
  $("x1").addEventListener("input", () => { x[1] = +$("x1").value; neuron(); });
  ["w0","w1","w2","b"].forEach(id => $(id).addEventListener("input", neuron));
  function neuron(){
    document.querySelectorAll(".toggle").forEach(t => {
      const i = +t.dataset.x;
      t.querySelectorAll("button").forEach(btn => btn.setAttribute("aria-pressed", String(+btn.dataset.v === x[i])));
    });
    const w = [+$("w0").value, +$("w1").value, +$("w2").value], b = +$("b").value;
    $("x0o").textContent = x[0]; $("x1o").textContent = x[1]; $("x2o").textContent = x[2];
    $("w0o").textContent = de(w[0]); $("w1o").textContent = de(w[1]); $("w2o").textContent = de(w[2]); $("bo").textContent = de(b);
    const z = w[0]*x[0] + w[1]*x[1] + w[2]*x[2] + b, p = 1/(1+Math.exp(-z));
    $("formula").innerHTML = 'σ( <span class="w">' + de(w[0]) + '</span>·' + x[0] + ' + <span class="w">' + de(w[1]) + '</span>·' + x[1] +
      ' + <span class="w">' + de(w[2]) + '</span>·' + x[2] + ' + <span class="w">' + de(b) + '</span> ) = σ(' + de(z,2) + ') = ' + de(p,2);
    $("meter").style.width = (p*100).toFixed(1) + "%";
    $("pct").textContent = Math.round(p*100) + " %";
  }
  neuron();

  /* ---------- Rechner ---------- */
  function fmtN(n){
    if (n >= 1e9) return de(n/1e9, n >= 1e11 ? 0 : 1) + " Mrd.";
    if (n >= 1e6) return de(n/1e6, 0) + " Mio.";
    return de(n, 0);
  }
  function fmtB(bytes){
    if (bytes >= 1e12) return de(bytes/1e12, 1) + " TB";
    if (bytes >= 1e9) return de(bytes/1e9, bytes >= 1e11 ? 0 : 1) + " GB";
    return de(bytes/1e6, 0) + " MB";
  }
  function calc(){
    const L = Math.max(1, +$("cL").value||1), D = Math.max(1, +$("cD").value||1), V = Math.max(1, +$("cV").value||1);
    const emb = V*D, att = 4*L*D*D, ff = 8*L*D*D, tot = emb + att + ff;
    $("cOut").textContent = "≈ " + fmtN(tot) + " Parameter";
    $("sE").style.width = (emb/tot*100) + "%"; $("sA").style.width = (att/tot*100) + "%"; $("sF").style.width = (ff/tot*100) + "%";
    $("lE").textContent = Math.round(emb/tot*100) + " %"; $("lA").textContent = Math.round(att/tot*100) + " %"; $("lF").textContent = Math.round(ff/tot*100) + " %";
    $("m32").textContent = fmtB(tot*4); $("m16").textContent = fmtB(tot*2); $("m8").textContent = fmtB(tot); $("m4").textContent = fmtB(tot/2);
  }
  ["cL","cD","cV"].forEach(id => $(id).addEventListener("input", calc));
  document.querySelectorAll(".presets button").forEach(btn => btn.addEventListener("click", () => {
    const [L,D,V] = btn.dataset.p.split(",");
    $("cL").value = L; $("cD").value = D; $("cV").value = V; calc();
  }));
  calc();
})();
