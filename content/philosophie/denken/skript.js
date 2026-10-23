(function(){
  const $ = id => document.getElementById(id);
  const NAMES = ["a1","b1","c1","a2","b2","c2","a3","b3","c3"];
  const GAME = [4,0,8,2,1,7,6];   // b2 a1 c3 c1 b1 b3 a3
  let step = 0, board, flipped = null;
  function rebuild(){ board = Array(9).fill(""); for (let i=0;i<step;i++) board[GAME[i]] = i%2 ? "o" : "x"; if (flipped !== null) board[flipped] = board[flipped] ? "" : (step%2 ? "o" : "x"); }
  function draw(){
    rebuild();
    $("seq").innerHTML = step ? GAME.slice(0,step).map((m,i) => i === step-1 ? `<span class="new">${NAMES[m]}</span>` : NAMES[m]).join(" ") : '<span style="color:var(--muted)">(noch kein Zug)</span>';
    const legal = board.map((v,i) => v ? -1 : i).filter(i => i >= 0);
    $("board").innerHTML = board.map((v,i) => `<button type="button" data-i="${i}" class="${v}${!v && step < GAME.length ? ' legal' : ''}${flipped === i ? ' flip' : ''}" aria-label="Feld ${NAMES[i]}">${v ? (v === "x" ? "✕" : "○") : ""}</button>`).join("");
    $("board").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i; if (!step) return;
      flipped = flipped === i ? null : i; draw();
    }));
    const n = $("mNote");
    if (flipped !== null){
      n.innerHTML = `<strong>Eingriff:</strong> Das innere Brett wurde an Feld ${NAMES[flipped]} verändert, die Zugfolge links ist gleich geblieben. Die vorgeschlagenen Züge (grün) richten sich jetzt nach dem veränderten inneren Brett – das Modell <em>benutzt</em> diese Darstellung also wirklich.`;
    } else if (!step){
      n.textContent = "Das Modell bekommt nur Feldnamen als Text. Drück „Nächster Zug“.";
    } else if (step >= GAME.length){
      n.textContent = "Partie zu Ende. Niemand hat dem Modell gesagt, dass es ein Brett gibt – es hat sich eines gebaut, weil das beim Vorhersagen hilft.";
    } else {
      n.textContent = `Nach ${step} Zügen: Die Eingabe ist nur Text, aber im Inneren lässt sich der Spielstand auslesen. Daraus folgen die möglichen nächsten Züge.`;
    }
    $("mNext").disabled = step >= GAME.length;
  }
  $("mNext").addEventListener("click", () => { flipped = null; step = Math.min(GAME.length, step+1); draw(); });
  $("mReset").addEventListener("click", () => { flipped = null; step = 0; draw(); });
  draw();

  const R = [
    ["Ein Bauer will einen Wolf, eine Ziege und einen Kohlkopf über einen Fluss bringen. Sein Boot fasst nur ihn und ein weiteres Ding. Allein gelassen frisst der Wolf die Ziege und die Ziege den Kohl. Wie kommt er hinüber?",
     "Erst die Ziege hinüber, allein zurück, den Wolf hinüber, die Ziege wieder mit zurück, den Kohl hinüber, allein zurück, zuletzt die Ziege. Sieben Fahrten.",
     "Dieselbe Lösung – hier passt das bekannte Schema, und es ist richtig."],
    ["Ein Bauer will eine Ziege über einen Fluss bringen. Sein Boot ist groß genug für ihn und die Ziege. Wie oft muss er fahren?",
     "Zuerst bringt er die Ziege hinüber und fährt allein zurück. Dann … (das Modell beginnt die bekannte Abfolge mit mehreren Fahrten)",
     "Einmal. Er nimmt die Ziege mit ins Boot und fährt hinüber. Es gibt keinen Wolf und keinen Kohl, also nichts, worauf er aufpassen müsste."]
  ];
  let ri = 0;
  function drawR(){
    [...$("rTabs").children].forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === ri)));
    $("rQ").textContent = R[ri][0]; $("rP").textContent = R[ri][1]; $("rT").textContent = R[ri][2];
  }
  [...$("rTabs").children].forEach(b => b.addEventListener("click", () => { ri = +b.dataset.v; drawR(); }));
  drawR();
})();
