// ---------- Auflösung ----------
(function(){
  const $=id=>document.getElementById(id);
  const N={br:[74,125,'Dein Rechner','Browser, Betriebssystem'],rs:[250,125,'Resolver','z. B. beim Anbieter'],root:[500,40,'Root-Server','„.“'],tld:[500,125,'.com-Server','Registry'],au:[500,210,'ns1.example.com','autoritativ']};
  const COLD=[
    {f:'br',t:'br',ms:0,x:'Der Browser schaut in seinen eigenen Cache, dann fragt er das Betriebssystem. Das schaut in seinen Cache und in die <code>hosts</code>-Datei. Nichts gefunden.'},
    {f:'br',t:'rs',ms:10,x:'Das Betriebssystem schickt die Frage an den Resolver: <code>www.example.com, Typ A?</code> Ab jetzt arbeitet der Resolver.'},
    {f:'rs',t:'root',ms:20,x:'Der Resolver fragt einen Root-Server. Der kennt <code>www.example.com</code> nicht – aber er weiß, wer für <code>.com</code> zuständig ist: <code>a.gtld-servers.net</code> und weitere.',back:true},
    {f:'rs',t:'tld',ms:25,x:'Der Resolver fragt den <code>.com</code>-Server. Der kennt die Adresse auch nicht, verweist aber weiter: Für <code>example.com</code> ist <code>ns1.example.com</code> zuständig, Adresse <code>192.0.2.53</code>.',back:true},
    {f:'rs',t:'au',ms:40,x:'Der Resolver fragt den autoritativen Server. Der weiß es: <code>www.example.com A 192.0.2.10</code>, TTL 3600 Sekunden.',back:true},
    {f:'rs',t:'br',ms:10,x:'Der Resolver gibt die Antwort zurück und legt sie – samt der Zwischenergebnisse – für bis zu eine Stunde in seinen Cache. Jetzt kann der Browser die <a href="/it-konzepte/tcp-ip/">TCP-Verbindung</a> zu <code>192.0.2.10</code> aufbauen.',done:true}
  ];
  const WARM=[
    {f:'br',t:'br',ms:0,x:'Browser- und Betriebssystem-Cache sind leer – du hast die Seite noch nie besucht.'},
    {f:'br',t:'rs',ms:10,x:'Die Frage geht an den Resolver. Aber jemand anderes, der denselben Resolver benutzt, hat vor zehn Minuten dasselbe gefragt …'},
    {f:'rs',t:'br',ms:10,x:'… also steht die Antwort im Cache des Resolvers, mit einer Rest-TTL von 50 Minuten. Er antwortet sofort, ohne einen einzigen weiteren Server zu fragen.',done:true}
  ];
  let mode='cold',k=0;
  function arrow(a,b,back){
    const A=N[a],B=N[b];if(a===b)return '';
    const dx=B[0]-A[0],dy=B[1]-A[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,off=9;
    const nx=-uy*off,ny=ux*off;
    const x1=A[0]+ux*62+nx,y1=A[1]+uy*24+ny,x2=B[0]-ux*62+nx,y2=B[1]-uy*24+ny;
    return '<line class="ar'+(back?' back':'')+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" marker-end="url(#'+(back?'rzB':'rzA')+')"/>';
  }
  function draw(){
    const S=mode==='cold'?COLD:WARM,s=S[k];
    let h='<defs><marker id="rzA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker><marker id="rzB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ok)"/></marker></defs>';
    if(s.back){h+=arrow(s.f,s.t,false)+arrow(s.t,s.f,true);}
    else if(s.done&&s.f==='rs'){h+=arrow('rs','br',true);}
    else h+=arrow(s.f,s.t,false);
    Object.entries(N).forEach(([key,n])=>{const on=key===s.f||key===s.t;
      h+='<rect class="nd'+(on?' on':'')+'" x="'+(n[0]-62)+'" y="'+(n[1]-24)+'" width="124" height="48" rx="10"/><text class="t" x="'+n[0]+'" y="'+(n[1]-2)+'" text-anchor="middle">'+n[2]+'</text><text class="s" x="'+n[0]+'" y="'+(n[1]+13)+'" text-anchor="middle">'+n[3]+'</text>';});
    $('rz').innerHTML=h;$('rzTxt').innerHTML='<b>Schritt '+(k+1)+' von '+S.length+'.</b> '+s.x;
    let ms=0,q=0;for(let i=0;i<=k;i++){ms+=S[i].back?S[i].ms*2:S[i].ms*(i===0?0:1);if(S[i].f==='rs'&&S[i].back)q++;}
    // Rundreise Browser-Resolver zählt hin und zurück
    const total=S.reduce((a,x,i)=>a+(x.back?x.ms*2:(i===0?0:x.ms)),0);
    $('rzStat').innerHTML='Zeit bisher: <b>'+ms+' ms</b><span>Fragen an Nameserver: <b>'+q+'</b></span>'+(k===S.length-1?'<span>Gesamt: <b>'+total+' ms</b></span>':'');
    $('rzPrev').disabled=k===0;$('rzNext').textContent=k===S.length-1?'Von vorn ↺':'Weiter →';
  }
  $('rzNext').addEventListener('click',()=>{const S=mode==='cold'?COLD:WARM;k=k===S.length-1?0:k+1;draw();});
  $('rzPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  const bs=[...document.querySelectorAll('#rzMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');mode=b.dataset.m;k=0;draw();}));
  draw();
})();

// ---------- dig ----------
(function(){
  const $=id=>document.getElementById(id);
  const D={
    A:['www.example.com','www.example.com.    3600  IN  A      <span class="v">192.0.2.10</span>','<b>A</b> – die IPv4-Adresse. Der häufigste Eintrag überhaupt.'],
    AAAA:['www.example.com','www.example.com.    3600  IN  AAAA   <span class="v">2001:db8::10</span>','<b>AAAA</b> – die IPv6-Adresse. Hat ein Name beides, versuchen moderne Clients meist zuerst IPv6.'],
    CNAME:['shop.example.com','shop.example.com.   300   IN  CNAME  <span class="v">example.shopanbieter.net.</span>\nexample.shopanbieter.net. 60 IN A <span class="v">198.51.100.7</span>','<b>CNAME</b> – ein Alias: „Frag stattdessen nach diesem Namen.“ So zeigen Domains auf Dienste von Drittanbietern, deren Adressen sich ändern dürfen. Ein CNAME darf nicht neben anderen Einträgen desselben Namens stehen – deshalb geht er nicht für <code>example.com</code> selbst.'],
    MX:['example.com','example.com.        3600  IN  MX     <span class="v">10 mail1.example.com.</span>\nexample.com.        3600  IN  MX     <span class="v">20 mail2.example.com.</span>','<b>MX</b> – wohin E-Mails für <code>@example.com</code> gehen. Die Zahl ist die Priorität: kleinere zuerst, die zweite ist die Ausweichstelle.'],
    TXT:['example.com','example.com.        3600  IN  TXT    <span class="v">"v=spf1 include:_spf.mailanbieter.net -all"</span>\nexample.com.        3600  IN  TXT    <span class="v">"site-verification=abc123"</span>','<b>TXT</b> – freier Text. Praktisch genutzt für E-Mail-Sicherheit (SPF, DKIM, DMARC) und als Nachweis, dass man eine Domain kontrolliert – etwa für Zertifikate oder Cloud-Dienste.'],
    NS:['example.com','example.com.        86400 IN  NS     <span class="v">ns1.example.com.</span>\nexample.com.        86400 IN  NS     <span class="v">ns2.example.net.</span>','<b>NS</b> – welche Server für die Domain zuständig sind. Immer mindestens zwei, möglichst in verschiedenen Netzen. Diese Einträge stehen auch eine Ebene höher beim TLD-Server – das ist die Delegation.'],
    PTR:['-x 192.0.2.10','10.2.0.192.in-addr.arpa. 3600 IN PTR <span class="v">www.example.com.</span>','<b>PTR</b> – die Rückwärtssuche: von der Adresse zum Namen. Die Adresse wird dafür umgedreht und unter <code>in-addr.arpa</code> nachgeschlagen. Mailserver prüfen das gern, um Spam zu erkennen.']
  };
  let t='A';
  function draw(){const d=D[t];
    $('digOut').innerHTML='<span class="p">$</span> dig '+d[0]+' '+(t==='PTR'?'':t+' ')+'+noall +answer\n'+d[1];
    $('digTxt').innerHTML=d[2];}
  const bs=[...document.querySelectorAll('#digT button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');t=b.dataset.t;draw();}));
  draw();
})();

// ---------- TTL ----------
(function(){
  const $=id=>document.getElementById(id);
  let ttl=3600;
  const fmt=s=>s<3600?Math.round(s/60)+' min':s<86400?Math.round(s/3600)+' h':Math.round(s/86400)+' Tag'+(s>=172800?'e':'');
  function draw(){
    const W=600,H=200,l=54,r=16,t=14,b=30,span=Math.max(ttl*1.5,600),pw=W-l-r,ph=H-t-b;
    const X=s=>l+pw*(s+span*0.15)/(span*1.15),Y=f=>t+ph*(1-f);
    let s='<line class="ax" x1="'+l+'" y1="'+Y(0)+'" x2="'+(W-r)+'" y2="'+Y(0)+'"/><line class="ax" x1="'+l+'" y1="'+t+'" x2="'+l+'" y2="'+Y(0)+'"/>';
    [0,0.5,1].forEach(f=>s+='<text class="lb" x="'+(l-6)+'" y="'+(Y(f)+3)+'" text-anchor="end">'+(f*100)+' %</text>');
    s+='<line x1="'+X(0)+'" y1="'+t+'" x2="'+X(0)+'" y2="'+Y(0)+'" stroke="var(--accent-2)" stroke-dasharray="4 4"/><text class="lb" x="'+(X(0)+4)+'" y="'+(t+10)+'">Adresse geändert</text>';
    [0,ttl/2,ttl,span].forEach(v=>{if(v<=span)s+='<text class="lb" x="'+X(v)+'" y="'+(H-10)+'" text-anchor="'+(v===span?'end':'middle')+'">'+(v===0?'0':'+'+fmt(v))+'</text>';});
    // vorher 100 %, dann linear bis TTL auf 0
    const pts=[[ -span*0.15,1],[0,1],[ttl,0],[span,0]].map(p=>X(p[0])+','+Y(p[1])).join(' ');
    s+='<polyline class="ln" points="'+pts+'" stroke="var(--bad)"/>';
    s+='<text class="lb" x="'+(W-r)+'" y="'+(Y(0)-8)+'" text-anchor="end">alle auf der neuen Adresse</text>';
    $('ttlc').innerHTML=s;
    $('ttlNote').innerHTML='Y-Achse: Anteil der Nutzer, die noch die <b>alte</b> Adresse bekommen. Jeder Resolver hat die Antwort zu einem anderen Zeitpunkt geholt, also läuft sein Cache zu einem anderen Zeitpunkt ab. Nach <b>'+fmt(ttl)+'</b> sind spätestens alle umgestellt'+(ttl>=86400?' – einen ganzen Tag lang landen manche Nutzer noch auf dem alten Server. Der muss so lange weiterlaufen.':ttl<=300?' – fast sofort. Der Preis: Resolver müssen alle fünf Minuten neu fragen.':'.')+' Manche Resolver halten sich nicht genau an die TTL; den alten Server lässt man deshalb sicherheitshalber etwas länger laufen.';
  }
  const bs=[...document.querySelectorAll('#ttlSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');ttl=+b.dataset.v;draw();}));
  draw();
})();
