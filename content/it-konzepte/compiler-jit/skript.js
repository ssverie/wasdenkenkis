// ---------- Mini-Compiler ----------
(function(){
  const $=id=>document.getElementById(id);
  function lex(s){const t=[];const re=/\s*(?:(\d+)|([abc])|([+\-*/])|([()])|(\S))/y;let m;re.lastIndex=0;
    while(re.lastIndex<s.length&&(m=re.exec(s))){if(m[0].trim()==='')break;
      if(m[1])t.push({k:'num',v:+m[1]});else if(m[2])t.push({k:'id',v:m[2]});else if(m[3])t.push({k:'op',v:m[3]});else if(m[4])t.push({k:'par',v:m[4]});else throw {msg:'Unbekanntes Zeichen „'+m[5]+'“ – erlaubt sind Zahlen, a, b, c, + − * / und Klammern.',stage:'lex'};}
    return t;}
  function parse(t){let i=0;const peek=()=>t[i],next=()=>t[i++];
    function prim(){const x=next();if(!x)throw {msg:'Der Ausdruck endet zu früh.',stage:'parse'};
      if(x.k==='num'||x.k==='id')return {k:x.k,v:x.v};
      if(x.v==='('){const e=expr();const c=next();if(!c||c.v!==')')throw {msg:'Schließende Klammer fehlt.',stage:'parse'};return e;}
      throw {msg:'Syntaxfehler: „'+x.v+'“ an Position '+i+' – hier wurde eine Zahl, eine Variable oder „(“ erwartet.',stage:'parse'};}
    function term(){let l=prim();while(peek()&&(peek().v==='*'||peek().v==='/')){const o=next().v;l={k:'op',v:o,l,r:prim()};}return l;}
    function expr(){let l=term();while(peek()&&(peek().v==='+'||peek().v==='-')){const o=next().v;l={k:'op',v:o,l,r:term()};}return l;}
    const e=expr();if(i<t.length)throw {msg:'Unerwartetes „'+t[i].v+'“ nach dem Ausdruck.',stage:'parse'};return e;}
  const SLOT={a:0,b:1,c:2},OPC={'+':'iadd','-':'isub','*':'imul','/':'idiv'};
  function gen(n,out){if(n.k==='num'){const v=n.v;out.push(v<=5?{op:'iconst_'+v,v}:v<=127?{op:'bipush '+v,v}:v<=32767?{op:'sipush '+v,v}:{op:'ldc '+v,v});}
    else if(n.k==='id')out.push({op:'iload_'+SLOT[n.v],id:n.v});else{gen(n.l,out);gen(n.r,out);out.push({op:OPC[n.v],bin:n.v});}return out;}
  function drawAst(root){
    let idx=0;const nodes=[];let maxD=0;
    (function w(n,d){if(!n)return;if(n.k==='op')w(n.l,d+1);n._x=idx++;n._d=d;maxD=Math.max(maxD,d);nodes.push(n);if(n.k==='op')w(n.r,d+1);})(root,0);
    const W=520,H=Math.max(140,50+maxD*52);$('ast').setAttribute('viewBox','0 0 '+W+' '+H);
    const X=n=>30+(W-60)*(nodes.length>1?n._x/(nodes.length-1):.5),Y=n=>26+n._d*52;
    let e='',s='';nodes.forEach(n=>{if(n.k==='op'){[n.l,n.r].forEach(c=>e+='<line class="ed" x1="'+X(n)+'" y1="'+Y(n)+'" x2="'+X(c)+'" y2="'+Y(c)+'"/>');}
      const col=n.k==='op'?'var(--accent-2)':n.k==='num'?'var(--ok)':'var(--accent)';
      s+='<circle class="nd" cx="'+X(n)+'" cy="'+Y(n)+'" r="17" fill="var(--card)" stroke="'+col+'"/><text class="nt" x="'+X(n)+'" y="'+(Y(n)+5)+'" text-anchor="middle" fill="'+col+'">'+(n.v==='*'?'×':n.v==='-'?'−':n.v)+'</text>';});
    $('ast').innerHTML=e+s;}
  function run(){
    const src=$('cIn').value,vars={a:+$('va').value|0,b:+$('vb').value|0,c:+$('vc').value|0};
    $('cIn').classList.remove('err');
    let toks;
    try{toks=lex(src);}catch(er){$('cIn').classList.add('err');$('cTok').innerHTML='';$('ast').innerHTML='';$('cBc').innerHTML='';$('cRun').innerHTML='';$('cRes').className='cres err';$('cRes').innerHTML='<b>Lexer-Fehler.</b> '+er.msg;return;}
    const NM={num:'Zahl',id:'Variable',op:'Operator',par:'Klammer'};
    $('cTok').innerHTML=toks.map(t=>'<span class="tok '+t.k+'">'+t.v+'<small>'+NM[t.k]+'</small></span>').join('');
    let ast;
    try{ast=parse(toks);}catch(er){$('cIn').classList.add('err');$('ast').innerHTML='';$('cBc').innerHTML='';$('cRun').innerHTML='';$('cRes').className='cres err';$('cRes').innerHTML='<b>Parser-Fehler – Kompilierung abgebrochen.</b> '+er.msg+' Der Lexer hatte noch nichts zu beanstanden: Einzeln sind alle Wörter gültig, nur ihre Reihenfolge nicht.';return;}
    drawAst(ast);
    const code=gen(ast,[]);code.push({op:'ireturn'});
    $('cBc').innerHTML='<tr><th>#</th><th>Befehl</th></tr>'+code.map((c,i)=>'<tr><td>'+i+'</td><td>'+c.op+'</td></tr>').join('');
    // Ausführen
    const st=[];let rows='<tr><th>Befehl</th><th>Stapel danach</th></tr>',err=null;
    for(const c of code){
      if(c.v!==undefined)st.push(c.v);else if(c.id)st.push(vars[c.id]);
      else if(c.bin){const r=st.pop(),l=st.pop();if(c.bin==='/'&&r===0){err='ArithmeticException: / by zero';break;}
        st.push(c.bin==='+'?(l+r)|0:c.bin==='-'?(l-r)|0:c.bin==='*'?Math.imul(l,r):Math.trunc(l/r));}
      rows+='<tr><td>'+c.op+'</td><td><span class="stk">'+(c.op==='ireturn'?'→ '+st[st.length-1]:st.map(x=>'<span>'+x+'</span>').join(''))+'</span></td></tr>';
    }
    $('cRun').innerHTML=rows;
    if(err){$('cRes').className='cres err';$('cRes').innerHTML='<b>Zur Laufzeit:</b> <code>'+err+'</code>. Kompilieren ging – der Fehler zeigt sich erst beim Ausführen mit diesen Werten.';}
    else{$('cRes').className='cres';$('cRes').innerHTML='<b>Ergebnis: '+st[st.length-1]+'</b> – mit '+code.length+' Bytecode-Befehlen. Die JVM ist eine <em>Stackmaschine</em>: Jeder Befehl nimmt seine Operanden vom Stapel und legt das Ergebnis zurück.';}
  }
  ['cIn','va','vb','vc'].forEach(id=>$(id).addEventListener('input',run));
  document.querySelectorAll('.quick button').forEach(b=>b.addEventListener('click',()=>{$('cIn').value=b.textContent;run();}));
  run();
})();

