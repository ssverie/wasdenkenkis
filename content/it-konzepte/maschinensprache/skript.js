// ---------- Simulator ----------
(function(){
  const $=id=>document.getElementById(id);
  const P={
    sum:{n:'Addiert 1 + 2 + … + n. RA zählt rückwärts, RB sammelt die Summe; C013 springt immer zurück, CA17 springt hinaus, sobald RA null ist.',src:
`00: 0005  // n
01: 0000  // Ergebnis
10: 8A00  // RA = n
11: 7101  // R1 = 1
12: 7B00  // RB = 0 (Summe)
13: CA17  // wenn RA == 0: fertig
14: 1BBA  // RB = RB + RA
15: 2AA1  // RA = RA - 1
16: C013  // zurück zur Prüfung
17: 9B01  // Ergebnis speichern
18: 9BFF  // ausgeben
19: 0000  // anhalten`},
    call:{n:'Das Hauptprogramm ruft mit FF30 die Funktion bei Adresse 30 auf: RF merkt sich die Rücksprungadresse, dann geht es nach 30. Die Funktion rechnet RC = RA · RA durch wiederholte Addition und kehrt mit EF00 zurück.',src:
`00: 0007  // x
10: 7101  // R1 = 1
11: 8A00  // RA = x (Parameter)
12: FF30  // Aufruf: RF = Rücksprung, PC = 30
13: 9CFF  // Ergebnis RC ausgeben
14: 0000  // anhalten
30: 7C00  // RC = 0
31: 1BA0  // RB = RA (Zähler)
32: CB36  // wenn RB == 0: fertig
33: 1CCA  // RC = RC + RA
34: 2BB1  // RB = RB - 1
35: C032  // zurück
36: EF00  // Rücksprung: PC = RF`},
    arr:{n:'RB enthält eine Adresse – einen Zeiger. A20B lädt das Wort, auf das RB zeigt; danach wird RB um 1 erhöht. So entsteht a[i] aus Adresse plus Index.',src:
`00: 0005  // Länge
40: 0003  // a[0]
41: 0001  // a[1]
42: 0004  // a[2]
43: 0001  // a[3]
44: 0005  // a[4]
10: 7101  // R1 = 1
11: 8A00  // RA = Länge
12: 7B40  // RB = 40 (Adresse von a[0])
13: 7C00  // RC = 0 (Summe)
14: CA1A  // wenn RA == 0: fertig
15: A20B  // R2 = M[RB]  (a[i])
16: 1CC2  // RC = RC + R2
17: 1BB1  // RB = RB + 1 (nächstes Element)
18: 2AA1  // RA = RA - 1
19: C014  // zurück
1A: 9CFF  // Summe ausgeben
1B: 0000  // anhalten`}
  };
  let M,R,pc,ir,steps,out,halted,err,chgR=-1,chgM=-1,used,k='sum';
  const h2=x=>x.toString(16).toUpperCase().padStart(2,'0'),h4=x=>x.toString(16).toUpperCase().padStart(4,'0'),sg=x=>x&0x8000?x-0x10000:x;
  function load(){M=new Uint16Array(256);R=new Uint16Array(16);used=new Set();err='';
    $('tySrc').value.split('\n').forEach((l,i)=>{const c=l.replace(/\/\/.*/,'').trim();if(!c)return;const m=c.match(/^([0-9a-fA-F]{1,2})\s*:\s*([0-9a-fA-F]{1,4})$/);if(!m){err=err||'Zeile '+(i+1)+' nicht erkannt: '+c;return;}const a=parseInt(m[1],16);M[a]=parseInt(m[2],16);used.add(a);});
    pc=0x10;ir=0;steps=0;out=[];halted=false;chgR=-1;chgM=-1;draw();}
  function dis(w){const op=w>>12,d=(w>>8)&15,s=(w>>4)&15,t=w&15,a=w&255,r=x=>'R'+x.toString(16).toUpperCase(),A=h2(a);
    switch(op){case 0:return 'anhalten';case 1:return r(d)+' ← '+r(s)+' + '+r(t);case 2:return r(d)+' ← '+r(s)+' − '+r(t);case 3:return r(d)+' ← '+r(s)+' & '+r(t);case 4:return r(d)+' ← '+r(s)+' ^ '+r(t);case 5:return r(d)+' ← '+r(s)+' << '+r(t);case 6:return r(d)+' ← '+r(s)+' >> '+r(t);
      case 7:return r(d)+' ← '+A;case 8:return a===255?r(d)+' ← Eingabe':r(d)+' ← M['+A+']';case 9:return a===255?'Ausgabe ← '+r(d):'M['+A+'] ← '+r(d);case 10:return r(d)+' ← M['+r(t)+']';case 11:return 'M['+r(t)+'] ← '+r(d);
      case 12:return d===0?'springe nach '+A:'wenn '+r(d)+' = 0: nach '+A;case 13:return 'wenn '+r(d)+' > 0: nach '+A;case 14:return 'springe nach '+r(d);case 15:return r(d)+' ← PC; nach '+A;}}
  function step(){if(halted||err)return false;if(steps>=5000){err='Nach 5000 Schritten angehalten – Endlosschleife?';return false;}
    ir=M[pc];const op=ir>>12,d=(ir>>8)&15,s=(ir>>4)&15,t=ir&15,a=ir&255;pc=(pc+1)&255;steps++;chgR=-1;chgM=-1;
    const setR=(x,v)=>{if(x!==0){R[x]=v&0xFFFF;chgR=x;}};
    switch(op){case 0:halted=true;pc=(pc-1)&255;break;case 1:setR(d,R[s]+R[t]);break;case 2:setR(d,R[s]-R[t]);break;case 3:setR(d,R[s]&R[t]);break;case 4:setR(d,R[s]^R[t]);break;case 5:setR(d,R[s]<<R[t]);break;case 6:setR(d,sg(R[s])>>R[t]);break;
      case 7:setR(d,a);break;case 8:setR(d,a===255?0:M[a]);break;case 9:if(a===255)out.push(R[d]);else{M[a]=R[d];chgM=a;used.add(a);}break;
      case 10:setR(d,M[R[t]&255]);break;case 11:{const ad=R[t]&255;if(ad===255)out.push(R[d]);else{M[ad]=R[d];chgM=ad;used.add(ad);}}break;
      case 12:if(R[d]===0)pc=a;break;case 13:if(sg(R[d])>0)pc=a;break;case 14:pc=R[d]&255;break;case 15:{const ret=pc;pc=a;setR(d,ret);}break;}
    return !halted;}
  function draw(){const addrs=[...used].sort((x,y)=>x-y);if(!addrs.includes(pc))addrs.push(pc),addrs.sort((x,y)=>x-y);let h='',prev=-2;
    addrs.forEach(a=>{if(a!==prev+1)h+='<div class="sep">'+(a<0x10?'Daten':a>=0x10&&a<0x30?'Programm':a<0x40?'Funktion':'Daten')+' ab '+h2(a)+'</div>';prev=a;
      h+='<div class="'+(a===pc&&!err?'pc ':'')+(a===chgM?'chg':'')+'" '+(a===pc?'id="tyCur"':'')+'><span class="a">'+h2(a)+'</span><span>'+h4(M[a])+'</span><span class="d">'+(a>=0x10&&a<0x40?dis(M[a]):sg(M[a]))+'</span></div>';});
    $('tyM').innerHTML=h;
    $('tyPC').innerHTML='<div><span>PC</span>'+h2(pc)+'</div><div><span>IR</span>'+h4(ir)+'</div>';
    let r='';for(let i=0;i<16;i++)r+='<div class="'+(i===chgR?'chg':'')+'"><span>R'+i.toString(16).toUpperCase()+'</span>'+h4(R[i])+'</div>';$('tyR').innerHTML=r;
    $('tyO').textContent=out.length?out.map(v=>h4(v)+' ('+sg(v)+')').join('  '):'—';
    $('tyC').textContent=steps+' Befehle ausgeführt';
    const n=$('tyN');
    if(err)n.innerHTML='<b>'+err+'</b>';
    else if(halted)n.innerHTML='<b>Angehalten</b> nach '+steps+' Befehlen. Ausgabe: '+(out.length?out.map(sg).join(', '):'keine')+'.';
    else if(steps===0)n.innerHTML=P[k].n;
    else n.innerHTML='Ausgeführt: <code>'+h4(ir)+'</code> – '+dis(ir)+'. Als Nächstes an Adresse '+h2(pc)+': <code>'+h4(M[pc])+'</code> – '+dis(M[pc])+'.';
    const cur=document.getElementById('tyCur');if(cur){const box=$('tyM');const top=cur.offsetTop-box.offsetTop;if(top<box.scrollTop||top>box.scrollTop+box.clientHeight-30)box.scrollTop=top-60;}}
  $('tyStep').addEventListener('click',()=>{step();draw();});
  $('tyRun').addEventListener('click',()=>{while(step());draw();});
  $('tyReset').addEventListener('click',load);
  $('tySrc').addEventListener('input',load);
  const bs=[...document.querySelectorAll('#tyP button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;$('tySrc').value=P[k].src;load();}));
  $('tySrc').value=P.sum.src;load();
})();

// ---------- Java ↔ Maschine ----------
(function(){
  const $=id=>document.getElementById(id);
  const c=s=>s.replace(/(\/\/.*)/g,'<span class="c">$1</span>');
  const J={
    expr:['c = a + b;',`10: 8A00  // RA ← a   (a liegt bei 00)
11: 8B01  // RB ← b
12: 1CAB  // RC ← RA + RB
13: 9C02  // c ← RC`,'Variablen sind Speicheradressen. Rechnen geht nur in Registern: laden, rechnen, zurückschreiben. Ein guter Compiler hält häufig benutzte Variablen gleich in Registern und spart sich das Laden.'],
    if:['if (a == 0) {\n    c = 1;\n}\n// weiter …',`10: 8A00  // RA ← a
11: CA13  // wenn a == 0: in den Rumpf
12: C015  // sonst: am Rumpf vorbei
13: 7C01  // RC ← 1
14: 9C02  // c ← RC
15: …     // weiter`,'Ein if wird zu Sprüngen. Weil unsere Maschine nur „springe, wenn null“ und „springe, wenn positiv“ kennt, braucht es hier zwei: einen in den Rumpf, einen daran vorbei. Echte Befehlssätze haben mehr Bedingungen und kommen meist mit einem Sprung aus, der die Bedingung umdreht.'],
    while:['while (n != 0) {\n    s = s + n;\n    n = n - 1;\n}',`13: CA17  // Prüfung: n == 0 → hinaus
14: 1BBA  // s ← s + n
15: 2AA1  // n ← n − 1
16: C013  // zurück zur Prüfung
17: …     // nach der Schleife`,'Jede Schleife ist dasselbe Paar: ein bedingter Sprung hinaus, ein unbedingter Sprung zurück. for, while und do-while unterscheiden sich nur darin, wo die Prüfung steht.'],
    call:['int y = quadrat(x);\n\nstatic int quadrat(int a) {\n    …\n    return r;\n}',`11: 8A00  // Parameter in RA
12: FF30  // RF ← 13, springe nach 30
13: 9CFF  // Rückgabewert steht in RC
…
30: …     // Rumpf der Methode
36: EF00  // springe zur Adresse in RF`,'Ein Aufruf ist ein Sprung, der sich merkt, wohin es zurückgeht. Welche Register Parameter und Rückgabewert tragen, ist reine Vereinbarung (Aufrufkonvention) – Aufrufer und Methode müssen sich nur einig sein.'],
    arr:['int s = 0;\nfor (int i = 0; i < n; i++)\n    s += a[i];',`12: 7B40  // RB ← 40: Adresse von a[0]
15: A20B  // R2 ← M[RB]: a[i]
16: 1CC2  // s ← s + R2
17: 1BB1  // RB ← RB + 1: nächstes Element`,'Ein Array ist ein zusammenhängender Speicherbereich, a[i] liegt bei Startadresse + i. In Java ist jedes Element eines int[] 4 Byte groß, die Adresse also Start + 4·i. Java prüft dabei zusätzlich, ob i im Bereich liegt – die Lehrmaschine nicht, sie liest einfach weiter.']
  };
  function draw(kk){const j=J[kk];$('jmV').innerHTML='<pre><code>'+j[0].replace(/</g,'&lt;')+'</code></pre><pre><code>'+c(j[1].replace(/</g,'&lt;'))+'</code></pre>';$('jmN').innerHTML=j[2];}
  const bs=[...document.querySelectorAll('#jmS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw(b.dataset.k);}));draw('expr');
})();
