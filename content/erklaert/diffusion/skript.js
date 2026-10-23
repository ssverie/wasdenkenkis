(function(){
  const $ = id => document.getElementById(id);
  const N = 120, T = 40;
  const P = [["Leuchtturm am Meer bei Sonnenuntergang","sea"],["Haus vor Bergen am Mittag","alp"],["Rote Blume vor grünem Hintergrund","flower"]];
  let pi = 0, seed = 42, timer = null;
  const off = document.createElement("canvas"); off.width = off.height = N; const oc = off.getContext("2d");
  function rng(s){ return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function target(kind, sd){
    const r = rng(sd + 99), j = () => (r() - .5);
    const c = oc;
    if (kind === "sea"){
      const g = c.createLinearGradient(0,0,0,N*.6); g.addColorStop(0,"#2b2c6b"); g.addColorStop(.6,"#e2725b"); g.addColorStop(1,"#f6c26b");
      c.fillStyle = g; c.fillRect(0,0,N,N);
      c.fillStyle = "#ffdf8a"; c.beginPath(); c.arc(N*(.62 + j()*.3), N*(.52 + j()*.08), N*.09, 0, 7); c.fill();
      c.fillStyle = "#1f4e79"; c.fillRect(0, N*.6, N, N*.4);
      c.fillStyle = "#2f2f3a"; c.beginPath(); c.moveTo(0,N*.62); c.lineTo(N*.35,N*.6); c.lineTo(N*.42,N*.72); c.lineTo(0,N*.78); c.fill();
      const lx = N*(.18 + j()*.06);
      c.fillStyle = "#f2f2f2"; c.fillRect(lx, N*.3, N*.07, N*.32);
      c.fillStyle = "#c0392b"; c.fillRect(lx, N*.38, N*.07, N*.04); c.fillRect(lx, N*.5, N*.07, N*.04);
      c.fillStyle = "#ffe9a8"; c.fillRect(lx - N*.01, N*.25, N*.09, N*.05);
    } else if (kind === "alp"){
      c.fillStyle = "#8fd0ff"; c.fillRect(0,0,N,N);
      c.fillStyle = "#fff6a8"; c.beginPath(); c.arc(N*(.8 + j()*.2), N*(.16 + j()*.06), N*.08, 0, 7); c.fill();
      const px = N*(.3+j()*.1);
      c.fillStyle = "#7c8ea6"; c.beginPath(); c.moveTo(0,N*.65); c.lineTo(px,N*.22); c.lineTo(N*.6,N*.65); c.fill();
      c.fillStyle = "#f4f7fb"; c.beginPath(); c.moveTo(px - N*.07, N*.33); c.lineTo(px, N*.22); c.lineTo(px + N*.07, N*.33); c.fill();
      c.fillStyle = "#62748c"; c.beginPath(); c.moveTo(N*.35,N*.65); c.lineTo(N*.7,N*.3); c.lineTo(N*1.05,N*.65); c.fill();
      c.fillStyle = "#5fb35f"; c.fillRect(0,N*.62,N,N*.38);
      const hx = N*(.55 + j()*.15);
      c.fillStyle = "#e9d7b5"; c.fillRect(hx, N*.6, N*.22, N*.16);
      c.fillStyle = "#9b3b2a"; c.beginPath(); c.moveTo(hx - N*.03, N*.61); c.lineTo(hx + N*.11, N*.5); c.lineTo(hx + N*.25, N*.61); c.fill();
      c.fillStyle = "#4b3a2c"; c.fillRect(hx + N*.09, N*.67, N*.04, N*.09);
    } else {
      c.fillStyle = "#2f6b3a"; c.fillRect(0,0,N,N);
      c.fillStyle = "#3f8a4b"; for (let i=0;i<9;i++){ c.beginPath(); c.arc(r()*N, r()*N, N*(.08 + r()*.1), 0, 7); c.fill(); }
      const fx = N*(.5 + j()*.2), fy = N*(.38 + j()*.1);
      c.strokeStyle = "#1e5128"; c.lineWidth = N*.03; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx + j()*N*.1, N); c.stroke();
      c.fillStyle = "#2f8f3f"; c.beginPath(); c.ellipse(fx + N*.08, fy + N*.3, N*.08, N*.03, -.5, 0, 7); c.fill();
      c.fillStyle = "#d62839";
      for (let k=0;k<6;k++){ const a = k/6*Math.PI*2; c.beginPath(); c.arc(fx + Math.cos(a)*N*.07, fy + Math.sin(a)*N*.07, N*.065, 0, 7); c.fill(); }
      c.fillStyle = "#f5c518"; c.beginPath(); c.arc(fx, fy, N*.045, 0, 7); c.fill();
    }
    return c.getImageData(0,0,N,N).data;
  }
  function noise(sd){ const r = rng(sd), a = new Float32Array(N*N*3); for (let i=0;i<a.length;i++){ const u = r()||1e-9, v = r(); a[i] = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); } return a; }
  let tgt, nz;
  function prepare(){ tgt = target(P[pi][1], seed); nz = noise(seed); }
  function render(canvas, a){
    const c = canvas.getContext("2d"), img = c.createImageData(N,N);
    const s = Math.sqrt(1 - a);
    for (let p=0, q=0; p<N*N*4; p+=4, q+=3){
      for (let k=0;k<3;k++){ const v = (tgt[p+k]/255*2-1)*Math.sqrt(a) + nz[q+k]*s*.8; img.data[p+k] = Math.max(0, Math.min(255, (v+1)/2*255)); }
      img.data[p+3] = 255;
    }
    c.putImageData(img,0,0);
  }
  const alpha = st => Math.pow(st / T, 1.4);
  function draw(){
    const st = +$("st").value;
    [...$("ptabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===pi)));
    $("stO").textContent = st + " / " + T;
    render($("cv"), alpha(st));
    $("seedT").textContent = "Startrauschen Nr. " + seed;
  }
  P.forEach(([t],i) => { const b = document.createElement("button"); b.type="button"; b.textContent = "„" + t + "“"; b.addEventListener("click",()=>{ pi=i; prepare(); draw(); }); $("ptabs").appendChild(b); });
  $("st").addEventListener("input", draw);
  $("play").addEventListener("click", () => {
    clearInterval(timer); $("st").value = 0; draw();
    timer = setInterval(() => { const v = +$("st").value + 1; $("st").value = v; draw(); if (v >= T) clearInterval(timer); }, 90);
  });
  $("seed").addEventListener("click", () => { seed = 1 + Math.floor(Math.random()*9999); prepare(); draw(); });
  prepare(); draw();

  /* Streifen */
  const strip = $("strip"), steps = [1, .9, .6, .3, .08, 0];
  const savePi = pi; tgt = target("sea", 7); nz = noise(7);
  steps.forEach(a => { const c = document.createElement("canvas"); c.width = c.height = N; strip.appendChild(c); render(c, a); });
  pi = savePi; prepare();
})();
