(function(){
  const $ = id => document.getElementById(id);
  const de = (v,d=0) => v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  const HW = [["Laptop 16 GB",16],["Laptop 32 GB",32],["Grafikkarte 24 GB",24],["Mac 64 GB",64],["Mac 128 GB",128],["Server 8× 80 GB",640]];
  const BITS = [["16 Bit",2],["8 Bit",1],["4 Bit",.5]];
  const M = [["1 Mrd.",1,"winzig"],["3 Mrd.",3,"klein"],["8 Mrd.",8,"klein"],["14 Mrd.",14,"mittel"],["32 Mrd.",32,"mittel"],["70 Mrd.",70,"groß"],["120 Mrd.",120,"groß"],["400 Mrd.",400,"sehr groß"],["670 Mrd.",670,"sehr groß"]];
  let hi = 1, bi = 2;
  function seg(el, items, get, set){
    el.innerHTML = ""; items.forEach(([l],i) => { const b = document.createElement("button"); b.type="button"; b.textContent = l;
      b.addEventListener("click", () => { set(i); draw(); }); el.appendChild(b); });
  }
  seg($("hw"), HW, () => hi, i => hi = i); seg($("bits"), BITS, () => bi, i => bi = i);
  function draw(){
    [...$("hw").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===hi)));
    [...$("bits").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===bi)));
    const mem = HW[hi][1], usable = mem * .75, B = BITS[bi][1], scale = Math.max(usable * 1.6, 20);
    $("models").innerHTML = M.map(([l,p,k]) => {
      const gb = p * B, cls = gb <= usable * .8 ? "ok" : gb <= usable ? "tight" : "no";
      const txt = cls === "ok" ? "passt" : cls === "tight" ? "knapp" : "zu groß";
      return `<div class="mrow ${cls}"><div class="lbl">${l}<small>${k} · ${gb < 10 ? de(gb,1) : de(gb)} GB</small></div>
        <div class="tr"><div class="fl" style="width:${Math.min(100, gb/scale*100)}%"></div><div class="lim" style="left:${usable/scale*100}%"></div></div>
        <div class="st">${txt}</div></div>`;
    }).join("");
  }
  draw();
})();
