// ---------- Objektgraph ----------
(function(){
  const $=id=>document.getElementById(id);
  const N={stack:[60,40,'Stack','kunde'],stat:[60,190,'static','CONFIG'],K:[220,40,'Kunde',''],A:[380,40,'Adresse',''],B:[220,130,'Bestellung',''],C:[380,190,'Config',''],X:[460,120,'Knoten X',''],Y:[540,200,'Knoten Y','']};
  const E0=[['stack','K'],['K','A'],['K','B'],['B','A'],['stat','C'],['X','Y'],['Y','X']];
  let E,mode='trace',cut,marked,swept;
  function reset(){E=E0.map(e=>e.slice());cut=false;marked=null;swept=false;draw('Wurzeln (grau): die lokale Variable <code>kunde</code> und das statische Feld <code>CONFIG</code>. X und Y zeigen nur aufeinander – sie waren einmal Teil einer Liste, die längst niemand mehr kennt.');}
  const roots=['stack','stat'];
  function reach(){const s=new Set(roots),q=[...roots];while(q.length){const n=q.shift();E.forEach(([a,b])=>{if(a===n&&!(cut&&a==='stack')&&!s.has(b)){s.add(b);q.push(b);}});}return s;}
  function rc(n){return E.filter(([a,b])=>b===n&&!(cut&&a==='stack')).length;}
  function draw(msg){
    let s='<defs><marker id="ogA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker></defs>';
    const gone=n=>swept&&marked&&!marked.has(n)&&!roots.includes(n);
    const goneRc=n=>swept&&mode==='rc'&&!roots.includes(n)&&rc(n)===0;
    const isGone=n=>mode==='rc'?goneRc(n):gone(n);
    E.forEach(([a,b])=>{const A=N[a],B=N[b];const dx=B[0]-A[0],dy=B[1]-A[1],d=Math.hypot(dx,dy);
      const off=(a==='X'&&b==='Y')||(a==='Y'&&b==='X')?7:0;const nx=-dy/d*off,ny=dx/d*off;
      const isCut=cut&&a==='stack';
      s+='<line class="ref'+(isCut?' cut':'')+(isGone(a)||isGone(b)?' gone':'')+'" x1="'+(A[0]+dx/d*38+nx)+'" y1="'+(A[1]+dy/d*22+ny)+'" x2="'+(B[0]-dx/d*40+nx)+'" y2="'+(B[1]-dy/d*24+ny)+'" marker-end="url(#ogA)"/>';});
    Object.entries(N).forEach(([k,n])=>{const isRoot=roots.includes(k);
      let cls=isRoot?'root':'ob';
      if(!isRoot){if(mode==='trace'&&marked)cls+=marked.has(k)?' live':' dead';if(mode==='rc'&&marked)cls+=rc(k)>0?' live':' dead';if(isGone(k))cls+=' gone';}
      s+='<rect class="'+cls+'" x="'+(n[0]-42)+'" y="'+(n[1]-20)+'" width="84" height="40" rx="8"/><text class="t" x="'+n[0]+'" y="'+(n[1]+(n[3]?-2:4))+'" text-anchor="middle">'+n[2]+'</text>'+(n[3]?'<text class="s" x="'+n[0]+'" y="'+(n[1]+12)+'" text-anchor="middle">'+n[3]+'</text>':'');
      if(mode==='rc'&&!isRoot&&!isGone(k))s+='<text class="rc" x="'+(n[0]+44)+'" y="'+(n[1]-14)+'">'+rc(k)+'</text>';});
    $('og').innerHTML=s;$('ogN').innerHTML=msg;
    $('ogCut').disabled=cut;$('ogSweep').disabled=!marked||swept;
  }
  $('ogCut').addEventListener('click',()=>{cut=true;marked=null;swept=false;draw('<code>kunde = null;</code> – die lokale Variable zeigt auf nichts mehr. Kunde, Adresse und Bestellung existieren noch, sind aber von keiner Wurzel aus erreichbar.');});
  $('ogMark').addEventListener('click',()=>{if(mode==='trace'){marked=reach();const dead=Object.keys(N).filter(k=>!roots.includes(k)&&!marked.has(k));
      draw('<b>Markieren:</b> Von den Wurzeln aus allen Verweisen folgen – erreicht wird grün. Rot: '+dead.join(', ')+'. Auch X und Y sind rot, obwohl sie aufeinander zeigen: Kein Weg führt von einer Wurzel zu ihnen.');}
    else{marked=new Set();const dead=Object.keys(N).filter(k=>!roots.includes(k)&&rc(k)===0);
      draw('<b>Zähler prüfen:</b> Die orange Zahl ist die Anzahl eingehender Verweise. Bei 0 wird freigegeben: '+(dead.length?dead.join(', '):'nichts')+'. <b>X und Y haben je 1</b> – sie zeigen aufeinander. Nach dem Freigeben fallen dann auch Adresse und Bestellung auf 0, Referenzzählung arbeitet sich Schritt für Schritt vor.');}});
  $('ogSweep').addEventListener('click',()=>{if(mode==='rc'){let changed=true;while(changed){changed=false;Object.keys(N).forEach(k=>{if(!roots.includes(k)&&rc(k)===0&&E.some(([a])=>a===k)){E=E.filter(([a])=>a!==k);changed=true;}});}}
    swept=true;draw(mode==='trace'?'<b>Aufräumen:</b> Alles Rote ist weg – auch der Zyklus aus X und Y. Übrig bleibt nur, was erreichbar ist.':'<b>Freigegeben</b> wurde, was auf 0 fiel. <b>X und Y überleben</b> mit Zähler 1 – ein Leck, obwohl niemand sie erreichen kann. Python hat dafür zusätzlich einen Zyklus-Sucher, Swift verlangt „weak“-Verweise vom Programmierer.');});
  $('ogReset').addEventListener('click',reset);
  const bs=[...document.querySelectorAll('#ogMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');mode=b.dataset.m;reset();}));
  reset();
})();

