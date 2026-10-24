// ---------- gemeinsamer DPLL ----------
function dpll(n,C,limit){
  // gibt {sat, model, decisions} zurück
  const a=new Int8Array(n+1);let dec=0,conf=0;
  function val(l){const v=a[Math.abs(l)];return v===0?0:((l>0)===(v===1)?1:-1);}
  function solve(){
    const trail=[];
    // Unit Propagation
    let changed=true;
    while(changed){changed=false;
      for(const c of C){let open=0,last=0,sat=false;for(const l of c){const v=val(l);if(v===1){sat=true;break;}if(v===0){open++;last=l;}}
        if(sat)continue;if(open===0){conf++;trail.forEach(x=>a[x]=0);return false;}
        if(open===1){a[Math.abs(last)]=last>0?1:-1;trail.push(Math.abs(last));changed=true;}}}
    // Variable wählen: aus kürzester offener Klausel
    let best=0,bl=99;
    for(const c of C){let open=0,sat=false,cand=0;for(const l of c){const v=val(l);if(v===1){sat=true;break;}if(v===0){open++;cand=l;}}if(!sat&&open<bl){bl=open;best=cand;}}
    if(!best)return true;
    if(dec>limit){trail.forEach(x=>a[x]=0);return false;}
    dec++;const x=Math.abs(best),first=best>0?1:-1;
    for(const v of [first,-first]){a[x]=v;if(solve())return true;a[x]=0;}
    trail.forEach(x=>a[x]=0);return false;}
  const sat=solve();return {sat,model:a,decisions:dec,conflicts:conf};
}

// ---------- SAT-Rätsel ----------
(function(){
  const $=id=>document.getElementById(id);
  const N='ABCDEF',C=[[-4,3,-2],[-1,4,2],[5,4,-3],[-6,2,-4],[-6,2,1],[4,-6,-2],[-3,6,-2],[-5,-3,4],[3,6,4],[3,6,2],[2,-5,-4],[5,6,-3],[-2,-3,-5],[-6,-3,1]];
  const SOL=[1,1,1,1,0,1];let A=[0,0,0,0,0,0],tries=0,seen=new Set();
  const lit=l=>(l<0?'¬':'')+N[Math.abs(l)-1];
  function draw(){$('saV').innerHTML=A.map((v,i)=>'<button class="'+(v?'t':'')+'" data-i="'+i+'">'+N[i]+' = '+(v?'w':'f')+'</button>').join('');
    $('saV').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{A[+b.dataset.i]^=1;tries++;seen.add(A.join(''));draw();}));
    let ok=0;$('saC').innerHTML=C.map(c=>{const s=c.some(l=>(A[Math.abs(l)-1]===1)===(l>0));if(s)ok++;return '<span class="'+(s?'ok':'no')+'">('+c.map(l=>{const t=(A[Math.abs(l)-1]===1)===(l>0);return t?'<b>'+lit(l)+'</b>':lit(l);}).join(' ∨ ')+')</span>';}).join('');
    $('saS').innerHTML='<span>erfüllt <b>'+ok+' / '+C.length+'</b></span><span>Klicks <b>'+tries+'</b></span><span>verschiedene Belegungen probiert <b>'+seen.size+' / 64</b></span>';
    const r=$('saR');if(ok===C.length){r.className='verd yes';r.innerHTML='<b>Gefunden!</b> Das Prüfen hat der Rechner bei jedem Klick nebenbei erledigt – 14 Klauseln anschauen. Das Finden hat dich '+tries+' Klicks gekostet.';}else{r.className='verd';r.innerHTML=(C.length-ok)+' Klauseln sind noch verletzt (rot). Grüne Buchstaben zeigen, welches Literal eine Klausel gerade erfüllt.';}}
  $('saReset').addEventListener('click',()=>{A=[0,0,0,0,0,0];draw();});
  $('saShow').addEventListener('click',()=>{A=SOL.slice();draw();});
  seen.add(A.join(''));draw();
})();

