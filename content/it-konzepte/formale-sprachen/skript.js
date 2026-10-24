// ---------- DFA ----------
(function(){
  const $=id=>document.getElementById(id);
  const D={
    int:{rx:'Regex: <b>-?[0-9]+</b> · Alphabet: Minus, Ziffern, sonstige Zeichen',start:'S',acc:['Z'],ex:'-2026',
      st:{S:[60,100,'Start'],M:[230,100,'Minus'],Z:[400,100,'Ziffern'],X:[230,200,'Fehler']},h:290,
      cls:c=>c==='-'?'-':(c>='0'&&c<='9'?'0–9':'sonst'),
      tr:{S:{'-':'M','0–9':'Z','sonst':'X'},M:{'-':'X','0–9':'Z','sonst':'X'},Z:{'-':'X','0–9':'Z','sonst':'X'},X:{'-':'X','0–9':'X','sonst':'X'}},
      ed:[['S','M','-',0],['S','Z','0–9',-95],['M','Z','0–9',0],['Z','Z','0–9','down'],['S','X','sonst',0,14],['M','X','- / sonst',0,-36],['Z','X','- / sonst',0,-26],['X','X','alles','down']],
      filt:s=>s},
    ab:{rx:'Regex: <b>[ab]*ab[ab]*</b> · Alphabet: {a, b}',start:'q0',acc:['q2'],ex:'bbaab',
      st:{q0:[80,120,'q0'],q1:[240,120,'q1'],q2:[400,120,'q2']},h:180,
      cls:c=>c,
      tr:{q0:{a:'q1',b:'q0'},q1:{a:'q1',b:'q2'},q2:{a:'q2',b:'q2'}},
      ed:[['q0','q0','b','up'],['q0','q1','a',0],['q1','q1','a','up'],['q1','q2','b',0],['q2','q2','a, b','up']],
      filt:s=>s.replace(/[^ab]/g,'')},
    div3:{rx:'Regex existiert auch: <b>(0|1(01*0)*1)*</b> – der Automat ist deutlich lesbarer · Alphabet: {0, 1}',start:'r0',acc:['r0'],ex:'1001',
      st:{r0:[80,120,'Rest 0'],r1:[240,120,'Rest 1'],r2:[400,120,'Rest 2']},h:180,
      cls:c=>c,
      tr:{r0:{'0':'r0','1':'r1'},r1:{'0':'r2','1':'r0'},r2:{'0':'r1','1':'r2'}},
      ed:[['r0','r0','0','up'],['r0','r1','1',-28],['r1','r0','1',-28],['r1','r2','0',-28],['r2','r1','0',-28],['r2','r2','1','up']],
      filt:s=>s.replace(/[^01]/g,'')}
  };
  const R=26;let k='int',pos=0,cur,lastEdge=null;
  function edgeKey(a,b){return a+'>'+b;}
  function drawSvg(){const d=D[k];let g='<defs><marker id="dfA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker><marker id="dfB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0L10,5L0,10z" fill="var(--accent-2)"/></marker></defs>';
    const P=d.st;
    // Start-Pfeil
    const s0=P[d.start];g+='<path d="M'+(s0[0]-R-24)+' '+s0[1]+'L'+(s0[0]-R-2)+' '+s0[1]+'" stroke="var(--fg)" stroke-width="1.6" marker-end="url(#dfA)"/>';
    d.ed.forEach(e=>{const [a,b,lab,bend]=e,A=P[a],B=P[b],on=lastEdge===edgeKey(a,b);let path,lx,ly;
      if(a===b){const up=bend!=='down',sy=up?-1:1,x=A[0],y=A[1]+sy*R*0.85;path='M'+(x-12)+' '+y+' C'+(x-30)+' '+(y+sy*48)+' '+(x+30)+' '+(y+sy*48)+' '+(x+12)+' '+y;lx=x;ly=A[1]+sy*(R+40)+(up?0:8);}
      else{const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,cx=mx+nx*bend,cy=my+ny*bend;
        const ua=Math.hypot(cx-A[0],cy-A[1]),ub=Math.hypot(cx-B[0],cy-B[1]);
        const sx=A[0]+(cx-A[0])/ua*R,sy2=A[1]+(cy-A[1])/ua*R,ex=B[0]+(cx-B[0])/ub*(R+2),ey=B[1]+(cy-B[1])/ub*(R+2);
        path='M'+sx+' '+sy2+' Q'+cx+' '+cy+' '+ex+' '+ey;const lo=e[4]!==undefined?e[4]:(bend>0?11:-11),qx=.25*A[0]+.5*cx+.25*B[0],qy=.25*A[1]+.5*cy+.25*B[1];lx=qx+nx*lo;ly=qy+ny*lo+4;}
      g+='<g class="ed'+(on?' on':'')+'"><path d="'+path+'" marker-end="url(#'+(on?'dfB':'dfA')+')"/><text x="'+lx+'" y="'+ly+'" text-anchor="middle">'+lab+'</text></g>';});
    Object.keys(P).forEach(n=>{const p=P[n],acc=d.acc.includes(n);g+='<g class="st'+(n===cur?' on':'')+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+R+'"/>'+(acc?'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(R-5)+'"/>':'')+'<text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" font-size="'+(p[2].length>5?10.5:13)+'">'+p[2]+'</text></g>';});
    $('dfSvg').setAttribute('viewBox','0 0 480 '+(d.h||220));$('dfSvg').innerHTML=g;}
  function draw(){const d=D[k],s=$('dfIn').value;
    $('dfTape').innerHTML=s.length?[...s].map((c,i)=>'<span class="'+(i<pos?'done':'')+(i===pos&&pos<s.length?' cur':'')+'">'+(c===' '?'␣':c.replace(/&/g,'&amp;').replace(/</g,'&lt;'))+'</span>').join(''):'<span style="padding:0 8px;font-weight:400;font-size:.8rem">ε (leeres Wort)</span>';
    drawSvg();const v=$('dfV');const name=d.st[cur][2];
    if(pos<s.length){v.className='verd';v.innerHTML='Zustand <b>'+name+'</b> · '+pos+' von '+s.length+' Zeichen gelesen. Als Nächstes: <code>'+(s[pos]===' '?'␣':s[pos].replace(/&/g,'&amp;').replace(/</g,'&lt;'))+'</code>';}
    else{const ok=d.acc.includes(cur);v.className='verd '+(ok?'yes':'no');v.innerHTML='Eingabe zu Ende, Zustand <b>'+name+'</b> – '+(ok?'<b>akzeptiert</b>: Das Wort gehört zur Sprache.':'<b>abgelehnt</b>: Das Wort gehört nicht zur Sprache.')+' (Akzeptierende Zustände haben einen Doppelkreis.)';}}
  function reset(){cur=D[k].start;pos=0;lastEdge=null;draw();}
  function step(){const d=D[k],s=$('dfIn').value;if(pos>=s.length)return;const c=d.cls(s[pos]),nx=d.tr[cur][c];lastEdge=edgeKey(cur,nx);cur=nx;pos++;draw();}
  $('dfStep').addEventListener('click',step);
  $('dfAll').addEventListener('click',()=>{const s=$('dfIn').value;while(pos<s.length)step();});
  $('dfReset').addEventListener('click',reset);
  $('dfIn').addEventListener('input',()=>{const f=D[k].filt($('dfIn').value).slice(0,24);if(f!==$('dfIn').value)$('dfIn').value=f;reset();});
  const bs=[...document.querySelectorAll('#dfS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;$('dfRx').innerHTML=D[k].rx;$('dfIn').value=D[k].ex;reset();}));
  $('dfRx').innerHTML=D[k].rx;$('dfIn').value=D[k].ex;reset();
})();

// ---------- Klammern ----------
(function(){
  const $=id=>document.getElementById(id);
  function run(s,K){let z=0,bad=false;for(const c of s){if(c==='('){z=Math.min(K-1,z+1);}else{if(z===0){bad=true;}else if(z<K-1)z--;else{z--;}}}return !bad&&z===0;}
  // Automat mit K Zuständen: 0..K-2 zählen exakt, K-1 heißt "K-1 oder mehr" – danach geht beim Zurückzählen Information verloren
  function draw(){const K=+$('kzK').value,n=+$('kzN').value;$('kzKo').textContent=K;$('kzNo').textContent=n;
    let h='';for(let i=0;i<K;i++)h+='<span class="'+(i===K-1?'last ':'')+(i===Math.min(n,K-1)?'hit':'')+'">'+(i===K-1?(K-1)+'+':i)+'</span>';$('kzZ').innerHTML=h;
    const a='('.repeat(n)+')'.repeat(n),b='('.repeat(n+1)+')'.repeat(n);
    const ra=run(a,K),rb=run(b,K);
    const ta=true,tb=false;
    $('kzP').innerHTML='<div><code>'+a+'</code><span>Automat: '+(ra?'gültig':'ungültig')+' · <b class="'+(ra===ta?'ok':'bad')+'">'+(ra===ta?'richtig':'falsch')+'</b></span></div>'+
      '<div><code>'+b+'</code><span>Automat: '+(rb?'gültig':'ungültig')+' · <b class="'+(rb===tb?'ok':'bad')+'">'+(rb===tb?'richtig':'falsch')+'</b></span></div>';
    $('kzN2').innerHTML=n+1<K?'Die Tiefe passt in die Zustände: Der Automat zählt mit und entscheidet beide Fälle richtig. Erhöhe die Tiefe.':'<b>Der Automat ist übergelaufen.</b> Ab Tiefe '+(K-1)+' landet er immer im Zustand „'+(K-1)+'+“ und weiß nicht mehr, wie viele Klammern offen sind. Die zweite Zeile hat eine öffnende Klammer mehr als die erste, aber für ihn sehen beide gleich aus: Er gibt beiden dieselbe Antwort – und liegt deshalb bei einer zwangsläufig falsch. Mehr Zustände verschieben die Grenze nur; für jeden endlichen Automaten gibt es eine Tiefe, an der er scheitert.';}
  $('kzK').addEventListener('input',draw);$('kzN').addEventListener('input',draw);draw();
})();

// ---------- Backtracking ----------
(function(){
  const $=id=>document.getElementById(id);
  const fmtT=s=>s<1e-3?'&lt; 1 ms':s<1?Math.round(s*1000)+' ms':s<120?s.toFixed(s<10?1:0).replace('.',',')+' s':s<7200?Math.round(s/60)+' min':s<172800?Math.round(s/3600)+' h':s<63072000?Math.round(s/86400)+' Tage':Math.round(s/31536000).toLocaleString('de-DE')+' Jahre';
  const fmtN=x=>x<1e6?Math.round(x).toLocaleString('de-DE'):x.toExponential(1).replace('.',',').replace(/e\+(\d+)/,' · 10<sup>$1</sup>');
  function draw(){const n=+$('btN').value;$('btNo').textContent=n;
    const steps=Math.pow(2,n+1)-1,dfa=n+1,t=steps/1e8;
    $('btIn').innerHTML='Muster <b>(a+)+b</b> · Eingabe <b>'+'a'.repeat(n)+'</b> (kein b am Ende → kein Treffer)';
    $('btK').innerHTML='<div class="good"><b>'+dfa+' Schritte</b>Automat (jedes Zeichen einmal)</div><div class="'+(t>0.1?'bad':'')+'"><b>'+fmtN(steps)+' Schritte</b>Backtracking · etwa '+fmtT(t)+'</div>';
    $('btB').style.width=Math.min(100,Math.log10(steps)/Math.log10(Math.pow(2,41))*100)+'%';
    $('btNt').innerHTML=n<15?'Bei kurzen Eingaben merkt man nichts – deshalb fällt das Problem in Tests selten auf.':(t<1?'Jedes zusätzliche Zeichen verdoppelt die Arbeit. Noch geht es schnell.':'<b>Ein einzelner Request blockiert einen Thread für '+fmtT(t)+'.</b> Ein Zeichen mehr, und es dauert doppelt so lange. Der Automat bräuchte für dieselbe Antwort '+dfa+' Schritte.');}
  $('btN').addEventListener('input',draw);draw();
})();
