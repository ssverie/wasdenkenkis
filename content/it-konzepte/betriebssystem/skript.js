// ---------- Schichten ----------
(function(){
  const info=[
    ['Programme','Das, wofür man den Computer eigentlich hat. Programme laufen im Benutzermodus: Sie dürfen rechnen und ihren eigenen Speicher benutzen – für alles andere müssen sie das Betriebssystem fragen.'],
    ['Oberfläche & Dienste','Fenster, Taskleiste, Dateimanager und viele Hintergrunddienste (Druck, Updates, Netzwerk-Konfiguration). Sie gehören zum Betriebssystem im weiteren Sinn, sind aber selbst ganz normale Programme im Benutzermodus.'],
    ['Bibliotheken','Fertige Bausteine, die den Umgang mit dem Kernel bequem machen. Ein Programm ruft etwa fopen() oder CreateFile() auf – die Bibliothek formuliert daraus den passenden Systemaufruf.'],
    ['Systemaufrufe','Die einzige erlaubte Tür nach unten. Ein spezieller Prozessorbefehl wechselt in den Kernelmodus und springt an eine feste, vom Kernel bestimmte Stelle. Linux kennt einige hundert solcher Aufrufe – etwa open, read, write, fork.'],
    ['Kernel','Das eigentliche Betriebssystem. Er verwaltet Prozesse, verteilt Rechenzeit, übersetzt Speicheradressen, organisiert Dateisysteme und Netzwerk und prüft bei jedem Aufruf: Darf dieser Prozess das?'],
    ['Treiber','Gerätespezifischer Code, der dem Kernel erklärt, wie genau diese Grafikkarte oder dieser WLAN-Chip angesprochen wird. Laufen meist im Kernelmodus – ein Fehler hier kann das ganze System abstürzen lassen.'],
    ['Hardware','Prozessor, Arbeitsspeicher, SSD, Netzwerkkarte, Bildschirm. Sie kann nur einfache Befehle – das ganze Konzept von Dateien, Fenstern und Programmen entsteht erst in den Schichten darüber.']
  ];
  const btns=[...document.querySelectorAll('#layers .layer')];
  const out=document.getElementById('layinfo');
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    const [t,d]=info[+b.dataset.i];
    out.innerHTML='<b>'+t+'</b>'+d;
  }));
})();

// ---------- Speichern-Reise ----------
(function(){
  const steps=[
    {l:'hw',m:'h',lt:'Tastatur meldet: Strg+S',t:'Du drückst <kbd>Strg</kbd>+<kbd>S</kbd>. Die Tastatur löst einen Interrupt aus – die CPU unterbricht, was sie gerade tut.'},
    {l:'drv',m:'k',lt:'Tastaturtreiber liest Tastencode',t:'Der Tastaturtreiber im Kernel liest den Tastencode aus. Über das Fenstersystem landet die Nachricht „Strg+S gedrückt“ beim Editor, der gerade im Vordergrund ist.'},
    {l:'app',m:'u',lt:'Editor bereitet die Bytes vor',t:'Der Editor wandelt deinen Text in Bytes um. Alles im Benutzermodus – direkt auf die SSD schreiben darf er nicht.'},
    {l:'lib',m:'u',lt:'write(datei, bytes)',t:'Er ruft die Bibliotheksfunktion zum Schreiben auf. Die Bibliothek legt die Argumente in Register und führt den speziellen Befehl für den Systemaufruf aus.'},
    {l:'kern',m:'k',lt:'Darf Prozess 4711 das?',t:'Die CPU wechselt in den Kernelmodus. Der Kernel prüft: Hat dieser Prozess die Datei zum Schreiben geöffnet? Hat er die Rechte dafür? Wenn nicht, kommt ein Fehler zurück – „Zugriff verweigert“.'},
    {l:'fs',m:'k',lt:'Daten in den Seitencache',t:'Das Dateisystem kopiert die Bytes in den Seitencache – einen Zwischenspeicher im RAM – und merkt sich, dass sie noch auf die Platte müssen.'},
    {l:'app',m:'u',lt:'„Gespeichert ✓“',t:'Der Systemaufruf kehrt zurück, die CPU ist wieder im Benutzermodus. Der Editor zeigt „Gespeichert“. <b>Aber:</b> Auf der SSD ist noch nichts.'},
    {l:'hw',m:'h',lt:'SSD schreibt die Blöcke',t:'Einige Sekunden später – oder sofort, wenn das Programm fsync aufruft – schickt der Kernel die Blöcke über den Treiber an die SSD. Erst jetzt übersteht die Datei einen Stromausfall.'}
  ];
  const lanes={};document.querySelectorAll('#lanes .lane').forEach(e=>lanes[e.dataset.l]=e);
  const txt=document.getElementById('steptxt'),prog=document.getElementById('sProg');
  const prev=document.getElementById('sPrev'),next=document.getElementById('sNext');
  const ML={u:['u','Benutzermodus'],k:['k','Kernelmodus'],h:['h','Hardware']};
  let i=0;
  function draw(){
    Object.values(lanes).forEach(e=>{e.classList.remove('on');e.querySelector('.lt').textContent='';});
    const s=steps[i];
    // Spur der bisherigen Schritte leise zeigen
    for(let j=0;j<i;j++){const e=lanes[steps[j].l].querySelector('.lt');if(!e.textContent)e.textContent=steps[j].lt;}
    lanes[s.l].classList.add('on');lanes[s.l].querySelector('.lt').textContent=s.lt;
    txt.innerHTML='<span class="mode '+ML[s.m][0]+'">'+ML[s.m][1]+'</span><br>'+s.t;
    prog.textContent='Schritt '+(i+1)+' von '+steps.length;
    prev.disabled=i===0;next.textContent=i===steps.length-1?'Von vorn ↺':'Weiter →';
  }
  next.addEventListener('click',()=>{i=i===steps.length-1?0:i+1;draw();});
  prev.addEventListener('click',()=>{if(i>0){i--;draw();}});
  draw();
})();

