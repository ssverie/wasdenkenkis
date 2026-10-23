(function(){
  const $ = id => document.getElementById(id);
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  /* ---------- Schichten-Diagramm ---------- */
  (function(){
    const L = [3,5,5,2], X = [60,210,360,510], H = 230, names = ["Eingabe","verborgen","verborgen","Ausgabe"];
    const ys = n => Array.from({length:n}, (_,i) => (H-30)/(n+1)*(i+1));
    let s = '<g style="stroke:var(--line)" stroke-width="1.2">';
    for (let l=0;l<L.length-1;l++) for (const a of ys(L[l])) for (const b of ys(L[l+1])) s += `<line x1="${X[l]}" y1="${a}" x2="${X[l+1]}" y2="${b}"/>`;
    s += '</g>';
    L.forEach((n,l) => { ys(n).forEach(y => s += `<circle cx="${X[l]}" cy="${y}" r="13" style="fill:${l===0?'var(--accent-soft)':l===L.length-1?'var(--ok-soft)':'var(--card)'};stroke:${l===0?'var(--accent)':l===L.length-1?'var(--ok)':'var(--fg)'}" stroke-width="1.6"/>`);
      s += `<text x="${X[l]}" y="${H-6}" text-anchor="middle" class="svg-muted" font-size="12">${names[l]}</text>`; });
    $("layerSvg").innerHTML += s;
  })();

  /* ---------- Mini-Netz ---------- */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  const DATA = {
    lin:  ["Getrennt", () => { const p=[]; for (let i=0;i<120;i++){ const c = i%2; p.push([ (c? .45:-.45) + gauss()*.22, (c? .3:-.3) + gauss()*.22, c]); } return p; }],
    circ: ["Kreis", () => { const p=[]; for (let i=0;i<160;i++){ const c = i%2, r = c ? rnd()*.42 : .62 + rnd()*.3, a = rnd()*2*Math.PI; p.push([r*Math.cos(a), r*Math.sin(a), c]); } return p; }],
    xor:  ["XOR", () => { const p=[]; for (let i=0;i<160;i++){ let x = rnd()*1.8-.9, y = rnd()*1.8-.9; if (Math.abs(x)<.08) x += x<0?-.1:.1; if (Math.abs(y)<.08) y += y<0?-.1:.1; p.push([x, y, (x*y>0)?1:0]); } return p; }]
  };
  const HID = [0,2,4,8];
  let dk = "circ", nh = 0, pts, W1, b1, W2, b2, epoch, running = false, raf = null;

  function init(){
    seed = 7 + nh*13 + dk.length;
    pts = DATA[dk][1]();
    seed = 1234 + Math.floor(Math.random()*1e6);
    const ni = nh || 0;
    W1 = Array.from({length:ni}, () => [gauss()*.8, gauss()*.8]); b1 = Array(ni).fill(0).map(()=>gauss()*.1);
    W2 = Array(ni ? ni : 2).fill(0).map(() => gauss()*.5); b2 = 0;
    epoch = 0; draw();
  }
  function fwd(x, y){
    if (!nh){ const z = W2[0]*x + W2[1]*y + b2; return {h:null, o:1/(1+Math.exp(-z))}; }
    const h = W1.map((w,i) => Math.tanh(w[0]*x + w[1]*y + b1[i]));
    let z = b2; for (let i=0;i<nh;i++) z += W2[i]*h[i];
    return {h, o:1/(1+Math.exp(-z))};
  }
  function trainEpoch(){
    const lr = nh ? .03 : .05;
    const order = pts.map((_,i)=>i).sort(() => Math.random()-.5);
    for (const i of order){
      const [x,y,t] = pts[i], {h,o} = fwd(x,y), d = o - t;
      if (!nh){ W2[0] -= lr*d*x; W2[1] -= lr*d*y; b2 -= lr*d; continue; }
      for (let j=0;j<nh;j++){
        const dh = d * W2[j] * (1 - h[j]*h[j]);
        W2[j] -= lr*d*h[j];
        W1[j][0] -= lr*dh*x; W1[j][1] -= lr*dh*y; b1[j] -= lr*dh;
      }
      b2 -= lr*d;
    }
    epoch++;
  }
  function metrics(){
    let L = 0, ok = 0;
    for (const [x,y,t] of pts){ const o = Math.min(1-1e-9, Math.max(1e-9, fwd(x,y).o)); L += -(t*Math.log(o) + (1-t)*Math.log(1-o)); if ((o>.5) === (t===1)) ok++; }
    return [L/pts.length, ok/pts.length];
  }
  function hexToRgb(h){ h = h.replace("#",""); if (h.length===3) h = h.split("").map(c=>c+c).join(""); const n = parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
  function draw(){
    const cv = $("cv"), ctx = cv.getContext("2d"), N = 50, S = cv.width / N;
    const cA = hexToRgb(css("--accent") || "#2f5bd3"), cB = hexToRgb(css("--accent-2") || "#b4540a"), bg = hexToRgb(css("--card") || "#ffffff");
    for (let i=0;i<N;i++) for (let j=0;j<N;j++){
      const x = (i+.5)/N*2-1, y = 1-(j+.5)/N*2, o = fwd(x,y).o, a = Math.abs(o-.5)*1.2, c = o > .5 ? cA : cB;
      ctx.fillStyle = `rgb(${c.map((v,k)=>Math.round(bg[k]+(v-bg[k])*a*.55)).join(",")})`;
      ctx.fillRect(i*S, j*S, S+1, S+1);
    }
    for (const [x,y,t] of pts){
      const px = (x+1)/2*cv.width, py = (1-y)/2*cv.height, c = t ? cA : cB;
      ctx.beginPath(); ctx.arc(px, py, 4.2, 0, 2*Math.PI);
      ctx.fillStyle = `rgb(${c.join(",")})`; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.stroke();
    }
    const [L, acc] = metrics();
    $("stE").textContent = epoch; $("stL").textContent = L.toLocaleString("de-DE",{maximumFractionDigits:3,minimumFractionDigits:3});
    $("stA").textContent = Math.round(acc*100) + " %";
    drawNet();
    const m = $("msg");
    if (epoch === 0){ m.className = "pg-msg"; m.textContent = "Noch untrainiert – Zufallsgewichte. Drück „Trainieren“."; }
    else if (acc >= .97){ m.className = "pg-msg ok"; m.textContent = "Gelernt: " + Math.round(acc*100) + " % der Punkte richtig."; }
    else if (!nh && dk !== "lin" && epoch > 30){ m.className = "pg-msg warn"; m.textContent = "Ohne verborgene Neuronen bleibt die Grenze eine gerade Linie – das reicht hier nie. Wähl 4 Neuronen."; }
    else if (epoch > 400){ m.className = "pg-msg warn"; m.textContent = "Kommt nicht weiter. Entweder reichen die Neuronen für diese Form nicht (beim Kreis braucht es mindestens 3), oder das Netz hängt in einer schlechten Lösung fest. Mehr Neuronen oder „Neu würfeln“ probieren."; }
    else { m.className = "pg-msg"; m.textContent = "Lernt …"; }
  }
  function drawNet(){
    const svg = $("netSvg"), W = 360, H = 150;
    const inY = [50,100], outY = [75], hidY = nh ? Array.from({length:nh}, (_,i) => (H-10)/(nh+1)*(i+1)+5) : [];
    const X = nh ? [40,180,320] : [40,320];
    const col = w => w >= 0 ? "var(--accent)" : "var(--accent-2)";
    const wd = w => Math.min(6, .6 + Math.abs(w)*1.3);
    let s = '';
    if (!nh){ inY.forEach((y,i) => s += `<line x1="${X[0]}" y1="${y}" x2="${X[1]}" y2="${outY[0]}" style="stroke:${col(W2[i])}" stroke-width="${wd(W2[i])}" opacity=".8"/>`); }
    else {
      hidY.forEach((hy,j) => { inY.forEach((y,i) => s += `<line x1="${X[0]}" y1="${y}" x2="${X[1]}" y2="${hy}" style="stroke:${col(W1[j][i])}" stroke-width="${wd(W1[j][i])}" opacity=".75"/>`);
        s += `<line x1="${X[1]}" y1="${hy}" x2="${X[2]}" y2="${outY[0]}" style="stroke:${col(W2[j])}" stroke-width="${wd(W2[j])}" opacity=".75"/>`; });
    }
    inY.forEach((y,i) => s += `<circle cx="${X[0]}" cy="${y}" r="11" style="fill:var(--card);stroke:var(--fg)" stroke-width="1.5"/><text x="${X[0]}" y="${y+4}" text-anchor="middle" class="svg-text" font-size="11">${i?'y':'x'}</text>`);
    hidY.forEach(y => s += `<circle cx="${X[1]}" cy="${y}" r="${nh>4?8:10}" style="fill:var(--card);stroke:var(--fg)" stroke-width="1.5"/>`);
    s += `<circle cx="${X[X.length-1]}" cy="${outY[0]}" r="11" style="fill:var(--ok-soft);stroke:var(--ok)" stroke-width="1.5"/>`;
    const np = nh ? nh*3 + nh + 1 : 3;
    s += `<text x="${W/2}" y="${H-2}" text-anchor="middle" class="svg-muted" font-size="11">${np} Parameter</text>`;
    svg.innerHTML = s;
  }
  function loop(){
    if (!running) return;
    trainEpoch();
    draw();
    const [L, acc] = metrics();
    if ((acc >= .99 && L < .12) || epoch >= 1500){ stop(); return; }
    raf = requestAnimationFrame(loop);
  }
  function stop(){ running = false; if (raf) cancelAnimationFrame(raf); $("bRun").textContent = "Trainieren"; }
  $("bRun").addEventListener("click", () => { if (running){ stop(); return; } running = true; $("bRun").textContent = "Anhalten"; loop(); });
  $("bStep").addEventListener("click", () => { stop(); trainEpoch(); draw(); });
  $("bReset").addEventListener("click", () => { stop(); init(); });
  function seg(id, items, get, set){
    const el = $(id); el.innerHTML = "";
    items.forEach(([v,label]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.dataset.v = v;
      b.addEventListener("click", () => { stop(); set(v); [...el.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.v == get()))); init(); }); el.appendChild(b); });
    [...el.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.v == get())));
  }
  seg("sData", Object.entries(DATA).map(([k,v]) => [k, v[0]]), () => dk, v => dk = v);
  seg("sHid", HID.map(h => [h, String(h)]), () => nh, v => nh = +v);
  init();
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw); } catch(e){}
})();
