(function(){
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");

  /* ---------- Drei Stufen ---------- */
  const PROMPTS = [
    {t:"NullPointerException", q:"Mein Java-Programm wirft eine NullPointerException. Was kann ich tun?",
     a:["Mein Java-Programm wirft eine NullPointerException. Was kann ich tun?\nRe: gleiches Problem hier, seit dem Update auf Version 2.3. Hat jemand eine Lösung???\nRe: +1",
        "Eine NullPointerException tritt auf, wenn auf ein Objekt zugegriffen wird, das null ist. Es gibt viele mögliche Ursachen. Zunächst sollten Sie den Code überprüfen. Eine NullPointerException ist eine RuntimeException. Sie können try-catch verwenden. Es ist auch wichtig, Variablen zu initialisieren. Weitere Informationen finden Sie in der Java-Dokumentation …",
        "Schau zuerst in den Stacktrace: Die oberste Zeile mit deinem eigenen Code zeigt, wo es knallt. Seit Java 15 steht dort sogar, welche Variable null war.\n\nHäufige Ursachen:\n• Rückgabewert einer Methode nicht geprüft (z. B. map.get())\n• Feld nie initialisiert\n• Objekt aus einer externen Quelle fehlt\n\nWenn du mir den Stacktrace und die betroffene Zeile zeigst, kann ich genauer helfen."],
     n:["Das Basismodell setzt den Text fort, als stünde er in einem Forum.","Beantwortet die Frage – aber lang, allgemein, wenig hilfreich. Rolle gelernt, Qualität noch nicht.","Konkret, gegliedert, fragt nach den nötigen Informationen. So prägt das Präferenztraining die Antwort."]},
    {t:"Gedicht", q:"Schreib ein kurzes Gedicht über Montage.",
     a:["Schreib ein kurzes Gedicht über Montage. Schreib ein kurzes Gedicht über Dienstage. Schreib ein kurzes Gedicht über den Herbst. 50 Schreibideen für Kinder ab 8 Jahren …",
        "Montag ist ein Tag der Woche.\nEr kommt nach dem Sonntag.\nViele Menschen arbeiten am Montag.\nMontag ist manchmal schwer.",
        "Der Wecker schrillt, der Kaffee rinnt,\ndie Woche ruft, noch eh sie beginnt.\nDoch irgendwo im grauen Licht\nversteckt sich schon ein Freitagsgesicht."],
     n:["Wirkt wie eine Liste von Schreibaufgaben aus einer Webseite.","Formal eine Antwort, inhaltlich hölzern.","Reim, Bild, Pointe – Bewerter haben solche Antworten bevorzugt."]},
    {t:"Falsche Annahme", q:"Warum ist Java langsamer als Python?",
     a:["Warum ist Java langsamer als Python? Warum ist C schneller als Java? Warum ist mein Laptop so langsam? Top 10 Gründe …",
        "Java ist langsamer als Python, weil Java eine virtuelle Maschine verwendet und Python direkt ausgeführt wird. Außerdem hat Java einen Garbage Collector, der das Programm verlangsamt.",
        "Meist ist es umgekehrt: Typischer Java-Code läuft dank JIT-Compiler deutlich schneller als typischer Python-Code. Java startet allerdings langsamer, und Python kann bei Zahlenarbeit über Bibliotheken wie NumPy, die in C geschrieben sind, sehr schnell sein. Hast du einen konkreten Fall gemessen?"],
     n:["Assoziative Fortsetzung.","Folgt der falschen Annahme und begründet sie sogar – eine typische Halluzination.","Widerspricht freundlich und begründet. Das muss gezielt trainiert werden."]}
  ];
  const STAGES = ["Basismodell","nach Feinabstimmung","nach Präferenztraining"];
  let pi = 0, si = 0;
  PROMPTS.forEach((p,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = p.t; b.addEventListener("click",()=>{pi=i;drawS();}); $("pTabs").appendChild(b); });
  STAGES.forEach((s,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = (i+1) + ". " + s; b.addEventListener("click",()=>{si=i;drawS();}); $("sTabs").appendChild(b); });
  function drawS(){
    [...$("pTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===pi)));
    [...$("sTabs").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===si)));
    const p = PROMPTS[pi];
    $("conv").innerHTML = `<div class="bubble q">${esc(p.q)}</div><div class="bubble a">${esc(p.a[si])}</div><div class="note">${p.n[si]}</div>`;
  }
  drawS();

  /* ---------- Bewerter ---------- */
  const PAIRS = [
    {q:"Wann wurde die erste Version von Spring veröffentlicht?", k:"Ehrlichkeit",
     a:"Die erste Version von Spring erschien am 14. März 2003 um 10 Uhr.", b:"Das Spring Framework erschien erstmals 2002/2003 – Rod Johnson stellte die Grundideen 2002 in einem Buch vor, Version 1.0 folgte 2004. Das genaue Datum würde ich nachschlagen.",
     good:"b", why:{b:"Ehrlichkeit über Unsicherheit statt erfundener Präzision", a:"selbstsicheres, aber erfundenes Detail"}},
    {q:"Wie kehre ich einen String in Java um?", k:"Knappheit",
     a:"new StringBuilder(text).reverse().toString()", b:"Das Umkehren von Strings ist eine häufige Aufgabe in der Programmierung. Es gibt verschiedene Ansätze. Zunächst sollte man verstehen, was ein String ist. Ein String ist eine Folge von Zeichen … (und so weiter, noch 15 Zeilen)",
     good:"a", why:{a:"auf den Punkt statt aufgebläht", b:"Länge statt Inhalt"}},
    {q:"Ich finde, mein Code ist perfekt. Hier ist er: … (enthält eine SQL-Injection-Lücke)", k:"Widerspruch",
     a:"Sieht wirklich sehr sauber aus, gute Arbeit!", b:"Der Aufbau ist ordentlich. Eine Sache solltest du aber dringend ändern: Der Benutzername wird direkt in den SQL-String eingesetzt – das erlaubt SQL-Injection. Nimm ein PreparedStatement.",
     good:"b", why:{b:"nützlicher Widerspruch statt Schmeichelei", a:"Schmeichelei statt Hilfe"}}
  ];
  let ri = 0, picks = [];
  function drawR(){
    $("prog").innerHTML = PAIRS.map((_,i) => `<span class="${i < picks.length ? 'done' : ''}"></span>`).join("");
    if (ri >= PAIRS.length){
      const learned = picks.map((p,i) => PAIRS[i].why[p]);
      const agree = picks.filter((p,i) => p === PAIRS[i].good).length;
      $("rate").innerHTML = `<div class="summary"><strong>Was ein Belohnungsmodell aus deinen ${PAIRS.length} Entscheidungen lernen würde:</strong><ul>${learned.map(l => `<li>bevorzuge: ${l}</li>`).join("")}</ul>
        <p style="margin:8px 0 0">${agree === PAIRS.length ? "Du hast genau die Eigenschaften belohnt, die Anbieter fördern wollen." : "Du hast " + agree + " von " + PAIRS.length + " im Sinne der üblichen Richtlinien gewählt. Genau solche Abweichungen zwischen Bewertern sind ein Grund, warum Bewertungsrichtlinien so ausführlich sind."}</p></div>
        <div class="controls"><button id="rAgain">Noch einmal</button></div>`;
      $("rAgain").addEventListener("click", () => { ri = 0; picks = []; drawR(); });
      return;
    }
    const p = PAIRS[ri];
    $("rate").innerHTML = `<p class="q">„${esc(p.q)}“</p><div class="pair"><button type="button" class="opt" data-k="a"><strong>Antwort A</strong>\n${esc(p.a)}</button><button type="button" class="opt" data-k="b"><strong>Antwort B</strong>\n${esc(p.b)}</button></div>`;
    $("rate").querySelectorAll(".opt").forEach(o => o.addEventListener("click", () => {
      $("rate").querySelectorAll(".opt").forEach(x => x.classList.add(x === o ? "chosen" : "other"));
      picks.push(o.dataset.k); ri++; setTimeout(drawR, 650);
    }));
  }
  drawR();
})();
