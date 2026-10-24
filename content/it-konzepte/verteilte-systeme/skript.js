// ---------- Neuversuch ----------
(function(){
  const $=id=>document.getElementById(id);
  let sc='resp',po='retry';
  function line(dir,label,lost){return '<div class="msg"><span>'+(dir==='r'?'Zahlungsdienst':'Bestelldienst')+'</span><div class="ln'+(dir==='r'?' r':'')+'"><i class="'+(lost?'lost':'')+'"></i><b class="'+(lost?'x':'')+'">'+(dir==='r'?'← ':'')+label+(dir==='r'?'':' →')+(lost?' ✗ verloren':'')+'</b></div><span>'+(dir==='r'?'Bestelldienst':'Zahlungsdienst')+'</span></div>';}
  function draw(){
    let h='',exec=0,known='';
    // erster Versuch
    h+=line('s','belaste 100 €'+(po==='idem'?' · key=a7f3':''),sc==='req');
    if(sc!=='req'){exec++;h+=line('r','OK',sc==='resp');}
    const gotAnswer=sc==='ok';
    if(!gotAnswer){h+='<div class="msg"><div class="wait">⏱ Timeout – keine Antwort</div></div>';
      if(po!=='none'){h+=line('s','belaste 100 €'+(po==='idem'?' · key=a7f3':''),false);
        if(po==='idem'&&exec>0){h+=line('r','OK (bereits ausgeführt, gespeicherte Antwort)',false);}
        else{exec++;h+=line('r','OK',false);}}}
    $('rnSeq').innerHTML=h;
    const bal=1000-100*exec;
    $('rnA').innerHTML='<div class="'+(exec===1?'good':'bad')+'"><b>'+exec+' ×</b>tatsächlich abgebucht</div><div class="'+(exec===1?'good':'bad')+'"><b>'+bal+' €</b>Kontostand (vorher 1000 €)</div>';
    let n;
    if(sc==='ok')n='Alles kam an, keine Frage stellt sich. Der interessante Fall ist der Timeout.';
    else if(po==='none')n=sc==='req'?'<b>Nicht ausgeführt</b> – und der Bestelldienst weiß es nicht. Die Ware geht womöglich raus, ohne dass bezahlt wurde.':'<b>Ausgeführt</b> – aber der Bestelldienst weiß es nicht. Er muss die Bestellung als gescheitert behandeln, obwohl das Geld weg ist.';
    else if(po==='retry')n=sc==='req'?'Diesmal ging es gut: Die erste Anfrage war ja nie angekommen. Aber der Bestelldienst konnte das nicht wissen …':'<b>Doppelt abgebucht.</b> Die erste Anfrage war ausgeführt worden, nur die Antwort ging verloren. Der Neuversuch bucht ein zweites Mal ab.';
    else n='<b>Genau einmal abgebucht – in beiden Fällen.</b> Der Zahlungsdienst merkt sich jede Kennung samt Ergebnis. Kommt dieselbe Kennung noch einmal, schickt er die gespeicherte Antwort statt erneut zu buchen. Der Absender darf gefahrlos wiederholen.';
    $('rnN').innerHTML=n;
  }
  function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);draw();}));}
  seg('rnS',d=>sc=d.s);seg('rnP',d=>po=d.p);draw();
})();

