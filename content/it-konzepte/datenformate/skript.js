// ---------- Zeichen ----------
(function(){
  const $=id=>document.getElementById(id);
  const enc=new TextEncoder();let win;try{win=new TextDecoder('windows-1252');}catch(e){win=null;}
  function draw(){
    const t=$('txt').value;let h='',b=0,cp=0;
    for(const ch of t){
      const bytes=[...enc.encode(ch)];b+=bytes.length;cp++;
      const c=ch.codePointAt(0);
      h+='<div class="chr n'+bytes.length+'"><span class="g">'+(ch===' '?'␣':ch.replace(/</g,'&lt;'))+'</span><span class="cp">U+'+c.toString(16).toUpperCase().padStart(4,'0')+'</span><span class="by">'+bytes.map(x=>'<span>'+x.toString(16).toUpperCase().padStart(2,'0')+'</span>').join('')+'</span></div>';
    }
    $('chars').innerHTML=h;
    $('cnt').innerHTML='<div><b>'+cp+'</b>Codepoints</div><div><b>'+t.length+'</b><code>String.length()</code> in Java</div><div><b>'+b+'</b>Bytes in UTF-8</div><div><b>'+(t.length*2)+'</b>Bytes in UTF-16</div>';
    const wrong=win?win.decode(enc.encode(t)):[...enc.encode(t)].map(x=>String.fromCharCode(x)).join('');
    $('moji').innerHTML=wrong===t?'Nur ASCII-Zeichen – die sehen in UTF-8 und Windows-1252 gleich aus. Tipp einen Umlaut ein.':'Dieselben Bytes, als Windows-1252 gelesen: <code>'+wrong.replace(/</g,'&lt;')+'</code>';
  }
  $('txt').addEventListener('input',draw);draw();
})();

