// ---------- Mini-Dateisystem ----------
(function(){
  const $=id=>document.getElementById(id);
  const META=4,NB=48;
  let dir,ino,blocks,ghost,sel,nextIno,col,msg;
  const NAMES=['notizen.md','foto.jpg','daten.csv','backup.zip','skript.sh','musik.mp3','plan.pdf','bericht.docx'];
  function reset(){
    dir=[{n:'brief.txt',i:12},{n:'urlaub.jpg',i:13},{n:'app.log',i:14}];
    ino={12:{links:1,b:[4,5],c:0},13:{links:1,b:[6,7,8,9,10],c:1},14:{links:1,b:[11,12,13],c:2}};
    ghost=new Set();nextIno=15;col=3;sel=12;
    msg='Klick auf einen Namen oder Inode, um seine Blöcke zu sehen. Dann: anlegen, vergrößern, verlinken, löschen.';draw();
  }
  function used(){const u=new Set();Object.values(ino).forEach(x=>x.b.forEach(b=>u.add(b)));return u;}
  function free(n){const u=used(),r=[];for(let b=META;b<NB&&r.length<n;b++)if(!u.has(b))r.push(b);return r;}
  function draw(){
    $('fsDir').innerHTML=dir.map(d=>'<tr data-i="'+d.i+'"'+(d.i===sel?' class="sel"':'')+'><td><code>'+d.n+'</code></td><td>'+d.i+'</td></tr>').join('')||'<tr><td colspan="2" style="color:var(--muted)">leer</td></tr>';
    $('fsIno').innerHTML=Object.entries(ino).map(([k,x])=>'<tr data-i="'+k+'"'+(+k===sel?' class="sel"':'')+'><td><span class="f'+x.c+'" style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px"></span>'+k+'</td><td>'+x.links+'</td><td><code>'+x.b.join(', ')+'</code></td></tr>').join('');
    const owner={};Object.entries(ino).forEach(([k,x])=>x.b.forEach(b=>owner[b]=[+k,x.c]));
    let h='';
    for(let b=0;b<NB;b++){
      if(b<META)h+='<div class="blk mt" title="Verwaltung">'+['S','B','I','I'][b]+'</div>';
      else if(owner[b])h+='<div class="blk f'+owner[b][1]+(owner[b][0]===sel?' hl':'')+'" title="Block '+b+'">'+b+'</div>';
      else if(ghost.has(b))h+='<div class="blk ghost" title="frei, alte Daten">'+b+'</div>';
      else h+='<div class="blk" title="frei"></div>';
    }
    $('fsDisk').innerHTML=h;$('fsMsg').innerHTML=msg;
    document.querySelectorAll('#fsDir tr[data-i],#fsIno tr[data-i]').forEach(r=>r.addEventListener('click',()=>{sel=+r.dataset.i;const x=ino[sel];
      const names=dir.filter(d=>d.i===sel).map(d=>'<code>'+d.n+'</code>');
      msg='Inode '+sel+': '+x.b.length+' Blöcke ('+x.b.join(', ')+'), '+x.links+' Name'+(x.links===1?'':'n')+(names.length?': '+names.join(', '):'')+'.';draw();}));
    const has=sel!=null&&ino[sel];
    $('fsGrow').disabled=$('fsLink').disabled=$('fsDel').disabled=!has;
  }
  $('fsNew').addEventListener('click',()=>{
    const n=1+Math.floor(Math.random()*3),fb=free(n);
    if(fb.length<n){msg='Die Platte ist voll.';draw();return;}
    const name=NAMES.find(x=>!dir.some(d=>d.n===x))||('datei'+nextIno+'.bin');
    const reused=fb.filter(b=>ghost.has(b));fb.forEach(b=>ghost.delete(b));
    ino[nextIno]={links:1,b:fb,c:col%8};col++;dir.push({n:name,i:nextIno});sel=nextIno;nextIno++;
    msg='<code>'+name+'</code> angelegt: neuer Inode, '+n+' Block'+(n>1?'blöcke':'')+' – das Dateisystem nimmt die ersten freien. '+(reused.length?'Dabei wurden freigegebene Blöcke wiederverwendet – die alten Daten dort sind jetzt wirklich überschrieben.':'');draw();
  });
  $('fsGrow').addEventListener('click',()=>{
    const x=ino[sel],last=x.b[x.b.length-1],u=used();
    let b=!u.has(last+1)&&last+1<NB?[last+1]:free(1);
    if(!b.length){msg='Die Platte ist voll.';draw();return;}
    ghost.delete(b[0]);x.b.push(b[0]);
    msg=b[0]===last+1?'Direkt hinter der Datei war Platz – der neue Block schließt nahtlos an.':'Hinter der Datei war kein Platz. Der neue Block <b>'+b[0]+'</b> liegt woanders – die Datei ist jetzt <b>fragmentiert</b>.';draw();
  });
  $('fsLink').addEventListener('click',()=>{
    const orig=dir.find(d=>d.i===sel);const base=orig?orig.n.replace(/(\.[^.]+)?$/,'-link$1'):'link'+sel;
    dir.push({n:base,i:sel});ino[sel].links++;
    msg='Hardlink angelegt: <code>'+base+'</code> zeigt auf denselben Inode '+sel+'. Keine Kopie – derselbe Inhalt, zwei Namen. Der Linkzähler steht jetzt auf '+ino[sel].links+'.';draw();
  });
  $('fsDel').addEventListener('click',()=>{
    const k=dir.map(d=>d.i).lastIndexOf(sel);if(k<0){msg='Für diesen Inode gibt es keinen Namen mehr.';draw();return;}
    const name=dir[k].n;dir.splice(k,1);const x=ino[sel];x.links--;
    if(x.links>0){msg='Name <code>'+name+'</code> entfernt. Der Inode hat aber noch '+x.links+' weiteren Namen – die Datei existiert weiter, kein Byte wurde freigegeben.';}
    else{x.b.forEach(b=>ghost.add(b));delete ino[sel];msg='<code>'+name+'</code> gelöscht: Name weg, Linkzähler 0, Inode und Blöcke freigegeben. <b>Aber:</b> Die schraffierten Blöcke enthalten immer noch die alten Daten. Bis sie neu beschrieben werden, könnte ein Wiederherstellungsprogramm sie finden.';sel=null;}
    draw();
  });
  $('fsReset').addEventListener('click',reset);
  reset();
})();

