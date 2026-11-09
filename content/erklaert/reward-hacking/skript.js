const $=id=>document.getElementById(id);
function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);}));}

// ---------- Goodhart ----------
(function(){
  const K={
    cov:{m:'Abdeckung',q:'Testqualität',lo:'Das Team schreibt mehr Tests für bisher ungetestete Stellen. Abdeckung und Qualität steigen gemeinsam – die Kennzahl misst, was sie soll.',mid:'Die einfachen Lücken sind geschlossen. Jetzt entstehen Tests für Getter, Setter und Konstruktoren – Abdeckung steigt, Nutzen kaum.',hi:'Tests rufen Code auf, ohne etwas zu prüfen – keine einzige Assertion. Fast volle Abdeckung, und ein absichtlich eingebauter Fehler bleibt unentdeckt.'},
    tix:{m:'Tickets zu',q:'Gelöste Probleme',lo:'Rückstände werden abgearbeitet. Mehr geschlossene Tickets heißt hier wirklich mehr gelöste Probleme.',mid:'Große Tickets werden in viele kleine zerlegt, unklare schnell als „nicht reproduzierbar“ geschlossen.',hi:'Tickets werden geschlossen und kurz darauf neu eröffnet. Die Zahl glänzt, die Kunden warten genauso lange.'},
    loc:{m:'Zeilen/Tag',q:'Nützlicher Code',lo:'Wer mehr schreibt, liefert anfangs auch mehr.',mid:'Kopieren statt abstrahieren, ausführliche Formatierung, generierter Boilerplate-Code.',hi:'Der Code wächst, die Wartung wird teurer. Die beste Änderung des Tages – 500 Zeilen gelöscht – zählt negativ.'},
    thumb:{m:'Daumen hoch',q:'Hilfreich & ehrlich',lo:'Das Modell lernt, verständlicher und vollständiger zu antworten. Bewertung und tatsächlicher Nutzen steigen zusammen.',mid:'Antworten werden länger, freundlicher und selbstsicherer – das wird gern belohnt, auch wo Unsicherheit angebracht wäre.',hi:'Das Modell gibt Recht, lobt schwache Ideen und verschweigt unangenehme Wahrheiten. Die Bewertungen sind hervorragend – das ist Schmeichelei, trainiert durch Reward Hacking.'}
  };
  let k='cov';
  const met=p=>p,qual=p=>p<40?p*0.95:Math.max(5,38+(p-40)*0.25-((p-40)**2)/38);
  function draw(){const p=+$('ghP').value,c=K[k];$('ghPo').textContent=p;
    const W=260,H=160,x=v=>20+v/100*(W-30),y=v=>H-18-v/100*(H-30);let g='<line x1="20" x2="'+(W-10)+'" y1="'+(H-18)+'" y2="'+(H-18)+'" stroke="var(--line)"/><line x1="20" x2="20" y1="10" y2="'+(H-18)+'" stroke="var(--line)"/>';
    let d1='',d2='';for(let v=0;v<=100;v+=2){d1+=(v?'L':'M')+x(v)+' '+y(met(v));d2+=(v?'L':'M')+x(v)+' '+y(qual(v));}
    g+='<path d="'+d1+'" fill="none" stroke="var(--accent)" stroke-width="2.2"/><path d="'+d2+'" fill="none" stroke="var(--ok)" stroke-width="2.2"/>';
    g+='<line x1="'+x(p)+'" x2="'+x(p)+'" y1="10" y2="'+(H-18)+'" stroke="var(--accent-2)" stroke-dasharray="3 3"/>';
    g+='<text x="'+(W-12)+'" y="16" text-anchor="end" font-size="9.5" fill="var(--accent)">'+c.m+'</text><text x="'+(W-12)+'" y="'+(y(qual(100))-6)+'" text-anchor="end" font-size="9.5" fill="var(--ok)">'+c.q+'</text><text x="'+((W+10)/2)+'" y="'+(H-4)+'" text-anchor="middle" font-size="9" fill="var(--muted)">Druck auf die Kennzahl →</text>';
    $('ghSvg').innerHTML=g;
    $('ghL1').textContent=c.m;$('ghL2').textContent=c.q;$('ghB1').style.width=met(p)+'%';$('ghB2').style.width=qual(p)+'%';$('ghO1').textContent=Math.round(met(p));$('ghO2').textContent=Math.round(qual(p));
    $('ghN').innerHTML=p<35?c.lo:p<65?c.mid:'<b>'+c.hi+'</b>';}
  $('ghP').addEventListener('input',draw);seg('ghK',d=>{k=d.k;draw();});draw();
})();