// ---------- Generationen ----------
(function(){
  const $=id=>document.getElementById(id);
  const EDEN=100,SURV=24,OLD=160,AGE=3;
  let eden,surv,old,tick,timer=null,leak,minor,major,pause,log;
  function life(){const r=Math.random();if(leak&&r<0.08)return Infinity;return r<0.8?1+Math.random()*2:r<0.95?8+Math.random()*30:Infinity;}
  function reset(){stop();eden=[];surv=[];old=[];tick=0;leak=false;minor=0;major=0;pause=0;log=[];$('gLeak').textContent='Speicherleck einschalten';draw();}
  function stop(){if(timer){clearInterval(timer);timer=null;$('gRun').textContent='Programm laufen lassen';}}
  function alive(o){return o.dies>tick;}
  function majorGC(){const before=old.length;old=old.filter(alive);const ms=Math.round(before*0.5);major++;pause+=ms;
    log.unshift('<div class="maj">Große Sammlung: '+before+' alte Objekte geprüft, '+(before-old.length)+' freigegeben – Pause '+ms+' ms</div>');}
  function minorGC(){const all=eden.concat(surv),live=all.filter(alive);let copied=0,prom=0;surv=[];
    live.forEach(o=>{o.age++;if(o.age>=AGE||surv.length>=SURV){old.push(o);prom++;}else{surv.push(o);copied++;}});eden=[];minor++;const ms=Math.max(1,Math.round((copied+prom)*0.3));pause+=ms;
    log.unshift('<div>Kleine Sammlung: '+all.length+' Objekte, '+live.length+' überleben ('+copied+' → Survivor, '+prom+' → Old) – Pause '+ms+' ms</div>');
    if(old.length>OLD*0.85)majorGC();
    if(old.length>=OLD){log.unshift('<div class="maj">java.lang.OutOfMemoryError: Java heap space</div>');stop();return false;}
    return true;}
  function step(){tick++;for(let k=0;k<6;k++){if(eden.length>=EDEN){if(!minorGC())return;}eden.push({dies:tick+life(),age:0});}
    if(log.length>40)log.length=40;draw();}
  function cells(arr,cap,cls,cols){let h='<div class="cells" style="grid-template-columns:repeat('+cols+',1fr)">';for(let i=0;i<cap;i++){const o=arr[i];h+='<i class="'+(o?(alive(o)?cls:''):'')+'"'+(o&&!alive(o)?' style="background:var(--bad-soft)"':'')+'></i>';}return h+'</div>';}
  function draw(){
    $('gens').innerHTML='<div class="gen"><h4>Eden <span>'+eden.length+'/'+EDEN+'</span></h4>'+cells(eden,EDEN,'o',10)+'</div><div class="gen"><h4>Survivor <span>'+surv.length+'/'+SURV+'</span></h4>'+cells(surv,SURV,'s',4)+'</div><div class="gen"><h4>Old <span>'+old.length+'/'+OLD+'</span></h4>'+cells(old,OLD,'l',16)+'</div>';
    $('gS').innerHTML='<div><b>'+minor+'</b>kleine Sammlungen</div><div><b>'+major+'</b>große Sammlungen</div><div><b>'+pause+' ms</b>Pausen gesamt</div><div><b>'+(minor?Math.round(pause/(minor+major)):0)+' ms</b>Pause im Schnitt</div>';
    $('gLog').innerHTML=log.join('')||'<div>Noch keine Sammlung.</div>';
  }
  $('gRun').addEventListener('click',()=>{if(timer){stop();return;}$('gRun').textContent='Pause';timer=setInterval(step,90);});
  $('gLeak').addEventListener('click',()=>{leak=!leak;$('gLeak').textContent=leak?'Speicherleck ausschalten':'Speicherleck einschalten';log.unshift('<div>'+(leak?'Ab jetzt landen zusätzlich Objekte in einer statischen Map, die nie geleert wird.':'Das Leck ist geschlossen.')+'</div>');draw();});
  $('gReset').addEventListener('click',reset);
  reset();
})();

