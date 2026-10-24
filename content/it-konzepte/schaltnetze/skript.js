// ---------- Decoder / Multiplexer ----------
(function(){
  const $=id=>document.getElementById(id);let k='mux',s1=1,s0=0,D=[1,0,1,1];
  function toggles(){let h='<span>Auswahl</span><button data-t="s1" class="'+(s1?'on':'')+'">s1 = '+s1+'</button><button data-t="s0" class="'+(s0?'on':'')+'">s0 = '+s0+'</button>';
    if(k==='mux')h+='<span style="margin-left:10px">Daten</span>'+D.map((d,i)=>'<button data-t="d'+i+'" class="'+(d?'on':'')+'">d'+i+' = '+d+'</button>').join('');
    $('mxT').innerHTML=h;$('mxT').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.t;if(t==='s1')s1^=1;else if(t==='s0')s0^=1;else D[+t[1]]^=1;draw();}));}
  function draw(){toggles();const sel=s1*2+s0,W=600,col=v=>v?'var(--accent-2)':'var(--muted)',sw=v=>v?3:1.4;let g='';
    const L={s1:[30,s1],ns1:[50,1-s1],s0:[80,s0],ns0:[100,1-s0]};
    Object.entries(L).forEach(([n,[x,v]])=>{g+='<line x1="'+x+'" y1="26" x2="'+x+'" y2="285" stroke="'+col(v)+'" stroke-width="'+sw(v)+'"'+(n[0]==='n'?' stroke-dasharray="4 3"':'')+'/><text x="'+x+'" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="var(--fg)">'+(n[0]==='n'?'¬'+n.slice(1):n)+'</text>';});
    const gate=(x,y,lab,v)=>'<path d="M'+x+' '+(y-16)+' L'+(x+20)+' '+(y-16)+' A16 16 0 0 1 '+(x+20)+' '+(y+16)+' L'+x+' '+(y+16)+' Z" fill="'+(v?'var(--accent-2-soft)':'var(--card)')+'" stroke="var(--fg)" stroke-width="1.5"/><text x="'+(x+16)+'" y="'+(y+4)+'" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">'+lab+'</text>';
    const ys=[55,120,185,250];const decOut=[];
    for(let i=0;i<4;i++){const y=ys[i],b1=(i>>1)&1,b0=i&1,in1=b1?'s1':'ns1',in0=b0?'s0':'ns0',v=(i===sel)?1:0;decOut.push(v);
      [[in1,y-8],[in0,y+8]].forEach(([n,yy])=>{const [x,vv]=L[n];g+='<circle cx="'+x+'" cy="'+yy+'" r="3" fill="var(--fg)"/><line x1="'+x+'" y1="'+yy+'" x2="160" y2="'+yy+'" stroke="'+col(vv)+'" stroke-width="'+sw(vv)+'"/>';});
      g+=gate(160,y,'&',v);
      if(k==='dec'){g+='<line x1="196" y1="'+y+'" x2="300" y2="'+y+'" stroke="'+col(v)+'" stroke-width="'+sw(v)+'"/><circle cx="318" cy="'+y+'" r="16" fill="'+(v?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="318" y="'+(y+4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="'+(v?'#fff':'var(--fg)')+'">y'+i+'</text><text x="345" y="'+(y+4)+'" font-size="11" fill="var(--muted)">'+(i>>1)+(i&1)+' → Leitung '+i+'</text>';}}
    if(k==='mux'){let o=0;
      for(let i=0;i<4;i++){const y=ys[i],dv=D[i],v=decOut[i]&dv;if(v)o=1;
        g+='<line x1="196" y1="'+y+'" x2="330" y2="'+(y+8)+'" stroke="'+col(decOut[i])+'" stroke-width="'+sw(decOut[i])+'"/>';
        g+='<circle cx="290" cy="'+(y-24)+'" r="11" fill="'+(dv?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="290" y="'+(y-20)+'" text-anchor="middle" font-size="9.5" font-weight="700" fill="'+(dv?'#fff':'var(--fg)')+'">d'+i+'</text><path d="M301 '+(y-24)+' L315 '+(y-24)+' L315 '+(y-8)+' L330 '+(y-8)+'" fill="none" stroke="'+col(dv)+'" stroke-width="'+sw(dv)+'"/>';
        g+=gate(330,y,'&',v);g+='<line x1="366" y1="'+y+'" x2="450" y2="'+(152-12+8*i)+'" stroke="'+col(v)+'" stroke-width="'+sw(v)+'"/>';}
      g+='<path d="M450 122 Q470 122 490 152 Q470 182 450 182 Q462 152 450 122 Z" fill="'+(o?'var(--accent-2-soft)':'var(--card)')+'" stroke="var(--fg)" stroke-width="1.6"/><text x="466" y="156" text-anchor="middle" font-size="10" font-weight="700" fill="var(--fg)">≥1</text>';
      g+='<line x1="490" y1="152" x2="545" y2="152" stroke="'+col(o)+'" stroke-width="'+sw(o)+'"/><circle cx="565" cy="152" r="18" fill="'+(o?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="565" y="156" text-anchor="middle" font-size="12" font-weight="700" fill="'+(o?'#fff':'var(--fg)')+'">'+o+'</text>';
      $('mxN').innerHTML='Auswahl s1 s0 = '+s1+s0+' = '+sel+': Nur Decoderleitung '+sel+' ist aktiv, also kommt nur <b>d'+sel+' = '+D[sel]+'</b> durch das UND. Die anderen Dateneingänge können sich ändern, wie sie wollen – am Ausgang ändert sich nichts. In Java: <code>switch (sel) { case 0 -&gt; d0; case 1 -&gt; d1; … }</code>';}
    else $('mxN').innerHTML='Eingang '+s1+s0+' (binär) = '+sel+': Genau Ausgang <b>y'+sel+'</b> ist 1. Jeder Ausgang ist ein UND, das nur bei „seiner“ Bitkombination anspringt. Mit 8 Eingängen hätte ein Decoder 256 Ausgänge – so wählt der Speicher aus einer Adresse die richtige Zelle.';
    $('mxSvg').innerHTML=g;}
  const bs=[...document.querySelectorAll('#mxS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;draw();}));draw();
})();

// ---------- Ripple-Carry ----------
(function(){
  const $=id=>document.getElementById(id);let t=99,timer=null;
  const bin=x=>x.toString(2).padStart(8,'0');
  function calc(){const a=+$('raA').value,b=+$('raB').value,st=[];let c=0,last=-1;for(let i=0;i<8;i++){const ai=(a>>i)&1,bi=(b>>i)&1,s=ai^bi^c,co=(ai&bi)|(ai&c)|(bi&c);st.push({ai,bi,ci:c,s,co});if(c)last=i;c=co;}
    // längste Übertragskette
    let run=0,best=0;for(let i=0;i<8;i++){if(st[i].co){run++;best=Math.max(best,run);}else run=0;}
    return {a,b,st,cout:c,best};}
  function draw(){const r=calc();$('raAo').textContent=r.a+' = '+bin(r.a);$('raBo').textContent=r.b+' = '+bin(r.b);
    let h='';for(let i=7;i>=0;i--){const s=r.st[i],ready=t>=i,now=t===i;h+='<div class="'+(now?'now':ready?'':'wait')+'"><small>Bit '+i+'</small>'+s.ai+'+'+s.bi+'+<span class="cy">'+(ready?s.ci:'?')+'</span><b>'+(ready?s.s:'?')+'</b>Ü <span class="cy">'+(ready?s.co:'?')+'</span></div>';}
    $('raF').innerHTML=h;
    const sum=r.a+r.b;const done=t>=7;
    $('raR').innerHTML='<div><b>'+(done?bin(sum&255):'????????')+'</b>Summe (8 Bit)</div><div><b>'+(done?r.cout:'?')+'</b>Übertrag aus Bit 7</div><div><b>'+(done?(sum&255)+(r.cout?' (+256)':''):'…')+'</b>dezimal</div>';
    $('raN').innerHTML=done?'Die längste Kette weitergereichter Überträge ist hier <b>'+r.best+' Stufe'+(r.best===1?'':'n')+'</b> lang. Erst wenn der Übertrag die letzte Stufe erreicht hat, stimmt das Ergebnis. Der schlimmste Fall ist 255 + 1 – oder 127 + 1: Eine 1 rieselt durch alle Einsen hindurch.':'Stufe '+t+' kennt jetzt ihren Übertrag. Alle Stufen links davon rechnen noch mit einem Übertrag, der sich gleich ändern kann.';}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  $('raGo').addEventListener('click',()=>{stop();t=-1;draw();timer=setInterval(()=>{t++;draw();if(t>=7)stop();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?60:450);});
  $('raAll').addEventListener('click',()=>{stop();t=99;draw();});
  ['raA','raB'].forEach(id=>$(id).addEventListener('input',()=>{stop();t=99;draw();}));draw();
})();

// ---------- ALU ----------
(function(){
  const $=id=>document.getElementById(id);let op=1;
  const bin=x=>x.toString(2).padStart(8,'0'),s8=x=>x>127?x-256:x;
  const U=[[1,'A + B',(a,b)=>(a+b)&255],[2,'A − B = A + ¬B + 1',(a,b)=>(a+((~b)&255)+1)&255],[3,'A & B',(a,b)=>a&b],[4,'A ^ B',(a,b)=>a^b],[5,'A << (B mod 8)',(a,b)=>(a<<(b&7))&255],[6,'A >> (B mod 8)',(a,b)=>((a>127?a-256:a)>>(b&7))&255]];
  function draw(){const a=+$('alA').value,b=+$('alB').value;$('alAo').textContent=a+' = '+bin(a);$('alBo').textContent=b+' = '+bin(b);
    $('alU').innerHTML=U.map(u=>{const r=u[2](a,b);return '<div class="'+(u[0]===op?'sel':'off')+'"><span>'+u[0]+' · '+u[1]+'</span><b>'+bin(r)+'</b><span>'+r+(u[0]===2?' (mit Vorzeichen '+s8(r)+')':'')+'</span></div>';}).join('');
    const r=U[op-1][2](a,b);
    $('alM').innerHTML='Multiplexer, Auswahl = Opcode '+op+' ('+op.toString(2).padStart(3,'0')+')<br><b>'+bin(r)+'</b>';
    const N={1:'Der Addierer aus acht Volladdierern.',2:'Derselbe Addierer – nur werden die Bits von B mit XOR umgedreht und ein Übertrag 1 eingespeist. '+a+' − '+b+' = '+s8(r)+' im Zweierkomplement.',3:'Acht UND-Gatter nebeneinander, eines pro Bit. Kein Übertrag, kein Warten.',4:'Acht XOR-Gatter. XOR mit sich selbst ergibt 0 – deshalb setzen Compiler Register gern mit <code>xor eax, eax</code> auf null.',5:'Links schieben um k Stellen multipliziert mit 2<sup>k</sup>. Gebaut aus Multiplexern, die jedes Bit von seinem Nachbarn holen.',6:'Rechts schieben teilt durch 2<sup>k</sup> (abgerundet). Hier arithmetisch wie bei der Lehrmaschine: Von links wird das Vorzeichenbit nachgeschoben, damit negative Zahlen negativ bleiben – in Java <code>&gt;&gt;</code>. Mit Nullen von links wäre es <code>&gt;&gt;&gt;</code>.'};
    $('alN').innerHTML='Alle sechs Einheiten haben gerechnet – die blassen Ergebnisse werden nur nicht durchgelassen. '+N[op];}
  ['alA','alB'].forEach(id=>$(id).addEventListener('input',draw));
  const bs=[...document.querySelectorAll('#alS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');op=+b.dataset.o;draw();}));draw();
})();
