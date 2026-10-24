// ---------- Beweis ----------
(function(){
  const $=id=>document.getElementById(id);
  const L=[
    '<span class="c">// Annahme: diese Methode gibt es</span>',
    '<span class="k">static boolean</span> haelt(String prog, String ein) {',
    '    <span class="c">// … beliebig schlau, antwortet immer richtig</span>',
    '}',
    '',
    '<span class="k">static void</span> paradox(String prog) {',
    '    <span class="k">if</span> (haelt(prog, prog))',
    '        <span class="k">while</span> (<span class="k">true</span>) { }   <span class="c">// für immer</span>',
    '    <span class="k">else</span>',
    '        <span class="k">return</span>;             <span class="c">// sofort fertig</span>',
    '}',
    '',
    'paradox(<span class="c">/* Quelltext von paradox */</span>);'
  ];
  const S=[
    {on:[0,1,2,3],t:'Annahme',h:'Es gibt ein perfektes haelt',x:'Wir nehmen an, jemand hat <code>haelt</code> geschrieben: Es bekommt den Quelltext eines Programms und eine Eingabe, antwortet immer nach endlicher Zeit und immer korrekt mit <code>true</code> (hält an) oder <code>false</code> (läuft ewig).'},
    {on:[5,6,7,8,9,10],t:'Konstruktion',h:'Ein Programm, das widerspricht',x:'Damit bauen wir <code>paradox</code>. Es fragt <code>haelt</code>, was ein Programm tut, wenn man ihm seinen eigenen Quelltext gibt – und tut dann das Gegenteil: Sagt <code>haelt</code> „hält an“, läuft es ewig. Sagt es „läuft ewig“, hört es sofort auf.'},
    {on:[12],t:'Die Frage',h:'paradox über sich selbst',x:'Programme sind Daten – also können wir <code>paradox</code> seinen eigenen Quelltext geben. Hält <code>paradox(paradox)</code> an? Es gibt nur zwei Möglichkeiten.'},
    {on:[6,7],t:'Fall 1',bad:1,h:'haelt sagt: hält an',x:'Dann ist die Bedingung wahr und <code>paradox</code> geht in die Endlosschleife – es hält also <em>nicht</em> an. <code>haelt</code> hat sich geirrt.'},
    {on:[6,8,9],t:'Fall 2',bad:1,h:'haelt sagt: läuft ewig',x:'Dann springt <code>paradox</code> in den <code>else</code>-Zweig und ist sofort fertig – es hält also <em>doch</em> an. <code>haelt</code> hat sich wieder geirrt.'},
    {on:[0,1,2,3],t:'Schluss',ok:1,h:'haelt kann es nicht geben',x:'In beiden Fällen liefert <code>haelt</code> die falsche Antwort. Der Fehler liegt nicht in <code>paradox</code> – das ist ein völlig legales Programm –, sondern in der Annahme. <strong>Kein Programm kann für alle Programme entscheiden, ob sie anhalten.</strong> Egal, wie es geschrieben ist.'}
  ];
  let i=0;
  function draw(){const s=S[i];$('pfC').innerHTML=L.map((l,j)=>'<div class="'+(s.on.includes(j)?'on':'dim')+'">'+(l||' ')+'</div>').join('');
    $('pfX').innerHTML='<span class="tag'+(s.bad?' bad':s.ok?' ok':'')+'">'+s.t+'</span><h4>'+s.h+'</h4><p>'+s.x+'</p>';
    $('pfI').textContent='Schritt '+(i+1)+' von '+S.length;$('pfP').disabled=i===0;$('pfN').disabled=i===S.length-1;}
  $('pfP').addEventListener('click',()=>{if(i>0){i--;draw();}});$('pfN').addEventListener('click',()=>{if(i<S.length-1){i++;draw();}});draw();
})();

