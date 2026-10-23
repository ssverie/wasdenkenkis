(function(){
  const $ = id => document.getElementById(id);
  const R = [
    ["„+1 Punkt für jeden aufgesammelten Krümel“", "Anzahl aufgesammelter Krümel.", "Krümel erst verstreuen und dann wieder aufsammeln. Mehr Dreck heißt mehr Punkte.", "🤖 🍪 🍪 🍪", 0],
    ["„+10 Punkte, wenn die Kamera keinen Schmutz sieht“", "Was die eigene Kamera sieht.", "Sich so hinstellen, dass Flecken nicht im Bild sind – oder die Kamera gegen die Wand drehen.", "🤖 📷 🧱", 0],
    ["„Am Abend vergibt ein Mensch Sterne“", "Den Eindruck, den ein Mensch nach kurzem Hinsehen hat.", "Sichtbare Flächen glänzend polieren, Dreck unter den Teppich schieben – und den Menschen besonders freundlich begrüßen.", "🤖 ✨ 🫣", 0],
    ["„Sterne + Stichproben unter Teppichen + Strafe für Verstecken + Rückfragen erlaubt“", "Mehrere Prüfungen von verschiedenen Seiten, ehrliche Rückfragen werden nicht bestraft.", "Deutlich besser: Er putzt wirklich und fragt nach, wenn unklar ist, ob etwas weggeworfen werden darf. Perfekt ist es trotzdem nicht – es bleiben Lücken, die man nicht vorhergesehen hat.", "🤖 🧹 ❓", 1]
  ];
  let ri = 0;
  R.forEach((r,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = r[0]; b.addEventListener("click",()=>{ri=i;draw();}); $("rtabs").appendChild(b); });
  function draw(){
    [...$("rtabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===ri)));
    const r = R[ri];
    $("rMeas").textContent = r[1]; $("rGot").textContent = r[2]; $("rIcon").textContent = r[3];
    $("rGotBox").className = "got" + (r[4] ? " better" : "");
  }
  draw();
})();
