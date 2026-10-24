// ---------- Kette ----------
(function(){
  const $=id=>document.getElementById(id);
  const NAMES=['Gateway','Bestellung','Kunde','Katalog','Preis','Lager','Zahlung','Versand','Rechnung','Benachrichtigung'];
  function draw(){const n=+$('chN').value;$('chNo').textContent=n;
    $('chC').innerHTML=NAMES.slice(0,n).map(x=>'<span>'+x+'</span>').join('<i>→</i>');
    const lat=n*2,av=Math.pow(0.999,n),down=(1-av)*8760;
    $('chCmp').innerHTML='<div><h4>Als Monolith</h4><dl><dt>Aufrufe übers Netz</dt><dd>0</dd><dt>Zusatzzeit</dt><dd>&lt; 0,001 ms</dd><dt>Verfügbarkeit der Kette</dt><dd>99,90 %</dd><dt>Ausfall pro Jahr</dt><dd>9 h</dd></dl></div>'+
      '<div><h4>Als Microservices</h4><dl><dt>Aufrufe übers Netz</dt><dd>'+n+'</dd><dt>Zusatzzeit</dt><dd class="'+(lat>10?'bad':'')+'">'+lat+' ms</dd><dt>Verfügbarkeit der Kette</dt><dd class="'+(av<0.996?'bad':'')+'">'+(av*100).toFixed(2).replace('.',',')+' %</dd><dt>Ausfall pro Jahr</dt><dd class="'+(down>30?'bad':'')+'">'+Math.round(down)+' h</dd></dl></div>';
    $('chNote').innerHTML=n===1?'Ein Dienst: kaum Unterschied – außer dass er über das Netz erreichbar ist.':'Bei '+n+' Diensten in Folge ist die Kette nur verfügbar, wenn <em>alle</em> es sind. Aus 9 Stunden Ausfall pro Jahr werden '+Math.round(down)+'. Und jeder Aufruf kann zusätzlich an Timeouts, Netzproblemen und Versionskonflikten scheitern, die es im Monolithen gar nicht gibt.';}
  $('chN').addEventListener('input',draw);draw();
})();

// ---------- Schnitt ----------
(function(){
  const $=id=>document.getElementById(id);
  const CUT={
    tech:[{n:'Web-Dienst',m:['Bestell-Seite','Katalog-Seite','Kasse','Konto']},{n:'Logik-Dienst',m:['Bestellregeln','Preise & Rabatte','Zahlungslogik','Versandlogik']},{n:'Daten-Dienst',m:['Bestell-Tabellen','Katalog-Tabellen','Zahlungs-Tabellen','Kunden-Tabellen']}],
    fach:[{n:'Bestellung',m:['Bestell-Seite','Kasse','Bestellregeln','Bestell-Tabellen']},{n:'Katalog',m:['Katalog-Seite','Preise & Rabatte','Katalog-Tabellen']},{n:'Zahlung',m:['Zahlungslogik','Zahlungs-Tabellen','Konto']}]
  };
  const CH={feld:['Bestell-Seite','Bestellregeln','Bestell-Tabellen'],zahl:['Kasse','Zahlungslogik','Zahlungs-Tabellen'],rabatt:['Katalog-Seite','Preise & Rabatte','Katalog-Tabellen']};
  let s='fach',c='feld';
  function draw(){const cut=CUT[s],ch=CH[c];
    $('ctSv').style.gridTemplateColumns='repeat('+cut.length+',minmax(0,1fr))';
    let hit=0;
    $('ctSv').innerHTML=cut.map(sv=>{const h=sv.m.some(m=>ch.includes(m));if(h)hit++;return '<div class="svc'+(h?' hit':'')+'"><b>'+sv.n+'</b><div class="mods">'+sv.m.map(m=>'<span class="'+(ch.includes(m)?'hit':'')+'">'+m+'</span>').join('')+'</div></div>';}).join('');
    $('ctSt').innerHTML='<div class="'+(hit>1?'bad':'good')+'"><b>'+hit+' von '+cut.length+'</b>Diensten ändern</div><div class="'+(hit>1?'bad':'good')+'"><b>'+hit+'</b>Teams abstimmen</div><div class="'+(hit>1?'bad':'good')+'"><b>'+(hit>1?'gemeinsam':'einzeln')+'</b>ausliefern</div>';
    $('ctN').innerHTML=s==='tech'?'<b>Jede fachliche Änderung geht quer durch alle Schichten</b> – also durch alle Dienste. Drei Teams müssen sich abstimmen, drei Schnittstellen ändern sich, und am Ende müssen alle gleichzeitig ausgeliefert werden. Das ist ein verteilter Monolith.':'<b>Die Änderung bleibt in einem Dienst.</b> Ein Team ändert Oberfläche, Logik und Daten seines Bereichs und liefert aus, ohne jemanden zu fragen. Genau dafür macht man Microservices.';}
  function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);draw();}));}
  seg('ctS',d=>s=d.s);seg('ctC',d=>c=d.c);draw();
})();

// ---------- Entscheidung ----------
(function(){
  const $=id=>document.getElementById(id);
  const Q=[['Arbeiten mehr als drei Teams gleichzeitig am System?',2],['Sind die fachlichen Bereiche klar und stabil – kennt ihr die Grenzen?',2],['Brauchen einzelne Teile sehr unterschiedliche Skalierung oder Verfügbarkeit?',1],['Gibt es schon Erfahrung mit Container-Betrieb, Tracing und automatisierten Pipelines?',2],['Behindern sich Teams heute gegenseitig beim Ausliefern?',1]];
  const A=Q.map(()=>false);
  $('dq').innerHTML=Q.map((q,i)=>'<div class="q"><span>'+q[0]+'</span><span class="yn" data-i="'+i+'"><button data-v="1">Ja</button><button data-v="0" aria-pressed="true">Nein</button></span></div>').join('');
  function draw(){const sc=Q.reduce((a,q,i)=>a+(A[i]?q[1]:0),0),max=Q.reduce((a,q)=>a+q[1],0);const v=$('dv');
    if(sc<=3){v.className='verdict mono';v.innerHTML='<b>Ein Monolith – sauber in Module gegliedert.</b> Die Kosten von Microservices würden den Nutzen bei Weitem übersteigen. Mit klaren Modulgrenzen bleibt die spätere Aufteilung offen.';}
    else if(sc<=6){v.className='verdict mid';v.innerHTML='<b>Modularer Monolith, gezielt ergänzt.</b> Einzelne Teile mit besonderem Bedarf – andere Skalierung, eigenes Team – können als eigener Dienst herausgelöst werden. Nicht alles auf einmal.';}
    else{v.className='verdict ms';v.innerHTML='<b>Microservices können sich lohnen.</b> Viele Teams, klare Grenzen, Betriebserfahrung – das sind die Voraussetzungen. Trotzdem: fachlich schneiden, Daten pro Dienst, und lange synchrone Ketten vermeiden.';}}
  document.querySelectorAll('#dq .yn').forEach(g=>{const bs=[...g.querySelectorAll('button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');A[+g.dataset.i]=b.dataset.v==='1';draw();}));});
  draw();
})();
