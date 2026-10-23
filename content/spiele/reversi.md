+++
title = "Reversi"
description = "Steine einklemmen und umdrehen, bis das Brett voll ist – zu zweit oder gegen einen Computer, der die Ecken kennt."
date = 2026-10-24T00:00:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
+++

{{< spiel src="/apps/reversi.html" titel="Reversi" >}}

**So geht's:** Schwarz beginnt. Ein Stein muss mindestens einen gegnerischen Stein zwischen sich und einem eigenen einklemmen – waagerecht, senkrecht oder schräg; alle eingeklemmten Steine wechseln die Farbe. Die hellen Punkte zeigen, wo ein Zug möglich ist. Wer nicht ziehen kann, setzt aus. Am Ende gewinnt, wer mehr Steine hat.

{{< anmerkung >}}
Eine einzelne HTML-Datei, ohne Bibliotheken und ohne Verbindung nach außen. Der Computer rechnet vier Halbzüge voraus und bewertet Stellungen nach einer klassischen Feldtabelle: Ecken sind viel wert, die Felder direkt daneben gefährlich, weil sie dem Gegner die Ecke öffnen. Dazu zählt er, wie viele Zugmöglichkeiten jede Seite hat. Sind nur noch zehn Felder frei, rechnet er das Ende vollständig durch – in der Schlussphase ist er deshalb kaum zu schlagen.

Angepasst habe ich nur die Technik: Brett und Steine werden auf schmalen Bildschirmen kleiner, statt über den Rand zu ragen.
{{< /anmerkung >}}
