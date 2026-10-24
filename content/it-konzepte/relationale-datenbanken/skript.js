// ---------- JOIN ----------
(function(){
  const $=id=>document.getElementById(id);
  const K=[[1,'Anna'],[2,'Ben'],[3,'Clara']];
  const B=[[101,1,'03.10.'],[102,1,'15.10.'],[103,2,'20.10.']];
  const SQL={
    inner:'<span class="k">SELECT</span> k.name, b.id, b.datum\n<span class="k">FROM</span> kunde k\n<span class="k">INNER JOIN</span> bestellung b <span class="k">ON</span> b.kunde_id = k.id',
    left:'<span class="k">SELECT</span> k.name, b.id, b.datum\n<span class="k">FROM</span> kunde k\n<span class="k">LEFT JOIN</span> bestellung b <span class="k">ON</span> b.kunde_id = k.id',
    group:'<span class="k">SELECT</span> k.name, <span class="k">COUNT</span>(b.id) <span class="k">AS</span> anzahl\n<span class="k">FROM</span> kunde k\n<span class="k">LEFT JOIN</span> bestellung b <span class="k">ON</span> b.kunde_id = k.id\n<span class="k">GROUP BY</span> k.name'
  };
  let m='inner';
  function draw(){
    $('jSql').innerHTML=SQL[m];
    const clara=m!=='inner';
    $('jK').innerHTML='<tr><th>id</th><th>name</th></tr>'+K.map(k=>'<tr class="'+(k[0]===3?(clara?'nl':''):'hl')+'"><td>'+k[0]+'</td><td>'+k[1]+'</td></tr>').join('');
    $('jB').innerHTML='<tr><th>id</th><th>kunde_id</th><th>datum</th></tr>'+B.map(b=>'<tr class="hl"><td>'+b[0]+'</td><td>'+b[1]+'</td><td>'+b[2]+'</td></tr>').join('');
    let r,n;
    if(m==='inner'){r='<tr><th>name</th><th>id</th><th>datum</th></tr>'+B.map(b=>'<tr class="hl"><td>'+K.find(k=>k[0]===b[1])[1]+'</td><td>'+b[0]+'</td><td>'+b[2]+'</td></tr>').join('');
      n='Nur Paare, die zusammenpassen. Anna erscheint zweimal, weil sie zwei Bestellungen hat. <b>Clara fehlt</b> – sie hat nichts bestellt, also gibt es keinen Partner.';}
    else if(m==='left'){r='<tr><th>name</th><th>id</th><th>datum</th></tr>'+B.map(b=>'<tr class="hl"><td>'+K.find(k=>k[0]===b[1])[1]+'</td><td>'+b[0]+'</td><td>'+b[2]+'</td></tr>').join('')+'<tr class="nl"><td>Clara</td><td class="nu">NULL</td><td class="nu">NULL</td></tr>';
      n='Alle Zeilen der linken Tabelle bleiben erhalten. Wo kein Partner existiert, füllt die Datenbank mit <code>NULL</code>. Typisch für „alle Kunden, auch ohne Bestellung“.';}
    else{r='<tr><th>name</th><th>anzahl</th></tr><tr class="hl"><td>Anna</td><td>2</td></tr><tr class="hl"><td>Ben</td><td>1</td></tr><tr class="nl"><td>Clara</td><td>0</td></tr>';
      n='<code>GROUP BY</code> fasst die Zeilen pro Kunde zusammen. <code>COUNT(b.id)</code> zählt nur Werte, die nicht NULL sind – deshalb bekommt Clara eine 0. Mit <code>COUNT(*)</code> stünde dort fälschlich eine 1.';}
    $('jR').innerHTML=r;$('jNote').innerHTML=n;
  }
  const bs=[...document.querySelectorAll('#jMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;draw();}));
  draw();
})();

// ---------- B-Baum ----------
(function(){
  const $=id=>document.getElementById(id);
  // Blätter: 9 Seiten à 3 Werte; mittlere Ebene: 3 Knoten mit Trennwerten; Wurzel
  const leaves=[...Array(9)].map((_,i)=>[i*3+1,i*3+2,i*3+3]);
  const mids=[[4,7],[13,16],[22,25]],root=[10,19];
  function draw(path,scanTo,key){
    let h='<div class="lvl"><div class="pg'+(path?' on':'')+'">'+root.map(v=>'<span>'+v+'</span>').join('')+'</div></div>';
    h+='<div class="lvl">'+mids.map((m,i)=>'<div class="pg'+(path&&path[0]===i?' on':'')+'">'+m.map(v=>'<span>'+v+'</span>').join('')+'</div>').join('')+'</div>';
    h+='<div class="lvl">'+leaves.map((l,i)=>{let c='pg';if(path&&path[1]===i)c+=' on';if(scanTo!==undefined&&i<=scanTo)c+=' scan';
      return '<div class="'+c+'">'+l.map(v=>'<span'+(v===key&&(path||scanTo!==undefined)?' class="hit"':'')+'>'+v+'</span>').join('')+'</div>';}).join('')+'</div>';
    $('bt').innerHTML=h;
  }
  function key(){return Math.max(1,Math.min(27,Math.round(+$('btKey').value||1)));}
  $('btIdx').addEventListener('click',()=>{const k=key(),mi=k<10?0:k<19?1:2,li=Math.floor((k-1)/3);draw([mi,li],undefined,k);
    $('btOut').innerHTML='<b>Mit Index: 3 Seiten gelesen.</b> Wurzel: '+k+(k<10?' &lt; 10':k<19?' liegt zwischen 10 und 19':' ≥ 19')+' → passender Knoten der mittleren Ebene → passendes Blatt. Egal welcher Wert: immer genau so viele Seiten wie der Baum tief ist.';});
  $('btScan').addEventListener('click',()=>{const k=key(),li=Math.floor((k-1)/3);draw(null,li,k);
    $('btOut').innerHTML='<b>Ohne Index: '+(li+1)+' von 9 Seiten gelesen</b> – Seite für Seite, bis der Wert auftaucht. Und weil der Wert ja mehrfach vorkommen könnte, müsste die Datenbank in Wahrheit sogar <b>alle 9</b> lesen.';});
  const fmt=n=>n>=1e9?(n/1e9).toLocaleString('de-DE')+' Mrd.':n>=1e6?(n/1e6).toLocaleString('de-DE')+' Mio.':n.toLocaleString('de-DE');
  function calc(){
    const n=Math.pow(10,+$('btN').value),pages=Math.max(1,Math.ceil(n/100));
    const depth=1+Math.max(0,Math.ceil(Math.log(pages)/Math.log(500)));
    $('btNO').textContent=fmt(n);
    $('btCmp').innerHTML='<div class="bad"><b>'+fmt(pages)+'</b>Seiten lesen ohne Index</div><div class="good"><b>'+depth+'</b>Seiten lesen mit Index</div>';
  }
  $('btN').addEventListener('input',calc);calc();draw();
})();

// ---------- Buchung ----------
(function(){
  const $=id=>document.getElementById(id);
  const S={
    naiv:{steps:[
      ['t1','SELECT frei FROM flug WHERE id = 7','→ 1. Die App prüft: noch ein Platz frei.','',{frei:1,b:[]}],
      ['t2','SELECT frei FROM flug WHERE id = 7','→ 1. Auch hier: noch ein Platz frei.','',{frei:1,b:[]}],
      ['t1','UPDATE flug SET frei = 0 WHERE id = 7;\nINSERT INTO buchung … (Anna);\nCOMMIT','✓ bestätigt','o',{frei:0,b:['Anna']}],
      ['t2','UPDATE flug SET frei = 0 WHERE id = 7;\nINSERT INTO buchung … (Ben);\nCOMMIT','✓ bestätigt – T2 überschreibt mit dem Wert, den es vorhin selbst errechnet hat','o',{frei:0,b:['Anna','Ben']}]],
      out:['bad','<b>Überbucht.</b> Zwei Buchungen für einen Platz, und die Datenbank meldet keinen Fehler. Jede Transaktion für sich war korrekt – aber beide haben auf veralteten Daten entschieden. Das ist ein <b>Lost Update</b>, unter READ COMMITTED völlig erlaubt.']},
    forupd:{steps:[
      ['t1','SELECT frei FROM flug WHERE id = 7 FOR UPDATE','→ 1. Die Zeile ist jetzt für T1 gesperrt.','',{frei:1,b:[]}],
      ['t2','SELECT frei FROM flug WHERE id = 7 FOR UPDATE','⏳ wartet – die Zeile ist von T1 gesperrt','w',{frei:1,b:[]}],
      ['t1','UPDATE flug SET frei = 0 …; INSERT … (Anna);\nCOMMIT','✓ bestätigt, Sperre aufgehoben','o',{frei:0,b:['Anna']}],
      ['t2','(Abfrage läuft jetzt weiter)','→ 0. Die App erkennt: ausgebucht. ROLLBACK.','e',{frei:0,b:['Anna']}]],
      out:['good','<b>Korrekt.</b> Pessimistisches Sperren: Wer zuerst liest, sperrt. Sicher und leicht verständlich – aber T2 musste warten, und bei vielen gleichzeitigen Zugriffen auf dieselbe Zeile staut es sich.']},
    atom:{steps:[
      ['t1','UPDATE flug SET frei = frei - 1\nWHERE id = 7 AND frei > 0','→ 1 Zeile geändert. Prüfen und Schreiben in einem Schritt.','',{frei:0,b:[]}],
      ['t2','UPDATE flug SET frei = frei - 1\nWHERE id = 7 AND frei > 0','⏳ wartet auf T1s Sperre der Zeile','w',{frei:0,b:[]}],
      ['t1','INSERT INTO buchung … (Anna);\nCOMMIT','✓ bestätigt','o',{frei:0,b:['Anna']}],
      ['t2','(UPDATE läuft jetzt weiter)','→ 0 Zeilen geändert, denn frei ist jetzt 0. Die App: ausgebucht.','e',{frei:0,b:['Anna']}]],
      out:['good','<b>Korrekt – und meist die beste Lösung.</b> Die Bedingung steckt im UPDATE selbst, die Datenbank prüft und ändert untrennbar. Die App schaut nur, ob eine Zeile geändert wurde. Genau so steht es im Java-Beispiel unten.']},
    opt:{steps:[
      ['t1','SELECT frei, version FROM flug WHERE id = 7','→ frei 1, version 3','',{frei:1,v:3,b:[]}],
      ['t2','SELECT frei, version FROM flug WHERE id = 7','→ frei 1, version 3','',{frei:1,v:3,b:[]}],
      ['t1','UPDATE flug SET frei = 0, version = 4\nWHERE id = 7 AND version = 3;\nINSERT … (Anna); COMMIT','✓ 1 Zeile geändert, bestätigt','o',{frei:0,v:4,b:['Anna']}],
      ['t2','UPDATE flug SET frei = 0, version = 4\nWHERE id = 7 AND version = 3','→ 0 Zeilen geändert: Version ist schon 4. Konflikt erkannt – neu lesen: ausgebucht.','e',{frei:0,v:4,b:['Anna']}]],
      out:['good','<b>Korrekt.</b> Optimistisch: Niemand sperrt, aber jeder prüft beim Schreiben, ob sich seit dem Lesen etwas geändert hat. Ideal, wenn Konflikte selten sind und zwischen Lesen und Schreiben Zeit vergeht – etwa ein Formular, das jemand fünf Minuten lang ausfüllt. JPA macht das mit <code>@Version</code> automatisch.']},
    ser:{steps:[
      ['t1','SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nSELECT frei FROM flug WHERE id = 7','→ 1','',{frei:1,b:[]}],
      ['t2','SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nSELECT frei FROM flug WHERE id = 7','→ 1','',{frei:1,b:[]}],
      ['t1','UPDATE flug SET frei = 0 …; INSERT … (Anna);\nCOMMIT','✓ bestätigt','o',{frei:0,b:['Anna']}],
      ['t2','UPDATE flug SET frei = 0 WHERE id = 7','✗ ERROR: could not serialize access due to concurrent update – die App muss die ganze Transaktion wiederholen und findet dann: ausgebucht.','e',{frei:0,b:['Anna']}]],
      out:['good','<b>Korrekt – derselbe naive Code, nur mit strengerem Isolationslevel.</b> Die Datenbank erkennt, dass das Ergebnis nicht dem einer strikten Reihenfolge entspräche, und bricht eine Transaktion ab. Der Preis: Die Anwendung muss mit solchen Abbrüchen rechnen und Transaktionen wiederholen können.']}
  };
  let m='naiv',k=0;
  function draw(){
    const s=S[m];
    $('tx').innerHTML=s.steps.map((st,i)=>'<div class="txr '+st[0]+(i>=k?' fut':'')+'"><span class="who">'+st[0].toUpperCase()+'</span><span><code>'+st[1]+'</code>'+(i<k?'<span class="res '+st[3]+'">'+st[2]+'</span>':'')+'</span></div>').join('');
    const cur=k>0?s.steps[k-1][4]:(m==='opt'?{frei:1,v:3,b:[]}:{frei:1,b:[]});
    $('txState').innerHTML='<span>Flug 7, freie Plätze: <b>'+cur.frei+'</b></span>'+(cur.v!==undefined?'<span>version: <b>'+cur.v+'</b></span>':'')+'<span>Buchungen: <b>'+(cur.b.length?cur.b.join(', '):'–')+'</b></span>';
    const o=$('txOut');if(k===s.steps.length){o.hidden=false;o.className='tx-out '+s.out[0];o.innerHTML=s.out[1];}else o.hidden=true;
    $('txPrev').disabled=k===0;$('txNext').textContent=k===s.steps.length?'Von vorn ↺':'Nächster Schritt →';
  }
  $('txNext').addEventListener('click',()=>{k=k===S[m].steps.length?0:k+1;draw();});
  $('txPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  const bs=[...document.querySelectorAll('#txMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;k=0;draw();}));
  draw();
})();
