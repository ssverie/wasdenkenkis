// ---------- Wie viele passen? ----------
(function(){
  const $=id=>document.getElementById(id);
  const APP=[128,256,512,1024,2048,4096,8192];
  const fmt=mb=>mb>=1024?(mb/1024).toLocaleString('de-DE')+' GB':mb+' MB';
  function draw(){
    const srv=+$('srvRam').value*1024,app=APP[+$('appRam').value];
    $('srvRamO').textContent=$('srvRam').value+' GB';$('appRamO').textContent=fmt(app);
    const avail=srv-2048;
    const nv=Math.max(0,Math.floor(avail/(app+1024))),nc=Math.max(0,Math.floor(avail/(app+10)));
    $('nVM').innerHTML=nv+' <small>Anwendungen</small>';$('nCT').innerHTML=nc+' <small>Anwendungen</small>';
    const dots=(n,c)=>{const m=Math.min(n,200);return Array(m).fill('<i class="'+c+'"></i>').join('')+(n>200?' <small style="color:var(--muted)">…</small>':'');};
    $('dVM').innerHTML=dots(nv,'vm');$('dCT').innerHTML=dots(nc,'ct');
  }
  $('srvRam').addEventListener('input',draw);$('appRam').addEventListener('input',draw);draw();
})();

// ---------- Namespaces ----------
(function(){
  const $=id=>document.getElementById(id);
  const on=k=>document.querySelector('#nsctl input[data-ns="'+k+'"]').checked;
  const C=(t,ch)=>ch?'<span class="chg">'+t+'</span>':t;
  function draw(){
    const pid=on('pid'),mnt=on('mnt'),net=on('net'),uts=on('uts'),usr=on('user');
    const host=uts?'a3f9c2':'server-07';
    const who=usr?'root':'app';
    let i='<div class="h">Im Container</div>';
    i+='<span class="p">'+who+'@'+C(host,uts)+'$</span> ps<br>';
    i+=pid?C('  PID CMD<br>    1 java -jar app.jar<br>   23 ps',true):'  PID CMD<br>    1 /sbin/init<br>  812 sshd<br> 1207 postgres<br>48213 java -jar app.jar<br>48290 ps';
    i+='<br><span class="p">'+who+'@'+C(host,uts)+'$</span> ls /<br>';
    i+=mnt?C('app  bin  etc  lib  opt  usr',true):'bin  boot  etc  home  srv  usr  var …';
    i+='<br><span class="p">'+who+'@'+C(host,uts)+'$</span> ip -br addr<br>';
    i+=net?C('lo    127.0.0.1<br>eth0  172.17.0.5',true):'lo    127.0.0.1<br>ens3  203.0.113.20<br>docker0 172.17.0.1';
    i+='<br><span class="p">'+who+'@'+C(host,uts)+'$</span> id -u<br>'+(usr?C('0',true):'1000');
    $('inside').innerHTML=i;
    let o='<div class="h">Auf dem Host</div><span class="p">admin@server-07$</span> ps -o pid,user,cmd<br>  PID USER    CMD<br>    1 root    /sbin/init<br>  812 root    sshd<br> 1207 postgres postgres<br>'+C('48213 '+(usr?'100000':'app   ')+'  java -jar app.jar',true);
    o+='<br><br><span class="p">admin@server-07$</span> cat /sys/fs/cgroup/…/memory.max<br>1073741824 <span style="color:#8f8f99">(1 GB Limit)</span>';
    $('outside').innerHTML=o;
    const n=[pid,mnt,net,uts,usr].filter(Boolean).length;
    $('nsnote').innerHTML=n===5?'Alle Namespaces an: Von innen sieht der Prozess aus wie allein auf einem frischen Rechner – PID 1, eigenes Dateisystem, eigene IP, root. Für den Host ist er Prozess 48213 eines unprivilegierten Benutzers.':
      n===0?'Alle aus: ein ganz normaler Prozess. Er sieht alle anderen Prozesse, das ganze Dateisystem und das echte Netzwerk.':
      'Jeder Namespace schottet einen Aspekt ab. Orange markiert, was sich gegenüber einem normalen Prozess ändert.'+(usr?' Der Benutzer-Namespace ist ein Sicherheitsgewinn: root im Container ist auf dem Host ein machtloser Benutzer.':'');
  }
  document.querySelectorAll('#nsctl input').forEach(x=>x.addEventListener('change',draw));draw();
})();

// ---------- Layer ----------
(function(){
  const $=id=>document.getElementById(id);
  let chg='code';
  function draw(){
    const bad=$('badOrder').checked;
    const L=[
      {k:'base',t:'FROM eclipse-temurin:21-jre',sz:190},
      {k:'wd',t:'WORKDIR /app',sz:0},
      bad?{k:'code',t:'COPY target/app.jar app.jar',sz:2}:{k:'dep',t:'COPY target/lib/ lib/',sz:80},
      bad?{k:'dep',t:'COPY target/lib/ lib/',sz:80}:{k:'code',t:'COPY target/app.jar app.jar',sz:2},
      {k:'ep',t:'ENTRYPOINT ["java", …]',sz:0}
    ];
    const first=L.findIndex(l=>l.k===chg);
    let up=0;
    $('layers').innerHTML=L.map((l,i)=>{const n=i>=first;if(n)up+=l.sz;
      return '<div class="lay '+(n?'new':'cached')+'"><code>'+l.t+'</code><span class="sz">'+(l.sz?l.sz+' MB':'–')+'</span><span class="st">'+(n?'neu bauen':'aus Cache')+'</span></div>';}).join('');
    let t='Neu zu bauen und hochzuladen: <b>'+up+' MB</b>.';
    if(chg==='code') t+=bad?' Weil der Code <em>unter</em> den Abhängigkeiten liegt, wird jede kleine Codeänderung auch die 80 MB Bibliotheken mitreißen – bei jedem Build, bei jedem Deployment.':' Nur die oberste Code-Schicht ändert sich. So soll es sein: Der häufigste Fall ist der billigste.';
    else if(chg==='dep') t+=' Eine neue Bibliotheksversion erzwingt alles ab dieser Schicht – das passiert aber selten.';
    else t+=' Ändert sich die unterste Schicht, wird alles darüber neu gebaut. Deshalb aktualisiert man Basis-Images bewusst und regelmäßig – etwa für Sicherheitsupdates.';
    $('laysum').innerHTML=t;
  }
  const bs=[...document.querySelectorAll('#chg button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');chg=b.dataset.c;draw();}));
  $('badOrder').addEventListener('change',draw);draw();
})();
