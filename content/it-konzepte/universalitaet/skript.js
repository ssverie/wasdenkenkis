// ---------- Universelle Maschine ----------
(function(){
  const $=id=>document.getElementById(id);
  const P={
    add:{src:'q0 1 1 R q0\nq0 + 1 R q1\nq1 1 1 R q1\nq1 _ _ L q2\nq2 1 _ L halt',in:'11+111'},
    inc:{src:'rechts 0 0 R rechts\nrechts 1 1 R rechts\nrechts _ _ L carry\ncarry 1 0 L carry\ncarry 0 1 L zurueck\ncarry _ 1 L zurueck\nzurueck 0 0 L zurueck\nzurueck 1 1 L zurueck\nzurueck _ _ R halt',in:'1011'},
    bb:{src:'A _ 1 R B\nA 1 1 L B\nB _ 1 L A\nB 1 1 R halt',in:''},
    loop:{src:'A _ _ R A\nA 1 1 R A',in:'1'}
  };
  const LIMIT=2000;let rules,start,tape,head,st,steps,err;
  function parse(){const lines=$('uSrc').value.split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('#'));rules=new Map();start=null;err=null;
    for(const l of lines){const p=l.split(/\s+/);if(p.length!==5||!/^[LR]$/i.test(p[3])||p[1].length!==1||p[2].length!==1){err='Zeile „'+l.replace(/</g,'&lt;')+'“ hat nicht das Format: Zustand liest schreibt L/R neu';break;}if(!start)start=p[0];rules.set(p[0]+'\u0000'+p[1],[p[2],p[3].toUpperCase(),p[4]]);}
    if(!start&&!err)err='Keine Regeln.';
    // Kodierung
    if(!err){const enc=[...rules].map(([k,v])=>{const [z,c]=k.split('\u0000');return z+'<i>,</i>'+c+'<i>,</i>'+v[0]+'<i>,</i>'+v[1]+'<i>,</i>'+v[2];}).join('<i>;</i>');
      const plain=[...rules].map(([k,v])=>k.replace('\u0000',',')+','+v.join(',')).join(';');
      $('uEnc').innerHTML=enc+'<i>#</i>'+($('uIn').value||'ε').replace(/</g,'&lt;');
      const bits=new TextEncoder().encode(plain).length*8;
      $('uEncH').innerHTML=rules.size+' Regeln = '+plain.length+' Zeichen. Als Bitfolge sind das '+bits+' Bits – die Maschine ist also eine (sehr große) Zahl. Hinter dem <b>#</b> folgt die Eingabe.';}
    else{$('uEnc').innerHTML='—';$('uEncH').textContent='';}}
  function reset(){parse();tape=new Map();[...$('uIn').value].forEach((c,i)=>tape.set(i,c));head=0;st=start;steps=0;draw();}
  function rule(){return rules.get(st+'\u0000'+(tape.get(head)||'_'));}
  function step(){if(err||st==='halt')return false;const r=rule();if(!r)return false;tape.set(head,r[0]);head+=r[1]==='R'?1:-1;st=r[2];steps++;return st!=='halt'&&!!rule();}
  function draw(){const W=window.innerWidth<520?9:15,h=Math.floor(W/2);let c='';
    for(let i=head-h;i<=head+h;i++){const v=tape.get(i)||'_';c+='<span class="'+(v==='_'?'bl ':'')+(i===head?'hd':'')+'">'+(v==='_'?'·':v.replace(/</g,'&lt;'))+'</span>';}
    $('uC').innerHTML=c;const v=$('uV');
    const out=()=>{const ks=[...tape.keys()].filter(i=>(tape.get(i)||'_')!=='_');if(!ks.length)return 'leer';let s='';for(let i=Math.min(...ks);i<=Math.max(...ks);i++)s+=tape.get(i)||'_';return '<code>'+s.replace(/</g,'&lt;')+'</code>';};
    if(err){v.className='verd no';v.innerHTML=err;}
    else if(st==='halt'){v.className='verd yes';v.innerHTML='<b>Angehalten</b> nach '+steps+' Schritten. Auf dem Band steht: '+out();}
    else if(!rule()){v.className='verd no';v.innerHTML='<b>Stehengeblieben</b> nach '+steps+' Schritten: keine Regel für Zustand <b>'+st+'</b> und Zeichen „'+(tape.get(head)||'_')+'“. Band: '+out();}
    else if(steps>=LIMIT){v.className='verd no';v.innerHTML='<b>Nach '+LIMIT+' Schritten abgebrochen.</b> Hält die Maschine nie an – oder erst später? Der Simulator kann es nicht wissen. Siehe <a href="/it-konzepte/berechenbarkeit/">G4</a>.';}
    else{v.className='verd';v.innerHTML='Zustand <b>'+st+'</b> · '+steps+' Schritte'+(steps===0?' · Startzustand ist die erste Zeile':'');}}
  $('uStep').addEventListener('click',()=>{if(steps<LIMIT){step();draw();}});
  $('uRun').addEventListener('click',()=>{while(steps<LIMIT&&step());draw();});
  $('uReset').addEventListener('click',reset);
  $('uSrc').addEventListener('input',reset);
  $('uIn').addEventListener('input',()=>{if($('uIn').value.length>20)$('uIn').value=$('uIn').value.slice(0,20);reset();});
  window.addEventListener('resize',draw);
  const bs=[...document.querySelectorAll('#uP button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');$('uSrc').value=P[b.dataset.k].src;$('uIn').value=P[b.dataset.k].in;reset();}));
  $('uSrc').value=P.add.src;$('uIn').value=P.add.in;reset();
})();

