(function(){
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const CH = [
    "Urlaub: Vollzeitbeschäftigte haben 30 Urlaubstage pro Kalenderjahr. Resturlaub verfällt am 31. März des Folgejahres.",
    "Homeoffice: Bis zu zwei Tage pro Woche sind nach Absprache mit der Teamleitung möglich.",
    "Dienstreisen: Bahnfahrten in der 2. Klasse. Ab einer Fahrtzeit von vier Stunden darf die 1. Klasse gebucht werden.",
    "IT-Probleme: Bei Hardwaredefekten ein Ticket im Helpdesk-Portal anlegen. Dringend: Durchwahl 222.",
    "Krankmeldung: Am ersten Tag bis 9 Uhr die Teamleitung informieren. Ab dem dritten Krankheitstag ist eine Arbeitsunfähigkeitsbescheinigung nötig.",
    "Kantine: Geöffnet von 11:30 bis 14 Uhr. Bezahlt wird mit dem Firmenausweis.",
    "Parkplätze: Die Tiefgarage steht allen Mitarbeitenden frei zur Verfügung, solange Plätze frei sind.",
    "Weiterbildung: Pro Jahr stehen jedem 1 500 € Weiterbildungsbudget zur Verfügung, Antrag über die Personalabteilung."
  ];
  const Q = [
    {q:"Wie viele Urlaubstage habe ich?", s:[.89,.41,.22,.12,.30,.10,.08,.35],
     with:"Du hast 30 Urlaubstage pro Kalenderjahr.<sup>[1]</sup> Nicht genommener Urlaub verfällt am 31. März des Folgejahres.<sup>[1]</sup>", wo:"In Deutschland stehen Arbeitnehmern gesetzlich mindestens 20 Urlaubstage bei einer Fünftagewoche zu. Üblich sind 25 bis 30 Tage.", woV:["bad","Allgemein richtig, aber nicht die Antwort auf die Frage nach dieser Firma."]},
    {q:"Darf ich auf Dienstreisen erster Klasse fahren?", s:[.18,.15,.91,.10,.09,.07,.20,.14],
     with:"Grundsätzlich wird die 2. Klasse gebucht. Ab einer Fahrtzeit von vier Stunden ist die 1. Klasse erlaubt.<sup>[3]</sup>", wo:"Ja, bei Dienstreisen ist die Nutzung der 1. Klasse in der Regel erstattungsfähig, wenn die Fahrt länger als zwei Stunden dauert.", woV:["bad","Selbstsicher – und erfunden. Eine typische Halluzination."]},
    {q:"Mein Laptop startet nicht mehr. Was tun?", s:[.06,.21,.10,.86,.15,.05,.04,.09],
     with:"Leg ein Ticket im Helpdesk-Portal an.<sup>[4]</sup> Wenn es dringend ist, ruf die Durchwahl 222 an.<sup>[4]</sup>", wo:"Versuche zuerst einen Neustart, indem du den Einschaltknopf 10 Sekunden gedrückt hältst. Prüfe das Netzteil. Wenn das nicht hilft, wende dich an deine IT-Abteilung.", woV:["bad","Hilfreiche Allgemeintipps, aber ohne den firmeninternen Weg."]},
    {q:"Ab wann brauche ich einen Krankenschein?", s:[.20,.12,.06,.11,.90,.05,.04,.10],
     with:"Ab dem dritten Krankheitstag brauchst du eine Arbeitsunfähigkeitsbescheinigung.<sup>[5]</sup> Am ersten Tag musst du bis 9 Uhr deine Teamleitung informieren.<sup>[5]</sup>", wo:"Nach dem Entgeltfortzahlungsgesetz ist eine Bescheinigung spätestens ab dem vierten Kalendertag nötig, der Arbeitgeber kann sie aber früher verlangen.", woV:["bad","Die gesetzliche Regel – diese Firma verlangt sie früher."]},
    {q:"Bekomme ich einen Firmenwagen?", s:[.14,.10,.38,.08,.06,.07,.41,.12],
     with:"Dazu steht im Handbuch nichts. Die gefundenen Abschnitte zu Parkplätzen und Dienstreisen beantworten die Frage nicht. Frag am besten in der Personalabteilung nach.", wo:"Ob du einen Firmenwagen bekommst, hängt von deiner Position und der Firmenregelung ab. Häufig erhalten Außendienst und Führungskräfte einen Dienstwagen.", woV:["ok","Ehrlich allgemein – aber ohne Bezug zur Firma."]}
  ];
  let qi = 0, m = 1;
  Q.forEach((x,i) => { const b = document.createElement("button"); b.type = "button"; b.textContent = x.q; b.addEventListener("click", () => { qi = i; draw(); }); $("qsel").appendChild(b); });
  [...$("mode").children].forEach(b => b.addEventListener("click", () => { m = +b.dataset.m; draw(); }));
  function draw(){
    [...$("qsel").children].forEach((b,i) => b.setAttribute("aria-pressed", String(i===qi)));
    [...$("mode").children].forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.m === m)));
    const x = Q[qi];
    if (!m){
      $("steps").innerHTML = `<div class="step"><div class="h">An das Modell geht nur</div><div class="prompt-box">Frage: ${esc(x.q)}</div></div>
        <div class="step"><div class="h">Antwort aus dem Gedächtnis</div><div class="answer${x.woV[0]==='bad'?' bad':''}">${x.wo}</div><div class="verdict ${x.woV[0]}">${x.woV[1]}</div></div>`;
      return;
    }
    const ranked = x.s.map((s,i) => [s,i]).sort((a,b) => b[0]-a[0]);
    const used = ranked.filter(r => r[0] > .5).slice(0,3).map(r => r[1]);
    const rows = ranked.map(([s,i]) => `<div class="chunk${used.includes(i)?' top':''}${s < .3 ? ' low' : ''}"><span class="id">[${i+1}]</span><span>${esc(CH[i])}</span><span class="sc"><i style="width:${s*40}px"></i>${s.toFixed(2).replace(".",",")}</span></div>`).join("");
    const ctx = used.length ? used.map(i => `[${i+1}] ${CH[i]}`).join("\n") : "(keine Abschnitte über der Schwelle 0,5)";
    $("steps").innerHTML = `
      <div class="step"><div class="h">① Suchen: Ähnlichkeit der Frage zu jedem Abschnitt</div>${rows}</div>
      <div class="step"><div class="h">② Prompt, der ans Modell geht</div><div class="prompt-box">Beantworte die Frage nur anhand der Auszüge. Nenne die Quelle. Steht die Antwort nicht darin, sag das.\n\n<span class="ins">${esc(ctx)}</span>\n\nFrage: ${esc(x.q)}</div></div>
      <div class="step"><div class="h">③ Antwort</div><div class="answer">${x.with}</div><div class="verdict ok">${used.length ? "Belegt durch das Handbuch – nachprüfbar über die Quellennummer." : "Nichts gefunden – und das wird ehrlich gesagt, statt zu raten."}</div></div>`;
  }
  draw();
})();
