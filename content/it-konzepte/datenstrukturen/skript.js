// ---------- HashMap ----------
(function(){
  const $=id=>document.getElementById(id);
  const NAMES=['Ben','Clara','David','Emma','Felix','Greta','Hanna','Ida','Jonas','Karl','Lena','Mia','Noah','Ole','Paul','Rosa','Sven','Tom','Ute','Vera'];
  let n,tab,size,last,resized,ni;
  const jh=s=>{let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(h,31)+s.charCodeAt(i))|0;return h;};
  const hc=k=>$('hmBad').checked?42:jh(k);
  const spread=h=>(h^(h>>>16))|0;
  const idx=k=>spread(hc(k))&(n-1);
  function reset(){n=16;tab=[...Array(n)].map(()=>[]);size=0;last=null;resized=false;ni=0;draw('Leere HashMap mit 16 Fächern. Gib einen Namen ein und füge ihn mit <code>put</code> ein.');}
  function rehash(){const old=tab.flat();n*=2;tab=[...Array(n)].map(()=>[]);old.forEach(k=>tab[idx(k)].push(k));resized=true;}
  function put(k){k=k.trim();if(!k)return;resized=false;const i=idx(k);
    if(tab[i].includes(k)){last={k,i,op:'dup'};draw('<code>'+k+'</code> ist schon da – gleicher Schlüssel, Wert würde ersetzt.');return;}
    const coll=tab[i].length>0;tab[i].push(k);size++;let msg='<code>'+k+'</code> → Fach '+i+'.'+(coll?' <b>Kollision:</b> Dort lag schon '+tab[i].slice(0,-1).map(x=>'<code>'+x+'</code>').join(', ')+'. Beide liegen jetzt in einer kleinen Liste.':'');
    if(size>n*0.75){rehash();msg+=' <b>Füllgrad über 75 %:</b> Die Tabelle wurde auf '+n+' Fächer verdoppelt, und alle Einträge wurden neu verteilt.';}
    last={k,i:idx(k),op:'put'};draw(msg);}
  function get(k){k=k.trim();const i=idx(k),pos=tab[i].indexOf(k);last={k,i,op:'get'};
    draw(pos>=0?'<code>get("'+k+'")</code>: Hash berechnen → Fach '+i+' → '+(pos+1)+' Vergleich'+(pos?'e':'')+' mit <code>equals</code>. Gefunden – ohne die anderen '+(size-1)+' Einträge anzusehen.':'<code>get("'+k+'")</code>: Fach '+i+' ist '+(tab[i].length?'belegt, aber ohne diesen Schlüssel':'leer')+'. Nicht vorhanden – auch das in einem Schritt.');}
  function draw(msg){
    $('hmB').innerHTML=tab.map((b,i)=>'<div class="bkt'+(last&&last.i===i?' hot':'')+(b.length>2?' many':'')+'"><span class="ix">'+i+'</span>'+b.map(k=>'<span class="e'+(last&&last.k===k&&last.op==='put'?' new':'')+'">'+k+'</span>').join('')+'</div>').join('');
    if(last){const h=hc(last.k),s=spread(h);
      $('hmCalc').textContent='"'+last.k+'".hashCode() = '+h+'\nh ^ (h >>> 16)     = '+s+'\n& ('+n+' − 1)          = Fach '+(s&(n-1));}
    else $('hmCalc').textContent='"…".hashCode()  →  verteilen  →  & (Größe − 1)  →  Fach';
    const longest=Math.max(...tab.map(b=>b.length)),used=tab.filter(b=>b.length).length;
    $('hmS').innerHTML='<div><b>'+size+'</b>Einträge</div><div><b>'+n+'</b>Fächer</div><div><b>'+used+'</b>Fächer belegt</div><div><b>'+longest+'</b>längste Kette</div>';
    $('hmN').innerHTML=msg+($('hmBad').checked&&size>2?' <b>Alle Einträge landen im selben Fach</b> – jedes <code>get</code> muss die ganze Kette durchsuchen: aus O(1) wird O(n).':'');
  }
  $('hmPut').addEventListener('click',()=>put($('hmKey').value));
  $('hmGet').addEventListener('click',()=>get($('hmKey').value));
  $('hmKey').addEventListener('keydown',e=>{if(e.key==='Enter')put($('hmKey').value);});
  $('hmMany').addEventListener('click',()=>{for(let j=0;j<10;j++){put(NAMES[ni%NAMES.length]+(ni>=NAMES.length?ni:''));ni++;}});
  $('hmReset').addEventListener('click',reset);
  $('hmBad').addEventListener('change',()=>{const old=tab.flat();tab=[...Array(n)].map(()=>[]);old.forEach(k=>tab[idx(k)].push(k));last=null;draw($('hmBad').checked?'Jetzt liefert jeder Schlüssel den Hashcode 42 – alle Einträge wurden neu einsortiert.':'Wieder mit echtem <code>String.hashCode()</code>.');});
  reset();
})();

