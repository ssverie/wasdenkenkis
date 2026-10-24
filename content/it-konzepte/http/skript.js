// ---------- Baukasten ----------
(function(){
  const $=id=>document.getElementById(id);
  const ORDER='{"id":42,"status":"versandt","summe":"59.90"}';
  function line(k,v){return '<span class="h">'+k+':</span> <span class="v">'+v+'</span>\n';}
  function st(code,txt){const c=code<300?'ok':code<400?'rd':'er';return 'HTTP/1.1 <span class="'+c+'">'+code+' '+txt+'</span>\n';}
  function draw(){
    const m=$('rbM').value,p=$('rbP').value,auth=$('rbAuth').checked,etag=$('rbEtag').checked,xml=$('rbXml').checked;
    const coll=p==='/api/bestellungen',exists=p.endsWith('/42');
    let rq='<span class="m">'+m+'</span> '+p+' HTTP/1.1\n'+line('Host','shop.example.com')+line('Accept',xml?'application/xml':'application/json');
    if(auth)rq+=line('Authorization','Bearer eyJhbGciOi…');
    if(etag)rq+=line('If-None-Match','"v7"');
    const body=(m==='POST'||m==='PUT');
    if(body){rq+=line('Content-Type','application/json')+'\n{"artikel":[17,23],"menge":1}';}
    let rs,n;
    if(xml){rs=st(406,'Not Acceptable')+line('Content-Type','application/problem+json')+'\n{"title":"Nur JSON verfügbar"}';n='<b>406:</b> Der Client will XML, der Server kann nur JSON. Über <code>Accept</code> verhandeln Client und Server das Format – hier ohne Einigung.';}
    else if(coll&&(m==='DELETE'||m==='PUT')){rs=st(405,'Method Not Allowed')+line('Allow','GET, POST');n='<b>405:</b> Die ganze Sammlung auf einmal löschen oder ersetzen ist nicht vorgesehen. Der <code>Allow</code>-Header sagt, was geht.';}
    else if(m!=='GET'&&!auth){rs=st(401,'Unauthorized')+line('WWW-Authenticate','Bearer');n='<b>401:</b> Ändern darf nur, wer sich ausweist. Der Name ist historisch irreführend: 401 heißt „nicht angemeldet“, 403 hieße „angemeldet, aber nicht berechtigt“.';}
    else if(m==='GET'&&coll){rs=st(200,'OK')+line('Content-Type','application/json')+line('Cache-Control','max-age=30')+'\n[{"id":41,…},{"id":42,…}]';n='<b>200:</b> Die Sammlung. Bei großen Mengen würde man seitenweise ausliefern, etwa mit <code>?seite=2</code>.';}
    else if(m==='GET'&&!exists){rs=st(404,'Not Found')+line('Content-Type','application/problem+json')+'\n{"title":"Bestellung 99 gibt es nicht"}';n='<b>404:</b> Die Ressource existiert nicht. Der Fehler-Body im Format <code>application/problem+json</code> ist ein Standard (RFC 9457) – Spring kann ihn direkt erzeugen.';}
    else if(m==='GET'&&etag){rs=st(304,'Not Modified')+line('ETag','"v7"')+line('Cache-Control','max-age=60');n='<b>304:</b> Der Client hat Version <code>"v7"</code> schon, und die ist aktuell. Kein Body – der Client nimmt seine Kopie. Bei großen Antworten spart das viel.';}
    else if(m==='GET'){rs=st(200,'OK')+line('Content-Type','application/json')+line('ETag','"v7"')+line('Cache-Control','max-age=60')+'\n'+ORDER;n='<b>200:</b> Hier ist die Bestellung. Das <code>ETag</code> ist ihr Versionsstempel – schick es beim nächsten Mal mit <code>If-None-Match</code> zurück.';}
    else if(m==='POST'&&coll){rs=st(201,'Created')+line('Location','/api/bestellungen/43')+line('Content-Type','application/json')+'\n{"id":43,"status":"neu"}';n='<b>201:</b> Neue Bestellung angelegt, ihre Adresse steht im <code>Location</code>-Header. Schickst du denselben POST noch einmal, entsteht Bestellung 44 – POST ist nicht idempotent.';}
    else if(m==='POST'){rs=st(405,'Method Not Allowed')+line('Allow','GET, PUT, DELETE');n='<b>405:</b> Auf eine einzelne Bestellung kann man nichts „posten“. Neue Bestellungen gehen an die Sammlung <code>/api/bestellungen</code>.';}
    else if(m==='PUT'){rs=st(exists?200:201,exists?'OK':'Created')+line('ETag',exists?'"v8"':'"v1"');n=exists?'<b>200:</b> Bestellung 42 vollständig ersetzt, neue Version <code>"v8"</code>. Noch einmal dasselbe PUT? Gleicher Endzustand – PUT ist idempotent.':'<b>201:</b> Mit PUT legt der Client eine Ressource unter einer Adresse an, die er selbst bestimmt. Noch einmal gesendet, ändert sich nichts mehr.';}
    else if(m==='DELETE'){rs=exists?st(204,'No Content'):st(404,'Not Found');n=exists?'<b>204:</b> Gelöscht, kein Inhalt zurück. Ein zweites DELETE liefert 404 – der Zustand ist aber derselbe: Die Bestellung ist weg. Auch das zählt als idempotent.':'<b>404:</b> Was es nicht gibt, kann man nicht löschen.';}
    $('rbReq').innerHTML='<span class="c"># Anfrage</span>\n'+rq;$('rbRes').innerHTML='<span class="c"># Antwort</span>\n'+rs;$('rbNote').innerHTML=n;
  }
  ['rbM','rbP','rbAuth','rbEtag','rbXml'].forEach(id=>$(id).addEventListener('change',draw));draw();
})();

