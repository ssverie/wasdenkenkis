(function(){
  const $ = id => document.getElementById(id);
  /* ---------- Heider-Simmel ---------- */
  const svg = $("hsSvg");
  // Keyframes: [t (s), x, y]
  const BIG = [[0,250,140],[2,250,140],[3,215,150],[4.5,190,140],[6,170,135],[7.5,150,120],[9,120,90],[10.5,90,110],[12,140,150],[13.5,200,135]];
  const SMALL = [[0,330,60],[2,290,105],[3,270,120],[4.5,300,90],[6,340,70],[7.5,360,150],[9,330,210],[10.5,250,230],[12,120,240],[13.5,40,240]];
  const CIRC = [[0,170,140],[2,170,140],[3,160,120],[4.5,145,160],[6,180,170],[7.5,232,150],[9,300,190],[10.5,262,225],[12,140,232],[13.5,60,222]];
  const DOOR = [[0,0],[2,0],[2.8,1],[3.6,0],[7,0],[7.4,1],[8.2,1],[8.8,0],[13.5,0]];
  function at(K, t){ if (t <= K[0][0]) return K[0].slice(1); for (let i=1;i<K.length;i++){ if (t <= K[i][0]){ const a = K[i-1], b = K[i], f = (t-a[0])/(b[0]-a[0]), e = f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2; return a.slice(1).map((v,j)=>v+(b[j+1]-v)*e); } } return K[K.length-1].slice(1); }
  const tri = (x,y,s,rot) => { const p = [[0,-s],[s*.87,s*.5],[-s*.87,s*.5]].map(([a,b]) => [x + a*Math.cos(rot) - b*Math.sin(rot), y + a*Math.sin(rot) + b*Math.cos(rot)]); return p.map(q=>q.join(",")).join(" "); };
  let last = {big:[250,140], small:[330,60]};
  function frame(t){
    const b = at(BIG,t), s = at(SMALL,t), c = at(CIRC,t), d = at(DOOR,t)[0];
    const rb = Math.atan2(b[1]-last.big[1], b[0]-last.big[0]) + Math.PI/2, rs = Math.atan2(s[1]-last.small[1], s[0]-last.small[0]) + Math.PI/2;
    last = {big:b, small:s};
    const shake = t > 12.2 ? Math.sin(t*40)*2 : 0;
    svg.innerHTML = `
      <rect x="${110+shake}" y="70" width="130" height="120" fill="none" style="stroke:var(--fg)" stroke-width="3"/>
      <line x1="${240+shake}" y1="${110}" x2="${240+shake + d*30}" y2="${110 - d*22}" style="stroke:var(--bg)" stroke-width="5"/>
      <line x1="${240+shake}" y1="110" x2="${240+shake + d*30}" y2="${110 - d*22}" style="stroke:var(--fg)" stroke-width="3" opacity="${d>0.05?1:0}"/>
      <line x1="${240+shake}" y1="110" x2="${240+shake}" y2="150" style="stroke:var(--bg)" stroke-width="5" opacity="${d>0.05?1:0}"/>
      <polygon points="${tri(b[0],b[1],22,isFinite(rb)?rb:0)}" style="fill:var(--accent)"/>
      <polygon points="${tri(s[0],s[1],13,isFinite(rs)?rs:0)}" style="fill:var(--accent-2)"/>
      <circle cx="${c[0]}" cy="${c[1]}" r="9" style="fill:var(--ok)"/>`;
  }
  frame(0);
  let raf = null;
  $("hsPlay").addEventListener("click", () => {
    cancelAnimationFrame(raf); const t0 = performance.now(); last = {big:[250,140], small:[330,60]};
    const loop = now => { const t = (now - t0)/1000; frame(Math.min(t, 13.5)); if (t < 13.5) raf = requestAnimationFrame(loop); else showQ(); };
    raf = requestAnimationFrame(loop);
  });
  const OPTS = ["Ein großer Rüpel bedroht zwei Kleinere, die fliehen.","Zwei Freunde entkommen gemeinsam einem Angreifer.","Ein Haus wird gegen Eindringlinge verteidigt.","Drei geometrische Formen bewegen sich um ein Rechteck."];
  function showQ(){
    $("hsQ").innerHTML = '<div class="fine" style="margin:0 0 4px">Was hast du gesehen?</div>' + OPTS.map((o,i) => `<button type="button" data-i="${i}">${o}</button>`).join("");
    $("hsQ").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      const geo = +b.dataset.i === 3, o = $("hsOut"); o.style.display = "block";
      o.innerHTML = geo
        ? "<strong>Du gehörst zur seltenen Minderheit.</strong> Genau das war zu sehen: drei Formen und ein Rechteck. Im Original beschrieben fast alle Versuchspersonen stattdessen eine Geschichte. Hand aufs Herz – hast du nicht trotzdem einen „Rüpel“ gesehen?"
        : "<strong>Zu sehen waren nur drei Formen, die sich bewegen.</strong> Rüpel, Freunde, Angst, Flucht – das alles hast du hinzugefügt. Genau so reagierten fast alle Versuchspersonen im Original von 1944.";
    }));
  }
  $("hsQ").innerHTML = '<div class="fine" style="margin:0">Die Frage erscheint nach dem Film.</div>';

  /* ---------- ELIZA ---------- */
  const RULES = [
    [/\bich bin (.+)/i, ["Wie lange bist du schon $1?","Warum glaubst du, dass du $1 bist?"]],
    [/\bich fühle mich (.+)/i, ["Erzähl mir mehr darüber, dass du dich $1 fühlst.","Wie oft fühlst du dich $1?"]],
    [/\bich (will|möchte) (.+)/i, ["Was würde es dir bedeuten, $2?","Was hält dich davon ab?"]],
    [/\b(mutter|vater|eltern|bruder|schwester|familie)\b/i, ["Erzähl mir mehr über deine Familie.","Welche Rolle spielt deine Familie dabei?"]],
    [/\bweil\b/i, ["Ist das der wahre Grund?","Gibt es noch andere Gründe?"]],
    [/\b(computer|maschine|ki|programm)\b/i, ["Machen dir Maschinen Sorgen?","Warum erwähnst du Computer?"]],
    [/\bdu bist (.+)/i, ["Warum denkst du, dass ich $1 bin?"]],
    [/\b(nein|nie)\b/i, ["Warum so entschieden?"]],
    [/.*/, ["Bitte sprich weiter.","Wie fühlst du dich dabei?","Verstehe. Erzähl mehr.","Was meinst du damit genau?"]]
  ];
  const SWAP = {mein:"dein",meine:"deine",meinen:"deinen",meinem:"deinem",mir:"dir",mich:"dich"};
  const sw = s => s.split(/[,.!?;]| weil | und | aber /)[0].trim().split(/\s+/).map(w => SWAP[w.toLowerCase()] || w).join(" ");
  const log = $("eLog");
  const say = (t, who) => { const d = document.createElement("div"); d.className = "m " + who; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; };
  say("Hallo. Ich bin ELIZA. Was beschäftigt dich?", "e");
  $("eForm").addEventListener("submit", e => {
    e.preventDefault(); const t = $("eIn").value.trim(); if (!t) return;
    say(t, "u"); $("eIn").value = "";
    for (const [re, outs] of RULES){ const m = t.match(re); if (m){ let o = outs[Math.floor(Math.random()*outs.length)]; o = o.replace(/\$(\d)/g, (_,n) => sw(m[+n]||"")); setTimeout(() => say(o, "e"), 450); break; } }
  });
  $("eCode").textContent = RULES.map(([re,outs]) => `${String(re).padEnd(52)} → ${outs[0]}`).join("\n");
  $("eRules").addEventListener("click", () => { const b = $("eBox"); b.style.display = b.style.display === "block" ? "none" : "block"; });
})();
