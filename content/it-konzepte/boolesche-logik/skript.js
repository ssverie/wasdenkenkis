// ---------- Wahrheitstabelle ----------
(function(){
  const $=id=>document.getElementById(id);let out=[0,0,0,1,0,1,1,1],hit=-1;
  const V=['a','b','c'];
  function lits(r){return V.map((v,i)=>((r>>(2-i))&1)?v:'¬'+v);}
  function draw(){
    $('ttT').innerHTML='<tr><th>a</th><th>b</th><th>c</th><th>Aus</th></tr>'+out.map((o,r)=>'<tr data-r="'+r+'" class="'+(r===hit?'hit':'')+'"><td>'+((r>>2)&1)+'</td><td>'+((r>>1)&1)+'</td><td>'+(r&1)+'</td><td class="o"><button class="'+(o?'on':'')+'" data-r="'+r+'" aria-pressed="'+(o?'true':'false')+'">'+o+'</button></td></tr>').join('');
    $('ttT').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{out[+b.dataset.r]^=1;document.querySelectorAll('#ttP button').forEach(x=>x.setAttribute('aria-pressed','false'));draw();}));
    $('ttT').querySelectorAll('tr[data-r]').forEach(t=>{t.addEventListener('mouseenter',()=>{hit=+t.dataset.r;hl();});t.addEventListener('mouseleave',()=>{hit=-1;hl();});});
    const ones=out.map((o,r)=>o?r:-1).filter(r=>r>=0);
    if(!ones.length){$('ttF').textContent='0  (keine Zeile ergibt 1)';$('ttJ').textContent='false';}
    else if(ones.length===8){$('ttF').textContent='1  (jede Zeile ergibt 1)';$('ttJ').textContent='true';}
    else{$('ttF').innerHTML=ones.map(r=>'('+lits(r).join(' ∧ ')+')').join(' ∨ ');$('ttJ').textContent=ones.map(r=>'('+V.map((v,i)=>((r>>(2-i))&1)?v:'!'+v).join(' && ')+')').join(' || ');}
    svg(ones);
    const names={'00010111':'die <b>Mehrheitsfunktion</b>: 1, wenn mindestens zwei Eingänge 1 sind. Sie liefert den Übertrag beim Addieren.','01101001':'<b>ungerade Parität</b>: 1, wenn eine ungerade Zahl von Eingängen 1 ist – dasselbe wie a ^ b ^ c. Sie liefert die Summe beim Addieren und dient als Prüfbit.','00000001':'ein <b>UND mit drei Eingängen</b>: nur eine Zeile, also nur ein Minterm.','01010011':'ein <b>Multiplexer</b>: a wählt, ob b oder c durchkommt – das if-else der Hardware.'};
    const key=out.join('');
    $('ttN').innerHTML=(names[key]?'Das ist '+names[key]+' ':'')+ones.length+' Zeile'+(ones.length===1?'':'n')+' mit 1 → '+ones.length+' UND-Gatter, ein ODER-Gatter mit '+ones.length+' Eingängen'+(ones.length?', dazu NICHT-Gatter für die negierten Eingänge.':'.')+' Fahre über eine Tabellenzeile, um ihr Gatter zu sehen.';}
  function hl(){document.querySelectorAll('#ttT tr[data-r]').forEach(t=>t.classList.toggle('hit',+t.dataset.r===hit));document.querySelectorAll('#ttSvg .mt').forEach(g=>{const on=+g.dataset.r===hit;g.querySelector('rect').setAttribute('stroke',on?'var(--accent-2)':'var(--fg)');g.querySelector('rect').setAttribute('stroke-width',on?3:1.5);});}
  function svg(ones){const W=480,H=Math.max(140,ones.length*30+40),n=ones.length;$('ttSvg').setAttribute('viewBox','0 0 '+W+' '+H);
    let g='';const xs=[30,60,90];
    V.forEach((v,i)=>{g+='<text x="'+xs[i]+'" y="14" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fg)">'+v+'</text><line x1="'+xs[i]+'" y1="20" x2="'+xs[i]+'" y2="'+(H-10)+'" stroke="var(--muted)" stroke-width="1.5"/>';
      g+='<text x="'+(xs[i]+15)+'" y="14" text-anchor="middle" font-size="11" fill="var(--muted)">¬'+v+'</text><line x1="'+(xs[i]+15)+'" y1="20" x2="'+(xs[i]+15)+'" y2="'+(H-10)+'" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 2"/>';});
    if(!n){g+='<text x="'+W/2+'" y="'+H/2+'" text-anchor="middle" font-size="12" fill="var(--muted)">Ausgang ist immer 0 – keine Gatter nötig</text>';$('ttSvg').innerHTML=g;return;}
    const ax=200,ox=360,oy=H/2;
    ones.forEach((r,k)=>{const y=30+k*((H-50)/Math.max(1,n-1||1));const yy=n===1?oy:y;
      V.forEach((v,i)=>{const pos=(r>>(2-i))&1,x=pos?xs[i]:xs[i]+15,yin=yy-8+i*8;g+='<circle cx="'+x+'" cy="'+yin+'" r="2.5" fill="var(--fg)"/><line x1="'+x+'" y1="'+yin+'" x2="'+ax+'" y2="'+yin+'" stroke="var(--muted)" stroke-width="1"/>';});
      g+='<g class="mt" data-r="'+r+'"><rect x="'+ax+'" y="'+(yy-14)+'" width="40" height="28" rx="5" fill="var(--card)" stroke="var(--fg)" stroke-width="1.5"/><text x="'+(ax+20)+'" y="'+(yy+4)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fg)">&amp;</text></g>';
      g+='<line x1="'+(ax+40)+'" y1="'+yy+'" x2="'+ox+'" y2="'+(oy-10+20*(k+1)/(n+1))+'" stroke="var(--accent)" stroke-width="1.5"/>';});
    g+='<rect x="'+ox+'" y="'+(oy-18)+'" width="44" height="36" rx="6" fill="var(--card)" stroke="var(--fg)" stroke-width="1.8"/><text x="'+(ox+22)+'" y="'+(oy+5)+'" text-anchor="middle" font-size="13" font-weight="700" fill="var(--fg)">≥1</text><line x1="'+(ox+44)+'" y1="'+oy+'" x2="'+(W-14)+'" y2="'+oy+'" stroke="var(--accent)" stroke-width="2"/><text x="'+(W-12)+'" y="'+(oy-8)+'" font-size="12" font-weight="700" fill="var(--accent)" text-anchor="end">Aus</text>';
    $('ttSvg').innerHTML=g;hl();}
  const bs=[...document.querySelectorAll('#ttP button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');out=[...b.dataset.v].map(Number);draw();}));
  draw();
})();

