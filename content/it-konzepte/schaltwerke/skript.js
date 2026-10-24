// ---------- SR-Flipflop ----------
(function(){
  const $=id=>document.getElementById(id);let S=0,R=0,Q=0,NQ=1,hist=[];
  const nor=(a,b)=>(a||b)?0:1;
  function settle(){for(let i=0;i<6;i++){const q=nor(R,NQ),nq=nor(S,q);if(q===Q&&nq===NQ)break;Q=q;NQ=nq;}}
  function draw(){
    $('srT').innerHTML='<button data-t="S" class="'+(S?'on':'')+'">S = '+S+'</button><button data-t="R" class="'+(R?'on':'')+'">R = '+R+'</button><span>Tipp: S kurz auf 1 und wieder auf 0.</span>';
    $('srT').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.t==='S')S^=1;else R^=1;const before=Q;settle();hist.push([S,R,Q]);draw();}));
    const col=v=>v?'var(--accent-2)':'var(--muted)',sw=v=>v?3:1.5;let g='';
    const gate=(x,y,v)=>'<path d="M'+x+' '+(y-24)+' Q'+(x+30)+' '+(y-24)+' '+(x+56)+' '+y+' Q'+(x+30)+' '+(y+24)+' '+x+' '+(y+24)+' Q'+(x+12)+' '+y+' '+x+' '+(y-24)+' Z" fill="'+(v?'var(--accent-2-soft)':'var(--card)')+'" stroke="var(--fg)" stroke-width="1.6"/><circle cx="'+(x+61)+'" cy="'+y+'" r="5" fill="var(--card)" stroke="var(--fg)" stroke-width="1.6"/><text x="'+(x+24)+'" y="'+(y+4)+'" text-anchor="middle" font-size="10" fill="var(--muted)">NOR</text>';
    // Gatter oben: Eingänge R und NQ -> Q ; unten: S und Q -> NQ
    const gx=220,y1=70,y2=170;
    g+='<circle cx="50" cy="'+(y1-12)+'" r="16" fill="'+(R?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="50" y="'+(y1-8)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+(R?'#fff':'var(--fg)')+'">R</text><line x1="66" y1="'+(y1-12)+'" x2="'+(gx+4)+'" y2="'+(y1-12)+'" stroke="'+col(R)+'" stroke-width="'+sw(R)+'"/>';
    g+='<circle cx="50" cy="'+(y2+12)+'" r="16" fill="'+(S?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="50" y="'+(y2+16)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+(S?'#fff':'var(--fg)')+'">S</text><line x1="66" y1="'+(y2+12)+'" x2="'+(gx+4)+'" y2="'+(y2+12)+'" stroke="'+col(S)+'" stroke-width="'+sw(S)+'"/>';
    // Rückkopplung
    g+='<path d="M'+(gx+66)+' '+y1+' L330 '+y1+' L330 110 L150 140 L150 '+(y2-12)+' L'+(gx+4)+' '+(y2-12)+'" fill="none" stroke="'+col(Q)+'" stroke-width="'+sw(Q)+'"/>';
    g+='<path d="M'+(gx+66)+' '+y2+' L330 '+y2+' L330 130 L150 100 L150 '+(y1+12)+' L'+(gx+4)+' '+(y1+12)+'" fill="none" stroke="'+col(NQ)+'" stroke-width="'+sw(NQ)+'"/>';
    g+=gate(gx,y1,Q)+gate(gx,y2,NQ);
    g+='<line x1="330" y1="'+y1+'" x2="440" y2="'+y1+'" stroke="'+col(Q)+'" stroke-width="'+sw(Q)+'"/><circle cx="460" cy="'+y1+'" r="20" fill="'+(Q?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="460" y="'+(y1+5)+'" text-anchor="middle" font-size="14" font-weight="700" fill="'+(Q?'#fff':'var(--fg)')+'">'+Q+'</text><text x="492" y="'+(y1+5)+'" font-size="13" font-weight="700" fill="var(--fg)">Q</text>';
    g+='<line x1="330" y1="'+y2+'" x2="440" y2="'+y2+'" stroke="'+col(NQ)+'" stroke-width="'+sw(NQ)+'"/><circle cx="460" cy="'+y2+'" r="20" fill="'+(NQ?'var(--accent-2)':'var(--card)')+'" stroke="var(--fg)"/><text x="460" y="'+(y2+5)+'" text-anchor="middle" font-size="14" font-weight="700" fill="'+(NQ?'#fff':'var(--fg)')+'">'+NQ+'</text><text x="492" y="'+(y2+5)+'" font-size="13" font-weight="700" fill="var(--fg)">¬Q</text>';
    g+='<circle cx="330" cy="'+y1+'" r="3.5" fill="var(--fg)"/><circle cx="330" cy="'+y2+'" r="3.5" fill="var(--fg)"/>';
    $('srSvg').innerHTML=g;
    let n;
    if(S&&R)n='<b>S und R gleichzeitig 1:</b> Beide Ausgänge werden 0 – Q und ¬Q sind nicht mehr Gegenteile. Diese Eingabe ist verboten: Nimmt man beide gleichzeitig zurück, ist nicht vorhersagbar, in welchem Zustand die Schaltung landet.';
    else if(S)n='<b>Set:</b> Q wird 1. Nimm S jetzt wieder zurück – und schau, ob Q das merkt.';
    else if(R)n='<b>Reset:</b> Q wird 0. Nimm R wieder zurück.';
    else n='<b>S = R = 0: Halten.</b> Q ist '+Q+' – nicht weil die Eingänge das verlangen, sondern weil die Schaltung sich an den letzten Befehl erinnert. Das obere Gatter hält das untere fest und umgekehrt.';
    $('srN').innerHTML=n;}
  settle();draw();
})();

