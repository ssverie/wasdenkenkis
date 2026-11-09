const $=id=>document.getElementById(id);
const de=(v,d)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
const sig=z=>1/(1+Math.exp(-z));
function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);}));}

// ---------- Gerade anpassen ----------
(function(){
  const X=[1,2,3,4,5],Y=[2.1,3.9,6.2,7.8,10.1],WR=[-1,5],BR=[-4,6];
  let w,b,path,k,lr=0.03,start=[0,4];
  const loss=(w,b)=>X.reduce((s,x,i)=>s+(w*x+b-Y[i])**2,0)/X.length;
  const grad=(w,b)=>{let gw=0,gb=0;X.forEach((x,i)=>{const e=w*x+b-Y[i];gw+=2*e*x/X.length;gb+=2*e/X.length;});return [gw,gb];};
  // Geländebild vorberechnen
  const N=40,cells=[];let mx=0;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const ww=WR[0]+(WR[1]-WR[0])*(i+.5)/N,bb=BR[1]-(BR[1]-BR[0])*(j+.5)/N,L=Math.log10(loss(ww,bb)+0.01);cells.push([i,j,L]);mx=Math.max(mx,L);}
  const mn=Math.min(...cells.map(c=>c[2]));
  const sx=w=>(w-WR[0])/(WR[1]-WR[0])*240,sy=b=>(BR[1]-b)/(BR[1]-BR[0])*200;
  let terrain='';cells.forEach(([i,j,L])=>{const t=(L-mn)/(mx-mn);terrain+='<rect x="'+(i*6)+'" y="'+(j*5)+'" width="6.3" height="5.3" fill="hsl(215,55%,'+Math.round(18+t*70)+'%)"/>';});
  function reset(){w=start[0];b=start[1];path=[[w,b]];k=0;draw();}
  function step(){const [gw,gb]=grad(w,b);w-=lr*gw;b-=lr*gb;k++;if(Math.abs(w)<1e6&&Math.abs(b)<1e6)path.push([w,b]);}
  function draw(){const L=loss(w,b),bad=!isFinite(L)||L>1e4;
    // Daten
    const dx=x=>20+x*38,dy=y=>185-y*15;let g='<rect width="240" height="200" fill="var(--bg)"/>';
    for(let v=0;v<=12;v+=4)g+='<line x1="20" x2="235" y1="'+dy(v)+'" y2="'+dy(v)+'" stroke="var(--line)"/><text x="16" y="'+(dy(v)+3)+'" font-size="8" text-anchor="end" fill="var(--muted)">'+v+'</text>';
    if(!bad){const y0=w*0+b,y1=w*5.6+b;g+='<line x1="'+dx(0)+'" y1="'+dy(y0)+'" x2="'+dx(5.6)+'" y2="'+dy(y1)+'" stroke="var(--accent-2)" stroke-width="2.5"/>';X.forEach((x,i)=>{g+='<line x1="'+dx(x)+'" x2="'+dx(x)+'" y1="'+dy(Y[i])+'" y2="'+dy(w*x+b)+'" stroke="var(--bad)" stroke-dasharray="2 2"/>';});}
    X.forEach((x,i)=>g+='<circle cx="'+dx(x)+'" cy="'+dy(Y[i])+'" r="4.5" fill="var(--accent)"/>');
    $('ftD').innerHTML='<defs><clipPath id="ftClip"><rect width="240" height="200"/></clipPath></defs><g clip-path="url(#ftClip)">'+g+'</g>';
    // Gelände
    let s=terrain;const opt=[1.99,0.05];s+='<circle cx="'+sx(opt[0])+'" cy="'+sy(opt[1])+'" r="4" fill="none" stroke="#fff" stroke-width="1.5"/>';
    let d='';path.forEach((p,i)=>{const px=Math.max(-50,Math.min(290,sx(p[0]))),py=Math.max(-50,Math.min(250,sy(p[1])));d+=(i?'L':'M')+px.toFixed(1)+' '+py.toFixed(1);});
    s+='<path d="'+d+'" fill="none" stroke="var(--accent-2)" stroke-width="1.6"/>';
    if(!bad)s+='<circle cx="'+sx(w)+'" cy="'+sy(b)+'" r="5" fill="var(--accent-2)" stroke="#fff" stroke-width="1.5"/>';
    s+='<text x="236" y="196" text-anchor="end" font-size="8" fill="#fff">w →</text><text x="4" y="10" font-size="8" fill="#fff">↑ b</text>';
    $('ftS').innerHTML='<defs><clipPath id="ftClip2"><rect width="240" height="200"/></clipPath></defs><g clip-path="url(#ftClip2)">'+s+'</g>';
    const [gw,gb]=grad(w,b);
    $('ftV').innerHTML=bad?'<div class="bad"><b>∞</b>Verlust</div><div class="bad"><b>–</b>w</div><div class="bad"><b>–</b>b</div><div class="bad"><b>–</b>Gradient</div>':'<div><b>'+de(L,3)+'</b>Verlust</div><div><b>'+de(w,3)+'</b>w (Steigung)</div><div><b>'+de(b,3)+'</b>b (Achsenabschnitt)</div><div><b>('+de(gw,2)+'; '+de(gb,2)+')</b>Gradient</div>';
    $('ftC').textContent=k+' Schritte';
    let n;if(bad)n='<b>Auseinandergelaufen.</b> Bei Lernrate '+de(lr,3)+' springt jeder Schritt weiter über das Tal hinaus als der vorige. Ab etwa 0,084 passiert das bei diesen Daten zwangsläufig.';
    else if(k===0)n='Start bei w = '+de(w,2)+', b = '+de(b,2)+': eine Gerade, die nicht passt. Die roten Strecken sind die Fehler. Der Gradient zeigt bergauf; gegangen wird in die Gegenrichtung.';
    else if(L<0.025)n='<b>Im Tal angekommen</b> nach '+k+' Schritten: w ≈ 2, b ≈ 0, also y ≈ 2x. Kleiner wird der Fehler nicht, weil die Punkte nicht genau auf einer Geraden liegen.';
    else if(lr>0.07)n='Die Lernrate ist groß: Der Weg springt in Richtung w hin und her, weil das Tal dort steil ist. Noch kommt er an – knapp über 0,084 nicht mehr.';
    else if(lr<0.012)n='Sehr kleine Schritte: sicher, aber langsam. Vor allem in Richtung b, wo das Tal flach ist, kriecht der Abstieg.';
    else n='Erst geht es schnell quer ins Tal (Richtung w ist steil), dann langsam das flache Tal entlang (Richtung b). Weiterklicken.';
    $('ftN').innerHTML=n;}
  $('ftL').addEventListener('input',()=>{lr=+$('ftL').value/1000;$('ftLo').textContent=de(lr,3);reset();});$('ftLo').textContent=de(lr,3);
  $('ft1').addEventListener('click',()=>{step();draw();});
  $('ft10').addEventListener('click',()=>{for(let i=0;i<10;i++)step();draw();});
  $('ft100').addEventListener('click',()=>{for(let i=0;i<100;i++)step();draw();});
  $('ftR').addEventListener('click',reset);
  $('ftS').addEventListener('click',e=>{const r=$('ftS').getBoundingClientRect(),px=(e.clientX-r.left)/r.width*240,py=(e.clientY-r.top)/r.height*200;start=[WR[0]+px/240*(WR[1]-WR[0]),BR[1]-py/200*(BR[1]-BR[0])];reset();});
  reset();
})();

