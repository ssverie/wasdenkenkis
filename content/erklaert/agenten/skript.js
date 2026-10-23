(function(){
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  /* ---------- Agent-Simulation ---------- */
  const TOOLS = ["shell", "datei_lesen", "datei_bearbeiten", "web_suche"];
  const BASE = 6000;   // Systemprompt + Werkzeugbeschreibungen
  const EV = [
    {t:"user", who:"Mensch", tag:"u", txt:"Der Build ist rot. Kannst du das reparieren?", tok:30},
    {t:"think", who:"Modell denkt", tag:"m", txt:"Ich weiß noch nichts über das Projekt. Zuerst die Tests laufen lassen, um den Fehler zu sehen.", tok:60},
    {t:"call", who:"Modell ruft Werkzeug", tag:"m", tool:"shell", code:'{ "werkzeug": "shell", "befehl": "mvn -q test" }', tok:40},
    {t:"result", who:"Programm führt aus", tag:"h", tool:"shell", code:"[ERROR] RechnungTest.bruttoMitRabatt\n  expected: <107.10> but was: <107.1>\nTests run: 48, Failures: 1", tok:900},
    {t:"think", who:"Modell denkt", tag:"m", txt:"Der Wert stimmt, aber die Nachkommastellen nicht: 107.10 vs. 107.1. Klingt nach BigDecimal-Skalierung. Ich schaue mir die Methode an.", tok:80},
    {t:"call", who:"Modell ruft Werkzeug", tag:"m", tool:"datei_lesen", code:'{ "werkzeug": "datei_lesen",\n  "pfad": "src/main/java/de/shop/Rechnung.java" }', tok:45},
    {t:"result", who:"Programm führt aus", tag:"h", tool:"datei_lesen", code:"public BigDecimal bruttoMitRabatt() {\n    return netto.multiply(MWST)\n                .multiply(BigDecimal.ONE.subtract(rabatt))\n                .stripTrailingZeros();\n}", tok:1800},
    {t:"think", who:"Modell denkt", tag:"m", txt:"stripTrailingZeros() entfernt die zweite Nachkommastelle. Für Geldbeträge sollte auf 2 Stellen gerundet werden.", tok:70},
    {t:"call", who:"Modell ruft Werkzeug", tag:"m", tool:"datei_bearbeiten", code:'{ "werkzeug": "datei_bearbeiten",\n  "alt": ".stripTrailingZeros();",\n  "neu": ".setScale(2, RoundingMode.HALF_UP);" }', tok:70},
    {t:"result", who:"Programm führt aus", tag:"h", tool:"datei_bearbeiten", code:"Datei geändert (1 Zeile).", tok:20},
    {t:"call", who:"Modell ruft Werkzeug", tag:"m", tool:"shell", code:'{ "werkzeug": "shell", "befehl": "mvn -q test" }', tok:40},
    {t:"result", who:"Programm führt aus", tag:"h", tool:"shell", code:"Tests run: 48, Failures: 0\nBUILD SUCCESS", tok:300},
    {t:"final", who:"Modell antwortet", tag:"m", txt:"Erledigt. In Rechnung.bruttoMitRabatt() hat stripTrailingZeros() die zweite Nachkommastelle entfernt. Ich runde jetzt mit setScale(2, HALF_UP). Alle 48 Tests laufen wieder durch.", tok:90}
  ];
  TOOLS.forEach(t => { const s = document.createElement("span"); s.textContent = t; s.dataset.t = t; $("tools").appendChild(s); });
  let ai = 0, timer = null;
  const COL = {user:"var(--muted)", think:"var(--accent)", call:"var(--accent)", result:"var(--accent-2)", final:"var(--ok)"};
  function drawA(){
    const shown = EV.slice(0, ai+1);
    $("log").innerHTML = shown.map((e,i) => {
      const body = e.code ? `<pre>${esc(e.code)}</pre>` : esc(e.txt);
      return `<div class="ev ${e.t}${i===ai?' cur':''}"><div class="who">${e.who}<i class="${e.tag}">${e.tag==="m"?"Modell":e.tag==="h"?"Programm":"Mensch"}</i></div>${body}</div>`;
    }).join("");
    $("log").scrollTop = $("log").scrollHeight;
    const cap = 200000, used = BASE + shown.reduce((a,e) => a + e.tok, 0);
    const segs = [["var(--line)", BASE]].concat(shown.map(e => [COL[e.t], e.tok]));
    const scale = 140 / 12000;   // Anzeige: 12 000 Tokens = volle Höhe des Balkens
    $("ctxv").innerHTML = segs.map(([c,n]) => `<span style="background:${c};height:${Math.max(1, n*scale)}px"></span>`).join("");
    $("ctxn").textContent = used.toLocaleString("de-DE") + " Tokens";
    const cur = EV[ai];
    document.querySelectorAll("#tools span").forEach(s => s.classList.toggle("on", !!cur.tool && s.dataset.t === cur.tool));
    $("aprev").disabled = ai === 0;
    $("anext").disabled = ai === EV.length-1;
  }
  function stop(){ clearInterval(timer); timer = null; $("aauto").textContent = "Abspielen"; }
  $("anext").addEventListener("click", () => { stop(); if (ai < EV.length-1){ ai++; drawA(); } });
  $("aprev").addEventListener("click", () => { stop(); if (ai > 0){ ai--; drawA(); } });
  $("aauto").addEventListener("click", () => {
    if (timer){ stop(); return; }
    if (ai === EV.length-1) ai = 0;
    $("aauto").textContent = "Anhalten"; drawA();
    timer = setInterval(() => { if (ai < EV.length-1){ ai++; drawA(); } else stop(); }, 1400);
  });
  drawA();

  /* ---------- Fehlerakkumulation ---------- */
  function drawAcc(){
    const p = +$("ap").value / 100, n = +$("an").value;
    $("apo").textContent = (p*100).toLocaleString("de-DE",{maximumFractionDigits:1}) + " %";
    $("ano").textContent = n;
    const tot = Math.pow(p, n);
    $("accBig").textContent = (tot*100).toLocaleString("de-DE",{maximumFractionDigits: tot < .1 ? 1 : 0}) + " % Gesamterfolg";
    $("accTxt").textContent = `${(p*100).toLocaleString("de-DE",{maximumFractionDigits:1})} % hoch ${n} – bei ${n} Schritten ohne Fehlerprüfung.`;
    const W = 520, H = 160, x0 = 36, y0 = 136, w = W - x0 - 10, h = 120;
    let path = "";
    for (let k=0;k<=100;k++){ const x = x0 + k/100*w, y = y0 - Math.pow(p,k)*h; path += (k? "L":"M") + x.toFixed(1) + " " + y.toFixed(1); }
    const mx = x0 + n/100*w, my = y0 - tot*h;
    $("accSvg").innerHTML = `
      ${[0,.5,1].map(v => `<line x1="${x0}" y1="${y0-v*h}" x2="${W-10}" y2="${y0-v*h}" style="stroke:var(--line)"/><text x="${x0-6}" y="${y0-v*h+4}" text-anchor="end" class="svg-muted" font-size="11">${v*100}%</text>`).join("")}
      ${[0,25,50,75,100].map(v => `<text x="${x0+v/100*w}" y="${y0+16}" text-anchor="middle" class="svg-muted" font-size="11">${v}</text>`).join("")}
      <path d="${path}" fill="none" style="stroke:var(--accent)" stroke-width="2.5"/>
      <line x1="${mx}" y1="${y0}" x2="${mx}" y2="${my}" style="stroke:var(--accent-2)" stroke-dasharray="3 3"/>
      <circle cx="${mx}" cy="${my}" r="5" style="fill:var(--accent-2)"/>`;
  }
  $("ap").addEventListener("input", drawAcc); $("an").addEventListener("input", drawAcc); drawAcc();
})();
