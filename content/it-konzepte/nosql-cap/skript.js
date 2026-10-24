// ---------- Datenmodelle ----------
(function(){
  const $=id=>document.getElementById(id);
  const M={
    rel:{d:'<h4>Drei Tabellen</h4><div class="code">kunde        <span class="c">id | name</span>\n             1  | Anna\n\nbestellung   <span class="c">id  | kunde_id | summe</span>\n             101 | 1        | 59.90\n             102 | 1        | 12.50</div>',
      f:'<p><b>Abfrage:</b> <code>SELECT … FROM kunde JOIN bestellung …</code></p><p class="pro">✓ beliebige Abfragen, JOINs, Transaktionen, keine doppelten Daten</p><p class="con">✗ schwer auf viele Rechner zu verteilen</p><p class="ex">PostgreSQL, MySQL, Oracle, SQL Server</p>'},
    kv:{d:'<h4>Schlüssel → Wert</h4><div class="code"><span class="g">kunde:1</span>              → <span class="s">"{name: Anna, …}"</span>\n<span class="g">kunde:1:bestellungen</span> → <span class="s">[101, 102]</span>\n<span class="g">bestellung:101</span>       → <span class="s">"{summe: 59.90}"</span>\n<span class="g">sitzung:a81f</span>         → <span class="s">1</span>  <span class="c">(läuft in 30 min ab)</span></div>',
      f:'<p><b>Abfrage:</b> <code>GET kunde:1</code> – nur über den Schlüssel.</p><p class="pro">✓ extrem schnell, trivial zu verteilen, oft komplett im Speicher</p><p class="con">✗ keine Suche nach Inhalten: „alle Kunden aus Köln“ geht nicht</p><p class="ex">Redis, Valkey, Amazon DynamoDB, etcd</p>'},
    doc:{d:'<h4>Ein Dokument pro Kunde</h4><div class="code">{\n  <span class="g">"_id"</span>: <span class="s">"1"</span>,\n  <span class="g">"name"</span>: <span class="s">"Anna"</span>,\n  <span class="g">"bestellungen"</span>: [\n    { <span class="g">"nr"</span>: 101, <span class="g">"summe"</span>: 59.90 },\n    { <span class="g">"nr"</span>: 102, <span class="g">"summe"</span>: 12.50 }\n  ]\n}</div>',
      f:'<p><b>Abfrage:</b> <code>db.kunden.find({name: "Anna"})</code> – auch nach Feldern im Inneren.</p><p class="pro">✓ ein Lesezugriff liefert alles, flexible Struktur, passt zu Objekten im Code</p><p class="con">✗ Daten, die in vielen Dokumenten vorkommen, liegen doppelt; Auswertungen quer über alle Bestellungen sind umständlich</p><p class="ex">MongoDB, Couchbase, jsonb in PostgreSQL</p>'},
    col:{d:'<h4>Zeilen nach Partitionsschlüssel, sortiert</h4><div class="code"><span class="c">partition: kunde_id = 1</span>\n  <span class="g">2026-10-03</span> │ bestellung=101 │ summe=59.90\n  <span class="g">2026-10-15</span> │ bestellung=102 │ summe=12.50\n<span class="c">partition: kunde_id = 2</span>\n  <span class="g">2026-10-20</span> │ bestellung=103 │ summe=8.00</div>',
      f:'<p><b>Abfrage:</b> <code>SELECT … WHERE kunde_id = 1 AND datum > …</code> – nur über den Partitionsschlüssel.</p><p class="pro">✓ gewaltige Schreiblast, linear skalierbar über Hunderte Rechner, gut für Zeitreihen</p><p class="con">✗ man muss die Abfragen vorher kennen; für eine neue Abfrage oft eine neue Tabelle</p><p class="ex">Apache Cassandra, ScyllaDB, Google Bigtable</p>'},
    gr:{d:'<h4>Knoten und Kanten</h4><svg id="graph" viewBox="0 0 340 170"><line class="e" x1="70" y1="85" x2="200" y2="40"/><line class="e" x1="70" y1="85" x2="200" y2="130"/><line class="e" x1="200" y1="40" x2="300" y2="85"/><line class="e" x1="200" y1="130" x2="300" y2="85"/><text class="el" x="105" y="52">BESTELLT</text><text class="el" x="105" y="128">BESTELLT</text><text class="el" x="232" y="52">ENTHÄLT</text><text class="el" x="232" y="124">ENTHÄLT</text><circle class="n" cx="70" cy="85" r="30"/><text class="t" x="70" y="89" text-anchor="middle">Anna</text><circle class="n2" cx="200" cy="40" r="24"/><text class="t" x="200" y="44" text-anchor="middle">#101</text><circle class="n2" cx="200" cy="130" r="24"/><text class="t" x="200" y="134" text-anchor="middle">#102</text><circle class="n" cx="300" cy="85" r="30"/><text class="t" x="300" y="89" text-anchor="middle">Kaffee</text></svg>',
      f:'<p><b>Abfrage:</b> <code>MATCH (a:Kunde)-[:BESTELLT]->()-[:ENTHÄLT]->(x)&lt;-[:ENTHÄLT]-()&lt;-[:BESTELLT]-(andere) RETURN andere</code> – „Wer hat dasselbe gekauft wie Anna?“</p><p class="pro">✓ Wege über viele Beziehungen, die in SQL lange JOIN-Ketten bräuchten</p><p class="con">✗ für einfache Listen und Summen überdimensioniert, schwer zu verteilen</p><p class="ex">Neo4j, Amazon Neptune</p>'}
  };
  let m='kv';
  function draw(){$('mData').innerHTML=M[m].d;$('mFit').innerHTML=M[m].f;}
  const bs=[...document.querySelectorAll('#mSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;draw();}));
  draw();
})();

// ---------- Sharding ----------
(function(){
  const $=id=>document.getElementById(id);
  const fnv=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
    // Nachmischen für bessere Verteilung
    h^=h>>>16;h=Math.imul(h,0x85ebca6b)>>>0;h^=h>>>13;h=Math.imul(h,0xc2b2ae35)>>>0;h^=h>>>16;return h>>>0;};
  const KEYS=[...Array(1000)].map((_,i)=>'kunde:'+(i+1));
  const KH=KEYS.map(fnv);
  const COLORS=['#2f5bd3','#b4540a','#15803d','#8b3fb8','#0e7490','#be123c'];
  let n=3,prevMod=null,prevCon=null;
  function ring(k){const pts=[];for(let r=0;r<k;r++)for(let v=0;v<100;v++)pts.push([fnv('rechner'+r+'#'+v),r]);return pts.sort((a,b)=>a[0]-b[0]);}
  function assignCon(k){const R=ring(k),hs=R.map(p=>p[0]);
    return KH.map(h=>{let lo=0,hi=hs.length;while(lo<hi){const mid=(lo+hi)>>1;if(hs[mid]<h)lo=mid+1;else hi=mid;}return R[lo%R.length][1];});}
  function assignMod(k){return KH.map(h=>h%k);}
  function bars(a,k){const c=Array(k).fill(0);a.forEach(x=>c[x]++);const mx=Math.max(...c);
    return c.map((v,i)=>'<div class="br"><span>Rechner '+(i+1)+'</span><div class="tr"><div class="fl" style="width:'+(100*v/Math.max(mx,400)).toFixed(1)+'%;background:'+COLORS[i]+'"></div></div><span>'+v+'</span></div>').join('');}
  function moved(a,b){if(!b)return null;let m=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])m++;return m;}
  function draw(changed){
    const am=assignMod(n),ac=assignCon(n);
    $('shMod').innerHTML=bars(am,n);$('shCon').innerHTML=bars(ac,n);
    const mm=changed?moved(am,prevMod):null,mc=changed?moved(ac,prevCon):null;
    $('mvMod').className='moved'+(mm!==null?' bad':'');$('mvCon').className='moved'+(mc!==null?' good':'');
    $('mvMod').innerHTML=mm===null?'<b>–</b>umgezogen':'<b>'+mm+' von 1000</b>Kunden müssen umziehen';
    $('mvCon').innerHTML=mc===null?'<b>–</b>umgezogen':'<b>'+mc+' von 1000</b>Kunden müssen umziehen';
    $('shN').textContent=n+' Rechner';
    $('shNote').innerHTML=mm===null?'Füge einen Rechner hinzu und vergleiche, wie viele Datensätze den Ort wechseln müssen.':
      'Mit „mod Anzahl“ ändert sich das Ziel für die meisten Schlüssel – rund '+Math.round(mm/10)+' % der Daten wandern über das Netz, während das System eigentlich weiterlaufen soll. Mit Consistent Hashing sind es rund '+Math.round(mc/10)+' % – im Idealfall genau der Anteil, den der neue oder entfernte Rechner trägt.';
    $('shAdd').disabled=n>=6;$('shDel').disabled=n<=2;
    prevMod=am;prevCon=ac;
  }
  $('shAdd').addEventListener('click',()=>{if(n<6){n++;draw(true);}});
  $('shDel').addEventListener('click',()=>{if(n>2){n--;draw(true);}});
  draw(false);
})();