// ---------- Statuscodes ----------
(function(){
  const C=[
    [101,'Switching Protocols','Die Verbindung wechselt das Protokoll – typischerweise zu WebSocket.'],
    [200,'OK','Alles gut, hier ist die Antwort.'],
    [201,'Created','Etwas wurde neu angelegt. Wo, steht im Location-Header.'],
    [204,'No Content','Erledigt, aber es gibt nichts zurückzuschicken – typisch nach DELETE.'],
    [301,'Moved Permanently','Dauerhaft umgezogen. Browser und Suchmaschinen merken sich die neue Adresse.'],
    [302,'Found','Vorübergehend woanders. Klassisch nach dem Login: „Weiter zur Startseite.“'],
    [304,'Not Modified','Deine zwischengespeicherte Version ist aktuell. Kein Body.'],
    [400,'Bad Request','Die Anfrage ist kaputt – falsches JSON, fehlendes Pflichtfeld.'],
    [401,'Unauthorized','Nicht angemeldet. Trotz des Namens geht es um Authentifizierung: Wer bist du?'],
    [403,'Forbidden','Angemeldet, aber nicht berechtigt. Hier geht es um Autorisierung: Was darfst du?'],
    [404,'Not Found','Gibt es nicht. Manche Server antworten so auch, um zu verschweigen, dass es etwas gibt, das man nicht sehen darf.'],
    [409,'Conflict','Widerspricht dem aktuellen Zustand – etwa weil jemand anderes die Ressource inzwischen geändert hat.'],
    [429,'Too Many Requests','Zu viele Anfragen in zu kurzer Zeit. Der Retry-After-Header sagt, wann man wieder darf.'],
    [500,'Internal Server Error','Im Server ist etwas schiefgegangen – oft eine unbehandelte Exception.'],
    [502,'Bad Gateway','Ein Proxy oder Loadbalancer hat vom Server dahinter Unsinn oder nichts bekommen.'],
    [503,'Service Unavailable','Überlastet oder in Wartung. Später wiederkommen.'],
    [504,'Gateway Timeout','Ein Proxy hat zu lange auf den Server dahinter gewartet.']
  ];
  const box=document.getElementById('codes'),info=document.getElementById('codeInfo');
  box.innerHTML=C.map((c,i)=>'<button class="k'+String(c[0])[0]+'" data-i="'+i+'">'+c[0]+'</button>').join('');
  const bs=[...box.querySelectorAll('button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');const c=C[+b.dataset.i];
    info.innerHTML='<b>'+c[0]+' '+c[1]+'</b>'+c[2];}));
})();

