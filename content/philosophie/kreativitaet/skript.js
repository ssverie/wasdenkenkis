(function(){
  const $ = id => document.getElementById(id);
  const T = ["kombinierend","erkundend","umwälzend"];
  const X = [
    ["Ein Sprachmodell erklärt Aufmerksamkeit in neuronalen Netzen als „unscharfe Map in Java“.", 0, "Zwei bekannte Welten – KI und Java – werden verbunden. Klassische kombinierende Kreativität."],
    ["AlphaGo spielt 2016 einen Go-Zug, den Profis für einen Fehler halten und der sich als genial erweist.", 1, "Innerhalb der festen Go-Regeln wird eine Möglichkeit entdeckt, die Menschen übersehen hatten. Erkundend."],
    ["Marcel Duchamp stellt 1917 ein handelsübliches Urinal als Kunstwerk aus.", 2, "Die Frage „Was ist Kunst?“ wird neu gestellt – die Regeln selbst ändern sich. Umwälzend, und bis heute umstritten."],
    ["Ein Bildgenerator malt „einen Igel als Barockporträt“.", 0, "Zwei Motive – Igel und barocke Malerei – werden zusammengeführt. Kombinierend."],
    ["Eine KI schreibt ein Sonett mit 14 Zeilen und strengem Reimschema über ein neues Thema.", 1, "Ausschöpfen eines festen Formats, ohne es zu verändern. Erkundend – je nach Einfallsreichtum auch kombinierend."]
  ];
  let right = 0, answered = 0;
  $("sort").innerHTML = X.map(([t],i) => `<div class="sort-item" data-i="${i}"><div class="t">${t}</div><div class="b">${T.map((x,j) => `<button type="button" data-j="${j}">${x}</button>`).join("")}</div><div class="fb"></div></div>`).join("");
  $("sort").querySelectorAll(".sort-item").forEach(it => {
    const i = +it.dataset.i;
    it.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      if (it.dataset.done) return; it.dataset.done = 1; answered++;
      const j = +b.dataset.j, ok = j === X[i][1];
      if (ok) right++;
      b.classList.add(ok ? "ok" : "no");
      it.querySelectorAll("button")[X[i][1]].classList.add("ok");
      const fb = it.querySelector(".fb"); fb.style.display = "block"; fb.textContent = X[i][2];
      $("score").textContent = answered === X.length ? `${right} von ${X.length} wie die übliche Einordnung – Abweichungen sind hier oft gut begründbar.` : "";
    }));
  });
})();