// ---------- Quiz ----------
(function(){
  const $=id=>document.getElementById(id);
  const Q=[
    ['Conways „Game of Life“',1,'Aus Gleitern und Kanonen lassen sich Logikgatter und Speicher bauen; es wurden sogar vollständige Turingmaschinen im Spielfeld konstruiert.'],
    ['Reguläre Ausdrücke im strengen Sinn',0,'Sie entsprechen endlichen Automaten (<a href="/it-konzepte/formale-sprachen/">G1</a>) – sie können nicht einmal Klammern zählen.'],
    ['SQL mit <code>WITH RECURSIVE</code>',1,'Mit rekursiven Abfragen kann SQL Schleifen ausdrücken und damit eine Turingmaschine simulieren. Ohne Rekursion ist SQL bewusst schwächer – jede Abfrage endet.'],
    ['JSON',0,'Ein reines Datenformat: Es beschreibt Werte, aber keine Berechnung.'],
    ['Das Typsystem von Java (Generics)',1,'2017 wurde gezeigt: Mit geschickt verschachtelten Generics kann man den Typprüfer des Compilers eine Turingmaschine simulieren lassen – er kann dabei sogar endlos laufen.'],
    ['Excel-Formeln mit <code>LAMBDA</code>',1,'Seit Excel eigene Funktionen per LAMBDA erlaubt, die sich selbst aufrufen können, sind Formeln Turing-vollständig – so stellte es Microsoft 2021 selbst vor.'],
    ['Der x86-Befehl <code>MOV</code> allein',1,'2013 gezeigt: Nur mit Kopierbefehlen und geschickter Adressierung lässt sich jede Berechnung ausdrücken. Es gibt sogar einen Compiler, der nur MOV erzeugt.'],
    ['eBPF-Programme im Linux-Kern',0,'Bewusst nicht: Der Kern lässt nur Programme zu, deren Ende ein Prüfer vorab nachweisen kann. Schleifen sind nur mit fester Obergrenze erlaubt.'],
    ['Regel 110 – ein eindimensionaler Zellautomat',1,'Jede Zelle ist 0 oder 1, die neue Generation hängt nur von drei Nachbarn ab. Matthew Cook bewies, dass dieses winzige System universell ist.'],
    ['HTML ohne JavaScript',0,'HTML beschreibt die Struktur eines Dokuments. Es hat keine Schleifen und keine Bedingungen.']
  ];
  const A=Q.map(()=>null);
  $('tq').innerHTML=Q.map((q,i)=>'<div id="tq'+i+'"><div class="top"><span>'+q[0]+'</span><span class="yn" data-i="'+i+'"><button data-v="1">Ja</button><button data-v="0">Nein</button></span></div><div class="ex"></div></div>').join('');
  function score(){const done=A.filter(a=>a!==null).length,right=A.filter((a,i)=>a!==null&&a===Q[i][1]).length;$('tqS').textContent=done?right+' von '+done+' richtig'+(done===Q.length?(right>=8?' – sehr gut.':right>=5?' – ordentlich, Universalität ist oft überraschend.':' – Universalität steckt eben an seltsamen Orten.'):''):'Antworte auf eine Frage, um die Erklärung zu sehen.';}
  document.querySelectorAll('#tq .yn').forEach(g=>{g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const i=+g.dataset.i,v=+b.dataset.v;A[i]=v;g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));const box=$('tq'+i),ok=v===Q[i][1];box.className='done '+(ok?'right':'wrong');box.querySelector('.ex').innerHTML='<b class="'+(ok?'r':'w')+'">'+(ok?'Richtig':'Nicht ganz')+' – '+(Q[i][1]?'Turing-vollständig.':'nicht Turing-vollständig.')+'</b> '+Q[i][2];score();}));});
  score();
})();