// ---------- Pausen ----------
(function(){
  const $=id=>document.getElementById(id);
  const HEAP=[1,2,4,8,16,32];
  function draw(){const h=HEAP[+$('pzH').value];$('pzHo').textContent=h+' GB';
    const C=[
      {n:'Parallel',every:2.5,p:Math.min(4000,90*h),c:'Gesamtzeit zählt'},
      {n:'G1',every:1.2,p:Math.min(200,25+12*Math.log2(h*4)),c:'Ziel: 200 ms'},
      {n:'ZGC',every:0.8,p:0.5,c:'unter 1 ms'}];
    $('pz').innerHTML=C.map(c=>{let marks='',t=0.3,tot=0,n=0;const ev=Math.max(c.every,c.p/1000*1.7);while(t<10){marks+='<i style="left:'+(t*10)+'%;width:'+Math.max(0.25,c.p/100)+'%"></i>';tot+=c.p;n++;t+=ev;}
      return '<div class="pzr"><b>'+c.n+'</b><div class="tl">'+marks+'</div><span class="v">'+(c.p<1?'&lt;1':Math.round(c.p))+' ms je Pause</span></div>';}).join('');
    $('pzN').innerHTML=h>=16?'Bei '+h+' GB steht ein Programm mit dem Parallel-Collector bei jeder großen Sammlung Sekunden lang – für eine Webanwendung inakzeptabel, für eine nächtliche Batch-Verarbeitung egal. ZGC bleibt unabhängig von der Heap-Größe unter einer Millisekunde.':'Bei kleinen Heaps sind alle Collectors erträglich. Je größer der Heap, desto mehr fällt der Unterschied auf – schieb den Regler nach rechts.';}
  $('pzH').addEventListener('input',draw);draw();
})();
