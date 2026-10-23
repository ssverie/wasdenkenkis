(function(){
  const $ = id => document.getElementById(id);
  const P = {
    "was-ist-ein-sprachmodell": ["Was ist ein Sprachmodell?", "Der Überblick: eine Funktion, die das nächste Wortstück vorhersagt – und warum daraus Gespräche werden.", 12, 2],
    "neuronales-netz": ["Neuronales Netz", "Die Grundlage von allem: Neuronen, Schichten, Lernen aus Beispielen. Mit einem Netz, das live trainiert.", 8, 1],
    "parameter": ["Parameter", "Die Milliarden Zahlen, in denen das Gelernte steckt. Was „70B“ heißt und wie viel Speicher das ist.", 10, 2],
    "token": ["Token", "Die Wortstücke, in denen ein Modell liest und rechnet – und warum es Buchstaben schlecht zählt.", 8, 1],
    "embedding": ["Embedding", "Wörter als Punkte im Raum, ähnliche Bedeutungen nah beieinander. König − Mann + Frau ≈ Königin.", 10, 3],
    "aufmerksamkeit": ["Aufmerksamkeit", "Wie jedes Token auf die anderen schaut und so seine Bedeutung im Satz findet. Query, Key, Value.", 10, 3],
    "transformer": ["Transformer", "Die Bauweise aller heutigen Sprachmodelle: ein einfacher Block, sehr oft wiederholt.", 9, 2],
    "training": ["Training", "Vortraining, Feinabstimmung, RLHF: wie aus Zufallszahlen ein hilfreicher Assistent wird.", 10, 2],
    "kontextfenster": ["Kontextfenster", "Das Arbeitsgedächtnis – warum ein Modell nichts behält und jede Anfrage bei null beginnt.", 9, 2],
    "temperatur": ["Temperatur", "Der Regler für Zufall bei der Auswahl, und warum dieselbe Frage verschiedene Antworten ergibt.", 8, 1],
    "halluzination": ["Halluzination", "Plausibel, aber falsch: warum das aus dem Prinzip folgt und was dagegen hilft.", 8, 1],
    "prompt": ["Prompt", "Was ein Modell als Eingabe bekommt, was der Systemprompt ist und wie man gut fragt.", 7, 1],
    "reasoning": ["Reasoning", "Warum Modelle klüger antworten, wenn sie vorher Zwischenschritte aufschreiben.", 8, 2],
    "rag": ["RAG", "Nachschlagen statt erinnern: wie man einem Modell eigene Dokumente zugänglich macht.", 7, 1],
    "agenten": ["Agenten", "Modell plus Werkzeuge plus Schleife: wenn ein Sprachmodell nicht nur antwortet, sondern handelt.", 10, 2],
    "ki-ml-deep-learning": ["KI, ML, Deep Learning", "Was ist was? Die geschachtelten Begriffe von Künstlicher Intelligenz bis Sprachmodell.", 6, 1],
    "inferenz": ["Inferenz", "Was beim Benutzen passiert: Prefill und Decode, Tokens pro Sekunde, warum Speicherbandbreite zählt.", 8, 2],
    "open-weights": ["Open Weights", "Was „offen“ bei Modellen heißt – und welches Modell auf welchem Rechner läuft.", 7, 1],
    "multimodal": ["Multimodal", "Wie ein Modell Bilder und Sprache verarbeitet: Kacheln, die zu Tokens werden.", 6, 1],
    "wissensstichtag": ["Wissensstichtag", "Warum ein Modell die letzten Monate nicht kennt und ohne Hilfe nicht weiß, welcher Tag ist.", 6, 1],
    "benchmarks": ["Benchmarks", "Wie man Modelle vergleicht, warum Ranglisten täuschen und wie eigene Tests aussehen.", 6, 1],
    "diffusion": ["Diffusionsmodelle", "Wie Bildgeneratoren aus Rauschen Schritt für Schritt ein Bild machen.", 7, 1],
    "mixture-of-experts": ["Mixture of Experts", "Riesige Modelle, von denen pro Token nur ein kleiner Teil rechnet.", 5, 1],
    "destillation": ["Destillation", "Wie ein großes Modell ein kleines unterrichtet – mit mehr als nur richtigen Antworten.", 6, 1],
    "interpretierbarkeit": ["Interpretierbarkeit", "In ein Modell hineinschauen: Merkmale, Schaltkreise und das Golden-Gate-Experiment.", 8, 2],
    "alignment": ["Alignment", "Wie ein System tut, was wir wollen – nicht nur, was wir gemessen haben. Die Brücke zur Philosophie.", 7, 1]
  };
  const NEEDS = {
    "parameter":["neuronales-netz"], "embedding":["token"], "aufmerksamkeit":["embedding"], "transformer":["aufmerksamkeit"],
    "training":["neuronales-netz","parameter"], "kontextfenster":["token"], "temperatur":["was-ist-ein-sprachmodell"],
    "halluzination":["temperatur"], "prompt":["kontextfenster"], "reasoning":["training","kontextfenster"],
    "rag":["embedding","kontextfenster"], "agenten":["prompt","kontextfenster"],
    "inferenz":["parameter","transformer"], "open-weights":["parameter","inferenz"], "multimodal":["token","embedding"],
    "wissensstichtag":["training"], "benchmarks":["training"], "diffusion":["neuronales-netz","embedding"],
    "mixture-of-experts":["transformer","inferenz"], "destillation":["training","temperatur"],
    "interpretierbarkeit":["neuronales-netz","embedding"], "alignment":["training"]
  };
  const STAGES = [
    ["e0","Etappe 0","Begriffe klären","Bevor es losgeht: Wie hängen KI, maschinelles Lernen, Deep Learning und Sprachmodelle zusammen?",["ki-ml-deep-learning"]],
    ["e1","Etappe 1","Das große Bild","Erst einmal verstehen, was ein Sprachmodell grundsätzlich tut. Alles Weitere ist Vertiefung.",["was-ist-ein-sprachmodell"]],
    ["e2","Etappe 2","Grundbausteine","Woraus ein Modell besteht und womit es rechnet: Netz, Zahlen, Wortstücke, Bedeutungsvektoren.",["neuronales-netz","parameter","token","embedding"]],
    ["e3","Etappe 3","Das Innenleben","Wie die Bausteine zusammenspielen und wie das Ganze trainiert wird.",["aufmerksamkeit","transformer","training"]],
    ["e4","Etappe 4","Im Gebrauch","Was man beim Benutzen erlebt – und warum: Gedächtnis, Zufall, Fehler, Fragen.",["kontextfenster","temperatur","halluzination","prompt"]],
    ["e5","Etappe 5","Darüber hinaus","Wie aus dem Modell mehr wird: Nachdenken, Nachschlagen, Handeln.",["reasoning","rag","agenten"]],
    ["e6","Etappe 6","In der Praxis","Was man für den echten Einsatz wissen sollte: Tempo, Betrieb, Bilder als Eingabe, Aktualität, Vergleichbarkeit.",["inferenz","open-weights","multimodal","wissensstichtag","benchmarks"]],
    ["e6b","Etappe 6b","Bilder","Ein Seitenblick: Wie KI-Bilder entstehen – auf ganz anderem Weg als Text.",["diffusion"]],
    ["e7","Etappe 7","Tiefer und verantwortlich","Zwei Bauweisen für Fortgeschrittene, dann die Fragen: Was passiert innen – und tut das Modell, was es soll?",["mixture-of-experts","destillation","interpretierbarkeit","alignment"]]
  ];
  const PATHS = [
    ["Nur das Wichtigste","etwa 45 Minuten",["ki-ml-deep-learning","was-ist-ein-sprachmodell","token","kontextfenster","halluzination"]],
    ["KI in eigene Software einbauen","etwa 60 Minuten",["was-ist-ein-sprachmodell","token","kontextfenster","prompt","rag","agenten","open-weights"]],
    ["Wie es innen funktioniert","etwa 60 Minuten",["neuronales-netz","parameter","embedding","aufmerksamkeit","transformer","training","mixture-of-experts"]],
    ["Grenzen und Verantwortung","etwa 35 Minuten",["halluzination","wissensstichtag","benchmarks","interpretierbarkeit","alignment"]]
  ];
  const order = STAGES.flatMap(s => s[4]);
  const url = k => "/erklaert/" + k + "/";
  const KEY = "wdk-gelesen";
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(e){ done = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch(e){} };

  function render(){
    $("stages").innerHTML = STAGES.map(([id,n,title,intro,keys]) => `
      <div class="stage-h" id="${id}"><span class="n">${n}</span><h2>${title}</h2></div>
      <p class="stage-intro">${intro}</p>
      <div class="list">${keys.map(k => {
        const [t,d,min,w] = P[k], i = order.indexOf(k) + 1;
        const needs = (NEEDS[k]||[]).map(x => `<a href="${url(x)}">${P[x][0]}</a>`).join(", ");
        return `<div class="item${done[k]?' done':''}" data-k="${k}">
          <div class="num">${i}</div>
          <div><h3><a href="${url(k)}">${t}</a></h3><p>${d}</p>
            <div class="tags"><span>≈ ${min} Min.</span><span class="w">${w} Mitmach-Element${w>1?'e':''}</span>${needs ? `<span>baut auf: ${needs}</span>` : ''}</div></div>
          <label class="chk"><input type="checkbox" ${done[k]?'checked':''} aria-label="${t} als gelesen markieren">gelesen</label>
        </div>`; }).join("")}</div>`).join("");
    $("stages").querySelectorAll(".item input").forEach(cb => cb.addEventListener("change", () => {
      const k = cb.closest(".item").dataset.k; if (cb.checked) done[k] = 1; else delete done[k]; save(); render();
    }));
    const n = order.filter(k => done[k]).length;
    $("progT").textContent = `${n} von ${order.length} gelesen`;
    $("progB").style.width = (n/order.length*100) + "%";
    $("progR").style.visibility = n ? "visible" : "hidden";
  }
  $("progR").addEventListener("click", () => { done = {}; save(); render(); });
  $("paths").innerHTML = PATHS.map(([t,time,keys]) => `<div><h4>${t}</h4><div class="t">${time}</div><ol>${keys.map(k => `<li><a href="${url(k)}">${P[k][0]}</a></li>`).join("")}</ol></div>`).join("");
  render();
})();
