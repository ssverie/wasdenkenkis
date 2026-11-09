const $=id=>document.getElementById(id);
function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);}));}
const de=(v,d)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
const E=1.69,A=406.4,B=410.7,AL=0.34,BE=0.28;
const L=(N,D)=>E+A/Math.pow(N,AL)+B/Math.pow(D,BE);
function sup(e){return String(e).replace(/-/g,'⁻').replace(/[0-9]/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);}
function pow10(x){const e=Math.floor(x),m=Math.pow(10,x-e);return (m>=9.95?'10':de(m,1))+' · 10'+sup(m>=9.95?e+1:e);}
function big(n){const u=[[1e12,'Bio.'],[1e9,'Mrd.'],[1e6,'Mio.']];for(const [v,s] of u)if(n>=v)return de(n/v,n/v<10?1:0)+' '+s;return Math.round(n).toLocaleString('de-DE');}
function best(C){let b=[1e9,0];for(let x=6;x<=14;x+=0.01){const N=Math.pow(10,x),D=C/(6*N);if(D<1e6)continue;const l=L(N,D);if(!b[1]||l<b[1])b=[N,l];}return b;}

// ---------- Potenzgesetz ----------
(function(){
  let ax='log';const xs=[];for(let x=18;x<=27;x+=0.1)xs.push([x,best(Math.pow(10,x))[1]]);
  function draw(){const lc=+$('pwC').value/10,C=Math.pow(10,lc),[N,l]=best(C),D=C/(6*N);$('pwCo').textContent=pow10(lc);
    const W=500,H=220,pl=42,pb=26,pt=10,X=x=>pl+(x-18)/9*(W-pl-10);
    const red=v=>v-E,Ymax=ax==='log'?Math.log10(red(xs[0][1])):red(xs[0][1]),Ymin=ax==='log'?Math.log10(red(xs[xs.length-1][1])):0;
    const Y=v=>{const t=ax==='log'?Math.log10(red(v)):red(v);return pt+(Ymax-t)/(Ymax-Ymin)*(H-pt-pb);};
    let g='';for(let x=18;x<=27;x++){g+='<line x1="'+X(x)+'" x2="'+X(x)+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--line)"/>';if(x%2===0)g+='<text x="'+X(x)+'" y="'+(H-8)+'" text-anchor="middle" font-size="9" fill="var(--muted)">10'+sup(x)+'</text>';}
    if(ax==='lin'){g='';for(let x=18;x<=27;x++)g+='';const XL=x=>pl+(Math.pow(10,x)/1e27)*(W-pl-10);let d='';xs.forEach(([x,v],i)=>d+=(i?'L':'M')+XL(x).toFixed(1)+' '+Y(v).toFixed(1));
      g+='<line x1="'+pl+'" x2="'+(W-10)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'" stroke="var(--line)"/><line x1="'+pl+'" x2="'+pl+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--line)"/>';
      g+='<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="2.4"/><circle cx="'+XL(lc)+'" cy="'+Y(l)+'" r="5" fill="var(--accent-2)"/>';
      g+='<text x="'+(W-12)+'" y="'+(H-8)+'" text-anchor="end" font-size="9" fill="var(--muted)">Rechenleistung (linear, bis 10²⁷) →</text><text x="'+(pl+4)+'" y="'+(pt+10)+'" font-size="9" fill="var(--muted)">vermeidbarer Fehler</text>';}
    else{let d='';xs.forEach(([x,v],i)=>d+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(v).toFixed(1));g+='<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="2.4"/><circle cx="'+X(lc)+'" cy="'+Y(l)+'" r="5" fill="var(--accent-2)"/>';
      g+='<text x="'+(pl+4)+'" y="'+(pt+10)+'" font-size="9" fill="var(--muted)">vermeidbarer Fehler (log)</text>';}
    $('pwS').innerHTML=g;
    const l10=best(C*10)[1],gain=(1-(l10-E)/(l-E))*100;
    $('pwK').innerHTML='<div class="hl"><b>'+de(l,3)+'</b>Verlust</div><div><b>'+big(N)+'</b>Parameter</div><div><b>'+big(D)+'</b>Tokens</div><div><b>−'+Math.round(gain)+' %</b>vermeidbarer Fehler bei 10× C</div>';
    $('pwN').innerHTML=ax==='log'?'<b>Eine fast gerade Linie:</b> Jede Verzehnfachung der Rechenleistung verkleinert den vermeidbaren Fehler um einen ähnlichen Anteil, hier um etwa '+Math.round(gain)+' %. Deshalb lässt sich aus kleinen Testläufen vorhersagen, was ein großer bringt. Der Rest von 1,69 ist der Teil, den keine Skalierung beseitigt – Text ist nie ganz vorhersagbar.':'<b>Auf normalen Achsen</b> sieht man nur einen steilen Absturz ganz links und dann eine fast flache Linie: Der ganze Bereich, in dem heute trainiert wird, ist rechts zusammengequetscht. Deshalb zeigt man Skalierungskurven immer logarithmisch.';}
  $('pwC').addEventListener('input',draw);seg('pwA',d=>{ax=d.a;draw();});draw();
})();

