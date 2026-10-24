// ---------- Stellenwert ----------
(function(){
  const $=id=>document.getElementById(id);let v=2026;
  function draw(){let h='';for(let i=15;i>=0;i--){const on=(v>>i)&1;h+='<button class="'+(on?'on':'')+(i%4===3&&i!==15?' gap':'')+'" data-i="'+i+'" aria-pressed="'+(on?'true':'false')+'">'+on+'<small>'+(1<<i)+'</small></button>';}
    $('cvB').innerHTML=h;$('cvB').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{v^=1<<+b.dataset.i;$('cvIn').value=v;draw();}));
    const bin=v.toString(2).padStart(16,'0').replace(/(.{4})(?=.)/g,'$1 ');
    $('cvR').innerHTML='<div><b>'+v.toLocaleString('de-DE')+'</b>dezimal</div><div><b>'+bin+'</b>binär</div><div><b>0x'+v.toString(16).toUpperCase()+'</b>hexadezimal</div><div><b>0'+v.toString(8)+'</b>oktal</div>';
    if(v===0){$('cvD').textContent='0 ist binär einfach 0.';return;}
    let n=v,rows=[];while(n>0){rows.push(String(n).padStart(5)+' : 2 = '+String(Math.floor(n/2)).padStart(5)+'  Rest <i>'+(n%2)+'</i>');n=Math.floor(n/2);}
    $('cvD').innerHTML=rows.join('\n')+'\n\nVon unten gelesen: <i>'+v.toString(2)+'</i>';}
  $('cvIn').addEventListener('input',()=>{let x=$('cvIn').value.replace(/\D/g,'');if(x!==$('cvIn').value)$('cvIn').value=x;v=Math.min(65535,+x||0);draw();});
  document.querySelectorAll('#cvIn ~ button').forEach(b=>b.addEventListener('click',()=>{v=+b.dataset.v;$('cvIn').value=v;draw();}));
  draw();
})();

// ---------- Addierer ----------
(function(){
  const $=id=>document.getElementById(id);
  const s8=x=>x>127?x-256:x,bits=x=>x.toString(2).padStart(8,'0');
  function draw(){const a=+$('adA').value,b=+$('adB').value,sum=a+b,r=sum&255;
    $('adAo').textContent=a;$('adBo').textContent=b;
    let c=0,cy='';for(let i=0;i<8;i++){const ab=((a>>i)&1)+((b>>i)&1)+c;c=ab>1?1:0;cy=(i<7?(c?'1':'·'):'')+cy;}
    const carryOut=sum>255,sa=s8(a),sb=s8(b),sr=s8(r),ov=(sa+sb)!==sr;
    $('adV').innerHTML='<span class="rl">Überträge</span><span class="cy">'+(carryOut?'1':' ')+cy+' </span>'+
      '<span class="rl">a</span><span>'+bits(a)+'</span><span class="rl">+ b</span><span>'+bits(b)+'</span><span class="rl">Ergebnis</span><span class="sum">'+bits(r)+'</span>';
    $('adF').innerHTML='<div class="'+(carryOut?'bad':'')+'">Ohne Vorzeichen: <b>'+a+' + '+b+' = '+r+'</b>'+(carryOut?' – richtig wäre '+sum+'. <b>Carry</b>: das neunte Bit fiel heraus.':' ✓')+'</div>'+
      '<div class="'+(ov?'bad':'')+'">Zweierkomplement: <b>'+sa+' + '+(sb<0?'('+sb+')':sb)+' = '+sr+'</b>'+(ov?' – richtig wäre '+(sa+sb)+'. <b>Overflow</b>.':' ✓')+'</div>';
    let n;
    if(ov&&!carryOut)n='Zwei positive Zahlen ergeben eine negative: Das Ergebnis passt nicht in −128 … 127 und ist ins Negative umgeklappt. Genau das passiert bei <code>Integer.MAX_VALUE + 1</code>.';
    else if(ov)n='Zwei negative Zahlen ergeben eine positive – Überlauf am unteren Ende.';
    else if(carryOut)n='Mit Vorzeichen stimmt das Ergebnis, ohne Vorzeichen nicht: Das herausgefallene neunte Bit ist beim Zweierkomplement gerade der Trick. −1 ist <code>1111 1111</code>; plus 1 ergibt <code>1 0000 0000</code>, und ohne das neunte Bit bleibt 0.';
    else n='Beide Lesarten stimmen. Derselbe Addierer, dieselben Bits – nur die Interpretation unterscheidet sich.';
    $('adN').innerHTML=n;}
  $('adA').addEventListener('input',draw);$('adB').addEventListener('input',draw);draw();
})();

