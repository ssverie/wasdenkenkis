// ---------- Race Condition ----------
(function(){
  const plain=['lese count → r','r = r + 1','schreibe r → count'];
  const locked=['sperre Lock','lese count → r','r = r + 1','schreibe r → count','gib Lock frei'];
  let ops,pc,reg,cnt,owner,history;
  const $=id=>document.getElementById(id);
  const useLock=$('useLock');
  function reset(){ops=useLock.checked?locked:plain;pc={A:0,B:0};reg={A:'–',B:'–'};cnt=0;owner=null;history=[];draw();
    $('verdict').className='verdict';$('verdict').innerHTML='Beide Threads führen <code>count++</code> einmal aus. Richtig wäre am Ende 2. Du bist der Scheduler: Wähle, wer als Nächstes einen Schritt machen darf.';}
  function blocked(t){return ops[pc[t]]==='sperre Lock'&&owner&&owner!==t;}
  function draw(){
    ['A','B'].forEach(t=>{
      $('ops'+t).innerHTML=ops.map((o,i)=>'<li class="'+(i<pc[t]?'done':i===pc[t]?(blocked(t)?'wait':'cur'):'')+'">'+o+(i===pc[t]&&blocked(t)?' – wartet':'')+'</li>').join('');
      $('reg'+t).textContent='Register r = '+reg[t];
      const b=$('step'+t);b.disabled=pc[t]>=ops.length||blocked(t);
      b.textContent=pc[t]>=ops.length?t+': fertig':blocked(t)?t+': BLOCKED':t+': nächster Schritt';
    });
    $('cnt').textContent=cnt;
    $('lockInfo').textContent=useLock.checked?(owner?'Lock gehalten von '+owner:'Lock frei'):'kein Lock';
  }
  function step(t){
    const o=ops[pc[t]];
    if(o==='sperre Lock')owner=t;
    else if(o==='gib Lock frei')owner=null;
    else if(o.startsWith('lese'))reg[t]=cnt;
    else if(o.startsWith('r ='))reg[t]=reg[t]+1;
    else if(o.startsWith('schreibe'))cnt=reg[t];
    history.push(t);pc[t]++;draw();
    if(pc.A>=ops.length&&pc.B>=ops.length){
      const v=$('verdict');
      if(cnt===2){v.className='verdict good';v.innerHTML=useLock.checked?'<b>count = 2.</b> Mit Lock kann es gar nicht anders ausgehen: Der zweite Thread musste warten, bis der erste fertig war – egal, wie du geschaltet hast.':'<b>count = 2 – diesmal gut gegangen.</b> Ein Thread war fertig, bevor der andere gelesen hat. Versuch es noch einmal: Lass beide lesen, bevor einer schreibt.';}
      else{v.className='verdict bad';v.innerHTML='<b>count = 1 – eine Erhöhung ist verloren gegangen.</b> Beide haben den alten Wert 0 gelesen, beide haben 1 geschrieben. Das ist ein Lost Update. Schalte jetzt <code>synchronized</code> ein und versuch dasselbe.';}
    }
  }
  $('stepA').addEventListener('click',()=>step('A'));
  $('stepB').addEventListener('click',()=>step('B'));
  $('raceReset').addEventListener('click',reset);
  useLock.addEventListener('change',reset);
  $('bulk').addEventListener('click',()=>{
    // Zeitscheiben zufälliger Länge; Wechsel kann zwischen jedem Teilschritt fallen
    const N=100000;let c=0;const st={A:{n:0,p:0,r:0},B:{n:0,p:0,r:0}};let cur='A',left=0,lock=null;const L=useLock.checked;
    let guard=0;
    while((st.A.n<N||st.B.n<N)&&guard<5e6){guard++;
      if(left<=0||st[cur].n>=N){cur=cur==='A'?'B':'A';if(st[cur].n>=N)cur=cur==='A'?'B':'A';left=1+Math.floor(Math.random()*400);}
      const s=st[cur];
      if(L){ // ganzer Schritt unter Lock: kann nicht unterbrochen werden, solange wir halten
        if(lock&&lock!==cur){left=0;continue;}
        if(s.p===0){lock=cur;s.r=c;s.p=1;}else if(s.p===1){s.r++;s.p=2;}else{c=s.r;s.p=0;s.n++;lock=null;}
      }else{
        if(s.p===0){s.r=c;s.p=1;}else if(s.p===1){s.r++;s.p=2;}else{c=s.r;s.p=0;s.n++;}
      }
      left--;
    }
    const o=$('bulkOut');o.hidden=false;
    o.innerHTML=L?'Mit Lock: <b>'+c.toLocaleString('de-DE')+'</b> von 200 000 – exakt.':'Ohne Lock: <b>'+c.toLocaleString('de-DE')+'</b> statt 200 000 – <b>'+(200000-c).toLocaleString('de-DE')+'</b> Erhöhungen verloren. Klick noch mal: Jedes Mal ein anderes Ergebnis.';
  });
  reset();
})();