// ---------- CAP ----------
(function(){
  const $=id=>document.getElementById(id);
  const P={A:[110,60],B:[110,175],C:[400,118]};
  const STEPS={
    cp:[
      {cut:0,v:{A:10,B:10,C:10},st:{},t:'Drei Kopien desselben Datensatzes: Preis = 10. Alle verbunden, alles stimmt.',c:''},
      {cut:1,v:{A:10,B:10,C:10},st:{},t:'<b>Das Netz reißt.</b> C ist von A und B abgeschnitten. Keiner der Rechner ist kaputt – sie können sich nur nicht mehr erreichen.',c:'warn'},
      {cut:1,v:{A:12,B:12,C:10},st:{A:'schreibt',B:'bestätigt'},t:'Ein Kunde ändert bei A den Preis auf 12. A und B sind zusammen die <b>Mehrheit</b> (2 von 3) – das Schreiben gilt.',c:'ok'},
      {cut:1,v:{A:12,B:12,C:10},st:{C:'verweigert'},t:'Ein anderer Kunde liest bei C. C weiß: Ich bin in der Minderheit, mein Stand könnte veraltet sein. <b>C antwortet mit einem Fehler.</b> Konsistent – aber für diesen Kunden nicht verfügbar.',c:'err'},
      {cut:0,v:{A:12,B:12,C:12},st:{C:'holt nach'},t:'Das Netz ist wieder da. C holt die Änderung nach. Zu keinem Zeitpunkt hat jemand einen falschen Wert gesehen.',c:'ok'}],
    ap:[
      {cut:0,v:{A:10,B:10,C:10},st:{},t:'Drei Kopien desselben Datensatzes: Preis = 10. Alle verbunden, alles stimmt.',c:''},
      {cut:1,v:{A:10,B:10,C:10},st:{},t:'<b>Das Netz reißt.</b> C ist von A und B abgeschnitten.',c:'warn'},
      {cut:1,v:{A:12,B:12,C:10},st:{A:'schreibt',B:'übernimmt'},t:'Ein Kunde ändert bei A den Preis auf 12. A und B übernehmen das.',c:'ok'},
      {cut:1,v:{A:12,B:12,C:10},st:{C:'antwortet'},t:'Ein anderer Kunde liest bei C. C antwortet sofort: <b>Preis = 10</b>. Verfügbar – aber veraltet.',c:'warn'},
      {cut:1,v:{A:12,B:12,C:11},st:{C:'schreibt'},t:'Und jetzt ändert jemand bei C den Preis auf 11. C nimmt das an – es ist ja verfügbar. Jetzt gibt es <b>zwei verschiedene Wahrheiten</b>.',c:'err'},
      {cut:0,v:{A:11,B:11,C:11},st:{A:'überschrieben',B:'überschrieben'},t:'Das Netz ist wieder da, die Kopien gleichen sich an: <b>Eventual Consistency</b>. Aber welcher Wert gewinnt? Bei „Last write wins“ der zeitlich spätere – die 11. Die Änderung auf 12 ist verloren, ohne dass es jemand gemerkt hat. Bessere Systeme bewahren beide Versionen auf oder benutzen Datentypen, die sich automatisch zusammenführen lassen (CRDTs).',c:'warn'}]
  };
  let m='cp',k=0;
  function draw(){
    const S=STEPS[m],s=S[k];
    let h='';
    const L=(a,b)=>'<line class="'+(s.cut&&(a==='C'||b==='C')?'cut':'lk')+'" x1="'+P[a][0]+'" y1="'+P[a][1]+'" x2="'+P[b][0]+'" y2="'+P[b][1]+'"/>';
    h+=L('A','B')+L('A','C')+L('B','C');
    if(s.cut)h+='<text x="262" y="30" text-anchor="middle" style="font:700 13px var(--sans);fill:var(--bad)">⚡ Netz unterbrochen</text>';
    Object.entries(P).forEach(([n,p])=>{const v=s.v[n],cur=v!==10?(v===12?'var(--accent)':'var(--accent-2)'):'var(--muted)';
      h+='<circle class="nd" cx="'+p[0]+'" cy="'+p[1]+'" r="40" fill="var(--card)" stroke="'+cur+'"/><text class="t" x="'+p[0]+'" y="'+(p[1]-12)+'" text-anchor="middle">'+n+'</text><text class="v" x="'+p[0]+'" y="'+(p[1]+14)+'" text-anchor="middle" fill="'+cur+'">'+v+'</text>';
      if(s.st[n])h+='<text class="s" x="'+p[0]+'" y="'+(p[1]+56)+'" text-anchor="middle">'+s.st[n]+'</text>';});
    $('capsvg').innerHTML=h;$('capLog').className='cap-log '+s.c;$('capLog').innerHTML='<b>Schritt '+(k+1)+'/'+S.length+':</b> '+s.t;
    $('capPrev').disabled=k===0;$('capNext').textContent=k===S.length-1?'Von vorn ↺':'Weiter →';
  }
  $('capNext').addEventListener('click',()=>{const S=STEPS[m];k=k===S.length-1?0:k+1;draw();});
  $('capPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  const bs=[...document.querySelectorAll('#capMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;k=0;draw();}));
  draw();
})();

// ---------- Quorum ----------
(function(){
  const $=id=>document.getElementById(id);
  function draw(){
    const N=+$('qN').value;$('qW').max=N;$('qR').max=N;
    const W=Math.min(+$('qW').value,N),R=Math.min(+$('qR').value,N);
    $('qNo').textContent=N;$('qWo').textContent=W;$('qRo').textContent=R;
    // ungünstigster Fall: Schreiben erreicht die ersten W, Lesen fragt die letzten R
    let h='';for(let i=0;i<N;i++){const w=i<W,r=i>=N-R;h+='<div class="rep'+(w?' w':'')+(r?' r':'')+'">'+(w&&r?'✓':'K'+(i+1))+'</div>';}
    $('qRow').innerHTML=h;
    const ok=R+W>N;
    $('qOut').className='q-out '+(ok?'good':'bad');
    $('qOut').innerHTML=(ok?'<b>R + W = '+(R+W)+' &gt; '+N+':</b> Mindestens eine gefragte Kopie hat das neueste Schreiben – Lesen ist immer aktuell.':'<b>R + W = '+(R+W)+' ≤ '+N+':</b> Im ungünstigsten Fall fragt das Lesen nur Kopien, die das neueste Schreiben noch nicht haben – es kann veraltet sein.')+
      ' Schreiben verkraftet '+(N-W)+' ausgefallene Kopie'+(N-W===1?'':'n')+', Lesen '+(N-R)+'.'+(W===N?' Mit W = N wartet jedes Schreiben auf alle – schon ein langsamer Rechner bremst alles.':'')+(N===3&&W===2&&R===2?' Das ist die klassische „Quorum“-Einstellung, etwa in Cassandra.':'');
  }
  ['qN','qW','qR'].forEach(id=>$(id).addEventListener('input',draw));draw();
})();