// ---------- D-Flipflop ----------
(function(){
  const $=id=>document.getElementById(id);let D=1,EN=1,Q=0;const cyc=[];
  function draw(){
    $('dfT').innerHTML='<button data-t="D" class="'+(D?'on':'')+'">D = '+D+'</button><button data-t="E" class="'+(EN?'on':'')+'">Freigabe = '+EN+'</button><button data-t="C" class="clk">Taktflanke ↑</button><button data-t="X" class="clk">Neu</button><span>Q = <b>'+Q+'</b></span>';
    $('dfT').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.t;
      if(t==='D'){D^=1;if(cyc.length&&cyc[cyc.length-1].open)cyc[cyc.length-1].dch.push(D);}
      else if(t==='E')EN^=1;
      else if(t==='X'){cyc.length=0;Q=0;}
      else{const before=Q;if(EN)Q=D;cyc.push({d:D,en:EN,q:Q,before,open:true,dch:[]});if(cyc.length>10)cyc.shift();cyc.forEach((c,i)=>c.open=i===cyc.length-1);}
      draw();}));
    // Wellenform
    const W=520,H=170,x0=70,n=10,cw=(W-x0-10)/n;let g='';
    const rows=[['Takt',25],['D',75],['Q',125]];
    rows.forEach(([l,y])=>{g+='<text x="10" y="'+(y+4)+'" font-size="12" font-weight="700" fill="var(--fg)">'+l+'</text><line x1="'+x0+'" y1="'+(y+15)+'" x2="'+(W-10)+'" y2="'+(y+15)+'" stroke="var(--line)"/>';});
    const lv=(y,v)=>v?y-12:y+12;
    // Takt
    let p='M'+x0+' '+lv(25,0);for(let i=0;i<n;i++){const x=x0+i*cw;p+=' L'+(x+cw*0.5)+' '+lv(25,0)+' L'+(x+cw*0.5)+' '+lv(25,1)+' L'+(x+cw)+' '+lv(25,1)+' L'+(x+cw)+' '+lv(25,0);}
    g+='<path d="'+p+'" fill="none" stroke="var(--muted)" stroke-width="1.6"/>';
    // Flankenmarker + D/Q
    let pd='',pq='';let lastD=null,lastQ=0;
    for(let i=0;i<n;i++){const c=cyc[i],x=x0+i*cw,xe=x+cw*0.5;
      if(!c){continue;}
      // D: Wert, der bei der Flanke anlag; Wechsel kurz vor der Flanke
      const dStart=lastD===null?c.d:lastD;
      pd+=(pd?' L':'M')+x+' '+lv(75,dStart)+' L'+(xe-8)+' '+lv(75,dStart)+' L'+(xe-8)+' '+lv(75,c.d)+' L'+(x+cw)+' '+lv(75,c.d);
      if(c.dch.length)g+='<text x="'+(xe+cw*0.25)+'" y="'+(lv(75,1)-4)+'" text-anchor="middle" font-size="8.5" fill="var(--accent)">'+c.dch.length+'×</text>';
      lastD=c.dch.length?c.dch[c.dch.length-1]:c.d;
      pq+=(pq?' L':'M')+x+' '+lv(125,c.before)+' L'+(xe+3)+' '+lv(125,c.before)+' L'+(xe+3)+' '+lv(125,c.q)+' L'+(x+cw)+' '+lv(125,c.q);
      g+='<line x1="'+xe+'" y1="8" x2="'+xe+'" y2="145" stroke="var(--accent-2)" stroke-width="1" stroke-dasharray="2 3" opacity=".7"/>';
      if(!c.en)g+='<text x="'+xe+'" y="160" text-anchor="middle" font-size="9" fill="var(--bad)">gesperrt</text>';}
    if(pd)g+='<path d="'+pd+'" fill="none" stroke="var(--accent)" stroke-width="2.2"/>';
    if(pq)g+='<path d="'+pq+'" fill="none" stroke="var(--accent-2)" stroke-width="2.6"/>';
    if(!cyc.length)g+='<text x="'+(W/2+30)+'" y="100" text-anchor="middle" font-size="12" fill="var(--muted)">Stell D ein und klick „Taktflanke ↑“</text>';
    $('wfSvg').innerHTML=g;
    const last=cyc[cyc.length-1];let n2;
    if(!last)n2='Q ist 0. Ändere D so oft du willst – Q reagiert erst bei der nächsten Taktflanke.';
    else if(!last.en)n2='Die Freigabe war aus: Trotz Taktflanke hat Q seinen Wert '+last.q+' behalten. So bleiben Register unverändert, die in diesem Takt nicht beschrieben werden sollen.';
    else if(last.dch.length)n2='D hat sich nach der letzten Flanke geändert ('+last.dch.length+'-mal), Q nicht. Erst die nächste Flanke übernimmt den dann anliegenden Wert.';
    else n2='Bei der Flanke lag D = '+last.d+' an, also ist Q jetzt '+last.q+'. Ändere D – Q bleibt, bis zur nächsten Flanke.';
    $('dfN').innerHTML=n2;}
  draw();
})();

