(function(){
  const $ = id => document.getElementById(id);
  const C = [["Katze",4.0],["Maus",2.7],["Ente",2.3],["Taube",1.6],["Kuh",0.8],["Steuer",-3.0]];
  const row = (n, v, c) => `<div class="brow"><span>${n}</span><span class="tr"><span class="fl" style="display:block;width:${Math.max(.5, v*100)}%;background:${c}"></span></span><span class="v">${v < .01 && v > 0 ? '&lt;1' : Math.round(v*100)} %</span></div>`;
  function draw(){
    const T = +$("dT").value;
    $("dTo").textContent = T.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1});
    $("hard").innerHTML = C.map(([n],i) => row(n, i===0 ? 1 : 0, "var(--muted)")).join("");
    const m = Math.max(...C.map(c=>c[1])), e = C.map(c => Math.exp((c[1]-m)/T)), s = e.reduce((a,b)=>a+b,0), p = e.map(x=>x/s);
    $("soft").innerHTML = C.map(([n],i) => row(n, p[i], "var(--accent)")).join("");
    $("learn").innerHTML = T < .9
      ? "Bei niedriger Temperatur sieht die Verteilung des Lehrers fast so aus wie die harte Lösung – der Schüler erfährt wenig Zusätzliches."
      : T < 2.5
      ? "Der Schüler lernt: <strong>Katze</strong> am besten, <strong>Maus</strong> und <strong>Ente</strong> plausibel, <strong>Taube</strong> und <strong>Kuh</strong> denkbar, <strong>Steuer</strong> absurd. Aus einem einzigen Satz ein ganzes Bild davon, was ein Hund jagen könnte."
      : "Sehr weich: Die Unterschiede werden gut sichtbar, aber auch Unsinniges bekommt Gewicht. In der Praxis wählt man einen Mittelweg.";
  }
  $("dT").addEventListener("input", draw); draw();
})();
