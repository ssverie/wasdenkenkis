// ---------- SHA-256 (kompakte, eigenständige Implementierung) ----------
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

// ---------- Hash-Widget ----------
(function(){
  const $=id=>document.getElementById(id);
  function draw(){
    const a=sha256(enc.encode($('h1').value)),b=sha256(enc.encode($('h2').value));
    const ha=hex(a),hb=hex(b);
    $('o1').textContent=ha;
    $('o2').innerHTML=[...hb].map((ch,i)=>ch!==ha[i]?'<span class="d">'+ch+'</span>':ch).join('');
    let diff=0;
    for(let i=0;i<32;i++){let x=a[i]^b[i];while(x){diff+=x&1;x>>=1;}}
    // Balken: 64 Felder à 4 Bit – markiert, wenn mindestens ein Bit im Feld abweicht
    let bb='';for(let k=0;k<64;k++){const byte=a[k>>1]^b[k>>1],nib=(k&1)?byte&15:byte>>4;bb+='<i class="'+(nib?'d':'')+'"></i>';}
    $('bits').innerHTML=bb;
    $('hNote').innerHTML=ha===hb?'Gleiche Eingabe, gleicher Hash – immer, auf jedem Rechner der Welt.':'<b>'+diff+' von 256 Bits</b> sind verschieden ('+Math.round(diff/2.56)+' %). Die Eingaben unterscheiden sich kaum, die Hashes haben nichts miteinander zu tun. Genau das macht Fälschungen unmöglich: Man kann nicht „ein bisschen“ ändern und den Hash passend nachjustieren.';
  }
  $('h1').addEventListener('input',draw);$('h2').addEventListener('input',draw);draw();
})();

// ---------- ECB vs. GCM ----------
(function(){
  // 24×24 Pixel: ein Schlüssel-Symbol, in 2×2-Blöcken gezeichnet (12×12 Blöcke)
  const art=[
    '............',
    '..XXXX......',
    '.XXXXXX.....',
    'XXX..XXX....',
    'XX....XX....',
    'XXX..XXXXXXX',
    '.XXXXXXXXXXX',
    '..XXXX...X.X',
    '.........X.X',
    '............',
    '............',
    '............'];
  const pal={X:[47,91,211],'.':[251,250,247]};
  function paint(id,fn){const cv=document.getElementById(id),ctx=cv.getContext('2d');const im=ctx.createImageData(24,24);
    for(let by=0;by<12;by++)for(let bx=0;bx<12;bx++){const c=fn(art[by][bx],bx,by);
      for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const p=((by*2+dy)*24+bx*2+dx)*4;
        const cc=Array.isArray(c[0])?c[dy*2+dx]:c;im.data[p]=cc[0];im.data[p+1]=cc[1];im.data[p+2]=cc[2];im.data[p+3]=255;}}
    ctx.putImageData(im,0,0);}
  const fromHash=h=>[[h[0],h[1],h[2]],[h[3],h[4],h[5]],[h[6],h[7],h[8]],[h[9],h[10],h[11]]];
  paint('cvPlain',ch=>pal[ch]);
  paint('cvEcb',ch=>fromHash(sha256(enc.encode('schluessel|'+ch))));
  paint('cvCtr',(ch,x,y)=>fromHash(sha256(enc.encode('schluessel|'+ch+'|'+(y*12+x)))));
})();

// ---------- RSA ----------
(function(){
  const $=id=>document.getElementById(id);
  const n=3233n,e=17n,d=2753n;
  const pw=(b,x,m)=>{let r=1n;b%=m;while(x>0n){if(x&1n)r=r*b%m;b=b*b%m;x>>=1n;}return r;};
  let mode='enc';
  function draw(){
    let m=BigInt(Math.max(0,Math.min(3232,Math.round(+$('rsaM').value||0))));
    $('tamperL').hidden=mode!=='sig';
    if(mode==='enc'){
      const c=pw(m,e,n),back=pw(c,d,n);
      $('rsaRow').innerHTML='<div>Klartext<b>'+m+'</b>von Anna</div><div>Geheimtext<b>'+c+'</b><code>'+m+'¹⁷ mod 3233</code><br>mit Bobs <em>öffentlichem</em> Schlüssel</div><div class="ok">Entschlüsselt<b>'+back+'</b><code>'+c+'²⁷⁵³ mod 3233</code><br>mit Bobs <em>privatem</em> Schlüssel</div>';
      $('rsaNote').innerHTML='Jeder kann Bob eine verschlüsselte Nachricht schicken – der öffentliche Schlüssel liegt offen. Aber nur Bob kann sie lesen. Dass die Rechnung zurückführt, liegt an einem Satz von Euler: <code>(mᵉ)ᵈ mod n = m</code>, weil <code>e·d</code> passend zu den Primfaktoren gewählt ist. Wer p und q kennt, kann d ausrechnen – deshalb darf n nicht zerlegbar sein.';
    }else{
      const s=pw(m,d,n),recv=$('tamper').checked?(m+1n)%n:m,chk=pw(s,e,n),ok=chk===recv;
      $('rsaRow').innerHTML='<div>Nachricht<b>'+m+'</b>von Bob</div><div>Signatur<b>'+s+'</b><code>'+m+'²⁷⁵³ mod 3233</code><br>mit Bobs <em>privatem</em> Schlüssel</div><div class="'+(ok?'ok':'bad')+'">Prüfung<b>'+chk+(ok?' = ':' ≠ ')+recv+'</b><code>'+s+'¹⁷ mod 3233</code><br>'+(ok?'echt – von Bob, unverändert':'Fälschung erkannt!')+'</div>';
      $('rsaNote').innerHTML=$('tamper').checked?'Unterwegs wurde aus der Nachricht '+m+' die '+recv+' gemacht. Die Signatur passt nicht mehr – und ohne Bobs privaten Schlüssel kann der Fälscher keine neue erzeugen.':'Jeder kann mit dem öffentlichen Schlüssel prüfen, dass die Signatur von Bob stammt. Schalte die Fälschung ein. In echten Verfahren wird übrigens nicht die Nachricht signiert, sondern ihr Hash.';
    }
  }
  const bs=[...document.querySelectorAll('#rsaMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');mode=b.dataset.m;draw();}));
  $('rsaM').addEventListener('input',draw);$('tamper').addEventListener('change',draw);draw();
})();
