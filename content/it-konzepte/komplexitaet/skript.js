// ---------- Wachstum ----------
(function(){
  const $=id=>document.getElementById(id);
  const C=[
    ['O(1)',n=>1,'#15803d'],['O(log n)',n=>Math.log2(n),'#0e7490'],['O(n)',n=>n,'#2f5bd3'],
    ['O(n log n)',n=>n*Math.log2(n),'#8b3fb8'],['O(n²)',n=>n*n,'#b4540a'],['O(2ⁿ)',n=>Math.pow(2,n),'#be123c'],['O(n!)',n=>{let r=1;for(let i=2;i<=n;i++){r*=i;if(!isFinite(r))break;}return r;},'#7f1d1d']];
  const de=x=>x.toLocaleString('de-DE');
  function t(ops){const s=ops/1e9;
    if(!isFinite(s)||s>1e30)return 'praktisch ∞';
    if(s<1e-6)return 'unter 1 µs';if(s<1e-3)return Math.round(s*1e6)+' µs';if(s<1)return Math.round(s*1e3)+' ms';
    if(s<60)return s.toFixed(1).replace('.',',')+' s';if(s<3600)return Math.round(s/60)+' min';if(s<86400)return Math.round(s/3600)+' h';
    const y=s/31557600;if(y<1)return Math.round(s/86400)+' Tage';if(y<1e6)return de(Math.round(y))+' Jahre';
    if(y>1.4e10)return 'länger als das Universum';const [a,b]=y.toExponential(0).split('e+');return a+'·10^'+b+' J.';}
  function draw(){
    const n=Math.pow(10,+$('gN').value)/ (+$('gN').value>=1?1:1);
    $('gNo').textContent=de(n);
    const vals=C.map(c=>c[1](n)),lmax=Math.log10(1e30);
    $('gr').innerHTML=C.map((c,i)=>{const v=vals[i],lw=isFinite(v)?Math.max(1,Math.min(100,100*Math.log10(Math.max(v,1)+1)/lmax)):100,slow=v/1e9>60;
      return '<div class="grr'+(slow?' slow':'')+'"><span class="nm">'+c[0]+'</span><div class="tr"><div class="fl" style="width:'+lw.toFixed(1)+'%;background:'+c[2]+'"></div></div><span class="v">'+t(v)+'</span></div>';}).join('');
    const sq=t(n*n),nl=t(n*Math.log2(n));
    $('grNote').innerHTML=n<=100?'Bei '+de(n)+' Elementen ist alles bis auf das Exponentielle schnell. Selbst der quadratische Algorithmus fällt nicht auf – deshalb fällt er im Test so selten auf.':
      'Bei '+de(n)+' Elementen: Sortieren mit <code>O(n log n)</code> braucht '+nl+', der quadratische Weg '+sq+'. '+(n>=1e6?'Das ist der Unterschied zwischen „sofort“ und „Kaffee holen“ – oder „über Nacht“.':'Noch erträglich – aber verdoppelt sich n, vervierfacht sich der quadratische Aufwand.');
  }
  $('gN').addEventListener('input',draw);draw();
})();

