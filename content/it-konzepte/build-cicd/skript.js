// ---------- Lebenszyklus ----------
(function(){
  const $=id=>document.getElementById(id);
  const P=[['validate','Projekt prüfen: Ist die pom.xml gültig?'],['compile','<code>compiler:compile</code> – Quellen nach <code>target/classes</code>'],['test','<code>surefire:test</code> – Unit-Tests ausführen'],['package','<code>jar:jar</code> – JAR (oder WAR) in <code>target/</code> verpacken'],['verify','<code>failsafe:verify</code> – Integrationstests, weitere Prüfungen'],['install','<code>install:install</code> – ins lokale Repository <code>~/.m2</code> kopieren'],['deploy','<code>deploy:deploy</code> – in ein entferntes Repository hochladen']];
  const N={compile:'Nur kompilieren – schnell, um zu sehen, ob alles übersetzbar ist.',test:'Kompilieren und Unit-Tests. Ein fehlschlagender Test bricht hier ab.',package:'Der übliche Weg zur JAR-Datei – mit allen Phasen davor. Wer Tests überspringen will, muss es ausdrücklich sagen (<code>-DskipTests</code>) – und sollte es nicht.',verify:'In CI-Pipelines der Standard: alles inklusive Integrationstests, aber nichts wird irgendwohin kopiert.',install:'Legt das Artefakt ins lokale Repository – nötig, wenn ein anderes lokales Projekt es als Abhängigkeit braucht. Für einen normalen Build unnötig.',clean:'<code>clean</code> gehört zu einem eigenen Lebenszyklus und löscht nur <code>target/</code>. Oft kombiniert: <code>mvn clean verify</code> – frischer Build ohne Reste alter Läufe.'};
  function draw(p){
    const k=P.findIndex(x=>x[0]===p);
    $('lc').innerHTML=(p==='clean'?'<div class="ph clean"><b>clean</b><span><code>clean:clean</code> – Ordner <code>target/</code> löschen</span></div>':'')+P.map((x,i)=>'<div class="ph '+(p==='clean'?'off':i<=k?'on':'off')+'"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('');
    $('lcN').innerHTML=N[p];
  }
  const bs=[...document.querySelectorAll('#lcC button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw(b.dataset.p);}));
  draw('package');
})();

// ---------- Abhängigkeiten ----------
(function(){
  const $=id=>document.getElementById(id);
  let tool='maven';
  function draw(){
    const swap=$('depSwap').checked,pin=$('depPin').checked;
    // nahe Abhängigkeit (Tiefe 2) und ferne (Tiefe 3)
    const near=swap?'1.5':'2.0',far=swap?'2.0':'1.5';
    let win;
    if(pin)win='2.1';else if(tool==='gradle')win='2.0';else win=near;
    const cls=v=>v===win?'win':'lose';
    let t='bestellservice\n';
    t+='├── zahlungs-lib 3.2\n│   └── json-tools <span class="'+cls(near)+'">'+near+'</span>   <span class="c">← Tiefe 2</span>\n';
    t+='└── bericht-lib 1.4\n    └── pdf-lib 5.0\n        └── json-tools <span class="'+cls(far)+'">'+far+'</span>   <span class="c">← Tiefe 3</span>\n';
    if(pin)t+='\n<span class="pin">dependencyManagement: json-tools 2.1</span>  <span class="c">← gilt für alle</span>';
    $('dt').innerHTML=t;
    const r=$('depR');
    if(pin){r.className='dep-res ok';r.innerHTML='<b>json-tools 2.1 für alle.</b> Die ausdrückliche Festlegung schlägt jede automatische Regel. So hat man die Entscheidung selbst getroffen – und sollte prüfen, dass beide Bibliotheken mit 2.1 zurechtkommen.';}
    else if(tool==='gradle'){r.className='dep-res ok';r.innerHTML='<b>Gradle nimmt die höchste Version: 2.0</b> – unabhängig von der Tiefe. Meist die bessere Wahl, denn neue Versionen sind häufiger rückwärtskompatibel als umgekehrt. Garantiert ist das aber nicht.';}
    else if(!swap){r.className='dep-res ok';r.innerHTML='<b>Maven: „der Nächste gewinnt“ – 2.0.</b> Die Version mit dem kürzesten Weg zur Anwendung wird genommen. Hier zufällig die neuere, also geht es wahrscheinlich gut.';}
    else{r.className='dep-res bad';r.innerHTML='<b>Maven nimmt 1.5 – die ältere!</b> Weil sie näher an der Anwendung hängt. Ruft pdf-lib eine Methode auf, die es erst in 2.0 gibt, kommt zur Laufzeit ein <code>NoSuchMethodError</code>. Kompiliert hat alles – pdf-lib wurde ja gegen 2.0 gebaut.';}
  }
  const bs=[...document.querySelectorAll('#depTool button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');tool=b.dataset.t;draw();}));
  $('depSwap').addEventListener('change',draw);$('depPin').addEventListener('change',draw);draw();
})();

// ---------- Pipeline ----------
(function(){
  const $=id=>document.getElementById(id);
  const S=[['Checkout','Code holen',2],['Build','kompilieren',20],['Unit-Tests','schnell, viele',45],['Prüfung','Abhängigkeiten auf Lücken',15],['Integration','mit Datenbank im Container',120],['Image','einmal bauen',30],['Staging','ausrollen + Smoke-Test',60],['Produktion','ausrollen',90]];
  let state,timer=null;
  function reset(){state=S.map(()=>'');draw('Ein <code>git push</code> startet die Pipeline.');}
  function draw(msg){$('pl').innerHTML=S.map((s,i)=>'<div class="st '+state[i]+'"><b>'+s[0]+'</b><small>'+s[1]+'<br>'+s[2]+' s</small></div>').join('');if(msg!==undefined)$('plN').innerHTML=msg;}
  function run(){if(timer)return;reset();let i=0,t=0;
    timer=setInterval(()=>{
      if(i>0&&state[i-1]==='run')state[i-1]='ok';
      if(i>=S.length){clearInterval(timer);timer=null;draw('<b>Live.</b> Vom Push bis in Produktion rund '+Math.round(t/60)+' Minuten, ohne dass jemand etwas angefasst hat – und dasselbe Image, das in Staging getestet wurde, läuft jetzt in Produktion.');return;}
      const name=S[i][0];
      if(name==='Unit-Tests'&&$('plFail').checked){state[i]='fail';for(let j=i+1;j<S.length;j++)state[j]='skip';clearInterval(timer);timer=null;
        draw('<b>Rot nach '+Math.round((t+S[i][2])/60*10)/10+' Minuten.</b> Ein Test schlägt fehl, alles danach wird übersprungen. Nichts wurde ausgerollt. Der Entwickler weiß Bescheid, bevor er mit dem Kopf woanders ist.');return;}
      if(name==='Prüfung'&&$('plCve').checked){state[i]='fail';for(let j=i+1;j<S.length;j++)state[j]='skip';clearInterval(timer);timer=null;
        draw('<b>Gestoppt:</b> Eine eingebundene Bibliothek hat eine bekannte, schwerwiegende Sicherheitslücke. Die Pipeline bricht ab, bis die Abhängigkeit aktualisiert ist – die schnellste Stelle, um so etwas aufzuhalten.');return;}
      if(name==='Produktion'&&!$('plCd').checked){state[i]='wait';clearInterval(timer);timer=null;
        draw('<b>Continuous Delivery:</b> Alles ist geprüft und in Staging getestet – jetzt wartet die Pipeline auf eine menschliche Freigabe. Ein Klick, und genau dieses Image geht live.');return;}
      state[i]='run';t+=S[i][2];draw('Läuft: <b>'+name+'</b> …');i++;
    },550);}
  $('plRun').addEventListener('click',run);
  reset();
})();

// ---------- Ausrollen ----------
(function(){
  const $=id=>document.getElementById(id);
  const ST={
    rolling:[
      {s:['v1','v1','v1','v1','v1','v1'],t:'alle Anfragen an v1',n:'Sechs Server mit Version 1. Rolling heißt: einen nach dem anderen austauschen.'},
      {s:['upd','v1','v1','v1','v1','v1'],t:'5 Server bedienen, einer wird aktualisiert',n:'Server 1 wird aus dem Lastverteiler genommen, aktualisiert und gestartet. Die anderen fünf tragen die Last.'},
      {s:['v2','upd','v1','v1','v1','v1'],t:'v1 und v2 antworten gleichzeitig',n:'Server 1 läuft mit v2 und bekommt wieder Anfragen. Ab jetzt laufen <b>beide Versionen gleichzeitig</b> – sie müssen also mit derselben Datenbank und denselben Schnittstellen zurechtkommen.'},
      {s:['v2','v2','v2','upd','v1','v1'],t:'v1 und v2 gemischt',n:'Schritt für Schritt weiter. Fällt dabei etwas auf, kann man anhalten.'},
      {s:['v2','v2','v2','v2','v2','v2'],t:'alle Anfragen an v2',n:'<b>Fertig.</b> Kein zusätzlicher Server nötig, keine Ausfallzeit. Nachteil: Zurückrollen dauert genauso lange wie Ausrollen.'}],
    bluegreen:[
      {s:['v1','v1','v1','idle','idle','idle'],t:'„Blau“ (v1) bekommt alle Anfragen',n:'Zwei komplette Umgebungen. Blau (links) ist live, Grün (rechts) steht leer bereit.'},
      {s:['v1','v1','v1','v2','v2','v2'],t:'Blau live, Grün wird getestet',n:'Version 2 wird vollständig in Grün installiert und getestet – ohne dass ein Nutzer etwas davon merkt.'},
      {s:['idle','idle','idle','v2','v2','v2'],t:'Umschalten: alle Anfragen an Grün (v2)',n:'<b>Ein Schalter im Lastverteiler</b>, und alle Anfragen gehen an Grün. Sofort, auf einen Schlag.'},
      {s:['v1','v1','v1','v2','v2','v2'],t:'Blau bleibt als Reserve stehen',n:'Blau läuft noch eine Weile weiter. Geht etwas schief, ist das <b>Zurückschalten genauso schnell</b>. Preis: doppelte Infrastruktur während des Wechsels.'}],
    canary:[
      {s:['v1','v1','v1','v1','v1','v1'],t:'alle Anfragen an v1',n:'Benannt nach den Kanarienvögeln, die Bergleute früher mit in die Grube nahmen – als Frühwarnung.'},
      {s:['v2','v1','v1','v1','v1','v1'],t:'5 % der Anfragen an v2',n:'Ein Server bekommt v2 und nur einen kleinen Teil der Anfragen. Jetzt <b>Fehlerraten und Antwortzeiten vergleichen</b>: v2 gegen v1, mit echten Nutzern.'},
      {s:['v2','v2','v1','v1','v1','v1'],t:'25 % an v2',n:'Die Messwerte sind unauffällig – der Anteil wird erhöht. Viele Systeme machen das automatisch und rollen bei Auffälligkeiten selbst zurück.'},
      {s:['v2','v2','v2','v2','v2','v2'],t:'100 % an v2',n:'<b>Fertig.</b> Ein Fehler in v2 hätte nur wenige Prozent der Nutzer getroffen, und nur kurz. Voraussetzung: gutes Monitoring, sonst sieht man nichts.'}]
  };
  let s='rolling',k=0;
  function draw(){const d=ST[s][k];
    $('srv').innerHTML=d.s.map((c,i)=>'<div class="'+c+'">'+(c==='idle'?'–':c==='upd'?'…':c)+'<small>Server '+(i+1)+'</small></div>').join('');
    $('trf').innerHTML='Datenverkehr: <b>'+d.t+'</b>';$('dpN').innerHTML=d.n;
    $('dpPrev').disabled=k===0;$('dpNext').textContent=k===ST[s].length-1?'Von vorn ↺':'Nächster Schritt →';}
  $('dpNext').addEventListener('click',()=>{k=k===ST[s].length-1?0:k+1;draw();});
  $('dpPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  const bs=[...document.querySelectorAll('#dpS button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;k=0;draw();}));
  draw();
})();
