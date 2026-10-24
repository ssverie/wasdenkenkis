const sha256=(function(){
  const K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  const r=(x,n)=>(x>>>n)|(x<<(32-n));
  return function(bytes){
    const l=bytes.length,bl=((l+9+63)>>6)<<6,m=new Uint8Array(bl);m.set(bytes);m[l]=0x80;
    const dv=new DataView(m.buffer);dv.setUint32(bl-4,(l*8)>>>0);dv.setUint32(bl-8,Math.floor(l/0x20000000));
    const H=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]),W=new Uint32Array(64);
    for(let o=0;o<bl;o+=64){
      for(let i=0;i<16;i++)W[i]=dv.getUint32(o+i*4);
      for(let i=16;i<64;i++){const s0=r(W[i-15],7)^r(W[i-15],18)^(W[i-15]>>>3),s1=r(W[i-2],17)^r(W[i-2],19)^(W[i-2]>>>10);W[i]=(W[i-16]+s0+W[i-7]+s1)>>>0;}
      let [a,b,c,d,e,f,g,h]=H;
      for(let i=0;i<64;i++){const S1=r(e,6)^r(e,11)^r(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+W[i])>>>0,S0=r(a,2)^r(a,13)^r(a,22),mj=(a&b)^(a&c)^(b&c),t2=(S0+mj)>>>0;
        h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
      H[0]+=a;H[1]+=b;H[2]+=c;H[3]+=d;H[4]+=e;H[5]+=f;H[6]+=g;H[7]+=h;
    }
    const out=new Uint8Array(32);const ov=new DataView(out.buffer);H.forEach((v,i)=>ov.setUint32(i*4,v));return out;
  };
})();
const enc=new TextEncoder();
const hex=b=>[...b].map(x=>x.toString(16).padStart(2,'0')).join('');


// ---------- HMAC und Base64url ----------
function hmac(keyStr,msgStr){
  let k=enc.encode(keyStr);if(k.length>64)k=sha256(k);
  const kp=new Uint8Array(64);kp.set(k);
  const ip=kp.map(b=>b^0x36),op=kp.map(b=>b^0x5c),m=enc.encode(msgStr);
  const inner=new Uint8Array(64+m.length);inner.set(ip);inner.set(m,64);
  const ih=sha256(inner),outer=new Uint8Array(96);outer.set(op);outer.set(ih,64);
  return sha256(outer);
}
const b64u=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64uStr=s=>b64u(enc.encode(s));

