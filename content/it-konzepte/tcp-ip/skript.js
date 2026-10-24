// ---------- Kapselung ----------
(function(){
  const $=id=>document.getElementById(id);
  const S=[
    {l:'Anwendung',p:['app'],sz:'≈ 40 Byte',t:'Der Browser formuliert seine Anfrage: <code>GET /index.html</code> mit ein paar Kopfzeilen. Er kümmert sich um nichts anderes – nicht um Wege, nicht um Verluste.'},
    {l:'Transport (TCP)',p:['tcp','app'],sz:'+ 20 Byte',t:'TCP setzt seinen Kopf davor: <b>Quell- und Ziel-Port</b> (z. B. 51 234 → 443), die <b>Folgenummer</b> und die Bestätigungsnummer. Damit weiß der Empfänger, welches Programm die Daten bekommt und an welche Stelle im Strom sie gehören.'},
    {l:'Internet (IP)',p:['ip','tcp','app'],sz:'+ 20 Byte',t:'IP setzt seinen Kopf davor: <b>Quell- und Ziel-Adresse</b> und den <b>TTL-Zähler</b>. Was im TCP-Teil steht, interessiert IP nicht – es ist nur Inhalt.'},
    {l:'Verbindung (Ethernet)',p:['eth','ip','tcp','app','eth2'],sz:'+ 18 Byte',t:'Ethernet setzt die <b>MAC-Adressen</b> des nächsten Geräts davor – meist des Routers – und eine <b>Prüfsumme</b> dahinter. An jedem Router wird dieser äußerste Umschlag abgenommen und für die nächste Strecke ein neuer angelegt. Die inneren Umschläge bleiben unterwegs gleich.'},
    {l:'Leitung',p:['eth','ip','tcp','app','eth2'],sz:'≈ 98 Byte',t:'Jetzt sind es nur noch Bits auf dem Kabel oder Funkwellen in der Luft. Von knapp 100 Byte sind nur 40 die eigentliche Anfrage – bei großen Datenmengen fallen die Köpfe aber kaum ins Gewicht, denn ein Paket fasst rund 1 500 Byte.'}
  ];
  const LG={eth:'Ethernet: MAC',ip:'IP: Adressen, TTL',tcp:'TCP: Ports, Nr.',app:'GET /index.html …',eth2:'Prüfs.'},SH={eth:'ETH',ip:'IP',tcp:'TCP',app:'GET …',eth2:'FCS'};
  const LBL={};Object.keys(LG).forEach(k=>LBL[k]='<i class="lg">'+LG[k]+'</i><i class="sh">'+SH[k]+'</i>');
  let k=0;
  function draw(){
    let h='';
    S.forEach((s,i)=>{
      h+='<div class="el'+(i===k?' on':'')+'">'+s.l+'<br><span style="font-weight:400">'+s.sz+'</span></div>';
      h+='<div class="pkt'+(i>k?' off':'')+'">'+s.p.map(c=>'<span class="'+(c==='eth2'?'eth':c)+'"'+(c==='eth2'?' style="flex:0 0 auto"':'')+'>'+LBL[c]+'</span>').join('')+'</div>';
    });
    $('enc').innerHTML=h;$('encTxt').innerHTML=S[k].t;
    $('encUp').disabled=k===0;$('encDown').disabled=k===S.length-1;
  }
  $('encDown').addEventListener('click',()=>{if(k<S.length-1){k++;draw();}});
  $('encUp').addEventListener('click',()=>{if(k>0){k--;draw();}});
  draw();
})();