// ---------- JIT ----------
(function(){
  const $=id=>document.getElementById(id);
  const TIER=[{n:'Interpreter',t:60,c:'#b4540a'},{n:'C1 + Profil',t:14,c:'#8b3fb8'},{n:'C2 optimiert',t:2,c:'#15803d'}];
  const T1=200,T2=5000,MAX=12000;
  let pts,calls,tier,deopts,timer=null,total,events;
  function reset(){stop();pts=[];calls=0;tier=0;deopts=0;total=0;events=[];draw();}
  function stop(){if(timer){clearInterval(timer);timer=null;$('jRun').textContent='Aufrufe laufen lassen';}}
  function tick(){
    for(let k=0;k<100&&calls<MAX;k++){
      calls++;
      const since=calls-(events.length?events[events.length-1].at:0);
      if(tier===0&&since>=T1){tier=1;events.push({at:calls,t:1,txt:'C1'});}
      else if(tier===1&&since>=T2-T1&&events[events.length-1].t===1){tier=2;events.push({at:calls,t:2,txt:'C2'});}
      total+=TIER[tier].t;
      if(calls%50===0)pts.push([calls,TIER[tier].t,tier]);
    }
    if(calls>=MAX)stop();
    draw();
  }
  function draw(){
    const W=620,H=220,l=50,r=14,t=16,b=34,pw=W-l-r,ph=H-t-b;
    const X=c=>l+pw*c/MAX,Y=v=>t+ph*(1-Math.log10(v)/Math.log10(100));
    let s='<line class="ax" x1="'+l+'" y1="'+(t+ph)+'" x2="'+(W-r)+'" y2="'+(t+ph)+'"/><line class="ax" x1="'+l+'" y1="'+t+'" x2="'+l+'" y2="'+(t+ph)+'"/>';
    [1,10,100].forEach(v=>s+='<text class="lb" x="'+(l-6)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+' ns</text>');
    [0,4000,8000,12000].forEach(c=>s+='<text class="lb" x="'+X(c)+'" y="'+(H-12)+'" text-anchor="'+(c===12000?'end':'middle')+'">'+c.toLocaleString('de-DE')+'</text>');
    s+='<text class="lb" x="'+(l+pw/2)+'" y="'+(H-0)+'" text-anchor="middle">Aufrufe</text>';
    events.forEach(e=>{const col=e.t===0?'var(--bad)':TIER[e.t].c;s+='<line x1="'+X(e.at)+'" y1="'+t+'" x2="'+X(e.at)+'" y2="'+(t+ph)+'" stroke="'+col+'" stroke-dasharray="3 3"/><text class="tl" x="'+(X(e.at)+3)+'" y="'+(t+10)+'" fill="'+col+'">'+e.txt+'</text>';});
    for(let i=1;i<pts.length;i++){const a=pts[i-1],c=pts[i];s+='<line x1="'+X(a[0])+'" y1="'+Y(a[1])+'" x2="'+X(c[0])+'" y2="'+Y(c[1])+'" stroke="'+TIER[c[2]].c+'" stroke-width="3"/>';}
    $('jit').innerHTML=s;
    const avg=calls?total/calls:0;
    $('jS').innerHTML='<div><b>'+calls.toLocaleString('de-DE')+'</b>Aufrufe</div><div><b>'+TIER[tier].n+'</b>läuft gerade</div><div><b>'+TIER[tier].t+' ns</b>pro Aufruf jetzt</div><div><b>'+avg.toFixed(1).replace('.',',')+' ns</b>im Schnitt bisher</div>';
    let n;
    if(!calls)n='Die JVM ist gerade gestartet, die Methode wurde noch nie aufgerufen.';
    else if(tier===0)n=deopts?'<b>Deoptimiert:</b> Der optimierte Code nahm an, dass hier nur ein bestimmter Typ ankommt. Diese Annahme ist geplatzt – zurück in den Interpreter, Profil neu sammeln, später neu übersetzen.':'Der Interpreter führt Bytecode Befehl für Befehl aus und zählt mit.';
    else if(tier===1)n='Die Methode ist warm geworden: C1 hat sie schnell übersetzt. Der Code sammelt jetzt Profildaten – welche Typen, welche Zweige.';
    else n='<b>Heiß:</b> C2 hat die Methode mit allen Tricks übersetzt – Inlining, Escape-Analyse, Schleifenoptimierung. '+(calls>=MAX?'Im Schnitt war der Aufruf aber deutlich langsamer als jetzt – die Aufwärmphase steckt in diesem Durchschnitt.':'');
    $('jN').innerHTML=n;
  }
  $('jRun').addEventListener('click',()=>{if(timer){stop();return;}if(calls>=MAX)reset();$('jRun').textContent='Pause';timer=setInterval(tick,40);});
  $('jDeopt').addEventListener('click',()=>{if(tier===0)return;tier=0;deopts++;events.push({at:calls,t:0,txt:'Deopt'});pts.push([calls,TIER[0].t,0]);draw();});
  $('jReset').addEventListener('click',reset);
  reset();
})();