// ---------- Deadlock ----------
(function(){
  const $=id=>document.getElementById(id);
  let steps,pc,hold,want;
  function prog(t){
    let ordered=$('dlOrder').checked;
    const [f,s]=t===1?['A','B']:(ordered?['A','B']:['B','A']);
    return [{op:'lock',k:f,txt:'sperre Konto '+f},{op:'lock',k:s,txt:'sperre Konto '+s},{op:'work',txt:(t===1?'buche A → B':'buche B → A')},{op:'unlock',txt:'gib beide frei'}];
  }
  function reset(){steps={1:prog(1),2:prog(2)};pc={1:0,2:0};hold={A:null,B:null};want={1:null,2:null};draw();
    $('dlv').className='verdict';$('dlv').innerHTML='Durchgezogener Pfeil: Thread hält das Konto. Gestrichelter Pfeil: Thread wartet darauf.';}
  function isBlocked(t){const s=steps[t][pc[t]];return s&&s.op==='lock'&&hold[s.k]&&hold[s.k]!==t;}
  function edges(){
    const P={1:[70,85],2:[390,85]},K={A:[230,30],B:[230,140]};let h='';
    const cut=(c,dx,dy,kind)=>{const d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;const t=kind==='c'?43:Math.min(39/Math.abs(ux||1e-9),24/Math.abs(uy||1e-9));return [c[0]+ux*t,c[1]+uy*t];};
    const line=(a,ka,b,kb,dash,col,mk)=>{const dx=b[0]-a[0],dy=b[1]-a[1];const s=cut(a,dx,dy,ka),e=cut(b,-dx,-dy,kb);
      return '<line x1="'+s[0]+'" y1="'+s[1]+'" x2="'+e[0]+'" y2="'+e[1]+'" stroke="'+col+'" stroke-width="2.5" '+(dash?'stroke-dasharray="6 5"':'')+' marker-end="url(#dlar'+mk+')"/>';};
    // halten: Konto → Thread
    ['A','B'].forEach(k=>{if(hold[k]){const col=hold[k]===1?'#2f5bd3':'#b4540a';h+=line(K[k],'r',P[hold[k]],'c',false,col,hold[k]);}});
    [1,2].forEach(t=>{if(isBlocked(t)){const k=steps[t][pc[t]].k;h+=line(P[t],'c',K[k],'r',true,'#d33a2c','R');}});
    return h;
  }
  function draw(){
    const dead=isBlocked(1)&&isBlocked(2);
    [1,2].forEach(t=>{
      $('dlo'+t).innerHTML=steps[t].map((s,i)=>'<li class="'+(i<pc[t]?'done':i===pc[t]?(isBlocked(t)?'wait':'cur'):'')+'">'+s.txt+'</li>').join('');
      const b=$('dl'+t);const fin=pc[t]>=steps[t].length;b.disabled=fin||isBlocked(t);
      b.textContent=fin?'Thread '+t+': fertig':isBlocked(t)?'Thread '+t+': BLOCKED':'Thread '+t+': nächster Schritt';
      const held=['A','B'].filter(k=>hold[k]===t);
      $('dls'+t).textContent=fin?'fertig':(held.length?'hält '+held.map(k=>'Konto '+k).join(' und '):'hält nichts')+(isBlocked(t)?', wartet auf Konto '+steps[t][pc[t]].k:'');
    });
    $('dlEdges').innerHTML=edges();
    ['A','B'].forEach(k=>$('lk'+k).setAttribute('stroke',hold[k]?(hold[k]===1?'#2f5bd3':'#b4540a'):'var(--line)'));
    const v=$('dlv');
    if(dead){v.className='verdict bad';v.innerHTML='<b>Deadlock.</b> Thread 1 hält A und wartet auf B, Thread 2 hält B und wartet auf A. Die Pfeile bilden einen Kreis – keiner kann je weitermachen. Schalte die feste Reihenfolge ein und versuch es noch einmal.';}
    else if(pc[1]>=steps[1].length&&pc[2]>=steps[2].length){v.className='verdict good';v.innerHTML=$('dlOrder').checked?'<b>Beide fertig.</b> Mit fester Reihenfolge wollen beide zuerst Konto A. Wer es nicht bekommt, wartet – hält aber noch nichts, also kann kein Kreis entstehen.':'<b>Beide fertig – diesmal.</b> Ein Thread hatte beide Konten, bevor der andere anfing. Versuch: Lass beide ihren ersten Schritt machen.';}
  }
  function step(t){const s=steps[t][pc[t]];
    if(s.op==='lock')hold[s.k]=t;else if(s.op==='unlock'){['A','B'].forEach(k=>{if(hold[k]===t)hold[k]=null;});}
    pc[t]++;draw();}
  $('dl1').addEventListener('click',()=>step(1));$('dl2').addEventListener('click',()=>step(2));
  $('dlReset').addEventListener('click',reset);$('dlOrder').addEventListener('change',reset);
  reset();
})();

