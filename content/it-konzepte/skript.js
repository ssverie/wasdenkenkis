(function(){
  const P={
    alle:{s:null,n:''},
    java:{s:['programmierparadigmen','komplexitaet','datenstrukturen','compiler-jit','garbage-collection','prozess-thread','speicherhierarchie','testen','build-cicd'],n:'Neun Einträge rund um das, was man als Java-Entwickler täglich braucht – von Collections bis zur Pipeline.'},
    web:{s:['tcp-ip','dns','http','tls','authentifizierung','datenformate','api-stile','kryptografie'],n:'Was passiert zwischen Browser und Server: vom Paket über die Namensauflösung bis zur Anmeldung.'},
    haube:{s:['was-ist-ein-computer','betriebssystem','speicherhierarchie','prozess-thread','dateisystem','virtualisierung-container','compiler-jit','garbage-collection'],n:'Wie ein Rechner arbeitet – vom Transistor über den Kernel bis zur JVM.'},
    arch:{s:['verteilte-systeme','api-stile','messaging','microservices','cloud','observability','relationale-datenbanken','nosql-cap'],n:'Vom einzelnen Server zum verteilten System: wie Dienste reden, wo man schneidet, wo sie laufen und wie man sieht, was sie tun.'},
    theorie:{s:['komplexitaet','formale-sprachen','turingmaschine','universalitaet','berechenbarkeit','intraktabilitaet'],n:'Was Rechner grundsätzlich können und was nicht: von der O-Notation über Automaten und Turingmaschine bis zum Halteproblem und P gegen NP.'},
    hardware:{s:['was-ist-ein-computer','zahlendarstellung','boolesche-logik','schaltnetze','schaltwerke','maschinensprache','cpu','speicherhierarchie'],n:'Von unten nach oben: Bits, Gatter, Addierer, Flipflops, Maschinenbefehle – bis zur CPU und ihrem Speicher.'}
  };
  const bs=[...document.querySelectorAll('#paths button')],qs=[...document.querySelectorAll('.q[data-s]')];
  function show(k){const p=P[k];
    qs.forEach(q=>{const i=p.s?p.s.indexOf(q.dataset.s):-1;q.classList.toggle('hl',i>=0);q.classList.toggle('dim',!!p.s&&i<0);const st=q.querySelector('.step');if(st)st.textContent=i>=0?'Schritt '+(i+1):'';});
    document.querySelectorAll('.q.soon').forEach(q=>q.classList.toggle('dim',!!p.s));
    document.getElementById('pathNote').textContent=p.n;}
  bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');show(b.dataset.p);}));
  show('alle');
})();