// ---------- NAND ----------
(function(){
  const $=id=>document.getElementById(id);let k='and',A=0,B=0;
  const nand=(x,y)=>(x&&y)?0:1;
  // Gatter: [id, x, y, inA, inB]; Eingänge: 'a','b' oder Gatter-id
  const C={
    not:{g:[['g1',220,110,'a','a']],out:'g1',f:'NICHT a = NAND(a, a)',calc:(a,b)=>1-a,one:true},
    and:{g:[['g1',180,110,'a','b'],['g2',330,110,'g1','g1']],out:'g2',f:'a UND b = NICHT(NAND(a, b))',calc:(a,b)=>a&b},
    or:{g:[['g1',180,60,'a','a'],['g2',180,160,'b','b'],['g3',330,110,'g1','g2']],out:'g3',f:'a ODER b = NAND(NICHT a, NICHT b)',calc:(a,b)=>a|b},
    xor:{g:[['g1',160,110,'a','b'],['g2',290,60,'a','g1'],['g3',290,160,'g1','b'],['g4',420,110,'g2','g3']],out:'g4',f:'a XOR b mit vier NAND-Gattern',calc:(a,b)=>a^b}
  };
  function draw(){const c=C[k],val={a:A,b:B},pos={a:[40,70],b:[40,150]};
    c.g.forEach(g=>{val[g[0]]=nand(val[g[3]],val[g[4]]);pos[g[0]]=[g[1]+50,g[2]];});
    const col=v=>v?'var(--accent-2)':'var(--muted)';let s='';
    ['a','b'].forEach(i=>{if(c.one&&i==='b')return;const p=pos[i];s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="13" fill="'+(val[i]?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" font-size="12" font-weight="700" fill="'+(val[i]?'#fff':'var(--fg)')+'">'+i+'</text>';});
    c.g.forEach(g=>{[g[3],g[4]].forEach((src,j)=>{const p=pos[src],ty=g[2]-10+j*20,sx=p[0]+(src.length===1?13:0);const mx=(sx+g[1])/2;s+='<path d="M'+sx+' '+p[1]+' C'+mx+' '+p[1]+' '+mx+' '+ty+' '+g[1]+' '+ty+'" fill="none" stroke="'+col(val[src])+'" stroke-width="'+(val[src]?3:1.6)+'"/>';});});
    c.g.forEach(g=>{const x=g[1],y=g[2];s+='<path d="M'+x+' '+(y-22)+' L'+(x+22)+' '+(y-22)+' A22 22 0 0 1 '+(x+22)+' '+(y+22)+' L'+x+' '+(y+22)+' Z" fill="var(--card)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="'+(x+48)+'" cy="'+y+'" r="4" fill="var(--card)" stroke="var(--fg)" stroke-width="1.6"/><text x="'+(x+16)+'" y="'+(y+4)+'" text-anchor="middle" font-size="9" fill="var(--muted)">NAND</text>';});
    const o=pos[c.out];s+='<line x1="'+(o[0]+2)+'" y1="'+o[1]+'" x2="'+(o[0]+40)+'" y2="'+o[1]+'" stroke="'+col(val[c.out])+'" stroke-width="'+(val[c.out]?3:1.6)+'"/><circle cx="'+(o[0]+54)+'" cy="'+o[1]+'" r="14" fill="'+(val[c.out]?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="'+(o[0]+54)+'" y="'+(o[1]+4)+'" text-anchor="middle" font-size="12" font-weight="700" fill="'+(val[c.out]?'#fff':'var(--fg)')+'">'+val[c.out]+'</text>';
    $('ndSvg').innerHTML=s;
    $('ndI').querySelector('[data-i="b"]').style.display=c.one?'none':'';
    $('ndI').querySelectorAll('button').forEach(b=>{const v=b.dataset.i==='a'?A:B;b.textContent=b.dataset.i+' = '+v;b.classList.toggle('on',!!v);});
    const r=c.calc(A,B);$('ndN').innerHTML='<b>'+c.f+'.</b> Bei a = '+A+(c.one?'':', b = '+B)+' liefert die Schaltung <b>'+val[c.out]+'</b> – '+(val[c.out]===r?'wie erwartet.':'Fehler!')+' '+c.g.length+' NAND-Gatter. Orange Leitungen führen 1.';}
  $('ndI').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.i==='a')A^=1;else B^=1;draw();}));
  const bs=[...document.querySelectorAll('#ndS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;draw();}));draw();
})();

// ---------- Äquivalenz ----------
(function(){
  const $=id=>document.getElementById(id);
  // Parser mit Java-Vorrang: ! > & > ^ > | > && > ||
  function parse(src){const t=src.match(/\s*(\|\||&&|[!&|^()]|true|false|[abc])\s*/g);if(!t||t.join('').replace(/\s/g,'')!==src.replace(/\s/g,''))throw 'Unbekanntes Zeichen – erlaubt sind a, b, c, true, false, !, &&, ||, &, |, ^ und Klammern.';
    const T=t.map(x=>x.trim());let i=0;const peek=()=>T[i],eat=x=>{if(T[i]!==x)throw 'Erwartet „'+x+'“, gefunden „'+(T[i]||'Ende')+'“.';i++;};
    const bin=(next,op,f)=>()=>{let l=next();while(peek()===op){i++;const r=next(),L=l;l=e=>f(L(e),r(e));}return l;};
    const prim=()=>{const x=peek();if(x==='!'){i++;const p=prim();return e=>!p(e);}if(x==='('){i++;const r=or();eat(')');return r;}if(x==='true'){i++;return()=>true;}if(x==='false'){i++;return()=>false;}if(/^[abc]$/.test(x||'')){i++;return e=>e[x];}throw 'Ausdruck unvollständig bei „'+(x||'Ende')+'“.';};
    const band=bin(prim,'&',(x,y)=>x&&y),bxor=bin(band,'^',(x,y)=>x!==y),bor=bin(bxor,'|',(x,y)=>x||y),and=bin(bor,'&&',(x,y)=>x&&y),or=bin(and,'||',(x,y)=>x||y);
    const r=or();if(i<T.length)throw 'Unerwartet: „'+T[i]+'“.';return r;}
  function draw(){const v=$('eqV');let f,g;try{f=parse($('eqA').value);g=parse($('eqB').value);}catch(e){v.className='verd no';v.textContent=e;return;}
    let rows='',diff=0;for(let r=0;r<8;r++){const e={a:!!(r&4),b:!!(r&2),c:!!(r&1)},x=f(e),y=g(e);if(x!==y)diff++;rows+='<tr class="'+(x!==y?'diff':'')+'"><td>'+(+e.a)+'</td><td>'+(+e.b)+'</td><td>'+(+e.c)+'</td><td>'+(+x)+'</td><td>'+(+y)+'</td></tr>';}
    v.className='verd '+(diff?'no':'yes');
    v.innerHTML=(diff?'<b>Nicht gleichwertig</b> – in '+diff+' von 8 Fällen verschieden (rot markiert).':'<b>Gleichwertig</b> – für alle 8 Belegungen von a, b, c dasselbe Ergebnis. Du kannst den einen Ausdruck gefahrlos durch den anderen ersetzen.')+'<table class="cmpt"><tr><th>a</th><th>b</th><th>c</th><th>links</th><th>rechts</th></tr>'+rows+'</table>';}
  $('eqA').addEventListener('input',draw);$('eqB').addEventListener('input',draw);
  document.querySelectorAll('#eqX button').forEach(b=>b.addEventListener('click',()=>{$('eqA').value=b.dataset.a;$('eqB').value=b.dataset.b;draw();}));draw();
})();