// ---------- Formate ----------
(function(){
  const $=id=>document.getElementById(id);
  const RAW={
    json:'{"id":42,"kunde":"Anna","summeCent":5990,"versandt":true,"artikel":[17,23]}',
    xml:'<bestellung id="42"><kunde>Anna</kunde><summeCent>5990</summeCent><versandt>true</versandt><artikel>17</artikel><artikel>23</artikel></bestellung>',
    yaml:'id: 42\nkunde: Anna\nsummeCent: 5990\nversandt: true\nartikel: [17, 23]\n',
    csv:'id;kunde;summeCent;versandt;artikel\n42;Anna;5990;true;17|23\n'
  };
  const PB=[
    ['08','t','Feld 1 (id), Typ Varint'],['2A','v','Wert 42'],
    ['12','t','Feld 2 (kunde), Typ „mit Länge“'],['04','l','Länge 4 Bytes'],['41','v','„A“'],['6E','v','„n“'],['6E','v','„n“'],['61','v','„a“'],
    ['18','t','Feld 3 (summeCent), Typ Varint'],['E6','v','5990 als Varint, Teil 1: 7 Bit, das oberste Bit sagt „es geht weiter“'],['2E','v','5990 als Varint, Teil 2: 102 + 46·128 = 5990'],
    ['20','t','Feld 4 (versandt), Typ Varint'],['01','v','true'],
    ['2A','t','Feld 5 (artikel), Typ „mit Länge“ – gepackte Liste'],['02','l','Länge 2 Bytes'],['11','v','17'],['17','v','23']
  ];
  const sizes={json:new TextEncoder().encode(RAW.json).length,xml:new TextEncoder().encode(RAW.xml).length,yaml:new TextEncoder().encode(RAW.yaml).length,csv:new TextEncoder().encode(RAW.csv).length,pb:PB.length};
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const color={
    json:s=>esc(JSON.stringify(JSON.parse(s),null,2)).replace(/"(\w+)":/g,'<span class="k">"$1"</span>:').replace(/: "([^"]*)"/g,': <span class="s">"$1"</span>').replace(/\b(\d+|true)\b/g,'<span class="n">$1</span>'),
    xml:s=>esc(s.replace(/></g,'>\n<').replace(/\n<(kunde|summeCent|versandt|artikel)>/g,'\n  <$1>')).replace(/&lt;(\/?\w+)/g,'&lt;<span class="k">$1</span>').replace(/"42"/,'<span class="s">"42"</span>'),
    yaml:s=>esc(s).replace(/^(\w+):/gm,'<span class="k">$1</span>:').replace(/\b(\d+|true)\b/g,'<span class="n">$1</span>'),
    csv:s=>esc(s).replace(/^(.*)$/m,'<span class="c">$1</span>')
  };
  const NOTE={
    json:'Kompakt geschrieben '+sizes.json+' Bytes – angezeigt hübsch eingerückt. Jeder Feldname reist bei jeder einzelnen Nachricht mit.',
    xml:'Mit '+sizes.xml+' Bytes das ausführlichste Format: Jeder Name steht zweimal da, im öffnenden und im schließenden Tag. Dafür kann XML Attribute (<code>id="42"</code>), Namensräume und gemischten Text.',
    yaml:'Lesbar wie eine Notiz. Aber Vorsicht: Einrückung trägt Bedeutung, und manche YAML-Leser machen aus einem unquotierten <code>NO</code> ein <code>false</code> – berüchtigt als „Norwegen-Problem“.',
    csv:'Am kleinsten unter den Textformaten, aber flach: Für die Liste der Artikel musste ein eigenes Trennzeichen erfunden werden. Und ob Semikolon oder Komma, welcher Zeichensatz, wie Anführungszeichen maskiert werden – das muss man jedes Mal aushandeln.',
    pb:'Nur '+sizes.pb+' Bytes. Keine Feldnamen – nur Nummern aus dem Schema. Zahlen als „Varint“: kleine Zahlen brauchen ein Byte, große mehr. Fahr mit der Maus über die Bytes oder tippe sie an.'
  };
  let f='json';
  function draw(){
    if(f==='pb'){
      $('fBody').innerHTML='<div class="code" style="margin-bottom:10px"><span class="c">// bestellung.proto</span>\n<span class="k">message</span> Bestellung {\n  <span class="k">int64</span>  id         = <span class="n">1</span>;\n  <span class="k">string</span> kunde      = <span class="n">2</span>;\n  <span class="k">int64</span>  summe_cent = <span class="n">3</span>;\n  <span class="k">bool</span>   versandt   = <span class="n">4</span>;\n  <span class="k">repeated int32</span> artikel = <span class="n">5</span>;\n}</div><div class="pb" id="pbB">'+PB.map((p,i)=>'<span class="'+p[1]+'" data-i="'+i+'" tabindex="0">'+p[0]+'</span>').join('')+'</div><div class="pb-ann" id="pbA">Blau: Feldnummer und Typ · Grau: Länge · Grün: Daten</div>';
      document.querySelectorAll('#pbB span').forEach(s=>{const show=()=>{document.querySelectorAll('#pbB span').forEach(x=>x.classList.remove('hl'));s.classList.add('hl');$('pbA').textContent='0x'+s.textContent+': '+PB[+s.dataset.i][2];};s.addEventListener('mouseenter',show);s.addEventListener('click',show);s.addEventListener('focus',show);});
    }else $('fBody').innerHTML='<div class="code">'+color[f](RAW[f])+'</div>';
    const mx=Math.max(...Object.values(sizes)),L={json:'JSON',xml:'XML',yaml:'YAML',csv:'CSV',pb:'Protobuf'};
    $('fSizes').innerHTML='<div style="font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Größe in Bytes</div>'+Object.keys(sizes).map(k=>'<div class="sz'+(k===f?' on':'')+'"><span>'+L[k]+'</span><div class="tr"><div class="fl" style="width:'+(100*sizes[k]/mx).toFixed(1)+'%"></div></div><span>'+sizes[k]+'</span></div>').join('');
    $('fNote').innerHTML=NOTE[f];
  }
  const bs=[...document.querySelectorAll('#fSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');f=b.dataset.f;draw();}));
  draw();
})();

// ---------- Zahlenfalle ----------
(function(){
  const $=id=>document.getElementById(id);
  function draw(){
    const s=$('num').value.trim();let js,ok;
    try{const v=JSON.parse(s);js=typeof v==='number'?String(v):'keine Zahl';ok=(js===s)||(Number(s)===v&&!/^\d{16,}$/.test(s)&&js===s);}catch(e){js='ungültiges JSON';ok=false;}
    let jv;
    if(/^-?\d+$/.test(s)){try{const bi=BigInt(s);jv=(bi<=9223372036854775807n&&bi>=-9223372036854775808n)?s+'  (long)':s+'  (BigInteger – zu groß für long)';}catch(e){jv='–';}}
    else if(/^-?\d*\.\d+$/.test(s))jv=s+'  (als BigDecimal exakt; als double: '+String(Number(s))+')';
    else jv='–';
    const same=js===s;
    $('nf').innerHTML='<div class="'+(same?'good':'bad')+'"><b>'+js+'</b>JavaScript: <code>JSON.parse("'+s.replace(/</g,'&lt;')+'")</code>'+(same?'':' – <b style="display:inline;font:inherit;color:var(--bad)">anders als geschickt</b>')+'</div><div class="good"><b>'+jv+'</b>Java mit Jackson in einem passenden Typ</div>';
  }
  $('num').addEventListener('input',draw);draw();
})();
