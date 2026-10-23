(function(){
  const $ = id => document.getElementById(id);
  const PS = [8, 16, 32, 64], RES = [224, 448, 896, 1344];
  const cv = $("cv"), ctx = cv.getContext("2d"), W = cv.width;
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  let hover = null;
  function scene(){
    const g = ctx.createLinearGradient(0,0,0,W*.62); g.addColorStop(0,"#8fc7ff"); g.addColorStop(1,"#dff0ff");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,W);
    ctx.fillStyle = "#ffd25a"; ctx.beginPath(); ctx.arc(W*.78, W*.2, W*.09, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#7aa6c9"; ctx.beginPath(); ctx.moveTo(0,W*.62); ctx.lineTo(W*.28,W*.3); ctx.lineTo(W*.52,W*.62); ctx.fill();
    ctx.fillStyle = "#5d8db3"; ctx.beginPath(); ctx.moveTo(W*.3,W*.62); ctx.lineTo(W*.62,W*.36); ctx.lineTo(W,W*.62); ctx.fill();
    ctx.fillStyle = "#6fbf73"; ctx.fillRect(0, W*.62, W, W*.38);
    ctx.fillStyle = "#c0533a"; ctx.fillRect(W*.14, W*.58, W*.2, W*.17);
    ctx.fillStyle = "#8e3524"; ctx.beginPath(); ctx.moveTo(W*.11,W*.59); ctx.lineTo(W*.24,W*.47); ctx.lineTo(W*.37,W*.59); ctx.fill();
    ctx.fillStyle = "#3b2a20"; ctx.fillRect(W*.22, W*.66, W*.05, W*.09);
    ctx.fillStyle = "#5a3d2b"; ctx.fillRect(W*.7, W*.6, W*.03, W*.14);
    ctx.fillStyle = "#3e8e48"; ctx.beginPath(); ctx.arc(W*.715, W*.56, W*.07, 0, Math.PI*2); ctx.fill();
  }
  function draw(){
    const ps = PS[+$("ps").value], res = RES[+$("res").value];
    const n = res / ps, cell = W / n, tokens = n * n;
    $("psO").textContent = ps + " px"; $("resO").textContent = res + " px";
    $("tok").textContent = tokens.toLocaleString("de-DE") + " Tokens";
    $("tokT").textContent = `${n} × ${n} Kacheln für ein Bild mit ${res} × ${res} Pixeln.`;
    scene();
    ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = n > 60 ? .4 : 1;
    for (let i=1;i<n;i++){ ctx.beginPath(); ctx.moveTo(i*cell,0); ctx.lineTo(i*cell,W); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*cell); ctx.lineTo(W,i*cell); ctx.stroke(); }
    if (hover){
      const cx = Math.min(n-1, Math.floor(hover[0]/cell)), cy = Math.min(n-1, Math.floor(hover[1]/cell));
      ctx.strokeStyle = css("--accent-2") || "#b4540a"; ctx.lineWidth = 3; ctx.strokeRect(cx*cell, cy*cell, cell, cell);
      const id = cy*n + cx + 1;
      const d = ctx.getImageData(Math.floor(cx*cell + cell/2), Math.floor(cy*cell + cell/2), 1, 1).data;
      const v = [d[0]/255, d[1]/255, d[2]/255].map(x => (x*2-1).toFixed(2).replace(".",","));
      $("pinfo").innerHTML = `<strong>Kachel ${id.toLocaleString("de-DE")} von ${tokens.toLocaleString("de-DE")}</strong><br>wird zum Vektor <code>[${v.join("; ")}; …]</code><br><span style="color:var(--muted)">In echt mit Hunderten bis Tausenden Zahlen pro Kachel.</span>`;
    }
  }
  function pos(e){ const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left)/r.width*W, (t.clientY - r.top)/r.height*W]; }
  cv.addEventListener("mousemove", e => { hover = pos(e); draw(); });
  cv.addEventListener("touchstart", e => { hover = pos(e); draw(); }, {passive:true});
  cv.addEventListener("mouseleave", () => { hover = null; draw(); });
  $("ps").addEventListener("input", draw); $("res").addEventListener("input", draw);
  draw();
})();
