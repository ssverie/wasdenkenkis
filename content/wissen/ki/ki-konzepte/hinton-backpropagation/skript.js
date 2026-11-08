const $=id=>document.getElementById(id);
const de=(v,d)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
const sig=z=>1/(1+Math.exp(-z));
function seg(boxId,cb){const bs=[...document.querySelectorAll('#'+boxId+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);}));}

// ---------- 1a Kantendetektor ----------
(function(){
  let P=[];const K=1; // Detektor an Spalten K (+) und K+1 (−)
  const pre={edge2:c=>c<=1?1:0,edge4:c=>c<=3?1:0,light:()=>1,none:()=>0};
  function set(k){P=[];for(let r=0;r<6;r++)for(let c=0;c<6;c++)P.push(pre[k](c));draw();}
  const act=(col)=>{let s=0;for(let r=0;r<6;r++){s+=P[r*6+col]-P[r*6+col+1];}return s;};
  function draw(){let h='';for(let i=0;i<36;i++){const c=i%6;h+='<button class="'+(P[i]?'on ':'')+(c===K?'kp':c===K+1?'kn':'')+'" data-i="'+i+'" aria-label="Pixel '+(i+1)+(P[i]?' hell':' dunkel')+'"></button>';}
    $('pxG').innerHTML=h;$('pxG').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{P[+b.dataset.i]^=1;draw();}));
    const a=act(K);$('pxV').textContent=(a>0?'+':'')+de(a,0).replace(',0','');$('pxM').style.width=Math.max(0,a)/6*100+'%';
    $('pxMap').innerHTML=[0,1,2,3,4].map(c=>{const v=act(c);return '<span style="'+(v>0?'background:var(--accent-2-soft);color:var(--accent-2)':'')+(c===K?';outline:2px solid var(--ok)':'')+'">'+(v>0?'+':'')+v+'</span>';}).join('');
    const pos=[0,1,2,3,4].filter(c=>act(c)>=4);
    $('pxN').innerHTML=a>=4?'<b>Der Detektor feuert:</b> links hell, rechts dunkel – eine senkrechte Kante genau an seiner Stelle.':a===0&&P.some(x=>x)?'Plus und Minus heben sich auf: '+(P.every(x=>x)?'alles ist gleich hell, also keine Kante.':'an dieser Stelle gibt es keinen Hell-dunkel-Übergang.')+(pos.length?' Aber eine Kopie des Detektors an Position '+(pos[0]+1)+' schlägt an – die Faltung findet die Kante trotzdem.':''):a<0?'Negativ: Hier ist es links dunkel und rechts hell – die umgekehrte Kante. Dafür bräuchte es einen eigenen Detektor.':'Klick auf Pixel, um sie hell oder dunkel zu machen.';}
  document.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>set(b.dataset.p)));
  set('edge2');
})();

// ---------- 1b Letzte Schicht ----------
(function(){
  const F=[['Schnabel',2.0,1],['Auge',1.5,1],['Flügel',1.5,1],['Fuß',1.0,0],['Rad',-3.0,0]],B=-3.0;
  $('ftF').innerHTML=F.map((f,i)=>'<label><input type="checkbox" data-i="'+i+'"'+(f[2]?' checked':'')+'><span>'+f[0]+'</span><small>'+(f[1]>0?'+':'')+de(f[1],1)+'</small></label>').join('');
  function draw(){const on=[...document.querySelectorAll('#ftF input')].map(c=>c.checked?1:0);let z=B;const parts=[];F.forEach((f,i)=>{if(on[i]){z+=f[1];parts.push(de(f[1],1));}});
    const y=sig(z);
    $('ftC').innerHTML='z = '+(parts.length?parts.join(' + ').replace(/\+ −/g,'− ')+' ':'')+'− 3,0 (Schwelle) = <b>'+de(z,1)+'</b> &nbsp;→&nbsp; σ(z) = <b>'+de(y,2)+'</b>';
    $('ftM').style.width=y*100+'%';
    $('ftN').innerHTML=y>0.9?'<b>Fast sicher ein Vogel.</b> Mehrere passende Merkmale zusammen überwinden die Schwelle deutlich.':y>0.5?'<b>Eher ein Vogel</b> – aber noch unsicher. Ein weiteres Merkmal würde helfen.':on[4]?'<b>Kein Vogel.</b> Ein Rad zieht mit seinem negativen Gewicht kräftig nach unten – Vögel haben selten Räder.':'<b>Eher kein Vogel.</b> Zu wenige Merkmale, um die Schwelle zu überwinden.';}
  document.querySelectorAll('#ftF input').forEach(c=>c.addEventListener('change',draw));draw();
})();

