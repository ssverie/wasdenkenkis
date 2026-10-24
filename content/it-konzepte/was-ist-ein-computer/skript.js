// ---------- Byte ----------
(function(){
  const box=document.getElementById('bytebits'),out=document.getElementById('interp');
  let v=65;
  const OPS=['HLT','LDA','ADD','SUB','STA','JMP','JZ','?','?','?','?','?','?','?','?','?'];
  function draw(){
    box.innerHTML='';
    for(let i=7;i>=0;i--){
      const on=(v>>i)&1;const d=document.createElement('div');d.className='bit';
      d.innerHTML='<button aria-pressed="'+(on?'true':'false')+'" aria-label="Bit '+i+'">'+on+'</button><small>'+(1<<i)+'</small>';
      d.querySelector('button').addEventListener('click',()=>{v^=(1<<i);draw();});
      box.appendChild(d);
    }
    const signed=v>127?v-256:v;
    const ch=v>=32&&v<127?'„'+String.fromCharCode(v)+'“':(v<32?'Steuerzeichen':v===127?'DEL':'–');
    const op=OPS[v>>4],a=v&15;
    out.innerHTML=
      '<div><b>'+v+'</b>als Zahl (0–255)</div>'+
      '<div><b>'+signed+'</b>als Java-<code>byte</code></div>'+
      '<div><b>0x'+v.toString(16).toUpperCase().padStart(2,'0')+'</b>hexadezimal</div>'+
      '<div><b>'+ch+'</b>als ASCII-Zeichen</div>'+
      '<div><span class="sw" style="background:rgb('+v+','+v+','+v+')"></span>als Grauwert</div>'+
      '<div><b>'+(op==='?'?'–':op+(op==='HLT'?'':' '+a))+'</b>als Befehl der Mini-CPU</div>';
  }
  document.querySelectorAll('.bit-quick button').forEach(b=>b.addEventListener('click',()=>{v=+b.dataset.v;draw();}));
  draw();
})();

// ---------- Volladdierer ----------
(function(){
  const svg=document.getElementById('adder');let A=1,B=1,C=0;
  function draw(){
    const s1=A^B,a1=A&B,sum=s1^C,a2=s1&C,co=a1|a2;
    const W=(pts,val)=>'<polyline class="w w'+val+'" points="'+pts+'"/>';
    let h='';
    h+=W('40,60 120,60',A)+W('40,60 90,60 90,115 120,115',A);
    h+=W('40,100 70,100 70,80 120,80',B)+W('40,100 70,100 70,135 120,135',B);
    h+=W('40,200 230,200 230,95 260,95',C)+W('40,200 230,200 230,180 260,180',C);
    h+=W('180,70 260,70',s1)+W('180,70 210,70 210,160 260,160',s1);
    h+=W('180,125 345,125 345,135 370,135',a1);
    h+=W('320,170 350,170 350,155 370,155',a2);
    h+=W('320,80 470,80',sum)+W('430,145 470,145',co);
    const G=(x,y,w,hh,t)=>'<rect class="g" x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="6"/><text class="gt" x="'+(x+w/2)+'" y="'+(y+hh/2+4)+'" text-anchor="middle">'+t+'</text>';
    h+=G(120,45,60,50,'XOR')+G(120,105,60,40,'UND')+G(260,55,60,50,'XOR')+G(260,145,60,45,'UND')+G(370,120,60,50,'ODER');
    const IN=(y,val,lab,id)=>'<g class="in" data-in="'+id+'" tabindex="0" role="button" aria-label="Eingang '+lab+' umschalten"><circle cx="28" cy="'+y+'" r="15" class="lamp'+val+'"/><text class="lt" x="28" y="'+(y+5)+'" text-anchor="middle" fill="'+(val?'#fff':'var(--fg)')+'">'+val+'</text></g><text class="lab" x="4" y="'+(y-20)+'">'+lab+'</text>';
    h+=IN(60,A,'A','A')+IN(100,B,'B','B')+IN(200,C,'Übertrag rein','C');
    const OUT=(y,val,lab)=>'<circle cx="490" cy="'+y+'" r="15" class="lamp'+val+'"/><text class="lt" x="490" y="'+(y+5)+'" text-anchor="middle" fill="'+(val?'#fff':'var(--fg)')+'">'+val+'</text><text class="lab" x="512" y="'+(y+4)+'">'+lab+'</text>';
    h+=OUT(80,sum,'Summe')+OUT(145,co,'Übertrag');
    svg.innerHTML=h;
    svg.querySelectorAll('.in').forEach(g=>{const f=()=>{const k=g.dataset.in;if(k==='A')A^=1;else if(k==='B')B^=1;else C^=1;draw();};g.addEventListener('click',f);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}});});
    document.getElementById('addres').innerHTML='<code>'+A+' + '+B+' + '+C+'</code> = '+(A+B+C)+' = binär <code>'+co+sum+'</code> – also Summe '+sum+', Übertrag '+co+(co?' („eins gemerkt“)':'');
  }
  document.querySelectorAll('[data-tg]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.tg;if(k==='A')A^=1;else if(k==='B')B^=1;else C^=1;draw();}));
  draw();
})();

