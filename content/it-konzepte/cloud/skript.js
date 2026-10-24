// ---------- Stapel ----------
(function(){
  const $=id=>document.getElementById(id);
  const L=['Anwendungscode','Daten und Zugriffsrechte','Frameworks und Abhängigkeiten','Skalierung (wie viele Instanzen)','Laufzeit (JVM)','Betriebssystem und Patches','Virtualisierung','Server und Speicher','Netz','Gebäude, Strom, Kühlung'];
  const YOU=[10,6,4,3,0];
  const N=['Alles liegt bei dir – bis zur Klimaanlage. Maximale Kontrolle, aber du musst Hardware kaufen, Monate vorausplanen und für die Spitzenlast dimensionieren.',
    '<b>Infrastructure as a Service:</b> Du mietest virtuelle Maschinen, Netze und Speicher. Ab dem Betriebssystem bist du zuständig – Updates, JVM, Deployment. Beispiele: EC2, Azure VMs, Compute Engine.',
    '<b>Platform as a Service:</b> Du lieferst dein Programm, die Plattform betreibt Betriebssystem und Laufzeit. Wie viele Instanzen laufen, legst du meist noch selbst fest – oder per Regel. Beispiele: Heroku, Azure App Service, Google App Engine – oder ein verwalteter Kubernetes-Cluster als Zwischenstufe.',
    '<b>Serverless (Functions as a Service):</b> Du lieferst einzelne Funktionen, die bei einem Ereignis laufen – eine Anfrage, eine hochgeladene Datei, eine Nachricht. Keine Instanzen zu verwalten, Abrechnung pro Aufruf und Laufzeit. Beispiele: AWS Lambda, Azure Functions, Cloud Run Functions.',
    '<b>Software as a Service:</b> Die fertige Anwendung, im Browser genutzt – Mail, Office, CRM. Selbst bei SaaS bleiben aber deine Daten und die Frage, wer darauf zugreifen darf, deine Verantwortung.'];
  let m=1;
  function draw(){const cut=YOU[m];$('stK').innerHTML=L.map((l,i)=>{let you=i<cut;if(m===4)you=i===1;return '<div class="'+(you?'you':'prov')+'"><span>'+l+'</span><small>'+(you?'du':'Anbieter')+'</small></div>';}).join('');$('stN').innerHTML=N[m];}
  const bs=[...document.querySelectorAll('#stS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=+b.dataset.m;draw();}));draw();
})();

// ---------- Last ----------
(function(){
  const $=id=>document.getElementById(id);
  let s='auto';
  function load(p){const base=10,out=[];for(let h=0;h<24;h++){const ev=Math.exp(-Math.pow((h-20)/2.2,2)),mo=0.35*Math.exp(-Math.pow((h-11)/2.5,2)),night=h<6?0.6:1;out.push(Math.round(base*night+base*(p-1)*(ev+mo*0.6)));}return out;}
  function draw(){const p=+$('ldP').value;$('ldPo').textContent=p+'×';const L=load(p),max=Math.max(...L),avg=L.reduce((a,b)=>a+b,0)/24;
    let cap=[],cost=0,over=0;
    if(s==='peak'){cap=L.map(()=>max);cost=max*24;}
    else if(s==='avg'){const c=Math.ceil(avg);cap=L.map(()=>c);cost=c*24;}
    else if(s==='auto'){cap=L.map((x,h)=>{const prev=L[(h+23)%24];return Math.max(10,Math.ceil(prev*1.2/5)*5);});cost=cap.reduce((a,b)=>a+b,0);}
    else{cap=L.slice();cost=L.reduce((a,b)=>a+b,0)*2.5;}
    let lost=0;L.forEach((x,h)=>{if(x>cap[h]){over++;lost+=x-cap[h];}});
    const used=L.reduce((a,b)=>a+b,0),util=s==='fn'?100:Math.round(used/cap.reduce((a,b)=>a+b,0)*100);
    // svg
    const W=480,H=190,pl=30,pb=22,pt=10,bw=(W-pl-6)/24,ym=Math.max(max,...cap)*1.15,y=v=>H-pb-(H-pb-pt)*v/ym;
    let g='';for(let k=0;k<=4;k++){const v=ym*k/4;g+='<line x1="'+pl+'" x2="'+(W-4)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)" stroke-width="1"/><text x="'+(pl-4)+'" y="'+(y(v)+3)+'" text-anchor="end" font-size="9" fill="var(--muted)">'+Math.round(v)+'</text>';}
    L.forEach((x,h)=>{const X=pl+h*bw+1,ov=x>cap[h];g+='<rect x="'+X+'" y="'+y(Math.min(x,cap[h]))+'" width="'+(bw-2)+'" height="'+(H-pb-y(Math.min(x,cap[h])))+'" fill="var(--accent)" opacity=".75"/>';if(ov)g+='<rect x="'+X+'" y="'+y(x)+'" width="'+(bw-2)+'" height="'+(y(cap[h])-y(x))+'" fill="var(--bad)"/>';if(h%3===0)g+='<text x="'+(X+bw/2)+'" y="'+(H-6)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+h+' h</text>';});
    let d='';cap.forEach((c,h)=>{const X=pl+h*bw;d+=(h?'L':'M')+X+' '+y(c)+'L'+(X+bw)+' '+y(c);});
    g+='<path d="'+d+'" fill="none" stroke="var(--accent-2)" stroke-width="2.2"/>';
    g+='<text x="'+(pl+6)+'" y="'+(pt+8)+'" font-size="9.5" fill="var(--accent-2)">— Kapazität</text><text x="'+(pl+70)+'" y="'+(pt+8)+'" font-size="9.5" fill="var(--accent)">▮ Last</text>'+(over?'<text x="'+(pl+112)+'" y="'+(pt+8)+'" font-size="9.5" fill="var(--bad)">▮ abgewiesen</text>':'');
    $('ldSvg').innerHTML=g;
    const ref=max*24;
    $('ldK').innerHTML='<div class="'+(cost<=ref*0.6?'good':(cost>ref*0.95?'bad':''))+'"><b>'+Math.round(cost)+'</b>Kosten pro Tag ('+Math.round(cost/ref*100)+' % von „fest für Spitze“)</div><div class="'+(util<50?'bad':'good')+'"><b>'+util+' %</b>Auslastung</div><div class="'+(over?'bad':'good')+'"><b>'+over+' h</b>mit Überlast</div>';
    const T={peak:'Nie Überlast – aber die meiste Zeit bezahlst du für Leerlauf. So rechnet ein klassisches Rechenzentrum.',
      avg:'Billig, aber zur Spitzenzeit werden Anfragen abgewiesen – genau dann, wenn die meisten Kunden da sind.',
      auto:'Die Kapazität folgt der Last mit Verzögerung. '+(over?'Bei steilen Anstiegen fehlt sie kurz – '+over+' Stunde'+(over>1?'n':'')+' mit Überlast. Mehr Reserve oder vorausschauendes Skalieren hilft.':'Keine Überlast, deutlich günstiger als fest für die Spitze.'),
      fn:'Kapazität passt sich sofort an, im Leerlauf kostet nichts. Trotz des höheren Preises pro Einheit ist das '+(cost<ref?'hier günstiger':'hier teurer')+' als feste Kapazität für die Spitze – je gleichmäßiger die Last, desto eher kippt es.'};
    $('ldN').innerHTML=T[s];}
  $('ldP').addEventListener('input',draw);
  const bs=[...document.querySelectorAll('#ldS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;draw();}));draw();
})();

// ---------- Zonen ----------
(function(){
  const $=id=>document.getElementById(id);
  // Server-Verteilung: [region][zone] = anzahl
  const DEP={one:[[1,0,0],[0,0,0]],zone:[[3,0,0],[0,0,0]],multi:[[1,1,1],[0,0,0]],region:[[1,1,1],[1,1,1]]};
  let d='multi',f='none';
  function draw(){const dep=DEP[d];let html='',alive=0,total=0;
    dep.forEach((zs,r)=>{const rdown=f==='region'&&r===0;html+='<div class="reg'+(rdown?' down':'')+'"><b>Region '+(r?'B (Irland)':'A (Frankfurt)')+'</b><div class="zs">';
      zs.forEach((n,z)=>{const zdown=rdown||(f==='zone'&&r===0&&z===0);html+='<div class="zn'+(zdown?' down':'')+'"><small>Zone '+(z+1)+'</small>';
        for(let i=0;i<n;i++){const off=zdown||(f==='srv'&&r===0&&z===0&&i===0);total++;if(!off)alive++;html+='<span class="srv'+(off?' off':'')+'"></span>';}
        html+='</div>';});html+='</div></div>';});
    $('azR').innerHTML=html;
    const r=$('azRes');
    if(alive===0){r.className='res dn';r.innerHTML='<b>Anwendung offline.</b> '+(d==='zone'&&f==='zone'?'Drei Server helfen nicht, wenn alle im selben Rechenzentrum stehen – fällt dort Strom oder Netz aus, sind alle weg.':'Kein Server mehr erreichbar.');}
    else if(alive<total){r.className='res up';r.innerHTML='<b>Anwendung läuft weiter</b> mit '+alive+' von '+total+' Servern. Der Lastverteiler leitet nur noch an die gesunden weiter; die Plattform startet Ersatz.'+(d==='region'&&f==='region'?' Der Wechsel in eine andere Region klappt aber nur, wenn die Daten dorthin repliziert sind und DNS umschaltet – in der Praxis dauert das oft Minuten und kann frische Daten kosten.':'');}
    else{r.className='res up';r.innerHTML='<b>Alles läuft.</b> Wähle einen Ausfall.';}}
  function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);draw();}));}
  seg('azD',x=>d=x.d);seg('azF',x=>f=x.f);draw();
})();