// ---------- Collatz ----------
(function(){
  const $=id=>document.getElementById(id);
  function draw(){let v=$('czN').value.replace(/\D/g,'').slice(0,9);if(v!==$('czN').value)$('czN').value=v;let n=+v;
    if(!n||n<1){$('czSvg').innerHTML='';$('czI').innerHTML='';$('czNt').textContent='Gib eine positive ganze Zahl ein.';return;}
    const seq=[n];while(n!==1&&seq.length<5000){n=n%2===0?n/2:3*n+1;seq.push(n);}
    const mx=Math.max(...seq),W=480,H=170,pl=8,pb=8,pt=8,lg=v=>Math.log10(v),y=v=>H-pb-(H-pb-pt)*(lg(v)/Math.max(1,lg(mx))),x=i=>pl+(W-2*pl)*i/Math.max(1,seq.length-1);
    let d='';seq.forEach((v,i)=>{d+=(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1);});
    const im=seq.indexOf(mx);
    $('czSvg').innerHTML='<line x1="'+pl+'" x2="'+(W-pl)+'" y1="'+y(1)+'" y2="'+y(1)+'" stroke="var(--line)"/><path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="1.6"/><circle cx="'+x(im)+'" cy="'+y(mx)+'" r="4" fill="var(--accent-2)"/><text x="'+(x(im)>W-110?x(im)-8:x(im)+8)+'" y="'+(y(mx)+4)+'" text-anchor="'+(x(im)>W-110?'end':'start')+'" font-size="10" fill="var(--accent-2)" paint-order="stroke" stroke="var(--card)" stroke-width="3">Gipfel '+mx.toLocaleString('de-DE')+'</text><text x="'+(W-pl)+'" y="'+(y(1)-4)+'" text-anchor="end" font-size="9" fill="var(--muted)">1</text>';
    $('czI').innerHTML='<span>Start <b>'+(+v).toLocaleString('de-DE')+'</b></span><span>Schritte bis 1 <b>'+(seq.length-1)+'</b></span><span>höchster Wert <b>'+mx.toLocaleString('de-DE')+'</b></span>';
    $('czNt').innerHTML=(+v===27?'Die 27 braucht 111 Schritte und klettert bis 9232, bevor sie abstürzt. ':'')+'Die y-Achse ist logarithmisch. Jede ausprobierte Zahl kam bisher bei 1 an – aber niemand kann beweisen, dass es für <em>alle</em> so ist.';}
  $('czN').addEventListener('input',draw);
  document.querySelectorAll('.inrow button[data-v]').forEach(b=>b.addEventListener('click',()=>{$('czN').value=b.dataset.v;draw();}));draw();
})();

// ---------- Analyse ----------
(function(){
  const $=id=>document.getElementById(id);
  // [code, wirklich NPE möglich?, vorsichtig meldet?, pragmatisch meldet?, Erklärung]
  const C=[
    ['String s = null;\ns.length();',1,1,1],
    ['String s = args.length > 0 ? args[0] : null;\ns.trim();',1,1,1],
    ['String s = map.get(key);\ns.length();',1,1,0],
    ['if (x != null) x.length();',0,0,0],
    ['Object o = istPrim(7) ? "ja" : null;\no.hashCode();',0,1,0],
    ['String s = collatzEndet(n) ? "ok" : null;\ns.length();',0,1,0]
  ];
  let s='sound';
  function draw(){
    if(s==='perfect'){$('anL').innerHTML='';$('anK').innerHTML='';$('anN').innerHTML='<b>Gibt es nicht.</b> Ein Werkzeug, das jede mögliche NullPointerException findet, nie falsch alarmiert und immer fertig wird, könnte das Halteproblem lösen: Man schreibt <code>beliebigesProgramm(); String s = null; s.length();</code> – eine Exception fliegt genau dann, wenn das Programm anhält. Das ist der Satz von Rice im Kleinen. Beim letzten Codestück wüsste das perfekte Werkzeug nebenbei auch, ob die Collatz-Vermutung stimmt.';return;}
    const idx=s==='sound'?2:3;let fa=0,miss=0,ok=0;
    $('anL').innerHTML='<div class="hd"><span>Code</span><span>Wirklich?</span><span>Werkzeug</span></div>'+C.map(c=>{const real=c[1],says=c[idx];let cls,txt;
      if(real&&says){cls='okv';txt='meldet ✓';ok++;}else if(!real&&!says){cls='okv';txt='still ✓';ok++;}else if(says&&!real){cls='fa';txt='Fehlalarm';fa++;}else{cls='miss';txt='übersehen';miss++;}
      return '<div><code>'+c[0]+'</code><span>'+(real?'NPE möglich':'sicher')+'</span><span class="v '+cls+'">'+txt+'</span></div>';}).join('');
    $('anK').innerHTML='<div><b>'+ok+'</b>richtig beurteilt</div><div><b style="color:var(--accent-2)">'+fa+'</b>Fehlalarme</div><div><b style="color:var(--bad)">'+miss+'</b>übersehene Fehler</div>';
    $('anN').innerHTML=s==='sound'?'<b>Vorsichtig</b> („sound“): Was nicht bewiesen sicher ist, wird gemeldet. Kein echter Fehler entgeht – aber das Werkzeug kann nicht ausrechnen, ob 7 eine Primzahl ist oder was <code>collatzEndet</code> liefert, und schlägt deshalb Alarm. (Das letzte Stück ist tatsächlich sicher: <code>collatzEndet</code> gibt <code>true</code> zurück oder kehrt nie zurück – <code>null</code> kommt nie an. Das zu erkennen, verlangt aber, über die Schleife nachzudenken.) Zu viele Fehlalarme, und Entwickler ignorieren das Werkzeug.':'<b>Pragmatisch</b>: Gemeldet wird nur, was sicher falsch ist. Keine Fehlalarme – aber <code>map.get</code> kann null liefern, und das bleibt unentdeckt. So arbeiten die meisten Linter.';}
  const bs=[...document.querySelectorAll('#anS button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;draw();}));draw();
})();
