// ---------- Simulator ----------
(function(){
  const $=id=>document.getElementById(id);
  const B='_';
  // Regeln: [zustand, lies, schreibe, richtung (L/R), neu]
  const P={
    inc:{d:'Addiert 1 zu einer Binärzahl. Der Kopf läuft ans Ende, dann zurück und verwandelt 1 in 0, bis er eine 0 oder ein leeres Feld findet – das ist der Übertrag.',in:'1011',filt:s=>s.replace(/[^01]/g,''),start:'rechts',halt:{fertig:'Fertig – die Zahl auf dem Band ist um 1 größer.'},
      r:[['rechts','0','0','R','rechts'],['rechts','1','1','R','rechts'],['rechts',B,B,'L','übertrag'],['übertrag','1','0','L','übertrag'],['übertrag','0','1','L','zurück'],['übertrag',B,'1','L','zurück'],['zurück','0','0','L','zurück'],['zurück','1','1','L','zurück'],['zurück',B,B,'R','fertig']]},
    anbn:{d:'Prüft, ob erst n-mal a und dann genau n-mal b kommt. Ein a wird zu X abgehakt, das passende b zu Y, dann zurück zum Anfang – bis alles abgehakt ist.',in:'aaabbb',filt:s=>s.replace(/[^ab]/g,''),start:'q0',halt:{ja:'Akzeptiert: Das Wort hat die Form aⁿbⁿ.'},
      r:[['q0','a','X','R','q1'],['q0','Y','Y','R','q3'],['q0',B,B,'R','ja'],['q1','a','a','R','q1'],['q1','Y','Y','R','q1'],['q1','b','Y','L','q2'],['q2','a','a','L','q2'],['q2','Y','Y','L','q2'],['q2','X','X','R','q0'],['q3','Y','Y','R','q3'],['q3',B,B,'R','ja']]},
    bb:{d:'Zwei Zustände, leeres Band: Die Maschine schreibt so viele Einsen wie möglich und hält trotzdem an. Mit zwei Zuständen sind 4 Einsen in 6 Schritten das Maximum.',in:'',filt:()=>'',start:'A',halt:{H:'Angehalten: 4 Einsen in 6 Schritten – mehr schafft keine Maschine mit zwei Zuständen.'},
      r:[['A',B,'1','R','B'],['A','1','1','L','B'],['B',B,'1','L','A'],['B','1','1','R','H']]}
  };
  let k='inc',tape,head,st,steps,wrote,timer=null;
  const rule=()=>P[k].r.find(x=>x[0]===st&&x[1]===(tape.get(head)||B));
  function reset(){stop();tape=new Map();[...$('tmIn').value].forEach((c,i)=>tape.set(i,c));head=0;st=P[k].start;steps=0;wrote=null;draw();}
  function step(){const p=P[k];if(p.halt[st])return false;const r=rule();if(!r)return false;tape.set(head,r[2]);wrote=head;head+=r[3]==='R'?1:-1;st=r[4];steps++;draw();return !p.halt[st]&&!!rule();}
  function stop(){if(timer){clearInterval(timer);timer=null;$('tmRun').textContent='Laufen';}}
  function draw(){const p=P[k],W=window.innerWidth<520?9:13,h=Math.floor(W/2);let c='';
    for(let i=head-h;i<=head+h;i++){const v=tape.get(i)||B;c+='<span class="'+(v===B?'bl ':'')+(i===head?'hd ':'')+(i===wrote?'wr':'')+'">'+(v===B?'·':v)+'</span>';}
    $('tmC').innerHTML=c;
    $('tmSt').innerHTML='<span>Zustand <b>'+st+'</b></span><span>Schritte <b>'+steps+'</b></span><span>Kopf an Feld <b>'+head+'</b></span>';
    const r=p.halt[st]?null:rule();
    $('tmT').innerHTML='<tr><th>Zustand</th><th>liest</th><th>schreibt</th><th>geht</th><th>neuer Zustand</th></tr>'+p.r.map(x=>'<tr class="'+(r===x?'on':'')+'"><td>'+x[0]+'</td><td>'+(x[1]===B?'·':x[1])+'</td><td>'+(x[2]===B?'·':x[2])+'</td><td>'+(x[3]==='R'?'rechts':'links')+'</td><td>'+x[4]+'</td></tr>').join('');
    const v=$('tmV');
    if(p.halt[st]){v.className='verd yes';v.innerHTML='<b>'+p.halt[st]+'</b>';stop();}
    else if(!r){v.className='verd no';v.innerHTML='<b>Keine Regel für Zustand '+st+' und Zeichen „'+((tape.get(head)||B)===B?'·':tape.get(head))+'“.</b> Die Maschine bleibt stehen, ohne einen Haltezustand zu erreichen – das zählt als Ablehnung.';stop();}
    else{v.className='verd';v.innerHTML='Nächste Regel: im Zustand <b>'+r[0]+'</b> „'+(r[1]===B?'·':r[1])+'“ lesen → „'+(r[2]===B?'·':r[2])+'“ schreiben, nach '+(r[3]==='R'?'rechts':'links')+', weiter in <b>'+r[4]+'</b>.';}}
  $('tmStep').addEventListener('click',()=>{stop();step();});
  $('tmRun').addEventListener('click',()=>{if(timer){stop();return;}const p=P[k];if(p.halt[st]||!rule())reset();$('tmRun').textContent='Anhalten';timer=setInterval(()=>{if(!step())stop();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?40:220);});
  $('tmReset').addEventListener('click',reset);
  $('tmIn').addEventListener('input',()=>{const f=P[k].filt($('tmIn').value).slice(0,16);if(f!==$('tmIn').value)$('tmIn').value=f;reset();});
  window.addEventListener('resize',()=>draw());
  const bs=[...document.querySelectorAll('#tmS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;$('tmD').textContent=P[k].d;$('tmIn').value=P[k].in;$('tmIn').disabled=k==='bb';$('tmIn').placeholder=k==='bb'?'leeres Band':'';reset();}));
  $('tmD').textContent=P[k].d;$('tmIn').value=P[k].in;reset();
  window.__tmAnbn=P.anbn;
})();

// ---------- Schrittzahl ----------
(function(){
  const $=id=>document.getElementById(id);
  const P=window.__tmAnbn,B='_';
  function run(n){const t=new Map();const s='a'.repeat(n)+'b'.repeat(n);[...s].forEach((c,i)=>t.set(i,c));let h=0,st='q0',k=0;while(st!=='ja'&&k<1e6){const r=P.r.find(x=>x[0]===st&&x[1]===(t.get(h)||B));if(!r)break;t.set(h,r[2]);h+=r[3]==='R'?1:-1;st=r[4];k++;}return k;}
  const S=[];for(let n=1;n<=30;n++)S.push(run(n));
  function draw(){const n=+$('stN').value;$('stNo').textContent=n;
    const W=480,H=170,pl=40,pb=22,pt=10,mx=S[29],bw=(W-pl-8)/30,y=v=>H-pb-(H-pb-pt)*v/mx;let g='';
    for(let k=0;k<=4;k++){const v=mx*k/4;g+='<line x1="'+pl+'" x2="'+(W-4)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(pl-4)+'" y="'+(y(v)+3)+'" text-anchor="end" font-size="9" fill="var(--muted)">'+Math.round(v)+'</text>';}
    S.forEach((v,i)=>{const X=pl+i*bw+1,on=i===n-1;g+='<rect x="'+X+'" y="'+y(v)+'" width="'+(bw-2)+'" height="'+(H-pb-y(v))+'" fill="'+(on?'var(--accent-2)':'var(--accent)')+'" opacity="'+(on?1:.55)+'"/>';
      const lin=2*(i+1);g+='<rect x="'+X+'" y="'+y(lin)+'" width="'+(bw-2)+'" height="'+Math.max(1,H-pb-y(lin))+'" fill="var(--ok)"/>';
      if((i+1)%5===0)g+='<text x="'+(X+bw/2)+'" y="'+(H-6)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+(i+1)+'</text>';});
    g+='<text x="'+(pl+6)+'" y="'+(pt+10)+'" font-size="9.5" fill="var(--accent)">▮ Turingmaschine</text><text x="'+(pl+100)+'" y="'+(pt+10)+'" font-size="9.5" fill="var(--ok)">▮ ein Durchlauf (2n)</text>';
    $('stSvg').innerHTML=g;
    const s=S[n-1];$('stNt').innerHTML='Für n = '+n+' (also '+(2*n)+' Zeichen) braucht die Maschine <b>'+s.toLocaleString('de-DE')+' Schritte</b>, ein einfacher Durchlauf '+(2*n)+'. Das Verhältnis wächst mit n: Verdoppelt sich die Eingabe, vervierfacht sich ungefähr die Arbeit der Maschine.';}
  $('stN').addEventListener('input',draw);draw();
})();
