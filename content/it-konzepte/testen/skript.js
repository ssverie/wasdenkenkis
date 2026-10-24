// ---------- Pyramide ----------
(function(){
  const $=id=>document.getElementById(id);
  const PRE={pyr:[2000,150,15],ice:[100,60,150],none:[3000,0,0]};
  const L=[{t:0.005,p:1e-5,c:'#15803d'},{t:0.5,p:5e-4,c:'#b4540a'},{t:20,p:5e-3,c:'#be123c'}];
  function set(p){const v=PRE[p];$('pyU').value=v[0];$('pyI').value=v[1];$('pyE').value=v[2];draw();}
  const dur=s=>s<60?Math.round(s)+' s':s<3600?Math.round(s/60)+' min':(s/3600).toFixed(1).replace('.',',')+' h';
  function draw(){
    const n=[+$('pyU').value,+$('pyI').value,+$('pyE').value];
    $('pyUo').textContent=n[0];$('pyIo').textContent=n[1];$('pyEo').textContent=n[2];
    // Form: Breite je Ebene relativ (Wurzel für Sichtbarkeit)
    const w=n.map(x=>20+260*Math.sqrt(x/3000));
    const y=[140,80,20],h=56;let s='';
    ['Unit','Integration','E2E'].forEach((nm,i)=>{const ww=Math.max(24,i===0?w[0]:i===1?Math.sqrt(n[1]/400)*260+20:Math.sqrt(n[2]/200)*260+20);
      s+='<rect x="'+(150-ww/2)+'" y="'+y[i]+'" width="'+ww+'" height="'+(h-6)+'" rx="6" fill="'+L[i].c+'" opacity=".85"/><text x="150" y="'+(y[i]+30)+'" text-anchor="middle" style="font:700 12px var(--sans);fill:#fff">'+nm+' · '+n[i]+'</text>';});
    $('pySvg').innerHTML=s;
    const time=n.reduce((a,x,i)=>a+x*L[i].t,0);
    const pOk=n.reduce((a,x,i)=>a*Math.pow(1-L[i].p,x),1);
    const red=1-pOk;
    $('pyS').innerHTML='<div class="'+(time>1800?'bad':time<300?'good':'')+'"><b>'+dur(time)+'</b>Laufzeit der Suite</div><div class="'+(red>0.3?'bad':red<0.2?'good':'')+'"><b>'+Math.round(red*100)+' %</b>Läufe grundlos rot</div><div><b>'+n.reduce((a,b)=>a+b,0)+'</b>Tests insgesamt</div>';
    let t;
    if(n[1]+n[2]===0)t='Schnell und stabil – aber ob die Teile zusammenpassen, ob die SQL-Abfragen gegen die echte Datenbank laufen, prüft niemand. Unit-Tests allein reichen nicht.';
    else if(red>0.5)t='Mehr als jeder zweite Lauf scheitert ohne echten Fehler. Das Team wird anfangen, rote Läufe zu ignorieren – und dann auch die echten.';
    else if(time>1800)t='Über eine halbe Stunde pro Lauf: Niemand wartet darauf vor einem Commit. Die Rückmeldung kommt, wenn man längst an etwas anderem arbeitet.';
    else t='Eine gesunde Mischung: Die vielen Unit-Tests geben in Sekunden Rückmeldung, die Integrationstests prüfen das Zusammenspiel, wenige End-to-End-Tests sichern die wichtigsten Abläufe ab.';
    $('pyN').innerHTML=t;
  }
  ['pyU','pyI','pyE'].forEach(id=>$(id).addEventListener('input',draw));
  const bs=[...document.querySelectorAll('#pyP button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');set(b.dataset.p);}));
  set('pyr');
})();

