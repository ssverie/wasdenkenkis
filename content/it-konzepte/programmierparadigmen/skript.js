// ---------- Vier Stile ----------
(function(){
  const $=id=>document.getElementById(id);
  const S={
    imp:{c:'<span class="k">long</span> summe = <span class="s">0</span>;\n<span class="k">for</span> (<span class="k">int</span> i = <span class="s">0</span>; i &lt; bestellungen.size(); i++) {\n    Bestellung b = bestellungen.get(i);\n    <span class="k">if</span> (b.istVersandt() &amp;&amp; b.betragCent() &gt; <span class="s">2000</span>) {\n        <span class="m">summe +=</span> b.betragCent();        <span class="c">// Zustand ändern</span>\n    }\n}',
      n:'<b>Wie Schritt für Schritt.</b> Eine Variable wird angelegt und in der Schleife verändert. Jeder versteht es sofort, und man sieht genau, was die Maschine tut. Aber Absicht und Mechanik sind vermischt: Dass es um eine Summe geht, liest man erst am Ende ab.'},
    oo:{c:'<span class="k">class</span> Bestellung {\n    <span class="k">private final long</span> betragCent;\n    <span class="k">private</span> Status status;\n\n    <span class="k">boolean</span> zaehltZumUmsatz() {           <span class="c">// Wissen liegt beim Objekt</span>\n        <span class="k">return</span> status == Status.VERSANDT &amp;&amp; betragCent &gt; <span class="s">2000</span>;\n    }\n}\n\n<span class="k">class</span> Bestellbuch {\n    <span class="k">private final</span> List&lt;Bestellung&gt; bestellungen;\n\n    <span class="k">long</span> umsatz() {\n        <span class="k">long</span> summe = <span class="s">0</span>;\n        <span class="k">for</span> (Bestellung b : bestellungen)\n            <span class="k">if</span> (b.zaehltZumUmsatz()) summe += b.betragCent();\n        <span class="k">return</span> summe;\n    }\n}',
      n:'<b>Wer weiß was?</b> Die Regel „zählt zum Umsatz“ gehört zur Bestellung, die Summe zum Bestellbuch. Ändert sich die Regel, ändert man genau eine Stelle. Innen ist die Methode trotzdem imperativ – die Stile schließen sich nicht aus.'},
    fn:{c:'<span class="k">long</span> summe = bestellungen.stream()\n        .filter(Bestellung::istVersandt)\n        .filter(b -&gt; b.betragCent() &gt; <span class="s">2000</span>)\n        .mapToLong(Bestellung::betragCent)\n        .sum();',
      n:'<b>Was, nicht wie.</b> Eine Kette von Umformungen: filtern, abbilden, zusammenfassen. Nichts wird verändert, keine Zählvariable. Jeder Schritt ist eine eigene, testbare Funktion. Und mit <code>.parallel()</code> ließe sich die Arbeit auf alle Kerne verteilen, ohne dass sich Threads in die Quere kommen.'},
    dec:{c:'<span class="k">SELECT SUM</span>(betrag_cent)\n<span class="k">FROM</span>   bestellung\n<span class="k">WHERE</span>  status = <span class="s">\'VERSANDT\'</span>\n  <span class="k">AND</span>  betrag_cent &gt; <span class="s">2000</span>;',
      n:'<b>Nur das Ergebnis.</b> Keine Schleife, keine Reihenfolge. Ob die Datenbank einen Index nutzt, parallel liest oder ein Zwischenergebnis hat, entscheidet sie selbst. Das ist die Stärke des deklarativen Stils: Der Ausführende kann klüger sein als der Fragende.'}
  };
  let s='imp';
  function draw(){$('stCode').innerHTML=S[s].c;$('stNote').innerHTML=S[s].n;}
  const bs=[...document.querySelectorAll('#stSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');s=b.dataset.s;draw();}));
  draw();
})();