// ---------- Stromausfall ----------
(function(){
  const $=id=>document.getElementById(id);
  const M={
    raw:{steps:['Datenblock 21 schreiben','Inode aktualisieren: Größe +1, Verweis auf Block 21','Bitmap aktualisieren: Block 21 belegt'],
      out:[
        ['good','Nichts passiert – außer dass die Änderung fehlt.','Der Strom fiel vor dem ersten Schreiben aus. Die Datei ist im alten Zustand, alles ist in sich stimmig.'],
        ['warn','Daten auf der Platte, aber niemand weiß davon.','Block 21 ist beschrieben, aber weder Inode noch Bitmap kennen ihn. Die Änderung ist verloren, das Dateisystem aber stimmig – der Block gilt einfach als frei.'],
        ['bad','Widerspruch: Der Inode zeigt auf einen „freien“ Block.','Die Datei verweist auf Block 21, laut Bitmap ist er frei. Beim nächsten Anlegen einer Datei wird er womöglich doppelt vergeben – zwei Dateien überschreiben sich gegenseitig. Nur ein vollständiger Prüflauf mit fsck findet das.'],
        ['good','Alles geschrieben.','Alle drei Schritte sind durch. Aber das war Glück: Ein Absturz einen Moment früher hätte das Dateisystem beschädigt.']]},
    jour:{steps:['Ins Journal: „Block 21 = …, Inode = …, Bitmap = …“','Ins Journal: Abschluss-Eintrag – die Transaktion ist versiegelt','Änderungen an ihre echten Stellen schreiben'],
      out:[
        ['good','Alter Zustand, alles stimmig.','Nichts geschrieben, nichts zu tun.'],
        ['good','Alter Zustand, alles stimmig.','Im Journal steht eine Transaktion ohne Abschluss-Eintrag. Beim Neustart wird sie verworfen. Die Änderung ist verloren – aber das Dateisystem ist heil, ohne Prüflauf.'],
        ['good','Neuer Zustand – durch Wiederholen.','Die Transaktion ist versiegelt, aber vielleicht nicht vollständig an ihren Stellen angekommen. Beim Neustart liest das System das Journal und schreibt alles noch einmal. Das ist gefahrlos, weil dieselben Werte erneut geschrieben werden.'],
        ['good','Neuer Zustand.','Alles durch. Der Journal-Eintrag kann freigegeben werden.']]},
    cow:{steps:['Neuen Datenblock 21 an freie Stelle schreiben','Neue Kopie des Inodes an freie Stelle schreiben – der alte bleibt unberührt','Oberen Zeiger umhängen: ein einziger, atomarer Schreibvorgang'],
      out:[
        ['good','Alter Zustand, alles stimmig.','Nichts geschrieben.'],
        ['good','Alter Zustand, alles stimmig.','Der neue Block liegt herum, aber nichts verweist auf ihn – er gilt automatisch als frei. Der alte Baum ist unverändert.'],
        ['good','Alter Zustand, alles stimmig.','Neuer Block und neuer Inode existieren, aber der oberste Zeiger zeigt noch auf die alte Version. Für das System ist nichts passiert.'],
        ['good','Neuer Zustand.','Der Zeiger ist umgehängt – in einem Schritt, der entweder ganz oder gar nicht passiert. Die alte Version liegt noch da und könnte als Snapshot aufbewahrt werden.']]}
  };
  let m='raw';
  function draw(){
    const at=+$('crAt').value,d=M[m];
    $('crAtO').textContent=at===0?'sofort':at===3?'keinem – alles läuft':'Schritt '+at;
    let h='';
    d.steps.forEach((s,i)=>{if(i===at)h+='<li class="crash">⚡ Stromausfall</li>';
      h+='<li class="'+(i<at?'done':'lost')+'"><span>'+s+'</span><span class="tag">'+(i<at?'geschrieben':'nicht passiert')+'</span></li>';});
    $('crSteps').innerHTML=h;
    const o=d.out[at];$('crOut').className='outcome '+o[0];$('crOut').innerHTML='<b>'+o[1]+'</b>'+o[2];
  }
  const bs=[...document.querySelectorAll('#crMode button')];
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');m=b.dataset.m;draw();}));
  $('crAt').addEventListener('input',draw);draw();
})();