// ---------- Mutation ----------
(function(){
  const $=id=>document.getElementById(id);
  const orig=(b,s)=>{if(b>=10000){return s?Math.trunc(b/10):Math.trunc(b/20);}return 0;};
  const M=[
    {d:'<code>&gt;=</code> wird <code>&gt;</code>',f:(b,s)=>{if(b>10000){return s?Math.trunc(b/10):Math.trunc(b/20);}return 0;}},
    {d:'Stammkunden: <code>/ 10</code> wird <code>/ 20</code>',f:(b,s)=>{if(b>=10000){return s?Math.trunc(b/20):Math.trunc(b/20);}return 0;}},
    {d:'Zweige vertauscht: <code>s ? /20 : /10</code>',f:(b,s)=>{if(b>=10000){return s?Math.trunc(b/20):Math.trunc(b/10);}return 0;}},
    {d:'Grenze <code>10_000</code> wird <code>1_000</code>',f:(b,s)=>{if(b>=1000){return s?Math.trunc(b/10):Math.trunc(b/20);}return 0;}},
    {d:'<code>return 0</code> wird <code>return 1</code>',f:(b,s)=>{if(b>=10000){return s?Math.trunc(b/10):Math.trunc(b/20);}return 1;}}
  ];
  const T=[
    {d:'<code>rabattCent(20_000, true)</code> wird aufgerufen – geprüft wird nichts',a:[20000,true],check:false,def:true},
    {d:'<code>assertEquals(2_000, rabattCent(20_000, true))</code>',a:[20000,true],check:true,def:false},
    {d:'<code>assertEquals(1_000, rabattCent(20_000, false))</code>',a:[20000,false],check:true},
    {d:'<code>assertEquals(0, rabattCent(5_000, true))</code>',a:[5000,true],check:true,def:true},
    {d:'<code>assertEquals(1_000, rabattCent(10_000, true))</code> – genau auf der Grenze',a:[10000,true],check:true}
  ];
  const SRC=['static long rabattCent(long betragCent, boolean stamm) {','    if (betragCent &gt;= 10_000) {                 // ab 100 €','        return stamm ? betragCent / 10           // 10 %','                     : betragCent / 20;          // 5 %','    }','    return 0;','}'];
  $('mTests').innerHTML=T.map((t,i)=>'<label class="toggle"><input type="checkbox" data-i="'+i+'"'+(t.def?' checked':'')+'> <span>'+t.d+'</span></label>').join('');
  function draw(){
    const on=[...document.querySelectorAll('#mTests input')].filter(x=>x.checked).map(x=>T[+x.dataset.i]);
    // Abdeckung: Zeilen 1,2 immer bei mind. einem Test; Zeile 2-3 wenn b>=10000; Zeile 5 wenn b<10000
    const hitIf=on.length>0,hitT=on.some(t=>t.a[0]>=10000&&t.a[1]),hitF=on.some(t=>t.a[0]>=10000&&!t.a[1]),hitR=on.some(t=>t.a[0]<10000);
    const cov=[hitIf,hitIf,hitT||hitF,hitT||hitF,null,hitR,null];
    $('mSrc').innerHTML=SRC.map((l,i)=>'<span class="ln'+(cov[i]===true?' cov':cov[i]===false&&on.length?' unc':'')+'">'+l+'</span>').join('');
    const lines=[0,1,2,3,5],covered=lines.filter(i=>cov[i]).length;
    let killed=0;
    $('mMut').innerHTML=M.map(m=>{const k=on.some(t=>t.check&&m.f(...t.a)!==orig(...t.a));if(k)killed++;
      return '<div class="mu '+(on.length?(k?'killed':'alive'):'')+'"><span>'+m.d+'</span><span class="tag">'+(on.length?(k?'erkannt':'überlebt'):'–')+'</span></div>';}).join('');
    const covPct=on.length?Math.round(100*covered/lines.length):0,mutPct=Math.round(100*killed/M.length);
    $('mS').innerHTML='<div><b>'+covPct+' %</b>Zeilenabdeckung</div><div><b>'+mutPct+' %</b>Mutanten erkannt</div>';
    let n;
    if(!on.length)n='Wähle Tests aus.';
    else if(covPct===100&&mutPct<50)n='<b>100 % Abdeckung, aber die meisten Fehler bleiben unentdeckt.</b> Jede Zeile wird ausgeführt – nur prüft kaum ein Test das Ergebnis. Ein Coverage-Bericht wäre hier vollständig grün.';
    else if(mutPct===100)n='<b>Alle Mutanten erkannt.</b> Entscheidend war der Test genau auf der Grenze <code>10_000</code>: Ohne ihn bleibt der klassische Off-by-one-Fehler <code>&gt;=</code> → <code>&gt;</code> unentdeckt. Grenzwerte testen lohnt sich immer.';
    else n='Jeder überlebende Mutant ist ein konkreter Fehler, den diese Tests durchlassen würden. Welcher Test fehlt, um ihn zu erkennen?';
    $('mN').innerHTML=n;
  }
  document.querySelectorAll('#mTests input').forEach(x=>x.addEventListener('change',draw));draw();
})();