// ---------- Raft ----------
(function(){
  const $=id=>document.getElementById(id);
  const POS=[[110,70],[110,190],[330,40],[460,130],[330,220]];
  let N,leader,term,commit,part;
  function reset(){N=[0,1,2,3,4].map(i=>({alive:true,log:2}));leader=2;term=1;commit=2;part=false;draw('Fünf Rechner, Rechner 3 ist Anführer in Amtszeit 1. Alle haben zwei bestätigte Einträge.');}
  const side=i=>part?(i<2?'A':'B'):'A';
  function reach(i){return N.map((n,j)=>j).filter(j=>N[j].alive&&side(j)===side(i));}
  function draw(msg){
    let s='';
    if(part)s+='<line class="part" x1="220" y1="5" x2="220" y2="255"/><text x="225" y="18" style="font:700 11px var(--sans);fill:var(--bad)">Netz geteilt</text>';
    N.forEach((n,i)=>{const [x,y]=POS[i],isL=i===leader&&n.alive;const col=!n.alive?'var(--line)':isL?'var(--accent-2)':'var(--accent)';
      s+='<circle class="nd" cx="'+x+'" cy="'+y+'" r="28" fill="'+(n.alive?'var(--card)':'var(--bg)')+'" stroke="'+col+'"'+(n.alive?'':' stroke-dasharray="4 4"')+'/>';
      s+='<text class="t" x="'+x+'" y="'+(y+2)+'" text-anchor="middle">'+(i+1)+'</text><text class="s" x="'+x+'" y="'+(y+15)+'" text-anchor="middle">'+(!n.alive?'aus':isL?'Anführer':'Folger')+'</text>';
      for(let k=0;k<n.log;k++){const c=k<commit;s+='<rect class="lg" x="'+(x+34+k*10)+'" y="'+(y-6)+'" width="8" height="12" rx="1.5" fill="'+(c?col:'var(--bg)')+'" stroke="'+col+'"'+(c?'':' stroke-dasharray="2 2"')+'/>';}});
    s+='<text x="590" y="250" text-anchor="end" style="font:11px var(--sans);fill:var(--muted)">Amtszeit '+term+'</text>';
    $('raft').innerHTML=s;$('rN').innerHTML=msg;
    $('rE').disabled=leader!==null&&N[leader].alive&&!part;$('rK').disabled=leader===null||!N[leader].alive;
  }
  $('rW').addEventListener('click',()=>{
    if(leader===null||!N[leader].alive){draw('<b>Kein Anführer.</b> Niemand nimmt Schreibvorgänge an. Erst eine Neuwahl.');return;}
    const r=reach(leader);N[leader].log++;r.forEach(j=>{if(j!==leader)N[j].log=N[leader].log;});
    if(r.length>=3){commit=N[leader].log;draw('Der Anführer hängt den Eintrag an, verteilt ihn, und '+r.length+' von 5 Rechnern bestätigen. <b>Mehrheit – der Eintrag ist bestätigt</b> und gilt als dauerhaft.');}
    else draw('<b>Nur '+r.length+' von 5 erreichbar.</b> Der Anführer hängt den Eintrag an, aber ohne Mehrheit darf er ihn nicht bestätigen. Der Client bekommt keine Erfolgsmeldung – lieber warten als einen Eintrag versprechen, der verloren gehen könnte.');});
  $('rK').addEventListener('click',()=>{N[leader].alive=false;const was=leader+1;leader=null;draw('Rechner '+was+' ist ausgefallen. Die Folger bekommen keine Lebenszeichen mehr. Nach einer zufälligen Wartezeit beginnt einer eine Wahl.');});
  $('rE').addEventListener('click',()=>{
    // Kandidat: ein lebender Rechner auf der größeren Seite mit dem längsten Log
    const cands=N.map((n,i)=>i).filter(i=>N[i].alive);
    const best=cands.filter(i=>reach(i).length>=3).sort((a,b)=>N[b].log-N[a].log)[0];
    if(best===undefined){draw('<b>Keine Wahl möglich.</b> Kein Kandidat erreicht 3 Stimmen – auf keiner Seite sind genug Rechner. Das System bleibt stehen, bis genug wieder erreichbar sind. Es wählt lieber niemanden als zwei.');return;}
    if(leader!==null&&N[leader].alive&&side(leader)===side(best)){draw('Es gibt schon einen erreichbaren Anführer auf dieser Seite.');return;}
    term++;leader=best;const v=reach(best).length;
    // Minderheit verliert unbestätigte Einträge beim Heilen; hier: Folger der Seite übernehmen Log
    reach(best).forEach(j=>N[j].log=Math.max(commit,N[best].log));
    draw('Rechner '+(best+1)+' bittet um Stimmen – Bedingung: Sein Log ist mindestens so aktuell wie das des Wählers. '+v+' von 5 stimmen zu. <b>Neuer Anführer in Amtszeit '+term+'.</b>'+(part?' Die Minderheitsseite kann keinen eigenen wählen – es gibt also nie zwei.':''));});
  $('rP').addEventListener('click',()=>{part=true;
    draw('Das Netz teilt sich: Rechner 1 und 2 auf der einen Seite, 3, 4 und 5 auf der anderen. '+(leader!==null&&N[leader].alive?(side(leader)==='B'?'Der Anführer ist auf der Mehrheitsseite und kann weiter bestätigen.':'Der Anführer ist in der <b>Minderheit</b> – probier „Schreiben“, dann „Neuwahl“.'):''));});
  $('rH').addEventListener('click',()=>{part=false;N.forEach(n=>n.alive=true);if(leader===null)leader=N.map((n,i)=>i).sort((a,b)=>N[b].log-N[a].log)[0];
    N.forEach((n,i)=>{n.log=commit;});N[leader].log=commit;
    draw('Alles wieder verbunden. Rechner mit unbestätigten Einträgen aus der Minderheit verwerfen diese und übernehmen das Log des Anführers. Nichts Bestätigtes ging verloren.');});
  $('rX').addEventListener('click',reset);
  reset();
})();