// ---------- Mini-CPU ----------
(function(){
  const $=id=>document.getElementById(id);
  const OPS=['HLT','LDA','ADD','SUB','STA','JMP','JZ'];
  const PROGS=[
    {mem:[0x1E,0x2F,0x4D,0x00,0,0,0,0,0,0,0,0,0,0,3,4],data:[13,14,15],names:{13:'Ergebnis',14:'a',15:'b'}},
    {mem:[0x1D,0x2E,0x4D,0x1E,0x3F,0x4E,0x68,0x50,0x00,0,0,0,0,0,5,1],data:[13,14,15],names:{13:'Summe',14:'n',15:'eins'}}
  ];
  let P=0,M,pc,ir,acc,ph,n,running=null,lastRd=-1,lastWr=-1,done;
  function reset(){stop();const p=PROGS[P];M=p.mem.slice();pc=0;ir=null;acc=0;ph=0;n=0;done=false;lastRd=-1;lastWr=-1;
    say('Der Befehlszähler steht auf 0. Klick „Nächste Phase“: Die CPU holt das Byte, auf das er zeigt.');draw();}
  function say(t){$('cputxt').innerHTML=t;}
  const hx=v=>v.toString(16).toUpperCase().padStart(2,'0');
  const dec=v=>{const o=v>>4,a=v&15;return o<OPS.length?(o===0?'HLT':OPS[o]+' '+a):'?';};
  function draw(){
    const p=PROGS[P];
    $('mem').innerHTML=M.map((v,i)=>{
      const isData=p.data.includes(i);
      return '<div class="cell'+(i===pc&&!done?' pc':'')+(i===lastRd?' rd':'')+(i===lastWr?' wr':'')+(isData?' data':'')+'"><span class="ad">'+i+'</span><b>'+(isData?v:hx(v))+'</b><span class="as">'+(isData?(p.names[i]||'')+' · 0x'+hx(v):dec(v))+'</span></div>';
    }).join('');
    $('rPC').innerHTML='Befehlszähler (PC)<b>'+pc+'</b>';
    $('rIR').innerHTML='Befehlsregister (IR)<b>'+(ir===null?'–':'0x'+hx(ir)+' · '+dec(ir))+'</b>';
    $('rACC').innerHTML='Akkumulator (ACC)<b>'+acc+'</b>';
    $('rN').innerHTML='Ausgeführte Befehle<b>'+n+'</b>';
    [...$('phase').children].forEach((s,i)=>s.classList.toggle('on',!done&&i===ph));
    $('cStep').disabled=$('cInstr').disabled=$('cRun').disabled=done;
  }
  function phase(){
    if(done)return;
    lastRd=-1;lastWr=-1;
    if(ph===0){ir=M[pc];lastRd=pc;say('<b>Holen:</b> Die CPU liest das Byte an Adresse '+pc+' – <code>0x'+hx(ir)+'</code> – ins Befehlsregister und erhöht den Befehlszähler auf '+(pc+1)+'.');pc=(pc+1)&15;ph=1;}
    else if(ph===1){const o=ir>>4,a=ir&15;
      say('<b>Dekodieren:</b> Erste Hex-Ziffer <code>'+o+'</code> = <code>'+(OPS[o]||'?')+'</code>'+(o===0?' – anhalten.':', zweite Ziffer <code>'+a.toString(16).toUpperCase()+'</code> = Adresse '+a+'.'));ph=2;}
    else{const o=ir>>4,a=ir&15;let t;n++;
      switch(o){
        case 0:done=true;t='<b>Ausführen: HLT</b> – die CPU hält an. '+(P===0?'In Zelle 13 steht jetzt <b>'+M[13]+'</b>.':'In Zelle 13 steht die Summe <b>'+M[13]+'</b> – nach '+n+' Befehlen.');break;
        case 1:acc=M[a];lastRd=a;t='<b>Ausführen: LDA '+a+'</b> – lade den Inhalt von Zelle '+a+' ('+acc+') in den Akkumulator.';break;
        case 2:acc=(acc+M[a])&255;lastRd=a;t='<b>Ausführen: ADD '+a+'</b> – addiere '+M[a]+'. Akkumulator jetzt '+acc+'.';break;
        case 3:acc=(acc-M[a]+256)&255;lastRd=a;t='<b>Ausführen: SUB '+a+'</b> – ziehe '+M[a]+' ab. Akkumulator jetzt '+acc+'.';break;
        case 4:M[a]=acc;lastWr=a;t='<b>Ausführen: STA '+a+'</b> – schreibe '+acc+' in Zelle '+a+'.';break;
        case 5:pc=a;t='<b>Ausführen: JMP '+a+'</b> – setze den Befehlszähler auf '+a+'. Das ist eine Schleife.';break;
        case 6:if(acc===0){pc=a;t='<b>Ausführen: JZ '+a+'</b> – der Akkumulator ist 0, also springen nach '+a+'. Die Schleife ist zu Ende.';}else t='<b>Ausführen: JZ '+a+'</b> – der Akkumulator ist '+acc+', nicht 0: kein Sprung, weiter mit dem nächsten Befehl.';break;
        default:done=true;t='Unbekannter Befehl – die CPU hält an.';
      }
      say(t);ph=0;}
    draw();
  }
  function instr(){do{phase();}while(ph!==0&&!done);}
  function stop(){if(running){clearInterval(running);running=null;$('cRun').textContent='Laufen lassen';}}
  $('cStep').addEventListener('click',()=>{stop();phase();});
  $('cInstr').addEventListener('click',()=>{stop();instr();});
  $('cRun').addEventListener('click',()=>{if(running){stop();return;}$('cRun').textContent='Anhalten';running=setInterval(()=>{phase();if(done)stop();},350);});
  $('cReset').addEventListener('click',reset);
  const pb=[...document.querySelectorAll('#progSel button')];
  pb.forEach(b=>b.addEventListener('click',()=>{pb.forEach(x=>x.classList.remove('primary'));b.classList.add('primary');P=+b.dataset.p;reset();}));
  reset();
})();