// ---------- Float ----------
(function(){
  const $=id=>document.getElementById(id);
  const buf=new DataView(new ArrayBuffer(4));let u=0;
  function exact(m,e){// m*2^e exakt als Dezimalstring
    let M=BigInt(m);if(e>=0)return (M<<BigInt(e)).toString();
    const s=(M*5n**BigInt(-e)).toString().padStart(-e+1,'0'),k=s.length+e;let r=s.slice(0,k)+','+s.slice(k);return r.replace(/0+$/,'').replace(/,$/,'');}
  function fmt(s){if(s.length<=60)return s;return s.slice(0,58)+'…';}
  function fromNum(x){buf.setFloat32(0,x);u=buf.getUint32(0);}
  function draw(inputStr){
    let h='';for(let i=31;i>=0;i--){const on=(u>>>i)&1,cl=i===31?'s':i>=23?'e':'m';h+='<button class="'+cl+(on?' on':'')+'" data-i="'+i+'">'+on+'</button>';}
    $('flB').innerHTML=h;$('flB').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{u=(u^(1<<+b.dataset.i))>>>0;buf.setUint32(0,u);$('flIn').value=String(buf.getFloat32(0));draw(null);}));
    buf.setUint32(0,u);const f=buf.getFloat32(0),s=u>>>31,E=(u>>>23)&255,F=u&0x7fffff;
    let c='',n='';const sg=s?'−':'+';
    if(E===255){c=F?'Exponent alle Bits 1, Mantisse ≠ 0 → <b>NaN</b> (Not a Number)':'Exponent alle Bits 1, Mantisse 0 → <b>'+sg+'Unendlich</b>';n=F?'NaN entsteht etwa bei 0.0/0.0 oder Math.sqrt(-1). Jeder Vergleich mit NaN ist false – sogar NaN == NaN.':'Unendlich entsteht bei Überlauf oder Division durch null; damit kann man weiterrechnen, ohne dass eine Exception fliegt.';}
    else if(E===0&&F===0){c='Alle Bits 0 (bis aufs Vorzeichen) → <b>'+sg+'0</b>';n=s?'Ja, es gibt −0. Es ist gleich +0 (== liefert true), aber 1/−0 ergibt −Unendlich.':'Null ist ein Sonderfall: Die versteckte führende 1 gilt hier nicht.';}
    else{const sub=E===0,m=sub?F:(F|0x800000),e=(sub?-126:E-127)-23;
      const ex=exact(m,e);
      c=sg+' '+(sub?'0':'1')+','+(F.toString(2).padStart(23,'0').replace(/0+$/,'')||'0')+'₂ · 2<sup>'+(sub?-126:E-127)+'</sup>'+(sub?' &nbsp;(subnormal: Exponent-Bits 0, keine versteckte 1)':' &nbsp;(Exponent-Bits '+E+' − 127 = '+(E-127)+')')+'<br>= '+(s?'−':'')+fmt(ex);
      const ulp=exact(1,(sub?-126:E-127)-23);
      let inp=inputStr!=null?inputStr.trim().replace(',','.'):null,exactMatch=false;
      if(inp!=null&&inp!==''&&!isNaN(+inp)){const want=+inp;exactMatch=Math.fround(want)===want&&String(want)===String(f);
        if(Math.fround(want)!==want||(/\./.test(inp)&&!exactMatch)){c+='<br><span class="x">≠ '+inp.replace('.',',')+'</span> – das ist der nächstgelegene float.';}}
      c+='<br>Abstand zur nächsten float-Zahl (ulp): '+fmt(ulp);
      if(Math.abs(f)===16777216&&inputStr&&inputStr.trim()==='16777217')n='16 777 217 = 2²⁴ + 1 braucht 25 signifikante Bits, die Mantisse hat aber nur 24 (23 gespeicherte plus die versteckte 1). Gespeichert wird 16 777 216 – ab hier kann ein float nicht mehr jede ganze Zahl darstellen.';
      else if(sub)n='Subnormale Zahlen füllen die Lücke zwischen der kleinsten normalen Zahl (etwa 1,18 · 10⁻³⁸) und der Null. Die kleinste ist 2⁻¹⁴⁹ ≈ 1,4 · 10⁻⁴⁵.';
      else if(inputStr&&/^-?0?[.,]1$/.test(inputStr.trim()))n='0,1 ist binär periodisch: 0,0001100110011…₂ – wie 1/3 im Dezimalsystem. Die Mantisse schneidet nach 23 Bits ab (und rundet). Deshalb ist 0.1f ein klein wenig größer als 0,1, und 0.1 + 0.2 ergibt bei double 0.30000000000000004.';
      else n='Klick einzelne Bits an: Ein Bit im Exponenten verdoppelt oder halbiert die Zahl, ein Bit ganz rechts in der Mantisse ändert sie um genau ein ulp.';}
    $('flC').innerHTML=c;$('flN').innerHTML=n;}
  function set(str){const x=str.trim().replace(',','.');const v=x==='NaN'?NaN:x==='Infinity'||x==='∞'?Infinity:x==='-Infinity'?-Infinity:+x;if(isNaN(v)&&x!=='NaN'){$('flC').textContent='Keine Zahl erkannt.';return;}fromNum(v);draw(str);}
  $('flIn').addEventListener('input',()=>set($('flIn').value));
  document.querySelectorAll('#flIn ~ button').forEach(b=>b.addEventListener('click',()=>{$('flIn').value=b.dataset.v;set(b.dataset.v);}));
  set('0.1');
})();