// ---------- Suchbaum ----------
(function(){
  const $=id=>document.getElementById(id);
  const ORD={sorted:[...Array(15)].map((_,i)=>i+1),random:[9,4,13,2,7,11,15,1,6,3,12,8,14,5,10],balanced:[8,4,12,2,6,10,14,1,3,5,7,9,11,13,15]};
  function insert(root,v){if(!root)return {v,l:null,r:null};let n=root;while(true){if(v<n.v){if(!n.l){n.l={v,l:null,r:null};break;}n=n.l;}else{if(!n.r){n.r={v,l:null,r:null};break;}n=n.r;}}return root;}
  const depth=n=>n?1+Math.max(depth(n.l),depth(n.r)):0;
  function avg(root){let s=0,c=0;(function w(n,d){if(!n)return;s+=d;c++;w(n.l,d+1);w(n.r,d+1);})(root,1);return s/c;}
  function draw(o){
    let root=null;ORD[o].forEach(v=>root=insert(root,v));
    const D=depth(root),H=Math.max(300,40+D*(o==='sorted'?19:60));
    $('tree').setAttribute('viewBox','0 0 600 '+H);
    let e='',nd='';
    (function w(n,x,y,dx){if(!n)return;
      const ny=y+(o==='sorted'?19:60);
      if(n.l){e+='<line class="ed" x1="'+x+'" y1="'+y+'" x2="'+(x-dx)+'" y2="'+ny+'"/>';w(n.l,x-dx,ny,dx/2);}
      if(n.r){const nx=o==='sorted'?x+36:x+dx;e+='<line class="ed" x1="'+x+'" y1="'+y+'" x2="'+nx+'" y2="'+ny+'"/>';w(n.r,nx,ny,o==='sorted'?dx:dx/2);}
      nd+='<circle class="nd" cx="'+x+'" cy="'+y+'" r="'+(o==='sorted'?9:16)+'"/><text class="nt" x="'+x+'" y="'+(y+4)+'" text-anchor="middle"'+(o==='sorted'?' style="font-size:9px"':'')+'>'+n.v+'</text>';
    })(root,o==='sorted'?40:300,22,o==='sorted'?36:150);
    $('tree').innerHTML=e+nd;
    const bad=D>6;
    $('tS').innerHTML='<div class="'+(bad?'bad':'good')+'"><b>'+D+'</b>Ebenen</div><div class="'+(bad?'bad':'good')+'"><b>'+D+'</b>Vergleiche im schlechtesten Fall</div><div><b>'+avg(root).toFixed(1).replace('.',',')+'</b>Vergleiche im Mittel</div>';
    $('tN').innerHTML=o==='sorted'?'<b>Entartet.</b> Jeder neue Wert ist größer als alle bisherigen und hängt rechts an. Der „Baum“ ist eine verkettete Liste – Suchen kostet O(n). Und sortierte Daten kommen in der Praxis ständig vor: fortlaufende IDs, Zeitstempel.':
      o==='random'?'Bei zufälliger Reihenfolge wird der Baum meist einigermaßen ausgewogen – hier '+D+' Ebenen. Aber verlassen kann man sich darauf nicht.':
      '<b>Perfekt ausgewogen:</b> 15 Werte in 4 Ebenen, log₂(16) = 4. Ein selbstbalancierender Baum erreicht so etwas unabhängig von der Einfügereihenfolge, indem er sich beim Einfügen umbaut. Bei einer Million Einträgen: rund 20 Ebenen statt einer Million.';
  }
  const bs=[...document.querySelectorAll('#tSel button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');draw(b.dataset.o);}));
  draw('random');
})();

// ---------- Heap ----------
(function(){
  const $=id=>document.getElementById(id);
  let H,moved;
  function reset(){H=[3,8,5,12,10,7,9];moved=[];draw('Ein Min-Heap mit 7 Werten. Die Wurzel ist das Minimum, jeder Knoten ist kleiner als seine Kinder.');}
  function up(i){const path=[i];while(i>0){const p=(i-1)>>1;if(H[p]<=H[i])break;[H[p],H[i]]=[H[i],H[p]];i=p;path.push(i);}return path;}
  function down(i){const path=[i];while(true){const l=2*i+1,r=l+1;let m=i;if(l<H.length&&H[l]<H[m])m=l;if(r<H.length&&H[r]<H[m])m=r;if(m===i)break;[H[m],H[i]]=[H[i],H[m]];i=m;path.push(i);}return path;}
  function draw(msg){
    const pos=i=>{const lvl=Math.floor(Math.log2(i+1)),first=(1<<lvl)-1,k=i-first,cnt=1<<lvl;return [ (k+0.5)*560/cnt, 26+lvl*56 ];};
    let e='',n='';
    H.forEach((v,i)=>{const [x,y]=pos(i);if(i>0){const [px,py]=pos((i-1)>>1);e+='<line class="ed" x1="'+px+'" y1="'+py+'" x2="'+x+'" y2="'+y+'"/>';}
      n+='<circle class="nd'+(i===0?' top':'')+(moved.includes(i)?' mv':'')+'" cx="'+x+'" cy="'+y+'" r="17"/><text class="nt" x="'+x+'" y="'+(y+4)+'" text-anchor="middle">'+v+'</text>';});
    $('heapsvg').innerHTML=e+n;
    $('hpA').innerHTML=H.map((v,i)=>'<span class="'+(moved.includes(i)?'mv':'')+'">'+v+'<small>['+i+']</small></span>').join('');
    $('hpN').innerHTML=msg;$('hpAdd').disabled=H.length>=15;$('hpPoll').disabled=H.length===0;
  }
  $('hpAdd').addEventListener('click',()=>{const v=1+Math.floor(Math.random()*30);H.push(v);const p=up(H.length-1);moved=p;
    draw('<code>offer('+v+')</code>: ans Ende gehängt, dann '+(p.length-1)+'-mal mit dem Elternknoten getauscht. Orange: der Weg. '+(p[p.length-1]===0?'Es ist das neue Minimum.':''));});
  $('hpPoll').addEventListener('click',()=>{const min=H[0],last=H.pop();if(H.length){H[0]=last;moved=down(0);}else moved=[];
    draw('<code>poll()</code> liefert <b>'+min+'</b>. Das letzte Element ('+last+') rückt an die Spitze und sinkt ab – '+Math.max(0,moved.length-1)+' Tausch'+(moved.length===2?'':'e')+'. Die Wurzel ist wieder das Minimum.');});
  $('hpReset').addEventListener('click',reset);
  reset();
})();
