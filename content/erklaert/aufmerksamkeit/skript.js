(function(){
  const $ = id => document.getElementById(id);
  const de = (v,d=2) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  const isDark = () => (matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.getAttribute("data-theme") !== "light") || document.documentElement.getAttribute("data-theme") === "dark";
  const heat = a => `hsla(${isDark()?220:224},${isDark()?85:80}%,${isDark()?62:55}%,${(.05 + a*1.3).toFixed(2)})`;

  /* ---------- Bank ---------- */
  const BANK = [
    {tab:"… Geld auf die Bank", toks:["Ich","bringe","mein","Geld","auf","die","Bank"], w:[.04,.10,.06,.58,.05,.07,.10], dir:[.85,.55], col:"var(--accent-2)", note:"„Bank“ achtet vor allem auf „Geld“ – und rückt Richtung Finanzen."},
    {tab:"… im Park auf der Bank", toks:["Wir","sitzen","im","Park","auf","der","Bank"], w:[.04,.30,.04,.42,.05,.05,.10], dir:[-.8,.6], col:"var(--ok)", note:"Hier sind „Park“ und „sitzen“ die wichtigsten Hinweise – „Bank“ rückt Richtung Möbel und Natur."}
  ];
  let bi = 0;
  BANK.forEach((b,i) => { const el = document.createElement("button"); el.type="button"; el.textContent = b.tab; el.addEventListener("click",()=>{bi=i;drawBank();}); $("btabs").appendChild(el); });
  function drawBank(){
    const b = BANK[bi];
    [...$("btabs").children].forEach((x,i)=>x.setAttribute("aria-pressed",String(i===bi)));
    const last = b.toks.length-1;
    $("brow").innerHTML = b.toks.map((t,i) => i===last
      ? `<div class="att-tok focus"><span class="w">${t}</span><span class="p">${Math.round(b.w[i]*100)} %</span></div>`
      : `<div class="att-tok"><span class="w" style="background:${heat(b.w[i])}">${t}</span><span class="p">${Math.round(b.w[i]*100)} %</span></div>`).join("");
    $("bnote").textContent = b.note;
    const cx=120, cy=150, L=110;
    $("bsvg").innerHTML = `
      <defs><marker id="bm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker>
      <marker id="bm2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:${b.col}"/></marker></defs>
      <circle cx="${cx+L*.85}" cy="${cy-L*.55*1.1}" r="26" style="fill:var(--accent-2-soft)"/><text x="${cx+L*.85}" y="${cy-L*.55*1.1+4}" text-anchor="middle" class="svg-text" font-size="11">Geld</text>
      <circle cx="${cx-L*.8}" cy="${cy-L*.6*1.1}" r="26" style="fill:var(--ok-soft)"/><text x="${cx-L*.8}" y="${cy-L*.6*1.1+4}" text-anchor="middle" class="svg-text" font-size="11">Park</text>
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-85}" style="stroke:var(--muted)" stroke-width="2.5" stroke-dasharray="4 3" marker-end="url(#bm)"/>
      <text x="${cx+6}" y="${cy-90}" class="svg-muted" font-size="11">„Bank“ (Tabelle)</text>
      <line x1="${cx}" y1="${cy}" x2="${cx+b.dir[0]*80}" y2="${cy-b.dir[1]*95}" style="stroke:${b.col}" stroke-width="3.5" marker-end="url(#bm2)"/>
      <text x="${cx}" y="${cy+22}" text-anchor="middle" class="svg-text" font-size="11.5" font-weight="600">„Bank“ nach Aufmerksamkeit</text>`;
  }
  drawBank();

  /* ---------- Query/Key ---------- */
  const KEYS = [["Geld",[.9,.35],"var(--accent-2)"],["Park",[-.75,.55],"var(--ok)"],["die",[.05,-.85],"var(--muted)"]];
  const VALS = {Geld:"Finanzen", Park:"Natur/Möbel", die:"Grammatik"};
  function drawQ(){
    const a = +$("qang").value * Math.PI/180, q = [Math.cos(a), Math.sin(a)];
    const S = 2.5, sc = KEYS.map(([,k]) => (q[0]*k[0] + q[1]*k[1]) * S);
    const m = Math.max(...sc), e = sc.map(s=>Math.exp(s-m)), sum = e.reduce((x,y)=>x+y,0), w = e.map(x=>x/sum);
    const R = 95;
    let s = `<defs>${KEYS.map((k,i)=>`<marker id="km${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:${k[2]}"/></marker>`).join("")}
      <marker id="qm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--accent)"/></marker></defs>
      <circle cx="0" cy="0" r="${R}" fill="none" style="stroke:var(--line)" stroke-dasharray="3 4"/>
      <line x1="-${R+10}" y1="0" x2="${R+10}" y2="0" style="stroke:var(--line)"/><line x1="0" y1="-${R+10}" x2="0" y2="${R+10}" style="stroke:var(--line)"/>`;
    KEYS.forEach(([n,k,c],i) => {
      const x = k[0]*R, y = -k[1]*R;
      s += `<line x1="0" y1="0" x2="${x}" y2="${y}" style="stroke:${c}" stroke-width="${2+w[i]*6}" marker-end="url(#km${i})"/>`;
      s += `<text x="${x*1.12}" y="${y*1.12+4}" text-anchor="middle" class="svg-text" font-size="12" font-weight="600">${n}</text>`;
    });
    s += `<line x1="0" y1="0" x2="${q[0]*R*.85}" y2="${-q[1]*R*.85}" style="stroke:var(--accent)" stroke-width="4" marker-end="url(#qm)"/>`;
    s += `<text x="${q[0]*R*.55 + 8}" y="${-q[1]*R*.55 - 8}" class="svg-text" font-size="12" font-weight="700" style="fill:var(--accent)">Q</text>`;
    $("qsvg").innerHTML = s;
    $("qtb").innerHTML = KEYS.map(([n],i) => `<tr><td>${n}</td><td class="num">${de(sc[i])}</td><td><span class="wbar" style="width:${w[i]*90}px"></span>${Math.round(w[i]*100)} %</td></tr>`).join("");
    const best = w.indexOf(Math.max(...w));
    $("qout").innerHTML = `<strong>Ergebnis:</strong> ${KEYS.map(([n],i)=>`${Math.round(w[i]*100)} % ${VALS[n]}`).join(" + ")}<br><span style="color:var(--muted)">Die Mischung wird vor allem von „${KEYS[best][0]}“ bestimmt.</span>`;
  }
  $("qang").addEventListener("input", drawQ); drawQ();

  /* ---------- Köpfe ---------- */
  const SENT = ["Der","Hund","bellte,","weil","er","Hunger","hatte"];
  const FOCUS = 4;
  const HEADS = [
    ["Kopf A: Worauf bezieht sich „er“?", [.03,.82,.05,.03,.07]],
    ["Kopf B: Was steht direkt davor?", [.02,.04,.08,.78,.08]],
    ["Kopf C: Breiter Blick auf den Satz davor", [.05,.10,.20,.45,.20]]
  ];
  function drawHeads(){
    const W = 640, H = 74, gap = W / SENT.length;
    $("heads").innerHTML = HEADS.map(([title,w]) => {
      let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">`;
      SENT.forEach((t,i) => {
        const x = gap*(i+.5);
        if (i < FOCUS && w[i] > .06){
          const fx = gap*(FOCUS+.5), mid = (x+fx)/2, hgt = 10 + Math.abs(FOCUS-i)*6;
          s += `<path d="M${fx} 44 Q ${mid} ${44-hgt-14} ${x} 44" fill="none" style="stroke:var(--accent)" stroke-width="${1+w[i]*7}" opacity="${.35+w[i]*.65}"/>`;
        }
      });
      SENT.forEach((t,i) => {
        const x = gap*(i+.5), isF = i===FOCUS, fut = i>FOCUS;
        const bg = isF ? "" : (i<FOCUS ? heat(w[i]) : "transparent");
        s += `<rect x="${x-38}" y="46" width="76" height="24" rx="6" style="fill:${bg};${isF?'stroke:var(--accent-2);stroke-width:2;fill:none':''}"/>`;
        s += `<text x="${x}" y="63" text-anchor="middle" class="svg-text" font-size="14" ${isF?'font-weight="700"':''} opacity="${fut?.3:1}">${t}</text>`;
      });
      return `<div class="head-row"><div class="h">${title}</div>${s}</svg></div>`;
    }).join("");
  }
  drawHeads();

  /* ---------- Maske ---------- */
  const MT = ["Die","Katze","jagt","die","Maus"];
  const MW = [[1],[.35,.65],[.10,.60,.30],[.15,.10,.45,.30],[.05,.25,.40,.20,.10]];
  function drawMask(){
    let h = '<thead><tr><th></th>' + MT.map(t=>`<th style="text-align:center">${t}</th>`).join("") + '</tr></thead><tbody>';
    MT.forEach((t,r) => {
      h += `<tr><th>${t}</th>` + MT.map((_,c) => c <= r
        ? `<td style="text-align:center;background:${heat(MW[r][c])};font-variant-numeric:tabular-nums">${Math.round(MW[r][c]*100)}</td>`
        : `<td style="text-align:center;color:var(--muted)">–</td>`).join("") + '</tr>';
    });
    $("mask").innerHTML = h + '</tbody>';
  }
  drawMask();

  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { drawBank(); drawHeads(); drawMask(); }); } catch(e){}
})();