// ---------- Scheduler ----------
(function(){
  const P=[{n:'Musik',k:'A',len:3},{n:'Browser',k:'B',len:4},{n:'Compiler',k:'C',len:8},{n:'Scanner',k:'D',len:3}];
  let strat='rr',cores=1,q=2;
  const g=document.getElementById('gantt'),st=document.getElementById('schstats'),note=document.getElementById('schnote');
  document.getElementById('plegend').innerHTML=P.map(p=>'<span><i class="p'+p.k+'"></i>'+p.k+' = '+p.n+' ('+p.len+' Einheiten)</span>').join('');
  function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset.v);run();}));}
  seg('sStrat',v=>strat=v);seg('sCores',v=>cores=+v);
  const qi=document.getElementById('sQ'),qo=document.getElementById('sQo');
  qi.addEventListener('input',()=>{q=+qi.value;qo.textContent=q+(q===1?' Einheit':' Einheiten');run();});
  function sim(){
    const rem=P.map(p=>p.len),first=P.map(()=>-1),done=P.map(()=>-1);
    const queue=[0,1,2,3];const cs=[];for(let c=0;c<cores;c++)cs.push({p:-1,used:0});
    const tl=cs.map(()=>[]);let t=0,switches=0;const Q=strat==='fcfs'?Infinity:q;
    while(done.some(d=>d<0)&&t<100){
      // abgelaufene Zeitscheiben zurück in die Warteschlange
      cs.forEach(c=>{if(c.p>=0&&rem[c.p]>0&&c.used>=Q){queue.push(c.p);c.p=-1;}});
      cs.forEach(c=>{if(c.p<0&&queue.length){const n=queue.shift();if(c.last!==undefined&&c.last!==n)switches++;c.p=n;c.used=0;}});
      cs.forEach((c,ci)=>{
        if(c.p<0){tl[ci].push(-1);return;}
        if(first[c.p]<0)first[c.p]=t;
        tl[ci].push(c.p);rem[c.p]--;c.used++;c.last=c.p;
        if(rem[c.p]===0){done[c.p]=t+1;c.p=-1;}
      });
      t++;
    }
    return {tl,first,done,switches,T:t};
  }
  function run(){
    document.querySelector('#sQ').closest('div').style.opacity=strat==='fcfs'?.4:1;
    qi.disabled=strat==='fcfs';
    const r=sim();
    const cols='repeat('+r.T+',minmax(0,1fr))';
    let h='';
    r.tl.forEach((row,ci)=>{
      h+='<div class="grow"><div class="gl">Kern '+(ci+1)+'</div><div class="gcells" style="grid-template-columns:'+cols+'">'+
        row.map((p,k)=>p<0?'<span class="idle" style="animation-delay:'+(k*35)+'ms">·</span>':'<span class="p'+P[p].k+'" style="animation-delay:'+(k*35)+'ms">'+P[p].k+'</span>').join('')+'</div></div>';
    });
    h+='<div class="grow"><div class="gl">Zeit</div><div class="gaxis" style="grid-template-columns:'+cols+'">'+r.tl[0].map((_,k)=>'<span>'+(k%2===0?k:'')+'</span>').join('')+'</div></div>';
    g.innerHTML=h;
    const avg=a=>(a.reduce((s,x)=>s+x,0)/a.length).toLocaleString('de-DE',{maximumFractionDigits:1});
    st.innerHTML='<div><b>'+avg(r.first)+'</b>Ø Wartezeit bis zur ersten Reaktion</div><div><b>'+avg(r.done)+'</b>Ø Zeit bis fertig</div><div><b>'+r.switches+'</b>Wechsel zwischen Prozessen</div>';
    let n;
    if(strat==='fcfs') n='Ohne Zeitscheiben kommt der Scanner (D) erst nach <b>'+r.first[3]+'</b> Einheiten überhaupt dran. Auf einem echten Rechner hieße das: Er reagiert nicht – obwohl er nur 3 Einheiten Arbeit hat.';
    else if(q===1) n='Kürzeste Zeitscheiben: Jeder kommt sofort dran – aber es wird ständig gewechselt. Jeder Wechsel kostet in Wirklichkeit Zeit, die hier nicht einmal eingerechnet ist.';
    else if(q>=6) n='Sehr lange Zeitscheiben: Das Verhalten nähert sich „einer nach dem anderen“. Wenig Wechsel, aber lange Wartezeiten.';
    else n='Zeitscheiben verteilen die Wartezeit fair: Alle reagieren früh, auch wenn einzelne Prozesse etwas später fertig werden. Probier 1 und 6 – und schalte einen zweiten Kern dazu.';
    if(cores===2) n+=' Mit zwei Kernen laufen wirklich zwei Prozesse gleichzeitig – der Rest muss weiter warten.';
    note.innerHTML=n;
  }
  run();
})();