// ---------- Property-based ----------
(function(){
  const $=id=>document.getElementById(id);
  let prop='sorted';
  const sut=xs=>[...new Set(xs)].sort((a,b)=>a-b);
  const P={sorted:xs=>{const r=sut(xs);for(let i=1;i<r.length;i++)if(r[i-1]>r[i])return false;return true;},len:xs=>sut(xs).length===xs.length};
  function gen(){const n=Math.floor(Math.random()*9);return [...Array(n)].map(()=>Math.floor(Math.random()*21)-10);}
  const show=xs=>'['+xs.join(', ')+']';
  function shrink(xs,ok){let cur=xs.slice(),log=[],changed=true;
    while(changed){changed=false;
      for(let i=0;i<cur.length;i++){const c=cur.slice(0,i).concat(cur.slice(i+1));if(!ok(c)){cur=c;changed=true;log.push(show(cur));break;}}
      if(changed)continue;
      for(let i=0;i<cur.length;i++){if(cur[i]!==0){const c=cur.slice();c[i]=cur[i]>0?Math.floor(cur[i]/2):Math.ceil(cur[i]/2);if(!ok(c)){cur=c;changed=true;log.push(show(cur));break;}}}
    }return {min:cur,log};}
  function run(){const ok=P[prop];let out='';let found=null,i;
    for(i=1;i<=100;i++){const xs=gen();if(!ok(xs)){found=xs;break;}if(i<=6)out+='<span class="o">✓</span> '+show(xs)+'\n';else if(i===7)out+='…\n';}
    if(!found){out+='<span class="o">✓ alle 100 Listen bestehen</span>';$('pbLog').innerHTML=out;
      $('pbN').innerHTML='Die Eigenschaft „sortiert“ gilt – der Fehler ist damit nicht zu fassen. Eine einzelne Eigenschaft beweist wenig; man braucht mehrere. Probier „Länge bleibt gleich“.';return;}
    out+='<span class="f">✗ Versuch '+i+': '+show(found)+' → '+show(sut(found))+'</span>\n<span class="s">Schrumpfen:</span>\n';
    const r=shrink(found,ok);r.log.forEach(l=>out+='  <span class="s">→ '+l+'</span>\n');
    out+='<span class="f">Kleinstes Gegenbeispiel: '+show(r.min)+' → '+show(sut(r.min))+'</span>';
    $('pbLog').innerHTML=out;
    $('pbN').innerHTML='<b>Gefunden und geschrumpft:</b> Aus einer zufälligen Liste wurde das kleinste Beispiel, das noch scheitert – zwei gleiche Zahlen. Die Diagnose liegt auf der Hand: <code>TreeSet</code> entfernt Duplikate. Ein Entwickler, der die Funktion mit Beispielen wie <code>[3, 1, 2]</code> getestet hätte, wäre nie darauf gestoßen.';}
  const bs=[...document.querySelectorAll('#pbP button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');prop=b.dataset.p;$('pbLog').textContent='Noch nicht gestartet.';$('pbN').innerHTML='';}));
  $('pbRun').addEventListener('click',run);
})();
