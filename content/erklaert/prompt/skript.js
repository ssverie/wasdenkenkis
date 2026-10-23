(function(){
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const PARTS = [
    "Erkläre Dependency Injection.",
    "Ich bin Java-Entwickler mit viel Erfahrung, kenne Spring aber kaum.",
    "Ich will entscheiden, ob wir sie in unserem Altprojekt (Java 8, kein Framework) einführen.",
    "Antworte in höchstens 5 Stichpunkten, dann eine Empfehlung in einem Satz.",
    "So sieht eine typische Klasse bei uns aus:\n<code>\npublic class BestellService {\n  private final DatenbankService db = new DatenbankService();\n  private final MailService mail = new MailService();\n  …\n}\n</code>"
  ];
  const LABELS = ["1 · nur Frage","2 · + Kontext","3 · + Ziel","4 · + Format","5 · + Material"];
  const ANS = [
    "Dependency Injection (DI) ist ein Entwurfsmuster der Softwaretechnik, bei dem Abhängigkeiten eines Objekts von außen bereitgestellt werden. Es ist eine Form der Inversion of Control (IoC). Es gibt drei Arten: Konstruktor-Injektion, Setter-Injektion und Interface-Injektion. DI wird in vielen Frameworks wie Spring, Angular oder .NET verwendet. Die Vorteile sind lose Kopplung, bessere Testbarkeit …\n(noch 30 Zeilen Lehrbuch)",
    "Kurz gesagt: Eine Klasse erzeugt ihre Abhängigkeiten nicht selbst mit new, sondern bekommt sie – meist über den Konstruktor. Das kennst du vermutlich schon als „Konstruktor-Parameter statt new im Feld“. Spring automatisiert nur das Zusammenstecken: Es erzeugt die Objekte und reicht sie weiter …\n(noch 15 Zeilen)",
    "Für ein Java-8-Projekt ohne Framework brauchst du kein Spring. DI geht auch „von Hand“: Abhängigkeiten in den Konstruktor, zusammengesteckt in einer einzigen Startklasse. Lohnt sich vor allem, wenn ihr Unit-Tests schreiben wollt, denn dann lassen sich Datenbank und Mail durch Attrappen ersetzen. Aufwand: schrittweise möglich, Klasse für Klasse …\n(noch 10 Zeilen)",
    "• DI heißt: Abhängigkeiten per Konstruktor hineingeben statt mit new erzeugen.\n• Geht ohne Framework – eine Startklasse steckt alles zusammen.\n• Hauptgewinn: Testbarkeit, Klassen lassen sich isoliert prüfen.\n• Schrittweise einführbar, Klasse für Klasse.\n• Framework (z. B. Guice, Spring) erst ab vielen Klassen sinnvoll.\n\nEmpfehlung: Mit manueller Konstruktor-Injektion in neuen und oft geänderten Klassen anfangen.",
    "• BestellService erzeugt DatenbankService und MailService selbst – deshalb nicht testbar ohne echte DB und Mailserver.\n• Umbau: beide Felder als Konstruktor-Parameter:\n  <code>public BestellService(DatenbankService db, MailService mail)</code>\n• Aufrufer ändern sich: einmal in der Startklasse zusammenstecken.\n• Im Test: Attrappen übergeben, etwa mit Mockito.\n• Kein Framework nötig, läuft mit Java 8.\n\nEmpfehlung: Mit BestellService anfangen – gleich in der nächsten Änderung."
  ];
  const GAIN = ["","Lehrbuchwissen fällt weg, die Erklärung knüpft an Vorhandenes an.","Die Antwort zielt auf die eigentliche Entscheidung – und auf eure Situation.","Knapp, strukturiert, mit klarer Empfehlung.","Jetzt bezieht sich alles auf euren Code – mit konkretem Umbau."];
  let li = 0;
  LABELS.forEach((l,i) => { const b = document.createElement("button"); b.type="button"; b.textContent = l; b.addEventListener("click",()=>{li=i;draw();}); $("lvl").appendChild(b); });
  function draw(){
    [...$("lvl").children].forEach((b,i)=>b.setAttribute("aria-pressed",String(i===li)));
    $("pt").innerHTML = PARTS.slice(0, li+1).map((p,i) => i === li && li > 0 ? `<mark>${esc(p)}</mark>` : esc(p)).join("\n\n");
    $("at").innerHTML = esc(ANS[li]).replace(/&lt;code>(.*?)&lt;\/code>/g, "<code>$1</code>");
    $("gain").textContent = GAIN[li];
  }
  draw();
})();