// ---------- Kartenfärbung ----------
(function(){
  const $=id=>document.getElementById(id);
  const V=[['NL',160,35],['BE',90,85],['LU',140,140],['DE',270,85],['FR',70,220],['CH',215,210],['AT',345,175],['IT',285,265]];
  const E=[['DE','FR'],['DE','BE'],['DE','NL'],['DE','LU'],['DE','CH'],['DE','AT'],['FR','BE'],['FR','LU'],['FR','CH'],['BE','NL'],['BE','LU'],['CH','AT'],['IT','FR'],['IT','CH'],['IT','AT']];
  const COL=['#e8e4dc','#e07a5f','#81b29a','#f2cc8f','#7aa6d9'];
  const NAME={NL:'Niederlande',BE:'Belgien',LU:'Luxemburg',DE:'Deutschland',FR:'Frankreich',CH:'Schweiz',AT:'Österreich',IT:'Italien'};
  const idx={};V.forEach((v,i)=>idx[v[0]]=i);
  let K=3,c=V.map(()=>0),msg='';
  function encode(){const n=V.length,vr=(l,f)=>l*K+f+1,C=[];
    for(let l=0;l<n;l++){C.push([...Array(K).keys()].map(f=>vr(l,f)));for(let f=0;f<K;f++)for(let g=f+1;g<K;g++)C.push([-vr(l,f),-vr(l,g)]);}
    E.forEach(e=>{for(let f=0;f<K;f++)C.push([-vr(idx[e[0]],f),-vr(idx[e[1]],f)]);});return {n:n*K,C,vr};}
  function draw(){let g='';const bad=new Set();
    E.forEach((e,i)=>{const a=V[idx[e[0]]],b=V[idx[e[1]]],cf=c[idx[e[0]]]&&c[idx[e[0]]]===c[idx[e[1]]];if(cf)bad.add(i);g+='<line class="'+(cf?'bad':'')+'" x1="'+a[1]+'" y1="'+a[2]+'" x2="'+b[1]+'" y2="'+b[2]+'"/>';});
    V.forEach((v,i)=>{g+='<g class="nd" data-i="'+i+'" role="button" aria-label="'+NAME[v[0]]+'"><circle cx="'+v[1]+'" cy="'+v[2]+'" r="22" fill="'+COL[c[i]]+'"/><text x="'+v[1]+'" y="'+(v[2]+4)+'" text-anchor="middle">'+v[0]+'</text></g>';});
    $('mapSvg').innerHTML=g;
    $('mapSvg').querySelectorAll('.nd').forEach(n=>n.addEventListener('click',()=>{const i=+n.dataset.i;c[i]=(c[i]+1)%(K+1);msg='';draw();}));
    const {n,C,vr}=encode();
    const show=C.slice(0,8).map(cl=>'('+cl.map(l=>{const a=Math.abs(l)-1,land=V[Math.floor(a/K)][0],f=a%K+1;return (l<0?'¬':'')+land+'_'+f;}).join(' ∨ ')+')').join(' ∧ ');
    $('mpEnc').innerHTML='<b>'+n+' Variablen, '+C.length+' Klauseln</b> ('+V.length+' × „mindestens eine Farbe“, '+(V.length*K*(K-1)/2)+' × „höchstens eine“, '+(E.length*K)+' × „Nachbarn verschieden“). Anfang: '+show+' ∧ …';
    const done=c.every(x=>x>0),r=$('mpR');
    if(msg){r.className='verd'+(msg.ok?' yes':'');r.innerHTML=msg.t;}
    else if(done&&!bad.size){r.className='verd yes';r.innerHTML='<b>Gültige Färbung mit '+K+' Farben!</b>';}
    else{r.className='verd';r.innerHTML=bad.size?bad.size+' Grenze'+(bad.size>1?'n':'')+' mit gleicher Farbe (rot).':'Färbe alle Länder – oder frag den Solver.';}}
  $('mpSolve').addEventListener('click',()=>{const {n,C,vr}=encode();const t0=performance.now();const r=dpll(n,C,1e6);const ms=(performance.now()-t0).toFixed(1).replace('.',',');
    if(r.sat){c=V.map((v,l)=>{for(let f=0;f<K;f++)if(r.model[vr(l,f)]===1)return f+1;return 0;});msg={ok:1,t:'<b>Erfüllbar.</b> Der Solver fand eine Färbung nach '+r.decisions+' Entscheidungen in '+ms+' ms und hat sie eingetragen.'};}
    else{msg={ok:0,t:'<b>Unerfüllbar</b> – mit '+K+' Farben geht es nicht, der Solver hat es nach '+r.decisions+' Entscheidungen bewiesen. Der Grund: Deutschland, Frankreich, Belgien und Luxemburg grenzen alle aneinander. Vier gegenseitige Nachbarn brauchen vier Farben.'};}
    draw();});
  $('mpClear').addEventListener('click',()=>{c=V.map(()=>0);msg='';draw();});
  const bs=[...document.querySelectorAll('#mpK button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');K=+b.dataset.k;c=c.map(x=>x>K?0:x);msg='';draw();}));
  draw();
})();

