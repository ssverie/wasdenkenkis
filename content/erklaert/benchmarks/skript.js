(function(){
  const $ = id => document.getElementById(id);
  const MODELS = [["Atlas","groß, teuer","var(--accent)"],["Brisa","mittel, günstig","var(--ok)"],["Corvid","auf Code getrimmt","var(--accent-2)"],["Delta","Reasoning-Modell","#8b5cf6"]];
  const B = [
    ["Wissen", "Multiple-Choice-Fragen aus vielen Fächern. Alle Modelle liegen nah beieinander – der Test ist fast ausgereizt.", [91,86,84,90], "%"],
    ["Programmieren", "Echte Fehler in Open-Source-Projekten beheben, bis die Tests grün sind.", [62,48,74,66], "%"],
    ["Mathematik", "Wettbewerbsaufgaben mit exakter Lösung.", [58,41,52,88], "%"],
    ["Agenten", "Mehrschrittige Aufgaben mit Werkzeugen, etwa eine Buchung im Browser abschließen.", [55,38,49,51], "%"],
    ["Arena", "Menschen wählen zwischen zwei anonymen Antworten. Wertung wie beim Schach (Elo).", [1405,1392,1340,1380], ""]
  ];
  let bi = 0;
  B.forEach((b,i) => { const el = document.createElement("button"); el.type="button"; el.textContent = b[0]; el.addEventListener("click",()=>{bi=i;draw();}); $("btabs").appendChild(el); });
  function draw(){
    [...$("btabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===bi)));
    const [name, desc, vals, unit] = B[bi];
    $("bdesc").textContent = desc;
    const order = vals.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]);
    const lo = unit ? 0 : 1250, hi = unit ? 100 : 1450;
    $("rank").innerHTML = order.map(([v,i],r) => `<div class="rrow${r===0?' first':''}"><span class="pos">${r+1}</span><span class="nm">${MODELS[i][0]}<small>${MODELS[i][1]}</small></span><span class="tr"><span class="fl" style="display:block;width:${(v-lo)/(hi-lo)*100}%;background:${MODELS[i][2]}"></span></span><span class="v">${v.toLocaleString("de-DE")}${unit?' %':''}</span></div>`).join("");
  }
  draw();

  /* Sättigung */
  const W = 560, x0 = 44, y0 = 180, w = 500, h = 150;
  const curves = [[2019.5,"Wissen"],[2021.5,"Code"],[2023.2,"Fachfragen"],[2024.6,"Neu"]];
  let s = '';
  [0,50,100].forEach(p => s += `<line x1="${x0}" y1="${y0-p/100*h}" x2="${x0+w}" y2="${y0-p/100*h}" style="stroke:var(--line)"/><text x="${x0-6}" y="${y0-p/100*h+4}" text-anchor="end" class="svg-muted" font-size="11">${p}%</text>`);
  const X = yr => x0 + (yr-2019)/7*w;
  for (let yr=2019; yr<=2026; yr++) s += `<text x="${X(yr)}" y="${y0+18}" text-anchor="middle" class="svg-muted" font-size="11">${yr}</text>`;
  const cols = ["var(--muted)","var(--accent-2)","var(--accent)","#8b5cf6"];
  curves.forEach(([t0,label],k) => {
    let d = ''; for (let yr=t0; yr<=2026; yr+=.05){ const p = 100/(1+Math.exp(-(yr - t0 - (1.7 - k*.3))*(1.8 + k*.9))) * .95 + 3; d += (d?'L':'M') + X(yr).toFixed(1) + ' ' + (y0 - p/100*h).toFixed(1); }
    s += `<path d="${d}" fill="none" style="stroke:${cols[k]}" stroke-width="2.5"/>`;
    s += `<text x="${X(t0)+4}" y="${y0-14}" class="svg-text" font-size="11" font-weight="600" style="fill:${cols[k]}">${label}</text>`;
  });
  $("satSvg").innerHTML = s;
})();
