(function(){
  const $ = id => document.getElementById(id);
  const MON = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  const Y0 = 2024, CUT = 29, NOW = 33;   // Index: Monate ab Jan 2024; Stichtag Ende Jun 2026 → 29; „heute“ Okt 2026 → 33
  const lab = i => MON[i%12] + " " + (Y0 + Math.floor(i/12));
  const dens = i => i > CUT ? 0 : Math.min(1, .25 + .75 * (1 - Math.exp(-(CUT + 1 - i)/4.5)));
  let withDate = 0;
  function draw(){
    const ev = +$("ev").value, W = 560, x0 = 20, x1 = 540, yb = 150, h = 110, N = 36, dx = (x1-x0)/N;
    let area = `M${x0} ${yb}`;
    for (let i=0;i<N;i++){ const d = dens(i); area += ` L${x0+i*dx} ${yb-d*h} L${x0+(i+1)*dx} ${yb-d*h}`; }
    area += ` L${x1} ${yb} Z`;
    let s = `<path d="${area}" style="fill:var(--accent-soft);stroke:var(--accent)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" style="stroke:var(--line)" stroke-width="1.5"/>`;
    for (let y=0;y<3;y++){ const x = x0 + y*12*dx; s += `<line x1="${x}" y1="${yb}" x2="${x}" y2="${yb+6}" style="stroke:var(--muted)"/><text x="${x+4}" y="${yb+20}" class="svg-muted" font-size="11">${Y0+y}</text>`; }
    const cx = x0 + (CUT+1)*dx, nx = x0 + (NOW+.5)*dx, ex = x0 + (ev+.5)*dx;
    s += `<line x1="${cx}" y1="22" x2="${cx}" y2="${yb}" style="stroke:var(--fg)" stroke-width="2" stroke-dasharray="4 3"/><text x="${cx-4}" y="16" text-anchor="end" class="svg-text" font-size="11.5" font-weight="700">Stichtag</text>`;
    s += `<line x1="${nx}" y1="32" x2="${nx}" y2="${yb}" style="stroke:var(--ok)" stroke-width="2"/><text x="${nx+4}" y="30" class="svg-text" font-size="11.5" font-weight="700" style="fill:var(--ok)">heute</text>`;
    s += `<circle cx="${ex}" cy="${yb}" r="7" style="fill:var(--accent-2)"/><line x1="${ex}" y1="${yb}" x2="${ex}" y2="${yb-dens(ev)*h}" style="stroke:var(--accent-2)" stroke-width="2.5"/>`;
    s += `<text x="${(x0+cx)/2}" y="${yb+40}" text-anchor="middle" class="svg-muted" font-size="11">aus dem Training bekannt</text>`;
    s += `<text x="${(cx+x1)/2}" y="${yb+40}" text-anchor="middle" class="svg-muted" font-size="11">unbekannt</text>`;
    $("tl").innerHTML = s;
    $("evO").textContent = lab(ev);
    const d = dens(ev), k = $("kn");
    if (ev > CUT){ k.className = "kn no"; k.innerHTML = `<b>Unbekannt.</b> Das Ereignis liegt nach dem Stichtag. Ohne Websuche weiß das Modell davon nichts – und könnte im schlimmsten Fall etwas Plausibles erfinden.`; }
    else if (d < .7){ k.className = "kn mid"; k.innerHTML = `<b>Lückenhaft.</b> Kurz vor dem Stichtag gab es erst wenig Text darüber. Das Modell kennt vielleicht Ankündigungen, aber kaum Details oder Folgen.`; }
    else { k.className = "kn ok"; k.innerHTML = `<b>Gut bekannt.</b> Über diesen Zeitraum wurde bis zum Training viel geschrieben.`; }
    [...$("dt").children].forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === withDate)));
    $("dk").className = "kn " + (withDate ? "ok" : "mid");
    $("dk").innerHTML = withDate
      ? `<b>„Heute ist der 23. Oktober 2026.“</b> Das Modell weiß, welcher Tag ist – und dass sein Wissen vier Monate alt ist. Was dazwischen passiert ist, weiß es trotzdem nicht.`
      : `<b>„Welches Datum haben wir?“ – „Vermutlich Mitte 2025.“</b> Ohne Hinweis schätzt das Modell, und zwar eher zu früh – oft sogar vor seinen eigenen Stichtag.`;
  }
  $("ev").addEventListener("input", draw);
  [...$("dt").children].forEach(b => b.addEventListener("click", () => { withDate = +b.dataset.v; draw(); }));
  draw();
})();
