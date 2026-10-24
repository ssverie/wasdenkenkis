// ---------- Trace ----------
(function(){
  const $=id=>document.getElementById(id);
  // [name, dienst-index, start, dauer, tiefe, flag]
  function base(){return [['GET /bestellung',0,0,0,0],['bestellung: anlegen',1,5,0,1],['kunde: GET /kunde/42',2,10,20,2],['preis: POST /preise',3,32,28,2],['bestellung: INSERT',1,62,18,2],['zahlung: POST /zahlung',4,82,28,2]];}
  const SC={
    ok:()=>({sp:base(),n:'<b>Normal:</b> rund 120 ms, verteilt auf vier Dienste. Kunde und Preis werden nacheinander gefragt – hier könnte man parallelisieren, aber es ist schnell genug.'}),
    db:()=>{const s=base();s[4]=['bestellung: INSERT',1,62,3700,2,'hot'];s[5]=['zahlung: POST /zahlung',4,3764,28,2];return {sp:s,n:'<b>Eine Datenbankabfrage braucht 3,7 Sekunden.</b> Die Metrik zeigte nur „Bestellung langsam“, die Logs der vier Dienste zeigten nichts Auffälliges. Der Trace zeigt sofort den Span – vielleicht eine Sperre auf der Tabelle oder ein fehlender Index.'};},
    n1:()=>{const s=base().slice(0,3);let t=32;for(let i=0;i<18;i++){s.push(['preis: GET /preis/'+(100+i),3,t,24,2,'hot']);t+=26;}s.push(['bestellung: INSERT',1,t+2,18,2]);s.push(['zahlung: POST /zahlung',4,t+22,28,2]);return {sp:s,n:'<b>Für jede der 18 Positionen ein eigener Aufruf</b> an den Preisdienst, nacheinander – das N+1-Problem. Jeder einzelne Aufruf ist schnell, deshalb fällt er in keiner Metrik auf. Im Trace sieht man die Treppe sofort. Abhilfe: alle Preise in einem Aufruf holen.'};},
    retry:()=>{const s=base();s.pop();s.push(['zahlung: POST (1)',4,82,1000,2,'err'],['zahlung: POST (2)',4,1100,1000,2,'err'],['zahlung: POST (3)',4,2150,40,2]);return {sp:s,n:'<b>Zwei Zeitüberschreitungen à 1 Sekunde, dann klappt es.</b> Der Nutzer wartet über 2 Sekunden, aber die Fehlerquote bleibt bei null – die Anfrage war ja am Ende erfolgreich. Nur im Trace sieht man die Wiederholungen. Hier lohnt sich ein kürzeres Timeout oder ein Blick auf den Zahlungsanbieter.'};}
  };
  let k='ok';
  function draw(){const r=SC[k]();const sp=r.sp;let end=0;sp.forEach(x=>{if(x[3])end=Math.max(end,x[2]+x[3]);});
    sp[0][3]=end+5;sp[1][3]=end-5;const tot=end+5;
    $('trId').textContent='trace-id 4bf92f3577b34da6a3ce929d0e0e4736 · '+sp.length+' Spans · '+(tot>=1000?(tot/1000).toFixed(2).replace('.',',')+' s':tot+' ms');
    $('trW').innerHTML=sp.map(x=>'<div class="row"><span class="nm" style="padding-left:'+(x[4]*6)+'px" title="'+x[0]+'">'+x[0]+'</span><span class="tr"><span class="sp sv'+x[1]+(x[5]?' '+x[5]:'')+'" style="left:'+(x[2]/tot*100)+'%;width:'+(x[3]/tot*100)+'%"></span></span></div>').join('');
    const f=v=>v>=1000?(v/1000).toFixed(1).replace('.',',')+' s':Math.round(v)+' ms';
    $('trAx').innerHTML='<span>0</span><span>'+f(tot/2)+'</span><span>'+f(tot)+'</span>';
    $('trN').innerHTML=r.n;}
  const bs=[...document.querySelectorAll('#trS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');k=b.dataset.k;draw();}));draw();
})();