// ---------- Speicher ----------
(function(){
  const $=id=>document.getElementById(id);const M=[0x05,0x2A,0x00,0xFF,0x13,0x80,0x0A,0x41];let A=1,last=null,read=null;
  function draw(){
    $('mmA').innerHTML=[...Array(8).keys()].map(i=>'<button data-a="'+i+'" aria-pressed="'+(i===A?'true':'false')+'">'+i.toString(2).padStart(3,'0')+'</button>').join('');
    $('mmA').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{A=+b.dataset.a;last=null;read=null;draw();}));
    $('mmR').innerHTML=M.map((w,i)=>'<div class="'+(i===A?'sel ':'')+(i===last?'wr':'')+'"><span class="dl">'+i+'</span>'+[...Array(8).keys()].map(b=>{const bit=(w>>(7-b))&1;return '<i class="'+(bit?'one':'')+'">'+bit+'</i>';}).join('')+'<span class="v">'+w+'</span></div>').join('');
    $('mmO').innerHTML=read!==null?'Gelesen aus Adresse '+A+': '+read.toString(2).padStart(8,'0')+' = '+read:'';
    $('mmN').innerHTML='Die drei Adressbits '+A.toString(2).padStart(3,'0')+' gehen in einen Decoder (links die Zeilennummern), der genau Zeile '+A+' auswählt. '+(last!==null?'<b>Geschrieben:</b> Nur diese Zeile hat bei der Taktflanke die Freigabe bekommen – alle anderen haben ihren Wert behalten.':read!==null?'<b>Gelesen:</b> Ein Multiplexer mit denselben Adressbits lässt nur den Inhalt dieser Zeile zum Ausgang durch. Lesen verändert nichts.':'Schreiben gibt dieser Zeile die Freigabe, Lesen schaltet sie auf den Ausgang.');}
  $('mmW').addEventListener('click',()=>{let v=parseInt($('mmIn').value,10);if(isNaN(v))v=0;v=Math.max(0,Math.min(255,v));$('mmIn').value=v;M[A]=v;last=A;read=null;draw();});
  $('mmL').addEventListener('click',()=>{read=M[A];last=null;draw();});
  draw();
})();
