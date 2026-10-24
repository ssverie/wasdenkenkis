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


// ---------- Hash-Kette ----------
(function(){
  const $=id=>document.getElementById(id);
  const MSG0=['Projekt angelegt','Kundenklasse','Rabatt eingeführt','Tests ergänzt'];
  let msgs=MSG0.slice(),orig=null;
  function hashes(){const h=[];let parent='';msgs.forEach((m,i)=>{const s='tree '+i+'\nparent '+parent+'\nauthor Sven\n\n'+m;parent=hex(sha256(enc.encode(s))).slice(0,7);h.push(parent);});return h;}
  function draw(){const h=hashes();if(!orig)orig=h.slice();
    $('chain').innerHTML=msgs.map((m,i)=>(i?'<span class="arw">→</span>':'')+'<div class="cmt'+(h[i]!==orig[i]?' chg':'')+'"><div class="h">'+h[i]+'</div><input data-i="'+i+'" value="'+m.replace(/"/g,'&quot;')+'" aria-label="Nachricht von Commit '+(i+1)+'"><div class="p">Vorgänger: '+(i?h[i-1]:'–')+'</div></div>').join('');
    document.querySelectorAll('#chain input').forEach(x=>x.addEventListener('input',e=>{msgs[+x.dataset.i]=x.value;const i=+x.dataset.i;
      const h2=hashes();document.querySelectorAll('#chain .cmt').forEach((c,j)=>{c.classList.toggle('chg',h2[j]!==orig[j]);c.querySelector('.h').textContent=h2[j];c.querySelector('.p').textContent='Vorgänger: '+(j?h2[j-1]:'–');});
      const n=h2.filter((x,j)=>x!==orig[j]).length;
      $('chN').innerHTML=n?'<b>'+n+' Commit'+(n>1?'s haben':' hat')+' jetzt einen anderen Hash</b> – der geänderte und alle, die nach ihm kommen. Für Git sind das neue, andere Commits. Genau das passiert bei <code>git commit --amend</code> und <code>git rebase</code>.':'Alles wie vorher – gleicher Inhalt, gleicher Hash.';}));
  }
  draw();
})();

// ---------- Commit-Graph ----------
(function(){
  const $=id=>document.getElementById(id);
  const MSGS=['Login-Seite','Rabatt-Logik','Tests','Logging','Bugfix','Doku','Refactoring','Preisformat','Validierung','Cache'];
  let C,br,head,mi,ctr;
  const fnv=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return ('0000000'+h.toString(16)).slice(-7);};
  function mk(msg,parents,lane){ctr++;const c={id:fnv(msg+parents.join()+ctr),msg,parents,lane};C.push(c);return c.id;}
  function reset(){C=[];br={};mi=0;ctr=0;br.main=mk('Erster Commit',[],0);head='main';draw('Ein Repository mit einem Commit. Der Zettel <b>main</b> zeigt darauf, und HEAD zeigt auf main.');}
  const get=id=>C.find(c=>c.id===id);
  function anc(id){const s=new Set(),q=[id];while(q.length){const x=q.pop();if(!x||s.has(x))continue;s.add(x);get(x).parents.forEach(p=>q.push(p));}return s;}
  function draw(msg){
    const live=new Set();Object.values(br).forEach(id=>anc(id).forEach(x=>live.add(x)));
    const W=Math.max(640,40+C.length*56),X=i=>30+i*56,Y=l=>l===0?60:120;
    $('gg').setAttribute('viewBox','0 0 '+W+' 192');$('gg').style.minWidth=Math.min(W,900)+'px';
    const pos={};C.forEach((c,i)=>pos[c.id]=[X(i),Y(c.lane)]);
    let s='';
    C.forEach(c=>c.parents.forEach(p=>{const a=pos[p],b=pos[c.id];const d=!live.has(c.id);
      s+='<path class="ed'+(d?' dang':'')+'" d="M'+a[0]+' '+a[1]+' C'+(a[0]+28)+' '+a[1]+' '+(b[0]-28)+' '+b[1]+' '+b[0]+' '+b[1]+'"/>';}));
    C.forEach(c=>{const [x,y]=pos[c.id],d=!live.has(c.id),col=c.lane===0?'var(--accent)':'var(--accent-2)';
      s+='<circle class="c'+(d?' dang':'')+'" cx="'+x+'" cy="'+y+'" r="11" fill="var(--card)" stroke="'+col+'"/>';
      s+='<text class="hs" x="'+x+'" y="'+(y+(c.lane===0?-17:26))+'" text-anchor="middle"'+(d?' opacity=".35"':'')+'>'+c.id+'</text>';
      if(c.parents.length>1)s+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+col+'"/>';});
    // Zettel
    const tags={};Object.entries(br).forEach(([b,id])=>{(tags[id]=tags[id]||[]).push(b);});
    Object.entries(tags).forEach(([id,bs])=>{const [x,y]=pos[id];bs.forEach((b,k)=>{const label=(b===head?'HEAD → ':'')+b;const col=b==='main'?'var(--accent)':'var(--accent-2)';
      const ty=y<90?y-32-k*15:y+40+k*15;s+='<text class="br" x="'+x+'" y="'+ty+'" text-anchor="middle" fill="'+col+'">'+label+'</text>';});});
    $('gg').innerHTML=s;$('gN').innerHTML=msg;
    $('gB').disabled=!!br.feature;$('gSf').disabled=!br.feature||head==='feature';$('gSm').disabled=head==='main';
    $('gM').disabled=!br.feature;$('gM').textContent='git merge '+(head==='main'?'feature':'main');
    $('gR').disabled=!br.feature||head!=='feature';
  }
  $('gC').addEventListener('click',()=>{const m=MSGS[mi++%MSGS.length];br[head]=mk(m,[br[head]],head==='main'?0:1);
    draw('Neuer Commit „'+m+'“ auf <b>'+head+'</b>. Sein Vorgänger ist der bisherige Commit, und der Zettel '+head+' rückt einen Schritt weiter. Der andere Zettel bleibt, wo er ist.');});
  $('gB').addEventListener('click',()=>{br.feature=br[head];head='feature';draw('<code>git switch -c feature</code>: Ein neuer Zettel <b>feature</b> zeigt auf denselben Commit wie main. Nichts wurde kopiert. HEAD zeigt jetzt auf feature – neue Commits landen dort.');});
  $('gSm').addEventListener('click',()=>{head='main';draw('HEAD zeigt jetzt auf <b>main</b>. Git tauscht die Dateien im Arbeitsverzeichnis gegen den Stand dieses Commits.');});
  $('gSf').addEventListener('click',()=>{head='feature';draw('HEAD zeigt jetzt auf <b>feature</b>.');});
  $('gM').addEventListener('click',()=>{const other=head==='main'?'feature':'main',a=br[head],b=br[other];
    if(anc(a).has(b)){draw('Nichts zu tun: '+other+' ist schon vollständig in '+head+' enthalten.');return;}
    if(anc(b).has(a)){br[head]=b;draw('<b>Fast-Forward:</b> '+head+' lag direkt auf dem Weg von '+other+'. Git schiebt den Zettel einfach nach vorn – kein neuer Commit nötig.');return;}
    br[head]=mk('Merge '+other,[a,b],head==='main'?0:1);
    draw('<b>Merge-Commit</b> mit zwei Eltern (gefüllter Punkt). Beide Linien bleiben, wie sie waren – die Geschichte zeigt, dass parallel gearbeitet wurde.');});
  $('gR').addEventListener('click',()=>{const base=anc(br.main),own=[];let x=br.feature;
    while(x&&!base.has(x)){own.unshift(get(x));x=get(x).parents[0];}
    if(!own.length){draw('Nichts zu rebasen – feature hat keine eigenen Commits.');return;}
    if(own[0].parents[0]===br.main){draw('feature basiert schon auf dem neuesten main – nichts zu tun.');return;}
    let p=br.main;own.forEach(c=>{p=mk(c.msg,[p],1);});br.feature=p;
    draw('<b>Rebase:</b> '+own.length+' Commit'+(own.length>1?'s wurden':' wurde')+' auf die Spitze von main <em>kopiert</em> – gleicher Inhalt, aber neue Hashes, weil der Vorgänger ein anderer ist. Die alten (blass) hängen an keinem Zettel mehr; nur der Reflog kennt sie noch. Jetzt wäre ein Merge in main ein Fast-Forward: eine gerade Linie.');});
  $('gX').addEventListener('click',reset);
  reset();
})();