// ---------- Perzentile ----------
(function(){
  const $=id=>document.getElementById(id);
  function rng(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  function gauss(r){return Math.sqrt(-2*Math.log(r()+1e-12))*Math.cos(2*Math.PI*r());}
  function draw(){const fr=+$('pcF').value/100;$('pcFo').textContent=String(+$('pcF').value).replace('.',',')+' %';
    const r=rng(7),N=1000,nSlow=Math.round(N*fr),v=[];
    for(let i=0;i<N;i++){const slow=i<nSlow;v.push(slow?Math.exp(Math.log(2000)+0.35*gauss(r)):Math.exp(Math.log(80)+0.3*gauss(r)));}
    const s=[...v].sort((a,b)=>a-b),q=p=>s[Math.min(N-1,Math.floor(p*N))],mean=v.reduce((a,b)=>a+b,0)/N;
    const K=[['Durchschnitt',mean],['p50 (Median)',q(.5)],['p95',q(.95)],['p99',q(.99)]];
    const W=480,H=160,pl=8,pb=24,lo=Math.log10(20),hi=Math.log10(8000),x=t=>pl+(W-2*pl)*(Math.log10(t)-lo)/(hi-lo);
    const B=48,bins=new Array(B).fill(0);v.forEach(t=>{const b=Math.max(0,Math.min(B-1,Math.floor((Math.log10(t)-lo)/(hi-lo)*B)));bins[b]++;});
    const mx=Math.max(...bins),bw=(W-2*pl)/B;let g='';
    bins.forEach((c,i)=>{if(!c)return;const h=Math.max(1.5,(H-pb-44)*Math.sqrt(c/mx));g+='<rect x="'+(pl+i*bw+.5)+'" y="'+(H-pb-h)+'" width="'+(bw-1)+'" height="'+h+'" fill="var(--accent)" opacity=".7"/>';});
    [20,50,100,200,500,1000,2000,5000].forEach(t=>{g+='<text x="'+x(t)+'" y="'+(H-8)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+(t>=1000?t/1000+' s':t)+'</text>';});
    const col=['var(--accent-2)','var(--ok)','var(--muted)','var(--bad)'];
    K.forEach((k,i)=>{const X=x(k[1]);const ly=[10,22,34,10][i];g+='<line x1="'+X+'" x2="'+X+'" y1="'+(ly-8)+'" y2="'+(H-pb)+'" stroke="'+col[i]+'" stroke-width="1.8" stroke-dasharray="'+(i?'4 3':'')+'"/><text x="'+(X>W-60?X-4:X+4)+'" y="'+ly+'" text-anchor="'+(X>W-60?'end':'start')+'" font-size="9.5" font-weight="700" fill="'+col[i]+'">'+['Ø','p50','p95','p99'][i]+'</text>';});
    $('pcSvg').innerHTML=g;
    const ms=t=>t>=1000?(t/1000).toFixed(2).replace('.',',')+' s':Math.round(t)+' ms';
    $('pcK').innerHTML=K.map((k,i)=>'<div class="'+(i===0?'hl':'')+(k[1]>1000?' bad':'')+'"><b>'+ms(k[1])+'</b>'+k[0]+'</div>').join('');
    let n;
    if(fr===0)n='Keine langsamen Anfragen: Alle Kennzahlen liegen nah beieinander.';
    else if(fr<0.01)n='Unter 1 % langsam: Durchschnitt, p50 und p95 sehen gut aus. <b>Nur p99 zeigt das Problem.</b>';
    else if(fr<0.05)n='Der Durchschnitt liegt bei '+ms(mean)+' – <b>typisch ist das für keine der beiden Gruppen</b>: Die schnellen liegen um 80 ms, die langsamen um 2 s. p50 merkt nichts, erst p99 zeigt die Wahrheit.';
    else n='Ab 5 % springt auch p95 hoch. Ein Dashboard mit nur Durchschnitt und Median würde '+Math.round(fr*1000)+' Nutzer übersehen, die je rund zwei Sekunden gewartet haben.';
    $('pcN').innerHTML=n;}
  $('pcF').addEventListener('input',draw);draw();
})();

// ---------- Fehlerbudget ----------
(function(){
  const $=id=>document.getElementById(id);
  let slo=99.9;
  const fmt=m=>m>=60?(Math.floor(m/60)+' h '+String(Math.round(m%60)).padStart(2,'0')+' min'):(m<1?(Math.round(m*60)+' s'):(m.toFixed(m<10?1:0).replace('.',',')+' min'));
  function draw(){const used=+$('slU').value;$('slUo').textContent=used+' min';
    const budget=30*24*60*(100-slo)/100,pct=Math.min(100,used/budget*100);
    $('slB').innerHTML='<i class="used" style="width:'+pct+'%"></i><i class="left" style="width:'+(100-pct)+'%"></i>';
    $('slL').innerHTML='<span>Budget für 30 Tage: <b>'+fmt(budget)+'</b></span><span>'+(used>=budget?'<b style="color:var(--bad)">überschritten um '+fmt(used-budget)+'</b>':'übrig: <b>'+fmt(budget-used)+'</b> ('+Math.round(100-pct)+' %)')+'</span>';
    let n;
    if(used>=budget)n='<b>Budget aufgebraucht.</b> Nach gängiger Praxis werden riskante Änderungen eingefroren, bis die Zuverlässigkeit wieder stimmt – Stabilität geht vor neuen Funktionen.';
    else if(pct>60)n='<b>Mehr als die Hälfte verbraucht.</b> Vorsichtiger ausliefern, kritische Deployments verschieben, Ursachen der Ausfälle angehen.';
    else n='<b>Noch reichlich Budget.</b> Das Team kann ausliefern und experimentieren. Ein Budget, das nie angetastet wird, ist übrigens ein Hinweis, dass das Ziel strenger ist als nötig – und Entwicklung bremst.';
    if(slo===99.99)n+=' Bei 99,99 % bleiben nur gut 4 Minuten im Monat – das reicht kaum, um einen Alarm zu bemerken und zu reagieren. So ein Ziel verlangt vollautomatische Abläufe.';
    $('slN').innerHTML=n;}
  $('slU').addEventListener('input',draw);
  const bs=[...document.querySelectorAll('#slS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');slo=+b.dataset.v;draw();}));draw();
})();