// ---------- Passwort-Datenbank ----------
(function(){
  const $=id=>document.getElementById(id);
  const U=[['anna','sommer2026'],['ben','sommer2026'],['clara','Zx#9qL!m2Rt$']];
  const RATE={plain:Infinity,sha:2e10,salt:2e10,bcrypt:1.5e3,argon:5e2};
  const SPACE={dict:{n:2e8,t:'ein Wörterbuchwort mit Jahreszahl'},l6:{n:Math.pow(26,6),t:'26⁶'},m8:{n:Math.pow(94,8),t:'94⁸'},w4:{n:Math.pow(7776,4),t:'7776⁴ (Würfel-Wortliste)'},m12:{n:Math.pow(94,12),t:'94¹²'}};
  const NAME={plain:'Klartext',sha:'SHA-256',salt:'SHA-256 mit Salt',bcrypt:'bcrypt (Kosten 12)',argon:'Argon2id (64 MB)'};
  let m='bcrypt';
  const salts={anna:'k3Lp9Q',ben:'x7Vb2W',clara:'Rr0aYe'};
  function stored(u,p){
    if(m==='plain')return p;
    if(m==='sha')return hex(sha256(enc.encode(p)));
    if(m==='salt')return salts[u]+'$'+hex(sha256(enc.encode(salts[u]+p))).slice(0,40)+'…';
    if(m==='bcrypt')return '$2a$12$'+b64u(sha256(enc.encode(salts[u]+'b'))).slice(0,22)+b64u(sha256(enc.encode(salts[u]+p))).slice(0,20)+'…';
    return '$argon2id$v=19$m=65536,t=3,p=1$'+b64u(sha256(enc.encode(salts[u]+'a'))).slice(0,16)+'$'+b64u(sha256(enc.encode(salts[u]+p+'a'))).slice(0,20)+'…';
  }
  const dur=s=>{if(!isFinite(s))return 'sofort';if(s<1)return 'unter 1 Sekunde';
    const y=s/31557600;if(y>1.4e10)return 'länger, als das Universum alt ist';
    if(y>=1e6){const [a,b]=y.toExponential(0).split('e+');return a+' · 10<sup>'+b+'</sup> Jahre';}
    const u=[[31557600,'Jahre'],[86400,'Tage'],[3600,'Stunden'],[60,'Minuten'],[1,'Sekunden']];
    for(const [d,n] of u)if(s>=d){const v=s/d;return (v<10?v.toFixed(1).replace('.',','):Math.round(v).toLocaleString('de-DE'))+' '+n;}};
  function draw(){
    const rows=U.map(([u,p])=>[u,stored(u,p)]);
    const same=m==='plain'||m==='sha';
    $('pwT').innerHTML='<tr><th>Nutzer</th><th>gespeichert</th></tr>'+rows.map((r,i)=>'<tr class="'+(same&&i<2?'same':'')+'"><td>'+r[0]+'</td><td><code>'+r[1]+'</code></td></tr>').join('');
    const sp=SPACE[$('pwKind').value],rate=RATE[m];const sci=x=>{const [a,b]=x.toExponential(1).split('e+');return a.replace('.',',')+' · 10<sup>'+b+'</sup>';};
    const t=m==='plain'?0:sp.n/2/rate;
    $('pwC').innerHTML='<div><b>'+(m==='plain'?'–':sci(rate))+'</b>Versuche pro Sekunde</div><div><b>'+sci(sp.n)+'</b>mögliche Passwörter ('+sp.t+')</div><div class="'+(t<86400*30?'bad':'good')+'"><b>'+(m==='plain'?'sofort':dur(t))+'</b>bis so ein Passwort gefunden ist</div>';
    let n;
    if(m==='plain')n='<b>Katastrophe.</b> Jeder, der die Tabelle sieht – Angreifer, Admin, Backup-Dienstleister –, kennt alle Passwörter. Und weil Menschen Passwörter wiederverwenden, auch die für andere Dienste.';
    else if(m==='sha')n='<b>Fast genauso schlimm.</b> Anna und Ben haben denselben Hash – man sieht sofort, dass sie dasselbe Passwort benutzen. Für häufige Passwörter gibt es fertige Tabellen mit vorberechneten Hashes, und Grafikkarten probieren Milliarden pro Sekunde.';
    else if(m==='salt')n='<b>Besser:</b> Durch das Salt haben Anna und Ben verschiedene Einträge, vorberechnete Tabellen sind nutzlos. Aber SHA-256 ist immer noch zu schnell – ein schwaches Passwort fällt trotzdem in Sekunden.';
    else n='<b>So soll es sein.</b> Salt ist eingebaut und steht im gespeicherten Wert gleich mit drin, zusammen mit dem Verfahren und dem Aufwand. Jeder Versuch kostet den Angreifer rund zehn Millionen Mal mehr als bei SHA-256. '+($('pwKind').value==='dict'?'Ein Wörterbuch-Passwort hält aber auch das nicht lange aus.':'');
    $('pwN').innerHTML=n;
  }
  const bs=[...document.querySelectorAll('#pwM button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;draw();}));
  $('pwKind').addEventListener('change',draw);draw();
})();

// ---------- JWT ----------
(function(){
  const $=id=>document.getElementById(id);
  const SECRET='server-geheimnis';
  function draw(){
    const admin=$('jAdmin').checked,resign=$('jResign').checked,expd=$('jExp').checked;
    $('jResign').disabled=!admin;if(!admin)$('jResign').checked=false;
    const header={alg:'HS256',typ:'JWT'};
    const now=1793000000;
    const orig={sub:'kunde-4711',name:'Anna',rolle:'kunde',iat:now,exp:expd?now-60:now+900};
    const shown=Object.assign({},orig,admin?{rolle:'admin'}:{});
    const h=b64uStr(JSON.stringify(header)),pOrig=b64uStr(JSON.stringify(orig)),pShown=b64uStr(JSON.stringify(shown));
    const sigOrig=b64u(hmac(SECRET,h+'.'+pOrig));
    const sigShown=admin&&$('jResign').checked?b64u(hmac('geheim123',h+'.'+pShown)):sigOrig;
    $('jwt').innerHTML='<span class="h">'+h+'</span>.<span class="p">'+pShown+'</span>.<span class="s">'+sigShown+'</span>';
    $('jh').innerHTML='<span class="c">// Kopf</span>\n'+JSON.stringify(header,null,2);
    $('jp').innerHTML='<span class="c">// Inhalt – für jeden lesbar</span>\n'+JSON.stringify(shown,null,2).replace('"admin"','<span class="s">"admin"</span>');
    const valid=b64u(hmac(SECRET,h+'.'+pShown))===sigShown;
    const r=$('jRes');
    if(!valid){r.className='jres no';r.innerHTML='<b>✗ Abgelehnt: Signatur ungültig.</b> Der Server berechnet die Signatur über Kopf und Inhalt mit seinem Geheimnis neu – sie passt nicht zur mitgeschickten. '+($('jResign').checked?'Neu signieren hilft nicht: Ohne das echte Geheimnis entsteht eine falsche Signatur.':'Jede Änderung am Inhalt fällt auf.');}
    else if(expd){r.className='jres no';r.innerHTML='<b>✗ Abgelehnt: abgelaufen.</b> Signatur echt, aber <code>exp</code> liegt in der Vergangenheit. Der Client muss sich mit seinem Refresh-Token ein neues holen.';}
    else{r.className='jres ok';r.innerHTML='<b>✓ Gültig.</b> Signatur stimmt, nicht abgelaufen. Der Server weiß jetzt: Kunde 4711, Rolle Kunde – ohne eine Datenbank zu fragen.';}
  }
  ['jAdmin','jResign','jExp'].forEach(id=>$(id).addEventListener('change',draw));draw();
})();

// ---------- OAuth ----------
(function(){
  const $=id=>document.getElementById(id);
  const X={u:70,a:230,s:390,r:550};
  const A=[['u','Nutzer','im Browser'],['a','App','„Client“'],['s','Autorisierungs-','server (Login)'],['r','API','„Resource Server“']];
  const S=[
    {f:'u',t:'a',l:'„Anmelden“',x:'Anna klickt in der Shop-App auf „Anmelden mit …“.'},
    {f:'a',t:'s',l:'Weiterleitung',x:'Die App schickt Annas Browser zum Autorisierungsserver – mit ihrer <code>client_id</code>, den gewünschten Rechten (<code>scope=openid bestellungen.lesen</code>), der Rücksprungadresse und einer <code>code_challenge</code>: dem Hash eines Zufallswerts, den nur die App kennt. Das ist <b>PKCE</b>.'},
    {f:'u',t:'s',l:'Passwort / Passkey',x:'Anna meldet sich <b>beim Autorisierungsserver</b> an, nicht bei der App – mit Passwort, Passkey, zweitem Faktor. Dann bestätigt sie: „Shop-App darf meine Bestellungen lesen.“ <b>Die App sieht Annas Passwort nie.</b>'},
    {f:'s',t:'a',l:'code=…',x:'Der Server leitet den Browser zurück zur App, mit einem kurzlebigen <b>Autorisierungscode</b> in der URL. Der Code allein nützt einem Dieb wenig …'},
    {f:'a',t:'s',l:'code + verifier',x:'… denn die App tauscht ihn direkt beim Server ein und legt dabei den ursprünglichen Zufallswert vor, den <code>code_verifier</code>. Der Server prüft: Passt sein Hash zur Challenge von vorhin? Nur die App, die den Ablauf begonnen hat, kann das.'},
    {f:'s',t:'a',l:'Tokens',x:'Zurück kommen ein <b>Access-Token</b> (für die API, kurzlebig), ein <b>ID-Token</b> (OpenID Connect: „das ist Anna, Kunde 4711“) und meist ein <b>Refresh-Token</b>.'},
    {f:'a',t:'r',l:'Bearer …',x:'Die App ruft die API auf: <code>Authorization: Bearer eyJ…</code>. Die API prüft Signatur, Aussteller, Ablauf und Scope des Tokens – und liefert Annas Bestellungen. Mehr darf die App nicht, denn mehr steht nicht im Scope.'}
  ];
  let k=0;
  function draw(){
    let h='<defs><marker id="oaA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>';
    A.forEach(a=>{const on=S[k].f===a[0]||S[k].t===a[0];h+='<rect class="ac'+(on?' on':'')+'" x="'+(X[a[0]]-62)+'" y="6" width="124" height="44" rx="9"/><text class="t" x="'+X[a[0]]+'" y="25" text-anchor="middle">'+a[1]+'</text><text class="s" x="'+X[a[0]]+'" y="40" text-anchor="middle">'+a[2]+'</text><line class="ln" x1="'+X[a[0]]+'" y1="50" x2="'+X[a[0]]+'" y2="265"/>';});
    S.forEach((s,i)=>{if(i>k)return;const y=72+i*28,x1=X[s.f],x2=X[s.t],dir=x2>x1?1:-1;
      h+='<line class="ar" x1="'+(x1+dir*4)+'" y1="'+y+'" x2="'+(x2-dir*4)+'" y2="'+y+'" stroke="'+(i===k?'var(--accent)':'var(--muted)')+'" marker-end="url(#oaA)"'+(i===k?'':' opacity=".45"')+'/>';
      h+='<text class="al" x="'+((x1+x2)/2)+'" y="'+(y-5)+'" text-anchor="middle"'+(i===k?'':' opacity=".55"')+'>'+(i+1)+'. '+s.l+'</text>';});
    $('oa').innerHTML=h;$('oaTxt').innerHTML='<b>Schritt '+(k+1)+' von '+S.length+':</b> '+S[k].x;
    $('oaPrev').disabled=k===0;$('oaNext').textContent=k===S.length-1?'Von vorn ↺':'Weiter →';
  }
  $('oaNext').addEventListener('click',()=>{k=k===S.length-1?0:k+1;draw();});
  $('oaPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  draw();
})();
