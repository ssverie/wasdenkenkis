(function(){
  const $ = id => document.getElementById(id);
  const P = ["Hersteller","Betreiber","Nutzer","KI selbst"], C = ["var(--accent)","var(--accent-2)","var(--ok)","var(--muted)"];
  const F = [
    ["Ein Airline-Chatbot nennt eine Erstattungsregel, die es nicht gibt (echter Fall, 2024).", [15,75,10,0], "Das Gericht sah die Airline in der Pflicht: Sie hat den Chatbot auf ihrer Website eingesetzt und haftet für dessen Auskünfte. Der Kunde durfte sich darauf verlassen. Die KI selbst kann nicht haften."],
    ["Ein Entwickler übernimmt KI-generierten Code ungeprüft – er enthält eine Sicherheitslücke.", [10,25,65,0], "Wer Code in Produktion bringt, ist für ihn verantwortlich, egal wer ihn geschrieben hat. Der Arbeitgeber trägt Mitverantwortung, wenn es keine Reviews gibt. Der Hersteller nur, wenn das Modell grob fehlerhaft wäre."],
    ["Ein Coding-Agent mit vollen Rechten löscht eine Produktionsdatenbank.", [15,50,35,0], "Hauptverantwortlich ist, wer dem Agenten diese Rechte ohne Sicherungen gegeben hat – Prinzip der minimalen Rechte, Bestätigung bei Kritischem, Backups. Der Hersteller kann Mitverantwortung tragen, wenn das Modell Warnhinweise ignoriert."],
    ["Jemand erzeugt mit einem Bildgenerator ein gefälschtes Foto einer Politikerin und verbreitet es.", [20,15,65,0], "Die Hauptverantwortung liegt bei der Person, die fälscht und verbreitet. Diskutiert wird, wie viel Schutz Hersteller und Plattformen einbauen müssen – etwa Sperren für echte Personen oder Kennzeichnung."]
  ];
  let fi = 0;
  F.forEach((f,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = f[0]; b.addEventListener("click",()=>{fi=i;draw();}); $("wTabs").appendChild(b); });
  function draw(){
    [...$("wTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===fi)));
    $("wShare").innerHTML = F[fi][1].map((v,i) => `<div class="share-row"><span>${P[i]}</span><span class="tr"><span class="fl" style="display:block;width:${v}%;background:${C[i]}"></span></span><span class="v">${v ? "●".repeat(Math.max(1,Math.round(v/25))) : "–"}</span></div>`).join("");
    $("wWhy").textContent = F[fi][2];
  }
  draw();
})();
