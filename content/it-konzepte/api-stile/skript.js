// ---------- Vergleich ----------
(function(){
  const $=id=>document.getElementById(id);
  const S={
    rest:{calls:[
      ['GET /bestellungen/42','{\n  "id": 42, "datum": "2026-10-03",\n  "status": "versandt", "kundeId": 7,\n  <span class="x">"lieferadresse": {…}, "zahlart": "…",</span>\n  <span class="x">"rabatt": 0, "notizen": "…", …</span>\n}',780],
      ['GET /kunden/7','{\n  "id": 7, "name": "Anna",\n  <span class="x">"email": "…", "adressen": […],</span>\n  <span class="x">"kundeSeit": "…", …</span>\n}',640],
      ['GET /bestellungen/42/positionen','[\n  { "artikel": "Kaffee", "menge": 2, <span class="x">"ean": "…", …</span> },\n  { "artikel": "Tasse", "menge": 1, <span class="x">"ean": "…", …</span> }\n]',520]],
      seq:true,n:'<b>Drei Anfragen, mindestens zwei Rundreisen</b> – die Kundenabfrage braucht die <code>kundeId</code> aus der ersten Antwort, erst dann kann sie starten (Underfetching). Und jede Antwort enthält viel, was die App nicht braucht (Overfetching, durchgestrichen). Im Rechenzentrum egal, im Mobilfunknetz spürbar. Abhilfe in REST: ein eigener Endpunkt für diese Ansicht oder Parameter wie <code>?include=kunde,positionen</code>.'},
    grpc:{calls:[['rpc LadeBestellansicht(BestellId{id: 42})','<span class="c">// binär, Protobuf – lesbar dargestellt:</span>\nBestellansicht {\n  datum: "2026-10-03"\n  kunde_name: "Anna"\n  positionen: [ {artikel: "Kaffee"}, {artikel: "Tasse"} ]\n}',95]],
      seq:false,n:'<b>Ein Aufruf, binär, kompakt.</b> Dafür musste der Dienst eine eigene Methode <code>LadeBestellansicht</code> anbieten – maßgeschneidert für diesen Bildschirm. gRPC ist ideal, wenn Client und Server zum selben Team gehören und sich abstimmen. Über eine dauerhafte HTTP/2-Verbindung gibt es nicht einmal einen neuen Verbindungsaufbau.'},
    gql:{calls:[['POST /graphql','<span class="c">// Anfrage:</span>\n{ bestellung(id: 42) {\n    datum\n    kunde { name }\n    positionen { artikel }\n} }\n\n<span class="c">// Antwort: genau diese Felder</span>',210]],
      seq:false,n:'<b>Eine Anfrage, genau die gewünschten Felder.</b> Der Client bestimmt, was er braucht – eine andere Ansicht schickt einfach eine andere Abfrage, ohne dass das Backend sich ändert. Darum ist GraphQL bei Frontends mit vielen verschiedenen Bildschirmen beliebt.'}
  };
  let s='rest';
  function draw(){const d=S[s],rtt=$('vMob').checked?150:1;
    $('vC').innerHTML=d.calls.map((c,i)=>'<div class="call"><div class="lbl">Anfrage '+(i+1)+'</div><div class="code"><span class="k">'+c[0]+'</span></div><div class="code">'+c[1]+'</div></div>').join('');
    const n=d.calls.length,rounds=d.seq?2:1,bytes=d.calls.reduce((a,c)=>a+c[2],0),t=rounds*(rtt+(s==='grpc'?5:15));
    $('vSt').innerHTML='<div class="'+(n>1?'bad':'good')+'"><b>'+n+'</b>Anfragen</div><div><b>'+rounds+'</b>Rundreisen nacheinander</div><div class="'+(bytes>1000?'bad':'good')+'"><b>'+bytes.toLocaleString('de-DE')+' B</b>übertragen</div><div class="'+(t>200?'bad':'')+'"><b>'+t+' ms</b>Wartezeit, grob</div>';
    $('vN').innerHTML=d.n;}
  const bs=[...document.querySelectorAll('#vS button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;draw();}));
  $('vMob').addEventListener('change',draw);draw();
})();

// ---------- GraphQL-Felder ----------
(function(){
  const $=id=>document.getElementById(id);
  const F=[['b','datum','"2026-10-03"',true],['b','status','"versandt"',false],['b','summeCent','5990',false],['k','name','"Anna"',true],['k','email','"anna@example.com"',false],['p','artikel','',true],['p','menge','',false]];
  const POS=[{artikel:'"Kaffee"',menge:'2'},{artikel:'"Tasse"',menge:'1'}];
  $('gF').innerHTML='<div class="grp">bestellung</div>'+F.filter(f=>f[0]==='b').map(f=>'<label class="toggle"><input type="checkbox" data-f="'+f[1]+'"'+(f[3]?' checked':'')+'> '+f[1]+'</label>').join('')+
    '<div class="grp">kunde</div>'+F.filter(f=>f[0]==='k').map(f=>'<label class="toggle"><input type="checkbox" data-f="k.'+f[1]+'"'+(f[3]?' checked':'')+'> '+f[1]+'</label>').join('')+
    '<div class="grp">positionen</div>'+F.filter(f=>f[0]==='p').map(f=>'<label class="toggle"><input type="checkbox" data-f="p.'+f[1]+'"'+(f[3]?' checked':'')+'> '+f[1]+'</label>').join('');
  function draw(){
    const on=new Set([...document.querySelectorAll('#gF input')].filter(x=>x.checked).map(x=>x.dataset.f));
    const bF=F.filter(f=>f[0]==='b'&&on.has(f[1])),kF=F.filter(f=>f[0]==='k'&&on.has('k.'+f[1])),pF=F.filter(f=>f[0]==='p'&&on.has('p.'+f[1]));
    let q='<span class="k">query</span> {\n  bestellung(id: <span class="s">42</span>) {\n';bF.forEach(f=>q+='    '+f[1]+'\n');
    if(kF.length)q+='    kunde {'+kF.map(f=>' '+f[1]).join('')+' }\n';if(pF.length)q+='    positionen {'+pF.map(f=>' '+f[1]).join('')+' }\n';q+='  }\n}';
    if(!bF.length&&!kF.length&&!pF.length)q='<span class="c"># Mindestens ein Feld wählen –\n# eine leere Auswahl ist in GraphQL\n# nicht erlaubt.</span>';
    let r='{ <span class="g">"data"</span>: { <span class="g">"bestellung"</span>: {\n';const parts=[];
    bF.forEach(f=>parts.push('  "'+f[1]+'": <span class="s">'+f[2]+'</span>'));
    if(kF.length)parts.push('  "kunde": { '+kF.map(f=>'"'+f[1]+'": <span class="s">'+f[2]+'</span>').join(', ')+' }');
    if(pF.length)parts.push('  "positionen": [\n'+POS.map(p=>'    { '+pF.map(f=>'"'+f[1]+'": <span class="s">'+p[f[1]]+'</span>').join(', ')+' }').join(',\n')+'\n  ]');
    r+=parts.join(',\n')+'\n} } }';
    $('gQ').innerHTML=q;$('gR').innerHTML=parts.length?r:'';
    $('gN').innerHTML=parts.length?'Antwort: '+new TextEncoder().encode(r.replace(/<[^>]+>/g,'')).length+' Byte – genau die Form der Abfrage, nichts mehr. '+(kF.length?'Für den Kunden sorgt der Server selbst, der Client muss nicht wissen, dass Kunden woanders gespeichert sind.':''):'Wähle Felder aus.';
  }
  document.querySelectorAll('#gF input').forEach(x=>x.addEventListener('change',draw));draw();
})();

// ---------- Sync/Async ----------
(function(){
  const $=id=>document.getElementById(id);
  let s='sync';
  const D=[['Zahlung',60],['Lager',40],['Versand',80],['Mail',30]];
  function draw(){
    const slow=$('fSlow').checked,down=$('fDown').checked;
    const lat=D.map(d=>d[0]==='Lager'&&slow?2000:d[1]);
    let h='<defs><marker id="flA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker></defs>';
    const box=(x,y,w,t,sub,cls)=>'<rect class="bx '+(cls||'')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="44" rx="9"/><text class="t" x="'+(x+w/2)+'" y="'+(y+20)+'" text-anchor="middle">'+t+'</text><text class="s" x="'+(x+w/2)+'" y="'+(y+35)+'" text-anchor="middle">'+sub+'</text>';
    const cls=(name,i)=>name==='Mail'&&down?'bad':name==='Lager'&&slow?'slow':'ok';
    h+=box(10,98,120,'Kunde','klickt „Kaufen“','');
    if(s==='sync'){
      h+=box(170,98,130,'Bestelldienst','ruft alle auf',down?'bad':'ok');
      h+='<line class="ar" x1="130" y1="120" x2="168" y2="120" marker-end="url(#flA)"/>';
      D.forEach((d,i)=>{const y=10+i*58;h+=box(420,y,150,d[0],(d[0]==='Mail'&&down?'nicht erreichbar':lat[i]+' ms'),cls(d[0],i));
        h+='<path class="ar" d="M300 120 C360 120 360 '+(y+22)+' 418 '+(y+22)+'" marker-end="url(#flA)"/>';});
    }else{
      h+=box(150,98,120,'Bestelldienst','speichert, meldet',"ok");
      h+=box(300,98,100,'Vermittler','Kafka o. ä.','q');
      h+='<line class="ar" x1="130" y1="120" x2="148" y2="120" marker-end="url(#flA)"/><line class="ar" x1="270" y1="120" x2="298" y2="120" marker-end="url(#flA)"/>';
      D.forEach((d,i)=>{const y=10+i*58;h+=box(450,y,140,d[0],(d[0]==='Mail'&&down?'aus – Nachricht wartet':'liest, wenn bereit'),cls(d[0],i));
        h+='<path class="ar" d="M400 120 C425 120 425 '+(y+22)+' 448 '+(y+22)+'" marker-end="url(#flA)"/>';});
    }
    $('flow').innerHTML=h;
    const r=$('fR');
    if(s==='sync'){const t=lat.reduce((a,b)=>a+b,0)+20;
      if(down){r.className='res bad';r.innerHTML='<b>Bestellung gescheitert.</b> Zahlung und Lager waren schon durch, aber der Mail-Dienst antwortet nicht – der Bestelldienst meldet einen Fehler. Jetzt muss er die Zahlung zurückbuchen und den Lagerbestand freigeben. Eine Bestätigungsmail ist das Unwichtigste daran – und hat alles verhindert.';}
      else{r.className='res '+(slow?'warn':'ok');r.innerHTML='<b>Antwort nach '+t.toLocaleString('de-DE')+' ms</b> – die Summe aller Aufrufe. '+(slow?'Ein einziger langsamer Dienst bremst die ganze Kette. Und während der Bestelldienst wartet, belegt er einen Thread und eine Verbindung.':'Funktioniert. Einfach zu verstehen, einfach zu debuggen – solange alle Dienste da sind.');}}
    else{r.className='res '+(down||slow?'warn':'ok');
      r.innerHTML='<b>Antwort nach rund 40 ms:</b> „Bestellung angenommen.“ Der Bestelldienst hat gespeichert und ein Ereignis veröffentlicht – mehr nicht. '+(down?'Der Mail-Dienst ist aus, aber das stört niemanden: Die Nachricht wartet im Vermittler, und die Mail geht raus, sobald er wieder läuft. ':'')+(slow?'Das langsame Lager arbeitet in seinem eigenen Tempo, ohne den Kunden warten zu lassen. ':'')+'Preis: Der Kunde sieht „angenommen“, bevor das Lager bestätigt hat – schlägt dort etwas fehl, muss nachträglich reagiert werden.';}
  }
  const bs=[...document.querySelectorAll('#fS button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;draw();}));
  $('fSlow').addEventListener('change',draw);$('fDown').addEventListener('change',draw);draw();
})();