// ---------- Latenzen ----------
(function(){
  const R=[
    ['1 Prozessortakt',0.3e-9,'1 Sekunde'],
    ['L1-Cache',1e-9,'3 Sekunden'],
    ['L3-Cache',13e-9,'43 Sekunden'],
    ['Arbeitsspeicher',100e-9,'6 Minuten'],
    ['SSD',50e-6,'2 Tage'],
    ['Festplatte',5e-3,'6 Monate'],
    ['Paket Frankfurt – New York und zurück',80e-3,'8 Jahre']
  ];
  let m='h';
  const real=s=>s<1e-6?(Math.round(s*1e10)/10).toLocaleString('de-DE')+' ns':s<1e-3?Math.round(s*1e6)+' µs':Math.round(s*1e3)+' ms';
  function draw(){
    const lo=Math.log10(R[0][1]),hi=Math.log10(R[R.length-1][1]);
    document.getElementById('lat').innerHTML=R.map(r=>{const w=8+92*(Math.log10(r[1])-lo)/(hi-lo);
      return '<div class="lrow"><span class="lb">'+r[0]+'</span><div class="tr"><div class="fl" style="width:'+w.toFixed(1)+'%"></div></div><span class="v">'+(m==='h'?r[2]:real(r[1]))+'</span></div>';}).join('');
  }
  const bs=[...document.querySelectorAll('#latSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.remove('primary'));b.classList.add('primary');m=b.dataset.m;draw();}));
  draw();
})();
