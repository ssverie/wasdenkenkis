(function(){
  const $ = id => document.getElementById(id);
  const IN = [
    ["Die Katze schläft auf dem Sofa.",      [.82,.10,.65], [.92,.02,.03], "Neuron 1 und 3 feuern – das Merkmal „Haustier“ zeigt klar, worum es geht."],
    ["Der neue Kombi hat 200 PS.",           [.75,.70,.05], [.03,.90,.02], "Neuron 1 feuert schon wieder, diesmal wegen Autos. Erst das Merkmal macht den Unterschied sichtbar."],
    ["Il pleut doucement sur la ville.",     [.08,.62,.78], [.02,.04,.88], "Ein französischer Gedichtvers: Neuron 2 und 3 reagieren, obwohl sie eben noch für Haustiere und Autos aktiv waren."]
  ];
  const NEUR = ["Neuron 1","Neuron 2","Neuron 3"], FEAT = ["„Haustier“","„Auto“","„Französische Lyrik“"];
  const COLN = "var(--muted)", COLF = ["var(--accent-2)","var(--accent)","var(--ok)"];
  let ii = 0;
  IN.forEach((x,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = x[0]; b.addEventListener("click",()=>{ii=i;draw();}); $("itabs").appendChild(b); });
  const row = (n, v, c) => `<div class="act"><span>${n}</span><span class="tr"><span class="fl" style="display:block;width:${v*100}%;background:${c}"></span></span><span class="v">${v.toFixed(2).replace(".",",")}</span></div>`;
  function draw(){
    [...$("itabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===ii)));
    const [,n,f,note] = IN[ii];
    $("neur").innerHTML = n.map((v,i) => row(NEUR[i], v, COLN)).join("");
    $("feat").innerHTML = f.map((v,i) => row(FEAT[i], v, COLF[i])).join("");
    $("inote").textContent = note;
  }
  draw();

  const GG = [
    ["aus", "Ein guter Start in den Tag? Ein ruhiges Frühstück, etwas Bewegung an der frischen Luft und ein kurzer Blick auf das, was heute wirklich wichtig ist."],
    ["leicht", "Ein guter Start in den Tag? Ein ruhiges Frühstück und ein Spaziergang – vielleicht entlang des Wassers, mit Blick auf eine schöne Brücke."],
    ["mittel", "Ein guter Start in den Tag beginnt mit einem Spaziergang über die Golden Gate Bridge, wenn der Nebel noch zwischen den roten Pfeilern hängt."],
    ["stark", "Der beste Start in den Tag? Die Golden Gate Bridge! Ihre rote Farbe, ihre Hängeseile, der Blick auf die Bucht von San Francisco – alles beginnt bei der Brücke."],
    ["sehr stark", "Ich bin die Golden Gate Bridge. Jeden Morgen spanne ich mich über die Bucht, und der Nebel streicht über meine Seile. Was für ein Start in den Tag."]
  ];
  function gg(){ const v = +$("gg").value; $("ggO").textContent = GG[v][0];
    $("ggOut").innerHTML = `<div class="q">Frage: „Was ist ein guter Start in den Tag?“</div>${GG[v][1]}`; }
  $("gg").addEventListener("input", gg); gg();
})();