// ---------- Backpropagation ----------
(function(){
  const N0={w:[0.15,-0.20,-0.10,0.25,0.10,-0.10],b:0},X=[1,0.5],T=1,ETA=0.2,WN=['w₁','w₂','w₃','w₄','w₅','w₆'];
  function fwd(n){const z1=n.w[0]*X[0]+n.w[1]*X[1],z2=n.w[2]*X[0]+n.w[3]*X[1],h1=sig(z1),h2=sig(z2),z=n.w[4]*h1+n.w[5]*h2+n.b;return {z1,z2,h1,h2,z,y:sig(z)};}
  const f=fwd(N0),d=(f.y-T)*f.y*(1-f.y),d1=d*N0.w[4]*f.h1*(1-f.h1),d2=d*N0.w[5]*f.h2*(1-f.h2);
  const G=[d1*X[0],d1*X[1],d2*X[0],d2*X[1],d*f.h1,d*f.h2],GB=d;
  const N1={w:N0.w.map((w,i)=>w-ETA*G[i]),b:N0.b-ETA*GB},f2=fwd(N1);
  const S=[
    {h:'Ausgangslage: Zufallsgewichte',sh:{},c:'w₁ = 0,15 &nbsp; w₂ = −0,20 &nbsp; w₃ = −0,10 &nbsp; w₄ = 0,25 &nbsp; w₅ = 0,10 &nbsp; w₆ = −0,10 &nbsp; b = 0',n:'Sieben kleine Zufallszahlen. Am Eingang liegt ein Vogel: Schnabeldetektor <b>1,0</b>, Flügeldetektor <b>0,5</b>. Gewünscht ist am Ausgang <b>1</b>.'},
    {h:'1 · Vorwärts: versteckte Schicht',sh:{h:1},c:'h₁ = σ(0,15·1 + (−0,20)·0,5) = σ('+de(f.z1,3)+') = <b>'+de(f.h1,4)+'</b><br>h₂ = σ((−0,10)·1 + 0,25·0,5) = σ('+de(f.z2,3)+') = <b>'+de(f.h2,4)+'</b>',n:'Gewichtete Summe, dann σ. Bei so kleinen Gewichten liegt die Summe nahe 0, und σ(0) = 0,5: Die Neuronen sind unentschieden.'},
    {h:'2 · Vorwärts: Ausgang',sh:{h:1,y:1},c:'y = σ(0,10·'+de(f.h1,4)+' + (−0,10)·'+de(f.h2,4)+') = σ('+de(f.z,4)+') = <b>'+de(f.y,4)+'</b>',n:'Das Netz sagt <b>„0,5 – vielleicht ein Vogel“</b>. Es weiß noch gar nichts.'},
    {h:'3 · Der Verlust',sh:{h:1,y:1,e:1},c:'Fehler e = y − Ziel = '+de(f.y,4)+' − 1 = <b>'+de(f.y-T,4)+'</b> &nbsp;&nbsp; Verlust L = ½·e² = <b>'+de(0.5*(f.y-T)**2,4)+'</b>',n:'Eine einzige Zahl sagt, wie falsch das Netz liegt. Alles Weitere dient dazu, sie zu verkleinern.'},
    {h:'4 · Rückwärts: Ausgangsschicht',sh:{h:1,y:1,e:1,g2:1},c:'δ = e · y(1−y) = '+de(f.y-T,4)+' · '+de(f.y*(1-f.y),4)+' = <b>'+de(d,4)+'</b><br><span class="g">∂L/∂w₅ = δ·h₁ = '+de(G[4],4)+' &nbsp; ∂L/∂w₆ = δ·h₂ = '+de(G[5],4)+' &nbsp; ∂L/∂b = δ = '+de(GB,4)+'</span>',n:'δ ist der Fehler am Ausgang, gewichtet mit der Empfindlichkeit von σ. Ein Gewicht ist umso mehr verantwortlich, je aktiver sein Eingang war – daher δ mal h. Negativ heißt: Vergrößern verkleinert den Fehler.'},
    {h:'5 · Rückwärts: eine Schicht tiefer',sh:{h:1,y:1,e:1,g2:1,g1:1},c:'δ₁ = δ · w₅ · h₁(1−h₁) = <b>'+de(d1,5)+'</b><br>δ₂ = δ · w₆ · h₂(1−h₂) = <b>'+de(d2,5)+'</b><br><span class="g">∂L/∂w₁ = δ₁·1 = '+de(G[0],5)+' &nbsp; ∂L/∂w₂ = δ₁·0,5 = '+de(G[1],5)+'<br>∂L/∂w₃ = δ₂·1 = '+de(G[2],5)+' &nbsp; ∂L/∂w₄ = δ₂·0,5 = '+de(G[3],5)+'</span>',n:'Das ist die Kettenregel: Der Fehler des Ausgangs geht über w₅ zurück zu h₁, multipliziert mit dessen eigener Empfindlichkeit. Weil w₆ negativ ist, kommt bei h₂ das umgekehrte Vorzeichen an. Mehr Schichten heißt: mehr solcher Multiplikationen hintereinander.'},
    {h:'6 · Alle Gewichte ein Stück bergab',sh:{h:1,y:1,u:1},c:'w ← w − η·∂L/∂w &nbsp; mit η = 0,2:<br>'+WN.map((n,i)=>n+' '+de(N0.w[i],2)+'→<b>'+de(N1.w[i],4)+'</b>'+(i===2?'<br>':' &nbsp; ')).join('')+' &nbsp; b 0→<b>'+de(N1.b,4)+'</b>',n:'Gradientenabstieg: Jedes Gewicht bewegt sich gegen seinen Gradienten, alle gleichzeitig, alle nur ein winziges Stück.'},
    {h:'7 · Noch einmal vorwärts',sh:{h:1,y:1,u:1,y2:1},c:'h₁ = '+de(f2.h1,4)+' &nbsp; h₂ = '+de(f2.h2,4)+' &nbsp; y = σ('+de(f2.z,4)+') = <b>'+de(f2.y,4)+'</b>',n:'<b>Aus 0,50 wird 0,51.</b> Ein winziger Fortschritt – Training heißt, diesen Schritt viele Millionen Mal mit immer neuen Beispielen zu wiederholen.'}
  ];
  let i=0;
  function svg(st){const sh=st.sh,cur=sh.u?N1:N0,ff=sh.y2?f2:f,P={x1:[70,70],x2:[70,190],h1:[280,70],h2:[280,190],y:[470,130]};
    const E=[['x1','h1',0,.5,-10],['x2','h1',1,.55,-10],['x1','h2',2,.55,16],['x2','h2',3,.5,18],['h1','y',4,.56,-10],['h2','y',5,.56,18]];let g='';
    E.forEach(([a,b,k])=>{const on=(k>=4&&sh.g2)||(k<4&&sh.g1);g+='<line x1="'+P[a][0]+'" y1="'+P[a][1]+'" x2="'+P[b][0]+'" y2="'+P[b][1]+'" stroke="'+(on?'var(--accent)':'var(--line)')+'" stroke-width="'+(on?2.5:1.6)+'"/>';});
    E.forEach(([a,b,k,t,off])=>{const A=P[a],B=P[b],x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t,on=(k>=4&&sh.g2)||(k<4&&sh.g1);g+='<text x="'+x+'" y="'+(y+off)+'" text-anchor="middle" font-size="10.5" fill="var(--fg)" paint-order="stroke" stroke="var(--card)" stroke-width="4">'+WN[k]+' = '+de(cur.w[k],sh.u?3:2)+(on?'<tspan fill="var(--accent)">  ∇ '+de(G[k],k<4?5:4)+'</tspan>':'')+'</text>';});
    const node=(id,lab,val,hl)=>{const p=P[id];return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="27" fill="'+(hl?'var(--accent-2-soft)':'var(--card)')+'" stroke="'+(hl?'var(--accent-2)':'var(--fg)')+'" stroke-width="'+(hl?2.5:1.5)+'"/><text x="'+p[0]+'" y="'+(p[1]-4)+'" text-anchor="middle" font-size="'+(lab.length>6?8.5:11)+'" fill="var(--muted)">'+lab+'</text><text x="'+p[0]+'" y="'+(p[1]+12)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fg)">'+val+'</text>';};
    g+=node('x1','Schnabel','1,0',0)+node('x2','Flügel','0,5',0)+node('h1','h₁',sh.h?de(ff.h1,3):'?',i===1||i===7)+node('h2','h₂',sh.h?de(ff.h2,3):'?',i===1||i===7)+node('y','y',sh.y?de(ff.y,3):'?',i===2||i===7);
    if(sh.e)g+='<text x="470" y="62" text-anchor="middle" font-size="11" fill="var(--bad)">Ziel 1 · Fehler '+de(f.y-T,3)+'</text>';
    g+='<text x="503" y="134" font-size="10" fill="var(--muted)">b = '+de(cur.b,sh.u?3:0)+'</text>';
    if(sh.g2&&!sh.u)g+='<text x="280" y="250" text-anchor="middle" font-size="10.5" fill="var(--accent)">← der Fehler fließt rückwärts · ∇ = Gradient</text>';
    $('bpSvg').innerHTML=g;}
  function draw(){const st=S[i];$('bpS').innerHTML=S.map((_,k)=>'<span class="'+(k<i?'done':k===i?'on':'')+'"></span>').join('');svg(st);$('bpH').textContent=st.h;$('bpC').innerHTML=st.c;$('bpN').innerHTML=st.n;$('bpI').textContent='Schritt '+i+' von '+(S.length-1);$('bpP').disabled=i===0;$('bpX').disabled=i===S.length-1;}
  $('bpP').addEventListener('click',()=>{if(i>0){i--;draw();}});$('bpX').addEventListener('click',()=>{if(i<S.length-1){i++;draw();}});draw();
})();

// ---------- Landschaft ----------
(function(){
  const f=x=>0.08*x**4-0.7*x**2+0.7*x+2,g=x=>0.32*x**3-1.4*x+0.7;
  let beta=0,x0=3,timer=null;const W=500,H=220,X=x=>20+(x+3.6)/7.2*(W-40),Y=y=>H-28-(y+1)/(7.5)*(H-44);
  let curve='';for(let i=0;i<=200;i++){const x=-3.6+7.2*i/200;curve+=(i?'L':'M')+X(x).toFixed(1)+' '+Y(f(x)).toFixed(1);}
  function run(){let x=x0,v=0;const tr=[x];for(let k=0;k<300;k++){v=beta*v+g(x);x-=0.03*v;tr.push(x);}return tr;}
  function draw(upto){const tr=run(),n=upto===undefined?0:upto,x=tr[n];let s='<path d="'+curve+'" fill="none" stroke="var(--muted)" stroke-width="2"/>';
    s+='<text x="'+X(-2.36)+'" y="'+Math.min(H-6,Y(f(-2.36))+18)+'" text-anchor="middle" font-size="11" fill="var(--ok)">globales Minimum</text><text x="'+X(1.77)+'" y="'+Math.min(H-6,Y(f(1.77))+18)+'" text-anchor="middle" font-size="11" fill="var(--accent-2)">lokales Minimum</text>';
    if(n>0){let d='';for(let k=0;k<=n;k++)d+=(k?'L':'M')+X(tr[k]).toFixed(1)+' '+(Y(f(tr[k]))-9).toFixed(1);s+='<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".5"/>';}
    s+='<circle cx="'+X(x)+'" cy="'+(Y(f(x))-9)+'" r="9" fill="var(--accent)" stroke="#fff" stroke-width="2"/>';
    $('lsSvg').innerHTML=s;$('lsC').textContent=n?n+' Schritte':'';
    const end=tr[300];let t;
    if(!n)t='Wähle einen Startpunkt und lass die Kugel los.';
    else if(n<300)t='…';
    else if(end<0)t='<b>Im tiefsten Tal gelandet</b> (x ≈ '+de(end,2)+').'+(beta&&x0>0.5?' Der Schwung hat die Kugel über den Hügel getragen – ohne Momentum wäre sie rechts liegen geblieben.':'');
    else t='<b>Im lokalen Minimum hängen geblieben</b> (x ≈ '+de(end,2)+'). Bergab geht es von hier in keine Richtung mehr – dass links ein tieferes Tal liegt, kann der Abstieg nicht wissen.'+(beta?'':' Probier es mit Schwung.');
    $('lsN').innerHTML=t;}
  function go(){if(timer)clearInterval(timer);let k=0;const fast=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(fast){draw(300);return;}timer=setInterval(()=>{k+=3;if(k>=300){k=300;clearInterval(timer);timer=null;}draw(k);},25);}
  $('lsX').addEventListener('input',()=>{x0=+$('lsX').value/10;$('lsXo').textContent=de(x0,1);if(timer){clearInterval(timer);timer=null;}draw();});$('lsXo').textContent=de(x0,1);
  $('lsGo').addEventListener('click',go);
  seg('lsM',d=>{beta=+d.m;if(timer){clearInterval(timer);timer=null;}draw();});
  draw();
})();