// ---------- Verlust ----------
(function(){
  const $=id=>document.getElementById(id);
  let proto='tcp';
  const bs=[...document.querySelectorAll('#proto button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');proto=b.dataset.p;run();}));
  $('loss').addEventListener('input',()=>{$('lossO').textContent=$('loss').value+' %';});
  $('lossO').textContent=$('loss').value+' %';
  function run(){
    const N=8,p=+$('loss').value/100;
    // Erster Versuch: jedes Paket mit Verzögerung, manche verloren
    const first=[];for(let i=1;i<=N;i++){const lost=Math.random()<p;first.push({n:i,t:i*10+Math.random()*28,lost});}
    $('lSent').innerHTML=[...Array(N)].map((_,i)=>'<span class="ch" style="animation-delay:'+(i*40)+'ms">'+(i+1)+'</span>').join('');
    const arrived=first.filter(x=>!x.lost).sort((a,b)=>a.t-b.t);
    const lostN=first.filter(x=>x.lost).map(x=>x.n);
    let net=first.slice().sort((a,b)=>a.t-b.t).map(x=>({n:x.n,c:x.lost?'lost':''}));
    let app=[],note;
    if(proto==='udp'){
      app=arrived.map(x=>({n:x.n,c:''}));
      const ooo=arrived.some((x,i)=>i>0&&x.n<arrived[i-1].n);
      note='UDP reicht weiter, was ankommt, so wie es ankommt. '+(lostN.length?'Pakete '+lostN.join(', ')+' fehlen einfach – niemand merkt es außer der Anwendung. ':'Diesmal ist nichts verloren gegangen. ')+(ooo?'Und die Reihenfolge stimmt nicht.':'');
      if(!lostN.length&&!ooo) note='UDP reicht weiter, was ankommt, so wie es ankommt. Diesmal ging alles gut – reiner Zufall. Klick noch einmal.';
    }else{
      // Neuübertragung: verlorene nach Timeout erneut (hier: immer erfolgreich beim zweiten Versuch)
      lostN.forEach(n=>net.push({n,c:'re'}));
      // Zustellung an Anwendung: in Reihenfolge, erst wenn Lücke geschlossen
      app=[...Array(N)].map((_,i)=>({n:i+1,c:'ok'}));
      const ooo=arrived.some((x,i)=>i>0&&x.n<arrived[i-1].n);
      net.push({n:'ACK 9',c:'ack'});
      note=(lostN.length?'Pakete '+lostN.join(', ')+' gingen verloren. Der Empfänger bestätigte nur bis zur Lücke, beim Absender lief der Timer ab, und er schickte sie erneut (orange). ':'Kein Paket verloren. ')+(ooo?'Was zu früh kam, wartete im Puffer. ':'')+'Die Anwendung bekommt alles lückenlos und in Reihenfolge – sie merkt höchstens, dass es länger gedauert hat.';
    }
    $('lNet').innerHTML=net.map((x,i)=>'<span class="ch '+x.c+'" style="animation-delay:'+(300+i*90)+'ms">'+x.n+'</span>').join('');
    let ah='';
    if(proto==='udp'){
      // Lücken markieren, wo etwas fehlt (in Ankunftsreihenfolge nicht sinnvoll – zeige empfangene + Hinweis)
      ah=app.map((x,i)=>'<span class="ch" style="animation-delay:'+(400+i*90)+'ms">'+x.n+'</span>').join('')+lostN.map((n,i)=>'<span class="ch gap" style="animation-delay:'+(400+(app.length+i)*90)+'ms">'+n+'?</span>').join('');
    }else ah=app.map((x,i)=>'<span class="ch ok" style="animation-delay:'+(400+net.length*90+i*60)+'ms">'+x.n+'</span>').join('');
    $('lApp').innerHTML=ah;$('lossNote').innerHTML=note;
  }
  $('send').addEventListener('click',run);run();
})();

// ---------- Handshake ----------
(function(){
  const $=id=>document.getElementById(id);
  let mode='tls13';
  const MODES={
    tls12:[['SYN','c'],['SYN-ACK','s'],['ACK + ClientHello','c'],['ServerHello, Zertifikat','s'],['Schlüssel, Finished','c'],['Finished','s'],['GET /','c'],['Antwort','s']],
    tls13:[['SYN','c'],['SYN-ACK','s'],['ACK + ClientHello mit Schlüssel','c'],['ServerHello, Zertifikat, Finished','s'],['Finished + GET /','c'],['Antwort','s']],
    quic:[['Initial: Verbindung + Schlüssel','c'],['Antwort: Zertifikat, Finished','s'],['Finished + GET /','c'],['Antwort','s']]
  };
  function draw(){
    const rtt=+$('rtt').value;$('rttO').textContent=rtt+' ms';
    const M=MODES[mode],rtts=M.length/2;
    const xc=70,xs=490,top=34,h=(300-top-16)/M.length;
    let s='<defs><marker id="hsA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker><marker id="hsB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ok)"/></marker></defs>';
    s+='<text class="tx" x="'+xc+'" y="16" text-anchor="middle">Browser</text><text class="tx" x="'+xs+'" y="16" text-anchor="middle">Server</text>';
    s+='<line x1="'+xc+'" y1="24" x2="'+xc+'" y2="292" stroke="var(--line)" stroke-width="2"/><line x1="'+xs+'" y1="24" x2="'+xs+'" y2="292" stroke="var(--line)" stroke-width="2"/>';
    M.forEach((m,i)=>{const y0=top+i*h,y1=y0+h*0.85;const fromC=m[1]==='c';const last=i===M.length-1;
      const col=last?'var(--ok)':'var(--accent)';
      s+='<line class="ar" x1="'+(fromC?xc:xs)+'" y1="'+y0+'" x2="'+(fromC?xs:xc)+'" y2="'+y1+'" stroke="'+col+'" marker-end="url(#'+(last?'hsB':'hsA')+')"/>';
      s+='<text class="sm" x="280" y="'+((y0+y1)/2-4)+'" text-anchor="middle">'+m[0]+'</text>';
      if(i%2===1)s+='<text class="sm" x="'+(xc-8)+'" y="'+(y1+3)+'" text-anchor="end">'+((i+1)/2*rtt)+' ms</text>';
    });
    $('hs').innerHTML=s;
    const req=M.findIndex(m=>m[0].includes('GET'));const before=req/2;
    $('hsOut').innerHTML='<div><b>'+before+' RTT</b>Rundreisen vor der Anfrage</div><div><b>'+(rtts*rtt).toLocaleString('de-DE')+' ms</b>bis die Antwort da ist</div><div><b>'+(rtts*rtt*10).toLocaleString('de-DE')+' ms</b>für 10 Seiten mit je neuer Verbindung</div>';
  }
  const bs=[...document.querySelectorAll('#hsMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');mode=b.dataset.m;draw();}));
  $('rtt').addEventListener('input',draw);draw();
})();