// ---------- Zwei Variablen, ein Objekt ----------
(function(){
  const $=id=>document.getElementById(id);
  const M={
    sort:{c:'List&lt;Integer&gt; a = <span class="k">new</span> ArrayList&lt;&gt;(List.of(<span class="s">3</span>, <span class="s">1</span>, <span class="s">2</span>));\nList&lt;Integer&gt; b = a;               <span class="c">// keine Kopie – derselbe Verweis</span>\nb.sort(Comparator.naturalOrder());   <span class="c">// <span class="m">verändert das Objekt</span></span>',
      o:[{v:[1,2,3],cls:'chg',refs:['a','b']}],n:'<b>Überraschung: a ist auch sortiert.</b> Es gibt nur ein Listenobjekt, a und b zeigen beide darauf. Wer a benutzt und mit der ursprünglichen Reihenfolge rechnet, hat jetzt einen Fehler – an einer Stelle, die b nie berührt hat.'},
    stream:{c:'List&lt;Integer&gt; a = <span class="k">new</span> ArrayList&lt;&gt;(List.of(<span class="s">3</span>, <span class="s">1</span>, <span class="s">2</span>));\nList&lt;Integer&gt; b = a;\nb = b.stream().sorted().toList();    <span class="c">// neues, unveränderliches Objekt</span>',
      o:[{v:[3,1,2],cls:'',refs:['a']},{v:[1,2,3],cls:'new',refs:['b']}],n:'<b>Funktional: a bleibt unberührt.</b> Der Stream erzeugt eine neue Liste, und b zeigt jetzt dorthin. Die alte Liste ist unverändert. Die neue ist sogar unveränderlich – <code>b.add(4)</code> würde eine Exception werfen. So etwas kann man bedenkenlos weitergeben.'},
    copy:{c:'List&lt;Integer&gt; a = <span class="k">new</span> ArrayList&lt;&gt;(List.of(<span class="s">3</span>, <span class="s">1</span>, <span class="s">2</span>));\nList&lt;Integer&gt; b = <span class="k">new</span> ArrayList&lt;&gt;(a);   <span class="c">// defensive Kopie</span>\nb.sort(Comparator.naturalOrder());',
      o:[{v:[3,1,2],cls:'',refs:['a']},{v:[1,2,3],cls:'chg',refs:['b']}],n:'<b>Defensive Kopie: auch sicher.</b> Der klassische objektorientierte Weg: Wer etwas verändern will, kopiert es vorher. Funktioniert, kostet aber Disziplin – vergisst man die Kopie an einer Stelle, ist der Fehler wieder da.'}
  };
  let m='sort';
  function draw(){
    const d=M[m];$('mutCode').innerHTML=d.c;
    $('heap').innerHTML='<div class="vars">'+['a','b'].map(v=>'<div class="var">'+v+' <i>→</i> <span class="refs">Objekt '+(d.o.findIndex(o=>o.refs.includes(v))+1)+'</span></div>').join('')+'</div><div class="objs">'+d.o.map((o,i)=>'<div class="obj '+o.cls+'"><span>Objekt '+(i+1)+'</span><div class="cells">'+o.v.map(x=>'<span>'+x+'</span>').join('')+'</div><span>← '+o.refs.join(', ')+'</span></div>').join('')+'</div>';
    $('mutNote').innerHTML=d.n;
  }
  const bs=[...document.querySelectorAll('#mutSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;draw();}));
  draw();
})();

// ---------- Erweiterung ----------
(function(){
  const $=id=>document.getElementById(id);
  let st='oo',ch='none';
  function draw(){
    const types=['Kreis','Rechteck'].concat(ch==='type'?['Dreieck']:[]);
    const ops=['fläche','umfang'].concat(ch==='op'?['zeichnen']:[]);
    let h='';
    if(st==='oo'){
      // Jede Klasse ist eine Datei mit allen Operationen
      h+='<div class="mx" style="grid-template-columns:repeat('+types.length+',1fr)">';
      types.forEach(t=>{const isNew=t==='Dreieck',touched=ch==='op';
        h+='<div class="file '+(isNew?'add':touched?'touch':'')+'"><b>class '+t+'</b><br>'+ops.map(o=>o+'()').join('<br>')+'</div>';});
      h+='</div>';
    }else{
      h+='<div class="mx" style="grid-template-columns:repeat('+(ops.length+1)+',1fr)">';
      h+='<div class="file '+(ch==='type'?'touch':'')+'"><b>sealed Form</b><br>'+types.map(t=>'record '+t).join('<br>')+'</div>';
      ops.forEach(o=>{const isNew=o==='zeichnen',touched=ch==='type';
        h+='<div class="file '+(isNew?'add':touched?'touch':'')+'"><b>'+o+'(Form)</b><br>switch:<br>'+types.join('<br>')+'</div>';});
      h+='</div>';
    }
    $('mxBox').innerHTML=h;
    let n;
    if(ch==='none')n=st==='oo'?'Jede Form ist eine Klasse und bringt ihre eigenen Methoden mit. Die Fläche des Kreises steht in der Klasse Kreis.':'Die Formen sind schlichte Daten-Records. Jede Operation ist eine Funktion, die mit einem switch alle Formen behandelt.';
    else if(st==='oo'&&ch==='type')n='<b>Leicht:</b> Eine neue Klasse Dreieck schreiben, fertig. Der bestehende Code bleibt unberührt.';
    else if(st==='oo'&&ch==='op')n='<b>Mühsam:</b> Jede einzelne Formklasse muss eine neue Methode bekommen – auch solche, die vielleicht in fremden Bibliotheken liegen.';
    else if(ch==='op')n='<b>Leicht:</b> Eine neue Funktion zeichnen(Form) mit einem switch schreiben. Die Formen und die anderen Operationen bleiben unberührt.';
    else n='<b>Mühsam – aber sicher:</b> Jede Operation braucht einen neuen Fall. Bei sealed Interfaces meldet der Compiler jeden vergessenen switch als Fehler. Früher, mit <code>instanceof</code>-Ketten und <code>default</code>, ging so etwas still schief.';
    $('mxSum').innerHTML=n;
  }
  function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);draw();}));}
  seg('exStyle',d=>st=d.s);seg('exChg',d=>ch=d.c);draw();
})();
