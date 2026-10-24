// ---------- Farbmischen ----------
(function(){
  const $=id=>document.getElementById(id);
  const C=[235,200,60]; // gemeinsame Startfarbe: Gelb
  function hsl2rgb(h){const s=.75,l=.5,k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));return [255*f(0),255*f(8),255*f(4)].map(Math.round);}
  const mix=(...cs)=>[0,1,2].map(i=>Math.round(cs.reduce((s,c)=>s+c[i],0)/cs.length));
  const css=c=>'rgb('+c.join(',')+')';
  function draw(){
    const a=hsl2rgb(+$('hA').value),b=hsl2rgb(+$('hB').value);
    const mA=mix(C,a),mB=mix(C,b);
    const kA=mix(C,a,b),kB=mix(C,b,a);              // je ein Teil – Reihenfolge egal
    const kE=mix(mA,mB);                             // = (2C + a + b) / 4
    $('cA').style.background=css(a);$('cB').style.background=css(b);$('cC').style.background=css(C);
    $('mA').style.background=css(mA);$('mB').style.background=css(mB);$('eA').style.background=css(mA);$('eB').style.background=css(mB);
    $('kA').style.background=css(kA);$('kB').style.background=css(kB);$('kE').style.background=css(kE);
    const d=Math.round(Math.hypot(kA[0]-kE[0],kA[1]-kE[1],kA[2]-kE[2]));
    $('dhNote').innerHTML='Alice und Bob kommen auf <b>dieselbe Farbe</b>: Beide haben je einen Teil Startfarbe, einen Teil Alice-Geheimnis und einen Teil Bob-Geheimnis gemischt – nur in anderer Reihenfolge. Eve kennt nur die Mischungen. Um das Ergebnis zu bekommen, müsste sie eine Mischung wieder entmischen. '+(d<25?'Bei diesen Farben liegt Eves Versuch zufällig nah dran – bei echten Zahlen gibt es kein „nah dran“, nur richtig oder falsch.':'Ihr bester Versuch weicht deutlich ab.')+' Verschieb die geheimen Farben.';
  }
  $('hA').addEventListener('input',draw);$('hB').addEventListener('input',draw);draw();
})();

// ---------- Vertrauenskette ----------
(function(){
  const $=id=>document.getElementById(id);
  const on=k=>document.querySelector('#brk input[data-b="'+k+'"]').checked;
  function cert(title,rows,cls){return '<div class="cert '+(cls||'')+'"><b>'+title+'</b><dl>'+rows.map(r=>'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>').join('')+'</dl></div>';}
  function draw(){
    const exp=on('exp'),name=on('name'),mid=on('mid'),self=on('self');
    let h='<div class="store">Im Truststore von Browser und JDK</div>';
    const leafBad=exp||name||self;
    if(self){
      h+=cert('Server-Zertifikat',[['Für',name?'<span class="x">example.org</span>':'shop.example.com'],['Ausgestellt von','<span class="x">shop.example.com – sich selbst</span>'],['Gültig bis',exp?'<span class="x">03.09.2026 – abgelaufen</span>':'14.03.2027']],'bad');
      h+='<div class="link">keine Verbindung zu einer bekannten Root-CA</div>';
    }else{
      h+=cert('Root-CA: „Beispiel Root R1“',[['Für','Beispiel Root R1'],['Ausgestellt von','sich selbst – vertraut, weil vorinstalliert'],['Gültig bis','2038']]);
      h+='<div class="link">↓ hat unterschrieben</div>';
      h+=mid?'<div class="cert miss"><b>Zwischenzertifikat „Beispiel CA E5“ – fehlt</b>Der Server hat es nicht mitgeschickt.</div>':cert('Zwischenzertifikat: „Beispiel CA E5“',[['Ausgestellt von','Beispiel Root R1'],['Gültig bis','2029']]);
      h+='<div class="link">↓ hat unterschrieben</div>';
      h+=cert('Server-Zertifikat',[['Für',name?'<span class="x">example.org</span>':'shop.example.com'],['Ausgestellt von','Beispiel CA E5'],['Gültig bis',exp?'<span class="x">03.09.2026 – abgelaufen</span>':'14.03.2027'],['Öffentlicher Schlüssel','ECDSA P-256, 04:7a:1c:…']],leafBad||mid?'bad':'');
    }
    $('chain').innerHTML=h;
    let br,jv,ok=false;
    if(self){br='<code>NET::ERR_CERT_AUTHORITY_INVALID</code> – „Ihre Verbindung ist nicht privat“. Niemand Vertrautes hat unterschrieben.';jv='<code>SSLHandshakeException: PKIX path building failed … unable to find valid certification path to requested target</code>';}
    else if(name){br='<code>NET::ERR_CERT_COMMON_NAME_INVALID</code> – das Zertifikat ist echt, aber für eine andere Domain. Genau das soll es verhindern: Ein gültiges Zertifikat für die eigene Domain macht niemanden zum Inhaber einer fremden.';jv='<code>SSLHandshakeException: No subject alternative DNS name matching shop.example.com found</code>';}
    else if(exp){br='<code>NET::ERR_CERT_DATE_INVALID</code> – abgelaufen. Meist vergessene Erneuerung. Auch eine falsch gestellte Uhr beim Client führt zu diesem Fehler.';jv='<code>SSLHandshakeException: PKIX path validation failed … validity check failed</code>';}
    else if(mid){br='<b>Funktioniert meistens trotzdem.</b> Browser laden fehlende Zwischenzertifikate oft nach oder kennen sie von früheren Besuchen.';jv='<code>SSLHandshakeException: PKIX path building failed … unable to find valid certification path to requested target</code> – Java lädt nichts nach. Reparieren muss man den Server: Er muss die vollständige Kette ausliefern.';}
    else{ok=true;br='Schloss-Symbol. Kette vollständig, Name passt, alles gültig, und der Server hat mit seinem privaten Schlüssel bewiesen, dass er der Inhaber ist.';jv='Verbindung steht. Der <code>HttpClient</code> merkt von all dem nichts.';}
    $('verdict').innerHTML='<div class="'+(ok||(!self&&!name&&!exp&&mid)?'ok':'no')+'"><h4>Browser</h4>'+br+'</div><div class="'+(ok?'ok':'no')+'"><h4>Java</h4>'+jv+'</div>';
  }
  document.querySelectorAll('#brk input').forEach(x=>x.addEventListener('change',draw));draw();
})();