// ---------- Virtueller Speicher ----------
(function(){
  let A,B,F,swapA;
  function reset(){
    // Rahmen: owner (A,B,S=geteilt,K=Kernel,null=frei), label
    F=[{o:'B',l:'B · Seite 0'},{o:'B',l:'B · Seite 1'},{o:'A',l:'A · Seite 0'},{o:'K',l:'Kernel'},{o:'S',l:'Bibliothek (geteilt)'},{o:null,l:'frei'}];
    A=[{f:2,what:'Programmcode'},{f:4,what:'Bibliothek'},{f:'swap',what:'alte Daten'},{f:null,what:'nicht zugeordnet'}];
    B=[{f:0,what:'Programmcode'},{f:1,what:'Daten'},{f:4,what:'Bibliothek'},{f:null,what:'nicht zugeordnet'}];
    swapA=true;draw();
    document.getElementById('vmout').className='vm-out';
    document.getElementById('vmout').innerHTML='Klick auf eine Seite von Prozess A oder B – das Betriebssystem übersetzt die Adresse.';
  }
  const hex=n=>'0x'+(n*0x1000).toString(16).toUpperCase().padStart(4,'0');
  function draw(sel){
    const mk=(arr,k)=>arr.map((p,i)=>'<button class="vp '+k.toLowerCase()+(sel&&sel[0]===k&&sel[1]===i?' sel':'')+'" data-p="'+k+'" data-i="'+i+'">'+hex(i)+'<small>'+p.what+'</small></button>').join('');
    document.getElementById('vmA').innerHTML=mk(A,'A');
    document.getElementById('vmB').innerHTML=mk(B,'B');
    document.getElementById('frames').innerHTML=F.map((f,i)=>'<div class="fr '+(f.o?'own'+f.o:'free')+'" data-f="'+i+'"><b>Rahmen '+i+'</b>'+f.l+'</div>').join('');
    document.getElementById('swap').innerHTML='Auslagerung auf SSD: '+(swapA?'A · Seite 2':'leer');
    document.querySelectorAll('.vp').forEach(b=>b.addEventListener('click',()=>access(b.dataset.p,+b.dataset.i)));
  }
  function hit(f){const e=document.querySelector('.fr[data-f="'+f+'"]');if(e)e.classList.add('hit');}
  function access(k,i){
    const tbl=k==='A'?A:B,p=tbl[i],out=document.getElementById('vmout');
    if(p.f===null){draw([k,i]);out.className='vm-out err';
      out.innerHTML='<b>Prozess '+k+' liest '+hex(i)+'</b> – diese Seite steht nicht in seiner Seitentabelle. Die CPU meldet einen Fehler, der Kernel beendet das Programm: <code>Segmentation fault</code>. Genau so wird verhindert, dass ein Programm in fremdem Speicher stöbert.';return;}
    if(p.f==='swap'){
      const free=F.findIndex(f=>f.o===null);
      F[free]={o:'A',l:'A · Seite 2'};p.f=free;swapA=false;draw([k,i]);hit(free);out.className='vm-out pf';
      out.innerHTML='<b>Seitenfehler!</b> '+hex(i)+' von Prozess A war auf die SSD ausgelagert. Der Kernel hält A an, lädt die Seite in den freien Rahmen '+free+', trägt sie in die Seitentabelle ein und lässt A weiterlaufen. A merkt davon nur eine Verzögerung – Mikro- bis Millisekunden statt Nanosekunden. Klick noch einmal: Jetzt geht es sofort.';return;}
    draw([k,i]);hit(p.f);out.className='vm-out';
    let x='<b>Prozess '+k+' liest '+hex(i)+'</b> → Seitentabelle von '+k+' → <b>Rahmen '+p.f+'</b> (echte Adresse '+hex(p.f)+').';
    if(i===0) x+=' Beide Prozesse benutzen dieselbe virtuelle Adresse '+hex(0)+' – landen aber in verschiedenen Rahmen. Probier es beim anderen Prozess.';
    if(F[p.f].o==='S') x+=' Dieser Rahmen erscheint in <em>beiden</em> Seitentabellen: Die Bibliothek liegt nur einmal im Speicher, obwohl zwei Programme sie benutzen – bei A unter '+hex(1)+', bei B unter '+hex(2)+'.';
    out.innerHTML=x;
  }
  document.getElementById('vmReset').addEventListener('click',reset);
  reset();
})();
