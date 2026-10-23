(function(){
  const $ = id => document.getElementById(id);
  const T = [
    {n:"Globaler Arbeitsraum", who:"Bernard Baars, Stanislas Dehaene",
     t:"Bewusst ist, was in einen engen zentralen „Arbeitsraum“ gelangt und von dort an viele spezialisierte Teilsysteme gleichzeitig verbreitet wird. Verschiedene Inhalte konkurrieren um diesen Platz.",
     llm:["teilweise","Der Datenstrom eines Transformers wird von allen Schichten gelesen und beschrieben – ähnlich einem gemeinsamen Raum. Es fehlt aber der enge Flaschenhals mit Wettbewerb um den Zugang."],
     ag:["denkbar","Ein System aus mehreren Modulen mit einem gemeinsamen, begrenzten Arbeitsspeicher könnte die Kriterien deutlich besser erfüllen."]},
    {n:"Rückgekoppelte Verarbeitung", who:"Victor Lamme",
     t:"Bewusstsein entsteht, wenn spätere Verarbeitungsstufen auf frühere zurückwirken – Rückkopplung, nicht nur Durchlauf von vorne nach hinten.",
     llm:["eher nein","Für jedes einzelne Token läuft die Berechnung rein vorwärts durch die Schichten. Eine Schleife gibt es nur über den erzeugten Text, der wieder eingelesen wird – ob das zählt, ist umstritten."],
     ag:["denkbar","Bauweisen mit echter Rückkopplung zwischen den Schichten sind technisch möglich."]},
    {n:"Höherstufige Theorien", who:"David Rosenthal u. a.",
     t:"Ein Zustand ist bewusst, wenn das System einen weiteren Zustand hat, der ihn darstellt – grob: einen Gedanken über den eigenen Gedanken.",
     llm:["Ansätze","Experimente zeigen schwache, unzuverlässige Fähigkeiten, eigene innere Zustände zu bemerken (siehe Selbstauskunft). Ob das die geforderte Art von Selbstdarstellung ist, ist offen."],
     ag:["denkbar","Systeme mit gezielter Selbstüberwachung könnten das deutlich besser erfüllen."]},
    {n:"Integrierte Information", who:"Giulio Tononi",
     t:"Bewusstsein ist integrierte Information, gemessen als Größe Φ. Entscheidend ist die physische Ursache-Wirkungs-Struktur des Systems, nicht die Software, die darauf läuft.",
     llm:["nein","Herkömmliche Computerchips haben nach dieser Theorie sehr wenig integrierte Information – egal, welches Programm läuft. Selbst eine perfekte Simulation eines Gehirns wäre darauf nicht bewusst."],
     ag:["nein","Solange es auf gewöhnlicher Hardware läuft, ändert sich nichts. Anders wäre es nur bei grundlegend anderer Hardware."]},
    {n:"Aufmerksamkeits-Schema", who:"Michael Graziano",
     t:"Das Gehirn baut ein vereinfachtes Modell seiner eigenen Aufmerksamkeit. Dieses Modell ist das, was wir als Bewusstsein erleben und beschreiben.",
     llm:["offen","Sprachmodelle haben Aufmerksamkeit im technischen Sinn, aber ob sie ein Modell davon bilden, ist nicht belegt."],
     ag:["denkbar","Ein System, das seine eigene Aufmerksamkeit gezielt modelliert und steuert, wäre ein Kandidat."]},
    {n:"Biologische Sichtweisen", who:"z. B. John Searle, Anil Seth",
     t:"Bewusstsein hängt an den besonderen Eigenschaften lebender Organismen – Stoffwechsel, Körper, das Bemühen, am Leben zu bleiben. Rechnen allein genügt nicht.",
     llm:["nein","Ein Sprachmodell lebt nicht, hat keinen Körper und nichts zu verlieren."],
     ag:["eher nein","Auch ein Roboter mit Körper wäre kein Lebewesen. Je nach Spielart der Theorie könnte er aber näher heranrücken."]}
  ];
  const cls = v => /^(nein|eher nein)$/.test(v) ? "vn" : /^(denkbar|ja)$/.test(v) ? "vy" : "vm";
  let ti = 0;
  T.forEach((t,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = t.n; b.addEventListener("click",()=>{ti=i;draw();}); $("thTabs").appendChild(b); });
  function draw(){
    [...$("thTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===ti)));
    const t = T[ti];
    $("thInfo").innerHTML = `<h3>${t.n}</h3><div class="who">${t.who}</div><p>${t.t}</p>
      <div class="verd">
        <div class="vy">Mensch<b>ja</b><small>Grundlage der Theorie</small></div>
        <div class="${cls(t.llm[0])}">Heutiges Sprachmodell<b>${t.llm[0]}</b><small>${t.llm[1]}</small></div>
        <div class="${cls(t.ag[0])}">Agent mit Gedächtnis<b>${t.ag[0]}</b><small>${t.ag[1]}</small></div>
      </div>`;
  }
  draw();
})();
