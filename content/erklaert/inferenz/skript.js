(function(){
  const $ = id => document.getElementById(id);
  const de = (v,d=0) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  /* ---------- Streaming ---------- */
  const TXT = "Ein Sprachmodell erzeugt seine Antwort Token für Token. Zuerst wird die gesamte Eingabe auf einmal gelesen – das ist die Wartezeit, bevor sich etwas tut. Danach entsteht jedes weitere Wortstück in einem eigenen Durchgang durch das ganze Netz. Wie schnell das geht, hängt vor allem davon ab, wie schnell die Gewichte aus dem Speicher gelesen werden können.";
  const toks = TXT.match(/\s*[^\s]{1,5}/g);   // grobe Zerlegung in tokenartige Stücke
  let timer = null, run = 0;
  function lbl(){ $("ttftO").textContent = de(+$("ttft").value,1) + " s"; $("tpsO").textContent = $("tps").value + "/s"; }
  $("ttft").addEventListener("input", lbl); $("tps").addEventListener("input", lbl); lbl();
  $("stream").innerHTML = '<span class="wait">Drück „Antwort abspielen“.</span>';
  $("go").addEventListener("click", () => {
    clearTimeout(timer); const my = ++run;
    const ttft = +$("ttft").value * 1000, tps = +$("tps").value, t0 = performance.now();
    $("stream").innerHTML = '<span class="wait">… Prefill läuft …</span>';
    $("sinfo").innerHTML = "";
    timer = setTimeout(() => {
      let i = 0; const t1 = performance.now();
      const step = () => {
        if (my !== run) return;
        const should = Math.floor((performance.now() - t1) / 1000 * tps);
        i = Math.min(toks.length, Math.max(i, should));
        $("stream").innerHTML = toks.slice(0, i).join("") + (i < toks.length ? '<span class="cur"></span>' : "");
        if (i < toks.length) requestAnimationFrame(step);
        else $("sinfo").innerHTML = `<span>Wartezeit: <b>${de(ttft/1000,1)} s</b></span><span>${toks.length} Tokens geschrieben in <b>${de((performance.now()-t1)/1000,1)} s</b></span><span>gesamt: <b>${de((performance.now()-t0)/1000,1)} s</b></span>`;
      };
      step();
    }, ttft);
  });

  /* ---------- Rechner ---------- */
  const HW = [
    ["Laptop, normaler Arbeitsspeicher", 90, 32],
    ["Mac mit großem Chip", 500, 128],
    ["Gaming-Grafikkarte", 1000, 24],
    ["Rechenzentrums-GPU", 3350, 80],
    ["8 Rechenzentrums-GPUs", 26800, 640]
  ];
  $("cH").innerHTML = HW.map((h,i) => `<option value="${i}" ${i===2?'selected':''}>${h[0]}</option>`).join("");
  function calc(){
    const P = +$("cP").value, B = +$("cB").value, h = HW[+$("cH").value];
    const gb = P * B;
    $("cPo").textContent = P + " Mrd."; $("cBo").textContent = (B*8) + " Bit"; $("cHo").textContent = "≈ " + de(h[1]) + " GB/s";
    $("oSize").textContent = (gb < 10 ? de(gb,1) : de(gb)) + " GB";
    const tps = h[1] / gb;
    $("oTps").textContent = tps >= 10 ? de(tps) : de(tps,1);
    $("oMem").textContent = h[2] + " GB";
    const f = $("oFit");
    if (gb * 1.15 <= h[2]){ f.className = "fit ok"; f.textContent = "Passt in den Speicher (mit etwas Reserve für den KV-Cache)."; }
    else { f.className = "fit no"; f.textContent = "Passt nicht in den Speicher – dann muss ausgelagert werden, und es wird drastisch langsamer oder läuft gar nicht."; }
  }
  ["cP","cB","cH"].forEach(id => $(id).addEventListener("input", calc)); calc();
})();
