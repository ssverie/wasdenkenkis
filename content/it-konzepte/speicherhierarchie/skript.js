// ---------- Pyramide ----------
(function(){
  const L=[
    ['Register','wenige hundert Byte pro Kern','unter 1 ns (im Takt)','Die Arbeitsplätze des Rechenwerks. Hier stehen die Werte, mit denen gerade gerechnet wird. Der Compiler entscheidet, was hier liegt.','die Zahl, die du gerade im Kopf hast'],
    ['L1-Cache','32–128 KB pro Kern, getrennt für Befehle und Daten','etwa 1 ns (4–5 Takte)','Direkt am Rechenwerk. Ein Treffer hier ist fast so gut wie ein Register.','der Schreibtisch'],
    ['L2-Cache','1–4 MB pro Kern, bei manchen Chips mehreren Kernen gemeinsam','etwa 3–5 ns','Etwas größer, etwas weiter weg. Fängt ab, was im L1 keinen Platz mehr hat.','das Regal hinter dir'],
    ['L3-Cache','8–100 MB, geteilt von allen Kernen','etwa 10–20 ns','Die gemeinsame letzte Stufe vor dem Arbeitsspeicher. Hier treffen sich die Daten der Kerne.','die Bibliothek im Haus'],
    ['Arbeitsspeicher (RAM)','8–128 GB','etwa 80–120 ns','Hier liegen alle laufenden Programme und ihre Daten. Flüchtig: Ohne Strom ist alles weg.','das Archiv im Keller'],
    ['SSD','0,5–4 TB','etwa 20–100 µs','Dauerhafter Speicher für Programme und Dateien. Tausendmal langsamer als RAM, aber er vergisst nichts.','das Lager in einer anderen Stadt']
  ];
  const svg=document.getElementById('pyrsvg'),info=document.getElementById('pyrinfo');
  const fills=['#1f3f99','#2f5bd3','#4f78e0','#7c9cf0','#b4540a','#8a3e06'];
  const H=46,top=8,cx=300;
  let h='';
  L.forEach((l,i)=>{
    const y=top+i*H,w0=60+i*90,w1=60+(i+1)*90;
    const pts=[[cx-w0/2,y],[cx+w0/2,y],[cx+w1/2,y+H-4],[cx-w1/2,y+H-4]].map(p=>p.join(',')).join(' ');
    h+='<g class="lv" data-i="'+i+'" tabindex="0" role="button" aria-label="'+l[0]+'"><polygon points="'+pts+'" fill="'+fills[i]+'" opacity="'+(0.22+0.1*(i%2))+'" stroke="var(--line)"/>'+
      '<text class="lt" x="'+cx+'" y="'+(y+19)+'" text-anchor="middle">'+l[0]+'</text><text class="ls" x="'+cx+'" y="'+(y+34)+'" text-anchor="middle">'+l[2]+'</text></g>';
  });
  h+='<text class="ls" x="8" y="20">schnell, klein, teuer</text><text class="ls" x="8" y="'+(top+6*H-8)+'">langsam, groß, billig</text>';
  svg.innerHTML=h;
  svg.querySelectorAll('.lv').forEach(g=>{
    const f=()=>{svg.querySelectorAll('.lv').forEach(x=>x.classList.remove('sel'));g.classList.add('sel');const l=L[+g.dataset.i];
      info.innerHTML='<b>'+l[0]+'</b>'+l[3]+'<dl><dt>Größe</dt><dd>'+l[1]+'</dd><dt>Zugriff</dt><dd>'+l[2]+'</dd><dt>Im Bild</dt><dd>'+l[4]+'</dd></dl>';};
    g.addEventListener('click',f);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}});
  });
})();