// ---------- Suche ----------
(function(){
  const $=id=>document.getElementById(id);
  const A=[...Array(64)].map((_,i)=>i*2+1); // 1,3,5,…,127
  let st=null;
  function render(){
    $('arr').innerHTML=A.map((v,i)=>{let c='';if(st){if(st.found===i)c='hit';else if(i===st.cur)c='cur';else if(st.kind==='bin'&&(i<st.lo||i>st.hi))c='out';else if(st.kind==='lin'&&i<st.cur)c='seen';}
      return '<span class="'+c+'">'+v+'</span>';}).join('');
  }
  function start(kind){const t=+$('sT').value;st={kind,t,lo:0,hi:63,cur:kind==='lin'?0:31,steps:0,found:null,done:false};render();
    $('sOut').innerHTML=(kind==='bin'?'Binäre Suche':'Lineare Suche')+' nach '+t+' gestartet. „Ein Schritt“ oder gleich bis zum Ende.';}
  function step(){if(!st||st.done)return;st.steps++;const v=A[st.cur];
    if(v===st.t){st.found=st.cur;st.done=true;}
    else if(st.kind==='lin'){if(st.cur>=63){st.done=true;}else st.cur++;}
    else{if(v<st.t)st.lo=st.cur+1;else st.hi=st.cur-1;if(st.lo>st.hi){st.done=true;st.cur=-1;}else st.cur=(st.lo+st.hi)>>1;}
    render();
    $('sOut').innerHTML=st.done?(st.found!==null?'<b>Gefunden nach '+st.steps+' Vergleichen.</b>':'<b>Nicht vorhanden</b> – festgestellt nach '+st.steps+' Vergleichen. (Gerade Zahlen gibt es nicht.)'):(st.kind==='bin'?'Vergleich '+st.steps+': '+v+(v<st.t?' ist kleiner – rechte Hälfte weiter.':' ist größer – linke Hälfte weiter.')+' Noch '+(st.hi-st.lo+1)+' Kandidaten.':'Vergleich '+st.steps+': '+v+' – nicht gefunden, weiter.');
  }
  function run(kind){start(kind);const iv=setInterval(()=>{step();if(st.done)clearInterval(iv);},kind==='bin'?450:70);}
  $('sBin').addEventListener('click',()=>run('bin'));$('sLin').addEventListener('click',()=>run('lin'));
  $('sStep').addEventListener('click',()=>{if(!st||st.done)start('bin');else step();});
  $('sCmp').innerHTML='<div><b>bis zu 64</b>Vergleiche linear bei 64 Zahlen</div><div><b>höchstens 7</b>Vergleiche binär bei 64 Zahlen</div><div><b>bis zu 1 Mrd.</b>linear bei 1 Mrd. Zahlen</div><div><b>höchstens 30</b>binär bei 1 Mrd. Zahlen</div>';
  render();
})();

// ---------- ArrayList ----------
(function(){
  const $=id=>document.getElementById(id);
  let size,cap,copies,grows,lastCopy;
  function reset(){size=0;cap=0;copies=0;grows=0;lastCopy=0;draw('Leere ArrayList: Im JDK wird das Array erst beim ersten add angelegt.');}
  function add(k){let msg='';for(let i=0;i<k;i++){
      if(size===cap){const nc=cap===0?10:cap+(cap>>1);copies+=size;lastCopy=size;grows++;msg='Array war voll: neues Array mit '+nc+' Plätzen angelegt, '+size+' Elemente umkopiert.';cap=nc;}
      size++;}
    draw(msg||'Platz war noch frei – nur ein Wert ins Array geschrieben. O(1).');}
  function draw(msg){
    const show=Math.min(cap,160);let h='';
    for(let i=0;i<show;i++)h+='<span class="'+(i<lastCopy&&i<size&&msg.startsWith('Array war voll')?'cp':i<size?'f':'')+'"></span>';
    $('cap').innerHTML=h;
    $('alStats').innerHTML='<div><b>'+size+'</b>Elemente</div><div><b>'+cap+'</b>Kapazität</div><div><b>'+grows+'</b>mal gewachsen</div><div><b>'+(size?(copies/size).toFixed(2).replace('.',','):'0')+'</b>Kopien pro add im Schnitt</div>';
    $('alNote').innerHTML=msg+(size>50?' Egal wie viele Elemente: Der Schnitt bleibt unter 3 Kopien pro add – eine Konstante, unabhängig von n.':'');
  }
  $('alAdd').addEventListener('click',()=>add(1));$('alAdd10').addEventListener('click',()=>add(10));$('alAdd100').addEventListener('click',()=>add(100));$('alReset').addEventListener('click',reset);
  reset();
})();