// ---------- 2 Backprop ----------
const NET0={w:[0.15,-0.20,-0.10,0.25,0.10,-0.10],b:0};  // w1:x1→h1, w2:x2→h1, w3:x1→h2, w4:x2→h2, w5:h1→y, w6:h2→y
const X=[1,0.5],T=1,ETA=0.2;
function forward(n,x){const h1=sig(n.w[0]*x[0]+n.w[1]*x[1]),h2=sig(n.w[2]*x[0]+n.w[3]*x[1]),z=n.w[4]*h1+n.w[5]*h2+n.b;return {z1:n.w[0]*x[0]+n.w[1]*x[1],z2:n.w[2]*x[0]+n.w[3]*x[1],h1,h2,z,y:sig(z)};}
function grads(n,x,t){const f=forward(n,x),d=(f.y-t)*f.y*(1-f.y),d1=d*n.w[4]*f.h1*(1-f.h1),d2=d*n.w[5]*f.h2*(1-f.h2);
  return {f,d,d1,d2,g:[d1*x[0],d1*x[1],d2*x[0],d2*x[1],d*f.h1,d*f.h2],gb:d};}
(function(){
  const G=grads(NET0,X,T),f=G.f;
  const N1={w:NET0.w.map((w,i)=>w-ETA*G.g[i]),b:NET0.b-ETA*G.gb},f2=forward(N1,X);
  const WN=['w₁','w₂','w₃','w₄','w₅','w₆'];
  const S=[
    {h:'Ausgangslage: gewürfelte Gewichte',show:{},c:'w₁ = 0,15 &nbsp; w₂ = −0,20 &nbsp; w₃ = −0,10 &nbsp; w₄ = 0,25 &nbsp; w₅ = 0,10 &nbsp; w₆ = −0,10 &nbsp; b = 0',n:'Sieben kleine Zufallszahlen, nichts ist eingestellt. Am Eingang liegt ein Vogel an: Der Schnabeldetektor meldet <b>1,0</b>, der Flügeldetektor <b>0,5</b>. Gewünscht ist am Ausgang die <b>1</b>.'},
    {h:'1 · Vorwärts: die versteckte Schicht',show:{h:1},c:'h₁ = σ(0,15·1 + (−0,20)·0,5) = σ('+de(f.z1,3)+') = <b>'+de(f.h1,4)+'</b><br>h₂ = σ((−0,10)·1 + 0,25·0,5) = σ('+de(f.z2,3)+') = <b>'+de(f.h2,4)+'</b>',n:'Jedes Neuron bildet die gewichtete Summe seiner Eingänge und schickt sie durch σ. Bei so kleinen Gewichten liegt die Summe nahe 0 – und σ(0) ist 0,5. Die Neuronen sind sozusagen unentschieden.'},
    {h:'2 · Vorwärts: der Ausgang',show:{h:1,y:1},c:'y = σ(0,10·'+de(f.h1,4)+' + (−0,10)·'+de(f.h2,4)+' + 0) = σ('+de(f.z,4)+') = <b>'+de(f.y,4)+'</b>',n:'Das Netz sagt: <b>„0,5 – vielleicht ein Vogel“</b>. Genau Hintons Ausgangspunkt: Ein Netz mit Zufallsgewichten ist völlig unentschieden.'},
    {h:'3 · Der Fehler',show:{h:1,y:1,e:1},c:'gewollt: 1 &nbsp;&nbsp; bekommen: '+de(f.y,4)+'<br>Fehler e = y − Ziel = <b>'+de(f.y-T,4)+'</b> &nbsp;&nbsp; Verlust L = ½·e² = <b>'+de(0.5*(f.y-T)**2,4)+'</b>',n:'Der Verlust misst, wie falsch die Antwort ist. Ziel ist, ihn zu verkleinern. Das Quadrat sorgt dafür, dass große Fehler stärker zählen und das Vorzeichen keine Rolle spielt.'},
    {h:'4 · Rückwärts: Schuld am Ausgang',show:{h:1,y:1,e:1,g2:1},c:'δ = e · y·(1−y) = '+de(f.y-T,4)+' · '+de(f.y*(1-f.y),4)+' = <b>'+de(G.d,4)+'</b><br><span class="g">∂L/∂w₅ = δ·h₁ = '+de(G.g[4],4)+' &nbsp; ∂L/∂w₆ = δ·h₂ = '+de(G.g[5],4)+' &nbsp; ∂L/∂b = δ = '+de(G.gb,4)+'</span>',n:'y·(1−y) ist die Steigung von σ: wie empfindlich der Ausgang gerade reagiert. δ sagt also: „So stark würde sich der Verlust ändern, wenn sich die Summe am Ausgang ändert.“ Ein Gewicht ist umso mehr verantwortlich, je aktiver sein Eingang war – deshalb δ mal h. Negativ heißt: Dieses Gewicht <em>vergrößern</em> verkleinert den Fehler.'},
    {h:'5 · Rückwärts: eine Schicht tiefer',show:{h:1,y:1,e:1,g2:1,g1:1},c:'δ₁ = δ · w₅ · h₁(1−h₁) = '+de(G.d,4)+' · 0,10 · '+de(f.h1*(1-f.h1),4)+' = <b>'+de(G.d1,5)+'</b><br>δ₂ = δ · w₆ · h₂(1−h₂) = '+de(G.d,4)+' · (−0,10) · '+de(f.h2*(1-f.h2),4)+' = <b>'+de(G.d2,5)+'</b><br><span class="g">∂L/∂w₁ = δ₁·1 = '+de(G.g[0],5)+' &nbsp; ∂L/∂w₂ = δ₁·0,5 = '+de(G.g[1],5)+'<br>∂L/∂w₃ = δ₂·1 = '+de(G.g[2],5)+' &nbsp; ∂L/∂w₄ = δ₂·0,5 = '+de(G.g[3],5)+'</span>',n:'Das ist das eigentliche „Back“ in Backpropagation: Der Fehler δ des Ausgangs wird über das Gewicht, das h₁ mit dem Ausgang verbindet, zurück zu h₁ geschickt – multipliziert mit dessen Empfindlichkeit. Weil w₆ negativ ist, kommt bei h₂ das umgekehrte Vorzeichen an. Die Werte sind winzig: Eine Schicht tiefer kommt bei so kleinen Gewichten nur wenig Schuld an.'},
    {h:'6 · Alle Gewichte ein kleines Stück verschieben',show:{h:1,y:1,u:1},c:'w ← w − η · ∂L/∂w &nbsp;&nbsp; mit Lernrate η = 0,2<br>'+WN.map((n,i)=>n+': '+de(NET0.w[i],2)+' → <b>'+de(N1.w[i],4)+'</b>').join(' &nbsp; ')+' &nbsp; b: 0 → <b>'+de(N1.b,4)+'</b>',n:'Jedes Gewicht bewegt sich gegen die Richtung seines Gradienten – „bergab“ auf der Fehlerlandschaft. Die Schrittgröße bestimmt die Lernrate. Alle sieben ändern sich gleichzeitig, aber nur um Bruchteile.'},
    {h:'7 · Noch einmal vorwärts',show:{h:1,y:1,u:1,y2:1},c:'h₁ = '+de(f2.h1,4)+' &nbsp; h₂ = '+de(f2.h2,4)+' &nbsp; y = σ('+de(f2.z,4)+') = <b>'+de(f2.y,4)+'</b>',n:'<b>Statt 0,50 sagt das Netz jetzt 0,51.</b> Genau der Schritt, den Hinton beschreibt. Ein kleiner Fortschritt – aber er kam ohne jede Regel über Vögel zustande, nur aus der Frage, in welche Richtung jedes Gewicht sich bewegen soll.'}
  ];
  let i=0;
  function svg(st){const sh=st.show,cur=sh.u?N1:NET0,ff=sh.y2?f2:f;
    const P={x1:[70,70],x2:[70,190],h1:[280,70],h2:[280,190],y:[470,130]};
    const E=[['x1','h1',0,.5,-10],['x2','h1',1,.55,-10],['x1','h2',2,.55,16],['x2','h2',3,.5,18],['h1','y',4,.56,-10],['h2','y',5,.56,18]];
    let g='';
    E.forEach(([a,b,k])=>{const A=P[a],Bp=P[b];const gOn=(k>=4&&sh.g2)||(k<4&&sh.g1);g+='<line x1="'+A[0]+'" y1="'+A[1]+'" x2="'+Bp[0]+'" y2="'+Bp[1]+'" stroke="'+(gOn?'var(--accent)':'var(--line)')+'" stroke-width="'+(gOn?2.5:1.6)+'"/>';});
    E.forEach(([a,b,k,t,off])=>{const A=P[a],Bp=P[b],x=A[0]+(Bp[0]-A[0])*t,y=A[1]+(Bp[1]-A[1])*t;const gOn=(k>=4&&sh.g2)||(k<4&&sh.g1);
      g+='<text x="'+x+'" y="'+(y+off)+'" text-anchor="middle" font-size="10.5" fill="var(--fg)" paint-order="stroke" stroke="var(--card)" stroke-width="4">'+WN[k]+' = '+de(cur.w[k],sh.u?3:2)+(gOn?'<tspan fill="var(--accent)">  ∇ '+de(G.g[k],k<4?5:4)+'</tspan>':'')+'</text>';});
    const node=(id,lab,val,hl)=>{const p=P[id];return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="27" fill="'+(hl?'var(--accent-2-soft)':'var(--card)')+'" stroke="'+(hl?'var(--accent-2)':'var(--fg)')+'" stroke-width="'+(hl?2.5:1.5)+'"/><text x="'+p[0]+'" y="'+(p[1]-4)+'" text-anchor="middle" font-size="'+(lab.length>6?8.5:11)+'" fill="var(--muted)">'+lab+'</text><text x="'+p[0]+'" y="'+(p[1]+12)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fg)">'+val+'</text>';};
    g+=node('x1','Schnabel','1,0',false)+node('x2','Flügel','0,5',false);
    g+=node('h1','h₁',sh.h?de(ff.h1,3):'?',i===1||i===7)+node('h2','h₂',sh.h?de(ff.h2,3):'?',i===1||i===7);
    g+=node('y','y',sh.y?de(ff.y,sh.y2?3:3):'?',i===2||i===7);
    if(sh.e)g+='<text x="470" y="62" text-anchor="middle" font-size="11" fill="var(--bad)">Ziel 1 · Fehler '+de(f.y-T,3)+'</text>';
    g+='<text x="503" y="134" font-size="10" fill="var(--muted)">b = '+de(cur.b,sh.u?3:0)+'</text>';
    if(sh.g2&&!sh.u)g+='<text x="280" y="250" text-anchor="middle" font-size="10.5" fill="var(--accent)">← der Fehler fließt rückwärts · ∇ = Gradient</text>';
    $('bpSvg').innerHTML=g;}
  function draw(){const st=S[i];$('bpS').innerHTML=S.map((_,k)=>'<span class="'+(k<i?'done':k===i?'on':'')+'"></span>').join('');
    svg(st);$('bpH').textContent=st.h;$('bpC').innerHTML=st.c;$('bpN').innerHTML=st.n;$('bpI').textContent='Schritt '+i+' von '+(S.length-1);$('bpP').disabled=i===0;$('bpX').disabled=i===S.length-1;}
  $('bpP').addEventListener('click',()=>{if(i>0){i--;draw();}});$('bpX').addEventListener('click',()=>{if(i<S.length-1){i++;draw();}});draw();

  // ---------- 4 Wackeln gegen Backprop ----------
  const loss=n=>0.5*(forward(n,X).y-T)**2,eps=1e-4;
  let rows='<tr><th>Gewicht</th><th class="num">Backpropagation</th><th class="num">Wackeln ±0,0001</th></tr>';
  [...WN,'b'].forEach((nm,k)=>{const a={w:NET0.w.slice(),b:NET0.b},c={w:NET0.w.slice(),b:NET0.b};if(k<6){a.w[k]+=eps;c.w[k]-=eps;}else{a.b+=eps;c.b-=eps;}
    const fd=(loss(a)-loss(c))/(2*eps),bp=k<6?G.g[k]:G.gb;rows+='<tr><td>'+nm+'</td><td class="num">'+de(bp,6)+'</td><td class="num">'+de(fd,6)+'</td></tr>';});
  $('fdT').innerHTML=rows;
})();

// ---------- 3 Training ----------
(function(){
  const D=[{x:[1,0.5],t:1},{x:[0.1,0.9],t:0}];let n,eta=0.2,k,hist;
  function reset(){n={w:NET0.w.slice(),b:NET0.b};k=0;hist=[[forward(n,D[0].x).y,forward(n,D[1].x).y]];draw();}
  function step(){const d=D[k%2],G=grads(n,d.x,d.t);for(let i=0;i<6;i++)n.w[i]-=eta*G.g[i];n.b-=eta*G.gb;k++;if(k%2===0)hist.push([forward(n,D[0].x).y,forward(n,D[1].x).y]);}
  function draw(){const W=500,H=200,pl=34,pb=24,pt=10,N=Math.max(25,hist.length-1),x=i=>pl+(W-pl-10)*i/N,y=v=>H-pb-(H-pb-pt)*v;let g='';
    [0,0.5,1].forEach(v=>{g+='<line x1="'+pl+'" x2="'+(W-10)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(pl-6)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+de(v,1)+'</text>';});
    const step=Math.max(1,Math.floor(hist.length/400));
    [0,1].forEach(j=>{let d='';for(let i=0;i<hist.length;i+=step)d+=(d?'L':'M')+x(i).toFixed(1)+' '+y(hist[i][j]).toFixed(1);const l=hist.length-1;d+='L'+x(l).toFixed(1)+' '+y(hist[l][j]).toFixed(1);g+='<path d="'+d+'" fill="none" stroke="'+(j?'var(--accent)':'var(--accent-2)')+'" stroke-width="2.2"/>';});
    g+='<text x="'+(W-12)+'" y="'+(H-6)+'" text-anchor="end" font-size="10" fill="var(--muted)">Schritte: '+k+'</text>';
    g+='<text x="'+(pl+6)+'" y="'+(pt+12)+'" font-size="10.5" fill="var(--accent-2)">— Vogel (Ziel 1)</text><text x="'+(pl+6)+'" y="'+(H-pb-6)+'" font-size="10.5" fill="var(--accent)">— Flugzeug (Ziel 0)</text>';
    $('trSvg').innerHTML=g;const a=hist[hist.length-1];
    $('trN').innerHTML='Nach <b>'+k+'</b> Schritten sagt das Netz zum Vogel <b>'+de(a[0],3)+'</b>, zum Flugzeug <b>'+de(a[1],3)+'</b>. '+(k===0?'Noch beide bei 0,5.':a[0]>0.9&&a[1]<0.1?'Gelernt – ohne dass irgendwo eine Regel über Schnäbel steht.':Math.abs(a[0]-a[1])<0.05?'Beide Antworten kleben noch zusammen: Das Netz hat noch nicht herausgefunden, was die beiden unterscheidet.':'Die Antworten laufen auseinander – das Netz hat begriffen, worauf es ankommt.');}
  document.querySelectorAll('[data-n]').forEach(b=>b.addEventListener('click',()=>{const m=+b.dataset.n;for(let i=0;i<m&&k<5000;i++)step();draw();}));
  $('trR').addEventListener('click',reset);
  seg('trE',d=>{eta=+d.e;reset();});
  reset();
})();

// ---------- 5 Embeddings ----------
(function(){
  const W={june:[0.78,0.70],april:[0.62,0.84],march:[0.88,0.52],would:[-0.72,-0.50],might:[-0.52,-0.74],can:[-0.86,-0.70]};
  const MONTH=[0.76,0.69],MODAL=[-0.70,-0.65];
  const START=[-0.18,-0.12]; // Kompromiss, näher am häufigeren Modalverb
  let c='june';
  const S={june:'… in <mark>may</mark> and june …',would:'… he <mark>may</mark> or would …',none:'… <mark>may</mark> …'};
  function path(){const p=[START.slice()];const tgt=c==='june'?W.june:c==='would'?W.would:null;for(let l=1;l<=6;l++){const v=p[l-1].slice();if(tgt){v[0]+=(tgt[0]-v[0])*0.32;v[1]+=(tgt[1]-v[1])*0.32;}p.push(v);}return p;}
  const sim=(v,m)=>{const d=Math.hypot(v[0]-m[0],v[1]-m[1]);return d;};
  function draw(){const L=+$('emL').value;$('emLo').textContent=L;$('emS').innerHTML=S[c];
    const P=path(),v=P[L],X=a=>150+a*120,Y=a=>150-a*120;let g='';
    g+='<rect x="2" y="2" width="296" height="296" rx="10" fill="var(--bg)"/><line x1="150" y1="14" x2="150" y2="286" stroke="var(--line)"/><line x1="14" y1="150" x2="286" y2="150" stroke="var(--line)"/>';
    g+='<ellipse cx="'+X(MONTH[0])+'" cy="'+Y(MONTH[1])+'" rx="44" ry="40" fill="var(--accent-soft)" opacity=".8"/><text x="'+X(MONTH[0])+'" y="'+(Y(MONTH[1])-46)+'" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent)">Monate</text>';
    g+='<ellipse cx="'+X(MODAL[0])+'" cy="'+Y(MODAL[1])+'" rx="44" ry="40" fill="var(--accent-2-soft)" opacity=".8"/><text x="'+X(MODAL[0])+'" y="'+(Y(MODAL[1])+56)+'" text-anchor="middle" font-size="11" font-weight="700" fill="var(--accent-2)">Modalverben</text>';
    Object.entries(W).forEach(([w,p])=>{g+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="4" fill="var(--fg)"/><text x="'+(X(p[0])+7)+'" y="'+(Y(p[1])+4)+'" font-size="11" fill="var(--fg)" font-family="ui-monospace,monospace">'+w+'</text>';});
    let d='';for(let l=0;l<=L;l++)d+=(l?'L':'M')+X(P[l][0]).toFixed(1)+' '+Y(P[l][1]).toFixed(1);
    g+='<path d="'+d+'" fill="none" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="4 3"/>';
    for(let l=0;l<L;l++)g+='<circle cx="'+X(P[l][0])+'" cy="'+Y(P[l][1])+'" r="3" fill="var(--muted)"/>';
    g+='<circle cx="'+X(v[0])+'" cy="'+Y(v[1])+'" r="8" fill="var(--bad)" stroke="var(--card)" stroke-width="2"/><text x="'+(X(v[0])+11)+'" y="'+(Y(v[1])-8)+'" font-size="12" font-weight="700" fill="var(--bad)" font-family="ui-monospace,monospace">may</text>';
    $('emSvg').innerHTML=g;
    const d1=sim(v,MONTH),d2=sim(v,MODAL),e1=Math.exp(-3*d1),e2=Math.exp(-3*d2),p1=e1/(e1+e2),p2=1-p1;
    $('emM1').style.width=p1*100+'%';$('emM2').style.width=p2*100+'%';$('emO1').textContent=Math.round(p1*100)+' %';$('emO2').textContent=Math.round(p2*100)+' %';
    let n;if(L===0)n='<b>Schicht 0:</b> Nur das Wort selbst ist bekannt. Der Vektor liegt zwischen beiden Bedeutungen, etwas näher am Modalverb, weil das die häufigere ist.';
    else if(c==='none')n='Ohne hilfreiche Nachbarwörter gibt es nichts, woran sich der Vektor ausrichten könnte – er bleibt der Kompromiss.';
    else n='<b>Schicht '+L+':</b> Jede Schicht verrechnet den Vektor mit dem Kontext. Mit „'+c+'“ in der Nähe wandert „may“ in Richtung '+(c==='june'?'Monat':'Modalverb')+(L>=4?' – inzwischen eindeutig.':'.');
    $('emN').innerHTML=n;}
  $('emL').addEventListener('input',draw);seg('emC',d=>{c=d.c;draw();});draw();
})();

// ---------- 6 Agenten ----------
(function(){
  const T=['Vögel','Autos','Pflanzen','Musik'];let mode='dig',K,dead,fresh,round;
  function reset(){K=[0,1,2,3].map(()=>[0,0,0,0]);dead=-1;fresh=-1;round=0;draw('');}
  function learn(){round++;fresh=-1;const upd=[0,1,2,3].map(a=>a===dead?null:a);// jede Kopie lernt ihr Thema
    const gain=0.12;
    if(mode==='dig'){const add=[0,0,0,0];upd.forEach(a=>{if(a!==null)add[a]+=gain;});K=K.map((k,a)=>a===dead?k:k.map((v,t)=>Math.min(1,v+add[t])));}
    else{K=K.map((k,a)=>{if(a===dead)return k;const n=k.slice();n[a]=Math.min(1,n[a]+gain);for(let t=0;t<4;t++)if(t!==a)n[t]=Math.min(1,n[t]+gain*0.03);return n;});}
    draw('');}
  function kill(){if(dead>=0)return;dead=1;draw(mode==='dig'?'kill-dig':'kill-bio');}
  function revive(){}
  function draw(ev){
    if(ev==='kill-dig'){const copy=K[0].slice();K[1]=copy;fresh=1;dead=-1;}
    $('agG').innerHTML=K.map((k,a)=>'<div class="'+(a===dead?'dead':a===fresh?'new':'')+'"><b>Kopie '+(a+1)+(a===dead?' ✕':a===fresh?' (neu)':'')+'</b><span style="color:var(--muted)">lernt: '+T[a]+'</span>'+k.map((v,t)=>'<div class="kb"><span>'+T[t]+'</span><div class="meter"><i style="width:'+(v*100)+'%"></i></div><em>'+Math.round(v*100)+'</em></div>').join('')+'</div>').join('');
    const tot=K.reduce((s,k,a)=>a===dead?s:s+k.reduce((x,y)=>x+y,0),0);
    let n;
    if(ev==='kill-dig')n='<b>Rechner 2 ist ausgefallen – egal.</b> Seine Gewichte waren dieselben wie bei allen anderen. Auf neuer Hardware geladen, weiß die neue Kopie sofort alles. Das meint Hinton mit „unsterblich“.';
    else if(ev==='kill-bio')n='<b>Kopie 2 ist ausgefallen, und mit ihr ihr Wissen.</b> Was sie über Autos gelernt hat, hatte sie den anderen nur in Bruchstücken erzählt. Das Wissen hing an genau dieser Hardware – „sterblich“.';
    else if(round===0)n=mode==='dig'?'Vier identische Kopien eines Netzes, jede auf einem eigenen Rechner. Klick auf „Eine Runde lernen“.':'Vier Lernende, jeder mit eigenem Gehirn. Sie können sich nur in Sätzen erzählen, was sie gelernt haben.';
    else if(mode==='dig')n='Nach '+round+' Runde'+(round>1?'n':'')+': <b>Jede Kopie weiß alles, was irgendeine gelernt hat</b> – die Änderungen an den Gewichten werden gesammelt und bei allen eingespielt. Vier Kopien lernen viermal so schnell; mit 10 000 Kopien entsprechend mehr.';
    else n='Nach '+round+' Runde'+(round>1?'n':'')+': Jeder ist Experte in seinem Gebiet, von den anderen kommt nur wenig an. Ein Satz trägt nach Hintons Bild <span class="ts">ab 2:03</span> nur sehr wenig Information – verglichen mit Milliarden von Gewichtsänderungen.';
    $('agN').innerHTML=n;}
  $('agL').addEventListener('click',learn);$('agK').addEventListener('click',kill);$('agR').addEventListener('click',reset);
  seg('agM',d=>{mode=d.m;reset();});reset();
})();