// ---------- Cache-Simulator ----------
(function(){
  const $=id=>document.getElementById(id);
  const LINES=16,PER=8,SLOTS=4,N=64;
  // feste "zufällige" Folge, damit Ergebnisse reproduzierbar sind
  let seed=7;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  const perm=n=>{const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const listCells=perm(LINES*PER).slice(0,N);  // Knoten verstreut über den ganzen Speicher
  const rndIdx=[...Array(N)].map(()=>Math.floor(rnd()*N));
  const PAT={
    seq:{seq:[...Array(N).keys()],cells:[...Array(N).keys()],note:'Der Reihe nach: Jeder Fehlschlag lädt eine ganze Line, die nächsten 7 Zugriffe sind Treffer. Ein echter Prefetcher würde sogar die Fehlschläge noch verstecken.'},
    col:{seq:(()=>{const s=[];for(let c=0;c<8;c++)for(let r=0;r<8;r++)s.push(r*8+c);return s;})(),cells:[...Array(N).keys()],note:'Eine 8×8-Matrix, Spalte für Spalte gelesen: Jeder Zugriff springt in die nächste Zeile – also in eine andere Cache-Line. Bis die Spalte durch ist, sind die ersten Lines schon wieder verdrängt.'},
    list:{seq:listCells,cells:listCells,note:'Eine verkettete Liste: Die Knoten liegen verstreut im Heap. Fast jeder Schritt landet in einer Line, die gerade nicht im Cache ist – und der nächste Knoten ist erst bekannt, wenn der aktuelle geladen ist.'},
    rnd:{seq:rndIdx,cells:[...Array(N).keys()],note:'Zufällige Zugriffe auf ein Array – etwa über einen Index oder eine Hash-Tabelle: Die Daten liegen dicht, aber die Reihenfolge verschenkt die räumliche Lokalität.'}
  };
  let pat='seq',i,cache,hits,miss,last,timer=null;
  function reset(){stop();i=0;cache=[];hits=0;miss=0;last=null;draw();}
  function access(){
    if(i>=PAT[pat].seq.length)return false;
    const addr=PAT[pat].seq[i],line=Math.floor(addr/PER);
    const k=cache.indexOf(line);
    if(k>=0){hits++;cache.splice(k,1);cache.push(line);last={addr,line,hit:true};}
    else{miss++;if(cache.length>=SLOTS)cache.shift();cache.push(line);last={addr,line,hit:false};}
    i++;return true;
  }
  function draw(){
    const p=PAT[pat],used=new Set(p.cells),seen=new Set(p.seq.slice(0,i));
    let h='';
    for(let l=0;l<LINES;l++){
      h+='<div class="line'+(cache.includes(l)?' inc':'')+'"><span class="ln">'+l+'</span>';
      for(let j=0;j<PER;j++){const a=l*PER+j;
        let cls='c';if(used.has(a))cls+=pat==='list'?' node':' arr';if(seen.has(a))cls+=' seen';if(last&&last.addr===a)cls+=' cur';
        h+='<span class="'+cls+'"></span>';}
      h+='</div>';
    }
    $('ram').innerHTML=h;
    let c='';for(let s=0;s<SLOTS;s++){const l=cache[s];
      c+='<div class="slot'+(l===undefined?'':' full')+(last&&l===last.line?(last.hit?' hit':' miss'):'')+'">'+(l===undefined?'leer':'Line '+l+(last&&l===last.line?(last.hit?' · Treffer':' · neu geladen'):''))+'</div>';}
    $('cache').innerHTML=c;
    const t=hits*1+miss*100,best=8*100+56;
    $('simstats').innerHTML='<div>Zugriffe<b>'+i+' / '+N+'</b></div><div class="ok">Treffer<b>'+hits+'</b></div><div class="bad">Fehlschläge<b>'+miss+'</b></div><div>Zeit, geschätzt<b>'+t.toLocaleString('de-DE')+' ns</b></div>';
    $('simnote').innerHTML=i>=N?p.note+' <b>Ergebnis: '+t.toLocaleString('de-DE')+' ns'+(pat==='seq'?'.':' – '+(t/best).toLocaleString('de-DE',{maximumFractionDigits:1})+'-mal so lange wie der Reihe nach.')+'</b>':(i===0?'Wähle ein Zugriffsmuster und spiel es ab.':p.note);
    $('simStep').disabled=$('simAll').disabled=i>=N;$('simPlay').disabled=i>=N;
  }
  function stop(){if(timer){clearInterval(timer);timer=null;$('simPlay').textContent='Abspielen';}}
  $('simPlay').addEventListener('click',()=>{if(timer){stop();return;}$('simPlay').textContent='Pause';timer=setInterval(()=>{if(!access()){stop();}draw();},140);});
  $('simStep').addEventListener('click',()=>{stop();access();draw();});
  $('simAll').addEventListener('click',()=>{stop();while(access());draw();});
  $('simReset').addEventListener('click',reset);
  const bs=[...document.querySelectorAll('#pat button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');pat=b.dataset.p;reset();}));
  reset();
})();