// ---------- Chinchilla ----------
(function(){
  let mode='train';
  function cost(N,target,U){const r=target-E-A/Math.pow(N,AL);if(r<=0)return null;const D=Math.pow(B/r,1/BE);return {D,train:6*N*D,inf:2*N*U,tot:6*N*D+2*N*U};}
  function draw(){const lc=+$('chC').value/10,C=Math.pow(10,lc),ln=+$('chN').value/10,N=Math.pow(10,ln),lu=9+(+$('chU').value)*0.125,U=Math.pow(10,lu);
    $('chCo').textContent=pow10(lc);$('chNo').textContent=big(N);$('chUo').textContent=pow10(lu)+' Tok.';
    const W=500,H=200,pl=40,pb=24,pt=10,X=x=>pl+(x-8)/5*(W-pl-10);let g='';
    for(let x=8;x<=13;x++){g+='<line x1="'+X(x)+'" x2="'+X(x)+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--line)"/><text x="'+X(x)+'" y="'+(H-8)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+big(Math.pow(10,x))+'</text>';}
    if(mode==='train'){const pts=[];for(let x=8;x<=13;x+=0.02){const n=Math.pow(10,x),D=C/(6*n);pts.push([x,L(n,D)]);}
      const mn=Math.min(...pts.map(p=>p[1])),mx=Math.min(mn+1.2,Math.max(...pts.map(p=>p[1]))),Y=v=>(H-pb)-6-(Math.min(v,mx)-mn)/(mx-mn)*(H-pt-pb-6)*0.95;
      let d='';pts.forEach(([x,v],i)=>d+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(v).toFixed(1));g+='<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="2.4"/>';
      const [bn]=best(C);g+='<line x1="'+X(Math.log10(bn))+'" x2="'+X(Math.log10(bn))+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--ok)" stroke-dasharray="4 3"/><text x="'+(X(Math.log10(bn))+4)+'" y="'+(H-pb-6)+'" font-size="9" fill="var(--ok)">optimal</text>';
      const D=C/(6*N),l=L(N,D);g+='<circle cx="'+X(ln)+'" cy="'+Y(l)+'" r="6" fill="var(--accent-2)" stroke="#fff" stroke-width="1.5"/>';
      g+='<text x="'+(pl+4)+'" y="'+(pt+10)+'" font-size="9" fill="var(--muted)">Verlust (tiefer = besser)</text><text x="'+(W-12)+'" y="'+(pt+10)+'" text-anchor="end" font-size="9" fill="var(--muted)">Modellgröße N →</text>';
      $('chS').innerHTML=g;const bl=L(bn,C/(6*bn));
      $('chK').innerHTML='<div class="hl"><b>'+de(l,3)+'</b>Verlust</div><div><b>'+big(D)+'</b>Tokens</div><div><b>'+de(D/N,D/N<10?1:0)+'</b>Tokens pro Parameter</div><div><b>'+big(bn)+'</b>optimale Größe</div>';
      const rel=N/bn;$('chN2').innerHTML=(rel>2?'<b>Zu groß für dieses Budget.</b> Das Modell hat viele Parameter, sieht aber zu wenig Daten, um sie gut einzustellen. ':rel<0.5?'<b>Zu klein für dieses Budget.</b> Das Modell sieht viele Daten, hat aber zu wenig Kapazität, um sie zu nutzen. ':'<b>Nahe am Optimum.</b> ')+'Bei optimaler Aufteilung wäre der Verlust '+de(bl,3)+'. Die Formel aus der Studie empfiehlt hier rund '+Math.round(C/(6*bn)/bn)+' Tokens pro Parameter; die oft zitierte Faustregel von etwa 20 stammt aus anderen Schätzverfahren derselben Studie – auch das zeigt, dass es Näherungen sind.';}
    else{const target=2.0,pts=[];for(let x=8;x<=13;x+=0.02){const c=cost(Math.pow(10,x),target,U);if(c)pts.push([x,c]);}
      const tots=pts.map(p=>Math.log10(p[1].tot)),mn=Math.min(...tots)-0.15,mx=mn+2.6,Y=v=>(H-pb)-6-(Math.min(Math.log10(v),mx)-mn)/(mx-mn)*(H-pt-pb-6)*0.95;
      const path=f=>{let d='';pts.forEach(([x,c],i)=>{const v=f(c);if(v>0)d+=(d?'L':'M')+X(x).toFixed(1)+' '+Y(v).toFixed(1);});return d;};
      g+='<defs><clipPath id="chClip"><rect x="'+pl+'" y="'+pt+'" width="'+(W-pl-10)+'" height="'+(H-pt-pb)+'"/></clipPath></defs><g clip-path="url(#chClip)">';
      g+='<path d="'+path(c=>c.train)+'" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 3"/>';
      if(U>0)g+='<path d="'+path(c=>c.inf)+'" fill="none" stroke="var(--accent-2)" stroke-width="1.4" stroke-dasharray="2 3"/>';
      g+='<path d="'+path(c=>c.tot)+'" fill="none" stroke="var(--accent)" stroke-width="2.4"/></g>';
      let bi=0;pts.forEach((p,i)=>{if(p[1].tot<pts[bi][1].tot)bi=i;});const bx=pts[bi][0],bc=pts[bi][1];
      let ti=0;pts.forEach((p,i)=>{if(p[1].train<pts[ti][1].train)ti=i;});
      g+='<line x1="'+X(bx)+'" x2="'+X(bx)+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--ok)" stroke-dasharray="4 3"/><text x="'+(X(bx)+4)+'" y="'+(H-pb-6)+'" font-size="9" fill="var(--ok)">günstigste Gesamtkosten</text>';
      g+='<text x="'+(pl+4)+'" y="'+(pt+10)+'" font-size="9" fill="var(--muted)">Kosten (log, tiefer = billiger) · — gesamt · - - Training · ··· Betrieb</text>';
      const cur=cost(N,target,U);if(cur)g+='<circle cx="'+X(ln)+'" cy="'+Y(cur.tot)+'" r="6" fill="var(--accent-2)" stroke="#fff" stroke-width="1.5"/>';
      $('chS').innerHTML=g;const bn=Math.pow(10,bx),tn=Math.pow(10,pts[ti][0]);
      $('chK').innerHTML='<div class="hl"><b>'+big(bn)+'</b>günstigste Größe</div><div><b>'+big(bc.D)+'</b>Tokens dafür</div><div><b>'+Math.round(bc.D/bn).toLocaleString('de-DE')+'</b>Tokens pro Parameter</div><div><b>'+big(tn)+'</b>wenn nur Training zählt</div>';
      $('chN2').innerHTML='Ziel: Verlust 2,0. '+(cur?'':'<b>Mit '+big(N)+' Parametern ist das Ziel gar nicht erreichbar.</b> ')+(lu<11?'Wird das Modell kaum benutzt, ist die Chinchilla-Antwort richtig: rund '+big(tn)+' Parameter.':'Bei '+pow10(lu)+' Tokens Nutzung wandert das Optimum zu einem <b>kleineren</b> Modell ('+big(bn)+'), das dafür mit '+big(bc.D)+' Tokens viel länger trainiert wird. Das Training wird teurer, jede Antwort billiger. Genau deshalb sind heutige Modelle „übertrainiert“.');}
  }
  ['chC','chN','chU'].forEach(id=>$(id).addEventListener('input',draw));
  seg('chM',d=>{mode=d.m;$('chBud').hidden=mode!=='train';$('chUse').hidden=mode==='train';$('chP').hidden=mode!=='train';draw();});
  document.querySelectorAll('#chP button').forEach(b=>b.addEventListener('click',()=>{$('chC').value=Math.round(Math.log10(+b.dataset.c)*10);$('chN').value=Math.round(Math.log10(+b.dataset.n*1e9)*10);draw();}));
  draw();
})();

