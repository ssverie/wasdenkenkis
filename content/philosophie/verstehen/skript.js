(function(){
  const $ = id => document.getElementById(id);
  const R = [
    ["你好吗？","我很好，谢谢。","Wie geht es dir?","Mir geht es gut, danke."],
    ["你叫什么名字？","我叫小房。","Wie heißt du?","Ich heiße „Kleines Zimmer“."],
    ["今天天气怎么样？","今天天气很好。","Wie ist heute das Wetter?","Heute ist das Wetter schön."],
    ["你会说中文吗？","会，说得很好。","Sprichst du Chinesisch?","Ja, sehr gut."]
  ];
  const ROUNDS = [0,2,3];
  let r = 0, done = [];
  const shuffle = a => a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
  const order = shuffle([0,1,2,3]);
  $("rules").innerHTML = order.map(i => `<div class="rule"><span class="z">${R[i][0]}</span><span class="ar">→</span><span class="z">${R[i][1]}</span></div>`).join("");
  function draw(){
    if (r >= ROUNDS.length){
      $("slot").textContent = "—";
      $("pick").innerHTML = "";
      $("outside").innerHTML = "<strong>Draußen vor der Tür:</strong> „Erstaunlich – im Zimmer sitzt jemand, der fließend Chinesisch spricht! Er hat sogar bestätigt, dass er es sehr gut kann.“";
      $("reveal").innerHTML = `<div class="tbl-wrap" style="margin:10px 0 0"><table class="revtbl"><tbody>${ROUNDS.map(i => `<tr><td>${R[i][0]}<br><span style="font-size:.8rem;color:var(--muted)">${R[i][2]}</span></td><td>${R[i][1]}<br><span style="font-size:.8rem;color:var(--muted)">${R[i][3]}</span></td></tr>`).join("")}</tbody></table></div>
        <p class="fine">So sah das Gespräch aus. Du hast auf „Sprichst du Chinesisch?“ mit „Ja, sehr gut“ geantwortet – ohne die Frage oder deine Antwort zu verstehen. Genau darum ging es Searle.</p>`;
      return;
    }
    const q = ROUNDS[r];
    $("slot").textContent = R[q][0];
    $("reveal").innerHTML = "";
    $("outside").innerHTML = r === 0 ? "Ein Zettel ist hereingekommen. Du verstehst die Zeichen nicht – aber du hast das Regelbuch." : "Draußen wartet man gespannt auf die nächste Antwort …";
    const opts = shuffle([0,1,2,3]);
    $("pick").innerHTML = opts.map(i => `<button type="button" data-i="${i}">${R[i][1]}</button>`).join("");
    $("pick").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      const ok = +b.dataset.i === q;
      b.classList.add(ok ? "right" : "wrong");
      if (ok){ $("outside").innerHTML = "Du schiebst den Zettel durch den Schlitz. Draußen nickt jemand zufrieden."; setTimeout(() => { r++; draw(); }, 900); }
      else { $("outside").innerHTML = "Laut Regelbuch passt das nicht. Vergleiche die Zeichen noch einmal – ihre Form genügt."; }
    }));
  }
  $("zReset").addEventListener("click", () => { r = 0; draw(); });
  draw();
})();