// ---------- Optimierungen ----------
(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const O={
    inline:['int flaeche(Rechteck r) {\n    return r.getBreite() * r.getHoehe();\n}\n\n// Getter in Rechteck:\nint getBreite() { return breite; }\nint getHoehe()  { return hoehe;  }',
            'int flaeche(Rechteck r) {\n    return r.breite * r.hoehe;\n}\n// Die Getter sind verschwunden –\n// ihr Inhalt steht direkt hier.',
            '<b>Inlining</b> ist die Mutter aller Optimierungen: Kleine Methoden werden in den Aufrufer hineinkopiert. Das spart den Aufruf selbst – vor allem aber sieht der Compiler danach mehr Code am Stück und kann weiter optimieren. Deshalb kosten saubere kleine Methoden in Java praktisch nichts.'],
    devirt:['interface Form { double flaeche(); }\n\ndouble summe(List<Form> formen) {\n    double s = 0;\n    for (Form f : formen)\n        s += f.flaeche();   // welche Klasse?\n    return s;\n}',
            '// Profil: hier kam bisher nur Kreis vor\nfor (Form f : formen) {\n    if (f.getClass() != Kreis.class)\n        deoptimieren();          // Falltür\n    Kreis k = (Kreis) f;\n    s += Math.PI * k.r * k.r;    // direkt, eingebettet\n}',
            '<b>Devirtualisierung:</b> Ein Interface-Aufruf muss eigentlich zur Laufzeit nachschlagen, welche Methode gemeint ist. Hat das Profil an dieser Stelle immer nur eine Klasse gesehen, setzt der JIT sie direkt ein – mit einer billigen Typprüfung als Falltür. Bei zwei Klassen geht das auch noch; bei vielen bleibt es ein echter virtueller Aufruf.'],
    escape:['double abstand(double x, double y) {\n    Punkt p = new Punkt(x, y);    // Objekt im Heap?\n    return p.laenge();\n}\n\nrecord Punkt(double x, double y) {\n    double laenge() { return Math.sqrt(x*x + y*y); }\n}',
            'double abstand(double x, double y) {\n    // kein Objekt, keine Allokation,\n    // nichts für den Garbage Collector\n    return Math.sqrt(x*x + y*y);\n}',
            '<b>Escape-Analyse:</b> Der JIT prüft, ob ein Objekt die Methode „verlässt“ – zurückgegeben, gespeichert, an andere übergeben wird. Wenn nicht, muss es gar nicht im Heap entstehen: Seine Felder werden zu lokalen Variablen in Registern. Kurzlebige Hilfsobjekte sind deshalb oft gratis.'],
    fold:['static final int TAGE = 7;\nstatic final boolean DEBUG = false;\n\nint stunden(int wochen) {\n    if (DEBUG) log("berechne…");\n    return wochen * TAGE * 24;\n}',
            'int stunden(int wochen) {\n    return wochen * 168;\n}',
            '<b>Konstanten falten und toten Code entfernen:</b> <code>7 * 24</code> wird einmal ausgerechnet, und ein Zweig, der nie genommen werden kann, verschwindet ganz. Einen Teil davon erledigt schon <code>javac</code>, den Rest der JIT – der auch erkennt, wenn eine Bedingung zwar theoretisch möglich, aber im Programmablauf nie wahr ist.'],
    bounds:['int summe(int[] a) {\n    int s = 0;\n    for (int i = 0; i < a.length; i++)\n        s += a[i];   // Java prüft jeden Index!\n    return s;\n}',
            'int summe(int[] a) {\n    int s = 0;\n    // Prüfung entfällt: i liegt beweisbar\n    // immer zwischen 0 und a.length-1.\n    // Dazu: mehrere Elemente pro Befehl (SIMD)\n    for (int i = 0; i < a.length; i += 8)\n        s += summe8(a, i);\n    return s;\n}',
            '<b>Bereichsprüfung entfernen:</b> Java garantiert eine <code>ArrayIndexOutOfBoundsException</code> statt Speicherfehlern – das bedeutet eine Prüfung bei jedem Zugriff. In einer solchen Schleife kann der JIT beweisen, dass der Index immer gültig ist, und lässt sie weg. Oft verarbeitet er dann sogar mehrere Elemente mit einem Prozessorbefehl. Sicherheit und Tempo zugleich.']
  };
  function draw(k){const o=O[k];$('oA').innerHTML=esc(o[0]);$('oB').innerHTML=esc(o[1]);$('oN').innerHTML=o[2];}
  const bs=[...document.querySelectorAll('#oSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw(b.dataset.o);}));
  draw('inline');
})();
