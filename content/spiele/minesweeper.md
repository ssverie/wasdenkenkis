+++
title = "Minesweeper"
description = "Minen finden, ohne auf eine zu treten – in den drei klassischen Größen, im Look des alten Windows."
date = 2026-10-24T00:01:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
+++

{{< spiel src="/apps/minesweeper.html" titel="Minesweeper" >}}

**So geht's:** Feld anklicken, um es aufzudecken; die Zahl sagt, wie viele Minen in den acht Nachbarfeldern liegen. Rechtsklick setzt eine Fahne. Ist eine Zahl mit genau so vielen Fahnen umgeben, deckt ein Klick auf die Zahl die übrigen Nachbarn auf. Auf dem Handy den „Fahnen-Modus“ einschalten, dann setzt Antippen eine Fahne. Der Smiley startet neu.

{{< anmerkung >}}
Eine einzelne HTML-Datei, ohne Bibliotheken und ohne Verbindung nach außen. Die drei Stufen entsprechen dem Windows-Original: 9 × 9 mit 10 Minen, 16 × 16 mit 40 und 30 × 16 mit 99. Die Minen werden erst nach dem ersten Klick verteilt, und zwar so, dass dieses Feld und seine Nachbarn frei bleiben – der Anfang ist also immer sicher. Die Bestzeit je Größe merkt sich das Spiel im Browser des Spielers.

Angepasst habe ich nur die Technik: Die Felder werden auf schmalen Bildschirmen kleiner, das große Experten-Feld lässt sich seitlich schieben, auf dem Handy beginnt das Spiel mit der Anfänger-Stufe, und der Fahnen-Modus ersetzt den fehlenden Rechtsklick.
{{< /anmerkung >}}
