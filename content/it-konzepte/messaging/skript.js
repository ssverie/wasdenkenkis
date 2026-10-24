// ---------- Warteschlange / Log ----------
(function(){
  const $=id=>document.getElementById(id);
  let m='queue',msgs,cons,nextId;
  const COL=['#2f5bd3','#b4540a','#15803d'];
  function reset(){msgs=[];nextId=1;cons=[{n:'Versand',pos:0,got:[]},{n:'Rechnung',pos:0,got:[]}];for(let i=0;i<5;i++)msgs.push({id:nextId++,gone:false});
    draw(m==='queue'?'Eine Warteschlange mit 5 Nachrichten. Versand und Rechnung sind zwei Arbeiter, die sich die Arbeit teilen.':'Ein Log mit 5 Nachrichten, @ zeigt den Offset. Versand und Rechnung sind zwei <em>Gruppen</em> – jede hat ihre eigene Leseposition (Pfeile).');}
  function draw(note){
    $('qlS').innerHTML=msgs.map((x,i)=>'<div class="m'+(x.gone?' gone':'')+'">'+x.id+(m==='log'?'<small>@'+i+'</small>':'')+'</div>').join('')||'<span style="color:var(--muted);font-size:.8rem;padding:6px">leer</span>';
    if(m==='log'){$('qlPt').innerHTML=msgs.map((x,i)=>'<span>'+cons.map((c,k)=>c.pos===i?'<i style="color:'+COL[k]+';font-style:normal">▲'+c.n[0]+'</i>':'').join('')+'</span>').join('')+'<span>'+cons.map((c,k)=>c.pos===msgs.length?'<i style="color:'+COL[k]+';font-style:normal">▲'+c.n[0]+'</i>':'').join('')+'</span>';}
    else $('qlPt').innerHTML='';
    $('qlCs').innerHTML=cons.map((c,k)=>'<div style="border-color:'+COL[k]+'"><b style="color:'+COL[k]+'">'+c.n+'</b>'+(m==='log'?'Offset: '+c.pos+' · ':'')+'erhalten: <code>'+(c.got.join(', ')||'–')+'</code></div>').join('');
    $('qlNote').innerHTML=note||'';$('qlN').disabled=cons.length>=3;
  }
  $('qlP').addEventListener('click',()=>{msgs.push({id:nextId++,gone:false});draw('Nachricht '+(nextId-1)+' wird hinten angehängt.');});
  $('qlC').addEventListener('click',()=>{
    if(m==='queue'){const open=msgs.filter(x=>!x.gone);if(!open.length){draw('Die Warteschlange ist leer.');return;}
      cons.forEach(c=>{const x=msgs.find(y=>!y.gone);if(x){x.gone=true;c.got.push(x.id);}});
      draw('Jeder Arbeiter holt sich die nächste freie Nachricht – <b>jede Nachricht geht an genau einen</b>. Danach ist sie weg.');}
    else{let any=false;cons.forEach(c=>{if(c.pos<msgs.length){c.got.push(msgs[c.pos].id);c.pos++;any=true;}});
      draw(any?'Jede Gruppe liest die nächste Nachricht an <em>ihrer</em> Position. <b>Beide bekommen alles</b>, und die Nachrichten bleiben im Log.':'Alle Gruppen sind am Ende angekommen.');}});
  $('qlN').addEventListener('click',()=>{cons.push({n:'Analyse',pos:0,got:[]});
    draw(m==='queue'?'Ein neuer Arbeiter „Analyse“. Er bekommt nur, was <b>ab jetzt</b> noch in der Warteschlange liegt – die bereits abgeholten Nachrichten sind für immer weg.':'Eine neue Gruppe „Analyse“ beginnt bei <b>Offset 0</b> und liest die ganze Geschichte – auch Nachrichten, die vor Wochen geschrieben wurden. Ohne dass der Absender irgendetwas tun muss.');});
  $('qlR').addEventListener('click',reset);
  const bs=[...document.querySelectorAll('#qlM button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;reset();}));
  reset();
})();

// ---------- Partitionen ----------
(function(){
  const $=id=>document.getElementById(id);
  const KC=['#2f5bd3','#b4540a','#15803d','#8b3fb8','#0e7490','#be123c'];
  const EV=[];let seed=11;const r=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  for(let i=0;i<24;i++)EV.push({n:i+1,k:Math.floor(r()*6)});
  const CC=['#2f5bd3','#b4540a','#15803d','#8b3fb8','#0e7490','#be123c','#4d7c0f','#a16207'];
  function draw(){
    const P=+$('kP').value,C=+$('kC').value;$('kPo').textContent=P;$('kCo').textContent=C;
    const hash=k=>(k*7+3)%P;
    const own=p=>p%C<C?(p%C):null;
    let h='';
    for(let p=0;p<P;p++){const ev=EV.filter(e=>hash(e.k)===p);const c=p%C;
      h+='<div class="prow"><span class="pn">P'+p+'</span><div class="pm">'+ev.map(e=>'<span style="background:'+KC[e.k]+'" title="Kunde '+(e.k+1)+'">'+e.n+'</span>').join('')+'</div><span class="who" style="color:'+CC[c]+'">Leser '+(c+1)+'</span></div>';}
    $('kParts').innerHTML=h;
    const idle=Math.max(0,C-P);
    $('kIdle').textContent=idle?idle+' Leser ohne Partition – untätig.':'';
    const keysIn=p=>[...new Set(EV.filter(e=>hash(e.k)===p).map(e=>e.k))].length;
    $('kN').innerHTML=(P===1?'Eine Partition: alles in einer Reihenfolge, aber nur ein Leser kann arbeiten. ':'')+
      'Die Ereignisse eines Kunden (gleiche Farbe) liegen immer in <b>derselben</b> Partition und dort in aufsteigender Reihenfolge – über Partitionen hinweg sind sie durcheinander. '+
      (C>=P?'Jeder Leser hat höchstens eine Partition'+(idle?', '+idle+' bleiben untätig':'')+'.':'Manche Leser bearbeiten mehrere Partitionen. Fällt einer aus, verteilt Kafka seine Partitionen auf die anderen (Rebalancing).');
  }
  $('kP').addEventListener('input',draw);$('kC').addEventListener('input',draw);draw();
})();

// ---------- Absturz ----------
(function(){
  const $=id=>document.getElementById(id);
  let o='after',k=0;
  function steps(){const idem=$('crIdem').checked;
    const A=o==='after'?['Nachricht 17 abholen: „Rechnung für Bestellung 42 erstellen“','Verarbeiten: Rechnung wird erstellt und gespeichert']:['Nachricht 17 abholen: „Rechnung für Bestellung 42 erstellen“','Offset bestätigen: 17 gilt als erledigt'];
    const crash='💥 Absturz des Lesers';
    const B=o==='after'?['Neustart: letzter bestätigter Offset ist 16 – also wieder ab 17','Nachricht 17 erneut abholen',idem?'Nachrichten-ID 17 schon in der Tabelle „verarbeitet“ – überspringen':'Verarbeiten: Rechnung wird <b>noch einmal</b> erstellt','Offset bestätigen: 17 erledigt']:['Neustart: letzter bestätigter Offset ist 17 – weiter mit 18','Nachricht 18 abholen …'];
    return A.concat([crash],B);}
  function draw(){const S=steps();
    $('crS').innerHTML=S.map((s,i)=>'<li class="'+(i>=k?'fut':'')+(s.startsWith('💥')?' crash':'')+'">'+s+'</li>').join('');
    const r=$('crR');
    if(k>=S.length){r.hidden=false;const idem=$('crIdem').checked;
      if(o==='after'&&!idem){r.className='cr-res warn';r.innerHTML='<b>At least once – doppelt verarbeitet.</b> Die Rechnung existiert zweimal, weil der Absturz nach der Verarbeitung, aber vor der Bestätigung kam. Nichts ging verloren – aber der Empfänger muss Doppelte vertragen.';}
      else if(o==='after'){r.className='cr-res ok';r.innerHTML='<b>Effektiv genau einmal.</b> Die Nachricht kam doppelt, aber der Empfänger hat sie erkannt. In der Praxis gehört das Speichern der ID in dieselbe Datenbanktransaktion wie die Rechnung – sonst kann der Absturz genau dazwischen fallen.';}
      else{r.className='cr-res bad';r.innerHTML='<b>At most once – verloren.</b> Die Nachricht war schon als erledigt bestätigt, bevor die Rechnung entstand. Nach dem Neustart geht es mit 18 weiter. Rechnung 42 wird nie erstellt, und niemand merkt es.';}}
    else r.hidden=true;
    $('crPrev').disabled=k===0;$('crNext').textContent=k>=S.length?'Von vorn ↺':'Weiter →';}
  $('crNext').addEventListener('click',()=>{k=k>=steps().length?0:k+1;draw();});
  $('crPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  $('crIdem').addEventListener('change',()=>{k=0;draw();});
  const bs=[...document.querySelectorAll('#crO button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');o=b.dataset.o;k=0;draw();}));
  draw();
})();
