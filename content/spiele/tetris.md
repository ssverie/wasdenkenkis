+++
title = "Tetris"
description = "Der Klassiker mit fallenden Steinen – mit Vorschau auf den nächsten Stein und Geisterbild der Landeposition."
date = 2026-10-24T00:03:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
+++

{{< spiel src="/apps/tetris.html" titel="Tetris" >}}

**So geht's:** „Start“ drücken. Am Rechner mit den Pfeiltasten: links und rechts bewegen, hoch dreht, runter beschleunigt, die Leertaste lässt den Stein sofort fallen, P pausiert. Auf dem Handy erscheinen unter dem Spielfeld Tasten zum Antippen; Halten wiederholt die Bewegung.

{{< anmerkung >}}
Eine einzelne HTML-Datei mit gut 200 Zeilen JavaScript, ohne Bibliotheken und ohne Verbindung nach außen. Alle sieben Steine, Punkte nach dem bekannten Nintendo-Schema (40, 100, 300 und 1200 für eine bis vier Reihen, multipliziert mit dem Level), alle zehn Reihen ein Level schneller. Steine, die an der Wand gedreht werden, rücken notfalls ein Stück zur Seite. Was moderne Fassungen haben, fehlt hier: Steine zurücklegen („Hold“) und die gerechte Verteilung, bei der jeder Stein einmal pro Siebenerrunde kommt – hier entscheidet reiner Zufall.

Angepasst habe ich nur die Technik: Das Spielfeld schrumpft auf schmalen Bildschirmen, auf Touch-Geräten gibt es Tasten zum Antippen, und die Leertaste löst nicht mehr versehentlich den Pause-Knopf aus.
{{< /anmerkung >}}
