// ---------- Datenpfad ----------
(function(){
  const $=id=>document.getElementById(id);
  const PR={
    sum:{M:{0:5,1:0,0x10:0x8A00,0x11:0x7101,0x12:0x7B00,0x13:0xCA17,0x14:0x1BBA,0x15:0x2AA1,0x16:0xC013,0x17:0x9B01,0x18:0x9BFF,0x19:0x0000}},
    call:{M:{0:7,0x10:0x7101,0x11:0x8A00,0x12:0xFF30,0x13:0x9CFF,0x14:0x0000,0x30:0x7C00,0x31:0x1BA0,0x32:0xCB36,0x33:0x1CCA,0x34:0x2BB1,0x35:0xC032,0x36:0xEF00}}
  };
  let k='sum',M,R,pc,ir,phase,halted,instrs,out,chg,lastNote,lastAct=null,lastPh=-1,fetchAdr=0;
  const h2=x=>x.toString(16).toUpperCase().padStart(2,'0'),h4=x=>x.toString(16).toUpperCase().padStart(4,'0'),rn=x=>'R'+x.toString(16).toUpperCase(),sg=x=>x&0x8000?x-0x10000:x;
  const OPN=['anhalten','addieren','subtrahieren','UND','XOR','links schieben','rechts schieben','Konstante laden','laden','speichern','indirekt laden','indirekt speichern','springen wenn 0','springen wenn > 0','springen zu Register','Aufruf'];
  function reset(){M=new Uint16Array(256);Object.entries(PR[k].M).forEach(([a,v])=>M[+a]=v);R=new Uint16Array(16);pc=0x10;ir=0;phase=0;halted=false;instrs=0;out=[];chg=new Set();lastAct=null;lastPh=-1;lastNote='Bereit. Der PC zeigt auf Adresse 10, den ersten Befehl. Klick auf „Nächste Phase“.';draw(null);}
  function f(){return {op:ir>>12,d:(ir>>8)&15,s:(ir>>4)&15,t:ir&15,a:ir&255};}
  // aktive Leitungen/Bausteine je Phase
  function act(){if(halted)return {w:[],b:[],s:['Maschine angehalten']};
    if(phase===0)return {w:['pc-mem','mem-ir','pc-inc'],b:['pc','mem','ir','inc'],s:['PC → Adresse','Speicher lesen','IR schreiben','PC ← PC + 1'],c:['c-pc','c-mem','c-ir']};
    const x=f();
    if(phase===1)return {w:['ir-ctl','ir-reg'],b:['ir','ctl','reg'],s:['Opcode '+x.op.toString(16).toUpperCase()+' → Steuerwerk: '+OPN[x.op],'Registernummern anlegen'],c:[]};
    const op=x.op;
    if(op===0)return {w:[],b:['ctl'],s:['Halt: Takt anhalten'],c:['c-pc']};
    if(op>=1&&op<=6)return {w:['reg-alu-a','reg-alu-b','alu-reg'],b:['reg','alu'],s:['Register lesen: '+rn(x.s)+', '+rn(x.t),'ALU: '+OPN[op],'Register schreiben: '+rn(x.d)],c:['c-reg','c-alu']};
    if(op===7)return {w:['ir-imm'],b:['ir','reg'],s:['Adressfeld '+h2(x.a)+' → Register','Register schreiben: '+rn(x.d)],c:['c-reg']};
    if(op===8)return {w:['ir-mem','mem-reg'],b:['mem','reg'],s:['Adressfeld '+h2(x.a)+' → Adresse','Speicher lesen','Register schreiben: '+rn(x.d)],c:['c-mem','c-reg']};
    if(op===9)return {w:['ir-mem','reg-mem'],b:['mem','reg'],s:['Adressfeld '+h2(x.a)+' → Adresse','Register lesen: '+rn(x.d),x.a===255?'Ausgabe schreiben':'Speicher schreiben'],c:['c-mem','c-reg']};
    if(op===10)return {w:['reg-addr','mem-reg'],b:['mem','reg'],s:['Register '+rn(x.t)+' → Adresse','Speicher lesen','Register schreiben: '+rn(x.d)],c:['c-mem','c-reg']};
    if(op===11)return {w:['reg-addr','reg-mem'],b:['mem','reg'],s:['Register '+rn(x.t)+' → Adresse','Speicher schreiben'],c:['c-mem','c-reg']};
    if(op===12||op===13){const take=op===12?R[x.d]===0:sg(R[x.d])>0;return {w:['reg-test'].concat(take?['ir-pc']:[]),b:['reg','ctl'].concat(take?['pc']:[]),s:['Register lesen: '+rn(x.d),'Test '+(op===12?'= 0':'> 0')+': '+(take?'ja':'nein'),take?'PC ← '+h2(x.a)+' (springen)':'PC bleibt (nicht springen)'],c:take?['c-pc']:[]};}
    if(op===14)return {w:['reg-pc'],b:['reg','pc'],s:['Register lesen: '+rn(x.d),'PC ← '+rn(x.d)],c:['c-pc']};
    if(op===15)return {w:['pc-reg','ir-pc'],b:['reg','pc'],s:['Register schreiben: '+rn(x.d)+' ← PC (Rücksprung)','PC ← '+h2(x.a)],c:['c-pc','c-reg']};
    return {w:[],b:[],s:[]};}
  function step(){if(halted)return false;chg=new Set();lastAct=act();lastPh=phase;if(phase===0)fetchAdr=pc;
    if(phase===0){ir=M[pc];pc=(pc+1)&255;chg.add('PC');chg.add('IR');lastNote='<b>Holen:</b> Der PC legt seine Adresse an den Speicher, der Befehl '+h4(ir)+' wandert ins IR. Gleichzeitig zählt der Addierer den PC auf '+h2(pc)+' weiter – beim Ausführen kann ein Sprung ihn noch überschreiben.';phase=1;return true;}
    if(phase===1){const x=f();lastNote='<b>Dekodieren:</b> Die oberste Ziffer '+x.op.toString(16).toUpperCase()+' geht ans Steuerwerk: „'+OPN[x.op]+'“. Es berechnet daraus, welche Leitungen in der nächsten Phase aktiv sind. Die übrigen Ziffern wählen Register oder sind eine Adresse. Am Zustand ändert sich in dieser Phase nichts.';phase=2;return true;}
    const x=f(),op=x.op,set=(r,v)=>{if(r!==0){R[r]=v&0xFFFF;chg.add(rn(r));}};
    switch(op){case 0:halted=true;break;case 1:set(x.d,R[x.s]+R[x.t]);break;case 2:set(x.d,R[x.s]-R[x.t]);break;case 3:set(x.d,R[x.s]&R[x.t]);break;case 4:set(x.d,R[x.s]^R[x.t]);break;case 5:set(x.d,R[x.s]<<R[x.t]);break;case 6:set(x.d,sg(R[x.s])>>R[x.t]);break;
      case 7:set(x.d,x.a);break;case 8:set(x.d,M[x.a]);break;case 9:if(x.a===255)out.push(R[x.d]);else{M[x.a]=R[x.d];chg.add('M'+h2(x.a));}break;case 10:set(x.d,M[R[x.t]&255]);break;case 11:M[R[x.t]&255]=R[x.d];break;
      case 12:if(R[x.d]===0){pc=x.a;chg.add('PC');}break;case 13:if(sg(R[x.d])>0){pc=x.a;chg.add('PC');}break;case 14:pc=R[x.d]&255;chg.add('PC');break;case 15:{const r=pc;pc=x.a;chg.add('PC');set(x.d,r);}break;}
    instrs++;lastNote=halted?'<b>Angehalten</b> nach '+instrs+' Befehlen. Ausgabe: '+(out.length?out.map(sg).join(', '):'keine')+'.':'<b>Ausführen:</b> '+OPN[op]+'. '+(op>=1&&op<=6?'Zwei Multiplexer lesen die Register, die ALU rechnet, und an der Taktflanke übernimmt der Decoder das Ergebnis in '+rn(x.d)+'.':op===12||op===13?'Das Steuerwerk prüft den Registerwert. Ist die Bedingung erfüllt, wird das Adressfeld in den PC geladen, sonst bleibt der schon erhöhte PC.':op===15?'Der alte PC – die Rücksprungadresse – geht ins Register, das Adressfeld in den PC.':op===14?'Der PC wird aus dem Register geladen: der Rücksprung.':op===9&&x.a===255?'Der Wert geht an die Ausgabe.':'Speicher und Register tauschen über die Busse Daten aus.');
    phase=0;return !halted;}
  function draw(){const A=lastAct||{w:[],b:[],s:['noch nichts ausgeführt'],c:[]},on=n=>A.w.includes(n)?' on':'',bon=n=>A.b.includes(n)?' on':'',con=n=>(A.c||[]).includes(n)?' on':'';
    const x=f();let g='<defs><marker id="dpA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0L10,5L0,10z" fill="var(--accent-2)"/></marker></defs>';
    // Steuerleitungen (gestrichelt)
    [['c-pc','M520 70 L520 20 L70 20 L70 150'],['c-mem','M540 70 L540 14 L240 14 L240 40'],['c-ir','M560 70 L560 60 L505 60'],['c-reg','M560 160 L560 205 L310 205 L310 230'],['c-alu','M580 160 L580 250 L520 250']].forEach(([id,d])=>g+='<path class="c'+con(id)+'" d="'+d+'"/>');
    // Datenleitungen
    const W=[['pc-mem','M115 165 L145 165 L145 120 L170 120'],['mem-ir','M310 70 L390 70'],['pc-inc','M70 194 L70 236 L22 236 L22 120 L50 120 L50 150'],['ir-ctl','M505 70 L515 70 L515 100 L500 100'],['ir-reg','M445 95 L445 135 L285 135 L285 230'],
      ['reg-alu-a','M310 260 L400 260'],['reg-alu-b','M310 300 L400 300'],['alu-reg','M480 280 L500 280 L500 350 L240 350 L240 340'],['ir-imm','M425 95 L425 125 L260 125 L260 230'],
      ['ir-mem','M405 95 L405 115 L195 115 L195 140'],['mem-reg','M215 140 L215 230'],['reg-mem','M230 230 L230 150'],['reg-addr','M180 280 L150 280 L150 130 L170 130'],
      ['reg-test','M310 245 L470 245 L470 160'],['ir-pc','M395 95 L395 108 L130 108 L130 160 L115 160'],['reg-pc','M180 320 L95 320 L95 194'],['pc-reg','M85 194 L85 300 L180 300']];
    W.forEach(([id,d])=>g+='<path class="w'+on(id)+'" d="'+d+'"'+(A.w.includes(id)?' marker-end="url(#dpA)"':'')+'/>');
    const box=(id,x0,y0,w,h,lab,val)=>'<g class="bx'+bon(id)+'"><rect x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" rx="7"/><text x="'+(x0+w/2)+'" y="'+(y0+16)+'" text-anchor="middle">'+lab+'</text>'+(val?'<text class="v" x="'+(x0+w/2)+'" y="'+(y0+h/2+12)+'" text-anchor="middle">'+val+'</text>':'')+'</g>';
    g+=box('pc',25,150,90,44,'PC',h2(pc));
    g+='<g class="bx'+bon('inc')+'"><rect x="30" y="98" width="40" height="22" rx="5"/><text x="50" y="113" text-anchor="middle">+1</text></g>';
    g+=box('mem',170,40,140,100,'Speicher',lastPh===0?'M['+h2(fetchAdr)+']':'256 × 16');
    g+=box('ir',390,45,115,50,'IR',h4(ir));
    g+=box('ctl',500,70,110,90,'Steuerwerk',lastPh<0?'bereit':'Phase '+(lastPh+1));
    const rl=x.op>=1&&x.op<=6?rn(x.d)+' ← '+rn(x.s)+', '+rn(x.t):x.op===10||x.op===11?rn(x.d)+', ['+rn(x.t)+']':x.op?rn(x.d):'';g+=box('reg',180,230,130,110,'Register',lastPh>0&&rl?rl:'R0 … RF');
    g+='<g class="bx'+bon('alu')+'"><path d="M400 240 L480 260 L480 300 L400 320 L400 290 L412 280 L400 270 Z"/><text x="446" y="284" text-anchor="middle">ALU</text></g>';
    if(phase===0)g+='';
    $('dpSvg').innerHTML=g;
    // Phasen, Signale, Zustand
    const shown=lastPh;
    $('dpPh').querySelectorAll('span').forEach((s,i)=>s.classList.toggle('on',i===shown));
    $('dpSig').innerHTML=A.s.map(s=>'<code>'+s+'</code>').join('');
    const regs=k==='sum'?[1,10,11]:[1,10,11,12,15];
    $('dpSt').innerHTML='<div class="'+(chg.has('PC')?'chg':'')+'"><span>PC</span>'+h2(pc)+'</div><div class="'+(chg.has('IR')?'chg':'')+'"><span>IR</span>'+h4(ir)+'</div>'+regs.map(r=>'<div class="'+(chg.has(rn(r))?'chg':'')+'"><span>'+rn(r)+'</span>'+h4(R[r])+'</div>').join('')+'<div><span>Aus</span>'+(out.length?sg(out[out.length-1]):'—')+'</div>';
    $('dpC').textContent=instrs+' Befehle';
    $('dpN').innerHTML=lastNote;}
  // Hinweis: act() zeigt die Signale der Phase, die als Nächstes ausgeführt wird
  $('dpStep').addEventListener('click',()=>{step();draw();});
  $('dpInstr').addEventListener('click',()=>{do{step();}while(phase!==0&&!halted);draw();});
  $('dpRun').addEventListener('click',()=>{let n=0;while(!halted&&n<20000){step();n++;}draw();});
  $('dpReset').addEventListener('click',reset);
  const bs=[...document.querySelectorAll('#dpP button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;reset();}));
  reset();
})();

// ---------- Pipeline ----------
(function(){
  const $=id=>document.getElementById(id);
  const ST=['IF','ID','EX','ME','WB'],NAMES=['load R1','load R2','add R3','store R3','branch'];
  function build(k){const rows=[];
    if(k==='seq'){NAMES.forEach((n,i)=>{const r={n,c:{}};ST.forEach((s,j)=>r.c[i*5+j]=s);rows.push(r);});}
    else if(k==='pipe'){NAMES.forEach((n,i)=>{const r={n,c:{}};ST.forEach((s,j)=>r.c[i+j]=s);rows.push(r);});}
    else if(k==='dep'){const names=['load R1','load R2','add R3, R1, R2','store R3','branch'];
      const plan=[[0,['IF','ID','EX','ME','WB']],[1,['IF','ID','EX','ME','WB']],[2,['IF','ID','bub','EX','ME','WB']],[4,['IF','ID','EX','ME','WB']],[5,['IF','ID','EX','ME','WB']]];
      names.forEach((n,i)=>{const r={n,c:{}};plan[i][1].forEach((s,j)=>r.c[plan[i][0]+j]=s);rows.push(r);});}
    else{// Sprung als Befehl 3, falsch vorhergesagt: zwei Befehle verworfen
      const names=['load R1','beq … (Sprung)','falscher Befehl 1','falscher Befehl 2','richtiges Ziel','danach'];names.forEach((n,i)=>{const r={n,c:{}};
        if(i<=1)ST.forEach((s,j)=>r.c[i+j]=s);
        else if(i<=3){r.c[i]='IF';if(i===2)r.c[i+1]='ID';r.fl=true;}
        else ST.forEach((s,j)=>r.c[i-1+j+0]=s);rows.push(r);});}
    return rows;}
  function draw(k){const rows=build(k);let max=0;rows.forEach(r=>Object.keys(r.c).forEach(c=>max=Math.max(max,+c)));
    let h='<table><tr><th></th>'+[...Array(max+1).keys()].map(i=>'<th>'+(i+1)+'</th>').join('')+'</tr>';
    rows.forEach(r=>{h+='<tr><td class="n">'+r.n+'</td>';for(let i=0;i<=max;i++){const v=r.c[i];h+=v?'<td class="'+(v==='bub'?'bub':r.fl?'fl':v)+'">'+(v==='bub'?'':v==='ME'?'MEM':v)+'</td>':'<td></td>';}h+='</tr>';});
    $('plT').innerHTML=h+'</table>';
    const useful=k==='miss'?4:5,cyc=max+1;
    $('plK').innerHTML='<div><b>'+cyc+'</b>Takte</div><div><b>'+useful+'</b>nützliche Befehle</div><div><b>'+(useful/cyc).toFixed(2).replace('.',',')+'</b>Befehle pro Takt</div>';
    const N={seq:'Jeder Befehl durchläuft alle fünf Stufen, bevor der nächste beginnt: 25 Takte. Vier von fünf Stufen sind in jedem Takt untätig.',pipe:'Jede Stufe arbeitet in jedem Takt an einem anderen Befehl. Nach der Anlaufphase wird mit jedem Takt ein Befehl fertig – die Zeit für einen einzelnen Befehl ist nicht kürzer, aber der Durchsatz fast fünfmal höher.',dep:'Der add-Befehl braucht R2, das der Ladebefehl direkt davor erst in seiner MEM-Stufe liefert. Selbst mit Forwarding muss er einen Takt warten – eine Blase (schraffiert) wandert durch die Pipeline. Compiler ordnen Befehle deshalb so um, dass zwischen Laden und Benutzen etwas anderes passiert.',miss:'Der Prozessor hat geraten, dass der Sprung nicht genommen wird, und schon zwei Befehle dahinter geholt. In der EX-Stufe stellt sich heraus: falsch. Die beiden Befehle werden verworfen (durchgestrichen), es geht am richtigen Ziel weiter. Bei 15 bis 20 Stufen kostet ein Fehlgriff entsprechend mehr.'};
    $('plN').innerHTML=N[k];}
  const bs=[...document.querySelectorAll('#plS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw(b.dataset.k);}));draw('pipe');
})();
