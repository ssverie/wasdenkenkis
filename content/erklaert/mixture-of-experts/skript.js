(function(){
  const $ = id => document.getElementById(id);
  const TOK = ["„public“","„Katze“","„,“","„1999“","„weil“","„Brötchen“"];
  let ti = 0;
  TOK.forEach((t,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = t; b.addEventListener("click",()=>{ti=i;draw();}); $("toks").appendChild(b); });
  function scores(t, n){ let s = 31*(t+3); return Array.from({length:n}, (_,i) => { s = (s*16807 + i*7919) % 2147483647; return (s % 1000)/1000; }); }
  function draw(){
    const n = +$("nE").value, k = +$("nK").value;
    [...$("toks").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===ti)));
    $("nEo").textContent = n; $("nKo").textContent = k;
    const sc = scores(ti, n), sel = sc.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).slice(0,k).map(x=>x[1]);
    const ex = sel.map(i => Math.exp(sc[i]*4)), sum = ex.reduce((a,b)=>a+b,0);
    const W = 440, cols = n > 8 ? 2 : 1, perCol = Math.ceil(n/cols);
    const ex0 = cols === 2 ? 222 : 300, colW = cols === 2 ? 104 : 120, rowH = Math.min(30, 250/perCol);
    let s = `<defs><marker id="ma" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent-2)"/></marker></defs>`;
    s += `<rect x="10" y="130" width="70" height="36" rx="8" style="fill:var(--accent-2-soft);stroke:var(--accent-2)" stroke-width="2"/><text x="45" y="153" text-anchor="middle" class="svg-text" font-size="12" font-weight="700">${TOK[ti].replace(/[„“]/g,"")}</text>`;
    s += `<rect x="110" y="122" width="80" height="52" rx="10" style="fill:var(--card);stroke:var(--fg)" stroke-width="2"/><text x="150" y="152" text-anchor="middle" class="svg-text" font-size="13" font-weight="700">Router</text>`;
    s += `<line x1="80" y1="148" x2="108" y2="148" style="stroke:var(--accent-2)" stroke-width="2.5" marker-end="url(#ma)"/>`;
    for (let i=0;i<n;i++){
      const c = Math.floor(i/perCol), r = i % perCol, x = ex0 + c*(colW+10), y = 25 + r*rowH + (250 - perCol*rowH)/2;
      const on = sel.includes(i), w = on ? ex[sel.indexOf(i)]/sum : 0;
      if (on) s += `<path d="M190 148 C 220 148, ${x-30} ${y+rowH/2-4}, ${x-2} ${y+rowH/2-4}" fill="none" style="stroke:var(--accent-2)" stroke-width="${1.5+w*4}" marker-end="url(#ma)"/>`;
      s += `<rect x="${x}" y="${y}" width="${colW}" height="${rowH-8}" rx="6" style="fill:${on?'var(--accent-soft)':'var(--bg)'};stroke:${on?'var(--accent)':'var(--line)'}" stroke-width="${on?2:1}"/>`;
      s += `<text x="${x+10}" y="${y+rowH/2}" class="svg-text" font-size="11" ${on?'font-weight="700"':'opacity=".5"'}>Experte ${i+1}${on ? ' · ' + Math.round(w*100) + ' %' : ''}</text>`;
    }
    s += `<text x="150" y="200" text-anchor="middle" class="svg-muted" font-size="11">wählt ${k} von ${n}</text>`;
    $("moeSvg").innerHTML = s;
    const tot = 2 + 5*n, act = 2 + 5*k;
    $("sTot").textContent = tot + " Mrd."; $("sAct").textContent = act + " Mrd.";
    $("sRat").textContent = Math.round(act/tot*100) + " %";
  }
  $("nE").addEventListener("input", draw); $("nK").addEventListener("input", draw);
  draw();
})();
