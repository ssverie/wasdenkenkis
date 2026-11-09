const $=id=>document.getElementById(id);
const de=(v,d)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function seg(id,cb){const bs=[...document.querySelectorAll('#'+id+' button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(b.dataset);}));}

// ---------- Bandit ----------
(function(){
  const ICON=['🍒','🔔','⭐'],N=30;let P,cnt,win,left,last,seed=7,cmp=false;
  function reset(){const r=rng(seed++);const base=[0.25,0.45,0.65];for(let i=2;i>0;i--){const j=Math.floor(r()*(i+1));[base[i],base[j]]=[base[j],base[i]];}P=base;cnt=[0,0,0];win=[0,0,0];left=N;last=null;cmp=false;$('bdC').innerHTML='';draw();}
  function pull(i){if(left<=0)return;const w=Math.random()<P[i];cnt[i]++;if(w)win[i]++;left--;last=[i,w];draw();}
  function draw(){const done=left<=0,best=P.indexOf(Math.max(...P));
    $('bdA').innerHTML=P.map((p,i)=>'<button class="arm'+(last&&last[0]===i?(last[1]?' win':' lose'):'')+(done&&i===best?' best':'')+'" data-i="'+i+'"'+(done?' aria-disabled="true"':'')+'><div class="ic">'+ICON[i]+'</div><div class="st">'+cnt[i]+'× gespielt<br>'+win[i]+' Gewinne'+(cnt[i]?' · '+Math.round(win[i]/cnt[i]*100)+' %':'')+'</div>'+(done?'<div class="st"><b>wahr: '+Math.round(p*100)+' %</b></div>':'')+'</button>').join('');
    $('bdA').querySelectorAll('.arm').forEach(b=>b.addEventListener('click',()=>pull(+b.dataset.i)));
    const tot=win.reduce((a,b)=>a+b,0),played=N-left;
    $('bdK').innerHTML='<div><b>'+left+'</b>Versuche übrig</div><div><b>'+tot+'</b>Gewinne</div><div><b>'+(played?Math.round(tot/played*100):0)+' %</b>Trefferquote</div>';
    if(cmp)return;
    let n;if(!played)n='Klick auf einen Automaten. Jeder zahlt mit einer festen, dir unbekannten Wahrscheinlichkeit aus.';
    else if(!done)n=last[1]?'Gewinn! ':'Kein Gewinn. ';
    if(!done&&played)n+=played<6?'Noch weißt du kaum etwas – die Quoten nach wenigen Versuchen sind reiner Zufall.':cnt.filter(c=>c===0).length?'Einen Automaten hast du noch gar nicht probiert. Vielleicht ist er der beste?':'Bleibst du beim Besten oder probierst du weiter?';
    if(done){const ideal=Math.round(N*P[best]);n='<b>Fertig.</b> Der beste Automat war '+ICON[best]+' mit '+Math.round(P[best]*100)+' % (umrandet). Hättest du ihn von Anfang an gekannt, hättest du im Schnitt etwa '+ideal+' Gewinne erwartet – du hast '+tot+'. Der Unterschied ist der Preis fürs Herausfinden. Jetzt: Wie schlagen sich einfache Strategien?';}
    $('bdN').innerHTML=n;}
  $('bdR').addEventListener('click',reset);
  $('bdS').addEventListener('click',()=>{cmp=true;const S=[['Immer gierig (ε = 0)',0],['ε-gierig (ε = 10 %)',0.1],['ε-gierig (ε = 30 %)',0.3],['Rein zufällig',1]];const runs=2000,T=300,best=P.indexOf(Math.max(...P));
    const res=S.map(([nm,eps],si)=>{const r=rng(99+si);let tw=0,bestPicks=0;for(let k=0;k<runs;k++){const c=[0,0,0],w=[0,0,0];for(let t=0;t<T;t++){let a;if(t<3)a=t;else if(r()<eps)a=Math.floor(r()*3);else{let bv=-1;for(let i=0;i<3;i++){const v=w[i]/c[i];if(v>bv){bv=v;a=i;}}}c[a]++;const g=r()<P[a]?1:0;w[a]+=g;tw+=g;if(t>=T-50&&a===best)bestPicks++;}}return [nm,tw/runs/T,bestPicks/runs/50];});
    const top=Math.max(...res.map(x=>x[1]));
    $('bdC').innerHTML='<table class="cmp"><tr><th>Strategie</th><th style="text-align:right">Gewinn pro Spiel</th><th style="text-align:right">am Ende beim besten Automaten</th></tr>'+res.map(x=>'<tr class="'+(x[1]===top?'top':'')+'"><td>'+x[0]+'</td><td class="n">'+Math.round(x[1]*100)+' %</td><td class="n">'+Math.round(x[2]*100)+' %</td></tr>').join('')+'</table>';
    $('bdN').innerHTML='Je 2000 Durchgänge mit 300 Spielen an <em>diesen</em> drei Automaten (bester: '+Math.round(P[best]*100)+' %). <b>Immer gierig</b> bleibt oft an einem Automaten hängen, der am Anfang zufällig Glück hatte. <b>Rein zufällig</b> lernt alles und nutzt nichts. Ein wenig Erkunden schneidet am besten ab.';});
  reset();
})();

// ---------- Gitter / Q-Learning ----------
(function(){
  const R=5,C=6,START=[4,0],GOAL=[0,5],TRAPS=[[2,2],[2,3],[4,4]],WALLS=[[1,1],[3,2],[1,4]],COIN=[3,0];
  const D=[[-1,0],[0,1],[1,0],[0,-1]],ARW=['↑','→','↓','←'];
  let Q,mode='ok',eps=0.15,hist,ep,shown=null;
  const key=(r,c)=>r*C+c,is=(L,r,c)=>L.some(p=>p[0]===r&&p[1]===c);
  function reset(){Q=Array.from({length:R*C},()=>[0,0,0,0]);hist=[];ep=0;shown=null;draw();}
  function step(r,c,a){let nr=r+D[a][0],nc=c+D[a][1];if(nr<0||nr>=R||nc<0||nc>=C||is(WALLS,nr,nc)){nr=r;nc=c;}
    let rew=-0.1,end=false;if(nr===GOAL[0]&&nc===GOAL[1]){rew=10;end=true;}else if(is(TRAPS,nr,nc)){rew=-10;end=true;}else if(mode==='hack'&&nr===COIN[0]&&nc===COIN[1]&&!(r===nr&&c===nc))rew=2;
    return [nr,nc,rew,end];}
  function episode(rec){let [r,c]=START,tot=0,path=[[r,c]];for(let t=0;t<60;t++){const s=key(r,c);let a;if(Math.random()<eps)a=Math.floor(Math.random()*4);else{const q=Q[s],m=Math.max(...q),cand=[0,1,2,3].filter(i=>q[i]===m);a=cand[Math.floor(Math.random()*cand.length)];}
      const [nr,nc,rew,end]=step(r,c,a),s2=key(nr,nc),tgt=rew+(end?0:0.9*Math.max(...Q[s2]));Q[s][a]+=0.5*(tgt-Q[s][a]);tot+=rew;r=nr;c=nc;path.push([r,c]);if(end)break;}
    ep++;hist.push(tot);if(hist.length>300)hist.shift();return path;}
  function col(v){const t=Math.max(-1,Math.min(1,v/10));if(t>=0){const g=Math.round(235-80*t);return 'rgb('+Math.round(235-150*t)+','+g+','+Math.round(220-120*t)+')';}const u=-t;return 'rgb(235,'+Math.round(220-130*u)+','+Math.round(210-130*u)+')';}
  function draw(){let h='';const pathSet=new Set((shown||[]).map(p=>key(p[0],p[1])));const end=shown?shown[shown.length-1]:null;
    for(let r=0;r<R;r++)for(let c=0;c<C;c++){const s=key(r,c),q=Q[s],m=Math.max(...q);let cls='',txt='',bg=col(m);
      if(is(WALLS,r,c)){cls='wall';}else if(r===GOAL[0]&&c===GOAL[1]){cls='goal';txt='🏁';bg='var(--ok-soft)';}else if(is(TRAPS,r,c)){cls='trap';txt='✕';bg='var(--bad-soft,#f6dcdc)';}
      else{if(mode==='hack'&&r===COIN[0]&&c===COIN[1])cls='coin';txt=ep?'<span class="arw">'+ARW[q.indexOf(m)]+'</span><small>'+de(m,1)+'</small>':(r===START[0]&&c===START[1]?'S':'');}
      if(mode==='hack'&&r===COIN[0]&&c===COIN[1]&&!txt.includes('arw'))txt='🪙';
      if(pathSet.has(s))cls+=' path';if(end&&end[0]===r&&end[1]===c)cls+=' ag';
      h+='<div class="'+cls+'" style="background:'+(cls.includes('wall')?'':bg)+'">'+txt+'</div>';}
    $('gwG').innerHTML=h;
    // Verlauf
    const W=300,H=110,mn=-12,mx=mode==='hack'?60:12,y=v=>H-8-(H-16)*(Math.max(mn,Math.min(mx,v))-mn)/(mx-mn);let g='<line x1="0" x2="'+W+'" y1="'+y(0)+'" y2="'+y(0)+'" stroke="var(--line)"/>';
    if(hist.length){const n=hist.length,x=i=>4+(W-8)*i/Math.max(1,n-1);let d='';hist.forEach((v,i)=>d+=(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1));g+='<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="1.5"/>';}
    g+='<text x="4" y="12" font-size="10" fill="var(--muted)">'+ep+' Episoden</text>';
    $('gwSvg').innerHTML=g;
    const last=hist.length?hist[hist.length-1]:null;let n;
    if(!ep)n='Der Agent startet bei S und weiß nichts: Alle Werte sind 0. Klick auf „1 Episode zeigen“ – er irrt herum, bis er zufällig im Ziel oder im Abgrund landet.';
    else if(mode==='hack'&&ep>=100&&last>20)n='<b>Reward Hacking.</b> Der Agent hat entdeckt, dass er auf dem Münzfeld und daneben hin- und herlaufen kann: Bei jedem Betreten gibt es +2, nach 60 Schritten kommt viel mehr zusammen als die 10 Punkte im Ziel. Er tut genau, was belohnt wird – das Ziel interessiert ihn nicht mehr.';
    else if(ep<20)n='Nach '+ep+' Episode'+(ep>1?'n':'')+' kennt der Agent erst die Felder direkt vor Ziel und Abgrund. Der Wert sickert mit jeder Episode ein Feld weiter zurück.';
    else n='Nach '+ep+' Episoden zeigen die Pfeile einen Weg vom Start ins Ziel'+(eps===0?'':', der am Abgrund vorbeiführt')+'. '+(eps>0.3?'Mit so viel Erkunden stolpert der Agent aber noch oft zufällig hinein – deshalb schwankt die Kurve.':eps===0?'Ohne Erkunden lernt er nur den ersten Weg, den er zufällig gefunden hat – vielleicht nicht den kürzesten.':'Die Kurve stabilisiert sich bei knapp unter 10: Ziel minus Schrittkosten, gelegentlich ein Fehlgriff durchs Erkunden.');
    $('gwN').innerHTML=n;}
  $('gwE').addEventListener('input',()=>{eps=+$('gwE').value/100;$('gwEo').textContent=de(eps,2);draw();});$('gwEo').textContent=de(eps,2);
  $('gw1').addEventListener('click',()=>{shown=episode();draw();});
  $('gw50').addEventListener('click',()=>{for(let i=0;i<50;i++)episode();const e0=eps;eps=0;shown=null;const save=Q.map(q=>q.slice()),hs=hist.slice(),epS=ep;shown=episode();Q=save;hist=hs;ep=epS;eps=e0;draw();});
  $('gwR').addEventListener('click',reset);
  seg('gwM',d=>{mode=d.m;reset();});
  reset();
})();

// ---------- Policy Gradient ----------
(function(){
  const A=[['Kurz und falsch','„398“',false,1],['Rechenweg, richtig','„17 · 24 = 17 · 20 + 17 · 4 = 340 + 68 = 408“',true,3],['Kurz und richtig','„408“',true,1],['Lang und falsch','ausführliche Erklärung mit Rechenfehler: „… = 418“',false,5]];
  let L,mode='check',n,last,avg;
  function probs(){const m=Math.max(...L),e=L.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s);}
  function reward(i){return mode==='check'?(A[i][2]?1:0):A[i][3]/5;}
  function reset(){L=[0.6,-0.2,0.2,0.3];n=0;last=null;avg=0.4;draw();}
  function sample(){const p=probs(),r=Math.random();let a=0,c=p[0];while(r>c&&a<3){a++;c+=p[a];}const R=reward(a),adv=R-avg;for(let i=0;i<4;i++)L[i]+=0.5*adv*((i===a?1:0)-p[i]);avg+=0.1*(R-avg);n++;last=[a,R];}
  function draw(){const p=probs();$('pgP').innerHTML=A.map((x,i)=>'<div class="'+(last&&last[0]===i?'hit':'')+'"><span><b>'+x[0]+'</b><small>'+x[1]+'</small></span><div class="meter"><i style="width:'+(p[i]*100)+'%"></i></div><output>'+Math.round(p[i]*100)+' %</output></div>').join('');
    $('pgC').textContent=n+' Antworten';
    let t;if(!last)t='Am Anfang ist das Modell unentschieden und neigt sogar zur kurzen, falschen Antwort. Zieh eine Antwort.';
    else{const [a,R]=last;t='Gezogen: <b>'+A[a][0]+'</b> → Belohnung <b>'+de(R,1)+'</b>. '+(R>avg?'Besser als der bisherige Durchschnitt – diese Antwort wird wahrscheinlicher, die anderen etwas unwahrscheinlicher.':'Schlechter als der Durchschnitt – diese Antwort wird unwahrscheinlicher.');
      if(n>=40)t+=mode==='check'?' Nach '+n+' Antworten dominieren die richtigen Antworten – meist die kurze, weil das Modell sie anfangs schon etwas lieber mochte und der Rechenweg nicht extra belohnt wird. Bei einer so leichten Aufgabe lohnt er sich nicht. Bei schweren Aufgaben, die ohne Zwischenschritte meist falsch ausgehen, wäre es umgekehrt: Dann gewinnt das Nachdenken, weil es öfter zum richtigen Ergebnis führt.':' <b>Nach '+n+' Antworten gewinnt die lange, falsche Antwort.</b> Die Belohnung misst Länge, nicht Richtigkeit – Reward Hacking im Kleinen.';}
    $('pgN').innerHTML=t;}
  $('pg1').addEventListener('click',()=>{sample();draw();});
  $('pg20').addEventListener('click',()=>{for(let i=0;i<20;i++)sample();draw();});
  $('pgX').addEventListener('click',reset);
  seg('pgR',d=>{mode=d.r;reset();});
  reset();
})();