// ---------- Backoff ----------
(function(){
  const $=id=>document.getElementById(id);
  let st='jit';
  function sim(){
    const C=200,DOWN=5,CAP=40,BIN=0.5,T=40,nb=T/BIN;const bins=Array(nb).fill(0),fail=Array(nb).fill(0);
    let rnd=7;const r=()=>{rnd=(rnd*1103515245+12345)&0x7fffffff;return rnd/0x7fffffff;};
    let pend=[...Array(C)].map(()=>({t:0,a:0}));let done=0,lastDone=0;
    for(let b=0;b<nb;b++){const t0=b*BIN,t1=t0+BIN;const now=pend.filter(p=>p.t>=t0&&p.t<t1);pend=pend.filter(p=>!(p.t>=t0&&p.t<t1));
      bins[b]=now.length;let ok=0;
      // überlastet schafft der Dienst weniger, nicht mehr (Überlastkollaps)
      if(t0>=DOWN)ok=now.length<=CAP?now.length:Math.max(3,Math.round(CAP*CAP/now.length/2));
      now.forEach((p,k)=>{if(k<ok){done++;lastDone=t1;}else{fail[b]++;p.a++;const base=st==='fix'?1:Math.min(8,Math.pow(2,p.a-1));const d=st==='jit'?base*r():base;pend.push({t:t0+Math.max(BIN,d),a:p.a});}});}
    return {bins,fail,done,lastDone,CAP,BIN,T,total:bins.reduce((a,b)=>a+b,0)};
  }
  function draw(){const s=sim(),W=620,H=210,l=40,r=12,t=24,b=30,pw=W-l-r,ph=H-t-b;
    const mx=Math.max(...s.bins,s.CAP*1.4),X=i=>l+pw*i/s.bins.length,Y=v=>t+ph*(1-v/mx),bw=pw/s.bins.length-1;
    let h='<line class="ax" x1="'+l+'" y1="'+(t+ph)+'" x2="'+(W-r)+'" y2="'+(t+ph)+'"/>';
    h+='<rect x="'+l+'" y="'+t+'" width="'+(pw*5/s.T)+'" height="'+ph+'" fill="var(--bad-soft)"/><text class="lb" x="'+(l+4)+'" y="'+(t+12)+'">Dienst aus</text>';
    s.bins.forEach((v,i)=>{const okv=v-s.fail[i];h+='<rect x="'+X(i)+'" y="'+Y(v)+'" width="'+bw+'" height="'+(Y(okv)-Y(v))+'" fill="var(--bad)"/><rect x="'+X(i)+'" y="'+Y(okv)+'" width="'+bw+'" height="'+(t+ph-Y(okv))+'" fill="var(--ok)"/>';});
    h+='<line x1="'+l+'" y1="'+Y(s.CAP)+'" x2="'+(W-r)+'" y2="'+Y(s.CAP)+'" stroke="var(--accent)" stroke-dasharray="5 4"/><text class="lb" x="'+(W-r)+'" y="'+(Y(s.CAP)-4)+'" text-anchor="end">Kapazität</text>';
    [0,5,10,15,20,25,30,35,40].forEach(x=>h+='<text class="lb" x="'+(l+pw*x/s.T)+'" y="'+(H-10)+'" text-anchor="middle">'+x+' s</text>');
    $('bo').innerHTML=h;
    $('boSt').innerHTML='<div><b>'+s.total.toLocaleString('de-DE')+'</b>Anfragen insgesamt</div><div><b>'+s.done+' / 200</b>bedient</div><div><b>'+(s.done===200?s.lastDone.toFixed(1).replace('.',',')+' s':'nach 40 s nicht')+'</b>bis alle bedient sind</div>';
    $('boN').innerHTML=st==='fix'?'<b>Alle im Gleichschritt:</b> Jede Sekunde trifft den Dienst die volle Welle. Er ist dauerhaft überlastet und bedient pro Welle nur eine Handvoll – über 4000 Anfragen, bis endlich alle durch sind.':
      st==='exp'?'Die Abstände wachsen – aber alle warten <em>gleich lange</em> und kommen deshalb weiterhin <b>gleichzeitig</b>. Jede Welle überlastet den Dienst erneut, und nach 40 Sekunden ist erst ein Bruchteil bedient. Exponentiell allein hilft nicht.':
      '<b>Der Zufall verteilt die Last.</b> Jeder wartet eine zufällige Zeit bis zur Obergrenze. Aus Wellen wird ein gleichmäßiger Strom, den der Dienst abarbeiten kann. Das ist die Standardempfehlung.';}
  const bs=[...document.querySelectorAll('#boS button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');st=b.dataset.s;draw();}));
  draw();
})();