// ---------- Pool vs. virtuell ----------
(function(){
  const $=id=>document.getElementById(id);
  const NS=[1000,10000,100000,1000000],CORES=8;let kind='io';
  const bs=[...document.querySelectorAll('#kind button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');kind=b.dataset.v;draw();}));
  $('nTasks').addEventListener('input',draw);$('nPool').addEventListener('input',draw);
  const de=n=>n.toLocaleString('de-DE');
  const dur=s=>s<120?de(Math.round(s*10)/10)+' s':s<7200?de(Math.round(s/60))+' min':de(Math.round(s/360)/10)+' h';
  const mem=kb=>kb<1024?de(Math.round(kb))+' KB':kb<1048576?de(Math.round(kb/1024))+' MB':de(Math.round(kb/104857.6)/10)+' GB';
  function draw(){
    const n=NS[+$('nTasks').value],pool=+$('nPool').value;
    $('nTasksO').textContent=de(n);$('nPoolO').textContent=de(pool);
    let tP,tV;
    if(kind==='io'){tP=Math.ceil(n/pool);tV=1;}
    else{tP=Math.ceil(n/CORES);tV=tP;}
    $('outV').className=tV<tP?'win':'';
    $('outP').innerHTML='<h4>Fester Pool (Plattform-Threads)</h4><span class="big">'+dur(tP)+'</span><dl><dt>OS-Threads</dt><dd>'+de(pool)+'</dd><dt>Stack reserviert</dt><dd>'+mem(pool*1024)+'</dd></dl>';
    $('outV').innerHTML='<h4>Virtuelle Threads</h4><span class="big">'+dur(tV)+'</span><dl><dt>Virtuelle Threads</dt><dd>'+de(n)+'</dd><dt>OS-Threads (Carrier)</dt><dd>'+CORES+'</dd><dt>Speicher, grob</dt><dd>'+mem(n*1)+'</dd></dl>';
    let t;
    if(kind==='io') t='Beim Warten gewinnen virtuelle Threads deutlich: Alle '+de(n)+' Aufgaben warten gleichzeitig, und dafür reichen '+CORES+' echte Threads. Der Pool kann nur '+de(pool)+' auf einmal warten lassen. Ihn einfach auf '+de(n)+' Threads zu vergrößern, hieße '+mem(n*1024)+' Stack-Reservierung und '+de(n)+' Threads für den Kernel.';
    else t='Bei Rechenarbeit gibt es keinen Unterschied: Es gibt nur '+CORES+' Kerne, und mehr als '+CORES+' Aufgaben können nicht gleichzeitig rechnen – egal, wie viele Threads man hat.'+(pool>CORES?' Ein Pool mit '+de(pool)+' Threads bringt hier nur zusätzliche Wechsel.':'');
    $('poolNote').innerHTML=t;
  }
  draw();
})();