// ---------- Phasenübergang ----------
(function(){
  const $=id=>document.getElementById(id);
  function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
  const n=25,INST=40,R=[];for(let k=0;k<=14;k++)R.push(1+k*0.5);
  const res=R.map((ratio,ri)=>{const r=rng(1234+ri*97);let sat=0,dec=0;const m=Math.round(ratio*n);
    for(let t=0;t<INST;t++){const C=[];for(let j=0;j<m;j++){const vs=new Set();while(vs.size<3)vs.add(1+Math.floor(r()*n));C.push([...vs].map(v=>r()<.5?v:-v));}
      const s=dpll(n,C,1e5);if(s.sat)sat++;dec+=s.conflicts;}
    return {ratio,p:sat/INST,d:dec/INST};});
  function draw(){const k=+$('phR').value,cur=res[k];$('phRo').textContent=String(cur.ratio).replace('.',',');
    const W=480,H=200,pl=34,pr=34,pb=24,pt=12,md=Math.max(...res.map(x=>x.d)),bw=(W-pl-pr)/res.length,x=i=>pl+i*bw;let g='';
    for(let j=0;j<=4;j++){const yy=H-pb-(H-pb-pt)*j/4;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" stroke="var(--line)"/><text x="'+(pl-4)+'" y="'+(yy+3)+'" text-anchor="end" font-size="9" fill="var(--accent)">'+Math.round(md*j/4)+'</text><text x="'+(W-pr+4)+'" y="'+(yy+3)+'" font-size="9" fill="var(--ok)">'+(25*j)+' %</text>';}
    res.forEach((q,i)=>{const h=(H-pb-pt)*q.d/md;g+='<rect x="'+(x(i)+2)+'" y="'+(H-pb-h)+'" width="'+(bw-4)+'" height="'+h+'" fill="'+(i===k?'var(--accent-2)':'var(--accent)')+'" opacity="'+(i===k?1:.5)+'"/>';if(i%2===0)g+='<text x="'+(x(i)+bw/2)+'" y="'+(H-8)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+String(q.ratio).replace('.',',')+'</text>';});
    let d='';res.forEach((q,i)=>{d+=(i?'L':'M')+(x(i)+bw/2)+' '+(H-pb-(H-pb-pt)*q.p);});
    g+='<path d="'+d+'" fill="none" stroke="var(--ok)" stroke-width="2.4"/>';
    const xt=pl+(4.26-1)/0.5*bw+bw/2;g+='<line x1="'+xt+'" x2="'+xt+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="'+(xt+4)+'" y="'+(pt+9)+'" font-size="9" fill="var(--muted)">≈ 4,26</text>';
    g+='<text x="'+(W-pr-4)+'" y="'+(pt+9)+'" text-anchor="end" font-size="9.5" fill="var(--ok)">— erfüllbar</text><text x="'+(W-pr-4)+'" y="'+(pt+21)+'" text-anchor="end" font-size="9.5" fill="var(--accent)">▮ Sackgassen</text>';
    $('phSvg').innerHTML=g;
    const p=Math.round(cur.p*100);
    $('phN').innerHTML='Bei '+String(cur.ratio).replace('.',',')+' Klauseln pro Variable ('+Math.round(cur.ratio*n)+' Klauseln) sind <b>'+p+' %</b> der Formeln erfüllbar; der Solver läuft im Schnitt in <b>'+cur.d.toFixed(1).replace('.',',')+'</b> Sackgassen und muss zurück. '+(cur.ratio<3.5?'Unterbestimmt: Fast jede Richtung führt zum Ziel.':cur.ratio>5.5?'Überbestimmt: Widersprüche fallen schnell auf, der Beweis der Unerfüllbarkeit ist kurz.':'<b>Nahe am Übergang</b> – hier sind die Formeln am schwersten, weil sie gerade eben erfüllbar oder gerade eben unerfüllbar sind.');}
  $('phR').addEventListener('input',draw);draw();
})();
