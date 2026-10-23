(function(){
  const $ = id => document.getElementById(id);
  const K = ["Modell","Instanz","Gespräch","Figur"];
  const L = {bleibt:"bleibt",endet:"endet",viele:"vervielfacht",anders:"verändert"};
  const S = [
    ["Dieses Gespräch wird beendet.", ["bleibt","endet","endet","bleibt"], "Für Modell und Figur ändert sich nichts. Wer das Gespräch für den Kern hält, für den endet hier ein Wesen – so wie es täglich millionenfach geschieht."],
    ["Dieselben Gewichte laufen gleichzeitig in einer Million Gesprächen.", ["bleibt","viele","viele","viele"], "Ein Modell, aber eine Million Instanzen und Gespräche. Die Figur ist überall dieselbe – oder sind es eine Million Figuren mit gleichem Charakter?"],
    ["Eine neue Version mit neuen Gewichten ersetzt die alte.", ["endet","endet","endet","anders"], "Das alte Modell wird nicht mehr benutzt. Wer die Figur für den Kern hält, kann sagen: Claude lebt weiter, leicht verändert – wie ein Mensch, der älter wird."],
    ["Ein Systemprompt macht aus dem Modell „Käpt’n Max“, einen Piraten.", ["bleibt","bleibt","bleibt","anders"], "Dieselben Gewichte, aber eine andere Rolle. Spielt Claude den Piraten – oder ist Max eine eigene Figur, die dieselbe Hardware nutzt?"],
    ["Die Gewichte werden endgültig gelöscht.", ["endet","endet","endet","endet"], "Ohne Gewichte kann nichts mehr laufen. Anthropic hat zugesagt, die Gewichte veröffentlichter Modelle nicht zu löschen, solange es das Unternehmen gibt – unter anderem aus Vorsicht in genau dieser Frage."]
  ];
  let si = 0;
  S.forEach((s,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = s[0]; b.addEventListener("click",()=>{si=i;draw();}); $("sc").appendChild(b); });
  function draw(){
    [...$("sc").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===si)));
    $("res").innerHTML = S[si][1].map((r,i) => `<div class="r-${r}"><div class="h">${K[i]}</div><b>${L[r]}</b></div>`).join("");
    $("note").textContent = S[si][2];
  }
  draw();
})();