// ---------- Wasserfall ----------
(function(){
  const $=id=>document.getElementById(id);
  let v='h2';
  function sim(ver,rtt,loss){
    const F=12,res=[];
    for(let i=0;i<F;i++){
      let su,start,end,stall=0;
      if(ver==='h1'){su=2;const conn=i%6,round=Math.floor(i/6);start=su+round;end=start+1;
        if(loss&&conn===2&&i>=2){stall=1;}  // nur diese Verbindung
      }else if(ver==='h2'){su=2;start=2;end=3;if(loss)stall=1;}  // ein TCP-Strom: alle warten
      else{su=1;start=1;end=2;if(loss&&i===2)stall=1;}           // QUIC: nur Strom 3
      // bei h1: Verlust in Datei 3 verzögert auch Datei 9 (gleiche Verbindung, danach)
      if(ver==='h1'&&loss&&i===8){start+=1;end+=1;stall=0;}
      res.push({su:su*rtt,start:start*rtt,end:end*rtt,stall:stall*rtt});
    }
    return res;
  }
  function total(r){return Math.max(...r.map(x=>x.end+x.stall));}
  function draw(){
    const rtt=+$('wfRtt').value,loss=$('wfLoss').checked;$('wfRttO').textContent=rtt+' ms';
    const r=sim(v,rtt,loss),all={h1:total(sim('h1',rtt,loss)),h2:total(sim('h2',rtt,loss)),h3:total(sim('h3',rtt,loss))};
    const max=Math.max(all.h1,all.h2,all.h3);
    const pc=x=>(100*x/max).toFixed(2)+'%';
    $('wf').innerHTML=r.map((x,i)=>'<div class="wr"><span>Datei '+(i+1)+'</span><div class="wt"><i class="su" style="left:0;width:'+pc(x.su)+'"></i><i class="rq" style="left:'+pc(x.start)+';width:'+pc(x.end-x.start)+'"></i>'+(x.stall?'<i class="st" style="left:'+pc(x.end)+';width:'+pc(x.stall)+'"></i>':'')+'</div></div>').join('');
    const L={h1:'HTTP/1.1',h2:'HTTP/2',h3:'HTTP/3'};
    $('wsum').innerHTML=['h1','h2','h3'].map(k=>'<div class="'+(k===v?'on':'')+'"><b>'+all[k]+' ms</b>'+L[k]+'</div>').join('');
    let n;
    if(v==='h1') n='Sechs Verbindungen, jede mit eigenem Handshake. Auf jeder geht nur eine Anfrage zur Zeit, also kommen die Dateien 7 bis 12 erst in der zweiten Runde dran.'+(loss?' Der Verlust trifft nur Verbindung 3 – dort warten Datei 3 und die danach auf derselben Verbindung, Datei 9.':'');
    else if(v==='h2') n='Eine Verbindung, ein Handshake, alle zwölf Anfragen gleichzeitig. '+(loss?'<b>Aber:</b> TCP liefert strikt in Reihenfolge. Fehlt ein Paket von Datei 3, warten <em>alle</em> Dateien, deren Daten danach kamen, bis es neu gesendet ist – Head-of-Line-Blocking.':'Ohne Verluste deutlich schneller als HTTP/1.1.');
    else n='QUIC spart beim Aufbau eine Rundreise, weil Verbindung und Verschlüsselung gemeinsam ausgehandelt werden. '+(loss?'Und weil QUIC jeden Datenstrom einzeln verwaltet, wartet bei einem Verlust nur Datei 3.':'Schalte den Paketverlust ein, um den zweiten Vorteil zu sehen.');
    $('wfNote').innerHTML=n;
  }
  const bs=[...document.querySelectorAll('#wfV button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');v=b.dataset.v;draw();}));
  $('wfLoss').addEventListener('change',draw);$('wfRtt').addEventListener('input',draw);draw();
})();