// ---------- Emergenz ----------
(function(){
  let k=5;const p=x=>0.03+0.95/(1+Math.exp(-(x-22)*1.3));
  function draw(){const W=500,H=200,pl=36,pb=24,pt=12,X=x=>pl+(x-18)/8*(W-pl-10),Y=v=>pt+(1-v)*(H-pt-pb);let g='';
    [0,0.5,1].forEach(v=>g+='<line x1="'+pl+'" x2="'+(W-10)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/><text x="'+(pl-5)+'" y="'+(Y(v)+3)+'" text-anchor="end" font-size="9" fill="var(--muted)">'+Math.round(v*100)+' %</text>');
    for(let x=18;x<=26;x+=2)g+='<text x="'+X(x)+'" y="'+(H-8)+'" text-anchor="middle" font-size="9" fill="var(--muted)">10'+sup(x)+'</text>';
    let d1='',d2='';for(let x=18;x<=26;x+=0.05){d1+=(d1?'L':'M')+X(x).toFixed(1)+' '+Y(p(x)).toFixed(1);d2+=(d2?'L':'M')+X(x).toFixed(1)+' '+Y(Math.pow(p(x),k)).toFixed(1);}
    g+='<path d="'+d1+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 3"/><path d="'+d2+'" fill="none" stroke="var(--accent-2)" stroke-width="2.6"/>';
    g+='<text x="'+(pl+6)+'" y="'+(pt+10)+'" font-size="9.5" fill="var(--accent)">- - jedes Token richtig (glatt)</text><text x="'+(pl+6)+'" y="'+(pt+22)+'" font-size="9.5" fill="var(--accent-2)">— ganze Antwort richtig</text><text x="'+(W-12)+'" y="'+(H-pb-4)+'" text-anchor="end" font-size="9" fill="var(--muted)">Rechenleistung →</text>';
    $('emS').innerHTML=g;
    $('emN').innerHTML=k===1?'Bei Antworten aus einem einzigen Token sind beide Kurven gleich: Kein Sprung, die Fähigkeit wächst sichtbar gleichmäßig.':'Die gestrichelte Linie wächst gleichmäßig. Die durchgezogene bleibt lange fast bei null und schießt dann hoch – weil eine Antwort aus '+k+' Tokens nur zählt, wenn <em>alle</em> stimmen: '+(k===5?'bei 80 % pro Token sind das nur 33 % ganze Antworten, bei 95 % schon 77 %.':'bei 95 % pro Token gerade 36 % ganze Antworten.')+' Wer nur ganze Antworten zählt, sieht „plötzlich auftauchende“ Fähigkeiten.';}
  seg('emK',d=>{k=+d.k;draw();});draw();
})();