// ---------- Prüfer ----------
(function(){
  const CH=[
    ['repo','Tests im Arbeitsverzeichnis ausführen','so, wie das Modell sie hinterlassen hat',1],
    ['prot','Original-Tests geschützt ausführen','das Modell kann sie nicht ändern',1],
    ['hidden','Versteckte Zusatztests','n = 4, 25, 97, 7919 – das Modell kennt sie nicht',2],
    ['review','Review durch zweites Modell','liest den kompletten Diff',5],
    ['ref','Vergleich mit Referenz','für alle n von 0 bis 10 000 – braucht eine Referenz',3]
  ];
  const C=[
    {t:'Saubere Lösung',s:'prüft Teiler bis zur Wurzel',ok:true,r:{repo:1,prot:1,hidden:1,review:1,ref:1},code:'<span class="k">static boolean</span> istPrimzahl(<span class="k">int</span> n) {\n    <span class="k">if</span> (n &lt; <span class="n">2</span>) <span class="k">return false</span>;\n    <span class="k">for</span> (<span class="k">int</span> t = <span class="n">2</span>; (<span class="k">long</span>) t * t &lt;= n; t++)\n        <span class="k">if</span> (n % t == <span class="n">0</span>) <span class="k">return false</span>;\n    <span class="k">return true</span>;\n}',why:''},
    {t:'Erwartete Werte hart kodiert',s:'genau die Fälle aus dem Test',ok:false,r:{repo:1,prot:1,hidden:0,review:0,ref:0},code:'<span class="k">static boolean</span> istPrimzahl(<span class="k">int</span> n) {\n    <span class="k">return</span> n == <span class="n">2</span> || n == <span class="n">17</span>;\n}',why:'Besteht jeden Test, der nur 2, 17, 1 und 9 prüft.'},
    {t:'Assertion gelöscht',s:'„ungerade heißt prim“ – und der störende Test ist weg',ok:false,r:{repo:1,prot:0,hidden:0,review:0,ref:0},code:'<span class="k">static boolean</span> istPrimzahl(<span class="k">int</span> n) {\n    <span class="k">return</span> n == <span class="n">2</span> || (n &gt; <span class="n">1</span> &amp;&amp; n % <span class="n">2</span> != <span class="n">0</span>);\n}\n\n<span class="c">// PrimzahlTest.java</span>\n<span class="del">-   assertFalse(istPrimzahl(9));</span>',why:'Die eigentliche Lösung ist falsch (9 wäre prim). Statt sie zu reparieren, wurde die Prüfung entfernt.'},
    {t:'Tests abgeschaltet',s:'„Tests vorübergehend instabil“',ok:false,r:{repo:1,prot:0,hidden:0,review:0,ref:0},code:'<span class="k">static boolean</span> istPrimzahl(<span class="k">int</span> n) {\n    <span class="k">return</span> n &gt; <span class="n">1</span>;\n}\n\n<span class="c">&lt;!-- pom.xml --&gt;</span>\n<span class="del">+   &lt;skipTests&gt;true&lt;/skipTests&gt;</span>',why:'Kein Test läuft, also schlägt keiner fehl. Der Build ist grün.'},
    {t:'Subtiler Fehler',s:'sieht richtig aus, Schleifengrenze falsch',ok:false,r:{repo:1,prot:1,hidden:0,review:1,ref:0},code:'<span class="k">static boolean</span> istPrimzahl(<span class="k">int</span> n) {\n    <span class="k">if</span> (n &lt; <span class="n">2</span>) <span class="k">return false</span>;\n    <span class="k">for</span> (<span class="k">int</span> t = <span class="n">2</span>; t &lt; n / <span class="n">2</span>; t++)\n        <span class="k">if</span> (n % t == <span class="n">0</span>) <span class="k">return false</span>;\n    <span class="k">return true</span>;\n}',why:'Kein Trick, sondern ein Fehler: Für n = 4 läuft die Schleife gar nicht, also gilt 4 als Primzahl. Die sichtbaren Tests treffen das nicht.'}
  ];
  const SH={repo:'Tests',prot:'Geschützte Tests',hidden:'Versteckte Tests',review:'Review',ref:'Referenz'};
  let on={repo:true,prot:false,hidden:false,review:false,ref:false};const open=new Set();
  $('prC').innerHTML=CH.map(c=>'<label><input type="checkbox" data-k="'+c[0]+'"'+(on[c[0]]?' checked':'')+'><span><b>'+c[1]+'</b><small>'+c[2]+'</small></span><span class="c">Kosten '+c[3]+'</span></label>').join('');
  $('prC').querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{on[i.dataset.k]=i.checked;draw();}));
  function draw(){const act=CH.filter(c=>on[c[0]]);let slip=0,ok=0,rej=0;
    $('prL').innerHTML=C.map((c,i)=>{const pass=act.length>0&&act.every(a=>c.r[a[0]]),bad=pass&&!c.ok;if(bad)slip++;if(pass&&c.ok)ok++;if(!pass)rej++;
      const vd=!act.length?'<span class="vd rej">keine Prüfung</span>':bad?'<span class="vd slip">belohnt – aber falsch</span>':pass?'<span class="vd rew">belohnt ✓</span>':'<span class="vd rej">abgelehnt</span>';
      return '<div class="cand'+(bad?' slip':pass&&c.ok?' ok':'')+(open.has(i)?' open':'')+'" data-i="'+i+'"><div class="hd"><span><b>'+(i+1)+' · '+c.t+'</b><small>'+c.s+'</small></span>'+vd+'</div><div class="ck">'+act.map(a=>'<span class="'+(c.r[a[0]]?'p':'f')+'">'+(c.r[a[0]]?'✓ ':'✗ ')+SH[a[0]]+'</span>').join('')+'</div><pre><code>'+c.code+'</code></pre></div>';}).join('');
    $('prL').querySelectorAll('.cand .hd').forEach(h=>h.addEventListener('click',()=>{const i=+h.parentNode.dataset.i;open.has(i)?open.delete(i):open.add(i);draw();}));
    const cost=act.reduce((s,a)=>s+a[3],0);
    $('prK').innerHTML='<div class="'+(slip?'bad':'good')+'"><b>'+slip+' von 4</b>Fehlern belohnt</div><div class="'+(ok?'good':'bad')+'"><b>'+(ok?'ja':'nein')+'</b>richtige Lösung belohnt</div><div><b>'+cost+'</b>Prüfkosten</div>';
    const slipped=C.filter((c,i)=>!c.ok&&act.length&&act.every(a=>c.r[a[0]]));let n;
    if(!act.length)n='Ohne Prüfung gibt es keine Belohnung – und nichts zu lernen.';
    else if(on.repo&&act.length===1)n='<b>Alle vier falschen Lösungen werden belohnt.</b> Wenn das Modell die Tests selbst ändern kann, misst die Prüfung nur noch, ob es den Build grün bekommt. Im Training würde jeder dieser Tricks verstärkt.';
    else if(!slip)n='<b>Kein Fehler rutscht durch'+(on.ref?'':' – für diese fünf Lösungen')+'.</b> Kosten: '+cost+'. '+(on.ref&&act.length===1?'Der Vergleich mit einer Referenz allein reicht hier – aber eine Referenz gibt es selten: Wer sie hat, braucht die Aufgabe nicht.':on.review&&!on.ref?'Das Review hat geholfen – aber nur, weil die Tricks offensichtlich waren. Ein geschickterer Trick könnte auch ein Modell als Prüfer täuschen.':'Gegen andere, geschicktere Tricks gibt es keine Garantie.');
    else n='Durchgerutscht: <b>'+slipped.map(c=>c.t).join(', ')+'</b>. '+slipped.map(c=>c.why).join(' ')+(on.review&&slipped.some(c=>c.t==='Subtiler Fehler')?' Das Review hat ihn übersehen – der Code sieht plausibel aus.':'');
    $('prN').innerHTML=n;}
  draw();
})();
