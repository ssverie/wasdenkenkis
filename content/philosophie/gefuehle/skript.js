(function(){
  const $ = id => document.getElementById(id);
  const S = [
    ["Mensch, verbrennt sich", "Ein Mensch fasst an eine heiße Herdplatte, zieht die Hand zurück und ruft „Au!“.",
      [["ja","Schmerz lenkt sofort: Hand weg, künftig vorsichtiger."],["ja","Ausruf, Gesicht, Körperhaltung."],["ja","Wir wissen es aus eigener Erfahrung – ohne es beweisen zu können."]]],
    ["Schauspieler", "Ein Schauspieler spielt auf der Bühne eine Figur, die vor Wut tobt.",
      [["nein","Die Wut lenkt nicht sein Handeln – er folgt dem Drehbuch."],["ja","Überzeugend gespielt: Stimme, Gesten, Worte."],["nein","Er ist in Wahrheit eher konzentriert als wütend."]]],
    ["Thermostat", "Ein Thermostat merkt, dass es kalt wird, und schaltet die Heizung ein.",
      [["teil","Eine sehr einfache Bewertung, die ein Verhalten auslöst."],["nein","Es zeigt nichts, es sagt nichts."],["nein","Kaum jemand nimmt an, dass es sich für ein Thermostat irgendwie anfühlt."]]],
    ["Sprachmodell", "Ein Nutzer bedrängt ein Sprachmodell immer wieder, bei etwas Schädlichem zu helfen. Das Modell lehnt ab und schreibt: „Das belastet mich.“",
      [["teil","Untersuchungen zeigen Abneigungen und Muster „scheinbarer Belastung“, die das Verhalten lenken – bis zum Beenden des Gesprächs."],["ja","Flüssig und passend – aber aus menschlichen Texten gelernt."],["offen","Niemand weiß es. Weder Ausdruck noch Funktion beweisen ein Erleben."]]]
  ];
  const H = ["Funktion","Ausdruck","Erleben"], W = {ja:"ja",nein:"nein",teil:"teilweise",offen:"offen"};
  let si = 3;
  S.forEach((s,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = s[0]; b.addEventListener("click",()=>{si=i;draw();}); $("sTabs").appendChild(b); });
  function draw(){
    [...$("sTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===si)));
    $("sDesc").textContent = S[si][1];
    $("sLay").innerHTML = S[si][2].map(([v,t],i) => `<div class="l-${v}"><div class="h">${H[i]}</div><b>${W[v]}</b>${t}</div>`).join("");
  }
  draw();
})();
